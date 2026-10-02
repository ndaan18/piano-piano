# piano piano: Phase 1 design (grammar foundation)

*Date: 2026-10-02 · Status: awaiting review*

## 1. Purpose

A personal website for learning Italian grammar properly, built for one learner (Daan) after 400 days of Duolingo left recognition without understanding.

- **Why Italian:** travel, plus talking with a partner and their family. The focus is spoken, everyday Italian.
- **Starting level:** recognises a lot of vocabulary, but can't explain gender/articles, the present tense, the passato prossimo or prepositions. **We start from zero grammar.**
- **What Duolingo got wrong, and what this site must do instead:**
  1. Explain *why* before practising.
  2. Mark every sentence as **informale (tu)** or **formale (Lei)**.
  3. Use natural, spoken Italian rather than textbook sentences, with a "how Italians actually say it" note per rule.
  4. Train listening to real-speed speech.
- **Success:** after Phase 1 the learner can explain and produce A1 to solid-A2 grammar, choose tu or Lei correctly, and follow simple natural speech.
- **Out of scope for Phase 1:** vocabulary building (Phase 2, its own spec), accounts, a server, cross-device sync, speech recognition, and AI checking.

## 2. Decisions

| Topic | Decision |
|---|---|
| Explanations / UI language | **English.** Easy Italian only as flavour where it's obvious from context ("Ciao, Daan.", *Giusto*, *Quasi*, *Bravo*). |
| Devices | Laptop (longer sessions) and phone (short bursts). Responsive; must work at 375px wide. |
| Hosting | Public GitHub repo `piano-piano`, served by GitHub Pages. |
| Tech | Plain HTML/CSS/JS (native ES modules). **No build step, no npm dependencies.** |
| Audio | Browser speech synthesis (`it-IT`), preferring Enhanced/Premium voices (Alice, Federica). Normal and slow (0.7×) speeds. |
| Answer checking | Rule-based: accepted answers + known mistakes with explanations + typo/accent tolerance + an "I was right" override. |
| Motivation | **Progress, not pressure.** No streaks, hearts or XP. A visible mastery path and a review queue built from mistakes. |
| Unlocking | The next unit unlocks when the previous unit's checkpoint is passed (≥ 80%). Earlier lessons can always be redone. |
| Progress storage | `localStorage` per device, plus **Export / Import progress** (a JSON file) for backup and moving between devices. |

## 3. Curriculum (19 units)

| # | Unit (UI name) | Content |
|---|---|---|
| 0 | Sounds | c/ch, g/gh, gli, gn, sc, double consonants, stress |
| 1 | Nouns | gender, plurals, common exceptions |
| 2 | Articles | il/lo/la/l'/i/gli/le · un/uno/una/un' |
| 3 | Essere & avere | both verbs, plus tu vs Lei introduced formally |
| 4 | Present tense | regular -are / -ere / -ire (incl. -isc-) |
| 5 | Irregular verbs | andare, fare, stare, venire, dire, uscire, dare, sapere |
| 6 | Questions | chi, cosa, dove, quando, perché, come, quanto; negation |
| 7 | Can, want, must | volere, potere, dovere + infinitive |
| 8 | Adjectives | agreement, position, possessives (*mia madre* vs *la mia famiglia*) |
| 9 | Prepositions | di/a/da/in/su + articulated forms |
| 10 | I like… | piacere; c'è / ci sono |
| 11 | Reflexive verbs | mi chiamo, mi alzo, ci vediamo |
| 12 | Past tense I | passato prossimo with avere |
| 13 | Past tense II | passato prossimo with essere + agreement |
| 14 | Pronouns | lo, la, li, le, gli, le, ne |
| 15 | Imperfect | imperfetto vs passato prossimo |
| 16 | Future | futuro semplice + present-for-future |
| 17 | Imperative | tu / Lei imperative (directions, "senta, scusi") |
| 18 | Polite conditional | vorrei, potrebbe, mi piacerebbe |

**First build:** the full engine and every page, plus **complete content for units 0–5**. Units 6–18 follow in later batches with no engine changes.

