// Home (spec §7.1, mockup home-v3): greeting + honest stats, a bento row
// (Continue · Phrase of the day · Review) and the path of unit tiles.

import { UNITS, loadUnit, exerciseIndex } from '../../content/index.js';
import { renderCover, lightAt, toneText } from '../covers.js';
import { PASS_MARK, localDate, addDays, unitStage, isUnlocked, dueIds } from '../engine/srs.js';
import { SLOW_RATE } from '../audio.js';
import { esc, PLAY_ICON, regChip, NO_VOICE_HTML } from '../ui/dom.js';
import { unitSteps, nextStep, unitFromRoute, safeRoute, pad2 } from './unit.js';
import { reviewCountText } from './review.js';

const FALLBACK_PHRASE = {
  it: 'Dai, andiamo a prendere un caffè?',
  en: 'Come on, shall we go get a coffee?',
  reg: 'tu',
  tip: 'dai = "come on", not "you give"',
};

const dayNumber = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
};

/** A deterministic pick for the date, so the phrase changes daily but not on reload. */
export function phraseOfTheDay(examples, today) {
  if (!examples.length) return null;
  return examples[dayNumber(today) % examples.length];
}

/** Percentage of passes in the log over today and the 6 days before, or null with no answers. */
export function weekAccuracy(log, today) {
  const from = addDays(today, -6);
  const week = (log || []).filter((e) => e.date >= from && e.date <= today);
  if (!week.length) return null;
  return Math.round((100 * week.filter((e) => e.pass).length) / week.length);
}

/** The first unit whose checkpoint isn't passed (always unlocked: its predecessor passed). */
export function currentUnit(unitsProgress, count) {
  for (let i = 0; i < count; i++) {
    if (!(unitsProgress[i]?.checkpointBest >= PASS_MARK)) return i;
  }
  return count - 1;
}

// "dai = …" → the term before " = " in bold (lime on ink), the rest plain.
function tipHTML(tip) {
  const at = tip.indexOf(' = ');
  return at > 0 ? `<b lang="it">${esc(tip.slice(0, at))}</b>${esc(tip.slice(at))}` : esc(tip);
}

