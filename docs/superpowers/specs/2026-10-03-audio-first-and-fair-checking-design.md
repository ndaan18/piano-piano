# Piano Piano: audio-first sounds and fair checking (Phase 1.1)

Date: 2026-10-03 · Status: approved in conversation · Builds on: `2026-10-02-piano-piano-phase1-design.md`

## 1. Why

The learner reported that Unit 0's practice "doesn't make sense". The cards ask you to spell sounds you never hear. In `A che ora è la ___na? (dinner, soft c)` you know the c is soft but not whether the next letter is e or i.

An audit of all 875 exercises in Units 0–5 found no wrong Italian. But about 195 cards (22%) fail the basic test: **can a learner who has done the earlier lessons get this right from what is on screen?** There are five root causes:

1. **Sound cards with no sound.** Only `listen` cards play audio. 8 Unit 0 cards are impossible and about 43 more need audio.
2. **Unit 0 tests grammar it never teaches.** 17 cards are plural transforms (Unit 1 material) and 12 are tu/Lei verb forms (Units 3–5). The rule for them lives only in `why`, which free practice and checkpoints hide.
3. **Words and forms that were never taught.** About 30 cards need a word, a gender or an adjective ending that appears only in examples or a scene, or nowhere.
4. **Correct answers marked wrong.** About 90 cards have hand-enumerated `answers` lists that are uneven between sibling cards. Typical gaps: optional subject pronoun, the position of a vocative, Scusi / Mi scusi, name order, digits, punctuation in the middle of a sentence, and stare + gerund.
5. **Sound-alikes.** è/e is sometimes a pass and sometimes a fail. Silent-h slips get no explanation. Some listen cards hinge on contrasts that browser TTS blurs (sete/sette, "fa a Bologna").

Being marked wrong for correct Italian is the most damaging failure for this app. It breaks trust, it pushes known cards back into review, and it can fail a checkpoint.

## 2. Goals and non-goals

**Goals**

- Every card can be answered from what has been taught plus what is on screen.
- Every correct, natural answer to a card is accepted.
- Unit 0 trains the ear: hear, then spell.

**Non-goals**

- No new units.
- No change to the curriculum order, the SRS, the mastery stages or the visual design.
- No recorded audio. Browser TTS stays.

## 3. Audio on any card

### 3.1 Data

The exercise schema gains an optional field:

- `say` (string): the Italian the browser speaks for this card.

Rules:

- `listen` cards keep using `prompt` and do not use `say`.
- Unit 0 marks itself `audioFirst: true`. In an `audioFirst` unit, every `recognise` and `type` exercise must have `say`. The validator enforces this.

### 3.2 Card behaviour

A card with `say` (and every `listen` card) is an **audio card**.

**Before answering**, an audio card shows the same audio block the listen card has today:

- a large play button, Normal / Slow, and Space to replay until you start typing;
- auto-play once on show.

Then come the prompt and answer UI for the card's type:

- **Hear & pick** (`recognise` + `say`): the prompt may be just `___`, or a sentence with a gap. The options are spellings, e.g. `cena · cina · chena`.
- **Hear & spell** (`type` + `say`): the prompt is the sentence with a gap. `say` is the full sentence.

**After answering**, every card in every unit gets a small "🔊 Hear it" button in the feedback that speaks the target. Clicking it is optional; it never auto-plays. The button is hidden when there is no Italian voice.

### 3.3 Can't listen now

Every audio card shows a ghost button, **"Can't listen now"**.

- It moves the card to the end of the queue. The card is not graded, logged or counted.
- After 3 consecutive skips, the card area offers **"Skip all audio cards this session"**. That drops the remaining audio cards from the session, ungraded.
- If a session ends with no graded cards, the done screen says so ("Nothing practised: these cards need sound") and offers to return to the unit. It records no progress.

### 3.4 No Italian voice

Today a listen card without a voice offers "Show sentence", which defeats the card. This is replaced.

