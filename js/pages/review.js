// Review (spec §6, §7.7): the number due across every unit, then a
// practice-style session of up to 30 cards, most overdue and weakest first.

import { UNITS, loadUnit, exerciseIndex } from '../../content/index.js';
import { dueIds, localDate } from '../engine/srs.js';
import { buildReviewSession, REVIEW_LIMIT } from '../engine/session.js';
import { esc } from '../ui/dom.js';
import { runSession, restoreSession } from '../ui/practice-card.js';

const ROUTE = '#/review';
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-10-05' → 'Mon 5 Oct' (a local calendar date). */
export function formatDay(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${DAYS[new Date(y, m - 1, d).getDay()]} ${d} ${MONTHS[m - 1]}`;
}

/** The earliest due date after today among cards still in content, or null. */
export function nextDueDate(cards, today, knownIds) {
  let next = null;
  for (const [id, c] of Object.entries(cards || {})) {
    if (knownIds.has(id) && c?.due > today && (next == null || c.due < next)) next = c.due;
  }
  return next;
}

/** The line after the big due count, e.g. 47 → "due · 30 per session". */
export function reviewCountText(n, limit = REVIEW_LIMIT) {
  if (n === 0) return 'Nothing due today. Mistakes come back here.';
  if (n > limit) return `due · ${limit} per session`;
  return `${n === 1 ? 'sentence' : 'sentences'} due for another try.`;
}

function introHTML(due) {
  return `
    <div class="review">
      <section class="card card--lime review__due">
        <span class="mono">Review</span>
        <div>
          <div class="review__count">${due}</div>
          <p class="review__text">${esc(reviewCountText(due))}</p>
        </div>
      </section>
      <section class="card review__how">
        <h1 class="review__title">Your mistakes, spaced out.</h1>
        <ul class="review__list">
          <li>Mixed across every unit you've reached</li>
          <li>Right → back in 3, 7, 21, then 60 days</li>
          <li>Wrong → tomorrow again</li>
        </ul>
        <button class="btn" type="button" data-start>Start review →</button>
      </section>
    </div>`;
}

function emptyHTML(hasCards, next) {
  return `
    <section class="card ldone">
      <span class="mono">Review</span>
      <h1 class="ldone__text">${hasCards ? 'Nothing due. Come back tomorrow.' : 'Nothing to review yet. Finish a lesson first.'}</h1>
      ${next ? `<p class="ldone__hint">Next review: ${esc(formatDay(next))}</p>` : ''}
      <div class="ldone__go"><a class="btn" href="#/" data-back>← Back to your path</a></div>
    </section>`;
}

function doneHTML(results, stillDue) {
  const missed = new Set(results.filter((r) => !r.retry && !r.pass).map((r) => r.exerciseId)).size;
  const count = results.filter((r) => !r.retry).length;
  return `
    <section class="card ldone">
      <span class="chip chip--lime">Review done</span>
      <h1 class="ldone__title">Bravo.</h1>
      <p class="ldone__text">${count} ${count === 1 ? 'card' : 'cards'}, ${missed} back tomorrow.</p>
      <p class="ldone__hint">${stillDue ? `${stillDue} more ${stillDue === 1 ? 'is' : 'are'} due.` : 'That was everything due today.'}</p>
      <div class="ldone__go">
        <a class="btn" href="#/" data-back>Back to your path →</a>
        ${stillDue ? '<button class="btn btn--ghost" type="button" data-again>Keep going</button>' : ''}
      </div>
    </section>`;
}

export async function mount(root, params, { store, audio }) {
  const units = await Promise.all(
    UNITS.filter((m) => m.load).map((m) => loadUnit(m.id).catch((err) => { console.error(err); return null; })),
  );
  if (!root.isConnected) return;
  const index = exerciseIndex(units.filter(Boolean));
  const known = new Set(index.keys());
  const lookup = (id) => index.get(id)?.exercise;
  const today = () => localDate(new Date());
  const due = () => dueIds(store.get().cards, today(), known, Infinity);

  const state = store.get();
  let saved = state.resume?.route === ROUTE ? restoreSession(state.resume.session, lookup) : null;
  let stopSession = null;
  let alive = true;

  document.title = 'Review · italiano.';
  root.innerHTML = '<div data-stage></div>';
  const stage = root.querySelector('[data-stage]');
  // saved after each answer only, so home never offers to continue an empty review
  const saveResume = (session) => store.update((d) => { d.resume = { route: ROUTE, step: 'session', session }; });

  function intro() {
    const ids = due();
    if (!ids.length) {
      const cards = store.get().cards;
      const hasCards = Object.keys(cards).some((id) => known.has(id));
      stage.innerHTML = emptyHTML(hasCards, nextDueDate(cards, today(), known));
      return;
    }
    stage.innerHTML = introHTML(ids.length);
    const btn = stage.querySelector('[data-start]');
    btn.addEventListener('click', start);
    btn.focus({ preventScroll: true });
  }

  function start() {
    window.scrollTo(0, 0);
    const resume = saved;
    saved = null;
    const cards = resume ? [] : buildReviewSession(due());
    if (!resume && !cards.length) { intro(); return; }
    stopSession = runSession(stage, cards, {
      mode: 'review',
      lookup,
      store,
      audio,
      resume,
      onProgress: saveResume,
      onDone: (results) => {
        if (!alive) return;
        stopSession = null;
        store.update((d) => { d.resume = null; });
        window.scrollTo(0, 0);
        stage.innerHTML = doneHTML(results, due().length);
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
  };
}
