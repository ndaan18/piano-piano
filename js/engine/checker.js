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

const isWordEnd = (s, i) => i + 1 === s.length || s[i + 1] === ' ';
const isGlue = (c) => c === "'" || c === ' ';

/**
 * True when `n` differs from `a` by exactly one edit that is tolerable as a typo.
 * Word endings carry grammar (ragazzo/ragazza), and apostrophes/spaces carry
 * elision (un'amica / un amica / l'amico / lamico), so an edit on the final
 * character of any word, or involving an apostrophe or space, is never a typo.
 * Where equivalent edits exist (repeated letters), all of them must be tolerable.
 */
function isTolerableTypo(a, n) {
  const diff = a.length - n.length;
  if (Math.abs(diff) > 1) return false;
  const [long, short] = diff >= 0 ? [a, n] : [n, a];
  let p = 0;
  while (p < short.length && long[p] === short[p]) p++;
  if (diff === 0) {
    if (p === a.length || a.slice(p + 1) !== n.slice(p + 1)) return false;
    return !isGlue(a[p]) && !isGlue(n[p]) && !isWordEnd(a, p);
  }
  if (long.slice(p + 1) !== short.slice(p)) return false;
  let s = 0;
  while (s < short.length && long[long.length - 1 - s] === short[short.length - 1 - s]) s++;
  for (let i = long.length - 1 - s; i <= p; i++) {
    if (isGlue(long[i]) || isWordEnd(long, i)) return false;
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

  // 5. edit distance 1, target longer than 4 characters, not on a word ending or apostrophe/space
  const close = accepted.find((a) => a.length > 4 && isTolerableTypo(a, n));
  if (close) {
    return { verdict: 'typo', message: 'Giusto, small typo.', target, diff: diffChars(input, close) };
  }

  // 6. wrong
  return { verdict: 'wrong', target, diff: diffChars(input, target) };
}
