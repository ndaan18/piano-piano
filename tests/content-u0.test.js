// Unit 0, lessons 1–2: audio-first content (spec §3.5, §4, §7).
import test from 'node:test';
import assert from 'node:assert/strict';
import { answerTexts, judge, normalize } from '../js/engine/checker.js';

const unit = (await import('../content/units/unit-00-sounds.js')).default;

const LESSON_IDS = ['u0-l1', 'u0-l2'];
const GAP = '___';
const GAP_SHAPE = /^[bcdfghlmnpqrstvz]+i?[aeiouàèéìòù]$/;
const MIN_PER_RULE = 30;

const lessons = unit.lessons.filter((l) => LESSON_IDS.includes(l.id));
const cards = lessons.flatMap((l) => l.exercises);
const first = (ex) => (typeof ex.answers[0] === 'string' ? ex.answers[0] : ex.answers[0].text);
const audioTyped = cards.filter((ex) => ex.type === 'recognise' || ex.type === 'type');
const gapCards = cards.filter((ex) => ex.type === 'type' && String(ex.prompt).includes(GAP));
// Whole words or phrases: any non-letter (apostrophe, bracket, =) is a word boundary (l'uscita contains uscita).
const words = (s) => ` ${normalize(s).replace(/[^\p{L}]+/gu, ' ').trim()} `;

/** The whole word the gap sits in, with the answer filled in ("___na" + "ce" → "cena"). */
function wholeWord(ex) {
  const at = ex.prompt.indexOf(GAP);
  const before = ex.prompt.slice(0, at).match(/\p{L}*$/u)[0];
  const after = ex.prompt.slice(at + GAP.length).match(/^\p{L}*/u)[0];
  return before + first(ex) + after;
}

test('both lessons are there', () => {
  assert.equal(lessons.length, 2);
});

test('every recognise and type card has say', () => {
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

test('a gap holds the letter group through the vowel you hear', () => {
  for (const ex of gapCards) assert.match(first(ex).toLowerCase(), GAP_SHAPE, ex.id);
});

test('the filled gap is exactly what is spoken', () => {
  for (const ex of gapCards) {
    assert.equal(normalize(ex.prompt.replace(GAP, first(ex))), normalize(ex.say), ex.id);
  }
});

test('typing the whole word into a gap passes', () => {
  for (const ex of gapCards) {
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
  for (const ex of cards) assert.ok(!String(ex.base).includes('said "'), `${ex.id}: ${ex.base}`);
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
});

test('each rule has at least 30 exercises in its own lesson', () => {
  for (const lesson of lessons) {
    for (const rule of lesson.rules) {
      const n = lesson.exercises.filter((ex) => ex.ruleId === rule.id).length;
      assert.ok(n >= MIN_PER_RULE, `${rule.id}: ${n}`);
    }
  }
});

test('the removed plural transforms and register cards stay removed', () => {
  const ids = new Set(cards.map((ex) => ex.id));
  for (const l of ['u0-l1', 'u0-l2']) {
    for (const n of [18, 19, 20, 21, 22, 23, 24, 25]) assert.ok(!ids.has(`${l}-e${n}`), `${l}-e${n}`);
  }
});

// Accents are taught in lesson 4; before that, nothing may require one unless base gives the word.
const ACCENTED = /[àèéìòù]/;

test('no listen dictation in lessons 1–2 needs an accent', () => {
  for (const ex of cards.filter((e) => e.type === 'listen')) {
    for (const a of answerTexts(ex)) assert.ok(!ACCENTED.test(a), `${ex.id}: "${a}"`);
  }
});

test('a card whose every answer needs an accent glosses the accented words in base', () => {
  for (const ex of cards.filter((e) => e.type !== 'listen')) {
    if (!answerTexts(ex).every((a) => ACCENTED.test(a))) continue;
    const accented = normalize(first(ex)).split(' ').filter((w) => ACCENTED.test(w));
    for (const w of accented) assert.ok(words(ex.base).includes(words(w)), `${ex.id}: base lacks "${w}"`);
  }
});
