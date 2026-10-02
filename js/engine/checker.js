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
  const acute = value.match(/^([\s\S]*)([eE])'$/);
  if (acute) return acute[1] + (acute[2] === 'e' ? 'é' : 'É');
  return value;
}

const stripAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

function levenshtein(a, b) {
  if (a === b) return 0;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = cur;
  }
  return prev[b.length];
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
  const accepted = [...exercise.answers, ...extraAnswers].map(normalize);
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

  // 5. edit distance 1, target longer than 4 characters
  const close = accepted.find((a) => a.length > 4 && levenshtein(a, n) === 1);
  if (close) {
    return { verdict: 'typo', message: 'Giusto, small typo.', target, diff: diffChars(input, close) };
  }

  // 6. wrong
  return { verdict: 'wrong', target, diff: diffChars(input, target) };
}
