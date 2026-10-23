// Unit 0: audio-first content (spec §3.5, §4, §7, §8).
import test from 'node:test';
import assert from 'node:assert/strict';
import { answerTexts, judge, normalize } from '../js/engine/checker.js';

const unit = (await import('../content/units/unit-00-sounds.js')).default;

const GAP_LESSON_IDS = ['u0-l1', 'u0-l2', 'u0-l3']; // the §3.5 gap shape applies here
const GAP = '___';
const GAP_SHAPE = /^[bcdfghlmnpqrstvz]+i?[aeiouàèéìòù]$/;
const MIN_PER_RULE = 30;

const lessons = unit.lessons;
const gapLessons = lessons.filter((l) => GAP_LESSON_IDS.includes(l.id));
const lessonCards = lessons.flatMap((l) => l.exercises);
const sceneCards = unit.scene.exercises;
const cards = [...lessonCards, ...sceneCards];
const cardsIn = (ids) => lessons.filter((l) => ids.includes(l.id)).flatMap((l) => l.exercises);
const first = (ex) => (typeof ex.answers[0] === 'string' ? ex.answers[0] : ex.answers[0].text);
const audioTyped = cards.filter((ex) => ex.type === 'recognise' || ex.type === 'type');
const gapTyped = cards.filter((ex) => ex.type === 'type' && String(ex.prompt).includes(GAP));
// Gap-shape cards: every type card in lessons 1–3, and scene type cards on the lesson 1–3 rules.
const SHAPE_RULES = new Set(gapLessons.flatMap((l) => l.rules.map((r) => r.id)));
const shapeCards = [
  ...gapLessons.flatMap((l) => l.exercises).filter((ex) => ex.type === 'type'),
  ...sceneCards.filter((ex) => ex.type === 'type' && SHAPE_RULES.has(ex.ruleId)),
];
// Whole words or phrases: any non-letter (apostrophe, bracket, =) is a word boundary (l'uscita contains uscita).
const words = (s) => ` ${normalize(s).replace(/[^\p{L}]+/gu, ' ').trim()} `;

/** The whole word the gap sits in, with the answer filled in ("___na" + "ce" → "cena"). */
function wholeWord(ex) {
  const at = ex.prompt.indexOf(GAP);
  const before = ex.prompt.slice(0, at).match(/\p{L}*$/u)[0];
  const after = ex.prompt.slice(at + GAP.length).match(/^\p{L}*/u)[0];
  return before + first(ex) + after;
}

test('all four lessons and the scene are there', () => {
  assert.deepEqual(lessons.map((l) => l.id), ['u0-l1', 'u0-l2', 'u0-l3', 'u0-l4']);
  assert.ok(sceneCards.length > 0);
});

test('the unit is audio-first', () => {
  assert.equal(unit.audioFirst, true);
});

test('every recognise and type card has say, in every lesson and the scene', () => {
  for (const ex of audioTyped) assert.ok(typeof ex.say === 'string' && ex.say.trim() !== '', `${ex.id}: no say`);
});

test('a hear & pick card speaks its answer as a whole word', () => {
  for (const ex of cards.filter((e) => e.type === 'recognise')) {
    assert.ok(words(ex.say).includes(words(first(ex))), `${ex.id}: "${ex.say}" lacks "${first(ex)}"`);
    assert.ok(ex.options.includes(first(ex)), `${ex.id}: options lack the answer`);
  }
});

test('a hear & pick gap card with its answer filled in is exactly what is spoken', () => {
  for (const ex of cards.filter((e) => e.type === 'recognise' && e.prompt.includes(GAP))) {
    assert.equal(normalize(ex.prompt.replace(GAP, first(ex))), normalize(ex.say), ex.id);
  }
});

test('every type card is a gap card', () => {
  for (const ex of cards.filter((e) => e.type === 'type')) assert.ok(ex.prompt.includes(GAP), `${ex.id}: no gap`);
});

test('in lessons 1–3 (and the scene on their rules) a gap holds the letter group through the vowel you hear', () => {
  assert.ok(shapeCards.some((ex) => ex.id.startsWith('u0-l3-')), 'lesson 3 has gap cards');
  for (const ex of shapeCards) assert.match(first(ex).toLowerCase(), GAP_SHAPE, ex.id);
});

test('the filled gap is exactly what is spoken (every lesson and the scene)', () => {
  for (const ex of gapTyped) {
    assert.equal(normalize(ex.prompt.replace(GAP, first(ex))), normalize(ex.say), ex.id);
  }
});

test('typing the whole word into a gap passes', () => {
  for (const ex of gapTyped) {
    assert.equal(judge(ex, wholeWord(ex)).verdict, 'correct', `${ex.id}: "${wholeWord(ex)}"`);
  }
});

test('every answer passes and every mistake key is a mistake', () => {
  for (const ex of cards) {
    assert.equal(judge(ex, first(ex)).verdict, 'correct', ex.id);
    for (const key of Object.keys(ex.mistakes || {})) {
      assert.equal(judge(ex, key).verdict, 'mistake', `${ex.id}: "${key}"`);
    }
  }
});

