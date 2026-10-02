import test from 'node:test';
import assert from 'node:assert/strict';
import {
  startSession, recordAnswer, overruleAnswer, nextCard, isFinished, segmentStates, shouldGrade,
  feedbackFor, markTarget, answerMarks, applyAnswer, applyOverrule, accentBody, restoreSession,
} from '../js/ui/practice-card.js';
import { judge, diffChars, ACCENT_MESSAGE } from '../js/engine/checker.js';
import { defaultState } from '../js/store.js';

const cards = (...ids) => ids.map((exerciseId) => ({ exerciseId, hints: false }));
const now = new Date(2026, 9, 2, 12, 0);

test('startSession copies the cards and starts at the first one', () => {
  const input = cards('a', 'b');
  const s = startSession(input);
  assert.deepEqual(s, { queue: input, pos: 0, results: [] });
  assert.notEqual(s.queue, input);
  assert.equal(isFinished(s), false);
  assert.equal(isFinished(startSession([])), true);
});

test('a pass records the result and leaves the queue alone', () => {
  const s = recordAnswer(startSession(cards('a', 'b', 'c')), { verdict: 'correct', pass: true }, 'practice');
  assert.deepEqual(s.results, [{ exerciseId: 'a', verdict: 'correct', pass: true, retry: false }]);
  assert.deepEqual(s.queue.map((c) => c.exerciseId), ['a', 'b', 'c']);
});

test('a fail re-queues a retry copy 3 cards later, except in checkpoint mode', () => {
  const base = startSession(cards('a', 'b', 'c', 'd', 'e'));
  const s = recordAnswer(base, { verdict: 'wrong', pass: false }, 'practice');
  assert.deepEqual(s.queue.map((c) => c.exerciseId), ['a', 'b', 'c', 'a', 'd', 'e']);
  assert.equal(s.queue[3].retry, true);
  const cp = recordAnswer(base, { verdict: 'wrong', pass: false }, 'checkpoint');
  assert.equal(cp.queue.length, 5);
});

test('a retry card is not re-queued again', () => {
  let s = startSession(cards('a', 'b'));
  s = recordAnswer(s, { verdict: 'wrong', pass: false }, 'practice'); // a, b, a*
  s = nextCard(nextCard(s));
  assert.equal(s.queue[s.pos].retry, true);
  s = recordAnswer(s, { verdict: 'wrong', pass: false }, 'practice');
  assert.equal(s.queue.length, 3);
  assert.equal(s.results[2].retry, true);
});

test('overruling turns the answer into a pass and removes its pending retry', () => {
  let s = startSession(cards('a', 'b', 'c', 'd'));
  s = recordAnswer(s, { verdict: 'mistake', pass: false }, 'practice');
  assert.equal(s.queue.length, 5);
  s = overruleAnswer(s);
  assert.deepEqual(s.queue.map((c) => c.exerciseId), ['a', 'b', 'c', 'd']);
  assert.deepEqual(s.results[0], { exerciseId: 'a', verdict: 'mistake', pass: true, retry: false, overruled: true });
});

test('overruling a retry removes nothing else from the queue', () => {
  let s = startSession(cards('a', 'b'));
  s = recordAnswer(s, { verdict: 'wrong', pass: false }, 'practice');
  s = nextCard(nextCard(s));
  s = recordAnswer(s, { verdict: 'wrong', pass: false }, 'practice');
  s = overruleAnswer(s);
  assert.deepEqual(s.queue.map((c) => c.exerciseId), ['a', 'b', 'a']);
  assert.equal(s.results[2].pass, true);
});

test('segmentStates marks passes, misses and the current card', () => {
  let s = startSession(cards('a', 'b', 'c'));
  assert.deepEqual(segmentStates(s), ['now', '', '']);
  s = recordAnswer(s, { verdict: 'wrong', pass: false }, 'checkpoint');
  assert.deepEqual(segmentStates(s), ['miss', '', '']);
  s = nextCard(s);
  s = recordAnswer(s, { verdict: 'typo', pass: true }, 'checkpoint');
  assert.deepEqual(segmentStates(s), ['miss', 'done', '']);
  s = nextCard(s);
  assert.deepEqual(segmentStates(s), ['miss', 'done', 'now']);
});

