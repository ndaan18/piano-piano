// Spaced repetition (Leitner boxes) and unit mastery. Pure: no DOM, no storage.
// All dates are local calendar dates as 'YYYY-MM-DD'; day arithmetic is done on
// y/m/d (never milliseconds) so DST changes cannot shift a due date.

export const INTERVALS = [1, 3, 7, 21, 60];
const MAX_BOX = INTERVALS.length;
export const PASS_MARK = 0.8;
const LONGTERM_SHARE = 0.8;

const pad = (n) => String(n).padStart(2, '0');

export function localDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(isoDate, n) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return localDate(new Date(y, m - 1, d + n));
}

// A pass only climbs a box when the card is due (or new): passing a card again
// before its due date (same lesson twice, a mixed session) counts it as seen and
// correct but keeps its box and due date. A fail always demotes.
export function grade(card, pass, now) {
  const today = localDate(now);
  const prev = card || { box: 0, seen: 0, correct: 0, lastWrong: null };
  const next = { ...prev, seen: prev.seen + 1 };
  if (pass && prev.due && prev.due > today) {
    next.correct = prev.correct + 1;
  } else if (pass) {
    next.box = Math.min(prev.box + 1, MAX_BOX);
    next.due = addDays(today, INTERVALS[next.box - 1]);
    next.correct = prev.correct + 1;
  } else {
    next.box = 1;
    next.due = addDays(today, 1);
    next.lastWrong = today;
  }
  return next;
}

export function isDue(card, today) {
  return card.due <= today;
}

// Due card ids that still exist in content, most overdue first, weakest box first.
export function dueIds(cards, today, knownIds, limit = 30) {
  return Object.keys(cards)
    .filter((id) => knownIds.has(id) && isDue(cards[id], today))
    .sort((a, b) => {
      const ca = cards[a], cb = cards[b];
      if (ca.due !== cb.due) return ca.due < cb.due ? -1 : 1;
      return ca.box - cb.box;
    })
    .slice(0, limit);
}

function exerciseIds(unit) {
  const ids = [];
  for (const lesson of unit.lessons || []) {
    for (const ex of lesson.exercises || []) ids.push(ex.id);
  }
  for (const ex of unit.scene?.exercises || []) ids.push(ex.id);
  return ids;
}

// Stages are cumulative: each requires every stage before it.
export function unitStage(unit, progress, cards) {
  if (!progress) return 'new';
  const done = new Set(progress.lessonsDone || []);
  const lessons = unit.lessons || [];
  if (lessons.length === 0 || !lessons.every((l) => done.has(l.id))) return 'new';
  if (!(progress.mixedDone && progress.sceneDone)) return 'learned';
  if (!(progress.checkpointBest >= PASS_MARK)) return 'practised';
  const ids = exerciseIds(unit);
  const mastered = ids.filter((id) => cards[id]?.box === MAX_BOX).length;
  if (ids.length > 0 && mastered / ids.length >= LONGTERM_SHARE) return 'longterm';
  return 'passed';
}

export function isUnlocked(unitIndex, unitsProgress) {
  if (unitIndex === 0) return true;
  return unitsProgress[unitIndex - 1]?.checkpointBest >= PASS_MARK;
}