test('no base carries a respelling', () => {
  for (const ex of cards) assert.ok(!/said "|, said /.test(String(ex.base)), `${ex.id}: ${ex.base}`);
});

test('no register cards and no plural transforms', () => {
  for (const ex of cards) {
    assert.notEqual(ex.type, 'register', ex.id);
    assert.ok(!/plural/i.test(String(ex.base)), `${ex.id}: ${ex.base}`);
  }
});

test('every exercise id is unique and in its lesson\'s scheme', () => {
  for (const lesson of lessons) {
    const ids = lesson.exercises.map((ex) => ex.id);
    assert.equal(new Set(ids).size, ids.length, lesson.id);
    for (const id of ids) assert.match(id, new RegExp(`^${lesson.id}-e\\d{2}$`));
  }
  const sceneIds = sceneCards.map((ex) => ex.id);
  assert.equal(new Set(sceneIds).size, sceneIds.length, 'scene');
  for (const id of sceneIds) assert.match(id, /^u0-s-e\d{2}$/);
});

test('each rule has at least 30 exercises in its own lesson', () => {
  for (const lesson of lessons) {
    for (const rule of lesson.rules) {
      const n = lesson.exercises.filter((ex) => ex.ruleId === rule.id).length;
      assert.ok(n >= MIN_PER_RULE, `${rule.id}: ${n}`);
    }
  }
});

test('the removed plural transforms, register cards and giveaways stay removed', () => {
  const ids = new Set(cards.map((ex) => ex.id));
  const removed = [
    ...['u0-l1', 'u0-l2'].flatMap((l) => [18, 19, 20, 21, 22, 23, 24, 25].map((n) => `${l}-e${n}`)),
    ...[19, 20, 21, 22, 23, 24, 25, 26, 27].map((n) => `u0-l3-e${n}`),
    ...[21, 22, 23, 24, 25, 26].map((n) => `u0-l4-e${n}`),
  ];
  for (const id of removed) assert.ok(!ids.has(id), id);
});

test('no transform cards are left in Unit 0', () => {
  for (const ex of cards.filter((e) => e.id !== 'u0-s-e06')) assert.notEqual(ex.type, 'transform', ex.id);
});

// Accents are taught in lesson 4; before that, nothing may require one unless base gives the word.
const ACCENTED = /[àèéìòù]/;
const beforeAccents = cardsIn(['u0-l1', 'u0-l2', 'u0-l3']);

test('no listen dictation or hear & spell answer in lessons 1–3 needs an accent', () => {
  for (const ex of beforeAccents.filter((e) => e.type === 'listen' || e.type === 'type')) {
    for (const a of answerTexts(ex)) assert.ok(!ACCENTED.test(a), `${ex.id}: "${a}"`);
  }
});

test('no hear & pick option in lessons 1–3 hinges on an accent', () => {
  for (const ex of beforeAccents.filter((e) => e.type === 'recognise')) {
    for (const o of ex.options) assert.ok(!ACCENTED.test(o), `${ex.id}: "${o}"`);
  }
});

test('in lessons 1–3 a card whose every answer needs an accent glosses the accented words in base', () => {
  for (const ex of beforeAccents.filter((e) => e.type !== 'listen')) {
    if (!answerTexts(ex).every((a) => ACCENTED.test(a))) continue;
    const accented = normalize(first(ex)).split(' ').filter((w) => ACCENTED.test(w));
    for (const w of accented) assert.ok(words(ex.base).includes(words(w)), `${ex.id}: base lacks "${w}"`);
  }
});

test('no feedback says you "heard" an è: TTS cannot voice the accent (spec §8)', () => {
  for (const ex of cards) {
    for (const msg of Object.values(ex.mistakes || {})) {
      assert.ok(!/heard "?is"?|heard è/i.test(msg), `${ex.id}: ${msg}`);
    }
  }
});

test('a card that plays no sound never tells the learner to listen', () => {
  const LISTEN = /\b(listen|hear|heard)\b/i;
  const SILENT = /\b(don't|doesn't|never|isn't|not) (hear|heard)\b|\bheard\b(?= *(?:either|at all))/gi; // a silent letter
  for (const ex of cards.filter((e) => e.type !== 'listen' && !e.say)) {
    const texts = [ex.base, ex.why, ...Object.values(ex.mistakes || {})];
    for (const t of texts) assert.ok(!LISTEN.test(String(t).replace(SILENT, '')), `${ex.id}: ${t}`);
  }
});

test('a card that refuses digits says so in base, and is never a listen card', () => {
  for (const ex of cards.filter((e) => e.digits === false)) {
    assert.notEqual(ex.type, 'listen', ex.id);
    assert.match(String(ex.base), /as a word/i, ex.id);
  }
  assert.equal(cards.find((e) => e.id === 'u0-l3-e30').digits, false, 'u0-l3-e30 spells sette out');
});

test('the scene spelling card gives every letter name it needs in base', () => {
  const ex = sceneCards.find((e) => e.id === 'u0-s-e06');
  const names = normalize(first(ex)).split(' ').filter((w) => !['doppia', 'due'].includes(w));
  for (const name of new Set(names)) assert.ok(words(ex.base).includes(words(name)), `base lacks "${name}"`);
});
