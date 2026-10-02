// App shell: hash router, nav state, page mounting.
// Page contract: each module in js/pages/ exports
//   async mount(root, params, { store, navigate, audio }) -> (() => void) | void
// A route whose module doesn't exist yet renders a "Coming soon" page.

import { createStore } from './store.js';
import { createAudio } from './audio.js';

// One table for every route. Later tasks add the page files; no edits needed here.
// `params` are fixed extras merged into the URL params (e.g. the lesson page's mode).
const ROUTES = [
  { path: '', page: 'home', nav: 'path' },
  { path: 'home', page: 'home', nav: 'path' },
  { path: 'unit/:u', page: 'unit', nav: 'path' },
  { path: 'lesson/:u/:lessonId', page: 'lesson', nav: 'path', params: { mode: 'lesson' } },
  { path: 'mixed/:u', page: 'lesson', nav: 'path', params: { mode: 'mixed' } },
  { path: 'drill/:u', page: 'lesson', nav: 'path', params: { mode: 'drill' } },
  { path: 'scene/:u', page: 'scene', nav: 'path' },
  { path: 'checkpoint/:u', page: 'checkpoint', nav: 'path' },
  { path: 'review', page: 'review', nav: 'review' },
  { path: 'reference', page: 'reference', nav: 'reference' },
  { path: 'settings', page: 'settings', nav: 'settings' },
];

/** '#/lesson/2/u2-l1' → { route, params: { u: '2', lessonId: 'u2-l1', mode: 'lesson' } }, or null. */
function matchRoute(hash) {
  let parts;
  try { parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent); } catch { return null; }
  for (const route of ROUTES) {
    const pattern = route.path.split('/').filter(Boolean);
    if (pattern.length !== parts.length) continue;
    const params = {};
    const ok = pattern.every((seg, i) => {
      if (seg.startsWith(':')) { params[seg.slice(1)] = parts[i]; return true; }
      return seg === parts[i];
    });
    if (ok) return { route, params: { ...params, ...route.params } };
  }
  return null;
}

const store = createStore();
const audio = createAudio(store);
const app = document.getElementById('app');
let cleanup = null;
let current = 0; // increments per navigation; a slower, older mount is discarded
let firstRender = true;

function navigate(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

function setNav(nav) {
  for (const a of document.querySelectorAll('[data-nav]')) {
    if (a.dataset.nav === nav) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
}

async function loadPage(name) {
  const url = new URL(`./pages/${name}.js`, import.meta.url);
  try {
    return await import(url.href);
  } catch (err) {
    // Only a missing file means "not built yet"; anything else is a real error.
    const res = await fetch(url, { method: 'HEAD' }).catch(() => null);
    if (res && res.status === 404) return null;
    throw err;
  }
}

function comingSoon(view) {
  view.innerHTML = `
    <div class="soon">
      <span class="mono">Coming soon</span>
      <h1 class="soon__title">This page isn't built yet.</h1>
      <a class="btn" href="#/">← Back to your path</a>
    </div>`;
}

function failed(view) {
  view.innerHTML = `
    <div class="soon">
      <span class="mono">Something went wrong</span>
      <h1 class="soon__title">This page couldn't load.</h1>
      <p>Your progress is safe. Try reloading the page.</p>
      <a class="btn" href="#/">← Back to your path</a>
    </div>`;
}

async function render() {
  const token = ++current;
  const match = matchRoute(location.hash);
  if (!match) {
    location.replace('#/');
    return;
  }
  if (cleanup) { try { cleanup(); } catch (err) { console.error(err); } }
  cleanup = null;

  setNav(match.route.nav);
  document.title = 'italiano.';
  // Each page gets a fresh container, so a stale async mount writes to a detached node.
  const view = document.createElement('div');
  view.className = 'view';
  app.replaceChildren(view);
  if (!firstRender) {
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }
  firstRender = false;

  try {
    const page = await loadPage(match.route.page);
    if (token !== current) return;
    if (!page) { comingSoon(view); return; }
    const done = await page.mount(view, match.params, { store, navigate, audio });
    if (typeof done === 'function') {
      if (token === current) cleanup = done;
      else done();
    }
  } catch (err) {
    console.error(err);
    if (token === current) failed(view);
  }
}

// The skip link targets #app; keep it from changing the route.
document.querySelector('.skip')?.addEventListener('click', (e) => {
  e.preventDefault();
  app.focus();
});
window.addEventListener('hashchange', render);
render();
