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

test('typo is refused when the edit is on a word ending (grammar)', () => {
  assert.equal(judge({ answers: ['ragazza'] }, 'ragazzo').verdict, 'wrong');
  assert.equal(judge({ answers: ['ragazza'] }, 'ragazz').verdict, 'wrong');
  assert.equal(judge({ answers: ['ragazza'] }, 'ragazzaa').verdict, 'wrong');
  assert.equal(judge({ answers: ['buona sera'] }, 'buonn sera').verdict, 'wrong');
  assert.equal(judge({ answers: ['buona sera'] }, 'buona sero').verdict, 'wrong');
});
test('typo is refused when the edit involves an apostrophe or space', () => {
  assert.equal(judge({ answers: ["un'amica"] }, 'un amica').verdict, 'wrong');
  assert.equal(judge({ answers: ["l'amico"] }, 'lamico').verdict, 'wrong');
  assert.equal(judge({ answers: ['buona sera'] }, 'buonasera').verdict, 'wrong');
  assert.ok(judge({ answers: ["un'amica"] }, 'un amica').diff.some((d) => !d.ok));
});
test('typo is still given for mid-word edits (substitution, deletion, insertion)', () => {
  assert.equal(judge({ answers: ['stanco'] }, 'stinco').verdict, 'typo');
  assert.equal(judge({ answers: ['prendere'] }, 'prendre').verdict, 'typo');
  assert.equal(judge({ answers: ['buona sera'] }, 'buoma sera').verdict, 'typo');
  assert.equal(judge({ answers: ['buona giornata'] }, 'buona giornaata').verdict, 'typo');
  assert.equal(judge({ answers: ["l'amico è italiano"] }, "l'amico è italino").verdict, 'typo');
});
test("applyAccentShortcut: curly e’ (iOS smart punctuation) gives é", () => {
  assert.equal(applyAccentShortcut('perche’'), 'perché');
});
test('judge tolerates null extraAnswers', () => {
  assert.equal(judge(ex, 'x', null).verdict, 'wrong');
  assert.equal(judge(ex, 'sei', null).verdict, 'correct');
});

// Typo tolerance is judged on the word the edit lands in (final review, finding 1).
const notTypo = [
  // h after c/g is a taught spelling
  ['ti piace il gelato', 'ti piache il gelato'],
  ['un gelato al cioccolato', 'un gelato al chioccolato'],
  ['le chiavi', 'le ciavi'],
  ['perché', 'percé'],
  ['spaghetti', 'spagetti'],
  ['Bianchi', 'Bianci'],
  // short words: one letter is a different word
  ['ho sete', 'o sete'],
  ['hai la chiave', 'ai la chiave'],
  ['Giulia ha una zia', 'Giulia a una zia'],
  ['hanno', 'anno'],
  ['Cosa fai', 'Cosa vai'],
  ['Vado', 'Vedo'],
  ['Sei', 'Sai'],
  ['Un amico', 'In amico'],
  ['Gli amici', 'Li amici'],
  // double consonants change words
  ['il nonno', 'il nono'],
  ['prendere', 'prenddere'],
];
for (const [answer, input] of notTypo) {
  test(`"${input}" for "${answer}" is not a typo`, () => {
    const r = judge({ answers: [answer] }, input);
    assert.notEqual(r.verdict, 'typo');
    assert.ok(r.diff.some((d) => !d.ok));
  });
}
test('an edit on the first letter of a long word is not a typo', () => {
  assert.equal(judge({ answers: ['il gelato'] }, 'il belato').verdict, 'wrong');
  assert.equal(judge({ answers: ['il gelato'] }, 'il ggelato').verdict, 'wrong');
});
test('substitutions that make or break ch/gh or a double consonant are not typos', () => {
  assert.equal(judge({ answers: ['la chiave'] }, 'la ciiave').verdict, 'wrong');
  assert.equal(judge({ answers: ['il nonno'] }, 'il nonmo').verdict, 'wrong');
  assert.equal(judge({ answers: ['la cucina'] }, 'la cuciina').verdict, 'typo');
});
test('genuine mid-word slips in long words are still typos', () => {
  assert.equal(judge({ answers: ['italiano'] }, 'italino').verdict, 'typo');
  assert.equal(judge({ answers: ['prendere'] }, 'prendre').verdict, 'typo');
  assert.equal(judge({ answers: ['Un amico italiano'] }, 'Un amico itaiano').verdict, 'typo');
});
