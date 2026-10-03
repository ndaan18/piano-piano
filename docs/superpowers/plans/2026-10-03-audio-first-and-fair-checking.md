# Audio-first sounds and fair checking: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to carry out this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every card can be answered from what has been taught plus what is on screen, every natural correct answer is accepted, and Unit 0 trains the ear.

**Architecture:**
- **Checker** (`js/engine/checker.js`): gains answer patterns, object answers with notes, wider normalisation, meaning-changing accents, silent h and a word-gap rule. It stays pure.
- **Practice card** (`js/ui/practice-card.js`): any card with `say` becomes an audio card, with skip, skip-all and no-voice handling, built from pure session helpers.
- **Content:** the six unit files are corrected against the spec's audit appendix.
- **Validator** (`tools/validate-content.js`): enforces the new authoring rules.

**Tech stack:**
- Plain ES modules with no build step and no dependencies.
- Tests use Node's built-in runner: `npm test` runs `node --test "tests/**/*.test.js"`.
- `npm run validate` checks the content.
- Preview with `python3 -m http.server 4173`.

**Spec:** `docs/superpowers/specs/2026-10-03-audio-first-and-fair-checking-design.md`. Read §1–§10 before every task. Content tasks also read §11. The Phase 1 spec, `docs/superpowers/specs/2026-10-02-piano-piano-phase1-design.md`, still governs everything this spec doesn't change.

## Global constraints

- **No dependencies, no build, no TypeScript.** Code matches the surrounding style: small pure functions, JSDoc one-liners and `esc()` for every interpolated string.
- **The UI copy is English.** Italian appears only as content, marked `lang="it"`.
- **Answer-pattern syntax** is `[x]` for optional and `{a|b}` for alternatives. Patterns nest and alternatives may be empty. One pattern may expand to at most **64** strings. `answers[0]` is always plain text, and `mistakes` keys are plain text.
- **An answer entry** is either a string or `{ text: string, note: string }`. A correct match on an object answer shows its `note`.
- **Meaning-changing accent pairs:** `e/è`, `si/sì`, `te/tè`, `la/là`, `li/lì`, `da/dà`, `ne/né`, `se/sé`.
- **Silent-h words:** `ho/o`, `hai/ai`, `ha/a`, `hanno/anno`.
- **Digits:** a whole token of 0–100 becomes its word, on the input side only. `1` is never converted. Tokens containing `:` or `.` are skipped. Conversion runs before punctuation stripping. An exercise opts out with `digits: false`.
- **Punctuation:** `? ! . ; : ,` anywhere become spaces.
- **Unit 0 gap shape** (lessons u0-l1…u0-l3, `type` cards): `^[bcdfghlmnpqrstvz]+i?[aeiouàèéìòù]$`. The prompt with `answers[0]` filled into `___` must equal `say` after `normalize`.
- **Register-card `base`** must not match `/\b(in)?formal\b|\(tu\)|\(Lei\)/i`. It must name who you are talking to.
- `MIN_PER_RULE = 30` stays.
- **Commits:** one per task (or per step where marked). The message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Work on branch `audio-and-fair-checking`.

## Review focus

1. **A learner types the whole word into a letter gap** (`cena` where the gap expects `ce`). Expect it to count as correct, with the note "Right word! Next time type just the missing letters: ce." Task 2 owns this.
2. **"Hear it" or a replay on a gap card speaks the full sentence**, never the bare fragment "ce". Task 4 owns this, via `spokenText`.
3. **A session where every card is skipped or dropped** ends with "Nothing practised" and marks nothing done: no `lessonsDone`, `mixedDone` or `sceneDone`, and no checkpoint score. Task 4 owns this.
4. **A saved session snapshot taken after a skip** still restores: the skipped card moved to the end, and results stay aligned with the queue. Task 4 owns this.
5. **A pattern whose optional part sits next to punctuation** (`Ha fame[, signora]?`) expands without doubled spaces or a dangling comma, and a typo inside a pattern-expanded answer is still forgiven like any other. Task 1 owns this.

