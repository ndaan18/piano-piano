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

test('loadUnit returns a written unit and null for unknown ids', async () => {
  const unit = await loadUnit(2);
  assert.equal(unit.id, 2);
  assert.equal(await loadUnit(99), null);
});

test('loadUnit returns null for a unit not written yet', async (t) => {
  const unwritten = UNITS.find((u) => !u.load);
  if (!unwritten) return t.skip('every unit has a loader');
  assert.equal(await loadUnit(unwritten.id), null);
});

test('unit 2 validates and indexes every exercise', async () => {
  const unit = await loadUnit(2);
  assert.deepEqual(validateUnit(unit), []);
  const ex = unit.lessons[0].exercises;
  assert.ok(ex.length >= 30);
  assert.deepEqual(new Set(ex.map((e) => e.type)), new Set(TYPES));
  assert.deepEqual(new Set(ex.map((e) => e.rung)), new Set([1, 2, 3, 4, 5]));
  const all = [...unit.lessons.flatMap((l) => l.exercises), ...unit.scene.exercises];
  const index = exerciseIndex([unit]);
  assert.equal(index.size, all.length);
  assert.deepEqual(
    { ...index.get('u2-l1-e01'), exercise: undefined },
    { exercise: undefined, unitId: 2, lessonId: 'u2-l1', ruleId: 'u2-r1' },
  );
});

// ---- audio-first, patterns and gap rules (spec §3.1, §3.5, §5.1, §9) ----

const normalised = (u) => validateUnit(u);

function audioFirstUnit() {
  const u = fixture();
  u.audioFirst = true;
  u.lessons[0].exercises.forEach((ex) => {
    if (ex.type === 'recognise' || ex.type === 'type') ex.say = 'Lo zaino è qui.';
  });
  return u;
}

// Unit 0, lesson u0-l1, one rule, 30 type exercises with a correct gap.
function unit0() {
  return {
    id: 0,
    slug: 'sounds',
    title: 'Sounds',
    teaser: 'test',
    audioFirst: true,
    lessons: [{
      id: 'u0-l1',
      title: 'Soft c',
      rules: [{ id: 'u0-r1', title: 'Rule', sentence: 'ce', marks: [], why: 'Because.' }],
      examples: [],
      exercises: Array.from({ length: 30 }, (_, i) => ({
        id: `u0-l1-e${String(i + 1).padStart(2, '0')}`,
        type: 'type',
        reg: 'neutral',
        rung: (i % 5) + 1,
        ruleId: 'u0-r1',
        prompt: 'La ___na è pronta.',
        say: 'La cena è pronta.',
        en: 'The dinner is ready.',
        answers: ['ce'],
        mistakes: {},
        why: 'ce sounds che.',
      })),
    }],
    scene: { title: 'Scene', setting: 'Somewhere', lines: [], exercises: [] },
  };
}

test('a valid audioFirst unit has no errors', () => {
  assert.deepEqual(normalised(audioFirstUnit()), []);
});

test('a valid Unit 0 fixture has no errors', () => {
  assert.deepEqual(validateUnit(unit0()), []);
});

test('answers[0] containing [ must be plain', () => {
  const u = fixture();
  u.lessons[0].exercises[0].answers = ['[lo]', 'lo'];
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'answers[0] must be plain'), errors.join('\n'));
});

test('answers[0] as an object with a pattern must be plain', () => {
  const u = fixture();
  u.lessons[0].exercises[0].answers = [{ text: '{lo|il}', note: 'x' }, 'lo'];
  assert.ok(hasMessageWith(validateUnit(u), 'answers[0] must be plain'));
});

test('an unbalanced pattern is reported', () => {
  const u = fixture();
  u.lessons[0].exercises[0].answers = ['lo', '[il'];
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'unbalanced'), errors.join('\n'));
});

test('a pattern expanding to more than 64 strings is reported', () => {
  const u = fixture();
  u.lessons[0].exercises[0].answers = ['lo', '[a][b][c][d][e][f][g]'];
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'expands to'), errors.join('\n'));
});

test('a pattern expanding to exactly 64 strings is fine', () => {
  const u = fixture();
  u.lessons[0].exercises[0].answers = ['lo', '[a][b][c][d][e][f]'];
  assert.deepEqual(validateUnit(u), []);
});

test('an object answer with empty text is reported', () => {
  const u = fixture();
  u.lessons[0].exercises[0].answers = ['lo', { text: '  ', note: 'x' }];
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'empty answer'), errors.join('\n'));
});

test('object answers with notes are accepted', () => {
  const u = fixture();
  u.lessons[0].exercises[2].answers = [{ text: 'lo', note: 'plain note' }, 'il'];
  assert.deepEqual(validateUnit(u), []);
});

test('recognise options are compared with the plain text of expanded answers', () => {
  const u = fixture();
  const ex = u.lessons[0].exercises[0];
  ex.answers = [{ text: 'lo' }, '{il|la}'];
  ex.options = ['il', 'xx'];
  assert.deepEqual(validateUnit(u), []);
  ex.options = ['xx', 'yy'];
  assert.ok(hasMessageWith(validateUnit(u), 'recognise options'));
});

test('a mistakes key containing { must be plain', () => {
  const u = fixture();
  u.lessons[0].exercises[0].mistakes = { '{il|lo}': 'x' };
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'mistake keys must be plain'), errors.join('\n'));
});

