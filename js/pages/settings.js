// Settings (spec §7, small, from the footer): voice, slow-speed default,
// export / import progress, export reports, reset.

import { SLOW_RATE, pickVoice } from '../audio.js';
import { localDate } from '../engine/srs.js';
import { esc, NO_VOICE_HTML } from '../ui/dom.js';

export const TEST_PHRASE = 'Ciao! Come stai?';
const RESET_PROMPT = "Reset all progress? This can't be undone.";

/** 'piano-piano-progress-2026-10-03.json', dated by the local calendar day. */
export const exportFilename = (date) => `piano-piano-progress-${localDate(date)}.json`;
export const reportsFilename = (date) => `piano-piano-reports-${localDate(date)}.json`;

function download(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function mount(root, params, ctx) {
  const { store, audio } = ctx;
  document.title = 'Settings · italiano.';
  const voices = await audio.voices();
  if (!root.isConnected) return; // left while loading
  let message = null; // { text, error }

  function draw() {
    const state = store.get();
    const chosen = pickVoice(voices, state.settings.voiceURI);
    const reports = state.reports.length;
    root.innerHTML = `
      <div class="settings">
        <div class="topbar"><h1 class="settings__title">Settings</h1></div>

        <section class="card settings__card" aria-labelledby="set-audio">
          <h2 class="sec__title" id="set-audio">Audio</h2>
          ${voices.length ? `
          <div class="settings__row">
            <label class="settings__field"><span class="mono">Voice</span>
              <select class="settings__select" data-voice>
                ${voices.map((v) => `<option value="${esc(v.voiceURI)}"${v === chosen ? ' selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}
              </select></label>
            <button class="btn btn--ghost" type="button" data-test>Test voice</button>
          </div>` : `<div class="notice">${NO_VOICE_HTML}</div>`}
          <label class="settings__check"><input type="checkbox" data-slow${state.settings.slowDefault ? ' checked' : ''}>
            <span><b>Slow by default</b><span class="settings__hint">Sentences play at a slower speed unless you pick Normal.</span></span></label>
        </section>

        <section class="card settings__card" aria-labelledby="set-progress">
          <h2 class="sec__title" id="set-progress">Your progress</h2>
          <p class="settings__hint">Progress lives in this browser only. Export it to keep a copy or move to another device.</p>
          <div class="settings__btns">
            <button class="btn btn--ghost" type="button" data-export>Export progress</button>
            <button class="btn btn--ghost" type="button" data-import>Import progress</button>
            <input type="file" accept=".json,application/json" data-file hidden>
          </div>
          <p class="settings__msg${message?.error ? ' settings__msg--error' : ''}" role="status" data-msg>${message ? esc(message.text) : ''}</p>
        </section>

        <section class="card settings__card" aria-labelledby="set-reports">
          <h2 class="sec__title" id="set-reports">Reports</h2>
          <p class="settings__hint">Answers you marked as correct are saved here so the content can be fixed.</p>
          <div class="settings__btns">
            <button class="btn btn--ghost" type="button" data-reports${reports ? '' : ' disabled'}>Export reports</button>
            ${reports ? `<span class="mono">${reports} saved</span>` : '<span class="mono">No reports yet</span>'}
          </div>
        </section>

        <section class="card settings__card" aria-labelledby="set-reset">
          <h2 class="sec__title" id="set-reset">Reset</h2>
          <p class="settings__hint">Clears every lesson, review card and setting in this browser.</p>
          <div class="settings__btns"><button class="btn btn--danger" type="button" data-reset>Reset progress</button></div>
        </section>
      </div>`;
  }
  draw();

  const $ = (sel) => root.querySelector(sel);
  root.addEventListener('change', async (e) => {
    if (e.target.matches('[data-voice]')) {
      audio.setVoice(e.target.value);
    } else if (e.target.matches('[data-slow]')) {
      const slow = e.target.checked;
      store.update((s) => { s.settings.slowDefault = slow; });
    } else if (e.target.matches('[data-file]')) {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file) return;
      let text = null;
      try { text = await file.text(); } catch { text = null; }
      if (!root.isConnected) return;
      try {
        if (text == null) throw new Error('Invalid progress file');
        store.importJSON(text);
        message = { text: 'Progress imported.' };
      } catch {
        message = { text: 'Invalid progress file', error: true };
      }
      draw();
      $('[data-import]').focus();
    }
  });
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || btn.disabled) return;
    if (btn.matches('[data-test]')) {
      audio.speak(TEST_PHRASE, { rate: store.get().settings.slowDefault ? SLOW_RATE : 1 });
    } else if (btn.matches('[data-export]')) {
      download(exportFilename(new Date()), store.exportJSON());
    } else if (btn.matches('[data-import]')) {
      $('[data-file]').click();
    } else if (btn.matches('[data-reports]')) {
      download(reportsFilename(new Date()), JSON.stringify(store.get().reports, null, 2));
    } else if (btn.matches('[data-reset]')) {
      if (!confirm(RESET_PROMPT)) return;
      store.reset();
      message = { text: 'Progress reset.' };
      draw();
      $('[data-reset]').focus();
    }
  });
}
