# piano piano

A small, static site for learning Italian grammar from A1 to A2 ("piano piano" means "slowly, step by step"). Each of the 19 units is a short path: lessons that explain one rule at a time, mixed practice, a real-life scene, and a checkpoint that unlocks the next unit. Mistakes come back later through spaced review. It is plain HTML, CSS and ES modules: no build step and no npm dependencies. Progress is saved in your browser, so there is no account and no server. Units 00 to 05 are written so far; the rest show as "being written".

## Run it locally

ES modules do not load from `file://`, so serve the folder:

```sh
python3 -m http.server 4173
```

Then open <http://localhost:4173/>. (`npm run serve` does the same.)

## Tests

Needs Node 22 or newer. There is nothing to install.

```sh
npm test            # node --test over tests/**/*.test.js
npm run validate    # checks every unit's content
```

## Project structure

```
index.html               app shell and nav
css/                     tokens.css (colours, type), base.css, components.css
js/app.js                hash router and page mounting
js/store.js              progress in localStorage, export/import
js/audio.js              speech synthesis (Italian voice, slow speed)
js/covers.js             generative covers
js/engine/               checker.js (answer judging), srs.js (review schedule), session.js (session building)
js/pages/                home, unit, lesson (also mixed and drill), scene, checkpoint, review, reference, settings
js/ui/                   practice card, grammar marks, small DOM helpers
content/index.js         unit list and metadata
content/units/           one data-only module per unit
tests/                   node --test suites
tools/validate-content.js
```

## Add a unit

1. Write `content/units/unit-NN-name.js` with a default export: `id`, `slug`, `title`, `teaser`, `canSay`, `lessons` (each with `rules`, `examples` and `exercises`) and a `scene`. Copy an existing unit such as `unit-05-irregular.js` as a template.
2. In `content/index.js`, replace `load: null` on that unit's entry with
   `load: () => import('./units/unit-NN-name.js').then((m) => m.default)`.
3. Run `npm run validate` and `npm test`. The validator walks every unit that has a `load` in `content/index.js`, so it needs no change. It checks unique ids, that every exercise has an answer, a `why` and a known rule, that `recognise` cards offer their answer, and at least 30 exercises per rule (a unit marked `draft: true` only gets warnings).

## Where your progress lives

Everything is stored in this browser's `localStorage` under the key `pianopiano:v1`. Clearing site data, using a private window or switching browser starts you from zero.

To back it up or move to another device: open **Settings** (link in the footer), choose **Export progress** to save a `piano-piano-progress-YYYY-MM-DD.json` file, then on the other device open the site, go to Settings and choose **Import progress**. **Reset progress** clears everything on the current device.

## Publish on GitHub Pages

The repository is `ndaan18/piano-piano`.

1. Open `~/Documents/GitHub/piano-piano` in GitHub Desktop and choose **Add existing repository**, then **Publish repository** (public).
2. On github.com open the repository, then **Settings, Pages, Deploy from branch**, and pick `main` and `/ (root)`. Merge your work into `main` first if you built it on another branch.
3. After a minute or two the site is live at <https://ndaan18.github.io/piano-piano/>.

Later updates: commit in GitHub Desktop and push; Pages rebuilds on its own.
