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

function rng(seed) {
  let s = seed * 9301 + 49297;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function coverRecipe(index) {
  const r = rng(index + 7);
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
