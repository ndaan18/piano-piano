// Scene (spec §4.3): a short real-life dialogue. Listen (lines with speaker,
// register chip and audio; "Play all") → read along (translations toggle) →
// the scene's cards → done (sceneDone).

import { exerciseIndex } from '../../content/index.js';
import { SLOW_RATE } from '../audio.js';
import { esc, PLAY_ICON, regChip } from '../ui/dom.js';
import { runSession, restoreSession } from '../ui/practice-card.js';
import { pad2, loadUnitStep, updateProgress, dropResume } from './unit.js';
import { resumeStep, savesStep, declinesResume } from './lesson.js';

const STEPS = ['listen', 'read', 'practice', 'done'];
const LABELS = { listen: 'Listen', read: 'Read along', practice: 'Practice', done: 'Done' };

function linesHTML(lines, { text }) {
  return `
    <ol class="scene__lines">
      ${lines.map((l, i) => `
      <li class="card sline" data-line="${i}">
        <div class="sline__who"><span class="mono">${esc(l.speaker)}</span>${regChip(l.reg)}</div>
        ${text ? `
        <p class="sline__it" lang="it">${esc(l.it)}</p>
        <p class="sline__en" data-en hidden>${esc(l.en)}</p>` : ''}
        <button class="play" type="button" data-play="${i}" aria-label="Play line ${i + 1}, ${esc(l.speaker)}">${PLAY_ICON}</button>
      </li>`).join('')}
    </ol>`;
}

function stepHTML(scene, step, hasCards) {
  const read = step === 'read';
  return `
    <section class="scene">
      <div class="scene__head">
        <div>
          <span class="mono">Scene · ${read ? 'read along' : 'listen first'}</span>
          <h1 class="scene__title">${esc(scene.title)}</h1>
          ${scene.setting ? `<p class="scene__setting">${esc(scene.setting)}</p>` : ''}
        </div>
        <div class="scene__tools">
          ${read ? '<button class="btn btn--ghost" type="button" data-tr aria-pressed="false">Show translations</button>' : ''}
          <button class="btn btn--ghost" type="button" data-all>${PLAY_ICON} Play all</button>
        </div>
      </div>
      <p class="notice" data-novoice hidden><span class="mono">Audio</span>
        <span>No Italian voice is installed, so the dialogue can't be played. ${read ? 'Read it instead.' : 'You can read it on the next screen.'}</span></p>
      ${linesHTML(scene.lines || [], { text: read })}
      <div class="lesson__go"><button class="btn" type="button" data-next>${read ? (hasCards ? 'Start practice →' : 'Continue →') : 'Read along →'}</button></div>
    </section>`;
}

const writingHTML = () => `
  <section class="card ldone">
    <span class="chip">Scene practice</span>
    <p class="ldone__text">Practice for this scene is being written.</p>
    <div class="ldone__go"><button class="btn" type="button" data-finish>Done</button></div>
  </section>`;

function doneHTML(u, results) {
  const count = results.filter((r) => !r.retry).length;
  return `
    <section class="card ldone">
      <span class="chip chip--lime">Scene done</span>
      <h1 class="ldone__title">Bravo.</h1>
      ${count ? `<p class="ldone__text">${count} ${count === 1 ? 'card' : 'cards'} from the scene.</p>` : ''}
      <p class="ldone__hint">Next: the checkpoint, 15 cards with no hints.</p>
      <div class="ldone__go"><a class="btn" href="#/unit/${u}" data-back>Back to the unit →</a></div>
    </section>`;
}

