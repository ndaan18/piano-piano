// Checkpoint (spec §4.4, §7.6): an ink screen to signal a test. 15 cards, no
// hints, no second tries. ≥ 80% passes and unlocks the next unit; the result
// lists the rules to revisit.

import { UNITS, exerciseIndex } from '../../content/index.js';
import { buildCheckpoint, CHECKPOINT_SIZE, PASS_MARK } from '../engine/session.js';
import { esc } from '../ui/dom.js';
import { runSession, restoreSession, scoreResults } from '../ui/practice-card.js';
import { pad2, loadUnitStep, updateProgress } from './unit.js';

const pct = (x) => `${Math.round(x * 100)}%`;

/**
 * The checkpoint outcome. score = passes / cards answered; best = the best score
 * so far; revisit = each missed rule once, in order, with its title and lesson;
 * unlocked = the next unit's id when this run passes and one exists.
 */
export function checkpointResult(results, unit, oldBest) {
  const { passes, total } = scoreResults(results);
  const score = total ? passes / total : 0;
  const passed = score >= PASS_MARK;

  const rules = new Map();
  for (const lesson of unit.lessons || []) {
    for (const rule of lesson.rules || []) rules.set(rule.id, { title: rule.title, lessonId: lesson.id });
  }
  const index = exerciseIndex([unit]);
  const revisit = [];
  const seen = new Set();
  for (const r of results || []) {
    if (!r || r.retry || r.pass) continue;
    const ruleId = index.get(r.exerciseId)?.ruleId;
    const rule = rules.get(ruleId);
    if (!rule || seen.has(ruleId)) continue;
    seen.add(ruleId);
    revisit.push({ ruleId, title: rule.title, href: `#/lesson/${unit.id}/${rule.lessonId}` });
  }

  const next = unit.id + 1;
  return {
    passes,
    total,
    score,
    passed,
    best: Math.max(oldBest || 0, score),
    revisit,
    unlocked: passed && next < UNITS.length ? next : null,
  };
}

function introHTML(meta, best) {
  const next = meta.id + 1 < UNITS.length ? ` and unlocks Unit ${pad2(meta.id + 1)}` : '';
  return `
    <section class="card ldone cp">
      <span class="mono">Checkpoint · Unit ${pad2(meta.id)}</span>
      <h1 class="ldone__title">${esc(meta.title)}</h1>
      <p class="ldone__text">${CHECKPOINT_SIZE} cards from every rule. No hints, no second tries.</p>
      <p class="ldone__hint">${pct(PASS_MARK)} passes${next}.${best > 0 ? ` Your best so far: ${pct(best)}.` : ''}</p>
      <div class="ldone__go"><button class="btn" type="button" data-start>Start the checkpoint →</button></div>
    </section>`;
}

function resultHTML(u, r) {
  const revisit = r.revisit.length ? `
      <div class="cp__revisit">
        <span class="mono">Rules to revisit</span>
        <ul class="cp__rules">${r.revisit.map((x) => `
          <li><a href="${esc(x.href)}"><b lang="it">${esc(x.title)}</b><span aria-hidden="true">→</span></a></li>`).join('')}
        </ul>
      </div>` : '';
  return `
    <section class="card ldone cp">
      <span class="chip${r.passed ? ' chip--lime' : ''}">${r.passed ? 'Passed' : 'Not yet'}</span>
      <h1 class="ldone__title">${r.passes}/${r.total}</h1>
      <p class="ldone__text">${pct(r.score)}. ${r.passed
        ? (r.unlocked != null ? `Unit ${pad2(r.unlocked)} unlocked.` : 'Unit passed.')
        : `You need ${pct(PASS_MARK)} to pass.`}</p>
      ${r.best > r.score ? `<p class="ldone__hint">Your best: ${pct(r.best)}.</p>` : ''}
      ${!r.passed && r.revisit.length ? '<p class="ldone__hint">Go over these rules, then try again.</p>' : ''}
      ${revisit}
      <div class="ldone__go">
        ${r.passed
          ? `<a class="btn" href="#/" data-back>Back to your path →</a>
             <a class="btn btn--ghost" href="#/unit/${u}">Back to the unit</a>`
          : `<button class="btn" type="button" data-again>Try again</button>
             <a class="btn btn--ghost" href="#/unit/${u}" data-back>Back to the unit</a>`}
      </div>
    </section>`;
}

export async function mount(root, params, { store, audio }) {
  const loaded = await loadUnitStep(root, params, store, 'checkpoint');
  if (!loaded) return;
  const { meta, u, unit } = loaded;
  const index = exerciseIndex([unit]);
  const lookup = (id) => index.get(id)?.exercise;

  const route = `#/checkpoint/${u}`;
  const state = store.get();
  let saved = state.resume?.route === route ? restoreSession(state.resume.session, lookup) : null;
  let stopSession = null;
  let alive = true;

  document.body.classList.add('page--ink');
  document.title = `Checkpoint · ${meta.title} · italiano.`;
  root.innerHTML = `
    <div class="topbar">
      <a class="iconbtn" href="#/unit/${u}" aria-label="Back to the unit">✕</a>
      <span class="mono">Unit ${pad2(u)} · Checkpoint · no hints</span>
    </div>
    <div data-stage></div>`;
  const stage = root.querySelector('[data-stage]');
  const saveResume = (session) => store.update((d) => {
    d.resume = session ? { route, step: 'test', session } : { route, step: 'test' };
  });

  function intro() {
    stage.innerHTML = introHTML(meta, store.get().units[u]?.checkpointBest || 0);
    const btn = stage.querySelector('[data-start]');
    btn.addEventListener('click', start);
    btn.focus({ preventScroll: true });
  }

  function start() {
    window.scrollTo(0, 0);
    const resume = saved;
    saved = null;
    const cards = resume ? [] : buildCheckpoint(unit);
    if (!resume && !cards.length) {
      stage.innerHTML = `
        <section class="card ldone"><p class="ldone__text">Checkpoint cards for this unit are being written.</p>
          <div class="ldone__go"><a class="btn" href="#/unit/${u}">Back to the unit</a></div></section>`;
      return;
    }
    if (!resume) saveResume(null);
    stopSession = runSession(stage, cards, {
      mode: 'checkpoint',
      lookup,
      store,
      audio,
      resume,
      onProgress: saveResume,
      onDone: (results) => {
        if (!alive) return;
        stopSession = null;
        const r = checkpointResult(results, unit, store.get().units[u]?.checkpointBest);
        updateProgress(store, u, (p, d) => {
          p.checkpointBest = r.best;
          d.resume = null;
        });
        window.scrollTo(0, 0);
        stage.innerHTML = resultHTML(u, r);
        stage.querySelector('[data-again]')?.addEventListener('click', start);
        stage.querySelector('[data-back]').focus({ preventScroll: true });
      },
    });
  }

  if (saved) start();
  else intro();

  return () => {
    alive = false;
    stopSession?.();
    document.body.classList.remove('page--ink');
  };
}
