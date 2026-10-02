import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreResults } from '../js/ui/practice-card.js';
import { stepOpen } from '../js/pages/unit.js';
import { checkpointResult } from '../js/pages/checkpoint.js';
import { formatDay, nextDueDate, reviewCountText } from '../js/pages/review.js';

const res = (exerciseId, pass, retry = false) => ({ exerciseId, verdict: pass ? 'correct' : 'wrong', pass, retry });

const UNIT = {
  id: 2,
  lessons: [
    {
      id: 'u2-l1',
      rules: [{ id: 'u2-r1', title: "il · lo · l'" }],
      exercises: [{ id: 'a', ruleId: 'u2-r1' }, { id: 'b', ruleId: 'u2-r1' }],
    },
    {
      id: 'u2-l2',
      rules: [{ id: 'u2-r2', title: 'la · le' }],
      exercises: [{ id: 'c', ruleId: 'u2-r2' }, { id: 'd', ruleId: 'u2-r2' }, { id: 'e', ruleId: 'u2-r2' }],
    },
  ],
  scene: { title: 'At the station', exercises: [] },
};

test('scoreResults counts first attempts only', () => {
  assert.deepEqual(scoreResults([res('a', true), res('b', false), res('b', true, true), res('c', true)]), { passes: 2, total: 3 });
  assert.deepEqual(scoreResults([]), { passes: 0, total: 0 });
});

test('stepOpen enforces the step order: lessons → mixed → scene → checkpoint; drill always', () => {
  const lessons = { lessonsDone: ['u2-l1', 'u2-l2'] };
  assert.equal(stepOpen(UNIT, undefined, 'mixed'), false);
  assert.equal(stepOpen(UNIT, { lessonsDone: ['u2-l1'] }, 'mixed'), false);
  assert.equal(stepOpen(UNIT, lessons, 'mixed'), true);
  assert.equal(stepOpen(UNIT, lessons, 'scene'), false);
  assert.equal(stepOpen(UNIT, { ...lessons, mixedDone: true }, 'scene'), true);
  assert.equal(stepOpen(UNIT, { ...lessons, mixedDone: true }, 'checkpoint'), false);
  assert.equal(stepOpen(UNIT, { ...lessons, mixedDone: true, sceneDone: true }, 'checkpoint'), true);
  assert.equal(stepOpen(UNIT, undefined, 'drill'), true);
  assert.equal(stepOpen({ ...UNIT, scene: undefined }, { ...lessons, mixedDone: true }, 'scene'), false);
});

test('checkpointResult: score is passes / cards answered, best never drops', () => {
  const results = [...'abcd'].map((id) => res(id, true)).concat(res('e', false));
  const r = checkpointResult(results, UNIT, 0.9);
  assert.equal(r.passes, 4);
  assert.equal(r.total, 5);
  assert.equal(r.score, 0.8);
  assert.equal(r.passed, true);
  assert.equal(r.best, 0.9);
  assert.equal(checkpointResult(results, UNIT, 0.5).best, 0.8);
  assert.equal(checkpointResult(results, UNIT, undefined).best, 0.8);
});

test('checkpointResult: the pass mark is 80%, and passing unlocks the next unit', () => {
  const pass = checkpointResult([res('a', true), res('b', true), res('c', true), res('d', true), res('e', false)], UNIT, 0);
  assert.equal(pass.unlocked, 3);
  const fail = checkpointResult([res('a', true), res('b', true), res('c', true), res('d', false), res('e', false)], UNIT, 0);
  assert.equal(fail.score, 0.6);
  assert.equal(fail.passed, false);
  assert.equal(fail.unlocked, null);
  const last = checkpointResult([res('a', true)], { ...UNIT, id: 18 }, 0);
  assert.equal(last.unlocked, null);
  assert.deepEqual(checkpointResult([], UNIT, 0), { passes: 0, total: 0, score: 0, passed: false, best: 0, revisit: [], unlocked: null });
});

test('checkpointResult lists each missed rule once, with its title and lesson link', () => {
  const r = checkpointResult([res('c', false), res('a', true), res('d', false), res('b', false), res('gone', false)], UNIT, 0);
  assert.deepEqual(r.revisit, [
    { ruleId: 'u2-r2', title: 'la · le', href: '#/lesson/2/u2-l2' },
    { ruleId: 'u2-r1', title: "il · lo · l'", href: '#/lesson/2/u2-l1' },
  ]);
  assert.deepEqual(checkpointResult([res('a', true)], UNIT, 0).revisit, []);
});

test('formatDay writes a local date as "Mon 5 Oct"', () => {
  assert.equal(formatDay('2026-10-05'), 'Mon 5 Oct');
  assert.equal(formatDay('2026-12-31'), 'Thu 31 Dec');
  assert.equal(formatDay('2027-01-01'), 'Fri 1 Jan');
});

test('nextDueDate is the earliest future due date among known cards', () => {
  const cards = {
    a: { box: 2, due: '2026-10-09' },
    b: { box: 1, due: '2026-10-05' },
    c: { box: 1, due: '2026-10-02' }, // due today: not in the future
    gone: { box: 1, due: '2026-10-03' }, // no longer in content
  };
  const known = new Set(['a', 'b', 'c']);
  assert.equal(nextDueDate(cards, '2026-10-02', known), '2026-10-05');
  assert.equal(nextDueDate({}, '2026-10-02', known), null);
  assert.equal(nextDueDate({ c: cards.c }, '2026-10-02', known), null);
});

test('reviewCountText follows the big count on the review cards', () => {
  assert.equal(reviewCountText(0), 'Nothing due today. Mistakes come back here.');
  assert.equal(reviewCountText(1), 'sentence due for another try.');
  assert.equal(reviewCountText(30), 'sentences due for another try.');
  assert.equal(`47 ${reviewCountText(47)}`, '47 due · 30 per session');
});
