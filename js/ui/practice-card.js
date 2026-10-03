// Practice card session (spec §5, §6, §7.5; prototype in mockups/interaction-sketches-v2).
// One centred card at a time: Enter checks, Enter continues, Space replays audio.
// Audio cards (listen, or any card with `say`) play first and can be skipped;
// without an Italian voice they are dropped from the session.
// Used by every practice mode: lesson ('practice'), mixed, scene, checkpoint, review, drill.
//
// The top half is pure (session state, store mutations, feedback copy, answer
// marking) so node can test it. runSession() is the DOM part.

import { judge, isPass, applyAccentShortcut, normalize, answerTexts, ACCENT_MESSAGE } from '../engine/checker.js';
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
export const SKIP_ALL_AFTER = 3; // consecutive "Can't listen now" before "Skip all audio cards" is offered

/** An audio card plays a sentence before it is answered: every listen card, and any card with `say`. */
export const isAudioCard = (ex) => ex?.type === 'listen' || !!ex?.say;

/** A register card hides its chip until answered, unless it has hints; the feedback then shows it. */
export const showRegChipBefore = (ex, hints) => ex.type !== 'register' || !!hints;

/** What the card speaks: the listen prompt, else `say`, else the gap sentence filled in, else the first answer. */
export function spokenText(ex) {
  if (ex.type === 'listen') return ex.prompt;
  if (ex.say) return ex.say;
  const first = ex.answers?.length ? answerTexts(ex)[0] : '';
  const prompt = String(ex.prompt || '');
  return prompt.includes(GAP) ? prompt.split(GAP).join(first) : first;
}

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

/** "Can't listen now": the current card moves to the end, ungraded. A lone last card stays put. */
export function skipCard(session) {
  const { queue, pos } = session;
  if (pos >= queue.length - 1) return session;
  return { ...session, queue: [...queue.slice(0, pos), ...queue.slice(pos + 1), queue[pos]] };
}

/** Removes every card not yet shown (index ≥ pos) whose exerciseId matches `predicate`. */
export function dropCards(session, predicate) {
  const { queue, pos } = session;
  return { ...session, queue: queue.filter((c, i) => i < pos || !predicate(c.exerciseId)) };
}

/** Cards practised in a session: first attempts only. 0 means nothing was practised. */
export const practisedCount = (results) => (results || []).filter((r) => r && !r.retry).length;

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

/** The done block for a session that practised nothing: every card needed sound. */
export function nothingPractisedHTML(href, label) {
  return `
    <section class="card ldone">
      <span class="chip">Nothing practised</span>
      <p class="ldone__text">These cards need sound. Find a quiet moment, or install an Italian voice in <a href="#/settings">Settings</a>.</p>
      <div class="ldone__go"><a class="btn" href="${esc(href)}" data-back>${esc(label)}</a></div>
    </section>`;
}

