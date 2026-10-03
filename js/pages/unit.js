// Unit intro (spec §7.2): big cover, "what you'll be able to say", the step list
// with mastery state, estimated time, Start/Resume. Locked and not-yet-written
// units show the cover and title with a short message instead.

import { UNITS, loadUnit } from '../../content/index.js';
import { renderCover, toneText } from '../covers.js';
import { PASS_MARK, isUnlocked, unitStage } from '../engine/srs.js';
import { SLOW_RATE } from '../audio.js';
import { esc, PLAY_ICON } from '../ui/dom.js';

export const pad2 = (n) => String(n).padStart(2, '0');

// Rough minutes per step, for the "about N min left" estimate.
const MINUTES = { lesson: 15, mixed: 15, scene: 10, checkpoint: 10, drill: 3 };

const SAFE_ROUTE = /^#\/[a-z]+(\/[\w-]+)*$/;

/** The route if it is a plain app route ('#/lesson/2/u2-l1'), else null. Guards stored or imported routes. */
export function safeRoute(route) {
  return typeof route === 'string' && SAFE_ROUTE.test(route) ? route : null;
}

/** The unit index of a unit-scoped route ('#/lesson/2/u2-l1' → 2), else null. */
export function unitFromRoute(route) {
  const m = /^#\/(?:unit|lesson|mixed|scene|checkpoint|drill)\/(\d+)(?:\/|$)/.exec(route || '');
  return m ? Number(m[1]) : null;
}

/**
 * The unit's steps in order. Lessons are always open; mixed practice opens after
 * every lesson, the scene after mixed, the checkpoint after the scene. Drill is
 * optional (never "done") and open whenever the unit is reached.
 */
export function unitSteps(unit, progress) {
  const p = progress || {};
  const done = new Set(p.lessonsDone || []);
  const lessons = unit.lessons || [];
  const steps = lessons.map((l, i) => ({
    kind: 'lesson',
    tag: `Lesson ${i + 1}`,
    label: l.title,
    route: `#/lesson/${unit.id}/${l.id}`,
    done: done.has(l.id),
    locked: false,
  }));
  const allLessons = lessons.length > 0 && lessons.every((l) => done.has(l.id));
  steps.push({
    kind: 'mixed', tag: 'Practice', label: 'Mixed practice', route: `#/mixed/${unit.id}`,
    done: !!p.mixedDone, locked: !allLessons, after: 'Opens after the lessons',
  });
  if (unit.scene) {
    steps.push({
      kind: 'scene', tag: 'Scene', label: unit.scene.title || 'Scene', route: `#/scene/${unit.id}`,
      done: !!p.sceneDone, locked: !p.mixedDone, after: 'Opens after mixed practice',
    });
  }
  const before = steps[steps.length - 1];
  steps.push({
    kind: 'checkpoint', tag: 'Test', label: 'Checkpoint', route: `#/checkpoint/${unit.id}`,
    done: p.checkpointBest >= PASS_MARK, locked: !before.done,
    after: unit.scene ? 'Opens after the scene' : 'Opens after mixed practice',
  });
  steps.push({
    kind: 'drill', tag: 'Anytime', label: 'Drill', route: `#/drill/${unit.id}`,
    done: false, locked: false, optional: true,
  });
  return steps.map((s) => ({ ...s, minutes: MINUTES[s.kind] }));
}

/** Whether the unit's step of this kind exists and is open ('mixed', 'scene', 'checkpoint', 'drill'). */
export function stepOpen(unit, progress, kind) {
  const step = unitSteps(unit, progress).find((s) => s.kind === kind);
  return !!step && !step.locked;
}

/**
 * Loads a unit for one of its step pages. Redirects to the unit page (and
 * returns null) when the unit is locked, not written, or the step isn't open
 * yet; returns null without redirecting if the page was left while loading.
 */
export async function loadUnitStep(root, params, store, kind) {
  // a page that redirects away also declines a saved place pointing at it
  const away = (to) => { dropResume(store, location.hash); location.replace(to); return null; };
  const meta = /^\d+$/.test(params.u) ? UNITS.find((m) => m.id === Number(params.u)) : undefined;
  if (!meta) return away('#/');
  const u = meta.id;
  if (!isUnlocked(u, store.get().units)) return away(`#/unit/${u}`);
  const unit = await loadUnit(u);
  if (!root.isConnected) return null;
  if (!unit || (kind && !stepOpen(unit, store.get().units[u], kind))) return away(`#/unit/${u}`);
  return { meta, u, unit };
}

/** Clears the saved place if it points at `route` (a page declined or can't restore it). */
export function dropResume(store, route) {
  if (store.get().resume?.route !== route) return;
  store.update((d) => { d.resume = null; });
}

/** Updates a unit's progress record (created with defaults if missing) inside store.update. */
export function updateProgress(store, u, fn) {
  return store.update((d) => {
    const p = { lessonsDone: [], mixedDone: false, sceneDone: false, checkpointBest: 0, ...d.units[u] };
    fn(p, d);
    d.units[u] = p;
  });
}

/** The first open, unfinished step (drill excluded), or null when the unit is complete. */
export function nextStep(steps) {
  return steps.find((s) => !s.optional && !s.done && !s.locked) || null;
}

const LOCK_ICON = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 5V3.6a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="2" y="5" width="8" height="6" rx="1.5" fill="currentColor"/></svg>';

