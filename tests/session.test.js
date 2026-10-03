import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLessonSession, buildMixedSession, buildCheckpoint, buildReviewSession,
  buildDrill, requeue, CHECKPOINT_SIZE, PASS_MARK, INTERLEAVE,
} from '../js/engine/session.js';
import { PASS_MARK as SRS_PASS_MARK } from '../js/engine/srs.js';

// Deterministic mulberry32 rng.
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TYPES = ['recognise', 'type', 'transform', 'build', 'listen', 'register'];

function lesson(id, n) {
  return {
    id,
    exercises: Array.from({ length: n }, (_, i) => ({
      id: `${id}-e${String(i + 1).padStart(2, '0')}`,
      // Deliberately unsorted rungs so the builder must sort them.
      rung: ((i * 3) % 5) + 1,
      type: TYPES[i % TYPES.length],
    })),
  };
}

const unit12 = { id: 1, lessons: [lesson('u1-l1', 12), lesson('u1-l2', 12)] };
const unit18 = { id: 1, lessons: [lesson('u1-l1', 18), lesson('u1-l2', 18)] };
const prior = (n) => Array.from({ length: n }, (_, i) => `old-${i}`);
const rungOf = (unit) => {
  const map = new Map();
  for (const l of unit.lessons) for (const e of l.exercises) map.set(e.id, e);
  return map;
};
const ids = (cards) => cards.map((c) => c.exerciseId);

test('constants', () => {
  assert.equal(CHECKPOINT_SIZE, 15);
  assert.equal(INTERLEAVE, 0.25);
  assert.equal(PASS_MARK, 0.8);
  assert.equal(PASS_MARK, SRS_PASS_MARK);
});

test('lesson session: 15 lesson + 5 prior, rung-ordered, hints on first half', () => {
  const l = unit18.lessons[0];
  const s = buildLessonSession(l, prior(10), { rng: seeded(1) });
  assert.equal(s.length, 20);
  const lessonIds = new Set(l.exercises.map((e) => e.id));
  const lessonCards = s.filter((c) => lessonIds.has(c.exerciseId));
  const priorCards = s.filter((c) => !lessonIds.has(c.exerciseId));
  assert.equal(lessonCards.length, 15);
  assert.equal(priorCards.length, 5);
  const byId = rungOf(unit18);
  const rungs = lessonCards.map((c) => byId.get(c.exerciseId).rung);
  assert.deepEqual(rungs, [...rungs].sort((a, b) => a - b));
  assert.ok(s.slice(0, 10).every((c) => c.hints === true));
  assert.ok(s.slice(10).every((c) => c.hints === false));
  assert.ok(s.slice(0, 10).every((c) => lessonIds.has(c.exerciseId)), 'prior cards only in second half');
  assert.equal(new Set(ids(s)).size, 20);
});

test('lesson session: same rng gives same session', () => {
  const l = unit18.lessons[0];
  const a = buildLessonSession(l, prior(10), { rng: seeded(7) });
  const b = buildLessonSession(l, prior(10), { rng: seeded(7) });
  assert.deepEqual(a, b);
});

test('lesson session: weak prior ids come first', () => {
  const l = unit18.lessons[0];
  const pool = prior(10);
  const weak = new Set(['old-7', 'old-8', 'old-9']);
  for (let seed = 1; seed <= 20; seed++) {
    const s = buildLessonSession(l, pool, { rng: seeded(seed), weak });
    const got = new Set(ids(s));
    for (const w of weak) assert.ok(got.has(w), `weak ${w} included (seed ${seed})`);
    assert.equal(ids(s).filter((id) => id.startsWith('old-')).length, 5);
  }
});

test('lesson session: weak ids fill the prior share even if more than share', () => {
  const l = unit18.lessons[0];
  const weak = new Set(prior(10).slice(0, 8));
  const s = buildLessonSession(l, prior(10), { rng: seeded(3), weak });
  const picked = ids(s).filter((id) => id.startsWith('old-'));
  assert.equal(picked.length, 5);
  assert.ok(picked.every((id) => weak.has(id)));
});

test('small pools: 6-exercise lesson, empty prior pool -> 6 defined cards', () => {
  const s = buildLessonSession(lesson('tiny', 6), [], { rng: seeded(2) });
  assert.equal(s.length, 6);
  assert.ok(s.every((c) => typeof c.exerciseId === 'string' && c.exerciseId.length > 0));
  assert.equal(new Set(ids(s)).size, 6);
  assert.ok(s.slice(0, 3).every((c) => c.hints === true));
  assert.ok(s.slice(3).every((c) => c.hints === false));
});