---

### Task 1: Answer patterns, object answers and normalisation

**Files:**
- Modify: `js/engine/checker.js`
- Modify: `js/ui/practice-card.js`. Only the places that read `ex.answers` (around lines 176 and 446) switch to `answerTexts(ex)`.
- Test: `tests/checker.test.js`

**Interfaces:**
- Produces:
  - `expandAnswer(pattern: string): string[]`. Throws `Error('unbalanced pattern')` on unbalanced brackets. Duplicate expansions are collapsed.
  - `acceptedAnswers(exercise): Array<{ text: string, note?: string }>`. Every answer entry is expanded; an object entry passes its `note` to each of its expansions. Memoised in a `WeakMap` keyed by the exercise object.
  - `answerTexts(exercise): string[]`. The plain texts from `acceptedAnswers`.
  - `digitsToWords(s: string): string`.
  - `normalize(s, { digits = true } = {})`.
  - `judge(exercise, input, extraAnswers)`: on a correct match, the result also carries `note` when the matched answer had one. `target` is `answers[0]` as text (the `.text` of an object).

- [ ] **Step 1: Write the failing tests** in `tests/checker.test.js`:
  - `expandAnswer('[Tu] sei stanca?')` deep-equals `['Tu sei stanca?', 'sei stanca?']`.
  - `expandAnswer('{Signora, ha fame?|Ha fame[, signora]?}')` gives `['Signora, ha fame?', 'Ha fame, signora?', 'Ha fame?']`. Order doesn't matter, so use a sorted compare.
  - `expandAnswer('Ciao{| Marco}!')` gives `['Ciao!', 'Ciao Marco!']`.
  - Nested: `expandAnswer('{Scusi|Mi scusi}[, signora], dov\'è{| il bagno}?')` gives 8 strings, none containing `'  '` or `' ,'` or `',?'`.
  - `assert.throws(() => expandAnswer('[Tu sei'))`.
  - `digitsToWords('2 birre')` is `'due birre'`. Also `'21'` → `'ventuno'`, `'23'` → `'ventitré'`, `'28'` → `'ventotto'`, `'32'` → `'trentadue'`, `'100'` → `'cento'`, `'0'` → `'zero'`. `'1 birra'` stays as is, and `'alle 8:30'` stays as is.
  - `normalize('Rispondi tu? Ho le mani bagnate.')` equals `normalize('Rispondi tu. Ho le mani bagnate')`.
  - `judge({answers:['due birre']}, '2 birre').verdict === 'correct'`.
  - `judge({answers:['due birre'], digits:false}, '2 birre').verdict === 'wrong'`.
  - `judge({answers:['Mangio.', {text:'Sto mangiando.', note:'Right! Mangio is the everyday choice.'}]}, 'sto mangiando')` gives `{verdict:'correct', note:'Right! Mangio is the everyday choice.'}`.
  - `judge({answers:['Ha fame?','{Signora, ha fame?|Ha fame, signora?}']}, 'ha fame signora').verdict === 'correct'`.
  - A typo inside an expanded answer: `judge({answers:['[Tu] sei stanchissima?']}, 'sei stanchisima?').verdict === 'typo'`.
  - `target` with an object first answer: `judge({answers:[{text:'Vado.',note:'x'}]}, 'zzz').target === 'Vado.'`.

- [ ] **Step 2: Run `npm test`.** Expected: the new tests FAIL (not exported or wrong verdicts). The existing tests pass.

