// Generative covers: a deterministic "blur recipe" per unit index, plus a DOM renderer.
// Ported from docs/superpowers/mockups/blur-system.html.

const COLORS = {
  lime: '#D2FF3C',
  pink: '#FF4FA8',
  ultra: '#2E3BFF',
  lilac: '#C3A6FF',
  cyan: '#42D9F0',
  orange: '#FF6B1F',
  fog: '#E3E1DA',
  ink: '#121210',
};
const PARTNERS = ['pink', 'ultra', 'cyan', 'lilac', 'orange', 'ultra', 'pink', 'cyan', 'lilac'];
const COMPS = ['orb', 'horizon', 'diagonal', 'column', 'eclipse', 'scatter', 'rise', 'halo'];
const CHECKPOINTS = new Set([5, 10, 14, 18]);

// splitmix32 finaliser: consecutive unit indexes become unrelated 32-bit seeds,
// so softness, jitter, grain and drift don't climb in step from unit to unit.
function hash32(n) {
  let h = (n + 0x9e3779b9) | 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}

// mulberry32: small, fast, good enough for layout jitter. Returns [0, 1).
function rng(seed) {
  let a = hash32(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Seed salt: any value works; 23 gives neighbouring units clearly different softness.
const SEED_SALT = 23;

export function coverRecipe(index) {
  const r = rng(index + SEED_SALT);
  const partner = PARTNERS[index % PARTNERS.length];
  const p = COLORS[partner];
  const p2 = COLORS[PARTNERS[(index + 3) % PARTNERS.length]];
  const L = COLORS.lime;
  const dark = CHECKPOINTS.has(index);
  const soft = 18 + Math.round(r() * 52); // blur px
  const comp = COMPS[(index * 3) % COMPS.length]; // stride 3: neighbours differ
  const j = () => (r() - 0.5) * 20; // jitter, %

  // [color, centre x %, centre y %, width %, height %]
  let spec;
  switch (comp) {
    case 'orb':
      spec = [[p, 55 + j(), 45 + j(), 95, 95], [L, 80 + j(), 15 + j(), 60, 60]];
      break;
    case 'horizon':
      spec = [[L, 50, 92 + j() / 3, 170, 55], [p, 50 + j(), 105, 120, 40]];
      break;
    case 'diagonal':
      spec = [[L, 10 + j(), 5 + j(), 90, 90], [p, 95 + j(), 95 + j(), 90, 90]];
      break;
    case 'column':
      spec = [[p, 70 + j(), 50, 45, 150], [L, 30 + j(), 40, 35, 120]];
      break;
    case 'eclipse':
      spec = [[L, 58 + j(), 40 + j(), 85, 85], [p, 48 + j(), 52 + j(), 75, 75]];
      break;
    case 'scatter':
      spec = [
        [L, 20 + j(), 25 + j(), 45, 45],
        [p, 78 + j(), 35 + j(), 40, 40],
        [p2, 55 + j(), 78 + j(), 50, 50],
        [L, 90, 90, 30, 30],
      ];
      break;
    case 'rise':
      spec = [[p, 50 + j(), 120, 140, 110], [L, 50 + j(), 110, 100, 80]];
      break;
    case 'halo':
      spec = [
        [L, 50 + j(), 45 + j(), 120, 120],
        [dark ? COLORS.ink : COLORS.fog, 50, 45, 55, 55], // the "hole" in the halo
        [p, 50 + j(), 45 + j(), 30, 30],
      ];
      break;
  }

  const blobs = spec.map(([color, x, y, w, h], k) => ({
    color,
    x,
    y,
    w,
    h,
    blur: comp === 'halo' && k === 1 ? soft * 0.6 : soft,
  }));
  const grain = 0.25 + r() * 0.35;
  const drift = blobs.map(() => ({
    dx: (r() - 0.5) * 14,
    dy: (r() - 0.5) * 14,
    ds: 1 + r() * 0.08,
    dur: 9 + r() * 8,
  }));

  return { comp, partner, soft, grain, dark, blobs, drift };
}

export function renderCover(el, index, { scale = 1 } = {}) {
  const rc = coverRecipe(index);
  const doc = el.ownerDocument;
  el.replaceChildren();
  el.classList.add('cover');
  el.classList.toggle('cover--dark', rc.dark);
  el.style.background = rc.dark ? COLORS.ink : COLORS.fog;

  rc.blobs.forEach((b, k) => {
    const d = rc.drift[k];
    const div = doc.createElement('div');
    div.className = 'cover__blob';
    div.style.cssText =
      `background:${b.color};left:${b.x - b.w / 2}%;top:${b.y - b.h / 2}%;` +
      `width:${b.w}%;height:${b.h}%;filter:blur(${(b.blur * scale).toFixed(1)}px);` +
      `opacity:${rc.dark ? 1 : 0.95};` +
      `--dx:${d.dx.toFixed(2)}px;--dy:${d.dy.toFixed(2)}px;--ds:${d.ds.toFixed(3)};--dur:${d.dur.toFixed(1)}s`;
    el.appendChild(div);
  });

  const grain = doc.createElement('div');
  grain.className = 'cover__grain';
  grain.style.opacity = String(rc.dark ? rc.grain * 0.6 : rc.grain);
  el.appendChild(grain);
}

const LIGHT = new Set([COLORS.lime, COLORS.pink, COLORS.cyan, COLORS.lilac, COLORS.orange, COLORS.fog]);

/**
 * Whether the cover is a light colour at (x%, y%), ignoring blur. Reads the topmost
 * blob whose ellipse contains the point, else the field. A quick guess; text colour
 * over a cover comes from toneText, which models the blur.
 */
export function lightAt(index, x, y) {
  const rc = coverRecipe(index);
  for (let k = rc.blobs.length - 1; k >= 0; k--) {
    const b = rc.blobs[k];
    const dx = (x - b.x) / (b.w / 2);
    const dy = (y - b.y) / (b.h / 2);
    if (dx * dx + dy * dy <= 1) return LIGHT.has(b.color);
  }
  return !rc.dark;
}

// ---------- blur-aware text colour (WCAG contrast) ----------

const INK = '#121210';
const BASE = '#F4F4F1';
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const linear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = ([r, g, b]) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

/** WCAG contrast ratio of two colours given as [r, g, b] in 0–1. */
export function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// Standard normal CDF (Abramowitz & Stegun 7.1.26), accurate to ~1e-7.
function phi(z) {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const erf = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return z >= 0 ? (1 + erf) / 2 : (1 - erf) / 2;
}

/**
 * Approximate rendered colour ([r, g, b], 0–1) of cover `index` at (px, py) in a
 * cover of w × h px. Each blob is an ellipse softened by a Gaussian whose standard
 * deviation is its blur (CSS blur() radius): coverage falls off as the normal CDF of
 * the distance to the ellipse edge, and a blob smaller than its blur never reaches
 * full strength. `drifted` places blobs at the end of their drift animation.
 */
export function coverColorAt(index, px, py, w, h, { scale = 1, drifted = false } = {}) {
  const rc = coverRecipe(index);
  let color = rgb(rc.dark ? COLORS.ink : COLORS.fog);
  rc.blobs.forEach((b, k) => {
    const d = drifted ? rc.drift[k] : { dx: 0, dy: 0, ds: 1 };
    const cx = (b.x / 100) * w + d.dx;
    const cy = (b.y / 100) * h + d.dy;
    const a = (b.w / 200) * w * d.ds;
    const c = (b.h / 200) * h * d.ds;
    const sigma = Math.max(b.blur * scale, 0.5);
    const ox = px - cx;
    const oy = py - cy;
    const r = Math.hypot(ox / a, oy / c);
    const dist = r === 0 ? -Math.min(a, c) : Math.hypot(ox, oy) * (1 - 1 / r); // signed, along the ray
    const peak = 1 - Math.exp(-(Math.min(a, c) ** 2) / (2 * sigma * sigma));
    const alpha = phi(-dist / sigma) * peak * (rc.dark ? 1 : 0.95);
    const bc = rgb(b.color);
    color = color.map((v, i) => v * (1 - alpha) + bc[i] * alpha);
  });
  return color;
}

// Grain darkens a light cover (multiply) and lightens a dark one (screen) by up
// to about this share of its opacity; text must read with and without it.
const GRAIN_SHARE = 0.3;

/** The colours a sample may show once grain is on top: as modelled, and grain-shifted. */
function withGrain(color, index) {
  const rc = coverRecipe(index);
  const k = GRAIN_SHARE * rc.grain * (rc.dark ? 0.6 : 1);
  const shifted = rc.dark ? color.map((v) => v + (1 - v) * k) : color.map((v) => v * (1 - k));
  return [color, shifted];
}

// The blur model is an approximation (checked against a canvas replica of the
// covers): ask for 10% more than the WCAG threshold before going without a pill.
const SAFETY = 1.1;

/**
 * Text tone over cover samples: 'ink' or 'light' text, whichever has the better
 * worst-case contrast; `pill` when even that misses the threshold (4.5:1, or 3:1 for
 * large text, plus the safety margin), so the text needs a solid backing.
 */
export function pickTone(samples, { large = false } = {}) {
  const ink = rgb(INK);
  const base = rgb(BASE);
  let inkMin = Infinity;
  let baseMin = Infinity;
  for (const c of samples) {
    inkMin = Math.min(inkMin, contrast(ink, c));
    baseMin = Math.min(baseMin, contrast(base, c));
  }
  const tone = baseMin > inkMin ? 'light' : 'ink';
  const ratio = Math.max(inkMin, baseMin);
  return { tone, ratio, pill: ratio < (large ? 3 : 4.5) * SAFETY };
}

/** Background samples under an element's text lines, relative to the cover element. */
function samplesUnder(el, cover, index, scale, drift) {
  const box = cover.getBoundingClientRect();
  const range = el.ownerDocument.createRange();
  range.selectNodeContents(el);
  const out = [];
  for (const line of range.getClientRects()) {
    if (!line.width || !line.height) continue;
    const stepX = Math.max(4, line.width / 40);
    for (let x = line.left; x <= line.right + 0.5; x += stepX) {
      for (const f of [0.2, 0.5, 0.8]) {
        const px = Math.min(x, line.right) - box.left;
        const py = line.top + line.height * f - box.top;
        for (const drifted of drift ? [false, true] : [false]) {
          out.push(...withGrain(coverColorAt(index, px, py, box.width, box.height, { scale, drifted }), index));
        }
      }
    }
  }
  return out;
}

/**
 * Sets the colour of text over a cover from the blurred colours under its lines:
 * `.on-dark` for light text, plus `.on-pill` (a solid backing) where neither ink nor
 * light text reaches 4.5:1 (3:1 for elements marked data-tone="large"). `drift` is
 * true for the animated full-size cover. Re-runs when the cover resizes.
 */
export function toneText(cover, index, targets, { scale = 1, drift = false } = {}) {
  const apply = () => {
    if (!cover.isConnected) return;
    for (const el of targets) {
      // measure where the text sits without a pill's padding, so the result
      // doesn't depend on the previous run
      el.classList.remove('on-dark', 'on-pill');
      if (!el.textContent.trim()) continue;
      const samples = samplesUnder(el, cover, index, scale, drift);
      if (!samples.length) continue;
      const { tone, pill } = pickTone(samples, { large: el.dataset.tone === 'large' });
      el.classList.toggle('on-dark', tone === 'light');
      el.classList.toggle('on-pill', pill);
    }
  };
  apply();
  const view = cover.ownerDocument.defaultView;
  if (view?.ResizeObserver) new view.ResizeObserver(apply).observe(cover);
  cover.ownerDocument.fonts?.ready.then(apply);
  return apply;
}
