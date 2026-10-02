import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coverRecipe, lightAt } from '../js/covers.js';

test('coverRecipe is deterministic', () => {
  assert.deepEqual(coverRecipe(7), coverRecipe(7));
});

test('neighbouring units differ in composition', () => {
  for (let i = 0; i <= 17; i++) {
    assert.notEqual(coverRecipe(i).comp, coverRecipe(i + 1).comp, `units ${i} and ${i + 1}`);
  }
});

test('checkpoint units are dark', () => {
  assert.ok([5, 10, 14, 18].every((i) => coverRecipe(i).dark));
  assert.equal(coverRecipe(4).dark, false);
});

test('every recipe contains lime', () => {
  for (let i = 0; i <= 18; i++) {
    assert.ok(coverRecipe(i).blobs.some((b) => b.color === '#D2FF3C'), `unit ${i}`);
  }
});

test('softness within range', () => {
  for (let i = 0; i <= 18; i++) {
    const { soft } = coverRecipe(i);
    assert.ok(soft >= 18 && soft <= 70, `unit ${i}: soft ${soft}`);
  }
});

test('lightAt reads the topmost blob under a point', () => {
  // unit 18 (rise, dark): ink sky at the top, lime rising at the bottom
  assert.equal(lightAt(18, 12, 8), false);
  assert.equal(lightAt(18, 22, 82), true);
  // unit 5 (halo, dark): lime ring at the corners, ink hole in the middle
  assert.equal(lightAt(5, 12, 8), true);
  assert.equal(lightAt(5, 40, 60), false);
  // light covers are light where no blob sits
  assert.equal(lightAt(0, 1, 99), true);
});