test('small pools: big lesson with empty prior pool tops up from the lesson', () => {
  const s = buildLessonSession(lesson('big', 30), [], { rng: seeded(2) });
  assert.equal(s.length, 20);
  assert.equal(new Set(ids(s)).size, 20);
  assert.ok(s.every((c) => c.exerciseId.startsWith('big-')));
});

test('small pools: tiny prior pool is used and the rest topped up from the lesson', () => {
  const s = buildLessonSession(lesson('big', 30), prior(2), { rng: seeded(2) });
  assert.equal(s.length, 20);
  assert.equal(ids(s).filter((id) => id.startsWith('old-')).length, 2);
});

test('small pools: pool of lesson-owned ids or duplicates still yields 20 for a 30-exercise lesson', () => {
  const l = lesson('big', 30);
  const owned = l.exercises.slice(0, 5).map((e) => e.id);
  const a = buildLessonSession(l, owned, { rng: seeded(9) });
  assert.equal(a.length, 20);
  assert.equal(new Set(ids(a)).size, 20);
  const b = buildLessonSession(l, ['o', 'o', 'o', 'o', 'o'], { rng: seeded(9) });
  assert.equal(b.length, 20);
  assert.equal(new Set(ids(b)).size, 20);
  assert.equal(ids(b).filter((id) => id === 'o').length, 1);
});

test('prior share stays capped at 25%: 6-exercise lesson + big pool -> 11', () => {
  const s = buildLessonSession(lesson('tiny', 6), prior(10), { rng: seeded(2) });
  assert.equal(s.length, 11);
  assert.equal(ids(s).filter((id) => id.startsWith('old-')).length, 5);
});

test('small pools: prior ids duplicating lesson ids are not repeated; empty lesson is safe', () => {
  const l = lesson('dup', 6);
  const s = buildLessonSession(l, [l.exercises[0].id, 'old-1'], { rng: seeded(4) });
  assert.equal(new Set(ids(s)).size, s.length);
  assert.ok(s.every((c) => c.exerciseId));
  assert.deepEqual(buildLessonSession({ id: 'empty', exercises: [] }, prior(3)), []);
  assert.deepEqual(buildLessonSession({ id: 'none' }, []), []);
});

test('mixed session: 30 cards, ~25% prior, no hints, spread across lessons', () => {
  const s = buildMixedSession(unit18, prior(20), { rng: seeded(5) });
  assert.equal(s.length, 30);
  assert.ok(s.every((c) => c.hints === false));
  assert.equal(new Set(ids(s)).size, 30);
  const priorN = ids(s).filter((id) => id.startsWith('old-')).length;
  assert.equal(priorN, 7);
  const l1 = ids(s).filter((id) => id.startsWith('u1-l1-')).length;
  const l2 = ids(s).filter((id) => id.startsWith('u1-l2-')).length;
  assert.ok(Math.abs(l1 - l2) <= 1, `even draw (${l1} vs ${l2})`);
});

test('mixed session: prior share falls back to unit cards when pool is empty', () => {
  const s = buildMixedSession(unit18, [], { rng: seeded(5) });
  assert.equal(s.length, 30);
  assert.ok(s.every((c) => c.exerciseId.startsWith('u1-')));
  assert.equal(new Set(ids(s)).size, 30);
});

test('mixed session: small unit, empty pool -> every unit card once, all defined', () => {
  const s = buildMixedSession(unit12, [], { rng: seeded(5) });
  assert.equal(s.length, 24);
  assert.ok(s.every((c) => c.exerciseId));
  assert.deepEqual(buildMixedSession({ id: 9, lessons: [] }, []), []);
});

test('checkpoint: 15 cards, rung >= 2, both lessons represented, no hints', () => {
  const s = buildCheckpoint(unit12, { rng: seeded(6) });
  const byId = rungOf(unit12);
  assert.equal(s.length, 15);
  assert.ok(s.every((c) => byId.get(c.exerciseId).rung >= 2));
  assert.ok(s.every((c) => c.hints === false));
  assert.ok(ids(s).some((id) => id.startsWith('u1-l1-')));
  assert.ok(ids(s).some((id) => id.startsWith('u1-l2-')));
  assert.equal(new Set(ids(s)).size, 15);
});

