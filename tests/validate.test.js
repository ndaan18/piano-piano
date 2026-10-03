import test from 'node:test';
import assert from 'node:assert/strict';
import { validateUnit } from '../tools/validate-content.js';
import { UNITS, loadUnit, exerciseIndex } from '../content/index.js';

const TYPES = ['recognise', 'type', 'transform', 'build', 'listen', 'register'];

function exercise(i, ruleId = 'u9-r1') {
  const type = TYPES[i % TYPES.length];
  return {
    id: `u9-l1-e${String(i + 1).padStart(2, '0')}`,
    type,
    reg: ['tu', 'lei', 'neutral'][i % 3],
    rung: (i % 5) + 1,
    ruleId,
    prompt: '___ zaino è qui.',
    base: '',
    en: 'The backpack is here.',
    answers: ['lo'],
    mistakes: { il: 'z takes lo.' },
    why: 'z → lo.',
    options: type === 'recognise' ? ['il', 'lo'] : null,
  };
}

// A non-draft unit with one rule and `n` exercises.
function fixture(n = 30) {
  return {
    id: 9,
    slug: 'test',
    title: 'Test',
    teaser: 'test',
    lessons: [{
      id: 'u9-l1',
      title: 'Test lesson',
      rules: [{ id: 'u9-r1', title: 'Rule', sentence: 'lo zaino', marks: [], why: 'Because.' }],
      examples: [],
      exercises: Array.from({ length: n }, (_, i) => exercise(i)),
    }],
    scene: { title: 'Scene', setting: 'Somewhere', lines: [], exercises: [] },
  };
}

const hasMessageWith = (errors, text) => errors.some((e) => e.includes(text));

test('a valid minimal unit has no errors', () => {
  assert.deepEqual(validateUnit(fixture()), []);
});

test('duplicate id is reported with the id', () => {
  const u = fixture();
  u.lessons[0].exercises[5].id = u.lessons[0].exercises[4].id;
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'u9-l1-e05'), errors.join('\n'));
});

test('missing answers is reported with the id', () => {
  const u = fixture();
  delete u.lessons[0].exercises[2].answers;
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'u9-l1-e03'), errors.join('\n'));
});

test('empty answers is reported with the id', () => {
  const u = fixture();
  u.lessons[0].exercises[2].answers = [];
  assert.ok(hasMessageWith(validateUnit(u), 'u9-l1-e03'));
});

test('unknown ruleId is reported with the id', () => {
  const u = fixture();
  u.lessons[0].exercises[7].ruleId = 'u9-r7';
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'u9-l1-e08'), errors.join('\n'));
});

test('recognise options without an answer are reported with the id', () => {
  const u = fixture();
  u.lessons[0].exercises[0].options = ['il', "l'"];
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'u9-l1-e01'), errors.join('\n'));
});

test("reg 'formal' is reported with the id", () => {
  const u = fixture();
  u.lessons[0].exercises[3].reg = 'formal';
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'u9-l1-e04'), errors.join('\n'));
});

test('unknown type is reported with the id', () => {
  const u = fixture();
  u.lessons[0].exercises[3].type = 'choose';
  assert.ok(hasMessageWith(validateUnit(u), 'u9-l1-e04'));
});

test('rung outside 1-5 is reported with the id', () => {
  const u = fixture();
  u.lessons[0].exercises[3].rung = 6;
  assert.ok(hasMessageWith(validateUnit(u), 'u9-l1-e04'));
});

test('missing why is reported with the id', () => {
  const u = fixture();
  u.lessons[0].exercises[3].why = '';
  assert.ok(hasMessageWith(validateUnit(u), 'u9-l1-e04'));
});

test('build without base or en context is reported with the id', () => {
  const u = fixture();
  const ex = u.lessons[0].exercises[3]; // index 3 → build
  assert.equal(ex.type, 'build');
  ex.base = '';
  ex.en = '';
  assert.ok(hasMessageWith(validateUnit(u), 'u9-l1-e04'));
});

test('a rule with 12 exercises in a non-draft unit is an error naming the rule', () => {
  const errors = validateUnit(fixture(12));
  assert.ok(hasMessageWith(errors, 'u9-r1'), errors.join('\n'));
});

test('a rule with 12 exercises in a draft unit is only a warning', () => {
  const u = { ...fixture(12), draft: true };
  const warnings = [];
  assert.deepEqual(validateUnit(u, warnings), []);
  assert.ok(hasMessageWith(warnings, 'u9-r1'), warnings.join('\n'));
});

test('scene exercises are validated too', () => {
  const u = fixture();
  u.scene.exercises = [{ ...exercise(1), id: 'u9-s-e01', reg: 'formal' }];
  assert.ok(hasMessageWith(validateUnit(u), 'u9-s-e01'));
});

test('UNITS lists all 19 units in order', () => {
  assert.equal(UNITS.length, 19);
  UNITS.forEach((u, i) => {
    assert.equal(u.id, i);
    assert.match(u.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.ok(u.title && u.teaser);
  });
  assert.equal(UNITS[2].title, 'Articles');
  assert.equal(UNITS[2].teaser, "il · lo · la · l'");
  assert.equal(UNITS[18].title, 'Polite conditional');
});

test('loadUnit returns the sample unit and null for unknown ids', async () => {
  const unit = await loadUnit(2);
  assert.equal(unit.id, 2);
  assert.equal(await loadUnit(99), null);
});

test('loadUnit returns null for a unit not written yet', async (t) => {
  const unwritten = UNITS.find((u) => !u.load);
  if (!unwritten) return t.skip('every unit has a loader');
  assert.equal(await loadUnit(unwritten.id), null);
});

test('the sample unit validates and indexes every exercise', async () => {
  const unit = await loadUnit(2);
  assert.deepEqual(validateUnit(unit), []);
  const ex = unit.lessons[0].exercises;
  assert.equal(ex.length, 30);
  assert.deepEqual(new Set(ex.map((e) => e.type)), new Set(TYPES));
  assert.deepEqual(new Set(ex.map((e) => e.rung)), new Set([1, 2, 3, 4, 5]));
  const index = exerciseIndex([unit]);
  assert.equal(index.size, 30);
  assert.deepEqual(
    { ...index.get('u2-l1-e01'), exercise: undefined },
    { exercise: undefined, unitId: 2, lessonId: 'u2-l1', ruleId: 'u2-r1' },
  );
});
