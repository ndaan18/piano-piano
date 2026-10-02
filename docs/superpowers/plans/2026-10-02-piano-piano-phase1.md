# piano piano Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the piano piano grammar site: a lesson engine, all 8 pages, the generative visual system, and complete content for units 0–5. Static, hosted on GitHub Pages.

**Architecture:** A single-page app with a hash router and native ES modules, with no build step. The engine (checker, srs, session) and the store are pure modules, unit-tested with `node --test`. Pages are small modules that render into `#app` and talk to the store and the engine. Content is one data module per unit, checked by a validator script.

**Tech Stack:** HTML, CSS, vanilla JS (ES2022 modules), Web Speech API, `localStorage`, Node 26 built-in test runner (dev only), and `python3 -m http.server` for local preview.

**Spec:** `docs/superpowers/specs/2026-10-02-piano-piano-phase1-design.md`. Read it first; section numbers below (§) refer to it. Visual references are in `docs/superpowers/mockups/`.

## Global Constraints

- No build step and no npm dependencies. `package.json` exists only for `"type": "module"` and scripts.
- All UI copy is in English. Italian appears only as content or as obvious flavour: "Ciao, Daan.", *Giusto.*, *Quasi.*, *Bravo.*
- Colour tokens are exactly those in §8. Lime is never used as text colour.
- Fonts: Inter Tight (400–900) and JetBrains Mono (400/600) from Google Fonts. No handwriting fonts.
- Functional text ≥ 11px. Body contrast ≥ 4.5:1. Tap targets ≥ 44px at ≤ 600px width. Visible lime focus ring.
- One full-size generative cover per screen. Mini covers only on unit tiles. No ambient background gradients, feedback glows or paper textures.
- Every animation is disabled under `prefers-reduced-motion: reduce`.
- Must work at 375px and 1300px widths.
- Storage key `pianopiano:v1`. SRS intervals `[1, 3, 7, 21, 60]` days. Checkpoint 15 cards, pass mark 0.8. Interleave share 0.25. Lesson session 20 cards. Mixed session 30. Review max 30. Re-queue offset 3, once per card per session.
- Register values: `tu`, `lei`, `neutral`. Exercise types: `recognise`, `type`, `transform`, `build`, `listen`, `register`. Rungs 1–5 = recognise → fill → transform → build → listen (§4).
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Phone keyboards change answers.** iOS autocapitalises ("Sei") and inserts curly apostrophes ("l’amico"). Both should be accepted. *Test in Task 2.*
2. **Elision spacing.** "l' amico" and "l'amico" are the same answer, and "un'amica" ≠ "una amica". The first pair should be accepted. *Test in Task 2.*
3. **Content edits after progress exists.** The store may hold card ids that no longer exist in content. Review and mastery must skip them, not crash. *Tests in Tasks 3 and 4.*
4. **Day boundaries and DST.** Due dates are local calendar dates. A card graded at 23:59 with interval 1 is due the next calendar day, not 24 hours later. *Test in Task 3.*
5. **Small pools.** A first lesson with no prior pool, a rule with fewer exercises than the session size, or a review with 0 due cards must produce a valid, possibly shorter session with no `undefined` entries. *Test in Task 4.*

---

## File Structure

```
index.html                     shell: fonts, css, <main id="app">, nav, footer
package.json                   {"type":"module","private":true,"scripts":{"test":"node --test tests/","validate":"node tools/validate-content.js"}}
.claude/launch.json            preview server: python3 -m http.server 4173
css/tokens.css                 §8 tokens, type scale, radii, spacing
css/base.css                   reset, body, focus ring, reduced-motion
css/components.css             buttons, chips, cards, bento, tiles, progress segments, feedback, marks, tables
js/app.js                      router, nav state, page mounting, resume
js/covers.js                   coverRecipe() (pure) + renderCover() (DOM)
js/audio.js                    speech synthesis wrapper
js/store.js                    progress persistence
js/engine/checker.js           answer judging
js/engine/srs.js               spaced repetition + mastery
js/engine/session.js           session building
js/ui/practice-card.js         runs a card session (used by lesson, mixed, scene, checkpoint, review, drill)
js/ui/marks.js                 B-style SVG marks (circle, underline) for rule sentences
js/pages/home.js unit.js lesson.js scene.js checkpoint.js review.js reference.js settings.js
content/index.js               UNITS metadata (all 19) + loaded unit modules + exercise index
content/units/unit-00-sounds.js … unit-05-irregular.js
tools/validate-content.js      content checker (exports validateUnit for tests)
tests/checker.test.js srs.test.js session.test.js store.test.js covers.test.js validate.test.js
README.md
```