- When `audio.hasItalianVoice()` resolves false, sessions drop audio cards before they start. The cards are not graded.
- The Unit 0 unit page shows the `NO_VOICE_HTML` notice above its steps. Its lessons say "This unit needs an Italian voice" with a link to Settings, instead of an empty session.
- Review sessions skip due audio cards. They stay due.

### 3.5 Gap rule for Unit 0 (lessons 1–3)

The gap holds the whole letter group that spells the sound, through the vowel you hear:

| Gap prompt | Answer |
|---|---|
| `La ___na è pronta.` | `ce` |
| `Mi piace il ___ccolato.` | `cio` |
| `Dov'è la ___ve?` | `chia` |
| `Un piatto di spa___tti.` | `ghe` |
| `Una bo___glia d'acqua.` | `tti` |
| `Buona ___!` | `tte` (notte) |

The validator checks the shape of every `type` answer in u0-l1…l3: `^[bcdfghlmnpqrstvz]+i?[aeiouàèéìòù]$`. It also checks that the prompt, with `answers[0]` filled into the gap, equals `say` after normalisation. That guarantees the gap matches what is spoken.

## 4. Unit 0 rewrite

Unit 0 keeps its four lessons, its scene and its rules. Its exercises are rewritten to be audio-first. Each rule keeps ≥ 30 exercises, roughly in this mix:

| Rung | Card | Notes |
|---|---|---|
| 1 | Hear & pick | Pick the spelling you heard, 2–3 options. Replaces the "which word has a soft c?" cards. |
| 2 | Hear & spell | Gap per §3.5. |
| 3 | Sound pairs in context | Hear & pick or hear & spell where the pair contrast is decided by sense too: `Ho ___` (sete) vs `Sono le ___` (sette), nono/nonno, pala/palla, caro/carro. |
| 4 | Build | Translate a short phrase that uses the sound, e.g. *Un gelato al pistacchio, per favore*. Kept from today where the audit passed them. Phrase words not yet taught go in `base`. |
| 5 | Listen & type | Full short sentences, as today. |

Removed from Unit 0:

- **The plural transforms** (u0-l1-e18…e22, u0-l2-e18…e22, u0-l3-e19…e23). They move to Unit 1's plural lessons with new ids and Unit 1 ruleIds. Unit 1 must teach the -ca/-ga/-co/-go → -che/-ghe/-chi/-ghi spelling first, so a row is added to its plural rule table and careful box if it is missing.
- **The tu/Lei register cards** (u0-l1-e23…e25, u0-l2-e23…e25, u0-l3-e24…e27, u0-l4-e24…e26). They are dropped. Units 3–5 cover this.
- **The accent-giveaway transforms** (u0-l4-e21…e23, u0-l3-e24). They are replaced by hear & pick cards: `te · tè`, `li · lì`.

**Pronunciation respellings** ("said CHEH-na") are removed from `base`, because they caused the chow/Chao confusion and the audio now does that job. `base` keeps the meaning ("(dinner)").

## 5. Fairer checking

All of this lives in `js/engine/checker.js` and stays pure and unit-tested. The order in `judge` becomes:

1. Normalise
2. Exact
3. Known mistake
4. Meaning-changing accent
5. Silent h
6. Other accent
7. Typo
8. Wrong

### 5.1 Answer patterns

An entry in `answers` (not in `mistakes` or `options`) may use:

- `[x]`: x is optional.
- `{a|b|c}`: exactly one of the alternatives.

They nest, and alternatives may be empty. `expandAnswer(pattern)` returns every concrete string. Spaces left doubled or dangling around a dropped part are collapsed, and so is a comma left in front of the final punctuation.

Examples:

- `[Tu] sei stanca?` → `Tu sei stanca?`, `sei stanca?` (the checker is case-insensitive)
- `{Signora, ha fame?|Ha fame[, signora]?}` → 3 strings

Rules, enforced by the validator:

- `answers[0]` must be plain text, with no `[ ] { } |`. It is the target shown in feedback.
- Brackets must balance.
- One pattern may expand to at most 64 strings.
- `mistakes` keys are plain text.

`judge` expands patterns once per exercise; the result is memoised by exercise id. `extraAnswers` (the "I was right" list) stay plain.

