// Lesson page (spec §7.3–7.5): rule screens → examples → practice → done.
// The same route module serves mixed practice and drill (`params.mode`); those
// modes are added in Task 9 and show a placeholder until then.

import { UNITS, loadUnit, exerciseIndex } from '../../content/index.js';
import { isUnlocked } from '../engine/srs.js';
import { buildLessonSession } from '../engine/session.js';
import { SLOW_RATE } from '../audio.js';
import { esc, PLAY_ICON, regChip } from '../ui/dom.js';
import { renderRuleSentence } from '../ui/marks.js';
import { runSession, restoreSession } from '../ui/practice-card.js';
import { pad2 } from './unit.js';

// ---------- pure helpers ----------

/** The lesson's steps in order: 'rule-0'…, 'examples' (if any), 'practice', 'done'. */
export function lessonSteps(lesson) {
  const steps = (lesson.rules || []).map((_, i) => `rule-${i}`);
  if ((lesson.examples || []).length) steps.push('examples');
  steps.push('practice', 'done');
  return steps;
}

export function stepLabel(step, steps) {
  if (step.startsWith('rule-')) {
    const rules = steps.filter((s) => s.startsWith('rule-')).length;
    return `Rule ${Number(step.slice(5)) + 1} / ${rules}`;
  }
  return { examples: 'Examples', practice: 'Practice', done: 'Done' }[step] || '';
}

/** The saved step if the saved place is this lesson, else the first step. */
export function resumeStep(resume, route, steps) {
  const step = resume?.route === route ? resume.step : null;
  return step && step !== 'done' && steps.includes(step) ? step : steps[0];
}

/**
 * Exercise ids to interleave: earlier lessons of this unit plus every earlier
 * unit (lessons and scene), limited to cards the learner has already met.
 */
export function priorPool(units, unitId, lessonId, cards) {
  const ids = [];
  for (const unit of units || []) {
    if (!unit) continue;
    if (unit.id < unitId) {
      ids.push(...exerciseIndex([unit]).keys());
    } else if (unit.id === unitId) {
      for (const l of unit.lessons || []) {
        if (l.id === lessonId) break;
        for (const e of l.exercises || []) ids.push(e.id);
      }
    }
  }
  return ids.filter((id) => cards?.[id]);
}

/** Cards missed at some point that are still in box 1 or 2. */
export function weakIds(cards) {
  return new Set(Object.keys(cards || {}).filter((id) => cards[id]?.lastWrong && cards[id].box <= 2));
}

// ---------- screens ----------

function ruleHTML(rule, i, total, nextLabel) {
  const t = rule.table;
  const hl = new Set(t?.highlight || []);
  const cell = (c, hi) => (hi ? `<mark>${esc(c)}</mark>` : esc(c));
  const table = t ? `
    <div class="rtable-wrap"><table class="rtable">
      <thead><tr>${(t.head || []).map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>${(t.rows || []).map((row, r) => `<tr>${row.map((c, j) => (j === 0
        ? `<th scope="row" lang="it">${cell(c, hl.has(r))}</th>`
        : `<td>${cell(c, hl.has(r))}</td>`)).join('')}</tr>`).join('')}</tbody>
    </table></div>` : '';
  const say = rule.howItaliansSayIt;
  return `
    <div class="rule">
      <section class="card rule__sheet">
        <div class="rule__label"><span class="mono">The rule · ${i + 1} of ${total}</span><h1 class="mono rule__title" lang="it">${esc(rule.title)}</h1></div>
        <p class="rule__sent" lang="it" data-sentence></p>
        ${rule.why ? `<p class="rule__why">${esc(rule.why)}</p>` : ''}
        ${table}
      </section>
      <div class="rule__side">
        ${rule.careful ? `
        <section class="card rule__careful" aria-label="Careful">
          <span class="mono rule__careful-tag">Careful</span>
          <p>${esc(rule.careful)}</p>
        </section>` : ''}
        ${say ? `
        <section class="card rule__say" aria-label="How Italians say it">
          <span class="mono">How Italians say it</span>
          <div class="rule__say-row">
            <p class="rule__say-it" lang="it">${esc(say.it)}</p>
            <button class="play" type="button" data-say aria-label="Play the sentence">${PLAY_ICON}</button>
          </div>
          ${say.en ? `<p class="rule__say-en">${esc(say.en)}</p>` : ''}
          ${say.note ? `<p class="rule__say-note">${esc(say.note)}</p>` : ''}
        </section>` : ''}
        <div class="lesson__go"><button class="btn" type="button" data-next>${esc(nextLabel)}</button></div>
      </div>
    </div>`;
}

