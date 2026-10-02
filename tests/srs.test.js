import test from 'node:test';
import assert from 'node:assert/strict';
import { INTERVALS, localDate, addDays, grade, isDue, dueIds, unitStage, isUnlocked } from '../js/engine/srs.js';

const NOW = new Date(2026, 9, 2, 10, 0);

test('INTERVALS are 1,3,7,21,60', () => {
  assert.deepEqual(INTERVALS, [1, 3, 7, 21, 60]);
});

test('localDate uses the local calendar date', () => {
  assert.equal(localDate(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
  assert.equal(localDate(new Date(2026, 11, 31, 0, 0)), '2026-12-31');
});

test('addDays crosses month and year boundaries', () => {
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2026-02-27', 3), '2026-03-02');
  assert.equal(addDays('2026-10-02', 0), '2026-10-02');
});

test('new card passed becomes box 1, due tomorrow', () => {
  const c = grade(undefined, true, NOW);
  assert.equal(c.box, 1);
  assert.equal(c.due, '2026-10-03');
  assert.equal(c.seen, 1);
  assert.equal(c.correct, 1);
  assert.equal(c.lastWrong, null);
});

test('pass chain climbs boxes 1-5 with dues +1, +3, +7, +21, +60; box 5 stays', () => {
  let c = undefined;
  const dues = [];
  for (let i = 0; i < 6; i++) { c = grade(c, true, NOW); dues.push([c.box, c.due]); }
  assert.deepEqual(dues, [
    [1, '2026-10-03'], [2, '2026-10-05'], [3, '2026-10-09'],
    [4, '2026-10-23'], [5, '2026-12-01'], [5, '2026-12-01'],
  ]);
  assert.equal(c.seen, 6);
  assert.equal(c.correct, 6);
});

test('fail from box 4 drops to box 1, due tomorrow, lastWrong set', () => {
  const c0 = { box: 4, due: '2026-10-02', seen: 4, correct: 4, lastWrong: null };
  const c = grade(c0, false, NOW);
  assert.equal(c.box, 1);
  assert.equal(c.due, '2026-10-03');
  assert.equal(c.lastWrong, '2026-10-02');
  assert.equal(c.seen, 5);
  assert.equal(c.correct, 4);
});

test('new card failed is box 1 and counts as seen only', () => {
  const c = grade(undefined, false, NOW);
  assert.equal(c.box, 1);
  assert.equal(c.seen, 1);
  assert.equal(c.correct, 0);
});

test('grade does not mutate the input card', () => {
  const c0 = { box: 2, due: '2026-10-02', seen: 2, correct: 2, lastWrong: null };
  const copy = { ...c0 };
  grade(c0, true, NOW);
  assert.deepEqual(c0, copy);
});

test('DST / day boundary: graded 23:59 the day before the EU clock change is due the next calendar day', () => {
  const c = grade(undefined, true, new Date(2026, 9, 24, 23, 59));
  assert.equal(c.due, '2026-10-25');
  assert.equal(addDays('2026-10-24', 1), '2026-10-25');
  assert.equal(addDays('2026-10-25', 1), '2026-10-26');
  assert.equal(addDays('2026-10-24', 7), '2026-10-31');
  assert.equal(addDays('2026-03-28', 1), '2026-03-29');
  assert.equal(addDays('2026-03-29', 1), '2026-03-30');
});

test('isDue compares due <= today', () => {
  const c = { box: 1, due: '2026-10-03', seen: 1, correct: 1, lastWrong: null };
  assert.equal(isDue(c, '2026-10-02'), false);
  assert.equal(isDue(c, '2026-10-03'), true);
  assert.equal(isDue(c, '2026-10-04'), true);
});

const card = (box, due) => ({ box, due, seen: 1, correct: 1, lastWrong: null });

test('dueIds skips stale ids, sorts by due then box, respects limit', () => {
  const cards = {
    a: card(3, '2026-10-01'),
    b: card(1, '2026-10-01'),
    c: card(2, '2026-09-28'),
    d: card(1, '2026-10-05'),   // not due
    gone: card(1, '2026-09-01'), // stale id
  };
  const known = new Set(['a', 'b', 'c', 'd']);
  assert.deepEqual(dueIds(cards, '2026-10-02', known), ['c', 'b', 'a']);
  assert.deepEqual(dueIds(cards, '2026-10-02', known, 2), ['c', 'b']);
  assert.deepEqual(dueIds({}, '2026-10-02', known), []);
});

const unit = {
  id: 1,
  lessons: [
    { id: 'l1', exercises: [{ id: 'e1' }, { id: 'e2' }] },
    { id: 'l2', exercises: [{ id: 'e3' }, { id: 'e4' }, { id: 'e5' }] },
  ],
};
const box5 = (...ids) => Object.fromEntries(ids.map((i) => [i, card(5, '2027-01-01')]));

test('unitStage: new with no progress', () => {
  assert.equal(unitStage(unit, undefined, {}), 'new');
  assert.equal(unitStage(unit, { lessonsDone: [], mixedDone: false, sceneDone: false, checkpointBest: 0 }, {}), 'new');
  assert.equal(unitStage(unit, { lessonsDone: ['l1'], mixedDone: false, sceneDone: false, checkpointBest: 0 }, {}), 'new');
});

test('unitStage: learned, practised, passed, longterm', () => {
  const learned = { lessonsDone: ['l1', 'l2'], mixedDone: false, sceneDone: false, checkpointBest: 0 };
  assert.equal(unitStage(unit, learned, {}), 'learned');
  assert.equal(unitStage(unit, { ...learned, mixedDone: true }, {}), 'learned');
  const practised = { ...learned, mixedDone: true, sceneDone: true };
  assert.equal(unitStage(unit, practised, {}), 'practised');
  assert.equal(unitStage(unit, { ...practised, checkpointBest: 0.79 }, {}), 'practised');
  const passed = { ...practised, checkpointBest: 0.8 };
  assert.equal(unitStage(unit, passed, {}), 'passed');
  assert.equal(unitStage(unit, passed, box5('e1', 'e2', 'e3')), 'passed'); // 3/5 < 80%
  assert.equal(unitStage(unit, passed, box5('e1', 'e2', 'e3', 'e4')), 'longterm'); // 4/5
});

test('unitStage is cumulative: long-term cards without the earlier stages do not skip ahead', () => {
  const all = box5('e1', 'e2', 'e3', 'e4', 'e5');
  assert.equal(unitStage(unit, undefined, all), 'new');
  assert.equal(unitStage(unit, { lessonsDone: ['l1', 'l2'], mixedDone: true, sceneDone: true, checkpointBest: 0.5 }, all), 'practised');
  assert.equal(unitStage(unit, { lessonsDone: ['l1'], mixedDone: true, sceneDone: true, checkpointBest: 1 }, all), 'new');
});

test('unitStage ignores stale card ids and tolerates missing cards', () => {
  const passed = { lessonsDone: ['l1', 'l2'], mixedDone: true, sceneDone: true, checkpointBest: 1 };
  const stale = { ...box5('e1', 'e2', 'e3'), gone1: card(5, 'x'), gone2: card(5, 'x'), gone3: card(5, 'x') };
  assert.equal(unitStage(unit, passed, stale), 'passed');
  assert.equal(unitStage(unit, { ...passed, lessonsDone: ['l1', 'l2', 'removed-lesson'] }, {}), 'passed');
});

test('unitStage: a unit with no exercises never reaches longterm', () => {
  const empty = { id: 9, lessons: [{ id: 'x', exercises: [] }] };
  const p = { lessonsDone: ['x'], mixedDone: true, sceneDone: true, checkpointBest: 1 };
  assert.equal(unitStage(empty, p, {}), 'passed');
});

test('isUnlocked', () => {
  assert.equal(isUnlocked(0, {}), true);
  assert.equal(isUnlocked(3, { 2: { checkpointBest: 0.8 } }), true);
  assert.equal(isUnlocked(3, { 2: { checkpointBest: 0.79 } }), false);
  assert.equal(isUnlocked(3, {}), false);
});