### 5.2 Normalisation

- `?`, `!`, `.`, `;` and `:` anywhere become a space. Today only commas do. The text is then collapsed and trimmed as before.
- **Digits → words, input side only.** A whole token of 0–100 becomes its Italian word (`2` → `due`, `21` → `ventuno`, `23` → `ventitré`). `1` is left alone, because un/uno/una is grammar. Conversion runs before punctuation is stripped, and skips any token containing `:` or `.`, so times like `8:30` are left alone.
  - An exercise can opt out with `digits: false`. This is used where spelling the number out is the point.

### 5.3 Meaning-changing accents

The pairs are: `e/è`, `si/sì`, `te/tè`, `la/là`, `li/lì`, `da/dà`, `ne/né`, `se/sé`.

If the input differs from an accepted answer only in accents, and at least one differing word is one of these pairs, the verdict is `mistake`. The message comes from a fixed table, e.g. *"e means 'and', è means 'is'. Here you need è."*

Other accent-only differences stay `accent`, which counts as a pass.

### 5.4 Silent h

If the input equals an accepted answer with one of `ho/hai/ha/hanno` written without the h (`o/ai/a/anno`), the verdict is `mistake`. The message is: *"Right sound! The h in ho is silent, but it's always written: ho = I have, o = or."* (or the matching variant).

### 5.5 Word boundary

`wordAt` treats any non-letter as a word boundary. So `signore!` vs `signora!` is no longer forgiven as a typo, because the edit is on the word's last letter.

## 6. Register chip

On `register` cards ("say it to…"), the register chip is **hidden before answering unless the card has hints**, i.e. the guided first half of a lesson. In free practice, mixed practice, scene cards, review, drills and checkpoints you decide tu or Lei yourself. The chip then appears in the feedback, next to the verdict.

Content consequence: a register card's `base` must name **who** you are talking to (e.g. "to your partner's grandmother", "to the waiter"). It must never name the register.

- The validator rejects a register-card `base` that matches `/\b(in)?formal\b|\(tu\)|\(Lei\)/i`.
- Other card types keep the chip as today, because their gaps often rely on it.

## 7. Content rule (all units)

**Anything a card needs must come from a lesson that comes before it in the unit order, or be stated in the card's `base`.** "Anything" means a word, a gender, a form or a set phrase.

- Glosses in `base` look like `(July = luglio)`, `(spumante: masculine)` or `(you'll need: quanto costano)`.
- `why` may explain but must never be the only source.
- Examples and scene dialogue do not count as "taught". Cards are shuffled away from them.

Consistent policies:

- **Subject pronouns:** accepted wherever the verb form makes them optional. Write them as `[io]`, `[tu]` and so on.
- **Vocatives** (a name, signora, amore, ragazzi, nonni): accepted at the start or at the end wherever the card's context names that person.
- **Name order** ("Marco e Giulia" / "Giulia e Marco"): both accepted.
- **Scusi / Mi scusi**, and Scusa / Scusami where register allows: both accepted.
- **stare + gerund for an English -ing:** accepted everywhere, with a `note` telling the learner that the simple present is the everyday choice. To support this, `answers` entries may be objects `{ text, note }`, where `note` is shown with a correct verdict.
- **A just-the-noun order** ("Un cappuccino, grazie."): accepted wherever the lesson's own note recommends it.
- **Person cues on `type` cards** move into `base`. `Io ___ una lettera.` becomes `___ una lettera. (scrivere: I)`. The unit itself teaches that an explicit io is contrastive.

Unit-specific teaching additions:

- **Unit 3, rule u3-r1:** the table gains adjective agreement (`stanco · stanca · stanchi · stanche`, `pronto · pronta · pronti · pronte`), with a careful note. That rule's lesson is where the forms are first needed.
- **Unit 3, rule u3-r3:** the table gains a `scusate` (voi) row.
- **Unit 3:** l2-e06, the "voi to a business" card, is tagged `neutral`, and its `base` says it is addressed to a business.

## 8. Listen-card fixes

