// Progress store: localStorage persistence with in-memory fallback,
// JSON export/import. No DOM access at import time.

export const KEY = 'pianopiano:v1';
const CORRUPT_KEY = `${KEY}:corrupt`;
const PROBE_KEY = `${KEY}:probe`;

export function defaultState() {
  return {
    version: 1,
    cards: {},
    units: {},
    resume: null,
    extraAnswers: {},
    reports: [],
    settings: { voiceURI: null, slowDefault: false },
    log: [],
  };
}

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function isValid(obj) {
  return isPlainObject(obj) && obj.version === 1 && isPlainObject(obj.cards) && isPlainObject(obj.units);
}

// Saved fields win; anything missing (added in later versions) comes from the default.
function withDefaults(saved) {
  const base = defaultState();
  return { ...base, ...saved, settings: { ...base.settings, ...(isPlainObject(saved.settings) ? saved.settings : {}) } };
}

function probe(storage) {
  if (!storage) return false;
  try {
    storage.setItem(PROBE_KEY, '1');
    storage.removeItem(PROBE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function createStore(storage = globalThis.localStorage) {
  let persistent = probe(storage);
  let state = defaultState();
  const listeners = new Set();

  if (persistent) {
    let raw = null;
    try { raw = storage.getItem(KEY); } catch { raw = null; }
    if (raw != null) {
      let parsed = null;
      try { parsed = JSON.parse(raw); } catch { parsed = null; }
      if (isValid(parsed)) {
        state = withDefaults(parsed);
      } else {
        try { storage.setItem(CORRUPT_KEY, raw); } catch { /* keep going with defaults */ }
      }
    }
  }

  function notify() {
    for (const fn of [...listeners]) fn(structuredClone(state));
  }

  function save() {
    if (!persistent) return;
    try {
      storage.setItem(KEY, JSON.stringify(state));
    } catch {
      persistent = false;
    }
  }

  const store = {
    get persistent() { return persistent; },
    get() { return structuredClone(state); },
    update(fn) {
      const draft = structuredClone(state);
      fn(draft);
      state = draft;
      save();
      notify();
      return structuredClone(state);
    },
    exportJSON() { return JSON.stringify(state, null, 2); },
    importJSON(text) {
      let parsed;
      try { parsed = JSON.parse(text); } catch { throw new Error('Invalid progress file'); }
      if (!isValid(parsed)) throw new Error('Invalid progress file');
      state = withDefaults(parsed);
      save();
      notify();
    },
    reset() {
      state = defaultState();
      save();
      notify();
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => { listeners.delete(fn); };
    },
  };
  return store;
}