- [ ] **Step 3: Implement** the interfaces above.
  - `expandAnswer`: a recursive-descent parser over the string. A sequence is a concatenation of literals, `[...]` (the sequence or `''`) and `{...|...}` (one of the sequences). Take the cross product, then tidy each result: collapse runs of spaces, remove a space before `, . ? !`, remove a comma directly before `. ? !` or at the end, and trim.
  - `digitsToWords` uses the standard Italian rules:
    - Tens drop their final vowel before `uno` and `otto` (ventuno, ventotto).
    - A final `tre` becomes `tré` in compounds (ventitré).
    - 100 is `cento`.
  - `normalize` applies `digitsToWords` first (unless `digits` is false), then lowercases, unifies apostrophes, turns `?!.;:,` into spaces, collapses and trims. It keeps today's `'\s+ → '` apostrophe join.
  - `judge` uses `acceptedAnswers(ex)` plus `extraAnswers`, and `normalize(x, { digits: ex.digits !== false })` for both input and answers.

- [ ] **Step 4: Run `npm test`.** Expected: everything passes, including the older checker and practice tests.

- [ ] **Step 5: Commit** with the message `feat(checker): answer patterns, notes, digits and inner punctuation`.

### Task 2: Meaning-changing accents, silent h, word boundaries, whole word in a gap

**Files:**
- Modify: `js/engine/checker.js`
- Test: `tests/checker.test.js`

**Interfaces:**
- Consumes: from Task 1, `acceptedAnswers`, `normalize`.
- Produces:
  - `ACCENT_PAIRS`: an object keyed by the accented word (`è`, `sì`, `tè`, `là`, `lì`, `dà`, `né`, `sé`), with `{ plain, message }`.
  - `SILENT_H`: `{ ho: 'o', hai: 'ai', ha: 'a', hanno: 'anno' }`, plus `SILENT_H_GLOSS`.
  - Judge order: exact → mistakes → meaning accent (`mistake`) → silent h (`mistake`) → other accent (`accent`) → whole word in gap (`correct` + note) → typo → wrong.

Exact copy for the meaning-accent messages. The template is `${message} Here you need ${needed}.`, where `needed` is the target's word.
- è: `e means "and", è means "is".`
- sì: `si means "oneself", sì means "yes".`
- tè: `te means "you" (after a preposition), tè means "tea".`
- là: `la means "the" or "her", là means "there".`
- lì: `li means "them", lì means "there".`
- dà: `da means "from" or "at", dà means "gives".`
- né: `ne means "of it" or "some", né means "nor".`
- sé: `se means "if", sé means "oneself".`

Silent-h template: `Right sound! The h in ${w} is silent, but it's always written: ${gloss}.` The glosses are:
- ho: `ho = I have, o = or`
- hai: `hai = you have, ai = to the`
- ha: `ha = has, a = to or at`
- hanno: `hanno = they have, anno = year`

Whole-word-in-gap note: `Right word! Next time type just the missing letters: ${answer}.`

- [ ] **Step 1: Write the failing tests:**
  - `judge({answers:['La cena è pronta.']}, 'La cena e pronta')` gives `verdict === 'mistake'`, and its message contains `e means "and"` and `Here you need è`.
  - The reverse direction: `judge({answers:['Pane e vino.']}, 'Pane è vino')` gives `mistake`, with a message containing `Here you need e`.
  - One test per remaining pair: `sì`, `tè`, `là`, `lì`, `dà`, `né`, `sé`.
  - `judge({answers:['Perché no?']}, 'perche no').verdict === 'accent'`.
  - `judge({answers:['Ho sete.']}, 'O sete')` gives `mistake`, with a message containing `The h in ho is silent`. Do the same for `hai`, `ha` and `hanno` (`Anno fame` for `Hanno fame`).
  - An explicit `mistakes` key still wins: `judge({answers:['Ho sete.'], mistakes:{'O sete':'custom'}}, 'O sete').message === 'custom'`.
  - The regression: `judge({answers:['Buongiorno, signora!']}, 'Buongiorno, signore!').verdict === 'wrong'`.
  - Typo tolerance is kept: `judge({answers:['Buongiorno, signora!']}, 'Buongiorno, signroa!').verdict` is not `'typo'` (the edit is at the last two letters). `judge({answers:['Arrivederci!']}, 'Arrivedreci!')` stays as it is today. Pin today's value first by running it.
  - Whole word in a gap: `judge({prompt:'La ___na è pronta.', answers:['ce']}, 'cena')` gives `{ verdict:'correct', note: 'Right word! Next time type just the missing letters: ce.' }`. `judge({prompt:'La ___na è pronta.', answers:['ce']}, 'cina').verdict === 'wrong'`.