test('small pools: checkpoint with only 4 rung>=2 exercises -> 4 cards', () => {
  const u = {
    id: 2,
    lessons: [
      { id: 'a', exercises: [{ id: 'a1', rung: 1, type: 'recognise' }, { id: 'a2', rung: 2, type: 'type' }, { id: 'a3', rung: 3, type: 'type' }] },
      { id: 'b', exercises: [{ id: 'b1', rung: 1, type: 'recognise' }, { id: 'b2', rung: 4, type: 'build' }, { id: 'b3', rung: 5, type: 'listen' }] },
    ],
  };
  const s = buildCheckpoint(u, { rng: seeded(1) });
  assert.equal(s.length, 4);
  assert.deepEqual(new Set(ids(s)), new Set(['a2', 'a3', 'b2', 'b3']));
});

test('checkpoint: lessons with unequal eligible counts still fill to 15', () => {
  const u = {
    id: 3,
    lessons: [
      { id: 'a', exercises: [{ id: 'a1', rung: 2, type: 'type' }] },
      lesson('big', 30),
    ],
  };
  const s = buildCheckpoint(u, { rng: seeded(1) });
  assert.equal(s.length, 15);
  assert.ok(ids(s).includes('a1'));
});

test('checkpoint order is shuffled, not lesson by lesson in turn', () => {
  const u = { id: 4, lessons: [lesson('a', 10), lesson('b', 10), lesson('c', 10)] };
  const lessonOf = (id) => u.lessons.find((l) => l.exercises.some((e) => e.id === id)).id;
  const cyclic = (seq) => seq.every((l, i) => i < 3 || l === seq[i - 3]);
  const seqs = [1, 2, 3, 4, 5].map((seed) => ids(buildCheckpoint(u, { rng: seeded(seed) })).map(lessonOf));
  assert.ok(seqs.some((seq) => !cyclic(seq)), 'lessons still come round in a fixed rotation');
  for (const seq of seqs) {
    // still balanced across lessons: 5 cards each
    for (const l of ['a', 'b', 'c']) assert.equal(seq.filter((x) => x === l).length, 5);
  }
});

test('small pools: review with no due cards -> []', () => {
  assert.deepEqual(buildReviewSession([]), []);
});

test('review session: hints off, limit 30 default, custom limit', () => {
  const due = Array.from({ length: 40 }, (_, i) => `c${i}`);
  const s = buildReviewSession(due);
  assert.equal(s.length, 30);
  assert.deepEqual(ids(s), due.slice(0, 30));
  assert.ok(s.every((c) => c.hints === false));
  assert.equal(buildReviewSession(due, { limit: 5 }).length, 5);
});

test('drill: only type and transform exercises, up to size', () => {
  const unit30 = { id: 1, lessons: [lesson('u1-l1', 30), lesson('u1-l2', 30)] };
  const byId = rungOf(unit30);
  const s = buildDrill(unit30, { rng: seeded(8) });
  assert.equal(s.length, 15);
  assert.ok(s.every((c) => ['type', 'transform'].includes(byId.get(c.exerciseId).type)));
  assert.ok(s.every((c) => c.hints === false));
  assert.equal(new Set(ids(s)).size, 15);
});

test('small pools: drill with no type/transform exercises -> []', () => {
  const u = { id: 4, lessons: [{ id: 'x', exercises: [{ id: 'x1', rung: 1, type: 'recognise' }] }] };
  assert.deepEqual(buildDrill(u, { rng: seeded(1) }), []);
});

test('requeue: inserts retry copy at pos+3, original untouched', () => {
  const q = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ exerciseId: id, hints: false }));
  const out = requeue(q, 1);
  assert.deepEqual(ids(out), ['a', 'b', 'c', 'd', 'b', 'e', 'f']);
  assert.equal(out[4].retry, true);
  assert.equal(out[1].retry, undefined);
  assert.equal(q.length, 6);
  assert.equal(q[1].retry, undefined);
});

test('requeue: a retry card is not requeued again', () => {
  const q = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ exerciseId: id, hints: false }));
  const once = requeue(q, 0);
  const retryPos = once.findIndex((c) => c.retry);
  const twice = requeue(once, retryPos);
  assert.equal(twice, once);
  assert.equal(twice.length, once.length);
});

test('requeue: near/at the end appends', () => {
  const q = ['a', 'b', 'c'].map((id) => ({ exerciseId: id, hints: true }));
  const out = requeue(q, 2);
  assert.deepEqual(ids(out), ['a', 'b', 'c', 'c']);
  assert.equal(out[3].retry, true);
  assert.equal(out[3].hints, true);
  assert.deepEqual(ids(requeue(q, 1)), ['a', 'b', 'c', 'b']);
});
