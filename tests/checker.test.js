import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, applyAccentShortcut, judge, isPass, diffChars } from '../js/engine/checker.js';

const ex = { answers: ['sei'], mistakes: { 'è': 'è is for Lei…' } };
const ex2 = { answers: ["l'amico è italiano"] };

test('exact match is correct', () => {
  assert.equal(judge(ex, 'sei').verdict, 'correct');
});
test('capitalised input (iOS autocapitalise) is correct', () => {
  assert.equal(judge(ex, 'Sei').verdict, 'correct');
});
test('surrounding whitespace and final punctuation are ignored', () => {
  assert.equal(judge(ex, ' sei. ').verdict, 'correct');
});
test('known mistake returns its explanation', () => {
  const r = judge(ex, 'è');
  assert.equal(r.verdict, 'mistake');
  assert.equal(r.message, 'è is for Lei…');
  assert.equal(r.target, 'sei');
  assert.ok(Array.isArray(r.diff));
});
test('curly apostrophe is accepted', () => {
  assert.equal(judge(ex2, 'l’amico è italiano').verdict, 'correct');
});
test('space after elision apostrophe is accepted', () => {
  assert.equal(judge(ex2, "l' amico è italiano").verdict, 'correct');
});
test('accent-only difference is accent', () => {
  assert.equal(judge(ex2, "l'amico e italiano").verdict, 'accent');
});
test('one-character typo on a long target is typo with diff', () => {
  const r = judge(ex2, "l'amico è italino");
  assert.equal(r.verdict, 'typo');
  assert.ok(r.diff.some((d) => !d.ok));
});
test('unrelated answer is wrong with the target and a diff', () => {
  const r = judge(ex, 'sono');
  assert.equal(r.verdict, 'wrong');
  assert.equal(r.target, 'sei');
  assert.ok(r.diff.some((d) => !d.ok));
});
test('extra answers are accepted', () => {
  assert.equal(judge(ex, 'sì', ['sì']).verdict, 'correct');
});
test('isPass is true for correct/typo/accent only', () => {
  for (const v of ['correct', 'typo', 'accent']) assert.equal(isPass(v), true);
  for (const v of ['mistake', 'wrong']) assert.equal(isPass(v), false);
});
test('applyAccentShortcut: backtick after e/vowel gives grave', () => {
  assert.equal(applyAccentShortcut('perche`'), 'perchè');
  assert.equal(applyAccentShortcut('e`'), 'è');
});
test("applyAccentShortcut: e' gives é", () => {
  assert.equal(applyAccentShortcut("perche'"), 'perché');
});
test('applyAccentShortcut: only touches the end of the string', () => {
  assert.equal(applyAccentShortcut('a`b'), 'a`b');
  assert.equal(applyAccentShortcut("l'"), "l'");
  assert.equal(applyAccentShortcut('perche'), 'perche');
});
test('4-character target: one-character difference is wrong, not typo', () => {
  assert.equal(judge({ answers: ['sono'] }, 'sona').verdict, 'wrong');
});
test('normalize handles apostrophes, commas and trailing punctuation', () => {
  assert.equal(normalize('  L’ Amico,  Ciao?! '), "l'amico ciao");
  assert.equal(normalize('‘ok`'), "'ok'");
  assert.equal(normalize('un\'  amica'), "un'amica");
});
test("un'amica is not the same as una amica", () => {
  assert.equal(judge({ answers: ["un'amica"] }, 'una amica').verdict, 'wrong');
});
test('diffChars aligns by position on normalised strings', () => {
  assert.deepEqual(diffChars('Sai', 'sei'), [
    { ch: 's', ok: true },
    { ch: 'e', ok: false },
    { ch: 'i', ok: true },
  ]);
});
test('typo diff is computed against the closest accepted answer', () => {
  const r = judge({ answers: ['buongiorno', 'buonasera'] }, 'buonasara');
  assert.equal(r.verdict, 'typo');
  assert.equal(r.target, 'buongiorno');
  assert.equal(r.diff.map((d) => d.ch).join(''), 'buonasera');
});