export async function mount(root, params, { store, audio }) {
  const loaded = await loadUnitStep(root, params, store, 'scene');
  if (!loaded) return;
  const { meta, u, unit } = loaded;
  const scene = unit.scene;
  const exercises = scene.exercises || [];
  const index = exerciseIndex([{ id: u, lessons: [], scene }]);
  const lookup = (id) => index.get(id)?.exercise;

  const route = `#/scene/${u}`;
  const state = store.get();
  let step = resumeStep(state.resume, route, STEPS);
  let saved = step === 'practice' ? restoreSession(state.resume?.session, lookup) : null;
  let stopSession = null;
  let results = [];
  let alive = true;
  let voice = null; // unknown until hasItalianVoice resolves
  const rate = () => (store.get().settings.slowDefault ? SLOW_RATE : 1);

  document.title = `Scene · ${meta.title} · italiano.`;
  root.innerHTML = `
    <div class="topbar lesson__top">
      <a class="iconbtn" href="#/unit/${u}" aria-label="Back to the unit">✕</a>
      <span class="mono">Unit ${pad2(u)} · Scene</span>
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
    if (savesStep(step, STEPS)) saveStep(step);
    window.scrollTo(0, 0);
    render();
  }

  function finish(res) {
    results = res;
    updateProgress(store, u, (p, d) => {
      p.sceneDone = true;
      d.resume = null;
    });
    go('done');
  }

  function showVoice() {
    const note = stage.querySelector('[data-novoice]');
    if (note) note.hidden = voice !== false;
  }

  function playing(i) {
    stage.querySelectorAll('[data-line]').forEach((el) => el.classList.toggle('is-playing', Number(el.dataset.line) === i));
  }

  function playAll() {
    const lines = scene.lines || [];
    lines.forEach((l, i) => audio.speak(l.it, {
      rate: rate(),
      queue: i > 0,
      onstart: () => { if (alive) playing(i); },
      onend: i === lines.length - 1 ? () => { if (alive) playing(-1); } : undefined,
    }));
  }

  function wireLines() {
    stage.querySelector('[data-all]').addEventListener('click', playAll);
    stage.querySelectorAll('[data-play]').forEach((b) => b.addEventListener('click', () => {
      const i = Number(b.dataset.play);
      playing(-1);
      audio.speak(scene.lines[i].it, { rate: rate() });
    }));
    const tr = stage.querySelector('[data-tr]');
    tr?.addEventListener('click', () => {
      const on = tr.getAttribute('aria-pressed') !== 'true';
      tr.setAttribute('aria-pressed', String(on));
      tr.textContent = on ? 'Hide translations' : 'Show translations';
      stage.querySelectorAll('[data-en]').forEach((el) => { el.hidden = !on; });
    });
    const next = stage.querySelector('[data-next]');
    next.addEventListener('click', () => go(STEPS[STEPS.indexOf(step) + 1]));
    next.focus({ preventScroll: true });
    showVoice();
  }

  function render() {
    stopSession?.();
    stopSession = null;
    audio.stop();
    const at = STEPS.indexOf(step);
    stepsEl.hidden = step === 'practice' || step === 'done';
    stepsEl.innerHTML = STEPS.slice(0, -1).map((s, i) => `<i class="${i < at ? 'done' : i === at ? 'now' : ''}"></i>`).join('');
    labelEl.textContent = LABELS[step];

    if (step === 'listen' || step === 'read') {
      stage.innerHTML = stepHTML(scene, step, exercises.length > 0);
      wireLines();
    } else if (step === 'practice') {
      startPractice();
    } else {
      stage.innerHTML = doneHTML(u, results);
      stage.querySelector('[data-back]').focus({ preventScroll: true });
    }
  }

  function startPractice() {
    if (!exercises.length) {
      // draft content: let the flow be finished without cards
      stage.innerHTML = writingHTML();
      const done = stage.querySelector('[data-finish]');
      done.addEventListener('click', () => finish([]));
      done.focus({ preventScroll: true });
      return;
    }
    const resume = saved;
    saved = null;
    const cards = resume ? [] : exercises.map((e) => ({ exerciseId: e.id, hints: false }));
    stopSession = runSession(stage, cards, {
      mode: 'practice',
      lookup,
      store,
      audio,
      resume,
      onProgress: (snap) => saveStep('practice', snap),
      onDone: (res) => {
        if (!alive) return;
        stopSession = null;
        finish(res);
      },
    });
  }

  if (declinesResume(state.resume, route, STEPS)) dropResume(store, route);
  else if (step === 'practice' && state.resume?.session && !saved) saveStep('practice'); // keep the place, drop a snapshot that no longer fits
  render();

  audio.hasItalianVoice().then((ok) => {
    if (!alive) return;
    voice = ok;
    showVoice();
  });

  return () => {
    alive = false;
    stopSession?.();
    audio.stop();
  };
}