function examplesHTML(examples, nextLabel) {
  const words = (s) => String(s).split(/(\s+)/).map((w) => (/\S/.test(w) ? `<span class="w">${esc(w)}</span>` : w)).join('');
  return `
    <section class="examples">
      <div class="examples__head">
        <h1 class="examples__title">Examples</h1>
        <p class="examples__hint">Tap a sentence for its meaning.</p>
      </div>
      <ol class="examples__list">
        ${examples.map((e, i) => `
        <li class="card exrow">
          <div class="exrow__main">
            ${regChip(e.reg)}
            <button class="exrow__it" type="button" lang="it" data-ex="${i}" aria-expanded="false" aria-controls="ex-en-${i}">${words(e.it)}</button>
            <button class="play" type="button" data-play="${i}" aria-label="Play the sentence">${PLAY_ICON}</button>
          </div>
          <p class="exrow__en" id="ex-en-${i}" hidden>${esc(e.en)}</p>
        </li>`).join('')}
      </ol>
      <div class="lesson__go"><button class="btn" type="button" data-next>${esc(nextLabel)}</button></div>
    </section>`;
}

function doneHTML(unitId, results) {
  const missed = new Set(results.filter((r) => !r.retry && !r.pass).map((r) => r.exerciseId)).size;
  const count = results.filter((r) => !r.retry).length;
  return `
    <section class="card ldone">
      <span class="chip chip--lime">Lesson done</span>
      <h1 class="ldone__title">Bravo.</h1>
      <p class="ldone__text">${count} ${count === 1 ? 'card' : 'cards'}, ${missed} into your review queue.</p>
      <p class="ldone__hint">${missed ? 'The mistakes come back tomorrow, then in 3, 7 and 21 days, until they stick.' : 'Every card goes into spaced review, so this sticks.'}</p>
      <div class="ldone__go">
        <a class="btn" href="#/unit/${unitId}" data-back>Back to the unit →</a>
        <button class="btn btn--ghost" type="button" data-again>Practise again</button>
      </div>
    </section>`;
}

function placeholder(root) {
  root.innerHTML = `
    <div class="soon">
      <span class="mono">Coming soon</span>
      <h1 class="soon__title">This page isn't built yet.</h1>
      <a class="btn" href="#/">← Back to your path</a>
    </div>`;
}

// ---------- modes ----------