- [ ] **Step 2: Run `npm test`.** Expected: the new tests FAIL.

- [ ] **Step 3: Implement.**
  - **Meaning accents:** after the mistakes step, find an accepted answer whose `stripAccents` equals `stripAccents(n)`. Split both into words; if any differing word pair is in `ACCENT_PAIRS` (either direction), return a `mistake` with the pair's message.
  - **Silent h:** for each accepted answer and each word in it that is a key of `SILENT_H`, swap that one word for its h-less form. If that equals `n`, return a `mistake`.
  - **Whole word in a gap:** when `prompt` contains `___`, find the run of letters around the gap. For each accepted answer, fill the gap; if `n` equals that filled word (normalised), return `correct` with the note.
  - **Word boundaries:** `wordAt` now uses "not a letter", meaning `/[\p{L}]/u` fails, as the boundary instead of `isGlue`. The rest of the typo logic is unchanged.

- [ ] **Step 4: Run `npm test`.** Expected: everything passes.

- [ ] **Step 5: Commit** with the message `feat(checker): meaning-changing accents, silent h, word boundaries, whole word in gap`.

### Task 3: Validator rules

**Files:**
- Modify: `tools/validate-content.js`
- Test: `tests/validate.test.js`

**Interfaces:**
- Consumes: from Task 1, `expandAnswer`, `normalize`.
- Produces: the new `validateUnit` errors below. The register-base rule is NOT added here; it comes in Task 5.

- [ ] **Step 1: Write the failing tests.** Use small inline units, in the style of the existing tests in `tests/validate.test.js`. Each case below must produce an error whose text contains the given phrase:
  - an `answers[0]` containing `[`: `answers[0] must be plain`;
  - an unbalanced pattern: `unbalanced`;
  - a pattern expanding to more than 64 strings (e.g. seven `[a]`): `expands to`;
  - an object answer with empty `text`: `empty answer`;
  - a `mistakes` key containing `{`: `mistake keys must be plain`;
  - in a unit with `audioFirst: true`, a `recognise` or `type` card without `say`: `needs say`;
  - an audioFirst `recognise` card whose `say` doesn't contain `answers[0]` as a whole word or phrase: `say must contain`;
  - in a unit with `id: 0`, for a lesson `u0-l1`, `u0-l2` or `u0-l3`:
    - a `type` answer `c`: `gap shape`;
    - a prompt whose filled-in version (with `ce`) is not equal to `say`: `gap must match say`.
  - A valid audioFirst unit passes with no errors.

- [ ] **Step 2: Run `npm test`.** Expected: the new tests FAIL.

- [ ] **Step 3: Implement** the rules in `checkExercise`. Pass `unit` and `lesson` into it as needed. Wrap expansion in try/catch so it reports `unbalanced pattern`.

- [ ] **Step 4: Run `npm test` and `npm run validate`.** Expected: all tests pass, and all 6 units validate. No existing content uses the new syntax or `audioFirst` yet.

- [ ] **Step 5: Commit** with the message `feat(validate): patterns, notes, audio-first and gap rules`.

### Task 4: Audio cards, skip, no voice, "Hear it", notes

**Files:**
- Modify: `js/ui/practice-card.js`, `css/components.css`
- Modify: `js/pages/lesson.js`, `js/pages/scene.js`, `js/pages/review.js`, `js/pages/checkpoint.js` (empty-results handling)
- Modify: `js/pages/unit.js` (the no-voice notice when the unit is `audioFirst`)
- Test: `tests/practice.test.js`