test('shouldGrade: every mode but drill, first attempts only', () => {
  const card = { exerciseId: 'a', hints: false };
  for (const mode of ['practice', 'checkpoint', 'review']) assert.equal(shouldGrade(mode, card), true);
  assert.equal(shouldGrade('drill', card), false);
  assert.equal(shouldGrade('practice', { ...card, retry: true }), false);
});

test('applyAnswer grades the card and logs the answer', () => {
  const draft = defaultState();
  const before = applyAnswer(draft, { card: { exerciseId: 'a' }, verdict: 'wrong', pass: false, mode: 'practice', now });
  assert.equal(before, undefined);
  assert.equal(draft.cards.a.box, 1);
  assert.equal(draft.cards.a.lastWrong, '2026-10-02');
  assert.deepEqual(draft.log, [{ exerciseId: 'a', date: '2026-10-02', verdict: 'wrong', pass: false, mode: 'practice' }]);
});

test('applyAnswer in drill mode and on retries only logs', () => {
  const draft = defaultState();
  applyAnswer(draft, { card: { exerciseId: 'a' }, verdict: 'correct', pass: true, mode: 'drill', now });
  applyAnswer(draft, { card: { exerciseId: 'b', retry: true }, verdict: 'correct', pass: true, mode: 'practice', now });
  assert.deepEqual(draft.cards, {});
  assert.equal(draft.log.length, 2);
  assert.equal(draft.log[1].retry, true);
});

test('applyOverrule stores the answer, reports it and undoes the fail', () => {
  const draft = defaultState();
  draft.cards.a = { box: 3, due: '2026-10-01', seen: 4, correct: 3, lastWrong: null };
  const card = { exerciseId: 'a' };
  const before = applyAnswer(draft, { card, verdict: 'wrong', pass: false, mode: 'review', now });
  assert.equal(draft.cards.a.box, 1);
  applyOverrule(draft, { card, input: "l' hotel", before, mode: 'review', now });
  assert.deepEqual(draft.extraAnswers.a, ["l' hotel"]);
  assert.deepEqual(draft.reports, [{ exerciseId: 'a', input: "l' hotel", date: '2026-10-02' }]);
  assert.equal(draft.cards.a.box, 4);
  assert.equal(draft.cards.a.lastWrong, null);
  assert.equal(draft.cards.a.seen, 5);
  assert.equal(draft.log.at(-1).pass, true);
  assert.equal(draft.log.at(-1).overruled, true);
  // a second overrule with the same answer doesn't duplicate it
  applyOverrule(draft, { card, input: "l' hotel", before, mode: 'review', now });
  assert.deepEqual(draft.extraAnswers.a, ["l' hotel"]);
});

test('applyOverrule on a drill card leaves SRS untouched', () => {
  const draft = defaultState();
  applyOverrule(draft, { card: { exerciseId: 'a' }, input: 'x', before: undefined, mode: 'drill', now });
  assert.deepEqual(draft.cards, {});
  assert.deepEqual(draft.extraAnswers.a, ['x']);
});

const ex = {
  id: 'e', type: 'type', prompt: '___ zio è qui.', answers: ['Lo'], why: 'z takes lo.',
  mistakes: { il: 'zio starts with z: lo zio.' },
};

test('feedbackFor: verdict copy, tone and explanation', () => {
  assert.deepEqual(feedbackFor({ verdict: 'correct' }, ex, 'practice'),
    { tone: 'ok', title: 'Giusto.', body: 'z takes lo.', showTarget: false, marked: false });
  assert.deepEqual(feedbackFor({ verdict: 'typo' }, ex, 'practice'),
    { tone: 'ok', title: 'Giusto, small typo.', body: 'z takes lo.', showTarget: true, marked: true });
  assert.deepEqual(feedbackFor({ verdict: 'accent', message: ACCENT_MESSAGE }, ex, 'practice'),
    { tone: 'close', title: 'Almost: mind the accent.', body: accentBody(), showTarget: true, marked: false });
  assert.deepEqual(feedbackFor({ verdict: 'mistake', message: 'zio starts with z: lo zio.' }, ex, 'practice'),
    { tone: 'wrong', title: 'Quasi.', body: 'zio starts with z: lo zio.', showTarget: true, marked: true });
  assert.deepEqual(feedbackFor({ verdict: 'wrong' }, ex, 'review'),
    { tone: 'wrong', title: 'Quasi.', body: 'z takes lo.', showTarget: true, marked: true });
});