export async function mount(root, params, ctx) {
  const { store, audio } = ctx;
  const state = store.get();
  const today = localDate(new Date());

  const reached = UNITS.filter((u) => isUnlocked(u.id, state.units));
  const loaded = (
    await Promise.all(reached.map((u) => loadUnit(u.id).catch((err) => { console.error(err); return null; })))
  ).filter(Boolean);
  if (!root.isConnected) return; // left while loading
  const content = new Map(loaded.map((u) => [u.id, u]));

  // stats
  const mastered = loaded.filter((u) => ['passed', 'longterm'].includes(unitStage(u, state.units[u.id], state.cards))).length;
  const built = Object.values(state.cards).reduce((n, c) => n + (c.correct || 0), 0);
  const accuracy = weekAccuracy(state.log, today);

  // continue card: the saved place (a unit step or a review), else the current unit's next step
  const saved = safeRoute(state.resume?.route);
  const resumeUnit = unitFromRoute(saved);
  const reviewing = saved === '#/review';
  const resuming = reviewing || (resumeUnit != null && UNITS[resumeUnit] && isUnlocked(resumeUnit, state.units));
  const current = resumeUnit != null && resuming ? resumeUnit : currentUnit(state.units, UNITS.length);
  const steps = content.has(current) ? unitSteps(content.get(current), state.units[current]) : [];
  const core = steps.filter((s) => !s.optional);
  const next = nextStep(steps);
  const href = resuming ? saved : next?.route ?? `#/unit/${current}`;
  const started = core.some((s) => s.done);
  const at = core.findIndex((s) => s.route === href);
  const stepLabel = reviewing ? 'In progress'
    : !core.length ? 'Being written' : at >= 0 ? `Step ${at + 1} / ${core.length}` : next ? '' : 'Complete';
  // the button sits on a solid fill, so the unblurred cover colour is enough
  const btnOnDark = !lightAt(current, 85, 85);

  // phrase of the day, from the examples of reached units
  const examples = loaded.flatMap((u) => (u.lessons || []).flatMap((l) => (l.examples || []).map((e) => ({ ...e, unit: u }))));
  const picked = phraseOfTheDay(examples, today);
  const phrase = picked
    ? { ...picked, tipHTML: `<span class="mono">From unit ${pad2(picked.unit.id)} · ${esc(picked.unit.title)}</span>` }
    : { ...FALLBACK_PHRASE, tipHTML: tipHTML(FALLBACK_PHRASE.tip) };

  const due = dueIds(state.cards, today, new Set(exerciseIndex(loaded).keys()), Infinity).length;

  const tiles = UNITS.map((u) => {
    const locked = !isUnlocked(u.id, state.units);
    const unit = content.get(u.id);
    const passed = unit && ['passed', 'longterm'].includes(unitStage(unit, state.units[u.id], state.cards));
    const cls = ['tile', locked && 'tile--locked', u.id === current && 'tile--now']
      .filter(Boolean).join(' ');
    const status = locked ? 'locked' : passed ? 'passed' : u.id === current ? 'current unit' : '';
    return `
      <li><a class="${cls}" href="${esc(`#/unit/${u.id}`)}">
        <div class="tile__thumb"><div class="cover cover--fill" data-cover="${u.id}"></div>
          <span class="tile__num mono"${locked ? '' : ' data-tone'}>${pad2(u.id)}</span>${passed ? '<span class="tile__badge" aria-hidden="true">✓</span>' : ''}</div>
        <div class="tile__info"><b>${esc(u.title)}</b><span class="tile__tease">${esc(u.teaser)}</span>
          ${status ? `<span class="sr-only">, ${status}</span>` : ''}</div>
      </a></li>`;
  }).join('');

  document.title = 'italiano.';
  root.innerHTML = `
    <div class="hello">
      <h1 class="hello__title">Ciao, Daan.</h1>
      <dl class="stats">
        <div><dt class="mono">units mastered</dt><dd>${mastered}<span class="stats__of">/${UNITS.length}</span></dd></div>
        <div><dt class="mono">sentences built</dt><dd>${built}</dd></div>
        <div><dt class="mono">accuracy, 7 days</dt><dd>${accuracy == null ? '–' : `${accuracy}%`}</dd></div>
      </dl>
    </div>

    <div class="notice" data-voice hidden>${NO_VOICE_HTML}</div>

    <div class="bento">
      <section class="card bento__hero" aria-label="Continue">
        <div class="cover cover--fill" data-cover="${current}"></div>
        <div class="cover__content bento__row mono"><span data-tone>Continue · ${reviewing ? 'Review' : `Unit ${pad2(current)}`}</span><span data-tone>${stepLabel}</span></div>
        <div class="cover__content bento__row bento__row--end">
          <h2 class="bento__title" data-tone="large">${reviewing ? 'Review' : esc(UNITS[current].title)}</h2>
          <a class="btn${btnOnDark ? ' btn--lime' : ''}" href="${esc(href)}">${reviewing ? 'Continue review →' : resuming ? 'Resume →' : started ? 'Continue →' : 'Start →'}</a>
        </div>
      </section>

      <section class="card card--ink bento__phrase" aria-label="Phrase of the day">
        <div class="bento__row"><span class="mono on-ink-muted">Phrase of the day</span>${regChip(phrase.reg)}</div>
        <div>
          <p class="phrase__it" lang="it">${esc(phrase.it)}</p>
          <p class="phrase__en">${esc(phrase.en)}</p>
        </div>
        <div class="bento__row"><span class="phrase__tip">${phrase.tipHTML}</span>
          <button class="play" type="button" aria-label="Play the phrase">${PLAY_ICON}</button></div>
      </section>

      <section class="card card--lime bento__review" aria-label="Review">
        <span class="mono">Review</span>
        <div>
          <div class="review__count">${due}</div>
          <p class="review__text">${esc(reviewCountText(due))}</p>
        </div>
        <a class="btn" href="#/review">Start review →</a>
      </section>
    </div>

    <div class="sec">
      <h2 class="sec__title">Your path</h2>
      <span class="mono">${UNITS.length} units · grammar foundation</span>
    </div>
    <ol class="path">${tiles}</ol>`;

  // text over a cover takes its colour from the blurred colours under it
  root.querySelectorAll('[data-cover]').forEach((el) => {
    const i = Number(el.dataset.cover);
    const tile = el.closest('.tile');
    const scale = tile ? 0.55 : 1;
    renderCover(el, i, { scale });
    const host = tile || el.closest('.bento__hero');
    toneText(el, i, [...host.querySelectorAll('[data-tone]')], { scale, drift: !tile });
  });

  root.querySelector('.bento__phrase .play').addEventListener('click', () => {
    audio.speak(phrase.it, { rate: store.get().settings.slowDefault ? SLOW_RATE : 1 });
  });

  let alive = true;
  audio.hasItalianVoice().then((ok) => {
    if (alive && !ok) root.querySelector('[data-voice]').hidden = false;
  });
  return () => { alive = false; };
}
