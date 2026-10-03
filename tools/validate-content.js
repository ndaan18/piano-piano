// Content validator (spec §10). `validateUnit` is pure; the CLI below runs it
// over every loadable unit: `node tools/validate-content.js` (or `npm run validate`).

import { pathToFileURL } from 'node:url';
import { expandAnswer, normalize } from '../js/engine/checker.js';

const TYPES = new Set(['recognise', 'type', 'transform', 'build', 'listen', 'register']);
const REGS = new Set(['tu', 'lei', 'neutral']);
const NEEDS_CONTEXT = new Set(['transform', 'build', 'register']);
const MIN_PER_RULE = 30;

const MAX_EXPANSIONS = 64;
const UNIT0_GAP_LESSONS = new Set(['u0-l1', 'u0-l2', 'u0-l3']);
const GAP_SHAPE = /^[bcdfghlmnpqrstvz]+i?[aeiouàèéìòù]$/;
const PATTERN_CHARS = /[[\]{}|]/;

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';
const answerText = (a) => (typeof a === 'string' ? a : a?.text);
// Whole word or phrase, after normalisation (so punctuation and case do not matter).
const containsPhrase = (say, target) => ` ${normalize(say)} `.includes(` ${normalize(target)} `);

/** Checks the answers list; returns the plain texts of every expanded answer. */
function checkAnswers(ex, id, errors) {
  const entries = Array.isArray(ex.answers) ? ex.answers : [];
  const texts = [];
  entries.forEach((entry) => {
    const text = answerText(entry);
    if (!nonEmpty(text)) {
      errors.push(`${id}: empty answer`);
      return;
    }
    try {
      const expanded = expandAnswer(text);
      if (expanded.length > MAX_EXPANSIONS) errors.push(`${id}: answer "${text}" expands to ${expanded.length} strings (max ${MAX_EXPANSIONS})`);
      texts.push(...expanded);
    } catch {
      errors.push(`${id}: unbalanced pattern in answer "${text}"`);
    }
  });
  const first = answerText(entries[0]);
  if (nonEmpty(first) && PATTERN_CHARS.test(first)) errors.push(`${id}: answers[0] must be plain text (no [ ] { } |)`);
  return texts;
}

function checkExercise(ex, where, ruleIds, errors, unit, lesson) {
  const id = ex.id || where;
  if (!TYPES.has(ex.type)) errors.push(`${id}: unknown type "${ex.type}"`);
  if (!REGS.has(ex.reg)) errors.push(`${id}: reg "${ex.reg}" is not tu, lei or neutral`);
  if (!Number.isInteger(ex.rung) || ex.rung < 1 || ex.rung > 5) errors.push(`${id}: rung "${ex.rung}" is not 1–5`);
  const hasAnswers = Array.isArray(ex.answers) && ex.answers.some((a) => nonEmpty(answerText(a)));
  if (!hasAnswers) errors.push(`${id}: missing answers`);
  const answers = checkAnswers(ex, id, errors);
  for (const key of Object.keys(ex.mistakes || {})) {
    if (PATTERN_CHARS.test(key)) errors.push(`${id}: mistake keys must be plain text ("${key}")`);
  }
  const target = answerText(ex.answers?.[0]);
  if (!nonEmpty(ex.why)) errors.push(`${id}: missing why`);
  if (!ruleIds.has(ex.ruleId)) errors.push(`${id}: unknown ruleId "${ex.ruleId}"`);
  if (ex.type === 'recognise') {
    const options = Array.isArray(ex.options) ? ex.options : [];
    if (options.length < 2 || options.length > 4) errors.push(`${id}: recognise needs 2–4 options`);
    if (!options.some((o) => answers.includes(o))) errors.push(`${id}: recognise options don't include an answer`);
  }
  if (unit?.audioFirst && (ex.type === 'recognise' || ex.type === 'type')) {
    if (!nonEmpty(ex.say)) errors.push(`${id}: needs say (${ex.type} card in an audioFirst unit)`);
    else if (ex.type === 'recognise' && nonEmpty(target) && !containsPhrase(ex.say, target)) {
      errors.push(`${id}: say must contain the answer "${target}" as a whole word or phrase`);
    }
  }
  if (unit?.audioFirst && unit.id === 0 && UNIT0_GAP_LESSONS.has(lesson?.id) && ex.type === 'type' && nonEmpty(target)) {
    if (!GAP_SHAPE.test(target.toLowerCase())) errors.push(`${id}: gap shape: "${target}" must be the letter group through the vowel you hear`);
    if (nonEmpty(ex.say) && normalize(String(ex.prompt ?? '').replace(/_{2,}/, target)) !== normalize(ex.say)) {
      errors.push(`${id}: gap must match say ("${ex.prompt}" with "${target}" is not "${ex.say}")`);
    }
  }
  if (NEEDS_CONTEXT.has(ex.type) && !nonEmpty(ex.base) && !nonEmpty(ex.en)) {
    errors.push(`${id}: ${ex.type} needs a base or en context line`);
  }
}

