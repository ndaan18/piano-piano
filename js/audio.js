// Speech synthesis wrapper: Italian voice selection, rate, missing-voice detection.
// No DOM access at import time; pickVoice is pure so node can test it.

export const SLOW_RATE = 0.7;
const PREFERRED = /enhanced|premium|alice|federica/i;
const VOICE_WAIT_MS = 1500;

const isItalian = (v) => /^it([-_]|$)/i.test(v.lang || '');

/** The voice to use: the saved voiceURI, then a preferred Italian voice, then any Italian voice. */
export function pickVoice(voices, savedURI) {
  const italian = voices.filter(isItalian);
  return (
    (savedURI && italian.find((v) => v.voiceURI === savedURI)) ||
    italian.find((v) => PREFERRED.test(v.name)) ||
    italian[0] ||
    null
  );
}

export function createAudio(store, synth = globalThis.speechSynthesis) {
  let loading = null;

  // Safari and Chrome fill the voice list asynchronously; wait briefly for it.
  function allVoices() {
    if (!synth) return Promise.resolve([]);
    const now = synth.getVoices();
    if (now.length) return Promise.resolve(now);
    loading ??= new Promise((resolve) => {
      const done = () => {
        clearTimeout(timer);
        synth.removeEventListener?.('voiceschanged', done);
        loading = null;
        resolve(synth.getVoices());
      };
      const timer = setTimeout(done, VOICE_WAIT_MS);
      synth.addEventListener?.('voiceschanged', done);
    });
    return loading;
  }

  return {
    /** Italian voices only: the ones worth choosing between in Settings. */
    async voices() {
      return (await allVoices()).filter(isItalian);
    },
    async hasItalianVoice() {
      return (await allVoices()).some(isItalian);
    },
    setVoice(voiceURI) {
      store.update((s) => { s.settings.voiceURI = voiceURI; });
    },
    /** Speaks `text`, cutting off anything playing, or after it with `queue`. */
    speak(text, { rate = 1, queue = false, onstart, onend } = {}) {
      if (!synth || !globalThis.SpeechSynthesisUtterance || !text) return;
      if (!queue) synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'it-IT';
      u.rate = rate;
      const voice = pickVoice(synth.getVoices(), store.get().settings.voiceURI);
      if (voice) u.voice = voice;
      if (onstart) u.onstart = onstart;
      if (onend) { u.onend = onend; u.onerror = onend; }
      synth.speak(u);
    },
    stop() {
      synth?.cancel();
    },
  };
}
