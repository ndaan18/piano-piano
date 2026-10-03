import test from 'node:test';
import assert from 'node:assert/strict';
import { pickVoice } from '../js/audio.js';
import { phraseOfTheDay, weekAccuracy, currentUnit } from '../js/pages/home.js';
import { unitSteps, nextStep, unitFromRoute, safeRoute, dropResume } from '../js/pages/unit.js';
import { createStore } from '../js/store.js';

const voice = (name, lang, voiceURI = name) => ({ name, lang, voiceURI });

test('pickVoice prefers the saved Italian voice', () => {
  const vs = [voice('Alice', 'it-IT'), voice('Luca', 'it-IT'), voice('Samantha', 'en-US')];
  assert.equal(pickVoice(vs, 'Luca').name, 'Luca');
});

test('pickVoice ignores a saved voice that is gone or not Italian', () => {
  const vs = [voice('Luca', 'it-IT'), voice('Federica (Enhanced)', 'it-IT'), voice('Samantha', 'en-US')];
  assert.equal(pickVoice(vs, 'Missing').name, 'Federica (Enhanced)');
  assert.equal(pickVoice(vs, 'Samantha').name, 'Federica (Enhanced)');
});

test('pickVoice matches preferred names only among Italian voices', () => {
  const vs = [voice('Samantha (Enhanced)', 'en-US'), voice('Luca', 'it_IT')];
  assert.equal(pickVoice(vs, null).name, 'Luca');
});

test('pickVoice returns null without an Italian voice', () => {
  assert.equal(pickVoice([voice('Samantha', 'en-US')], null), null);
  assert.equal(pickVoice([], null), null);
});

test('phraseOfTheDay is deterministic by date and rotates daily', () => {
  const ex = ['a', 'b', 'c'].map((it) => ({ it, en: it, reg: 'tu' }));
  assert.equal(phraseOfTheDay(ex, '2026-10-02'), phraseOfTheDay(ex, '2026-10-02'));
  assert.notEqual(phraseOfTheDay(ex, '2026-10-02'), phraseOfTheDay(ex, '2026-10-03'));
  assert.equal(phraseOfTheDay([], '2026-10-02'), null);
});

test('weekAccuracy counts today and the 6 days before', () => {
  const log = [
    { date: '2026-09-25', pass: false }, // 7 days ago: excluded
    { date: '2026-09-26', pass: true },
    { date: '2026-10-01', pass: false },
    { date: '2026-10-02', pass: true },
    { date: '2026-10-02', pass: true },
  ];
  assert.equal(weekAccuracy(log, '2026-10-02'), 75);
  assert.equal(weekAccuracy([], '2026-10-02'), null);
  assert.equal(weekAccuracy([{ date: '2026-09-01', pass: true }], '2026-10-02'), null);
});

test('currentUnit is the first unlocked unit without a passed checkpoint', () => {
  assert.equal(currentUnit({}, 19), 0);
  assert.equal(currentUnit({ 0: { checkpointBest: 0.9 } }, 19), 1);
  assert.equal(currentUnit({ 0: { checkpointBest: 0.9 }, 1: { checkpointBest: 0.5 } }, 19), 1);
  assert.equal(currentUnit({ 0: { checkpointBest: 1 }, 1: { checkpointBest: 1 } }, 2), 1);
});

test('unitFromRoute reads the unit from unit-scoped routes only', () => {
  assert.equal(unitFromRoute('#/lesson/2/u2-l1'), 2);
  assert.equal(unitFromRoute('#/checkpoint/12'), 12);
  assert.equal(unitFromRoute('#/review'), null);
  assert.equal(unitFromRoute(null), null);
});

const UNIT = {
  id: 2,
  lessons: [{ id: 'u2-l1', title: "il, lo, l'" }, { id: 'u2-l2', title: 'la, le' }],
  scene: { title: 'At the station', exercises: [] },
};
const kinds = (steps) => steps.map((s) => s.kind);

