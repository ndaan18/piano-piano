import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, applyAccentShortcut, judge, isPass, diffChars, expandAnswer, acceptedAnswers, answerTexts, digitsToWords } from '../js/engine/checker.js';

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
test('meaning-changing accent (e/è) is a mistake', () => {
  assert.equal(judge(ex2, "l'amico e italiano").verdict, 'mistake');
});
test('accent-only difference outside the meaning pairs is accent', () => {
  assert.equal(judge({ answers: ['Perché no?'] }, 'perche no').verdict, 'accent');
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

const sorted = (a) => [...a].sort();

test('expandAnswer: optional part', () => {
  assert.deepEqual(expandAnswer('[Tu] sei stanca?'), ['Tu sei stanca?', 'sei stanca?']);
});
test('expandAnswer: alternatives with optional part', () => {
  assert.deepEqual(
    sorted(expandAnswer('{Signora, ha fame?|Ha fame[, signora]?}')),
    sorted(['Signora, ha fame?', 'Ha fame, signora?', 'Ha fame?']),
  );
});
test('expandAnswer: empty alternative', () => {
  assert.deepEqual(sorted(expandAnswer('Ciao{| Marco}!')), sorted(['Ciao!', 'Ciao Marco!']));
});
test('expandAnswer: nested/combined patterns are tidy', () => {
  const out = expandAnswer("{Scusi|Mi scusi}[, signora], dov'è{| il bagno}?");
  assert.equal(out.length, 8);
  for (const s of out) {
    assert.ok(!s.includes('  '), s);
    assert.ok(!s.includes(' ,'), s);
    assert.ok(!s.includes(',?'), s);
  }
});
test('expandAnswer: plain text is returned as is; unbalanced throws', () => {
  assert.deepEqual(expandAnswer('Ciao.'), ['Ciao.']);
  assert.throws(() => expandAnswer('[Tu sei'), /unbalanced pattern/);
  assert.throws(() => expandAnswer('Tu sei}'), /unbalanced pattern/);
  assert.throws(() => expandAnswer('{a|b'), /unbalanced pattern/);
});
test('acceptedAnswers expands entries, carries notes, and is memoised', () => {
  const e = { answers: ['Mangio.', { text: '[Io] sto mangiando.', note: 'n' }] };
  assert.deepEqual(acceptedAnswers(e), [
    { text: 'Mangio.' },
    { text: 'Io sto mangiando.', note: 'n' },
    { text: 'sto mangiando.', note: 'n' },
  ]);
  assert.equal(acceptedAnswers(e), acceptedAnswers(e));
  assert.deepEqual(answerTexts(e), ['Mangio.', 'Io sto mangiando.', 'sto mangiando.']);
});
test('digitsToWords', () => {
  assert.equal(digitsToWords('2 birre'), 'due birre');
  assert.equal(digitsToWords('21'), 'ventuno');
  assert.equal(digitsToWords('23'), 'ventitré');
  assert.equal(digitsToWords('28'), 'ventotto');
  assert.equal(digitsToWords('32'), 'trentadue');
  assert.equal(digitsToWords('100'), 'cento');
  assert.equal(digitsToWords('0'), 'zero');
  assert.equal(digitsToWords('1 birra'), '1 birra');
  assert.equal(digitsToWords('alle 8:30'), 'alle 8:30');
  assert.equal(digitsToWords('alle 8.30'), 'alle 8.30');
  assert.equal(digitsToWords('101'), '101');
});
test('normalize turns inner punctuation into spaces', () => {
  assert.equal(normalize('Rispondi tu? Ho le mani bagnate.'), normalize('Rispondi tu. Ho le mani bagnate'));
});
test('normalize keeps the apostrophe join and skips times when converting digits', () => {
  assert.equal(normalize("un' amica"), "un'amica");
  assert.equal(normalize('Alle 8:30, 2 birre!'), 'alle 8 30 due birre');
});
test('digits in input match number words; digits:false opts out', () => {
  assert.equal(judge({ answers: ['due birre'] }, '2 birre').verdict, 'correct');
  assert.equal(judge({ answers: ['due birre'], digits: false }, '2 birre').verdict, 'wrong');
});
test('judge returns the note of the matched object answer', () => {
  const e = { answers: ['Mangio.', { text: 'Sto mangiando.', note: 'Right! Mangio is the everyday choice.' }] };
  assert.deepEqual(judge(e, 'sto mangiando'), {
    verdict: 'correct',
    target: 'Mangio.',
    note: 'Right! Mangio is the everyday choice.',
  });
});
test('judge accepts any expansion of a pattern', () => {
  const e = { answers: ['Ha fame?', '{Signora, ha fame?|Ha fame, signora?}'] };
  assert.equal(judge(e, 'ha fame signora').verdict, 'correct');
});
test('typo is found inside an expanded answer', () => {
  assert.equal(judge({ answers: ['[Tu] sei stanchissima?'] }, 'sei stanchissema?').verdict, 'typo');
});
test('target is the text of an object first answer', () => {
  assert.equal(judge({ answers: [{ text: 'Vado.', note: 'x' }] }, 'zzz').target, 'Vado.');
});

// Meaning-changing accents (spec 5.3).
test('e written for è is a mistake that names the word needed', () => {
  const r = judge({ answers: ['La cena è pronta.'] }, 'La cena e pronta');
  assert.equal(r.verdict, 'mistake');
  assert.ok(r.message.includes('e means "and"'), r.message);
  assert.ok(r.message.includes('Here you need è'), r.message);
});
test('è written for e is a mistake that names the word needed', () => {
  const r = judge({ answers: ['Pane e vino.'] }, 'Pane è vino');
  assert.equal(r.verdict, 'mistake');
  assert.ok(r.message.includes('Here you need e'), r.message);
});
const accentPairs = [
  ['Sì, grazie.', 'Si, grazie', 'si means "oneself", sì means "yes".', 'sì'],
  ['Un tè caldo.', 'Un te caldo', 'te means "you" (after a preposition), tè means "tea".', 'tè'],
  ['Sono là.', 'Sono la', 'la means "the" or "her", là means "there".', 'là'],
  ['Sono lì.', 'Sono li', 'li means "them", lì means "there".', 'lì'],
  ['Lui dà il libro.', 'Lui da il libro', 'da means "from" or "at", dà means "gives".', 'dà'],
  ['Né pane né vino.', 'Ne pane ne vino', 'ne means "of it" or "some", né means "nor".', 'né'],
  ['Pensa solo a sé.', 'Pensa solo a se', 'se means "if", sé means "oneself".', 'sé'],
];
for (const [answer, input, message, needed] of accentPairs) {
  test(`accent pair: "${input}" for "${answer}" is a mistake`, () => {
    const r = judge({ answers: [answer] }, input);
    assert.equal(r.verdict, 'mistake');
    assert.equal(r.message, `${message} Here you need ${needed}.`);
  });
}

// Silent h (spec 5.4).
const silentH = [
  ['Ho sete.', 'O sete', 'ho', 'ho = I have, o = or'],
  ['Hai fame.', 'Ai fame', 'hai', 'hai = you have, ai = to the'],
  ['Ha fame.', 'A fame', 'ha', 'ha = has, a = to or at'],
  ['Hanno fame.', 'Anno fame', 'hanno', 'hanno = they have, anno = year'],
];
for (const [answer, input, w, gloss] of silentH) {
  test(`silent h: "${input}" for "${answer}" is a mistake`, () => {
    const r = judge({ answers: [answer] }, input);
    assert.equal(r.verdict, 'mistake');
    assert.equal(r.message, `Right sound! The h in ${w} is silent, but it's always written: ${gloss}.`);
  });
}
test('an explicit mistakes key wins over the silent h rule', () => {
  assert.equal(judge({ answers: ['Ho sete.'], mistakes: { 'O sete': 'custom' } }, 'O sete').message, 'custom');
});

// Word boundaries (spec 5.5).
test('signore for signora is wrong, not a typo', () => {
  assert.equal(judge({ answers: ['Buongiorno, signora!'] }, 'Buongiorno, signore!').verdict, 'wrong');
});
test('typo tolerance is kept for mid-word slips', () => {
  assert.notEqual(judge({ answers: ['Buongiorno, signora!'] }, 'Buongiorno, signroa!').verdict, 'typo');
  assert.equal(judge({ answers: ['Arrivederci!'] }, 'Arrivedreci!').verdict, 'wrong');
  assert.equal(judge({ answers: ['Buongiorno, signora!'] }, 'Buongiorno, signra!').verdict, 'typo');
});
test('a letter boundary (not only space/apostrophe) ends a word: edit before a hyphen is on the word end', () => {
  assert.equal(judge({ answers: ['il caffè-latte'] }, 'il caffa-latte').verdict, 'wrong');
});

// Whole word typed into a gap.
test('typing the whole word in a gap is correct with a note', () => {
  assert.deepEqual(judge({ prompt: 'La ___na è pronta.', answers: ['ce'] }, 'cena'), {
    verdict: 'correct',
    target: 'ce',
    note: 'Right word! Next time type just the missing letters: ce.',
  });
});
test('a wrong whole word in a gap is wrong', () => {
  assert.equal(judge({ prompt: 'La ___na è pronta.', answers: ['ce'] }, 'cina').verdict, 'wrong');
});
