import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coverRecipe, lightAt, contrast, coverColorAt, pickTone } from '../js/covers.js';

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

test('recipes look independent per unit: softness is not a sawtooth', () => {
  const soft = Array.from({ length: 19 }, (_, i) => coverRecipe(i).soft);
  let run = 0;
  for (let i = 1; i < soft.length; i++) {
    assert.notEqual(soft[i], soft[i - 1], `units ${i - 1} and ${i} share softness ${soft[i]}`);
    run = soft[i] > soft[i - 1] ? run + 1 : 0;
    assert.ok(run < 4, `softness climbs for ${run + 1} units in a row up to unit ${i}: ${soft.join(' ')}`);
  }
  const grains = Array.from({ length: 19 }, (_, i) => coverRecipe(i).grain);
  assert.ok(grains.every((g) => g >= 0.25 && g <= 0.6));
  assert.ok(new Set(grains.map((g) => g.toFixed(2))).size > 12, 'grain varies per unit');
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

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const INK = hex('#121210');
const BASE = hex('#F4F4F1');
const LIME = hex('#D2FF3C');
const near = (a, b, tol = 0.03) => a.every((v, i) => Math.abs(v - b[i]) <= tol);

test('contrast follows WCAG', () => {
  assert.equal(contrast([0, 0, 0], [1, 1, 1]), 21);
  assert.ok(Math.abs(contrast(INK, BASE) - 17.0) < 0.1);
});

test('coverColorAt: field far from blobs, blob colour deep inside, a mix across the blurred edge', () => {
  // unit 18 (rise, dark): lime rises from below the bottom edge
  assert.ok(near(coverColorAt(18, 120, 80, 1000, 1000), INK));
  assert.ok(near(coverColorAt(18, 500, 960, 1000, 1000), LIME, 0.08));
  const { blur } = coverRecipe(18).blobs[1];
  const lime = coverRecipe(18).blobs[1];
  const edgeY = (lime.y / 100) * 1000 - (lime.h / 200) * 1000; // top of the lime ellipse
  const mid = coverColorAt(18, (lime.x / 100) * 1000, edgeY, 1000, 1000);
  assert.ok(contrast(mid, INK) > 1.5 && contrast(mid, LIME) > 1.5, 'the edge is neither ink nor lime');
  const outside = coverColorAt(18, (lime.x / 100) * 1000, edgeY - 3 * blur, 1000, 1000);
  assert.ok(contrast(outside, INK) < contrast(mid, INK), 'blur fades out with distance');
});

test('pickTone: ink on light, light on dark, a pill where neither reads', () => {
  assert.deepEqual(
    (({ tone, pill }) => ({ tone, pill }))(pickTone([hex('#E3E1DA'), LIME])),
    { tone: 'ink', pill: false },
  );
  assert.deepEqual((({ tone, pill }) => ({ tone, pill }))(pickTone([INK, hex('#2E3BFF')])), { tone: 'light', pill: false });
  // text straddling lime and ink: either colour fails somewhere
  assert.equal(pickTone([LIME, INK]).pill, true);
  // a mid grey: about 4.7:1 against ink, inside the safety margin for body text, fine for large text
  const grey = [0.5, 0.5, 0.5];
  assert.equal(pickTone([grey]).pill, true);
  assert.equal(pickTone([grey], { large: true }).pill, false);
});
