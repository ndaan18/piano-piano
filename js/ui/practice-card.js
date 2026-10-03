// Practice card session (spec §5, §6, §7.5; prototype in mockups/interaction-sketches-v2).
// One centred card at a time: Enter checks, Enter continues, Space replays audio.
// Used by every practice mode: lesson ('practice'), mixed, scene, checkpoint, review, drill.
//
// The top half is pure (session state, store mutations, feedback copy, answer
// marking) so node can test it. runSession() is the DOM part.

import { judge, isPass, applyAccentShortcut, normalize, ACCENT_MESSAGE } from '../engine/checker.js';
import { grade, localDate } from '../engine/srs.js';
import { requeue } from '../engine/session.js';
import { SLOW_RATE } from '../audio.js';
import { esc, PLAY_ICON, regChip } from './dom.js';

const DEBOUNCE_MS = 250; // a second Enter this soon after checking is ignored
const AUTOPLAY_MS = 350;
const ACCENTS = ['à', 'è', 'é', 'ì', 'ò', 'ù'];
const TYPE_LABELS = {
  recognise: 'Choose',
  type: 'Type it',
  transform: 'Transform',
  build: 'Build it',
  listen: 'Listen & type',
  register: 'Switch register',
};
const GAP = '___';

// ---------- session state (pure) ----------
// Session = { queue: SessionCard[], pos, results: Array<{exerciseId, verdict, pass, retry, overruled?}> }
// results[i] belongs to queue[i]; the card at `pos` is answered once results[pos] exists.

export function startSession(cards) {
  return { queue: cards.slice(), pos: 0, results: [] };
}

/** A saved snapshot, if it is well formed and every card still exists in content; else null. */
export function restoreSession(saved, lookup) {
  if (!saved || !Array.isArray(saved.queue) || !Array.isArray(saved.results)) return null;
  const { queue, pos, results } = saved;
  if (pos !== results.length || pos > queue.length) return null;
  if (!queue.every((c) => c && typeof c.exerciseId === 'string' && lookup(c.exerciseId))) return null;
  if (!results.every((r, i) => r && r.exerciseId === queue[i].exerciseId && typeof r.pass === 'boolean')) return null;
  return { queue, pos, results };
}

/** Records the answer to the current card; a miss is re-queued (once) except in checkpoint mode. */
export function recordAnswer(session, { verdict, pass }, mode) {
  const card = session.queue[session.pos];
  const results = session.results.slice();
  results[session.pos] = { exerciseId: card.exerciseId, verdict, pass, retry: !!card.retry };
  const queue = !pass && mode !== 'checkpoint' ? requeue(session.queue, session.pos) : session.queue;
  return { queue, pos: session.pos, results };
}

/** "I was right": the current answer becomes a pass and its pending retry copy is dropped. */
export function overruleAnswer(session) {
  const { pos } = session;
  const card = session.queue[pos];
  const results = session.results.slice();
  results[pos] = { ...results[pos], pass: true, overruled: true };
  let queue = session.queue;
  if (!card.retry) {
    const at = queue.findIndex((c, i) => i > pos && c.retry && c.exerciseId === card.exerciseId);
    if (at >= 0) queue = queue.filter((_, i) => i !== at);
  }
  return { queue, pos, results };
}

export const nextCard = (session) => ({ ...session, pos: session.pos + 1 });
export const isFinished = (session) => session.pos >= session.queue.length;

/** One state per queue position for the segmented progress bar. */
export function segmentStates(session) {
  return session.queue.map((_, i) => {
    const r = session.results[i];
    if (r) return r.pass ? 'done' : 'miss';
    return i === session.pos ? 'now' : '';
  });
}

/** Passes among first attempts (retries don't count), for checkpoint and drill scores. */
export function scoreResults(results) {
  const first = (results || []).filter((r) => r && !r.retry);
  return { passes: first.filter((r) => r.pass).length, total: first.length };
}

