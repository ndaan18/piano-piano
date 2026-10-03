// Answer checker (spec §6). Pure functions: no DOM, no globals.

const GRAVE = { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù', A: 'À', E: 'È', I: 'Ì', O: 'Ò', U: 'Ù' };

export const ACCENT_MESSAGE =
  'Almost: mind the accent. Accents change meaning, e.g. è "is" vs e "and".';

/** Lowercase, unify apostrophes/whitespace, drop inner commas and final ?!., */
export function normalize(s) {
  let out = String(s ?? '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  out = out.replace(/[?!.\s]+$/, '');
  return out.replace(/'\s+/g, "'");
}

/** Rewrites only the end of the string: vowel+` -> grave, e+' -> é. */
export function applyAccentShortcut(value) {
  const grave = value.match(/^([\s\S]*)([aeiouAEIOU])`$/);
  if (grave) return grave[1] + GRAVE[grave[2]];
  const acute = value.match(/^([\s\S]*)([eE])['’]$/);
  if (acute) return acute[1] + (acute[2] === 'e' ? 'é' : 'É');
  return value;
}

const stripAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

const isGlue = (c) => c === "'" || c === ' ';
const isConsonant = (c) => /[bcdfghjklmnpqrstvwxyz]/.test(c || '');

/** [start, end) of the word (maximal run without apostrophe/space) containing index i. */
function wordAt(s, i) {
  let start = i;
  let end = i;
  while (start > 0 && !isGlue(s[start - 1])) start--;
  while (end < s.length && !isGlue(s[end])) end++;
  return [start, end];
}

/** The letter at s[i] is a taught spelling: the h of ch/gh, or half of a double consonant. */
function isTaughtSpelling(s, i) {
  const c = s[i];
  if (c === 'h' && (s[i - 1] === 'c' || s[i - 1] === 'g')) return true;
  return isConsonant(c) && (s[i - 1] === c || s[i + 1] === c);
}

/**
 * True when an edit at index i of `s` (the edited character, in the string that
 * contains it) is tolerable as a typo: inside a word, not on its first or last
 * letter, and not a taught spelling. `targetWordLength` is the length of the
 * word in the expected answer; words of 4 letters or fewer never get a typo
 * (fai/vai, ha/a, un/in, sei/sai are different words).
 */
function isTolerableAt(s, i, targetWordLength) {
  if (isGlue(s[i]) || targetWordLength <= 4) return false;
  const [start, end] = wordAt(s, i);
  if (i === start || i === end - 1) return false;
  return !isTaughtSpelling(s, i);
}

/**
 * True when input `n` differs from accepted answer `a` by exactly one edit that is
 * tolerable as a typo, judged on the word the edit lands in. Word beginnings and
 * endings carry grammar (ragazzo/ragazza, ha/a), apostrophes/spaces carry elision
 * (un'amica / un amica), and ch/gh and double consonants are taught spellings
 * (chiave/ciave, nonno/nono), so none of those are typos. Where equivalent edits
 * exist (repeated letters), all of them must be tolerable.
 */
function isTolerableTypo(a, n) {
  const diff = a.length - n.length;
  if (Math.abs(diff) > 1) return false;
  const [long, short] = diff >= 0 ? [a, n] : [n, a];
  let p = 0;
  while (p < short.length && long[p] === short[p]) p++;
  if (diff === 0) {
    if (p === a.length || a.slice(p + 1) !== n.slice(p + 1)) return false;
    if (isGlue(n[p])) return false;
    const [start, end] = wordAt(a, p);
    return isTolerableAt(a, p, end - start) && !isTaughtSpelling(n, p);
  }
  if (long.slice(p + 1) !== short.slice(p)) return false;
  let s = 0;
  while (s < short.length && long[long.length - 1 - s] === short[short.length - 1 - s]) s++;
  for (let i = long.length - 1 - s; i <= p; i++) {
    // The target's word: in `a` itself when the input dropped a letter, or the
    // word of `a` just before the insertion point when the input added one.
    const [start, end] = wordAt(a, long === a ? i : Math.max(0, i - 1));
    const targetWordLength = end - start;
    if (!isTolerableAt(long, i, targetWordLength)) return false;
  }
  return true;
}

/**
 * Per-position comparison of normalised strings. `ch` is the target character;
 * if the input is longer, its surplus characters are appended with ok:false.
 */
export function diffChars(input, target) {
  const a = normalize(input);
  const b = normalize(target);
  const out = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    out.push({ ch: i < b.length ? b[i] : a[i], ok: a[i] === b[i] });
  }
  return out;
}

export function isPass(verdict) {
  return verdict === 'correct' || verdict === 'typo' || verdict === 'accent';
}

export function judge(exercise, input, extraAnswers = []) {
  const target = exercise.answers[0];
  const accepted = [...exercise.answers, ...(extraAnswers || [])].map(normalize);
  const n = normalize(input);

  // 2. exact
  if (accepted.includes(n)) return { verdict: 'correct', target };

  // 3. known mistake
  const mistakes = exercise.mistakes || {};
  for (const key of Object.keys(mistakes)) {
    if (normalize(key) === n) {
      return { verdict: 'mistake', message: mistakes[key], target, diff: diffChars(input, target) };
    }
  }

  // 4. accent-only difference
  const bare = stripAccents(n);
  if (accepted.some((a) => stripAccents(a) === bare)) {
    return { verdict: 'accent', message: ACCENT_MESSAGE, target };
  }

  // 5. edit distance 1, mid-word in a word longer than 4 letters, not a taught spelling
  const close = accepted.find((a) => isTolerableTypo(a, n));
  if (close) {
    return { verdict: 'typo', message: 'Giusto, small typo.', target, diff: diffChars(input, close) };
  }

  // 6. wrong
  return { verdict: 'wrong', target, diff: diffChars(input, target) };
}