**Interfaces:**
- Consumes: from Task 1, `judge(...).note` and `answerTexts`.
- Produces, all in `practice-card.js`, all pure and exported:
  - `isAudioCard(ex): boolean`: `ex.type === 'listen' || !!ex.say`.
  - `spokenText(ex): string`: `ex.prompt` for `listen`; otherwise `ex.say` if set; otherwise the prompt with `answers[0]` text filled into the gap; otherwise `answers[0]` text.
  - `skipCard(session): Session`: moves `queue[pos]` to the end of the queue and leaves `results` and `pos` unchanged. On the last card with nothing after it, it returns the session unchanged.
  - `dropCards(session, predicate): Session`: removes every card at index ≥ `pos` whose exercise matches. `predicate` receives the exerciseId.
  - `practisedCount(results): number`: the number of non-retry results.
  - `SKIP_ALL_AFTER = 3`.
- In `runSession`:
  - Audio cards render the audio block (today's listen block) above the prompt. `speak()` uses `spokenText(ex)`. Space replays and 1–4 pick on any audio card.
  - A ghost button reads `Can't listen now`. It is not shown in `checkpoint` mode.
  - After `SKIP_ALL_AFTER` consecutive skips, the card shows the button `Skip all audio cards this session`, which runs `dropCards` with `isAudioCard`.
  - When `hasItalianVoice()` is false, drop all audio cards at the start of the session, then render. Remove the old "Show sentence" fallback.
  - Feedback gets a small `Hear it` button (PLAY_ICON + text) that speaks `spokenText(ex)` with the target answer. Hide it when there's no voice. It never auto-plays.
  - `res.note`, when present, renders as `<p class="fb__body">` under the verdict.
- In the pages, when `practisedCount(results) === 0`:
  - Lesson, mixed and scene show the done block with the chip `Nothing practised` and the text `These cards need sound. Find a quiet moment, or install an Italian voice in Settings.`, and set no progress flags.
  - Checkpoint shows the same block and records no score.
  - Review shows the same block.
- Checkpoint without a voice: if fewer than 10 cards remain after dropping audio cards, show `This checkpoint needs an Italian voice.` with a link to `#/settings` instead of starting.
- Unit page: if `unit.audioFirst` and there is no voice, put `<div class="notice">${NO_VOICE_HTML}</div>` above the steps.

- [ ] **Step 1: Write the failing tests:**
  - `isAudioCard({type:'listen'})` is true, `isAudioCard({type:'type', say:'x'})` is true, and `isAudioCard({type:'type'})` is false.
  - `spokenText({type:'type', prompt:'La ___na è pronta.', answers:['ce']})` is `'La cena è pronta.'`.
  - `spokenText({type:'type', say:'Ciao!'})` is `'Ciao!'`.
  - `spokenText({type:'build', prompt:'Hi', answers:[{text:'Ciao!',note:'n'}]})` is `'Ciao!'`.
  - `skipCard` on queue `[a,b,c]` at pos 0 gives queue `[b,c,a]` and the same pos, with `results` still `[]`. `restoreSession` accepts that snapshot when a lookup knows a, b and c.
  - `skipCard` at pos 1 after answering a gives `[a,c,b]` with results `[a's]`. `restoreSession` accepts it.
  - `dropCards` on `[a(listen),b,c(say)]` at pos 0 gives `[b]`.
  - `practisedCount([])` is 0, and `practisedCount([{retry:true}])` is 0.

- [ ] **Step 2: Run `npm test`.** Expected: the new tests FAIL.

- [ ] **Step 3: Implement the pure helpers** and run the tests until they PASS.

- [ ] **Step 4: Implement the DOM changes** in `runSession` and the pages listed above. Style the skip button and the "Hear it" button with the existing `.btn--ghost` and `.play` styles. Add new CSS only for layout, using tokens from `css/tokens.css`.

- [ ] **Step 5: Browser check.** Run `python3 -m http.server 4173`.
  - Temporarily give one Unit 1 `type` card a `say` and confirm all of these:
    - auto-play, Slow, and Space replaying;
    - `Can't listen now` moves the card to the end;
    - three skips offer skip-all;
    - "Hear it" plays the full sentence;
    - the layout works at 375 px.
  - Stub `audio.hasItalianVoice` to resolve false via devtools and confirm the audio card is dropped.
  - Revert the temporary `say`.

- [ ] **Step 6: Run `npm test` and `npm run validate`, then commit** with the message `feat(practice): audio on any card, skip, no-voice drop, Hear it`.

### Task 5: Register chip after answering, and register-card bases

**Files:**
- Modify: `js/ui/practice-card.js`, `tools/validate-content.js`
- Modify: `content/units/unit-00…05` (the `base` of every `register` card)
- Test: `tests/practice.test.js`, `tests/validate.test.js`

**Interfaces:**
- Produces: `showRegChipBefore(ex, hints): boolean`, which is `ex.type !== 'register' || hints`. When it returns false, `cardHTML` omits `regChip` from `.pc__kind`, and the feedback adds the chip next to the verdict.

- [ ] **Step 1: Write the failing tests:**
  - `showRegChipBefore({type:'register'}, false)` is false.
  - `showRegChipBefore({type:'register'}, true)` is true.
  - `showRegChipBefore({type:'type'}, false)` is true.
  - The validator errors with `register base names the register` on a register card whose base is `'(formal)'`, and also on one whose base is `'Now say it to the waiter (Lei).'`.

- [ ] **Step 2: Run `npm test`.** Expected: FAIL.

- [ ] **Step 3: Implement** the helper, the chip move and the validator rule.

- [ ] **Step 4: Run `npm run validate`.** Expected: it lists every register card that now fails. Rewrite each of those `base`s so it names the person and never the register, e.g. `(to your partner's grandmother)` or `Now say it to the waiter.`. Keep the context the card needs: the relationship, and for groups the number of people. Then run `npm run validate` until all 6 units pass.

- [ ] **Step 5: Run `npm test`, then commit** with the message `feat: decide tu or Lei yourself on register cards`.

### Task 6: Unit 0, lessons 1–2 audio-first (c/ch/g/gh; gli/gn/sc)

**Files:**
- Modify: `content/units/unit-00-sounds.js` (lessons u0-l1 and u0-l2, plus shared `WHY_*` constants)
- Create: `tests/content-u0.test.js`

**Interfaces:**
- Consumes: `say` and the gap rules (spec §3, Tasks 3–4), the pattern syntax (Task 1).
- Produces: u0-l1 and u0-l2 exercises that follow spec §4. Leave `audioFirst` unset until Task 7, when the whole unit complies.

- [ ] **Step 1: Write the failing tests** in `tests/content-u0.test.js`. Load the unit with `await import('../content/units/unit-00-sounds.js')`. For every exercise in u0-l1 and u0-l2 of type `recognise` or `type`, assert all of these:
  - `say` is non-empty.
  - For `type` with `___`: `answers[0]` matches the gap shape; the filled prompt equals `say` after `normalize`; `judge` of the full word passes.
  - No `base` contains `said "` (respellings are gone).
  - No exercise has type `register`. No exercise in these lessons is a `transform` asking for a plural (assert no `base` contains `plural`).
  - Per rule, there are at least 30 exercises.

- [ ] **Step 2: Run `npm test`.** Expected: FAIL.

- [ ] **Step 3: Rewrite the two lessons** per spec §4 and the Unit 0 entries of spec §11:
  - rung 1 hear & pick;
  - rung 2 hear & spell (gap rule);
  - rung 3 sound pairs in context;
  - rung 4 builds with glossed words in `base`;
  - rung 5 listen.
  - Keep the lesson rules, examples and ids where a card survives. New cards get new, unused ids.
  - Fix the flagged ones: l1-e13, l1-e15, l1-e17, l2-e15, l1-e24, l2-e25, l1-e29, l2-e37, l1-e23, l1-e27, l1-e26, l2-e27, l2-e32.
  - Remove the plural transforms (l1-e18…e22, l2-e18…e22). **Keep a copy of their objects** in the task report, for Task 8.
  - Remove the register cards (l1-e23…e25, l2-e23…e25).
  - Word `WHY_*` texts with no "listen to the sound" when the card can't play sound.

- [ ] **Step 4: Run `npm test` and `npm run validate`.** Expected: PASS.

- [ ] **Step 5: Commit** with the message `content(u0): lessons 1–2 audio-first`.

### Task 7: Unit 0, lessons 3–4 and the scene audio-first; switch on `audioFirst`

**Files:**
- Modify: `content/units/unit-00-sounds.js`
- Modify: `tests/content-u0.test.js`

- [ ] **Step 1: Extend the tests** to cover u0-l3 (gap rule), u0-l4 (`say` required, no gap-shape rule), and the scene. Also assert `unit.audioFirst === true`.

- [ ] **Step 2: Run `npm test`.** Expected: FAIL.

- [ ] **Step 3: Rewrite** per spec §4 and §11.
  - Doubles: hear & spell (`bo___glia` → `tti`), plus sound pairs `nono/nonno`, `pala/palla`, `caro/carro` and `sete/sette` in deciding contexts.
  - Accents: replace the giveaway transforms with hear & pick (`te · tè`, `li · lì`, `venerdi · venerdì`).
  - Fix l3-e09…e11, l3-e15, l3-e17, l3-e18, l3-e30, l3-e33, l3-e34, l3-e37, l4-e19, l4-e20, l4-e31, l4-e34, l4-e36, s-e04, s-e06, s-e08, s-e09 and s-e10.
  - Remove the plural transforms l3-e19…e23 (copy them out for Task 8), the register cards l3-e25…e27 and l4-e24…e26, and the giveaways l4-e21…e23 and l3-e24.
  - Set `audioFirst: true` on the unit.

- [ ] **Step 4: Run `npm test` and `npm run validate`.** Expected: PASS.

- [ ] **Step 5: Browser check.** Do one Unit 0 lesson end to end at 1440 px and at 375 px: auto-play, gap entry, the whole-word note, skip, and "Hear it".

- [ ] **Step 6: Commit** with the message `content(u0): lessons 3–4 and scene audio-first`.

### Tasks 8–12: Content fixes for Units 1–5 (one task per unit)

Every unit follows the same task template. Each is a separate task with its own commit: `content(uN): teach-before-test and accept every natural answer`.

**Files:**
- Modify: `content/units/unit-0N-*.js`
- Create: `tests/content-uN.test.js`

**Each task:**
- [ ] **Step 1: Write failing acceptance tests** in `tests/content-uN.test.js`. Load the unit and index exercises by id. For each listed case, assert `isPass(judge(ex, input).verdict)`, or `!isPass` where marked ✗. Also assert that each listed "gloss" card's `base` contains the given text.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Fix every card in that unit's §11 list** per spec §7 and §8, converting hand lists to patterns where a card has optional parts. Then sweep the rest of the unit for the same patterns (optional pronoun, vocative at either end, name order, Scusi/Mi scusi, stare + gerund as `{text, note}` with note `Right! The simple present (…) is the everyday choice.`). Put person cues in `base`, as spec §7 says.
- [ ] **Step 4: Run `npm test` and `npm run validate`.** Expected: PASS.
- [ ] **Step 5: Commit.**

**Task 8, Unit 1.** Also add the moved Unit 0 plural cards, re-id'd as `u1-…` with Unit 1 ruleIds. First make sure Unit 1's plural rule table has rows for `-ca/-ga → -che/-ghe` and `-co/-go → -chi/-ghi`, with a careful note about amico → amici.

Tests:
- `u1-l1-e31` base contains `cornetto`.
- `u1-l2-e33` base contains `quanto costano`.
- `u1-s-e08` base contains `lista della spesa`.
- `u1-l3-e28` accepts `Mi scusi, ho un problema.`
- `u1-s-e09` accepts `arancie` with a note, or the card no longer uses arance.
- `u1-l2-e28` accepts the digit form.
- `u1-l1-e16` `en` is `The night is quiet here.`
- `judge(u1-l1-e37, 'Ai la chiave?').verdict === 'mistake'`.

**Task 9, Unit 2.**

Tests:
- `u2-l1-e11` base contains `masculine`.
- `u2-l2-e25` base contains `masculine`.
- `u2-l4-e28` base contains `giovedì`.
- `u2-l4-e23` accepts `Buongiorno, signor Rossi. Come sta?`
- `u2-l4-e19` accepts `Dormo fino a tardi la domenica.`
- `u2-s-e05` accepts `Ecco gli zii Franco e Carla.`
- `u2-l1-e23` accepts `Domani lo zio arriva.`
- `u2-l4-e20` accepts the `Salve` variant.

**Task 10, Unit 3.** Also add the u3-r1 agreement rows (`stanco · stanca · stanchi · stanche`, `pronto · pronta · pronti · pronte`) with a careful note, the u3-r3 `scusate` row, and retag l2-e06 per spec §7.

Tests:
- `u3-l3-e38` accepts `Come stai?`
- `u3-s-e05` base contains `Anna`.
- `u3-l1-e22` accepts the form with the vocative at the end.
- `u3-l3-e39` accepts `Buona sera, signora, come sta?`
- `u3-l4-e28` accepts `Ho trenta anni.`
- `u3-l3-e23` accepts the optional-tu form.
- `u3-l4-e37` no longer hinges on sete/sette alone (assert its prompt contains a disambiguating word chosen by the implementer and named in the report).
- `judge(u3-l1-e10, <same answer with e for è>).verdict === 'mistake'`.

**Task 11, Unit 4.**

Tests:
- `u4-l2-e27` accepts `Un cappuccino, grazie.`
- `u4-l1-e31` accepts the stare-gerund form with a note.
- `u4-l2-e30` and `u4-l2-e08` are consistent on chiudono: if e08 keys `chiudono` as a mistake for one museum, e30 must not accept `chiudono il museo`.
- `u4-l3-e33` accepts `Giulia, dormi?`
- `u4-l1-e22` accepts `Parla inglese, signora?`
- `u4-s-e07` base contains `dolce`.
- The explicit-pronoun type cards from §11 no longer start their prompt with `Io `, `Tu ` or `Noi `.
- `u4-s-e10` accepts `Rispondi tu. Ho le mani bagnate.`

**Task 12, Unit 5.**

Tests:
- `u5-l1-e28` base contains `luglio`.
- `u5-l3-e30` accepts `Lo scontrino, per favore.`
- `u5-l2-e30` accepts the `stai facendo` form.
- `u5-l1-e25` accepts `Di dove sei?`
- `u5-l1-e19` accepts a name-first voi form.
- `u5-l1-e31` keys `la domenica` with the every-Sunday explanation.
- `u5-l2-e35` no longer contains `fa a`.

### Task 13: Docs and the final check

**Files:**
- Modify: `docs/superpowers/specs/2026-10-02-piano-piano-phase1-design.md`. In §5 and §6, add a one-line pointer to the Phase 1.1 spec and update the checker order.
- Modify: `README.md`, in its content-authoring section. It needs `say`, the patterns, `{text, note}`, `digits: false`, `audioFirst` and the register-base rule.

- [ ] **Step 1:** Update both docs.
- [ ] **Step 2: Run `npm test` and `npm run validate`.** Expected: everything passes and 6 units are valid.
- [ ] **Step 3: Browser smoke test** at 1440 px and 375 px:
  - a Unit 0 lesson;
  - a Unit 3 register card in mixed practice (the chip appears only after answering);
  - a Unit 4 build card answered with a pattern variant;
  - Review.
- [ ] **Step 4: Commit** with the message `docs: Phase 1.1 authoring rules`.
