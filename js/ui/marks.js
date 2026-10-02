// B-style marks (spec §8, lesson-v4 "B · Smooth gestural"): crisp vector
// circles and underlines in pink or ultramarine around words of a rule sentence.
// markRanges and ruleSentenceHTML are pure; renderRuleSentence writes the DOM.

import { esc } from './dom.js';

const KINDS = new Set(['circle', 'underline']);
const COLORS = new Set(['pink', 'ultra']);

// Loose hand-drawn shapes from the approved mockup. The SVG stretches to the
// word's box (preserveAspectRatio none) while the stroke keeps its width.
const SHAPES = {
  circle: { box: '0 0 84 78', d: 'M14 42C8 18 56 4 70 26s-6 44-36 42S4 46 24 20' },
  underline: { box: '0 0 36 16', d: 'M3 8c9-5 21-6 30-1' },
};

/**
 * Where each mark goes: the first occurrence of `mark.word` (which may be part
 * of a word, e.g. "z" in "zaino") after the previous mark. Marks that aren't
 * found, or have an unknown kind or colour, are skipped.
 */
export function markRanges(sentence, marks) {
  const text = String(sentence ?? '');
  const out = [];
  let from = 0;
  for (const m of marks || []) {
    if (!m?.word || !KINDS.has(m.kind) || !COLORS.has(m.color)) continue;
    const start = text.indexOf(m.word, from);
    if (start < 0) continue;
    const end = start + m.word.length;
    out.push({ start, end, kind: m.kind, color: m.color });
    from = end;
  }
  return out;
}

function markSVG(kind) {
  const s = SHAPES[kind];
  return `<svg viewBox="${s.box}" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${s.d}" vector-effect="non-scaling-stroke"/></svg>`;
}

/** The rule sentence as escaped HTML, with marked words wrapped in `.mk` spans. */
export function ruleSentenceHTML(rule) {
  const text = String(rule?.sentence ?? '');
  let html = '';
  let at = 0;
  for (const r of markRanges(text, rule?.marks)) {
    html += esc(text.slice(at, r.start));
    html += `<span class="mk mk--${r.kind} mk--${r.color}">${esc(text.slice(r.start, r.end))}${markSVG(r.kind)}</span>`;
    at = r.end;
  }
  return html + esc(text.slice(at));
}

export function renderRuleSentence(el, rule) {
  el.innerHTML = ruleSentenceHTML(rule);
}