---

### Task 1: Scaffold, design tokens, generative covers

**Files:**
- Create: `index.html`, `package.json`, `.claude/launch.json`, `css/tokens.css`, `css/base.css`, `css/components.css`, `js/covers.js`, `tests/covers.test.js`
- Modify: `.gitignore` (add `.impeccable/`, `.claude/settings.local.json`). Remove the committed `.impeccable/` from the index with `git rm -r --cached .impeccable`.

**Interfaces:**
- Produces: `coverRecipe(index: number) -> { comp: 'orb'|'horizon'|'diagonal'|'column'|'eclipse'|'scatter'|'rise'|'halo', partner: string /*token name*/, soft: number /*px*/, grain: number /*0..1*/, dark: boolean, blobs: Array<{ color: string /*hex*/, x: number, y: number, w: number, h: number /*% of box*/, blur: number }>, drift: Array<{dx:number, dy:number, ds:number, dur:number}> }`
- Produces: `renderCover(el: HTMLElement, index: number, { scale = 1 } = {}) -> void`. Clears `el`, sets its background, appends blob divs and a grain div.
- Produces: CSS classes used by all pages: `.btn` (ink on lime text), `.btn--lime`, `.chip`, `.chip--tu`, `.chip--lei`, `.card`, `.card--ink`, `.card--lime`, `.cover`, `.tile`, `.segs`, `.fb`, `.mono`, `.big-title`.

- [ ] **Step 1: Write the failing tests** in `tests/covers.test.js`:
  - `coverRecipe is deterministic`: `deepEqual(coverRecipe(7), coverRecipe(7))`.
  - `neighbouring units differ in composition`: for i in 0..17, `coverRecipe(i).comp !== coverRecipe(i+1).comp`.
  - `checkpoint units are dark`: `[5,10,14,18].every(i => coverRecipe(i).dark)` and `coverRecipe(4).dark === false`.
  - `every recipe contains lime`: each `blobs` has at least one `color === '#D2FF3C'`.
  - `softness within range`: `soft` between 18 and 70 for i in 0..18.
- [ ] **Step 2: Run** `node --test tests/covers.test.js`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement `js/covers.js`.** Port the recipe from `docs/superpowers/mockups/blur-system.html`: an rng seeded with `index + 7`, partners `['pink','ultra','cyan','lilac','orange','ultra','pink','cyan','lilac']`, `comp = comps[(index*3) % 8]`, checkpoints `{5,10,14,18}`. The halo's middle blob uses fog (or ink when dark). Drift animates via CSS custom props `--dx --dy --ds --dur` and the `@keyframes drift` in `components.css`, inside `@media (prefers-reduced-motion: no-preference)`. Grain is an inline SVG `feTurbulence` data-URI, as in the mockup.
- [ ] **Step 4: Write `css/tokens.css`, `base.css` and `components.css`** from §8 and the mockups `home-v3.html` / `lesson-v4.html`. Write `index.html` with nav (logo `italiano.` with a pink-ink dot, links Path · Review · Reference, a bottom tab bar under 600px), `<main id="app">`, and a footer link "Settings". Write `.claude/launch.json` with config `{"name":"site","runtimeExecutable":"python3","runtimeArgs":["-m","http.server","4173"],"port":4173}`.
- [ ] **Step 5: Run** `node --test tests/covers.test.js`. Expected: PASS (5 tests).
- [ ] **Step 6: Commit**: `git add -A && git commit -m "feat: scaffold, design tokens and generative covers"`.

---

### Task 2: Answer checker

**Files:**
- Create: `js/engine/checker.js`, `tests/checker.test.js`