async function mountLesson(root, params, { store, audio }) {
  const meta = /^\d+$/.test(params.u) ? UNITS.find((m) => m.id === Number(params.u)) : undefined;
  if (!meta) { location.replace('#/'); return; }
  const u = meta.id;
  const state = store.get();
  if (!isUnlocked(u, state.units)) { location.replace(`#/unit/${u}`); return; }
  const unit = await loadUnit(u);
  const lessonIndex = (unit?.lessons || []).findIndex((l) => l.id === params.lessonId);
  if (lessonIndex < 0) { location.replace(`#/unit/${u}`); return; }
  const lesson = unit.lessons[lessonIndex];

  // Content for interleaving: earlier reached units plus this one.
  const earlier = await Promise.all(
    UNITS.filter((m) => m.id < u && isUnlocked(m.id, state.units))
      .map((m) => loadUnit(m.id).catch((err) => { console.error(err); return null; })),
  );
  const units = [...earlier.filter(Boolean), unit];
  const index = exerciseIndex(units);
  const lookup = (id) => index.get(id)?.exercise;

  const route = `#/lesson/${u}/${lesson.id}`;
  const steps = lessonSteps(lesson);
  let step = resumeStep(state.resume, route, steps);
  let saved = step === 'practice' ? restoreSession(state.resume?.session, lookup) : null;
  let stopSession = null;
  let results = [];
  let alive = true;
  const rate = () => (store.get().settings.slowDefault ? SLOW_RATE : 1);

  document.title = `Lesson ${lessonIndex + 1} · ${meta.title} · italiano.`;
  root.innerHTML = `
    <div class="topbar lesson__top">
      <a class="iconbtn" href="#/unit/${u}" aria-label="Back to the unit">✕</a>
      <span class="mono">Unit ${pad2(u)} · Lesson ${lessonIndex + 1}</span>
      <div class="segs lesson__segs" data-steps aria-hidden="true"></div>
      <span class="mono lesson__label" data-label></span>
    </div>
    <div data-stage></div>`;
  const stage = root.querySelector('[data-stage]');
  const stepsEl = root.querySelector('[data-steps]');
  const labelEl = root.querySelector('[data-label]');

  const saveStep = (s, session) => store.update((d) => {
    d.resume = session ? { route, step: s, session } : { route, step: s };
  });

  function go(next) {
    step = next;
    if (step !== 'done') saveStep(step);
    window.scrollTo(0, 0);
    render();
  }

  function nextLabel(at) {
    const n = steps[steps.indexOf(at) + 1];
    if (n?.startsWith('rule-')) return 'Next rule →';
    if (n === 'examples') return 'See examples →';
    return 'Start practice →';
  }

  function render() {
    stopSession?.();
    stopSession = null;
    const at = steps.indexOf(step);
    const shown = steps.filter((s) => s !== 'done');
    stepsEl.hidden = step === 'practice' || step === 'done';
    stepsEl.innerHTML = shown.map((s, i) => `<i class="${i < at ? 'done' : i === at ? 'now' : ''}"></i>`).join('');
    labelEl.textContent = stepLabel(step, steps);

    if (step.startsWith('rule-')) {
      const i = Number(step.slice(5));
      const rule = lesson.rules[i];
      stage.innerHTML = ruleHTML(rule, i, lesson.rules.length, nextLabel(step));
      renderRuleSentence(stage.querySelector('[data-sentence]'), rule);
      stage.querySelector('[data-say]')?.addEventListener('click', () => {
        audio.speak(rule.howItaliansSayIt.it, { rate: rate() });
      });
      wireNext();
    } else if (step === 'examples') {
      stage.innerHTML = examplesHTML(lesson.examples, nextLabel(step));
      stage.querySelectorAll('[data-ex]').forEach((b) => b.addEventListener('click', () => {
        const en = stage.querySelector(`#ex-en-${b.dataset.ex}`);
        en.hidden = !en.hidden;
        b.setAttribute('aria-expanded', String(!en.hidden));
      }));
      stage.querySelectorAll('[data-play]').forEach((b) => b.addEventListener('click', () => {
        audio.speak(lesson.examples[Number(b.dataset.play)].it, { rate: rate() });
      }));
      wireNext();
    } else if (step === 'practice') {
      startPractice();
    } else {
      stage.innerHTML = doneHTML(u, results);
      stage.querySelector('[data-again]').addEventListener('click', () => go('practice'));
      stage.querySelector('[data-back]').focus({ preventScroll: true });
    }
  }

  function wireNext() {
    const next = stage.querySelector('[data-next]');
    next.addEventListener('click', () => go(steps[steps.indexOf(step) + 1]));
    next.focus({ preventScroll: true });
  }

  function startPractice() {
    const now = store.get();
    const cards = saved ? [] : buildLessonSession(lesson, priorPool(units, u, lesson.id, now.cards), { weak: weakIds(now.cards) });
    const resume = saved;
    saved = null; // a saved session is used once, on the first render
    stopSession = runSession(stage, cards, {
      mode: 'practice',
      lookup,
      store,
      audio,
      resume,
      onProgress: (snap) => saveStep('practice', snap),
      onDone: (res) => {
        if (!alive) return;
        results = res;
        store.update((d) => {
          const p = { lessonsDone: [], mixedDone: false, sceneDone: false, checkpointBest: 0, ...d.units[u] };
          if (!p.lessonsDone.includes(lesson.id)) p.lessonsDone = [...p.lessonsDone, lesson.id];
          d.units[u] = p;
          d.resume = null;
        });
        stopSession = null;
        go('done');
      },
    });
  }

  if (!(step === 'practice' && saved)) saveStep(step);
  render();

  return () => {
    alive = false;
    stopSession?.();
  };
}

const MODES = { lesson: mountLesson }; // Task 9 adds mixed and drill

export async function mount(root, params, ctx) {
  const run = MODES[params.mode];
  if (!run) { placeholder(root); return; }
  return run(root, params, ctx);
}