function stepRow(s, i, next) {
  const isNext = s === next;
  const cls = ['step', s.done && 'step--done', s.locked && 'step--locked', isNext && 'step--next'].filter(Boolean).join(' ');
  const mark = s.done ? '✓' : s.locked ? LOCK_ICON : s.optional ? '↻' : i + 1;
  const state = s.done ? 'done' : s.locked ? 'locked' : isNext ? 'next' : '';
  const side = s.locked ? s.after : s.optional ? '3-minute bursts' : `${s.minutes} min`;
  const inner = `
    <span class="step__mark" aria-hidden="true">${mark}</span>
    <span class="step__text"><span class="mono step__tag">${esc(s.tag)}${isNext ? ' · next' : ''}</span><b>${esc(s.label)}</b></span>
    <span class="step__side">${esc(side)}</span>
    ${state ? `<span class="sr-only">, ${state}</span>` : ''}`;
  return s.locked
    ? `<li><div class="${cls}" aria-disabled="true">${inner}</div></li>`
    : `<li><a class="${cls}" href="${esc(s.route)}">${inner}</a></li>`;
}

const STAGE_LABELS = { learned: 'Learned', practised: 'Practised', passed: 'Passed ✓', longterm: 'Long-term ✓' };

function shell(meta, { locked = false } = {}) {
  // text over the cover is toned in mount (toneText); a locked cover is faded, so always light
  return `
    <div class="topbar">
      <a class="iconbtn" href="#/" aria-label="Back to your path">✕</a>
      <span class="mono">Unit ${pad2(meta.id)}</span>
    </div>
    <div class="unit">
      <section class="unit__hero${locked ? ' unit__hero--locked' : ''}">
        <div class="cover cover--fill" data-cover></div>
        <div class="cover__content unit__head">
          <span class="mono" data-stage data-tone>${locked ? 'Locked' : ''}</span>
          <div>
            <h1 class="big-title unit__title" data-tone="large">${esc(meta.title)}</h1>
            <p class="unit__teaser" data-tone>${esc(meta.teaser)}</p>
          </div>
        </div>
      </section>
      <div class="unit__side" data-side></div>
    </div>`;
}

function messageSide(text) {
  return `
    <div class="card unit__note">
      <p>${text}</p>
      <a class="btn" href="#/">← Back to your path</a>
    </div>`;
}

export async function mount(root, params, ctx) {
  const id = Number(params.u);
  const meta = /^\d+$/.test(params.u) ? UNITS.find((u) => u.id === id) : undefined;
  if (!meta) {
    ctx.navigate('#/');
    return;
  }
  const state = ctx.store.get();
  const unlocked = isUnlocked(id, state.units);
  document.title = `${meta.title} · italiano.`;

  root.innerHTML = shell(meta, { locked: !unlocked });
  const cover = root.querySelector('[data-cover]');
  renderCover(cover, id);
  const side = root.querySelector('[data-side]');
  const retone = unlocked ? toneText(cover, id, [...root.querySelectorAll('.unit__head [data-tone]')], { drift: true }) : () => {};

  if (!unlocked) {
    side.innerHTML = messageSide(`<b>Locked.</b> Pass the Unit ${pad2(id - 1)} checkpoint to unlock.`);
    return;
  }
  const unit = await loadUnit(id);
  if (!root.isConnected) return;
  const stage = root.querySelector('[data-stage]');
  if (!unit) {
    stage.textContent = 'Being written';
    retone();
    side.innerHTML = messageSide('Lessons for this unit are being written.');
    return;
  }

  const steps = unitSteps(unit, state.units[id]);
  const next = nextStep(steps);
  const core = steps.filter((s) => !s.optional);
  const doneCount = core.filter((s) => s.done).length;
  const minutesLeft = core.filter((s) => !s.done).reduce((n, s) => n + s.minutes, 0);
  const saved = safeRoute(state.resume?.route);
  const resume = unitFromRoute(saved) === id ? saved : null;
  stage.textContent = STAGE_LABELS[unitStage(unit, state.units[id], state.cards)] || (doneCount ? 'In progress' : 'Not started');
  retone();

  let go;
  if (resume) go = { href: resume, label: 'Resume →' };
  else if (next) go = { href: next.route, label: doneCount ? 'Continue →' : 'Start →' };
  else go = { href: `#/drill/${id}`, label: 'Drill →' };

  side.innerHTML = `
    ${unit.canSay ? `
    <div class="card unit__say">
      <span class="mono">What you'll be able to say</span>
      <div class="unit__say-row">
        <p class="unit__say-it" lang="it">“${esc(unit.canSay)}”</p>
        <button class="play" type="button" aria-label="Play the sentence">${PLAY_ICON}</button>
      </div>
    </div>` : ''}
    <ol class="steps" aria-label="Steps">${steps.map((s, i) => stepRow(s, i, next)).join('')}</ol>
    <div class="unit__go">
      <p class="mono unit__meta">${minutesLeft ? `${doneCount} / ${core.length} steps done · about ${minutesLeft} min left · leaving saves your place` : 'Unit complete · drill any time'}</p>
      <a class="btn unit__btn" href="${esc(go.href)}">${go.label}</a>
    </div>`;

  side.querySelector('.play')?.addEventListener('click', () => {
    ctx.audio.speak(unit.canSay, { rate: ctx.store.get().settings.slowDefault ? SLOW_RATE : 1 });
  });
}