test('unitSteps lists lessons, mixed, scene, checkpoint, drill', () => {
  const steps = unitSteps(UNIT, undefined);
  assert.deepEqual(kinds(steps), ['lesson', 'lesson', 'mixed', 'scene', 'checkpoint', 'drill']);
  assert.equal(steps[0].route, '#/lesson/2/u2-l1');
  assert.equal(steps[2].route, '#/mixed/2');
  assert.equal(steps[5].route, '#/drill/2');
  assert.deepEqual(steps.map((s) => s.locked), [false, false, true, true, true, false]);
  assert.ok(steps.every((s) => !s.done));
});

test('unitSteps unlocks in order: mixed after all lessons, scene after mixed, checkpoint after scene', () => {
  const locked = (p) => unitSteps(UNIT, p).map((s) => s.locked);
  assert.deepEqual(locked({ lessonsDone: ['u2-l1'] }), [false, false, true, true, true, false]);
  assert.deepEqual(locked({ lessonsDone: ['u2-l1', 'u2-l2'] }), [false, false, false, true, true, false]);
  assert.deepEqual(locked({ lessonsDone: ['u2-l1', 'u2-l2'], mixedDone: true }), [false, false, false, false, true, false]);
  assert.deepEqual(
    locked({ lessonsDone: ['u2-l1', 'u2-l2'], mixedDone: true, sceneDone: true }),
    [false, false, false, false, false, false],
  );
});

test('checkpoint is done only at the pass mark', () => {
  const p = { lessonsDone: ['u2-l1', 'u2-l2'], mixedDone: true, sceneDone: true };
  assert.equal(unitSteps(UNIT, { ...p, checkpointBest: 0.7 })[4].done, false);
  assert.equal(unitSteps(UNIT, { ...p, checkpointBest: 0.8 })[4].done, true);
});

test('nextStep is the first open, unfinished step; drill never counts', () => {
  assert.equal(nextStep(unitSteps(UNIT, undefined)).route, '#/lesson/2/u2-l1');
  assert.equal(nextStep(unitSteps(UNIT, { lessonsDone: ['u2-l1'] })).route, '#/lesson/2/u2-l2');
  assert.equal(nextStep(unitSteps(UNIT, { lessonsDone: ['u2-l1', 'u2-l2'] })).kind, 'mixed');
  const all = { lessonsDone: ['u2-l1', 'u2-l2'], mixedDone: true, sceneDone: true, checkpointBest: 1 };
  assert.equal(nextStep(unitSteps(UNIT, all)), null);
});

test('a unit without a scene goes mixed → checkpoint', () => {
  const steps = unitSteps({ ...UNIT, scene: undefined }, { lessonsDone: ['u2-l1', 'u2-l2'], mixedDone: true });
  assert.deepEqual(kinds(steps), ['lesson', 'lesson', 'mixed', 'checkpoint', 'drill']);
  assert.equal(steps[3].locked, false);
});

test('safeRoute accepts plain app routes and rejects anything that could break out of an attribute', () => {
  assert.equal(safeRoute('#/lesson/2/u2-l1'), '#/lesson/2/u2-l1');
  assert.equal(safeRoute('#/review'), '#/review');
  assert.equal(safeRoute('#/unit/0/" onmouseover="alert(1)" x="'), null);
  assert.equal(safeRoute('javascript:alert(1)'), null);
  assert.equal(safeRoute('#/unit/0?x=1'), null);
  assert.equal(safeRoute(null), null);
  assert.equal(safeRoute({ route: '#/' }), null);
});

test('dropResume clears the saved place only when it is this route', () => {
  const store = createStore(null);
  store.update((d) => { d.resume = { route: '#/lesson/0/u0-l1', step: 'rule-1' }; });
  dropResume(store, '#/lesson/0/u0-l2');
  assert.equal(store.get().resume.route, '#/lesson/0/u0-l1');
  dropResume(store, '#/lesson/0/u0-l1');
  assert.equal(store.get().resume, null);
  let writes = 0;
  store.subscribe(() => { writes++; });
  dropResume(store, '#/review');
  assert.equal(writes, 0);
});