test('accentBody is ACCENT_MESSAGE without the repeated verdict', () => {
  assert.equal(accentBody(), 'Accents change meaning, e.g. è "is" vs e "and".');
  assert.ok(ACCENT_MESSAGE.endsWith(accentBody()));
});

test('feedbackFor in checkpoint mode shows only right or wrong', () => {
  assert.deepEqual(feedbackFor({ verdict: 'accent' }, ex, 'checkpoint'),
    { tone: 'ok', title: 'Giusto.', body: null, showTarget: false, marked: false });
  assert.deepEqual(feedbackFor({ verdict: 'mistake', message: 'm' }, ex, 'checkpoint'),
    { tone: 'wrong', title: 'Quasi.', body: null, showTarget: false, marked: false });
});

const text = (marks) => marks.map((m) => m.ch).join('');
const bad = (marks) => marks.filter((m) => !m.ok).map((m) => m.ch).join('');

test('markTarget keeps the original case and punctuation of the answer', () => {
  const diff = diffChars('il zaino è pesante', 'Lo zaino è pesante.');
  const m = markTarget('Lo zaino è pesante.', diff);
  assert.equal(text(m), 'Lo zaino è pesante.');
  assert.equal(bad(m), 'Lo');
});

test('markTarget handles commas and apostrophes the normaliser rewrites', () => {
  const diff = diffChars("scusi dove il bagno", "Scusi, dov'è il bagno?");
  const m = markTarget("Scusi, dov'è il bagno?", diff);
  assert.equal(text(m), "Scusi, dov'è il bagno?");
  assert.ok(m.find((x) => x.ch === 'S').ok);
});

test('markTarget shows only the answer, never surplus input characters', () => {
  const m = markTarget('lo', diffChars('loo', 'lo'));
  assert.equal(text(m), 'lo');
  const long = "Prende l'aperitivo con noi?";
  const m2 = markTarget(long, diffChars("Prende l'aperitivo insieme a noi?", long));
  assert.equal(text(m2), long);
  assert.ok(bad(m2).length > 0);
});

test('markTarget returns null when the diff belongs to another answer', () => {
  assert.equal(markTarget('Lo zio arriva domani.', diffChars('domani arriva lo zia', 'Domani arriva lo zio.')), null);
});

test('answerMarks finds the accepted answer a typo diff was made against', () => {
  const exercise = { answers: ['Lo zio arriva domani.', 'Domani arriva lo zio.'] };
  const res = judge(exercise, 'Domani ariva lo zio');
  assert.equal(res.verdict, 'typo');
  const m = answerMarks(res, exercise.answers);
  assert.equal(text(m), 'Domani arriva lo zio.');
  assert.equal(bad(m).length > 0, true);
});

test('answerMarks without a diff shows the target unmarked', () => {
  const m = answerMarks({ verdict: 'accent', target: "Dov'è?" }, []);
  assert.equal(text(m), "Dov'è?");
  assert.equal(bad(m), '');
});

test('restoreSession accepts a saved snapshot whose cards all still exist', () => {
  const known = new Set(['a', 'b']);
  const lookup = (id) => (known.has(id) ? { id } : undefined);
  const saved = {
    queue: cards('a', 'b'),
    pos: 1,
    results: [{ exerciseId: 'a', verdict: 'correct', pass: true, retry: false }],
  };
  assert.deepEqual(restoreSession(saved, lookup), saved);
  assert.equal(restoreSession({ ...saved, queue: cards('a', 'gone') }, lookup), null);
  assert.equal(restoreSession({ ...saved, pos: 0 }, lookup), null);
  assert.equal(restoreSession({ ...saved, pos: 2, results: [...saved.results, saved.results[0]] }, lookup), null);
  assert.equal(restoreSession({ queue: 'x', pos: 0, results: [] }, lookup), null);
  assert.equal(restoreSession(null, lookup), null);
});
