// Answer checker (spec §6). Pure functions: no DOM, no globals.

const GRAVE = { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù', A: 'À', E: 'È', I: 'Ì', O: 'Ò', U: 'Ù' };

export const ACCENT_MESSAGE =
  'Almost: mind the accent. Accents change meaning, e.g. è "is" vs e "and".';

const UNITS = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove',
  'dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove'];
const TENS = ['', '', 'venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta'];

/** Italian word for a whole number 0-100. */
function numberWord(n) {
  if (n === 100) return 'cento';
  if (n < 20) return UNITS[n];
  const tens = TENS[Math.floor(n / 10)];
  const unit = n % 10;
  if (unit === 0) return tens;
  const stem = unit === 1 || unit === 8 ? tens.slice(0, -1) : tens;
  return stem + (unit === 3 ? 'tré' : UNITS[unit]);
}

/**
 * Replaces whole-token numbers 0-100 with Italian words ("2 birre" -> "due birre").
 * 1 stays (un/uno/una is grammar); a token with a digit-separator (8:30, 8.30) is
 * left alone. Trailing sentence punctuation does not stop a token converting.
 */
export function digitsToWords(s) {
  return String(s ?? '').replace(/(^|\s)(\d+)([?!.;:,]*)(?=\s|$)/g, (m, pre, num, post) => {
    const n = Number(num);
    if (num === '1' || num.length > 3 || (num.length > 1 && num[0] === '0') || n > 100) return m;
    return pre + numberWord(n) + post;
  });
}

/** Lowercase, unify apostrophes/whitespace, turn ? ! . ; : , into spaces, optionally spell out digits. */
export function normalize(s, { digits = true } = {}) {
  let out = String(s ?? '').normalize('NFC');
  if (digits) out = digitsToWords(out);
  return out
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[?!.;:,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/'\s+/g, "'");
}

const unbalanced = () => new Error('unbalanced pattern');

/** Parses a sequence starting at s[i]; returns [strings, next index]. Stops at ] } or | when nested. */
function parseSeq(s, i, nested) {
  let results = [''];
  while (i < s.length) {
    const c = s[i];
    if (c === ']' || c === '}') {
      if (!nested) throw unbalanced();
      break;
    }
    if (c === '|' && nested) break;
    let parts;
    if (c === '[') {
      const [inner, next] = parseSeq(s, i + 1, true);
      if (s[next] !== ']') throw unbalanced();
      parts = [...inner, ''];
      i = next + 1;
    } else if (c === '{') {
      parts = [];
      let next = i;
      do {
        const [alt, after] = parseSeq(s, next + 1, true);
        parts.push(...alt);
        next = after;
      } while (s[next] === '|');
      if (s[next] !== '}') throw unbalanced();
      i = next + 1;
    } else {
      parts = [c];
      i++;
    }
    results = results.flatMap((r) => parts.map((p) => r + p));
  }
  return [results, i];
}

const tidy = (s) => s
  .replace(/\s+/g, ' ')
  .replace(/ +([,.?!])/g, '$1')
  .replace(/,+(?=[.?!]|$)/g, '')
  .trim();

/** Every concrete string a pattern allows: [x] optional, {a|b} alternatives, nestable. */
export function expandAnswer(pattern) {
  const [results] = parseSeq(String(pattern), 0, false);
  return [...new Set(results.map(tidy))];
}

const accepted = new WeakMap();

/** All accepted answers of an exercise as [{ text, note? }], patterns expanded. Memoised per exercise. */
export function acceptedAnswers(exercise) {
  let list = accepted.get(exercise);
  if (!list) {
    list = exercise.answers.flatMap((a) => {
      const obj = typeof a === 'string' ? { text: a } : a;
      return expandAnswer(obj.text).map((text) => (obj.note ? { text, note: obj.note } : { text }));
    });
    accepted.set(exercise, list);
  }
  return list;
}

/** The plain accepted answer texts of an exercise. */
export const answerTexts = (exercise) => acceptedAnswers(exercise).map((a) => a.text);

/** Rewrites only the end of the string: vowel+` -> grave, e+' -> é. */
export function applyAccentShortcut(value) {
  const grave = value.match(/^([\s\S]*)([aeiouAEIOU])`$/);
  if (grave) return grave[1] + GRAVE[grave[2]];
  const acute = value.match(/^([\s\S]*)([eE])['’]$/);
  if (acute) return acute[1] + (acute[2] === 'e' ? 'é' : 'É');
  return value;
}

/** Accented words that change meaning when written without the accent (spec 5.3). */
export const ACCENT_PAIRS = {
  'è': { plain: 'e', message: 'e means "and", è means "is".' },
  'sì': { plain: 'si', message: 'si means "oneself", sì means "yes".' },
  'tè': { plain: 'te', message: 'te means "you" (after a preposition), tè means "tea".' },
  'là': { plain: 'la', message: 'la means "the" or "her", là means "there".' },
  'lì': { plain: 'li', message: 'li means "them", lì means "there".' },
  'dà': { plain: 'da', message: 'da means "from" or "at", dà means "gives".' },
  'né': { plain: 'ne', message: 'ne means "of it" or "some", né means "nor".' },
  'sé': { plain: 'se', message: 'se means "if", sé means "oneself".' },
};

/** Forms of avere whose h is silent but always written, and what they turn into without it (spec 5.4). */
export const SILENT_H = { ho: 'o', hai: 'ai', ha: 'a', hanno: 'anno' };
export const SILENT_H_GLOSS = {
  ho: 'ho = I have, o = or',
  hai: 'hai = you have, ai = to the',
  ha: 'ha = has, a = to or at',
  hanno: 'hanno = they have, anno = year',
};

const stripAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

// A word boundary is anything that is not a letter (space, apostrophe, hyphen, digit...).
const isLetter = (c) => /\p{L}/u.test(c || '');
const isGlue = (c) => !isLetter(c);
const isConsonant = (c) => /[bcdfghjklmnpqrstvwxyz]/.test(c || '');

/** [start, end) of the word (maximal run of letters) containing index i. */
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
export function diffChars(input, target, opts) {
  const a = normalize(input, opts);
  const b = normalize(target, opts);
  const out = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    out.push({ ch: i < b.length ? b[i] : a[i], ok: a[i] === b[i] });
  }
  return out;
}

export function isPass(verdict) {
  return verdict === 'correct' || verdict === 'typo' || verdict === 'accent';
}

/** Letter runs and the separators between them, so two strings can be compared token by token. */
const tokens = (s) => s.match(/\p{L}+|[^\p{L}]+/gu) || [];

/** Message for the first meaning-changing accent pair that separates input `n` from answer `a`, or null. */
function accentPairMessage(a, n) {
  const ta = tokens(a);
  const tn = tokens(n);
  if (ta.length !== tn.length) return null;
  for (let i = 0; i < ta.length; i++) {
    if (ta[i] === tn[i]) continue;
    const accented = Object.hasOwn(ACCENT_PAIRS, ta[i]) ? ta[i] : tn[i];
    const pair = Object.hasOwn(ACCENT_PAIRS, accented) ? ACCENT_PAIRS[accented] : null;
    const other = accented === ta[i] ? tn[i] : ta[i];
    if (pair && other === pair.plain) return `${pair.message} Here you need ${ta[i]}.`;
  }
  return null;
}

/** Message when `n` is answer `a` with one of ho/hai/ha/hanno written without its h, or null. */
function silentHMessage(a, n) {
  const ta = tokens(a);
  for (let i = 0; i < ta.length; i++) {
    const without = Object.hasOwn(SILENT_H, ta[i]) ? SILENT_H[ta[i]] : null;
    if (without && [...ta.slice(0, i), without, ...ta.slice(i + 1)].join('') === n) {
      return `Right sound! The h in ${ta[i]} is silent, but it's always written: ${SILENT_H_GLOSS[ta[i]]}.`;
    }
  }
  return null;
}