- Rewrite or replace listen cards that hinge on contrasts the TTS blurs: sete/sette with both readings grammatical, vowel-merge sites (`andiamo a mangiare`, `fa a Bologna`), and `dov'è` vs `dove è`. Where both spellings are valid, accept both.
- Cards with untaught proper nouns or new words (via Zamboni, passeggiata, fermata) stay only if the word was taught earlier. Otherwise shorten them.
- Mistake messages that say "you heard è" are reworded around the grammar ("the sentence needs a verb: è"), because TTS can't voice the accent.

## 9. Validator additions (`tools/validate-content.js`)

- `say` is required on `recognise` and `type` cards in an `audioFirst` unit.
- The §3.5 gap shape, and the gap-filled-prompt equals `say` check, apply in u0-l1…l3.
- `answers[0]` is plain. Patterns are balanced and expand to at most 64 strings. Every `{ text, note }` has a non-empty text.
- The register-card `base` rule from §6.
- A `recognise` card's `say` contains its `answers[0]`, after normalisation, as a whole word or phrase.
- `MIN_PER_RULE = 30` stays.

## 10. Testing

**Checker unit tests:**

- pattern expansion: nesting, empty alternatives, comma clean-up, the 64 cap;
- inner punctuation;
- digits, including `1` left alone and `digits: false`;
- every meaning-changing accent pair;
- the silent-h variants;
- the `signore!` regression;
- object answers with a note.

**Session and card tests:**

- skip re-queues the card without grading;
- three skips offer skip-all;
- no voice drops audio cards;
- the register chip is hidden before answering exactly when `type === 'register' && !hints`.

**Validator:** run over all units; all six must pass.

**Browser checks:**

- a Unit 0 lesson at 1440 px and 375 px: auto-play, Slow, Space, skip and skip-all;
- the no-voice path, by stubbing `hasItalianVoice`;
- a register card in free practice;
- the "Hear it" button in feedback.

## 11. Appendix: audit findings to fix

The ids are the cards the audit flagged. Implementers fix each in line with §7 and §8. They may find more of the same pattern and should fix those too.