/**
 * Returns error messages (empty = valid). Warnings (draft-only issues) are pushed
 * onto the optional `warnings` array.
 */
export function validateUnit(unit, warnings = []) {
  const errors = [];
  const lessons = Array.isArray(unit?.lessons) ? unit.lessons : [];
  if (lessons.length === 0) errors.push(`unit ${unit?.id}: no lessons`);

  const seen = new Set();
  const unique = (id, what) => {
    if (!id) return errors.push(`unit ${unit?.id}: ${what} without an id`);
    if (seen.has(id)) errors.push(`${id}: duplicate id`);
    seen.add(id);
  };

  const ruleIds = new Set();
  for (const lesson of lessons) {
    unique(lesson.id, 'lesson');
    for (const rule of lesson.rules || []) {
      unique(rule.id, 'rule');
      ruleIds.add(rule.id);
    }
  }

  const perRule = new Map([...ruleIds].map((id) => [id, 0]));
  const exercises = [];
  lessons.forEach((lesson) => (lesson.exercises || []).forEach((ex, i) => exercises.push([ex, `${lesson.id} exercise #${i + 1}`, lesson])));
  (unit?.scene?.exercises || []).forEach((ex, i) => exercises.push([ex, `scene exercise #${i + 1}`, null]));
  for (const [ex, where, lesson] of exercises) {
    unique(ex.id, where);
    checkExercise(ex, where, ruleIds, errors, unit, lesson);
    if (perRule.has(ex.ruleId)) perRule.set(ex.ruleId, perRule.get(ex.ruleId) + 1);
  }

  for (const [ruleId, n] of perRule) {
    if (n < MIN_PER_RULE) {
      (unit.draft ? warnings : errors).push(`rule ${ruleId}: ${n} exercises (needs ≥ ${MIN_PER_RULE})`);
    }
  }
  return errors;
}

async function main() {
  const { UNITS } = await import('../content/index.js');
  const pad = (id) => String(id).padStart(2, '0');
  const owner = new Map(); // exercise id → unit id, to catch ids reused across units
  let failed = false;
  for (const entry of UNITS) {
    if (!entry.load) continue;
    const unit = await entry.load();
    const warnings = unit.draft ? [`unit ${pad(unit.id)} is marked draft`] : [];
    const errors = validateUnit(unit, warnings);
    const exercises = [...unit.lessons.flatMap((l) => l.exercises || []), ...(unit.scene?.exercises || [])];
    for (const ex of exercises) {
      if (owner.has(ex.id) && owner.get(ex.id) !== unit.id) errors.push(`${ex.id}: duplicate id (also in unit ${pad(owner.get(ex.id))})`);
      owner.set(ex.id, unit.id);
    }
    if (errors.length) {
      failed = true;
      console.log(`✗ unit ${pad(unit.id)}:`);
      for (const e of errors) console.log(`  ${e}`);
    } else {
      console.log(`✓ unit ${pad(unit.id)}: ${exercises.length} exercises`);
    }
    for (const w of warnings) console.log(`  warning: ${w}`);
  }
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