/** The letters of the word the first ___ gap sits in: [before, after], or null without a gap. */
function gapContext(prompt) {
  const at = String(prompt ?? '').indexOf('___');
  if (at < 0) return null;
  const before = prompt.slice(0, at).match(/\p{L}*$/u)[0];
  const after = prompt.slice(at + 3).match(/^\p{L}*/u)[0];
  return [before, after];
}

export function judge(exercise, input, extraAnswers = []) {
  const first = exercise.answers[0];
  const target = typeof first === 'string' ? first : first.text;
  const opts = { digits: exercise.digits !== false };
  const entries = [...acceptedAnswers(exercise), ...(extraAnswers || []).map((text) => ({ text }))]
    .map((a) => ({ ...a, norm: normalize(a.text, opts) }));
  const norms = entries.map((a) => a.norm);
  const n = normalize(input, opts);
  const diff = (t) => diffChars(input, t, opts);

  // 2. exact
  const hit = entries.find((a) => a.norm === n);
  if (hit) return hit.note ? { verdict: 'correct', target, note: hit.note } : { verdict: 'correct', target };

  // 3. known mistake
  const mistakes = exercise.mistakes || {};
  for (const key of Object.keys(mistakes)) {
    if (normalize(key, opts) === n) {
      return { verdict: 'mistake', message: mistakes[key], target, diff: diff(target) };
    }
  }

  // 4. accent-only difference: a meaning-changing pair (e/è, la/là...) is a mistake
  const bare = stripAccents(n);
  const accentOnly = norms.filter((a) => stripAccents(a) === bare);
  for (const a of accentOnly) {
    const message = accentPairMessage(a, n);
    if (message) return { verdict: 'mistake', message, target, diff: diff(a) };
  }

  // 5. silent h: ho/hai/ha/hanno written without the h
  for (const a of norms) {
    const message = silentHMessage(a, n);
    if (message) return { verdict: 'mistake', message, target, diff: diff(a) };
  }

  // 6. any other accent-only difference passes
  if (accentOnly.length) {
    return { verdict: 'accent', message: ACCENT_MESSAGE, target };
  }

  // 7. the whole word typed into a gap
  const gap = gapContext(exercise.prompt);
  if (gap) {
    const [before, after] = gap;
    if (entries.some((a) => normalize(before + a.text + after, opts) === n)) {
      return {
        verdict: 'correct',
        target,
        note: `Right word! Next time type just the missing letters: ${target}.`,
      };
    }
  }

  // 8. edit distance 1, mid-word in a word longer than 4 letters, not a taught spelling
  const close = norms.find((a) => isTolerableTypo(a, n));
  if (close) {
    return { verdict: 'typo', message: 'Giusto, small typo.', target, diff: diff(close) };
  }

  // 9. wrong
  return { verdict: 'wrong', target, diff: diff(target) };
}