**Interfaces:**
- Produces: `normalize(s: string) -> string`. Lowercases, trims, collapses whitespace, maps `’ ‘ \`` to `'`, removes spaces after an apostrophe (`l' amico` → `l'amico`), and strips trailing `?!.,` and inner commas.
- Produces: `applyAccentShortcut(value: string) -> string`. It runs on every input event and only looks at the end of the string. A trailing vowel+backtick (`` a` e` i` o` u` ``) becomes `à è ì ò ù`. A trailing `e'` becomes `é`.
- Produces: `judge(exercise, input: string, extraAnswers: string[] = []) -> { verdict: 'correct'|'typo'|'accent'|'mistake'|'wrong', message?: string, target: string, diff?: Array<{ ch: string, ok: boolean }> }`. `target = exercise.answers[0]`. Order of checks is exactly as in §6 steps 2–6. Typo means Levenshtein = 1 and the normalised target is longer than 4 characters.
- Produces: `isPass(verdict) -> boolean`. True for `correct`, `typo` and `accent`.
- Produces: `diffChars(input, target) -> Array<{ch, ok}>`. Per-character comparison on normalised strings, aligned by position.

- [ ] **Step 1: Write failing tests** (one `test()` each). Use the fixture exercise `{ answers:['sei'], mistakes:{ 'è':'è is for Lei…' } }` and `{ answers:["l'amico è italiano"] }`:
  - `'sei'` → correct. `'Sei'` → correct. `' sei. '` → correct.
  - `'è'` → mistake with message `'è is for Lei…'`.
  - `"l’amico è italiano"` → correct (curly apostrophe). `"l' amico è italiano"` → correct.
  - `"l'amico e italiano"` → accent.
  - `"l'amico è italino"` → typo, with `diff.some(d => !d.ok)`.
  - `'sono'` → wrong, `target === 'sei'`.
  - `judge(ex, 'sì', ['sì'])` → correct (extra answer).
  - `isPass` true for correct/typo/accent and false for mistake/wrong.
  - `applyAccentShortcut('perche`')` → `'perchè'`. `applyAccentShortcut('e`')` → `'è'`. `applyAccentShortcut("perche'")` → `'perché'`.
  - A 4-character target `'sono'` with input `'sona'` → wrong, not typo.
- [ ] **Step 2: Run** `node --test tests/checker.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement `js/engine/checker.js`** with the signatures above. Accent comparison uses `s.normalize('NFD').replace(/[̀-ͯ]/g,'')`.
- [ ] **Step 4: Run** `node --test tests/checker.test.js`. Expected: PASS.
- [ ] **Step 5: Commit**: `feat: rule-based answer checker`.

---

### Task 3: Spaced repetition and mastery

**Files:**
- Create: `js/engine/srs.js`, `tests/srs.test.js`

**Interfaces:**
- Produces: `INTERVALS = [1, 3, 7, 21, 60]`.
- Produces: `localDate(d: Date) -> 'YYYY-MM-DD'` (local calendar date) and `addDays(isoDate: string, n: number) -> 'YYYY-MM-DD'`. Uses calendar arithmetic on y/m/d via `new Date(y, m-1, d+n)`, never milliseconds.
- Produces: `grade(card: Card | undefined, pass: boolean, now: Date) -> Card`. `Card = { box: 0..5, due: string, seen: number, correct: number, lastWrong: string|null }`. A new card is `{box:0, seen:0, correct:0, lastWrong:null}`. On pass, `box = min(box+1, 5)` and `due = addDays(today, INTERVALS[box-1])`. On fail, `box = 1`, `due = addDays(today, 1)` and `lastWrong = today`. `seen` increments every time; `correct` only on pass.
- Produces: `isDue(card, today: string) -> boolean`, i.e. `card.due <= today`.
- Produces: `dueIds(cards: Record<string, Card>, today: string, knownIds: Set<string>, limit = 30) -> string[]`. Only ids in `knownIds`. Sorted by due ascending, then box ascending.
- Produces: `unitStage(unit: UnitContent, progress: UnitProgress | undefined, cards: Record<string,Card>) -> 'new'|'learned'|'practised'|'passed'|'longterm'`. Definitions are the table in §4. Long-term means ≥ 80% of the unit's exercise ids have `box === 5`.
- Produces: `isUnlocked(unitIndex: number, unitsProgress: Record<number, UnitProgress>) -> boolean`. Unit 0 is always unlocked; otherwise `unitsProgress[unitIndex-1]?.checkpointBest >= 0.8`.
- `UnitProgress = { lessonsDone: string[], mixedDone: boolean, sceneDone: boolean, checkpointBest: number /*0..1*/ }`.

- [ ] **Step 1: Write failing tests:**
  - New card passed on 2026-10-02 → `{box:1, due:'2026-10-03', seen:1, correct:1}`.
  - The pass chain goes box 1→2→3→4→5 with dues +3, +7, +21, +60. Box 5 passed stays at 5 with +60.
  - A fail from box 4 → `box 1`, due tomorrow, `lastWrong` set.
  - **DST/day boundary:** `grade(undefined, true, new Date(2026, 9, 24, 23, 59))` → due `'2026-10-25'`, and `addDays('2026-10-24', 1) === '2026-10-25'` (the EU DST change is 2026-10-25).
  - `dueIds` ignores an id missing from `knownIds` (**stale content id**), sorts by due then box, and respects `limit`.
  - `unitStage` returns each of the 5 stages for crafted progress. A stale card id in `cards` doesn't change the result.
  - `isUnlocked(0, {}) === true`, `isUnlocked(3, {2:{checkpointBest:0.8}}) === true`, and `isUnlocked(3, {2:{checkpointBest:0.79}}) === false`.
- [ ] **Step 2: Run** `node --test tests/srs.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement `js/engine/srs.js`.**
- [ ] **Step 4: Run** `node --test tests/srs.test.js`. Expected: PASS.
- [ ] **Step 5: Commit**: `feat: spaced repetition and mastery stages`.

---

### Task 4: Session builder

**Files:**
- Create: `js/engine/session.js`, `tests/session.test.js`

**Interfaces:**
- Consumes: the `Card` shape (Task 3) and the content schema (§9).
- Produces: `SessionCard = { exerciseId: string, hints: boolean, retry?: boolean }`.
- Produces: `buildLessonSession(lesson, priorPool: string[], { rng = Math.random, size = 20, weak = new Set() } = {}) -> SessionCard[]`. Draws `round(size*0.75)` from the lesson's exercises (fewer if the lesson has fewer), sorted by `rung` ascending. The first half gets `hints: true`, the rest `false`. It fills up to `size` from `priorPool` (ids in `weak` first, then random) when `priorPool` isn't empty. Prior cards are slotted into the second half. No duplicates.
- Produces: `buildMixedSession(unit, priorPool, opts) -> SessionCard[]`. Size 30. Draws evenly across all of the unit's lessons with `hints:false`, adds the 25% interleave, and shuffles.
- Produces: `buildCheckpoint(unit, { rng } = {}) -> SessionCard[]`. Exactly `CHECKPOINT_SIZE = 15`, or all eligible if fewer. Only `rung >= 2`. Round-robin across lessons. `hints:false`.
- Produces: `buildReviewSession(dueIds: string[], { limit = 30 } = {}) -> SessionCard[]` (`hints:false`).
- Produces: `buildDrill(unit, { rng, size = 15 } = {}) -> SessionCard[]`. Only `type` and `transform` exercises. `hints:false`.
- Produces: `requeue(queue: SessionCard[], pos: number) -> SessionCard[]`. Returns a new array with `{...queue[pos], retry:true}` inserted at `min(pos+3, length)`, unless `queue[pos].retry` is already true. In that case it returns the queue unchanged.
- Produces: constants `CHECKPOINT_SIZE = 15`, `PASS_MARK = 0.8`, `INTERLEAVE = 0.25`.

- [ ] **Step 1: Write failing tests** with a fixture of 2 lessons × 12 exercises (rungs 1–5), using a seeded rng helper in the test file:
  - Lesson session size 20 with a prior pool of 10: 15 from the lesson + 5 prior. Lesson cards are in non-decreasing rung order. The first 10 have `hints:true`. No duplicate ids.
  - **Small pools:** a lesson with 6 exercises and an empty prior pool → length 6, every `exerciseId` defined. `buildCheckpoint` on a unit with only 4 rung≥2 exercises → length 4. `buildReviewSession([])` → `[]`.
  - Checkpoint: length 15, all `rung >= 2`, both lessons represented.
  - `requeue` inserts at pos+3 with `retry:true`. A second `requeue` on that retry card is a no-op. At the end of the queue, it appends.
  - Weak ids from the prior pool come first.
- [ ] **Step 2: Run** `node --test tests/session.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement `js/engine/session.js`.** Exercises are looked up from the passed `lesson.exercises` / `unit.lessons[*].exercises`. Shuffle with Fisher–Yates using `rng`.
- [ ] **Step 4: Run** `node --test`. Expected: all suites PASS.
- [ ] **Step 5: Commit**: `feat: session builder with interleaving and re-queue`.

---

### Task 5: Progress store

**Files:**
- Create: `js/store.js`, `tests/store.test.js`

**Interfaces:**
- Produces: `createStore(storage = globalThis.localStorage) -> { get(): State, update(fn: (draft: State) => void): State, exportJSON(): string, importJSON(text: string): void, reset(): void, persistent: boolean, subscribe(fn): () => void }`.
- `State` is the progress schema in §9 with `version: 1`, plus `log: Array<{date: string, pass: boolean}>` (capped at 500; used for 7-day accuracy). `update` clones the state, runs `fn`, saves to key `pianopiano:v1`, and notifies subscribers.
- If `storage` is missing, or `setItem` throws on a probe write, the store keeps state in memory and sets `persistent = false`.
- `importJSON` parses the file, requires `version === 1` and objects for `cards` and `units`, and only then replaces the state. Otherwise it throws `Error('Invalid progress file')` and leaves the state untouched.
- Corrupt JSON in storage at load time → start from the default state and keep the corrupt string under `pianopiano:v1:corrupt`.

- [ ] **Step 1: Write failing tests** with an in-memory `storage` stub (`getItem/setItem/removeItem`) and a throwing stub:
  - Fresh store → the default state with `version 1`. `update` persists, and a new store reads it back.
  - Throwing storage → `persistent === false`, and `update` still works in memory.
  - Export → import round-trips deep-equal.
  - **Corrupt import:** `importJSON('{"version":2}')` and `importJSON('nope')` both throw, and the state is unchanged.
  - Corrupt stored JSON → default state, with the backup key written.
- [ ] **Step 2: Run** `node --test tests/store.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement `js/store.js`.**
- [ ] **Step 4: Run** `node --test`. Expected: PASS.
- [ ] **Step 5: Commit**: `feat: progress store with export/import and fallback`.

---

### Task 6: Content index, validator, sample content

**Files:**
- Create: `content/index.js`, `content/units/unit-02-articles.js` (sample: lesson `u2-l1` only, 30 exercises, enough to wire up the pages), `tools/validate-content.js`, `tests/validate.test.js`

**Interfaces:**
- Produces: `UNITS: Array<{ id: number, slug: string, title: string, teaser: string, load: (() => Promise<UnitContent>) | null }>` covering all 19 units from §3. The `title` and `teaser` values are the English names and Italian teasers from `docs/superpowers/mockups/home-v3.html`, extended to units 12–18 from §3. `load` is `null` for units not written yet.
- Produces: `loadUnit(id) -> Promise<UnitContent|null>` and `exerciseIndex(units: UnitContent[]) -> Map<string, { exercise, unitId, lessonId, ruleId }>`.
- Produces: `validateUnit(unit) -> string[]` (error messages; an empty array means valid). The CLI runs every loadable unit, prints `✓ unit NN: X exercises` or the errors, and exits with code 1 on any error.
- Validator rules are exactly the list in §10. It also checks that `reg` is in {tu, lei, neutral} and `type` is in the 6 types, and that `transform`/`build`/`register` exercises have a non-empty `base` or `en` context line.
- `UnitContent` matches the schema in §9 exactly. Rules have `{ id, title, sentence, marks: Array<{ word: string, kind: 'circle'|'underline', color: 'pink'|'ultra' }>, why, table?: { head: string[], rows: string[][], highlight?: number[] }, careful?, howItaliansSayIt?: { it, en, note } }`.
- The `≥ 30 exercises per rule` check is a **warning** for units still marked `draft: true`, and an error otherwise.

- [ ] **Step 1: Write failing tests:**
  - A valid minimal fixture → `[]`.
  - Each broken fixture returns a message containing the faulty id: a duplicate id, a missing `answers`, an unknown `ruleId`, a `recognise` exercise whose options don't include an answer, `reg: 'formal'`, and a rule with 12 exercises in a non-draft unit.
- [ ] **Step 2: Run** `node --test tests/validate.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement** the validator and `content/index.js`. Write the sample `unit-02-articles.js` (`draft: true`, rule `u2-r1` "il · lo · l'" with 30 natural exercises across all 6 types and rungs, mixed tu/lei/neutral).
- [ ] **Step 4: Run** `node --test && node tools/validate-content.js`. Expected: tests PASS. The validator prints unit 02 with a draft warning only, and exits 0.
- [ ] **Step 5: Commit**: `feat: content index, validator and sample unit`.

---

### Task 7: App shell, router, audio, home and unit intro

**Files:**
- Create: `js/app.js`, `js/audio.js`, `js/pages/home.js`, `js/pages/unit.js`
- Modify: `index.html`, `css/components.css`

**Interfaces:**
- Consumes: `createStore`, `UNITS`/`loadUnit`, `renderCover`, `unitStage`, `isUnlocked`, `dueIds`, `localDate`.
- Produces: a page contract. Each page module exports `async mount(root: HTMLElement, params: Record<string,string>, ctx: { store, navigate(hash: string): void, audio }) -> (() => void) | void` (returns an optional cleanup).
- Produces routes: `#/` home, `#/unit/:u`, `#/lesson/:u/:lessonId`, `#/mixed/:u`, `#/scene/:u`, `#/checkpoint/:u`, `#/review`, `#/drill/:u`, `#/reference`, `#/settings`. An unknown route goes to home. A locked unit route shows the unit page in its locked state ("Pass the Unit NN checkpoint to unlock").
- Produces: `audio.speak(text: string, { rate = 1 } = {}) -> void`, `audio.hasItalianVoice() -> Promise<boolean>`, `audio.voices() -> Promise<SpeechSynthesisVoice[]>`, `audio.setVoice(voiceURI: string) -> void`. Voice preference: the saved voiceURI, then a name matching `/enhanced|premium|alice|federica/i`, then any `it-*`. Slow rate is 0.7.
- Home follows the spec §7.1 layout and `docs/superpowers/mockups/home-v3.html`:
  - Stats: units at stage ≥ passed, total `correct` across cards, 7-day accuracy from `cards[*]` seen/correct within 7 days. Track this as `state.log`, an array of `{date, pass}` capped at 500 entries, appended by the practice card.
  - "Phrase of the day": deterministic pick by date from all `examples` of unlocked loaded units.
  - The review card count comes from `dueIds`.
  - The continue card points to `state.resume.route`, or to the first unlocked unit's next incomplete step.
- Unit intro follows spec §7.2 with the steps list: each lesson, Mixed practice, Scene, Checkpoint, Drill. Each step shows a done mark, and steps are locked in order: mixed after all lessons, scene after mixed, checkpoint after scene.
- Missing Italian voice: a banner on home with the macOS/iOS instructions from spec §9.

- [ ] **Step 1: Implement the router, audio, home and unit pages.**
- [ ] **Step 2: Verify in the browser.** Start the preview (`site` in `.claude/launch.json`) and open `http://localhost:4173/`. Check:
  - home renders "Ciao, Daan.", the bento row, and 19 tiles (unit 0 unlocked, the rest locked/greyscale)
  - the unit 0 tile → unit page with a cover
  - `#/unit/4` → locked message
  - no console errors at 1300px and 375px (no horizontal scroll at 375px)
- [ ] **Step 3: Commit**: `feat: app shell, router, audio, home and unit pages`.

---

### Task 8: Practice card and lesson flow

**Files:**
- Create: `js/ui/practice-card.js`, `js/ui/marks.js`, `js/pages/lesson.js`
- Modify: `css/components.css`

**Interfaces:**
- Consumes: `judge`, `isPass`, `applyAccentShortcut`, `diffChars`, `grade`, `requeue`, `buildLessonSession`, `localDate`, store, audio.
- Produces: `runSession(root, cards: SessionCard[], { mode: 'practice'|'checkpoint'|'review'|'drill', lookup: (id) => exercise, store, audio, onDone(results: Array<{exerciseId, verdict, pass}>) }) -> () => void`. Behaviour is ported from `docs/superpowers/mockups/interaction-sketches-v2.html` and spec §6:
  - segmented progress (orange for misses)
  - Enter checks, then Enter continues; a second Enter within 250ms of checking is ignored
  - Space replays audio unless focus is in the input
  - accent bar and accent shortcut
  - `recognise` renders option buttons (keys 1–4)
  - feedback bar colours: lime for correct/typo, cyan for accent, orange for mistake/wrong
  - "I was right" appends to `state.extraAnswers[id]` and `state.reports`
  - `requeue` on a fail, except in `checkpoint` mode
  - `grade` into `state.cards` in every mode except `drill`
  - append to `state.log`
  - in `checkpoint` mode: no hints, no "why" until the end, no re-queue
  - a hint (when `card.hints`) is a "Show hint" button revealing `exercise.why`
  - a wrong-answer shake only without reduced motion
  - the input uses `autocapitalize="off" autocorrect="off" spellcheck="false"`
  - `listen` cards auto-play once and always reveal the Italian text in the feedback. If `audio.hasItalianVoice()` is false, the card shows a "No Italian voice installed, see Settings" note and a "Show sentence" button instead of failing silently
- Produces: `renderRuleSentence(el, rule) -> void` (from `marks.js`), drawing B-style circle/underline SVGs around `rule.marks` words.
- The lesson page follows the steps rule screens → examples → practice → done:
  - It saves `state.resume = { route, step }` on every step change and resumes there.
  - On completion it adds the lesson id to `units[u].lessonsDone`.
  - Examples show register chips and a play button per sentence. A tap on a word shows the `en` of the whole sentence; per-word glosses are out of scope. Translation is hidden until tapped.

- [ ] **Step 1: Implement** `practice-card.js`, `marks.js` and `lesson.js`.
- [ ] **Step 2: Verify in the browser** on `#/lesson/2/u2-l1`, keyboard only:
  - rule → examples → 20 practice cards
  - a deliberate wrong answer reappears 3 cards later with "second try"
  - typo, accent, mistake and "I was right" paths all show the right verdicts
  - after completion, the unit page shows lesson 1 done
  - reload mid-practice → Resume returns to the practice step
  - at 375px the Check button stays visible above the on-screen keyboard area
- [ ] **Step 3: Commit**: `feat: practice card and lesson flow`.

---

### Task 9: Mixed practice, scene, checkpoint, review, drill

**Files:**
- Create: `js/pages/scene.js`, `js/pages/checkpoint.js`, `js/pages/review.js`
- Modify: `js/pages/lesson.js` (mixed and drill routes reuse it via a `mode` param), `js/app.js`

**Interfaces:**
- Consumes: `buildMixedSession`, `buildCheckpoint`, `buildReviewSession`, `buildDrill`, `dueIds`, `exerciseIndex`, `runSession`, `PASS_MARK`.
- Mixed: sets `units[u].mixedDone = true` on finish.
- Scene: plays lines (with a "play all" button, each line has a speaker label, register chip and audio) → read-along with translations toggle → `scene.exercises` via `runSession` → `sceneDone = true`.
- Checkpoint: ink page background (`.page--ink`). Score = passes / cards. Store `checkpointBest = max(old, score)`. The result screen shows the score, a pass/fail line, rules to revisit (the `ruleId`s of misses, shown with their titles, linking to the lesson), and "Unit NN+1 unlocked" when passing.
- Review: `dueIds(state.cards, today, knownIds)` with knownIds from the `exerciseIndex` of all loaded units. Empty → a "Nothing due. Come back tomorrow." state with the next due date.
- Drill: mode `drill`, no SRS grading.

- [ ] **Step 1: Implement** these pages.
- [ ] **Step 2: Verify in the browser:**
  - Complete unit 2's sample flow up to the checkpoint by temporarily setting progress with `store.update` in the console.
  - A checkpoint with ≥ 80% unlocks the next tile on home. Below 80%, it lists rules to revisit.
  - Review shows due cards after setting a card's `due` to the past. With none due, the empty state shows.
  - Drill doesn't change `state.cards`.
- [ ] **Step 3: Commit**: `feat: mixed, scene, checkpoint, review and drill`.

---

### Task 10: Reference and settings

**Files:**
- Create: `js/pages/reference.js`, `js/pages/settings.js`

**Interfaces:**
- Reference:
  - Left list of units (only unlocked ones that are loaded). The right side shows each rule's sentence, why, table and careful box.
  - Verb tables are built from any rule table whose `head[0] === 'verb'`.
  - Search filters rules by matching the title, sentence, why or table cells (case- and accent-insensitive via `normalize` + accent strip).
- Settings:
  - voice picker listing `audio.voices()` with a "Test voice" button ("Ciao! Come stai?")
  - slow-by-default toggle
  - **Export progress** (downloads `piano-piano-progress-YYYY-MM-DD.json` via a Blob)
  - **Import progress** (file input → `importJSON`, showing "Invalid progress file" on error)
  - **Export reports** (JSON of `state.reports`)
  - **Reset progress** (confirm dialog)
  - a persistent notice when `store.persistent === false`: "Your browser is blocking storage, so progress won't be saved."

- [ ] **Step 1: Implement** both pages.
- [ ] **Step 2: Verify in the browser:**
  - search "lo" finds the article rule
  - export → reset → import restores progress
  - importing a `.json` containing `{}` shows the error and leaves progress intact
  - the voice test speaks Italian
- [ ] **Step 3: Commit**: `feat: reference and settings pages`.

---

### Content tasks (11–16)

Each content task writes one unit module. Writing rules:
- Spoken, natural Italian for a travel and partner-family context.
- Every exercise tagged with `reg`.
- ≥ 30 exercises per rule, covering rungs 1–5 and at least 4 of the 6 types.
- Every `mistakes` entry is a realistic learner error with a one-sentence explanation.
- Every rule has `why`, `careful` and `howItaliansSayIt`.
- 6–10 examples per lesson.
- A scene of 8–14 lines plus 10 exercises.
- Units 0–2 use mostly `neutral`/`tu`. From unit 3, aim for about 40% `lei` where register applies.
- Remove `draft: true` when the unit is done.

Each task follows the same steps:

- [ ] **Step 1:** Write `content/units/unit-NN-<slug>.js` and set `load` in `content/index.js`.
- [ ] **Step 2:** Run `node tools/validate-content.js`. Expected: `✓ unit NN: ≥ (30 × rules) exercises`, exit 0.
- [ ] **Step 3:** In the browser, play through lesson 1 and the scene of the unit, and check that the audio pronounces the examples.
- [ ] **Step 4:** Commit with `content: unit NN <title>`.

| Task | File | Lessons (one rule each) | Scene |
|---|---|---|---|
| 11 | `unit-00-sounds.js` | c/ch & g/gh · gli, gn, sc · double consonants · stress & written accents | Spelling your name and hotel at check-in |
| 12 | `unit-01-nouns.js` | gender from endings (-o/-a/-e) · regular plurals · exceptions (città, caffè, film, la mano, il problema, -ista) | At the market with your partner |
| 13 | `unit-02-articles.js` (replace the sample) | il/lo/la/l' · i/gli/le · un/uno/una/un' · articles in use (il lunedì, il signor Rossi, la Signora) | Meeting the family's friends at a party |
| 14 | `unit-03-essere-avere.js` | essere · avere · tu vs Lei · avere idioms (fame, sete, freddo, anni, ragione) | First dinner with the partner's parents |
| 15 | `unit-04-present.js` | -are · -ere · -ire incl. -isc- · spelling verbs (cercare, pagare, mangiare) & subject drop | A Sunday morning at home |
| 16 | `unit-05-irregular.js` | andare & venire · fare & stare · dire, uscire, dare, sapere | Making plans for the evening |

---

### Task 17: Full verification and README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Run** `node --test && node tools/validate-content.js`. Expected: all PASS, units 00–05 ✓, no draft warnings.
- [ ] **Step 2: Verify in the browser at 1300px and 375px** (every page):
  - home, unit, lesson, mixed, scene, checkpoint (pass and fail), review (due and empty), drill, reference, settings
  - a keyboard-only run of one full lesson
  - emulate reduced motion and confirm covers don't drift and there's no shake
  - export → import round trip
  - no console errors
  - no horizontal scroll at 375px
- [ ] **Step 3: Write `README.md`.** What it is, how to run it locally (`python3 -m http.server 4173`), how to run the tests, how to add a unit, and the GitHub Pages steps from spec §12 (repo `ndaan18/piano-piano` → URL `https://ndaan18.github.io/piano-piano/`).
- [ ] **Step 4: Commit**: `docs: README and final verification`.
