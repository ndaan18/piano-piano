// Reference (spec §7.8): the grammar book. A searchable cheat sheet of every rule
// and table from the units reached so far, plus a section of verb tables.

import { UNITS, loadUnit } from '../../content/index.js';
import { isUnlocked } from '../engine/srs.js';
import { normalize } from '../engine/checker.js';
import { esc } from '../ui/dom.js';
import { ruleSentenceHTML } from '../ui/marks.js';
import { pad2 } from './unit.js';

/** Lowercase, apostrophes unified, accents removed: "È" and "e" fold to the same text. */
export function foldText(s) {
  return normalize(s).normalize('NFD').replace(/\p{M}/gu, '');
}

const tableCells = (t) => [...(t?.head || []), ...(t?.rows || []).flat()];

/** True when every word of the query appears in the rule's title, sentence, why, careful or table. */
export function ruleMatches(rule, query) {
  const words = foldText(query).split(' ').filter(Boolean);
  if (!words.length) return true;
  const hay = foldText([rule?.title, rule?.sentence, rule?.why, rule?.careful, ...tableCells(rule?.table)]
    .filter((x) => x != null).join(' \n '));
  return words.every((w) => hay.includes(w));
}

/** Every rule of a unit as { unit, lessonId, rule }, in lesson order. */
export function collectRules(unit) {
  return (unit.lessons || []).flatMap((l) => (l.rules || []).map((rule) => ({ unit, lessonId: l.id, rule })));
}

/** The entries whose rule table has a verb as its first column. */
export const verbTables = (entries) => entries.filter((e) => e.rule.table?.head?.[0] === 'verb');

/** The loaded units that are also unlocked, in path order. */
export function listedUnits(metas, unitsProgress, loaded) {
  return metas.filter((m) => isUnlocked(m.id, unitsProgress) && loaded.has(m.id)).map((m) => loaded.get(m.id));
}

function tableHTML(t) {
  if (!t) return '';
  const hl = new Set(t.highlight || []);
  const cell = (c, hi) => (hi ? `<mark>${esc(c)}</mark>` : esc(c));
  return `
    <div class="rtable-wrap"><table class="rtable">
      <thead><tr>${(t.head || []).map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>${(t.rows || []).map((row, r) => `<tr>${row.map((c, j) => (j === 0
        ? `<th scope="row" lang="it">${cell(c, hl.has(r))}</th>`
        : `<td>${cell(c, hl.has(r))}</td>`)).join('')}</tr>`).join('')}</tbody>
    </table></div>`;
}

function ruleCard({ unit, lessonId, rule }, { sentence = true } = {}) {
  return `
    <article class="card rule__sheet ref__rule">
      <div class="rule__label">
        <span class="mono">Unit ${pad2(unit.id)} · ${esc(unit.title)}</span>
        <h3 class="mono rule__title" lang="it">${esc(rule.title)}</h3>
      </div>
      ${sentence ? `<p class="rule__sent" lang="it">${ruleSentenceHTML(rule)}</p>` : ''}
      ${rule.why ? `<p class="rule__why">${esc(rule.why)}</p>` : ''}
      ${tableHTML(rule.table)}
      ${rule.careful ? `<div class="ref__careful"><span class="mono rule__careful-tag">Careful</span><p>${esc(rule.careful)}</p></div>` : ''}
      <a class="ref__open" href="${esc(`#/lesson/${unit.id}/${lessonId}`)}">Open lesson →</a>
    </article>`;
}

export async function mount(root, params, ctx) {
  const { store } = ctx;
  document.title = 'Reference · italiano.';
  const reached = UNITS.filter((m) => isUnlocked(m.id, store.get().units));
  const loaded = new Map();
  await Promise.all(reached.map(async (m) => {
    try {
      const unit = await loadUnit(m.id);
      if (unit) loaded.set(m.id, unit);
    } catch (err) { console.error(err); }
  }));
  if (!root.isConnected) return; // left while loading

  const units = listedUnits(UNITS, store.get().units, loaded);
  if (!units.length) {
    root.innerHTML = `
      <div class="soon">
        <span class="mono">Reference</span>
        <h1 class="soon__title">Your grammar book fills up as you unlock units.</h1>
        <a class="btn" href="#/">See your path →</a>
      </div>`;
    return;
  }

  const all = units.flatMap(collectRules);
  let query = '';
  let only = null; // unit id filter, or null for all units

  root.innerHTML = `
    <div class="ref">
      <aside class="ref__side">
        <h1 class="ref__title">Reference</h1>
        <label class="ref__search"><span class="mono">Search the rules</span>
          <input class="pc__input ref__input" type="search" name="q" autocomplete="off" spellcheck="false" placeholder="lo or il?"></label>
        <ul class="ref__units" aria-label="Units">
          <li><button type="button" class="ref__unit" data-unit="all" aria-pressed="true"><b>All units</b><span class="mono">${all.length}</span></button></li>
          ${units.map((u) => `
          <li><button type="button" class="ref__unit" data-unit="${u.id}" aria-pressed="false"><b>${esc(u.title)}</b><span class="mono">${collectRules(u).length}</span></button></li>`).join('')}
        </ul>
      </aside>
      <div class="ref__main">
        <p class="sr-only" role="status" data-count></p>
        <div data-main></div>
      </div>
    </div>`;

  const main = root.querySelector('[data-main]');
  const count = root.querySelector('[data-count]');
  function draw() {
    const shown = all.filter((e) => (only == null || e.unit.id === only) && ruleMatches(e.rule, query));
    count.textContent = `${shown.length} ${shown.length === 1 ? 'rule' : 'rules'}`;
    if (!shown.length) {
      main.innerHTML = query.trim()
        ? `<p class="card ref__empty">No rules match “${esc(query.trim())}”</p>`
        : '<p class="card ref__empty">No rules in this unit yet.</p>';
      return;
    }
    const tables = verbTables(shown);
    main.innerHTML = `
      <section aria-label="Rules" class="ref__list">${shown.map((e) => ruleCard(e)).join('')}</section>
      ${tables.length ? `
      <section aria-labelledby="ref-verbs" class="ref__list">
        <div class="sec"><h2 class="sec__title" id="ref-verbs">Verb tables</h2></div>
        ${tables.map((e) => ruleCard(e, { sentence: false })).join('')}
      </section>` : ''}`;
  }
  draw();

  root.querySelector('.ref__input').addEventListener('input', (e) => {
    query = e.target.value;
    draw();
  });
  root.querySelector('.ref__units').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-unit]');
    if (!btn) return;
    only = btn.dataset.unit === 'all' ? null : Number(btn.dataset.unit);
    for (const b of root.querySelectorAll('.ref__unit')) b.setAttribute('aria-pressed', String(b === btn));
    draw();
  });
}