/** SRS grading: every mode but drill, and only a card's first attempt in the session. */
export const shouldGrade = (mode, card) => mode !== 'drill' && !card.retry;

// ---------- store mutations (pure, on a store.update draft) ----------

/** Grades (when due) and logs one answer. Returns the card's SRS state from before, for undo. */
export function applyAnswer(draft, { card, verdict, pass, mode, now }) {
  const id = card.exerciseId;
  const before = draft.cards[id];
  if (shouldGrade(mode, card)) draft.cards[id] = grade(before, pass, now);
  const entry = { exerciseId: id, date: localDate(now), verdict, pass, mode };
  if (card.retry) entry.retry = true;
  draft.log.push(entry);
  return before;
}

/** "I was right": accept the input from now on, report it, and undo the SRS fail. */
export function applyOverrule(draft, { card, input, before, mode, now }) {
  const id = card.exerciseId;
  const list = Array.isArray(draft.extraAnswers[id]) ? draft.extraAnswers[id] : [];
  if (!list.some((a) => normalize(a) === normalize(input))) draft.extraAnswers[id] = [...list, input];
  draft.reports.push({ exerciseId: id, input, date: localDate(now) });
  if (shouldGrade(mode, card)) draft.cards[id] = grade(before, true, now);
  for (let i = draft.log.length - 1; i >= 0; i--) {
    const e = draft.log[i];
    if (e && e.exerciseId === id) {
      e.pass = true;
      e.overruled = true;
      break;
    }
  }
}

// ---------- feedback (pure) ----------

const ACCENT_TITLE = 'Almost: mind the accent.';

/** ACCENT_MESSAGE without its opening verdict, which the feedback already shows as the title. */
export function accentBody() {
  return ACCENT_MESSAGE.startsWith(ACCENT_TITLE) ? ACCENT_MESSAGE.slice(ACCENT_TITLE.length).trim() : ACCENT_MESSAGE;
}

/**
 * What the feedback shows for a verdict. tone: ok (lime) · close (cyan) · wrong (orange).
 * showTarget: show the correct answer; marked: with the differing characters marked.
 * Checkpoint mode shows only right or wrong.
 */
export function feedbackFor(res, exercise, mode) {
  if (mode === 'checkpoint') {
    const pass = isPass(res.verdict);
    return { tone: pass ? 'ok' : 'wrong', title: pass ? 'Giusto.' : 'Quasi.', body: null, showTarget: false, marked: false };
  }
  const why = exercise.why || null;
  switch (res.verdict) {
    case 'correct': return { tone: 'ok', title: 'Giusto.', body: why, showTarget: false, marked: false };
    case 'typo': return { tone: 'ok', title: 'Giusto, small typo.', body: why, showTarget: true, marked: true };
    case 'accent': return { tone: 'close', title: ACCENT_TITLE, body: accentBody(), showTarget: true, marked: false };
    case 'mistake': return { tone: 'wrong', title: 'Quasi.', body: res.message || why, showTarget: true, marked: true };
    default: return { tone: 'wrong', title: 'Quasi.', body: why, showTarget: true, marked: true };
  }
}

/**
 * Maps a diffChars() result (computed on normalised text) back onto the answer as
 * written, keeping its case and punctuation. Only the answer's own characters are
 * shown: surplus input characters are left out, so the feedback never displays
 * text that isn't part of the correct answer. Null if the diff isn't for this answer.
 */
