import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonSteps, resumeStep, savesStep, declinesResume, priorPool, weakIds, stepLabel } from '../js/pages/lesson.js';

const ex = (id) => ({ id });
const unit = (id, lessons, scene = []) => ({
  id,
  lessons: lessons.map((l) => ({ id: l.id, exercises: l.ex.map(ex) })),
  scene: { exercises: scene.map(ex) },
});

test('lessonSteps: one screen per rule, then examples, practice and done', () => {
  const lesson = { rules: [{ id: 'r1' }, { id: 'r2' }], examples: [{}] };
  assert.deepEqual(lessonSteps(lesson), ['rule-0', 'rule-1', 'examples', 'practice', 'done']);
  assert.deepEqual(lessonSteps({ rules: [{ id: 'r1' }], examples: [] }), ['rule-0', 'practice', 'done']);
});

test('stepLabel names each step for the top bar', () => {
  const steps = ['rule-0', 'rule-1', 'examples', 'practice', 'done'];
  assert.equal(stepLabel('rule-1', steps), 'Rule 2 / 2');
  assert.equal(stepLabel('examples', steps), 'Examples');
  assert.equal(stepLabel('practice', steps), 'Practice');
  assert.equal(stepLabel('done', steps), 'Done');
});

test('resumeStep returns the saved step for this route only', () => {
  const steps = ['rule-0', 'examples', 'practice', 'done'];
  assert.equal(resumeStep({ route: '#/lesson/2/u2-l1', step: 'practice' }, '#/lesson/2/u2-l1', steps), 'practice');
  assert.equal(resumeStep({ route: '#/lesson/2/u2-l2', step: 'practice' }, '#/lesson/2/u2-l1', steps), 'rule-0');
  assert.equal(resumeStep({ route: '#/lesson/2/u2-l1', step: 'rule-7' }, '#/lesson/2/u2-l1', steps), 'rule-0');
  assert.equal(resumeStep({ route: '#/lesson/2/u2-l1', step: 'done' }, '#/lesson/2/u2-l1', steps), 'rule-0');
  assert.equal(resumeStep(null, '#/lesson/2/u2-l1', steps), 'rule-0');
});

test('savesStep: the first step and done are never a place to resume', () => {
  const steps = ['rule-0', 'rule-1', 'examples', 'practice', 'done'];
  assert.equal(savesStep('rule-0', steps), false);
  assert.equal(savesStep('done', steps), false);
  assert.equal(savesStep('rule-1', steps), true);
  assert.equal(savesStep('examples', steps), true);
  assert.equal(savesStep('practice', steps), true);
});

test('declinesResume: only a stale saved place for this same route is declined', () => {
  const steps = ['rule-0', 'examples', 'practice', 'done'];
  const route = '#/lesson/2/u2-l1';
  assert.equal(declinesResume({ route, step: 'rule-7' }, route, steps), true);
  assert.equal(declinesResume({ route, step: 'done' }, route, steps), true);
  assert.equal(declinesResume({ route, step: 'examples' }, route, steps), false);
  assert.equal(declinesResume({ route: '#/lesson/2/u2-l2', step: 'rule-7' }, route, steps), false);
  assert.equal(declinesResume(null, route, steps), false);
});

test('priorPool: earlier lessons of the unit and earlier units, seen cards only', () => {
  const units = [
    unit(1, [{ id: 'u1-l1', ex: ['a', 'b'] }], ['s']),
    unit(2, [{ id: 'u2-l1', ex: ['c', 'd'] }, { id: 'u2-l2', ex: ['e', 'f'] }, { id: 'u2-l3', ex: ['g'] }]),
    unit(3, [{ id: 'u3-l1', ex: ['h'] }]),
  ];
  const seen = { box: 1, due: '2026-10-03', seen: 1, correct: 0, lastWrong: null };
  const cards = { a: seen, s: seen, c: seen, d: seen, e: seen, g: seen, h: seen, gone: seen };
  assert.deepEqual(priorPool(units, 2, 'u2-l2', cards).sort(), ['a', 'c', 'd', 's']);
  assert.deepEqual(priorPool(units, 2, 'u2-l1', cards).sort(), ['a', 's']);
  assert.deepEqual(priorPool(units, 1, 'u1-l1', cards), []);
  assert.deepEqual(priorPool([null, ...units], 2, 'u2-l1', {}), []);
});

test('weakIds: cards with a recorded miss still in box 1 or 2', () => {
  const cards = {
    a: { box: 1, lastWrong: '2026-10-01' },
    b: { box: 2, lastWrong: '2026-09-01' },
    c: { box: 3, lastWrong: '2026-09-01' },
    d: { box: 1, lastWrong: null },
  };
  assert.deepEqual([...weakIds(cards)].sort(), ['a', 'b']);
});
