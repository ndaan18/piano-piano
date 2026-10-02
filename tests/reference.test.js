import test from 'node:test';
import assert from 'node:assert/strict';
import { foldText, ruleMatches, collectRules, verbTables, listedUnits } from '../js/pages/reference.js';
import { exportFilename, reportsFilename } from '../js/pages/settings.js';

const article = {
  id: 'r1',
  title: 'il or lo?',
  sentence: 'lo zaino, lo studente',
  why: 'Lo goes before z and s+consonant.',
  careful: 'Il is the default; lo is the exception.',
  table: { head: ['article', 'before'], rows: [['il', 'most consonants'], ['lo', 'z, s+cons']] },
};
const verbs = {
  id: 'r2',
  title: 'essere, present',
  sentence: 'io sono',
  why: 'The verb to be.',
  table: { head: ['verb', 'io', 'tu'], rows: [['essere', 'sono', 'sei']] },
};
const unit2 = { id: 2, title: 'Articles', lessons: [{ id: 'u2-l1', rules: [article] }, { id: 'u2-l2', rules: [verbs] }] };

test('foldText ignores case, accents and apostrophe style', () => {
  assert.equal(foldText('È PERCHÉ'), 'e perche');
  assert.equal(foldText('l’amico'), "l'amico");
});

test('ruleMatches searches title, sentence, why, careful and table cells', () => {
  assert.equal(ruleMatches(article, 'lo'), true);
  assert.equal(ruleMatches(article, 'ZAINO'), true); // sentence, case-insensitive
  assert.equal(ruleMatches(article, 'goes before'), true); // why
  assert.equal(ruleMatches(article, 'exception'), true); // careful
  assert.equal(ruleMatches(article, 'consonants'), true); // table cell
  assert.equal(ruleMatches(article, 'before'), true); // table head
  assert.equal(ruleMatches(article, 'zebra'), false);
});

test('ruleMatches is accent-insensitive in both directions', () => {
  assert.equal(ruleMatches({ title: 'perché', sentence: '' }, 'perche'), true);
  assert.equal(ruleMatches({ title: 'perche', sentence: '' }, 'PERCHÉ'), true);
});

test('ruleMatches needs every word of the query, in any order', () => {
  assert.equal(ruleMatches(article, 'lo or il'), true);
  assert.equal(ruleMatches(article, 'lo zebra'), false);
});

test('ruleMatches treats an empty query as everything and survives missing fields', () => {
  assert.equal(ruleMatches(article, ''), true);
  assert.equal(ruleMatches(article, '   '), true);
  assert.equal(ruleMatches({ id: 'x' }, 'lo'), false);
  assert.equal(ruleMatches({ id: 'x', table: { head: null, rows: [null] } }, 'lo'), false);
});

test('collectRules flattens a unit with unit and lesson ids', () => {
  const rules = collectRules(unit2);
  assert.deepEqual(rules.map((r) => [r.unit.id, r.lessonId, r.rule.id]), [[2, 'u2-l1', 'r1'], [2, 'u2-l2', 'r2']]);
});

test('verbTables keeps only rules whose table starts with a "verb" column', () => {
  const found = verbTables(collectRules(unit2));
  assert.deepEqual(found.map((r) => r.rule.id), ['r2']);
  assert.deepEqual(verbTables([]), []);
});

test('listedUnits lists unlocked, loaded units in order', () => {
  const metas = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
  const loaded = new Map([[0, { id: 0 }], [2, { id: 2 }]]);
  // unit 1 not passed: units 2+ stay locked even though unit 2 is loaded
  assert.deepEqual(listedUnits(metas, {}, loaded).map((u) => u.id), [0]);
  // unit 1 passed: unit 2 unlocks; unit 1 itself isn't written (not loaded)
  const progress = { 0: { checkpointBest: 0.9 }, 1: { checkpointBest: 0.8 } };
  assert.deepEqual(listedUnits(metas, progress, loaded).map((u) => u.id), [0, 2]);
  assert.deepEqual(listedUnits(metas, {}, new Map()), []);
});

test('export filenames use the local date', () => {
  const d = new Date(2026, 9, 3, 23, 59);
  assert.equal(exportFilename(d), 'piano-piano-progress-2026-10-03.json');
  assert.equal(reportsFilename(d), 'piano-piano-reports-2026-10-03.json');
});
