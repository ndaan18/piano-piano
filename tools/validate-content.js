// Content validator (spec §10). `validateUnit` is pure; the CLI below runs it
// over every loadable unit: `node tools/validate-content.js` (or `npm run validate`).

import { pathToFileURL } from 'node:url';

const TYPES = new Set(['recognise', 'type', 'transform', 'build', 'listen', 'register']);
const REGS = new Set(['tu', 'lei', 'neutral']);
const NEEDS_CONTEXT = new Set(['transform', 'build', 'register']);
const MIN_PER_RULE = 30;

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';

function checkExercise(ex, where, ruleIds, errors) {
  const id = ex.id || where;
  if (!TYPES.has(ex.type)) errors.push(`${id}: unknown type "${ex.type}"`);
  if (!REGS.has(ex.reg)) errors.push(`${id}: reg "${ex.reg}" is not tu, lei or neutral`);
  if (!Number.isInteger(ex.rung) || ex.rung < 1 || ex.rung > 5) errors.push(`${id}: rung "${ex.rung}" is not 1–5`);
  const answers = Array.isArray(ex.answers) ? ex.answers.filter(nonEmpty) : [];
  if (answers.length === 0) errors.push(`${id}: missing answers`);
  if (!nonEmpty(ex.why)) errors.push(`${id}: missing why`);
  if (!ruleIds.has(ex.ruleId)) errors.push(`${id}: unknown ruleId "${ex.ruleId}"`);
  if (ex.type === 'recognise') {
    const options = Array.isArray(ex.options) ? ex.options : [];
    if (options.length < 2 || options.length > 4) errors.push(`${id}: recognise needs 2–4 options`);
    if (!options.some((o) => answers.includes(o))) errors.push(`${id}: recognise options don't include an answer`);
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
  lessons.forEach((lesson) => (lesson.exercises || []).forEach((ex, i) => exercises.push([ex, `${lesson.id} exercise #${i + 1}`])));
  (unit?.scene?.exercises || []).forEach((ex, i) => exercises.push([ex, `scene exercise #${i + 1}`]));
  for (const [ex, where] of exercises) {
    unique(ex.id, where);
    checkExercise(ex, where, ruleIds, errors);
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