export function markTarget(raw, diff) {
  const text = String(raw ?? '').normalize('NFC');
  const nt = normalize(text);
  if (diff.length < nt.length) return null;
  for (let i = 0; i < nt.length; i++) if (diff[i].ch !== nt[i]) return null;
  for (let i = nt.length; i < diff.length; i++) if (diff[i].ok) return null;

  const out = [];
  let j = 0;
  for (const ch of text) {
    const n = ch.toLowerCase().replace(/[’‘`]/g, "'");
    if (j < nt.length && n === nt[j]) {
      out.push({ ch, ok: diff[j].ok });
      j++;
    } else {
      out.push({ ch, ok: true });
    }
  }
  return j < nt.length ? null : out;
}

/** The correct answer as [{ch, ok}], marked against the input where the verdict has a diff. */
export function answerMarks(res, answers) {
  if (!res.diff) return [...String(res.target ?? '')].map((ch) => ({ ch, ok: true }));
  for (const a of [res.target, ...(answers || [])]) {
    const m = markTarget(a, res.diff);
    if (m) return m;
  }
  return [...String(res.target ?? '')].map((ch) => ({ ch, ok: true }));
}

function marksHTML(marks) {
  let html = '';
  for (let i = 0; i < marks.length;) {
    const ok = marks[i].ok;
    let run = '';
    while (i < marks.length && marks[i].ok === ok) run += marks[i++].ch;
    html += ok ? esc(run) : `<span class="bad">${esc(run)}</span>`;
  }
  return html;
}

const isGapPrompt = (ex) => (ex.type === 'recognise' || ex.type === 'type') && String(ex.prompt || '').includes(GAP);

// The answer shown in feedback: gap answers are filled into the prompt sentence.
function targetHTML(ex, marks) {
  const inner = `<span class="diff">${marksHTML(marks)}</span>`;
  if (!isGapPrompt(ex)) return inner;
  const at = ex.prompt.indexOf(GAP);
  return `${esc(ex.prompt.slice(0, at))}<b>${inner}</b>${esc(ex.prompt.slice(at + GAP.length))}`;
}

function promptHTML(ex) {
  return esc(ex.prompt).split(GAP).join('<span class="pc__gap"><span class="sr-only">blank</span></span>');
}

// ---------- DOM ----------

function cardHTML(ex, card, { hints, mode }) {
  const listen = ex.type === 'listen';
  const kind = `
    <div class="pc__kind">
      <span class="chip">${TYPE_LABELS[ex.type] || esc(ex.type)}</span>${regChip(ex.reg)}
      ${card.retry ? '<span class="chip chip--retry">second try</span>' : ''}
    </div>`;

  const body = listen
    ? `
    <div class="pc__audio" data-audio>
      <button class="play play--lg" type="button" data-play aria-label="Play the sentence">${PLAY_ICON}</button>
      <div class="speed" role="group" aria-label="Speed">
        <button type="button" data-rate="1">Normal</button><button type="button" data-rate="${SLOW_RATE}">Slow</button>
      </div>
      <span class="pc__hint">Type what you hear<span class="pc__keys"> · <kbd class="kbd">Space</kbd> replays until you start typing</span></span>
    </div>
    <div class="pc__novoice" data-novoice hidden>
      <p>No Italian voice installed, see <a href="#/settings">Settings</a>.</p>
      <button class="btn btn--ghost" type="button" data-show>Show sentence</button>
      <p class="pc__prompt" lang="it" data-sentence hidden>${esc(ex.prompt)}</p>
    </div>`
    : `
    <p class="pc__prompt"${ex.type === 'build' ? '' : ' lang="it"'}>${promptHTML(ex)}</p>
    ${ex.base ? `<p class="pc__hint">${esc(ex.base)}</p>` : ''}`;

  const answer = ex.type === 'recognise'
    ? `
    <div class="pc__options" role="group" aria-label="Choose an answer">
      ${(ex.options || []).slice(0, 4).map((o, i) => `
        <button class="opt" type="button" data-opt="${i}" aria-pressed="false">
          <span class="opt__key" aria-hidden="true">${i + 1}</span><span lang="it">${esc(o)}</span>
        </button>`).join('')}
    </div>`
    : `
    <input class="pc__input" data-input type="text" lang="it" autocomplete="off" autocapitalize="off"
      autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Type your answer…" aria-label="Your answer">
    <div class="accents" role="group" aria-label="Accented letters">
      ${ACCENTS.map((c) => `<button type="button" tabindex="-1" data-acc="${c}" aria-label="Insert ${c}">${c}</button>`).join('')}
    </div>`;

  const hint = hints && ex.why
    ? `
    <div class="pc__hintbox">
      <button class="btn btn--ghost" type="button" data-hint>Show hint</button>
      <p class="pc__hinttext" data-hinttext hidden>${esc(ex.why)}</p>
    </div>`
    : '';

  return `${kind}${body}${answer}${hint}
    <div class="fb" data-fb aria-live="polite"></div>
    <div class="pc__actions">
      <span class="pc__keys pc__hint" data-keys><kbd class="kbd">Enter</kbd> to check</span>
      <span class="pc__btns">
        <button class="btn btn--ghost" type="button" data-right hidden>I was right</button>
        <button class="btn" type="button" data-go>Check</button>
      </span>
    </div>`;
}

/**
 * Runs a practice session in `root`. Grades into state.cards after each answer
 * (so leaving mid-session keeps them), logs every answer, and calls
 * onDone(results) when the queue is finished. Returns a cleanup function.
 *
 * Optional: `resume` (a snapshot from restoreSession) to continue a saved
 * session, and `onProgress(snapshot)` called after each answer with a
 * snapshot that resumes at the next card.
 */
export function runSession(root, cards, { mode = 'practice', lookup, store, audio, onDone, resume, onProgress } = {}) {
  let session = resume || startSession(cards.filter((c) => c && lookup(c.exerciseId)));
  let alive = true;
  let phase = 'answer'; // 'answer' | 'feedback'
  let checkedAt = 0;
  let token = 0; // per rendered card, so a late async callback can't touch the next card
  let timer = null;
  let rate = store.get().settings.slowDefault ? SLOW_RATE : 1;
  let ex = null;
  let card = null;
  let picked = null; // recognise: chosen option index
  let lastInput = '';
  let before; // the card's SRS state before this answer, for "I was right"
  let hasVoice = false;

  root.innerHTML = `
    <div class="session">
      <div class="session__bar">
        <div class="segs" data-segs aria-hidden="true"></div>
        <span class="mono session__count" data-count></span>
      </div>
      <div class="pc" data-card tabindex="-1"></div>
    </div>`;
  const sessionEl = root.querySelector('.session');
  const segsEl = root.querySelector('[data-segs]');
  const countEl = root.querySelector('[data-count]');
  const cardEl = root.querySelector('[data-card]');
  const $ = (sel) => cardEl.querySelector(sel);

  const snapshot = () => ({ queue: session.queue, pos: session.results.length, results: session.results });

  function drawBar() {
    segsEl.innerHTML = segmentStates(session).map((s) => `<i class="${s}"></i>`).join('');
    const n = Math.min(session.pos + 1, session.queue.length);
    countEl.innerHTML = `${n} / ${session.queue.length}<span class="sr-only"> cards</span>`;
  }

  function speak() {
    if (hasVoice && ex?.type === 'listen') audio.speak(ex.prompt, { rate });
  }

  function focusAnswer() {
    const input = $('[data-input]');
    (input || cardEl).focus({ preventScroll: true });
  }

  function render() {
    token++;
    clearTimeout(timer);
    card = session.queue[session.pos];
    ex = lookup(card.exerciseId);
    phase = 'answer';
    picked = null;
    before = undefined;
    hasVoice = false;
    const hints = !!card.hints && mode !== 'checkpoint';
    cardEl.className = 'pc';
    cardEl.style.animation = 'none'; // replay the entry animation for each card
    void cardEl.offsetWidth;
    cardEl.style.animation = '';
    cardEl.innerHTML = cardHTML(ex, card, { hints, mode });
    drawBar();
    wire();
    focusAnswer();
    if (ex.type === 'listen') setupAudio(token);
  }

  function setupAudio(t) {
    const setRate = (r) => {
      rate = r;
      cardEl.querySelectorAll('[data-rate]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.rate) === rate)));
    };
    setRate(rate);
    $('[data-play]').addEventListener('click', () => { speak(); focusAnswer(); });
    cardEl.querySelectorAll('[data-rate]').forEach((b) => b.addEventListener('click', () => {
      setRate(Number(b.dataset.rate));
      speak();
      focusAnswer();
    }));
    $('[data-show]').addEventListener('click', (e) => {
      $('[data-sentence]').hidden = false;
      e.currentTarget.hidden = true;
      focusAnswer();
    });
    audio.hasItalianVoice().then((ok) => {
      if (!alive || t !== token) return;
      hasVoice = ok;
      if (!ok) {
        $('[data-audio]').hidden = true;
        $('[data-novoice]').hidden = false;
      } else if (phase === 'answer') {
        timer = setTimeout(speak, AUTOPLAY_MS); // auto-play once
      }
    });
  }

  function pick(i) {
    if (phase !== 'answer' || !ex.options || i >= Math.min(ex.options.length, 4)) return;
    picked = i;
    cardEl.querySelectorAll('[data-opt]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.opt) === i)));
  }

  function wire() {
    const input = $('[data-input]');
    if (input) {
      input.addEventListener('input', () => {
        if (input.selectionStart !== input.value.length) return; // only rewrite at the end
        const next = applyAccentShortcut(input.value);
        if (next !== input.value) input.value = next;
      });
      cardEl.querySelectorAll('[data-acc]').forEach((b) => {
        b.addEventListener('mousedown', (e) => e.preventDefault()); // keep focus and caret in the input
        b.addEventListener('click', () => {
          if (input.readOnly) return;
          const s = input.selectionStart ?? input.value.length;
          const e = input.selectionEnd ?? s;
          input.value = input.value.slice(0, s) + b.dataset.acc + input.value.slice(e);
          input.setSelectionRange(s + 1, s + 1);
          input.focus({ preventScroll: true });
        });
      });
    }
    cardEl.querySelectorAll('[data-opt]').forEach((b) => b.addEventListener('click', () => pick(Number(b.dataset.opt))));
    $('[data-hint]')?.addEventListener('click', (e) => {
      $('[data-hinttext]').hidden = false;
      e.currentTarget.hidden = true;
      focusAnswer();
    });
    $('[data-go]').addEventListener('click', act);
    $('[data-right]').addEventListener('click', overrule);
  }

  function act() {
    if (!alive) return;
    if (phase === 'answer') check();
    else if (performance.now() - checkedAt >= DEBOUNCE_MS) advance();
  }

  function check() {
    const input = $('[data-input]');
    const value = ex.type === 'recognise' ? (picked == null ? '' : ex.options[picked]) : input.value;
    if (!value.trim()) return;
    const extra = store.get().extraAnswers[ex.id] || [];
    const res = judge(ex, value, extra);
    const pass = isPass(res.verdict);
    phase = 'feedback';
    checkedAt = performance.now();
    lastInput = value;
    clearTimeout(timer);

    session = recordAnswer(session, { verdict: res.verdict, pass }, mode);
    store.update((d) => {
      before = applyAnswer(d, { card, verdict: res.verdict, pass, mode, now: new Date() });
    });
    onProgress?.(snapshot());

    if (input) input.readOnly = true;
    if (ex.type === 'recognise') {
      cardEl.querySelectorAll('[data-opt]').forEach((b) => {
        b.setAttribute('aria-disabled', 'true');
        const i = Number(b.dataset.opt);
        if (i === picked) b.classList.add(pass ? 'is-right' : 'is-wrong');
        else if (mode !== 'checkpoint' && !pass && normalize(ex.options[i]) === normalize(res.target)) b.classList.add('is-right');
      });
    }
    showFeedback(res, [...ex.answers, ...extra]);
    $('[data-go]').textContent = 'Continue →';
    $('[data-keys]').innerHTML = '<kbd class="kbd">Enter</kbd> to continue';
    if (!pass) {
      $('[data-right]').hidden = false;
      cardEl.classList.remove('shake');
      void cardEl.offsetWidth; // restart the animation
      cardEl.classList.add('shake');
    }
    drawBar();
    speak();
  }

  function showFeedback(res, answers) {
    const f = feedbackFor(res, ex, mode);
    const parts = [`<span class="fb__bar"></span><p class="fb__verdict">${esc(f.title)}</p>`];
    if (f.showTarget) {
      const marks = f.marked ? answerMarks(res, answers) : answerMarks({ target: res.target }, []);
      parts.push(`<p class="fb__target" lang="it">${targetHTML(ex, marks)}</p>`);
    } else if (ex.type === 'listen') {
      parts.push(`<p class="fb__target" lang="it">${esc(ex.prompt)}</p>`); // always reveal what was said
    }
    if (f.body) parts.push(`<p class="fb__body">${esc(f.body)}</p>`);
    if (mode !== 'checkpoint' && ex.type !== 'build' && ex.en) parts.push(`<p class="fb__en">${esc(ex.en)}</p>`);
    const fb = $('[data-fb]');
    fb.className = `fb fb--${f.tone}`;
    fb.innerHTML = parts.join('');
  }

  function overrule() {
    if (phase !== 'feedback' || session.results[session.pos]?.pass) return;
    session = overruleAnswer(session);
    store.update((d) => applyOverrule(d, { card, input: lastInput, before, mode, now: new Date() }));
    onProgress?.(snapshot());
    const fb = $('[data-fb]');
    fb.className = 'fb fb--ok';
    fb.innerHTML = `<span class="fb__bar"></span><p class="fb__verdict">Noted.</p>
      <p class="fb__body">“<span lang="it">${esc(lastInput)}</span>” now counts as correct for this card. It's saved to your reports so the content can be fixed.</p>`;
    $('[data-right]').hidden = true;
    $('[data-go]').focus({ preventScroll: true });
    drawBar();
  }

  function advance() {
    session = nextCard(session);
    if (isFinished(session)) finish();
    else render();
  }

  function finish() {
    const results = session.results;
    stop();
    onDone?.(results);
  }

  function onKey(e) {
    if (!alive || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
    const t = e.target instanceof Element ? e.target : null;
    const onOption = !!t?.closest('[data-opt]');
    const onControl = !onOption && !!t?.closest('button, a, summary, select, textarea');
    if (e.key === 'Enter') {
      if (onControl) return; // the focused button or link handles its own Enter
      e.preventDefault();
      if (e.repeat) return;
      if (onOption && phase === 'answer') pick(Number(t.closest('[data-opt]').dataset.opt)); // Enter on a Tab-focused option picks it
      act();
    } else if (e.key === ' ') {
      // Space replays, unless it is typing a space into an answer already started
      if (ex?.type !== 'listen' || onControl || onOption || (t?.matches('input') && t.value !== '')) return;
      e.preventDefault();
      speak();
    } else if (/^[1-4]$/.test(e.key) && ex?.type === 'recognise' && !t?.matches('input')) {
      e.preventDefault();
      pick(Number(e.key) - 1);
    }
  }

  // Keep the action row above the on-screen keyboard (CSS reads --kb on phones).
  const vv = globalThis.visualViewport;
  function onViewport() {
    const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    sessionEl.style.setProperty('--kb', `${Math.round(kb)}px`);
  }

  function stop() {
    if (!alive) return;
    alive = false;
    clearTimeout(timer);
    document.removeEventListener('keydown', onKey);
    vv?.removeEventListener('resize', onViewport);
    vv?.removeEventListener('scroll', onViewport);
  }

  document.addEventListener('keydown', onKey);
  vv?.addEventListener('resize', onViewport);
  vv?.addEventListener('scroll', onViewport);

  if (isFinished(session)) {
    // nothing to practise (empty pool, or a snapshot saved after the last answer)
    queueMicrotask(finish);
  } else {
    render();
  }

  return () => {
    stop();
    globalThis.speechSynthesis?.cancel();
  };
}