### Unit 0
- Impossible without sound: l1-e13, l1-e15, l3-e09, l3-e10, l3-e11, l3-e15, l3-e17, l3-e18, s-e04.
- Inconsistent gaps: l2-e15 (sc vs sci), l1-e17 (`bic___iere`).
- Unknown words or phrases: l1-e24 and l2-e23 (scusi), l2-e25 (ti), l4-e19 and l4-e20 (accented words don't change in the plural), s-e06 (letter names in base), l1-e29 (a che ora), s-e08 (colazione), l2-e37 and s-e09 (c'è, l', ascensore).
- Missing answers: l1-e23 (Come si chiama Lei?), l1-e27 (Niente ghiaccio), l1-e29 and s-e08 (c'è la …), l3-e33 (Ecco nonno), l1-e26 (Chiave, per favore), l2-e27 (Mi scusi), l4-e31 (Un altro po').
- Digits: l3-e30, s-e10 (decide per card whether digits are fine).
- Silent h and apostrophe slips: l3-e34 (O sete), l2-e32 and l3-e37 (Dovè).
- Rewords: l4-e34 and l4-e36 ("you heard is"), WHY_PLURAL_HARD ("listen to the sound").

### Unit 1
- Untaught words: l1-e31 (cornetto), l2-e33 (quanto costano), l3-e19 (bello → belli), s-e04 (euro is invariable), s-e07 (limone), s-e08 (lista della spesa).
- s-e09: arance/arancie sound identical. Accept both with a note, or choose an audible word.
- Digits: l2-e28…e30, l2-e32, l3-e26, l3-e27, s-e07 (covered by §5.2).
- l1-e16: en should say "The night is quiet here."
- Silent h: l1-e37, l3-e34 (covered by §5.4).
- l3-e28: add Mi scusi.

### Unit 2
- Unknown gender: l1-e11 (spumante), l2-e25 (ascensore), l2-e12 (orari), l2-e14 (occhiali), l1-e17 (cameriere), l3-e09 (spritz).
- Untaught words or forms:
  - l1-e25 (orario dei treni)
  - s-e08 (dell'università)
  - l2-e28 (in vacanza)
  - l3-e29 (farmacia, qui vicino)
  - l3-e30 (tra un'ora)
  - l4-e28 (giovedì)
  - l4-e11 (venerdì)
  - l2-e30 (campagna)
  - l3-e27 (vorrei)
  - l3-e25 (aranciata)
  - l4-e25 (chiusi)
  - l4-e27 (gentile)
  - l4-e30 (il posto, libero)
  - l4-e23 (sta)
  - l4-e24 (sa)
- Missing answers:
  - l4-e23 (inner punctuation)
  - l4-e24 (signora at the end; dove è)
  - l4-e19, l4-e17, s-e07 (Di + day and il + day in every position)
  - s-e05 (zii)
  - l1-e23, l2-e26 (Domani first)
  - l4-e16 (dottoressa, or state the gender)
  - l4-e20, s-e06 (Salve)
  - l1-e22 (the full combination set)

### Unit 3
- l3-e38: allora is untaught. Accept "Come stai?" and the variants.
- s-e05: the base should say "call her Anna". Key the signora version and add variants.
- l2-e06: the voi-to-a-business card (see §7).
- Agreement before it is taught: l1-e24, l1-e31, l3-e16, l3-e35, l1-e32 (fixed by the §7 table, plus hints where still needed).
- l3-e19: scusate, and make the scusa/scusi explanation consistent.
- Missing answers:
  - name order: l2-e19, l4-e17
  - Buona sera: l3-e39
  - vocative at the end: l1-e22, l2-e22, l2-e31, l3-e25, l4-e22, l4-e23
  - vocative variants: l2-e23, l2-e24, l2-e25, l2-e32
  - age variants and "Trenta" key: l4-e28
  - Avete una penna: l2-e27
  - optional tu: l3-e23, l3-e24, l4-e24, l4-e26, s-e08
  - Mi scusi: l1-e25
  - Grazie, molto gentile: l3-e34
  - Di dov'è Lei: s-e07
  - carini: l1-e32
- Listening: l4-e36, l4-e37 (sete/sette).
- è/e: l1-e10, l1-e15, l1-e16, l3-e14 (covered by §5.3).
- Lesson 3 register giveaways (covered by §6).

### Unit 4
- s-e10: inner "?" (covered by §5.2). s-e07: untaught dolce, portare.
- l2-e27: accept "Un cappuccino, grazie."
- stare + gerund policy (§7): l1-e31, l1-e32, l4-e28, l4-e33.
- l2-e08 and l2-e30 contradict each other on chiudono: make them consistent.
- Missing variants:
  - l2-e32, l2-e31, l3-e25, l3-e28, l3-e33
  - signora at the end: l1-e22, l1-e23, l2-e24
  - lei as "she": l2-e17, l3-e19
  - grandparent register cards: l1-e26, l2-e25, l3-e22, l3-e26
  - Nonni vocative: l2-e28, l3-e31
  - pronoun forms of synonyms: l2-e33, l1-e29
- l4-e21: keep only the contrastive tu forms.
- s-e02: the base says the grandmother uses tu.
- Explicit-pronoun type cards → cue in base: l1-e09, l1-e12, l2-e09, l2-e13, l3-e09, l3-e13, l4-e11, l4-e13, l4-e14.

### Unit 5
- l1-e28: luglio is untaught. l3-e30: the "Mi dà…?" pattern plus accept "Lo scontrino, per favore" and "Mi può dare…".
- Missing answers: l2-e30 (stai facendo), l2-e28 (come va variants), s-e08 (pizza phrasings), l1-e25 (Di dove sei?).
- Voi transforms with names: l1-e19, l1-e21, l2-e19, l2-e21, l3-e19, l3-e21.
- More missing variants: l1-e26, l3-e23, l2-e31.
- Listening: l1-e32 (andiamo a), l2-e35 (fa a), l3-e33 (dove è, fermata).
- New words in listen cards: l1-e34, l2-e33, s-e09, s-e10.
- l1-e31: key "la domenica" (every Sunday).
