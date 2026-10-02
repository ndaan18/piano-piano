// Session building: which cards go into each practice session, and re-queueing
// a missed card. Pure: no DOM, no storage. Callers pass content objects
// (lessons/units with exercises) and an optional rng for deterministic tests.
//
// SessionCard = { exerciseId: string, hints: boolean, retry?: boolean }

import { PASS_MARK } from './srs.js';

export { PASS_MARK };
export const CHECKPOINT_SIZE = 15;
export const INTERLEAVE = 0.25;
export const REQUEUE_OFFSET = 3;

const LESSON_SIZE = 20;
const MIXED_SIZE = 30;
const DRILL_SIZE = 15;
export const REVIEW_LIMIT = 30;

// Fisher-Yates on a copy.
function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const card = (exerciseId, hints) => ({ exerciseId, hints });

// Draw `count` ids from the prior pool, weak ids first, each group shuffled.
// Ids in `exclude` and duplicates are skipped.
function drawPrior(pool, count, weak, exclude, rng) {
  const seen = new Set(exclude);
  const unique = [];
  for (const id of pool || []) {
    if (id && !seen.has(id)) {
      seen.add(id);
      unique.push(id);
    }
  }
  const weakIds = shuffle(unique.filter((id) => weak.has(id)), rng);
  const rest = shuffle(unique.filter((id) => !weak.has(id)), rng);
  return weakIds.concat(rest).slice(0, count);
}

// Round-robin across lists (each already in the order to draw from) up to `count`.
function roundRobin(lists, count) {
  const out = [];
  for (let i = 0; out.length < count; i++) {
    let any = false;
    for (const list of lists) {
      if (i < list.length) {
        any = true;
        if (out.length < count) out.push(list[i]);
      }
    }
    if (!any) break;
  }
  return out;
}

const lessonExercises = (unit) => (unit.lessons || []).map((l) => l.exercises || []);

// Split a session size into the main share and the interleaved (prior) share.
function split(size) {
  const main = Math.round(size * (1 - INTERLEAVE));
  return { main, prior: size - main };
}

export function buildLessonSession(lesson, priorPool, { rng = Math.random, size = LESSON_SIZE, weak = new Set() } = {}) {
  const exercises = lesson.exercises || [];
  const share = split(size);
  // Prior cards live in the second half, so there can't be more of them than lesson cards.
  // Draw first: duplicates / lesson-owned ids in the pool are dropped, and the
  // lesson then tops up whatever the pool couldn't supply.
  const lessonIds = new Set(exercises.map((e) => e.id));
  const priorIds = drawPrior(priorPool, Math.min(share.prior, exercises.length), weak, lessonIds, rng);
  const lessonCount = Math.min(exercises.length, size - priorIds.length);

  // Pick a random subset, then order by rung (stable, so equal rungs keep random order).
  const chosen = shuffle(exercises, rng)
    .slice(0, lessonCount)
    .sort((a, b) => a.rung - b.rung);

  const total = chosen.length + priorIds.length;
  const half = Math.floor(total / 2);
  const slots = Array.from({ length: total - half }, (_, i) => half + i);
  const priorSlots = new Set(shuffle(slots, rng).slice(0, priorIds.length));

  const out = [];
  let li = 0;
  let pi = 0;
  for (let i = 0; i < total; i++) {
    if (priorSlots.has(i)) out.push(card(priorIds[pi++], i < half));
    else out.push(card(chosen[li++].id, i < half));
  }
  return out;
}

export function buildMixedSession(unit, priorPool, { rng = Math.random, size = MIXED_SIZE, weak = new Set() } = {}) {
  const lists = lessonExercises(unit).map((ex) => shuffle(ex, rng));
  const unitTotal = lists.reduce((n, l) => n + l.length, 0);
  const unitIds = new Set(lists.flat().map((e) => e.id));

  const priorIds = drawPrior(priorPool, split(size).prior, weak, unitIds, rng);
  // If the prior pool is short, its share falls back to unit cards.
  const unitCount = Math.min(unitTotal, size - priorIds.length);
  const unitCards = roundRobin(lists, unitCount).map((e) => e.id);

  return shuffle(unitCards.concat(priorIds), rng).map((id) => card(id, false));
}

export function buildCheckpoint(unit, { rng = Math.random } = {}) {
  const lists = lessonExercises(unit).map((ex) => shuffle(ex.filter((e) => e.rung >= 2), rng));
  return roundRobin(lists, CHECKPOINT_SIZE).map((e) => card(e.id, false));
}

export function buildReviewSession(dueIds, { limit = REVIEW_LIMIT } = {}) {
  return (dueIds || []).slice(0, limit).map((id) => card(id, false));
}

export function buildDrill(unit, { rng = Math.random, size = DRILL_SIZE } = {}) {
  const eligible = lessonExercises(unit)
    .flat()
    .filter((e) => e.type === 'type' || e.type === 'transform');
  return shuffle(eligible, rng).slice(0, size).map((e) => card(e.id, false));
}

// Insert a retry copy of queue[pos] three places later (or at the end), once per card.
export function requeue(queue, pos) {
  const missed = queue[pos];
  if (!missed || missed.retry) return queue;
  const out = queue.slice();
  out.splice(Math.min(pos + REQUEUE_OFFSET, queue.length), 0, { ...missed, retry: true });
  return out;
}
