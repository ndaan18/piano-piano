import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore, KEY, defaultState } from '../js/store.js';

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: (k) => { delete data[k]; },
  };
}

function throwingStorage() {
  return {
    getItem: () => null,
    setItem: () => { throw new Error('QuotaExceededError'); },
    removeItem: () => {},
  };
}

const DEFAULT = {
  version: 1, cards: {}, units: {}, resume: null, extraAnswers: {}, reports: [],
  settings: { voiceURI: null, slowDefault: false }, log: [],
};

test('fresh store returns the default state', () => {
  const store = createStore(memoryStorage());
  assert.deepEqual(store.get(), DEFAULT);
  assert.equal(store.persistent, true);
  assert.equal(KEY, 'pianopiano:v1');
});

test('imports cleanly with no localStorage global', () => {
  const store = createStore();
  assert.equal(typeof store.get, 'function');
});

test('update persists and a new store reads it back', () => {
  const storage = memoryStorage();
  const a = createStore(storage);
  a.update((s) => { s.cards.x = { box: 1, due: '2026-10-03', seen: 1, correct: 1, lastWrong: null }; });
  assert.ok(storage.data[KEY]);
  const b = createStore(storage);
  assert.equal(b.get().cards.x.box, 1);
});

test('get and update return clones; callers cannot mutate stored state', () => {
  const store = createStore(memoryStorage());
  const snap = store.get();
  snap.cards.hack = {};
  assert.deepEqual(store.get().cards, {});
  const returned = store.update((s) => { s.units.u = { lessonsDone: [] }; });
  returned.units.u.lessonsDone.push('l1');
  assert.deepEqual(store.get().units.u.lessonsDone, []);
});

test('update does not apply a draft whose fn throws', () => {
  const store = createStore(memoryStorage());
  assert.throws(() => store.update((s) => { s.cards.x = {}; throw new Error('boom'); }), /boom/);
  assert.deepEqual(store.get().cards, {});
});

test('older saves are merged over the default state', () => {
  const old = { version: 1, cards: { a: { box: 2 } }, units: {} };
  const store = createStore(memoryStorage({ [KEY]: JSON.stringify(old) }));
  const s = store.get();
  assert.deepEqual(s.log, []);
  assert.deepEqual(s.settings, { voiceURI: null, slowDefault: false });
  assert.equal(s.cards.a.box, 2);
  assert.equal(s.resume, null);
});

test('throwing storage falls back to memory and update still works', () => {
  const store = createStore(throwingStorage());
  assert.equal(store.persistent, false);
  store.update((s) => { s.settings.slowDefault = true; });
  assert.equal(store.get().settings.slowDefault, true);
});

test('missing storage falls back to memory', () => {
  const store = createStore(null);
  assert.equal(store.persistent, false);
  store.update((s) => { s.reports.push('r'); });
  assert.deepEqual(store.get().reports, ['r']);
});

test('save failure after load switches to memory mode and notifies', () => {
  const storage = memoryStorage();
  const store = createStore(storage);
  assert.equal(store.persistent, true);
  let calls = 0;
  store.subscribe(() => { calls++; });
  storage.setItem = () => { throw new Error('QuotaExceededError'); };
  store.update((s) => { s.cards.x = { box: 1 }; });
  assert.equal(store.persistent, false);
  assert.equal(store.get().cards.x.box, 1);
  assert.equal(calls, 1);
});

test('export -> import round-trips deep-equal', () => {
  const a = createStore(memoryStorage());
  a.update((s) => {
    s.cards.x = { box: 3, due: '2026-10-09', seen: 4, correct: 3, lastWrong: '2026-10-01' };
    s.units.u1 = { lessonsDone: ['l1'], mixedDone: true, sceneDone: false, checkpointBest: 0.8 };
    s.extraAnswers.x = ['alt'];
    s.log.push({ date: '2026-10-02', pass: true });
  });
  const text = a.exportJSON();
  const b = createStore(memoryStorage());
  b.importJSON(text);
  assert.deepEqual(b.get(), a.get());
});

test('import persists to storage', () => {
  const storage = memoryStorage();
  const a = createStore(memoryStorage());
  a.update((s) => { s.cards.x = { box: 1 }; });
  const b = createStore(storage);
  b.importJSON(a.exportJSON());
  assert.equal(createStore(storage).get().cards.x.box, 1);
});

test('corrupt imports throw and leave the state untouched', () => {
  const store = createStore(memoryStorage());
  store.update((s) => { s.cards.keep = { box: 1 }; });
  const before = store.get();
  for (const bad of ['{"version":2}', 'nope', '{"version":1,"cards":[],"units":{}}', '{"version":1,"cards":{},"units":null}', 'null', '[]']) {
    assert.throws(() => store.importJSON(bad), { message: 'Invalid progress file' }, bad);
    assert.deepEqual(store.get(), before);
  }
});

test('corrupt stored JSON starts from default and keeps a backup', () => {
  const storage = memoryStorage({ [KEY]: '{not json' });
  const store = createStore(storage);
  assert.deepEqual(store.get(), DEFAULT);
  assert.equal(storage.data[`${KEY}:corrupt`], '{not json');
});

test('stored JSON of the wrong shape is treated as corrupt', () => {
  const raw = JSON.stringify({ version: 1, cards: [], units: {} });
  const storage = memoryStorage({ [KEY]: raw });
  const store = createStore(storage);
  assert.deepEqual(store.get(), DEFAULT);
  assert.equal(storage.data[`${KEY}:corrupt`], raw);
});

test('reset restores defaults, persists and notifies', () => {
  const storage = memoryStorage();
  const store = createStore(storage);
  store.update((s) => { s.cards.x = { box: 1 }; });
  let last = null;
  store.subscribe((s) => { last = s; });
  store.reset();
  assert.deepEqual(store.get(), DEFAULT);
  assert.deepEqual(last, DEFAULT);
  assert.deepEqual(createStore(storage).get(), DEFAULT);
});

test('subscribe notifies on update/import and unsubscribe stops it', () => {
  const store = createStore(memoryStorage());
  const seen = [];
  const off = store.subscribe((s) => seen.push(Object.keys(s.cards).length));
  store.update((s) => { s.cards.a = {}; });
  store.importJSON(JSON.stringify(DEFAULT));
  assert.deepEqual(seen, [1, 0]);
  off();
  store.update((s) => { s.cards.b = {}; });
  assert.equal(seen.length, 2);
});

test('defaultState returns a fresh object each time', () => {
  const a = defaultState();
  a.cards.x = 1;
  assert.deepEqual(defaultState().cards, {});
});