## 4. Unit structure (built for repetition)

A unit is a series of short sessions (15–20 min) spread over days, not a single lesson.

1. **Lessons**, one per rule (usually 3–5 per unit). Each lesson goes: rule screen(s) → 6–10 examples → **guided** practice (hints available) → **free** practice (no hints). About 20 cards each.
2. **Mixed practice:** all of the unit's rules shuffled together (~30 cards), so the learner must recognise which rule applies.
3. **Scene:** a short real-life dialogue (e.g. dinner with the partner's family, ordering at a bar) using the unit's grammar. Listen → read along → ~10 cards that fill in and respond as yourself.
4. **Checkpoint:** 15 mixed cards with no hints or rule peeking. ≥ 80% passes and unlocks the next unit. Below that, the result screen lists the rules to revisit.
5. **Spaced review:** every card ever answered joins the spaced-repetition system (§6).

**The difficulty ladder per rule.** Every rule is practised in this order: *recognise* → *fill the gap* → *transform* (tu↔Lei, singular↔plural, present↔past) → *build from English* → *listen & type*.

**Interleaving.** About 25% of every session comes from earlier rules and units (whenever earlier material exists), weighted towards weak items.

**Exercise banks.** 30–40 exercises per rule. Sessions draw a fresh selection, so a repeated lesson is never the same set.

**Drill mode.** Fast conjugation and article drills (3-minute bursts), available for any unit that's been reached.

**Mastery stages** for a unit, shown as the tile filling in on home:

| Stage | Reached when |
|---|---|
| Learned | all lessons completed |
| Practised | mixed practice + scene completed |
| Passed | checkpoint ≥ 80% |
| Long-term | ≥ 80% of the unit's cards have survived a ≥ 21-day review interval |

**Estimated volume:** ~2 hours per unit over ~5 sessions, plus ~10 minutes a day of review. Units 0–5 come to about **700–900 exercises plus 6 scenes**.

## 5. Exercise types

Every card carries a register tag (`tu` / `lei` / `neutral`) and shows it as a chip: pink for informal, ultramarine for formal.

| Type | Interaction |
|---|---|
| `recognise` | Choose the correct form from 2–4 options. Used only at the first rung of the ladder. |
| `type` | Fill the gap with no options (e.g. *Tu ___ stanca? (essere)*). |
| `transform` | Rewrite a sentence: tu→Lei, singular→plural, present→past. |
| `build` | Translate English → Italian, with a context line (e.g. "to your partner's grandmother"). |
| `listen` | Hear a sentence (auto-plays, Space to replay, normal/slow) and type it. |
| `register` | Given a sentence said to one person, say it to another (partner → their father). |

## 6. Answer checking and review

**Checker** (`engine/checker.js`), applied in this order:

1. **Normalise:** lowercase, trim, collapse whitespace, unify apostrophes; final punctuation is optional.
2. **Exact match** against `answers[]` → *Giusto*.
3. **Known mistake** match against `mistakes{answer: explanation}` → *Quasi*, with that explanation.
4. **Accent-only difference** → *Almost: mind the accent*. Counted as correct for scheduling, but the explanation says why accents matter (*è* "is" vs *e* "and").
5. **Edit distance 1** (target longer than 4 characters) → *Giusto, small typo*, with the difference marked.
6. **Otherwise** → *Quasi*. Shows the correct answer with the differing characters marked and the "why".
7. **"I was right"** (offered on any wrong answer): accepts the answer, stores it locally as an extra accepted answer for that exercise, and logs it to a **reports** list that can be exported to fix the content.

**Accent input:** an accent bar (à è é ì ò ù), plus a keyboard shortcut: vowel + backtick → grave accent, `e'` → é.

**In-session re-queue:** a wrong card comes back 3 cards later (once per session) and its progress segment turns orange.

**Spaced repetition** (`engine/srs.js`): Leitner-style intervals of **1 → 3 → 7 → 21 → 60 days**. Correct moves a card up one box; wrong moves it back to box 1 (due tomorrow). The review queue holds every due card across all reached units, sorted by most overdue and weakest first, at up to 30 cards per session.

## 7. Pages

All UI copy is English. The top nav is **Path · Review · Reference** (a bottom tab bar on phone).

1. **Home:** "Ciao, Daan." with honest stats (units mastered, sentences built, 7-day accuracy). A bento row: **Continue** card (the current unit's generative cover, full size, with a Resume button), black **Phrase of the day** card (a natural sentence, register chip, audio, a one-line tip), and lime **Review** card (number due). Below, **Your path**: a tile per unit with a mini generative cover, the English name and an Italian teaser. Mastered and current units are in colour; locked ones are greyscale.
2. **Unit intro:** big cover, "what you'll be able to say", the step list with mastery state, estimated time, Start/Resume.
3. **Rule:** one rule per screen. The rule sentence with B-style marks, the *why*, a table, a "Careful" trap box, and a "How Italians say it" note with audio.
4. **Examples:** 6–10 sentences with register chips and audio. Tap or hover a word for its meaning; the full translation is hidden until tapped.
5. **Practice:** a segmented progress bar plus one centred card. Enter checks, Enter continues, Space replays audio. On phone the Check button sits above the keyboard.
6. **Checkpoint:** a dark (ink) screen to signal a test. No hints. The result screen shows the score, which rules to revisit, and unlock state.
7. **Review:** the number due, then a practice-style session.
8. **Reference:** a searchable cheat sheet of every rule and table from units reached so far, plus verb tables.

**Leaving mid-session** saves the exact position. Resume returns there.

**Settings** (small, from the footer): audio voice picker and test, slow-speed default, export/import progress, export reports, reset progress.

## 8. Visual design

Reference mockups are in `docs/superpowers/mockups/` (home-v3, blur-system, lesson-v4, interaction-sketches-v2).

**Colour.** Built around neon lime. Lime is a fill, never text.

| Token | Hex | Role |
|---|---|---|
| `--lime` | `#D2FF3C` | hero: primary buttons, highlighter, progress, correct |
| `--ink` | `#121210` | text, dark cards, checkpoint background |
| `--base` | `#F4F4F1` | page background |
| `--card` | `#FFFFFF` | cards (1px `#E2E2DD` border) |
| `--fog` | `#E3E1DA` | cover base, empty states |
| `--pink` / `--pink-ink` | `#FF4FA8` / `#C70F6E` | **informale · tu** (fill / text) |
| `--ultra` | `#2E3BFF` | **formale · Lei** |
| `--lilac`, `--cyan` | `#C3A6FF`, `#42D9F0` | cover moods only |
| `--orange` / `--orange-ink` | `#FF6B1F` / `#B93A0A` | mistakes only |

**Type.** Inter Tight (UI and display, 900 weight, tight tracking for headlines). JetBrains Mono for short uppercase labels only (≥ 11px, never long text). No handwriting fonts.

**Generative covers** (`covers.js`), the main visual element:
- Each unit has a deterministic recipe seeded by the unit index. It sets the composition (orb, horizon, diagonal, column, eclipse, scatter, rise or halo; a stride of 3 means neighbours differ), the partner colour (rotating), how much of the field is lime, blur softness (≈18–70px) and grain amount.
- Checkpoint-milestone units (5, 10, 14, 18) render neon-on-ink.
- Blobs drift slowly; this is disabled under `prefers-reduced-motion`.
- A grain layer sits **only on covers**.

**Restraint rules:**
- One full-size cover per screen; mini covers on unit tiles only.
- No ambient background gradients and no feedback glows.
- No paper textures or ruled lines.

**Marks (style B):** smooth vector strokes (circle, underline) in pink or ultramarine, used only to annotate grammar: circle the article, underline the trigger. Highlights are solid lime blocks.

**Feedback:** a short coloured bar (lime = correct, cyan = accent, orange = mistake), a verdict word (*Giusto.* / *Almost* / *Quasi.*), then the explanation. A wrong answer gives one short shake (none under reduced motion).

**Accessibility:**
- Body text contrast ≥ 4.5:1.
- Functional text ≥ 11px.
- Visible focus ring (lime).
- Fully keyboard-operable.
- Tap targets ≥ 44px on phone.

## 9. Architecture

```
index.html                 app shell; hash router (#/home, #/unit/2, #/lesson/2/1, #/practice/…, #/review, #/reference, #/settings)
css/tokens.css             colours, type scale, spacing, radii
css/base.css  css/components.css
js/app.js                  router + page mounting
js/store.js                progress persistence (localStorage, versioned schema, export/import, in-memory fallback)
js/audio.js                speechSynthesis wrapper: voice selection, rate, missing-voice detection
js/covers.js               generative cover renderer
js/engine/checker.js       answer judging (§6)
js/engine/srs.js           intervals, due calculation, mastery stage computation
js/engine/session.js       session building: ladder order, interleaving, re-queue, checkpoint draw
js/pages/*.js              home, unit, rule, examples, practice, checkpoint, review, reference, settings
content/index.js           unit list + metadata
content/units/unit-NN-*.js one module per unit (data only)
tests/*.test.js            node --test (built-in runner, no deps)
tools/validate-content.js  content checker
```

**Content schema** (per unit module):

```js
export default {
  id: 2, slug: 'articles', title: 'Articles', teaser: "il · lo · la · l'",
  canSay: 'Hai visto lo zio?',
  lessons: [{ id: 'u2-l1', title: 'il, lo, l\'', rules: [/* {id, sentence, marks, why, table, careful, howItaliansSayIt, audio} */],
              examples: [/* {it, en, reg} */], exercises: [/* see below */] }],
  scene: { title, setting, lines: [/* {speaker, it, en, reg} */], exercises: [] },
};
// exercise
{ id: 'u2-l1-e07', type: 'type', reg: 'tu', rung: 2, ruleId: 'u2-r2',
  prompt: 'Hai visto ___ zio?', base: '', en: 'Did you see the uncle?',
  answers: ['lo'], mistakes: { il: '"zio" starts with z → lo, not il.' },
  why: 'z, s+consonant, gn, ps, x, y → lo.', options: null /* recognise only */ }
```

**Progress schema** (`localStorage['pianopiano:v1']`): `{ version, cards: { [exerciseId]: { box, due, seen, correct, lastWrong } }, units: { [id]: { lessonsDone[], mixedDone, sceneDone, checkpointBest } }, resume: { route, sessionState }, extraAnswers: { [exerciseId]: [] }, reports: [], settings: { voiceURI, slowDefault } }`. The version number allows future migrations.

**Error handling:**
- **No Italian voice:** a banner explains how to install one (macOS: System Settings → Accessibility → Spoken Content; iOS: Settings → Accessibility → Spoken Content → Voices → Italian). Listen cards then reveal the text after the attempt.
- **Storage unavailable or full:** fall back to in-memory, with a persistent "progress won't be saved" notice.
- **Corrupt import file:** reject it with a message and leave existing progress untouched.

## 10. Testing

- **Unit tests** (`node --test`): the checker (each verdict path, normalisation, accent shortcut), SRS (intervals, demotion, due ordering, mastery stages), and session builder (ladder order, ~25% interleaving, re-queue once, checkpoint size).
- **Content validator:**
  - unique IDs
  - every exercise has a valid `type`, `reg` and `rung`, a non-empty `answers`, and a `why`
  - `recognise` cards have options that include an answer
  - every `ruleId` exists
  - each rule has ≥ 30 exercises
- **Browser verification** before handover: every page at 1300px and 375px, keyboard-only practice run, reduced-motion check, export → import round trip.

## 11. Build order

1. Repo scaffold, tokens and components, generative covers.
2. Engine (checker, SRS, session) with tests.
3. All pages wired to a small sample unit.
4. Content for units 0–5, one unit at a time, each passing the validator.
5. Full browser verification, README with GitHub Desktop publish + Pages steps.

## 12. Publishing (done by the user)

Open `~/Documents/GitHub/piano-piano` in GitHub Desktop (**Add existing repository → Publish repository**, public). Then on github.com: **Settings → Pages → Deploy from branch → `main` / root**. The site goes live at `https://<username>.github.io/piano-piano/`.