test('audioFirst: a recognise or type card without say needs say', () => {
  const u = audioFirstUnit();
  delete u.lessons[0].exercises[0].say; // recognise
  delete u.lessons[0].exercises[1].say; // type
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'u9-l1-e01: needs say'), errors.join('\n'));
  assert.ok(hasMessageWith(errors, 'u9-l1-e02: needs say'), errors.join('\n'));
});

test('without audioFirst, say is not required', () => {
  assert.deepEqual(validateUnit(fixture()), []);
});

test('audioFirst: other card types do not need say', () => {
  const u = audioFirstUnit();
  assert.equal(u.lessons[0].exercises[2].type, 'transform');
  assert.equal(u.lessons[0].exercises[2].say, undefined);
  assert.deepEqual(validateUnit(u), []);
});

test("audioFirst recognise: say must contain answers[0] as a whole word", () => {
  const u = audioFirstUnit();
  u.lessons[0].exercises[0].say = 'Il pallone è qui.';
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'say must contain'), errors.join('\n'));
});

test('audioFirst recognise: a substring of a longer word is not enough', () => {
  const u = audioFirstUnit();
  u.lessons[0].exercises[0].say = 'Il bollo è qui.'; // "lo" only inside "bollo"
  assert.ok(hasMessageWith(validateUnit(u), 'say must contain'));
});

test('audioFirst recognise: a multi-word answer matches as a phrase, ignoring punctuation and case', () => {
  const u = audioFirstUnit();
  const ex = u.lessons[0].exercises[0];
  ex.answers = ['Che bello', 'che bello'];
  ex.options = ['Che bello', 'Che brutto'];
  ex.say = 'Oh, che bello!';
  assert.deepEqual(validateUnit(u), []);
});

test("audioFirst recognise: an apostrophe is a word boundary in say (l'amico, dov'è)", () => {
  for (const [answer, other, say] of [['amico', 'amica', "Ecco l'amico."], ['è', 'e', "Dov'è la chiave?"], ["l'uscita", 'uscita', "Dov'è l'uscita?"]]) {
    const u = audioFirstUnit();
    const ex = u.lessons[0].exercises[0];
    ex.answers = [answer];
    ex.options = [answer, other];
    ex.say = say;
    assert.deepEqual(validateUnit(u), [], `${answer} in ${say}`);
  }
});

test("audioFirst recognise: after an apostrophe, a longer word still does not contain the answer", () => {
  const u = audioFirstUnit();
  const ex = u.lessons[0].exercises[0];
  ex.answers = ['amico'];
  ex.options = ['amico', 'amica'];
  ex.say = "Ecco l'amicone.";
  assert.ok(hasMessageWith(validateUnit(u), 'say must contain'));
});

test('Unit 0: a type answer that is just c fails the gap shape', () => {
  const u = unit0();
  u.lessons[0].exercises[0].answers = ['c'];
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'gap shape'), errors.join('\n'));
});

test('Unit 0: gap shapes cio, chia, ghe, tti, tte and ce are accepted', () => {
  for (const a of ['cio', 'chia', 'ghe', 'tti', 'tte', 'ce', 'Ci', 'gli']) {
    const u = unit0();
    u.lessons[0].exercises[0].answers = [a];
    u.lessons[0].exercises[0].prompt = '___';
    u.lessons[0].exercises[0].say = a;
    assert.ok(!hasMessageWith(validateUnit(u), 'gap shape'), `${a}: ${validateUnit(u).join('\n')}`);
  }
});

test('Unit 0: a gap prompt that does not match say is reported', () => {
  const u = unit0();
  u.lessons[0].exercises[0].say = 'La pena è pronta.';
  const errors = validateUnit(u);
  assert.ok(hasMessageWith(errors, 'gap must match say'), errors.join('\n'));
});

test('Unit 0 gap rules apply to u0-l2 and u0-l3, not to l4', () => {
  for (const [lid, bad] of [['u0-l2', true], ['u0-l3', true], ['u0-l4', false]]) {
    const u = unit0();
    u.lessons[0].id = lid;
    u.lessons[0].exercises.forEach((ex, i) => { ex.id = `${lid}-e${i + 1}`; });
    u.lessons[0].exercises[0].answers = ['c'];
    assert.equal(hasMessageWith(validateUnit(u), 'gap shape'), bad, lid);
  }
});

test('Unit 0 gap rules do not apply without audioFirst', () => {
  const u = unit0();
  delete u.audioFirst;
  u.lessons[0].exercises[0].answers = ['c'];
  u.lessons[0].exercises[0].say = 'Something else.';
  assert.deepEqual(validateUnit(u), []);
});

test('gap rules do not apply to other unit ids', () => {
  const u = unit0();
  u.id = 7;
  u.lessons[0].exercises[0].answers = ['c'];
  assert.ok(!hasMessageWith(validateUnit(u), 'gap shape'));
});

test('a register card whose base names the register is rejected', () => {
  for (const base of ['(formal)', 'Now say it to the waiter (Lei).', 'Say it formally.', 'Now say it with tu.', '(tu)']) {
    const u = fixture();
    u.lessons[0].exercises[5].base = base;
    const errors = validateUnit(u);
    assert.ok(hasMessageWith(errors, 'register base names the register'), `${base}: ${errors.join('\n')}`);
  }
});

test('a register card whose base names the person is accepted', () => {
  const u = fixture();
  u.lessons[0].exercises[5].base = "Now say it to your partner's grandmother.";
  assert.deepEqual(validateUnit(u), []);
});

test('the register-base rule applies to register cards only', () => {
  const u = fixture();
  u.lessons[0].exercises[2].base = '(formal)'; // a transform card
  assert.deepEqual(validateUnit(u), []);
});