function cardHTML(ex, card, { hints, mode, skips }) {
  const audio = isAudioCard(ex);
  const kind = `
    <div class="pc__kind">
      <span class="chip">${TYPE_LABELS[ex.type] || esc(ex.type)}</span>${showRegChipBefore(ex, hints) ? regChip(ex.reg) : ''}
      ${card.retry ? '<span class="chip chip--retry">second try</span>' : ''}
    </div>`;

  // audio cards play the sentence first; a listen card's prompt is the sentence itself, so it stays hidden
  const sound = audio
    ? `
    <div class="pc__audio" data-audio>
      <button class="play play--lg" type="button" data-play aria-label="Play the sentence">${PLAY_ICON}</button>
      <div class="speed" role="group" aria-label="Speed">
        <button type="button" data-rate="1">Normal</button><button type="button" data-rate="${SLOW_RATE}">Slow</button>
      </div>
      <span class="pc__hint">${ex.type === 'recognise' ? 'Pick' : 'Type'} what you hear<span class="pc__keys"> · <kbd class="kbd">Space</kbd> ${ex.type === 'recognise' ? 'replays' : 'replays until you start typing'}</span></span>
    </div>`
    : '';
  const body = ex.type === 'listen'
    ? ''
    : `
    <p class="pc__prompt"${ex.type === 'build' ? '' : ' lang="it"'}>${promptHTML(ex)}</p>
    ${ex.base ? `<p class="pc__hint">${esc(ex.base)}</p>` : ''}`;

  const skip = audio && mode !== 'checkpoint'
    ? `
    <div class="pc__skip" data-skiprow>
      <button class="btn btn--ghost" type="button" data-skip>Can't listen now</button>
      ${skips >= SKIP_ALL_AFTER ? '<button class="btn btn--ghost" type="button" data-skipall>Skip all audio cards this session</button>' : ''}
    </div>`
    : '';

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

  return `${kind}${sound}${body}${answer}${hint}${skip}
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
  let timer = null;
  let rate = store.get().settings.slowDefault ? SLOW_RATE : 1;
  let ex = null;
  let card = null;
  let picked = null; // recognise: chosen option index
  let lastInput = '';
  let before; // the card's SRS state before this answer, for "I was right"
  let voice = false; // an Italian voice is installed; known before the first card
  let hintsOn = false; // the current card shows its hint (guided practice)
  let skips = 0; // consecutive "Can't listen now"; reset by answering a card

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

  // audio cards play themselves; "Hear it" (hear) is the only way to play any other card
  function speak() {
    if (voice && ex && isAudioCard(ex)) audio.speak(spokenText(ex), { rate });
  }

  function hear() {
    if (voice && ex) audio.speak(spokenText(ex), { rate });
    focusAnswer();
  }

  function focusAnswer() {
    const input = $('[data-input]');
    (input || cardEl).focus({ preventScroll: true });
  }

  function render() {
    clearTimeout(timer);
    card = session.queue[session.pos];
    ex = lookup(card.exerciseId);
    phase = 'answer';
    picked = null;
    before = undefined;
    const hints = !!card.hints && mode !== 'checkpoint';
    hintsOn = hints;
    cardEl.className = 'pc';
    cardEl.style.animation = 'none'; // replay the entry animation for each card
    void cardEl.offsetWidth;
    cardEl.style.animation = '';
    cardEl.innerHTML = cardHTML(ex, card, { hints, mode, skips });
    drawBar();
    wire();
    focusAnswer();
    if (isAudioCard(ex)) setupAudio();
  }

  function setupAudio() {
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
    timer = setTimeout(speak, AUTOPLAY_MS); // auto-play once
  }

  /** Shows the next card, or ends the session when none is left. */
  function show() {
    if (isFinished(session)) finish();
    else render();
  }

  // "Can't listen now": the card goes to the end of the queue, ungraded. A last card
  // has nothing to go behind, so it is dropped instead and the learner is never stuck.
  function skip() {
    if (!alive || phase !== 'answer') return;
    const moved = skipCard(session);
    session = moved !== session ? moved : dropCards(session, (id) => id === card.exerciseId);
    skips++;
    audio.stop?.();
    show();
  }

  function skipAll() {
    if (!alive || phase !== 'answer') return;
    session = dropCards(session, (id) => isAudioCard(lookup(id)));
    skips = 0;
    audio.stop?.();
    show();
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
    $('[data-skip]')?.addEventListener('click', skip);
    $('[data-skipall]')?.addEventListener('click', skipAll);
    $('[data-go]').addEventListener('click', act);
    $('[data-right]').addEventListener('click', overrule);
  }

  function act() {
    if (!alive || !ex) return; // no card yet: waiting to learn whether there is a voice
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
    skips = 0;
    clearTimeout(timer);
    const skipRow = $('[data-skiprow]');
    if (skipRow) skipRow.hidden = true;

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
    showFeedback(res, [...answerTexts(ex), ...extra]);
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

  // the feedback box, with "Hear it" (never auto-played) when there is a voice
  function setFeedback(tone, html) {
    const fb = $('[data-fb]');
    fb.className = `fb fb--${tone}`;
    fb.innerHTML = html + (voice && (mode !== 'checkpoint' || isAudioCard(ex))
      ? `<button class="btn btn--ghost fb__hear" type="button" data-hear>${PLAY_ICON}Hear it</button>`
      : '');
    fb.querySelector('[data-hear]')?.addEventListener('click', hear);
  }

  // the verdict, with the register chip beside it when the card hid it before answering
  function verdictHTML(title) {
    const verdict = `<p class="fb__verdict">${esc(title)}</p>`;
    return showRegChipBefore(ex, hintsOn) ? verdict : `<div class="fb__head">${verdict}${regChip(ex.reg)}</div>`;
  }

  function showFeedback(res, answers) {
    const f = feedbackFor(res, ex, mode);
    const parts = [`<span class="fb__bar"></span>${verdictHTML(f.title)}`];
    if (res.note) parts.push(`<p class="fb__body">${esc(res.note)}</p>`);
    if (f.showTarget) {
      const marks = f.marked ? answerMarks(res, answers) : answerMarks({ target: res.target }, []);
      parts.push(`<p class="fb__target" lang="it">${targetHTML(ex, marks)}</p>`);
    } else if (ex.type === 'listen') {
      parts.push(`<p class="fb__target" lang="it">${esc(ex.prompt)}</p>`); // always reveal what was said
    }
    if (f.body) parts.push(`<p class="fb__body">${esc(f.body)}</p>`);
    if (mode !== 'checkpoint' && ex.type !== 'build' && ex.en) parts.push(`<p class="fb__en">${esc(ex.en)}</p>`);
    setFeedback(f.tone, parts.join(''));
  }

  function overrule() {
    if (phase !== 'feedback' || session.results[session.pos]?.pass) return;
    session = overruleAnswer(session);
    store.update((d) => applyOverrule(d, { card, input: lastInput, before, mode, now: new Date() }));
    onProgress?.(snapshot());
    setFeedback('ok', `<span class="fb__bar"></span>${verdictHTML('Noted.')}
      <p class="fb__body">“<span lang="it">${esc(lastInput)}</span>” now counts as correct for this card. It's saved to your reports so the content can be fixed.</p>`);
    $('[data-right]').hidden = true;
    $('[data-go]').focus({ preventScroll: true });
    drawBar();
  }

  function advance() {
    session = nextCard(session);
    show();
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
      if (!ex || !isAudioCard(ex) || onControl || onOption || (t?.matches('input') && t.value !== '')) return;
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

  // Without an Italian voice, audio cards can't be done: drop them before the first card.
  // An empty session (empty pool, a snapshot saved after the last answer, or only audio
  // cards and no voice) finishes at once with the results so far.
  const begin = (ok) => {
    if (!alive) return;
    voice = ok;
    if (!voice) session = dropCards(session, (id) => isAudioCard(lookup(id)));
    show();
  };
  audio.hasItalianVoice().then(begin, () => begin(false));

  return () => {
    stop();
    globalThis.speechSynthesis?.cancel();
  };
}
