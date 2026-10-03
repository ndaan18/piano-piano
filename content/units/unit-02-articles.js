// Unit 2: Articles. Data only (schema: spec §9).
// Exercise field use by type:
//   recognise  prompt with ___ gap, options (2–4, include the answer)
//   type       prompt with ___ gap, answers = the missing word(s)
//   transform  prompt = sentence to rewrite, base = the instruction
//   register   prompt = sentence said to one person, base = who to say it to now; reg = target register
//   build      prompt = 'Translate: "…"', base = context line
//   listen     prompt = the Italian sentence to speak, answers = that sentence
// Four lessons, one rule each: il/lo/la/l' · i/gli/le · un/uno/una/un' · days and titles.
// Possessives (mio, tua…) are Unit 8, so family talk here uses "la sorella di Luca",
// "lo zio Franco" and "un amico di papà". Article slips are whole-word or word-final
// edits, which the checker never passes as typos; the keys explain each one.

// u2-r1: the (singular)
const WHY_IL = 'Masculine words take il before most consonants: il treno, il conto, il bagno.';
const WHY_LO = 'Masculine words take lo before s + consonant, z, gn, ps, x and y: lo zaino, lo scontrino, lo gnocco.';
const WHY_L = "Before a vowel (or a silent h), lo shortens to l' and joins the word: l'albergo, l'hotel.";
const WHY_LA = 'Feminine words take la before any consonant, s + consonant and z included: la casa, la scuola, la zia.';
const WHY_LA_L = "Before a vowel, la shortens to l' too: l'amica, l'acqua.";

// u2-r2: the (plural)
const WHY_I = 'Masculine words that take il in the singular take i in the plural: il treno → i treni.';
const WHY_GLI = "Masculine words that take lo or l' in the singular take gli in the plural: lo zaino → gli zaini, l'amico → gli amici.";
const WHY_LE = "Every feminine plural takes le, before a vowel too: la casa → le case, l'amica → le amiche.";
const WHY_MIXED = 'A mixed group takes the masculine plural: gli zii (aunt and uncle), i nonni (grandpa and grandma).';

// u2-r3: a / an
const WHY_UN = 'Most masculine words take un, including those starting with a vowel: un treno, un amico. un is a whole word, so it never takes an apostrophe.';
const WHY_UNO = 'Where "the" would be lo (s + consonant, z, gn, ps, x, y), "a" is uno: uno zaino, uno spritz.';
const WHY_UNA = 'Feminine words take una before any consonant, z included: una pizza, una zia.';
const WHY_UN_AP = "Before a vowel, una shortens to un': un'amica, un'ora. The apostrophe is what shows it is feminine.";

// u2-r4: days and titles
const WHY_DAY = 'With a day, the article means "every week": il lunedì = on Mondays. Without it, the day is one particular day, usually the coming one: lunedì = on Monday.';
const WHY_DOMENICA = 'domenica is the one feminine day, so Sundays are la domenica. The other days are masculine: il sabato, il lunedì.';
const WHY_TITLE = 'When you talk about someone, a title takes the article: il signor Rossi, la signora Bianchi, il dottor Neri.';
const WHY_ADDRESS = 'When you speak to someone, the title has no article: Buongiorno, signor Rossi! Buonasera, signora!';
const WHY_SIGNOR = 'Before a name, signore drops its final e: il signor Rossi. dottore and professore do the same: il dottor Neri.';

export default {
  id: 2,
  slug: 'articles',
  title: 'Articles',
  teaser: "il · lo · la · l'",
  canSay: "Ti presento lo zio, la zia e un'amica di Marco.",
  lessons: [
    // ------------------------------------------------------------ the (singular)
    {
      id: 'u2-l1',
      title: "il, lo, la, l'",
      rules: [
        {
          id: 'u2-r1',
          title: "il · lo · la · l'",
          sentence: "lo zio · la zia · l'amica",
          marks: [
            { word: 'lo', kind: 'circle', color: 'pink' },
            { word: 'z', kind: 'underline', color: 'ultra' },
            { word: 'la', kind: 'circle', color: 'pink' },
            { word: "l'", kind: 'circle', color: 'pink' },
            { word: 'a', kind: 'underline', color: 'ultra' },
          ],
          why: "\"The\" depends on the noun's gender and on the sound the next word starts with. Masculine words mostly take il. Sounds that are awkward after il (s + consonant, z, gn, ps, x, y) take lo, and before a vowel lo shortens to l'. Feminine words are simpler: la before any consonant, l' before a vowel.",
          table: {
            head: ['Article', 'Before', 'Example'],
            rows: [
              ['il', 'masculine: most consonants', 'il libro, il treno'],
              ['lo', 'masculine: s + consonant, z, gn, ps, x, y', 'lo zaino, lo studente, lo gnocco'],
              ["l'", 'masculine: a vowel or silent h', "l'amico, l'hotel"],
              ['la', 'feminine: any consonant', 'la casa, la scuola, la zia'],
              ["l'", 'feminine: a vowel', "l'amica, l'acqua"],
            ],
            highlight: [1],
          },
          careful: "The article matches the word right after it, not the noun: lo zaino but il nuovo zaino; l'amico but il vecchio amico. s + vowel is a normal consonant: il sale, not lo sale. Feminine words never take lo: la zia, la scuola. And because l' serves both genders, only the noun's ending tells l'amico from l'amica.",
          howItaliansSayIt: {
            it: "Dov'è l'ascensore?",
            en: "Where's the lift?",
            note: "Two shortenings in a row: dove è becomes dov'è, and lo ascensore becomes l'ascensore. Say each pair as one word: \"dovè\", \"lascensore\".",
          },
        },
      ],
      examples: [
        { it: 'Il treno è in ritardo.', en: 'The train is late.', reg: 'neutral' },
        { it: 'Lo zaino è in macchina.', en: 'The backpack is in the car.', reg: 'neutral' },
        { it: "L'albergo è vicino alla stazione.", en: 'The hotel is near the station.', reg: 'neutral' },
        { it: 'Hai lo scontrino?', en: 'Do you have the receipt?', reg: 'tu' },
        { it: "Scusi, dov'è l'ufficio turistico?", en: "Excuse me, where's the tourist office?", reg: 'lei' },
        { it: 'La zia di Giulia abita a Roma.', en: "Giulia's aunt lives in Rome.", reg: 'neutral' },
        { it: "L'amica di Marco arriva stasera.", en: "Marco's friend arrives tonight.", reg: 'neutral' },
        { it: 'La scuola è chiusa oggi.', en: 'The school is closed today.', reg: 'neutral' },
        { it: 'Lo sciopero dei treni è domani.', en: 'The train strike is tomorrow.', reg: 'neutral' },
        { it: 'Il caffè qui è buonissimo.', en: 'The coffee here is excellent.', reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u2-l1-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r1',
          prompt: '___ treno parte alle nove.', base: '"The train leaves at nine."', en: 'The train leaves at nine.',
          answers: ['Il'], options: ['Il', 'Lo', "L'"],
          mistakes: {
            Lo: 't is an ordinary consonant, and tr is too: il treno.',
            "L'": "l' is only for a vowel or a silent h. treno starts with t, so il.",
          },
          why: WHY_IL,
        },
        {
          id: 'u2-l1-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r1',
          prompt: "Dov'è ___ zaino?", base: '"Where\'s the backpack?"', en: "Where's the backpack?",
          answers: ['lo'], options: ['il', 'lo', "l'"],
          mistakes: {
            il: 'zaino is masculine and starts with z, and z takes lo: lo zaino.',
            "l'": "l' is for a vowel or a silent h. zaino starts with z, so lo.",
          },
          why: WHY_LO,
        },
        {
          id: 'u2-l1-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r1',
          prompt: '___ albergo è in centro.', base: '"The hotel is in the centre."', en: 'The hotel is in the centre.',
          answers: ["L'"], options: ['Il', 'Lo', "L'"],
          mistakes: {
            Lo: "Before a vowel, lo shortens to l': l'albergo.",
            Il: "il never goes before a vowel. albergo starts with a, so l'albergo.",
          },
          why: WHY_L,
        },
        {
          id: 'u2-l1-e04', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u2-r1',
          prompt: 'Hai ___ biglietto?', base: '"Do you have the ticket?"', en: 'Do you have the ticket?',
          answers: ['il'], options: ['il', 'lo'],
          mistakes: { lo: 'biglietto starts with b, a normal consonant: il biglietto.' },
          why: WHY_IL,
        },
        {
          id: 'u2-l1-e05', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u2-r1',
          prompt: 'Le serve ___ scontrino?', base: '"Do you need the receipt?" (the cashier asks you)', en: 'Do you need the receipt?',
          answers: ['lo'], options: ['il', 'lo', "l'"],
          mistakes: {
            il: 'scontrino starts with s + consonant (sc), so lo: lo scontrino.',
            "l'": "l' is for a vowel or a silent h. scontrino starts with s + c, so lo.",
          },
          why: WHY_LO,
        },
        {
          id: 'u2-l1-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r1',
          prompt: 'Quanto costa ___ ombrello?', base: '"How much is the umbrella?"', en: 'How much is the umbrella?',
          answers: ["l'"], options: ['il', 'lo', "l'"],
          mistakes: {
            lo: "Before a vowel, lo shortens to l': l'ombrello.",
            il: "il never goes before a vowel: l'ombrello.",
          },
          why: WHY_L,
        },
        {
          id: 'u2-l1-e07', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u2-r1',
          prompt: 'Mi passi ___ zucchero?', base: '"Can you pass me the sugar?"', en: 'Can you pass me the sugar?',
          answers: ['lo'], options: ['il', 'lo'],
          mistakes: { il: 'zucchero starts with z, so lo: lo zucchero.' },
          why: WHY_LO,
        },
        {
          id: 'u2-l1-e31', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r1',
          prompt: '___ zia di Giulia abita a Roma.', base: '"Giulia\'s aunt lives in Rome."', en: "Giulia's aunt lives in Rome.",
          answers: ['La'], options: ['Il', 'Lo', 'La'],
          mistakes: {
            Lo: 'lo is masculine (lo zio). zia is feminine, and feminine words take la before z too: la zia.',
            Il: 'il is masculine. An aunt is feminine: la zia.',
          },
          why: WHY_LA,
        },
        {
          id: 'u2-l1-e32', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r1',
          prompt: '___ amica di Marco arriva stasera.', base: '"Marco\'s friend (a woman) arrives tonight."', en: "Marco's friend arrives tonight.",
          answers: ["L'"], options: ['La', "L'", 'Lo'],
          mistakes: {
            La: "Before a vowel, la shortens to l': l'amica.",
            Lo: "lo is masculine, and it shortens before a vowel anyway. amica is feminine: l'amica.",
          },
          why: WHY_LA_L,
        },

        // Rung 2: fill the gap
        {
          id: 'u2-l1-e08', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r1',
          prompt: '___ zio di Marco è simpatico.', base: '(the uncle)', en: "Marco's uncle is nice.",
          answers: ['Lo'],
          mistakes: {
            il: 'zio starts with z, so lo: lo zio.',
            "l'": "l' is for a vowel or a silent h. zio starts with z, so lo.",
            la: 'la is feminine: la zia. An uncle is masculine: lo zio.',
          },
          why: WHY_LO,
        },
        {
          id: 'u2-l1-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r1',
          prompt: 'A che ora passa ___ autobus?', base: '(the bus)', en: 'What time does the bus come?',
          answers: ["l'"],
          mistakes: {
            lo: "Before a vowel, lo shortens to l': l'autobus.",
            il: "il never goes before a vowel: l'autobus.",
          },
          why: WHY_L,
        },
        {
          id: 'u2-l1-e10', type: 'type', reg: 'lei', rung: 2, ruleId: 'u2-r1',
          prompt: 'Ci porta ___ conto, per favore?', base: '(the bill, asking the waiter)', en: 'Could you bring us the bill, please?',
          answers: ['il'],
          mistakes: {
            lo: 'conto starts with c + vowel, a normal consonant: il conto.',
            "l'": "l' is for a vowel or a silent h. conto starts with c, so il.",
          },
          why: WHY_IL,
        },
        {
          id: 'u2-l1-e11', type: 'type', reg: 'tu', rung: 2, ruleId: 'u2-r1',
          prompt: 'Ti piace ___ spumante?', base: '(the sparkling wine)', en: 'Do you like the sparkling wine?',
          answers: ['lo'],
          mistakes: { il: 'spumante starts with s + consonant (sp), so lo: lo spumante.' },
          why: WHY_LO,
        },
        {
          id: 'u2-l1-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r1',
          prompt: '___ aeroporto è lontano?', base: '(the airport)', en: 'Is the airport far?',
          answers: ["L'"],
          mistakes: {
            lo: "Before a vowel, lo shortens to l': l'aeroporto.",
            il: "il never goes before a vowel: l'aeroporto.",
          },
          why: WHY_L,
        },
        {
          id: 'u2-l1-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r1',
          prompt: 'Mi piace ___ gelato al pistacchio.', base: '(the ice cream)', en: 'I like pistachio ice cream.',
          answers: ['il'],
          mistakes: {
            lo: 'A g takes lo only in gn (lo gnocco). gelato starts with g + e, so il gelato.',
            "l'": "l' is for a vowel or a silent h. gelato starts with g, so il.",
          },
          why: WHY_IL,
        },
        {
          id: 'u2-l1-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r1',
          prompt: '___ gnocco fritto è buonissimo.', base: '(the gnocco: fried dough)', en: 'Gnocco fritto (fried dough) is delicious.',
          answers: ['Lo'],
          mistakes: { il: 'gnocco starts with gn, and gn takes lo: lo gnocco.' },
          why: WHY_LO,
        },
        {
          id: 'u2-l1-e33', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r1',
          prompt: "Dov'è ___ stazione?", base: '(the station)', en: "Where's the station?",
          answers: ['la'],
          mistakes: {
            il: 'stazione is feminine (nouns in -zione always are): la stazione.',
            lo: 'lo is masculine. stazione is feminine, so la, even before s + consonant: la stazione.',
          },
          why: WHY_LA,
        },
        {
          id: 'u2-l1-e34', type: 'type', reg: 'tu', rung: 2, ruleId: 'u2-r1',
          prompt: 'Mi passi ___ acqua?', base: "(the water: it's feminine)", en: 'Can you pass me the water?',
          answers: ["l'"],
          mistakes: {
            la: "Before a vowel, la shortens to l': l'acqua.",
            lo: "lo is masculine. acqua is feminine, and before a vowel la becomes l': l'acqua.",
          },
          why: WHY_LA_L,
        },
        {
          id: 'u2-l1-e35', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r1',
          prompt: '___ scuola è chiusa oggi.', base: '(the school)', en: 'The school is closed today.',
          answers: ['La'],
          mistakes: {
            lo: 's + consonant takes lo only for masculine words. scuola is feminine: la scuola.',
            il: 'scuola ends in -a and is feminine: la scuola.',
          },
          why: WHY_LA,
        },

        // Rung 3: transform
        {
          id: 'u2-l1-e15', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r1',
          prompt: 'Il libro è sul tavolo.', base: 'Swap "libro" for "zaino".', en: 'The backpack is on the table.',
          answers: ['Lo zaino è sul tavolo.'],
          mistakes: { 'Il zaino è sul tavolo.': 'zaino starts with z, so il becomes lo: lo zaino.' },
          why: 'The article changes with the new word. ' + WHY_LO,
        },
        {
          id: 'u2-l1-e16', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r1',
          prompt: "Dov'è il treno?", base: 'Swap "treno" for "aereo".', en: "Where's the plane?",
          answers: ["Dov'è l'aereo?", "Dove è l'aereo?"],
          mistakes: {
            "Dov'è il aereo?": "aereo starts with a vowel, so il becomes l': l'aereo.",
            "Dov'è lo aereo?": "Before a vowel, lo shortens to l': l'aereo.",
          },
          why: 'The article changes with the new word. ' + WHY_L,
        },
        {
          id: 'u2-l1-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r1',
          prompt: 'Lo studente è in ritardo.', base: 'Swap "studente" for "cameriere".', en: 'The waiter is late.',
          answers: ['Il cameriere è in ritardo.'],
          mistakes: { 'Lo cameriere è in ritardo.': 'cameriere starts with c + vowel, so lo goes back to il: il cameriere.' },
          why: 'lo was only there for the s + t of studente. ' + WHY_IL,
        },
        {
          id: 'u2-l1-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r1',
          prompt: 'Il nuovo amico di Luca è simpatico.', base: 'Drop "nuovo".', en: "Luca's friend is nice.",
          answers: ["L'amico di Luca è simpatico."],
          mistakes: {
            'Il amico di Luca è simpatico.': "Without nuovo, the article sits right before amico, which starts with a vowel: l'amico.",
            'Lo amico di Luca è simpatico.': "Before a vowel, lo shortens to l': l'amico.",
          },
          why: "The article matches the word right after it: il nuovo amico, but l'amico.",
        },
        {
          id: 'u2-l1-e36', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r1',
          prompt: 'Lo zio arriva stasera.', base: 'Now it is the aunt (zia).', en: 'The aunt arrives tonight.',
          answers: ['La zia arriva stasera.'],
          mistakes: { 'Lo zia arriva stasera.': 'zia is feminine, and feminine words take la before z too: la zia.' },
          why: 'lo is for masculine words only. ' + WHY_LA,
        },
        {
          id: 'u2-l1-e37', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r1',
          prompt: "L'amico di Luca è qui.", base: 'Now it is his female friend (amica).', en: "Luca's friend (a woman) is here.",
          answers: ["L'amica di Luca è qui."],
          mistakes: { 'La amica di Luca è qui.': "Before a vowel, la shortens to l', just like lo: l'amica." },
          why: "l' serves both genders, so only the ending changes: l'amico → l'amica. " + WHY_LA_L,
        },

        // Rung 3: switch register
        {
          id: 'u2-l1-e19', type: 'register', reg: 'lei', rung: 3, ruleId: 'u2-r1',
          prompt: 'Hai lo zaino?', base: "You asked your partner. Now ask their father (formal).", en: 'Do you have the backpack?',
          answers: ['Ha lo zaino?', 'Lei ha lo zaino?'],
          mistakes: {
            'Hai lo zaino?': 'That is still the tu form. For Lei, avere becomes ha.',
            'Ha il zaino?': 'Right verb, but zaino starts with z, so lo zaino.',
            'Lei ha il zaino?': 'Right verb, but zaino starts with z, so lo zaino.',
          },
          why: 'tu hai → Lei ha. The article stays lo: lo zaino.',
        },
        {
          id: 'u2-l1-e20', type: 'register', reg: 'lei', rung: 3, ruleId: 'u2-r1',
          prompt: "Prendi l'aperitivo con noi?", base: 'You asked your partner. Now ask their mother (formal).', en: 'Are you having the aperitivo with us?',
          answers: ["Prende l'aperitivo con noi?", "Lei prende l'aperitivo con noi?"],
          mistakes: {
            "Prendi l'aperitivo con noi?": 'That is still the tu form. For Lei, prendi becomes prende.',
            'Prende lo aperitivo con noi?': "Before a vowel, lo shortens to l': l'aperitivo.",
            'Prende il aperitivo con noi?': "il never goes before a vowel: l'aperitivo.",
          },
          why: "tu prendi → Lei prende. The article stays l': l'aperitivo.",
        },
        {
          id: 'u2-l1-e21', type: 'register', reg: 'tu', rung: 3, ruleId: 'u2-r1',
          prompt: "Ha l'ombrello?", base: "You asked your partner's grandmother. Now ask your partner (informal).", en: 'Do you have the umbrella?',
          answers: ["Hai l'ombrello?", "Tu hai l'ombrello?"],
          mistakes: {
            "Ha l'ombrello?": 'That is the Lei form. With tu, avere becomes hai.',
            'Hai lo ombrello?': "Before a vowel, lo shortens to l': l'ombrello.",
            'Hai il ombrello?': "il never goes before a vowel: l'ombrello.",
          },
          why: "Lei ha → tu hai. The article stays l': l'ombrello.",
        },

        // Rung 4: build from English
        {
          id: 'u2-l1-e22', type: 'build', reg: 'lei', rung: 4, ruleId: 'u2-r1',
          prompt: 'Translate: "Excuse me, where\'s the hotel?"', base: '(asking a passer-by)', en: "Excuse me, where's the hotel?",
          answers: [
            "Scusi, dov'è l'albergo?", "Mi scusi, dov'è l'albergo?", "Scusi, dove è l'albergo?",
            "Scusi, dov'è l'hotel?", "Mi scusi, dov'è l'hotel?", "Scusi, dove è l'hotel?",
          ],
          mistakes: {
            "Scusi, dov'è il albergo?": "albergo starts with a vowel, so l': l'albergo.",
            "Scusi, dov'è lo albergo?": "Before a vowel, lo shortens to l': l'albergo.",
            "Scusi, dov'è il hotel?": "h is silent in Italian, so hotel starts with a vowel sound: l'hotel.",
            "Scusi, dov'è lo hotel?": "h is silent, so lo shortens to l': l'hotel.",
            "Scusa, dov'è l'albergo?": 'scusa is for tu. To stop a stranger, say scusi.',
            "Scusa, dov'è l'hotel?": 'scusa is for tu. To stop a stranger, say scusi.',
          },
          why: WHY_L + ' scusi is how you stop a stranger politely.',
        },
        {
          id: 'u2-l1-e23', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r1',
          prompt: 'Translate: "The uncle arrives tomorrow."', base: '(telling your partner)', en: 'The uncle arrives tomorrow.',
          answers: ['Lo zio arriva domani.', 'Domani arriva lo zio.'],
          mistakes: {
            'Il zio arriva domani.': 'zio starts with z, so lo: lo zio.',
            'Domani arriva il zio.': 'zio starts with z, so lo: lo zio.',
          },
          why: WHY_LO,
        },
        {
          id: 'u2-l1-e24', type: 'build', reg: 'tu', rung: 4, ruleId: 'u2-r1',
          prompt: 'Translate: "Do you have the passport?"', base: '(to your partner, before leaving)', en: 'Do you have the passport?',
          answers: ['Hai il passaporto?', 'Tu hai il passaporto?', "Ce l'hai il passaporto?"],
          mistakes: {
            'Hai lo passaporto?': 'passaporto starts with p + vowel, a normal consonant: il passaporto.',
            'Ha il passaporto?': 'That is the Lei form. To your partner, use tu: hai.',
          },
          why: WHY_IL + ' To your partner, avere is hai.',
        },
        {
          id: 'u2-l1-e25', type: 'build', reg: 'lei', rung: 4, ruleId: 'u2-r1',
          prompt: 'Translate: "Do you have the train timetable?"', base: '(to the man at the ticket desk)', en: 'Do you have the train timetable?',
          answers: ["Ha l'orario dei treni?", "Lei ha l'orario dei treni?", "Scusi, ha l'orario dei treni?"],
          mistakes: {
            "Hai l'orario dei treni?": 'At the ticket desk you use Lei: ha, not hai.',
            'Ha lo orario dei treni?': "Before a vowel, lo shortens to l': l'orario.",
            'Ha il orario dei treni?': "il never goes before a vowel: l'orario.",
          },
          why: WHY_L + ' With a stranger, avere is ha (Lei).',
        },
        {
          id: 'u2-l1-e26', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r1',
          prompt: 'Translate: "I\'ll have the yogurt."', base: '(at breakfast in the hotel)', en: "I'll have the yogurt.",
          answers: ['Prendo lo yogurt.', 'Io prendo lo yogurt.'],
          mistakes: { 'Prendo il yogurt.': 'yogurt starts with y, and y takes lo: lo yogurt.' },
          why: WHY_LO + ' Italians order with prendo, "I\'ll take".',
        },
        {
          id: 'u2-l1-e38', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r1',
          prompt: 'Translate: "Where\'s the key?"', base: '(asking your partner)', en: "Where's the key?",
          answers: ["Dov'è la chiave?", 'Dove è la chiave?'],
          mistakes: {
            "Dov'è il chiave?": 'chiave is one of the feminine -e nouns: la chiave.',
            "Dov'è lo chiave?": 'chiave is feminine, and feminine words take la: la chiave.',
          },
          why: WHY_LA,
        },
        {
          id: 'u2-l1-e39', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r1',
          prompt: 'Translate: "The water is cold."', base: '(at the beach)', en: 'The water is cold.',
          answers: ["L'acqua è fredda."],
          mistakes: {
            'La acqua è fredda.': "Before a vowel, la shortens to l': l'acqua.",
            'Lo acqua è fredda.': "acqua is feminine, and before a vowel la shortens to l': l'acqua.",
          },
          why: WHY_LA_L,
        },

        // Rung 5: listen & type
        {
          id: 'u2-l1-e27', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r1',
          prompt: 'Lo zaino è pesante.', base: '', en: 'The backpack is heavy.',
          answers: ['Lo zaino è pesante.'],
          mistakes: { 'Il zaino è pesante.': 'You heard lo. zaino starts with z, so it is always lo zaino.' },
          why: WHY_LO,
        },
        {
          id: 'u2-l1-e28', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r1',
          prompt: "L'aereo parte alle otto.", base: '', en: 'The plane leaves at eight.',
          answers: ["L'aereo parte alle otto."],
          mistakes: {
            'Lo aereo parte alle otto.': "Before a vowel, lo shortens to l', said as one word: \"laereo\".",
            'Il aereo parte alle otto.': "il never goes before a vowel: l'aereo.",
          },
          why: WHY_L,
        },
        {
          id: 'u2-l1-e29', type: 'listen', reg: 'lei', rung: 5, ruleId: 'u2-r1',
          prompt: "Scusi, dov'è il bagno?", base: '', en: "Excuse me, where's the bathroom?",
          answers: ["Scusi, dov'è il bagno?", "Scusi, dove è il bagno?"],
          mistakes: {
            "Scusa, dov'è il bagno?": 'You heard scusi, the Lei form for strangers. scusa is for tu.',
            "Scusi, dov'è lo bagno?": 'bagno starts with b, a normal consonant: il bagno.',
          },
          why: WHY_IL + ' scusi is how you stop a stranger politely.',
        },
        {
          id: 'u2-l1-e30', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u2-r1',
          prompt: 'Hai visto lo zio?', base: '', en: 'Have you seen the uncle?',
          answers: ['Hai visto lo zio?'],
          mistakes: {
            'Hai visto il zio?': 'You heard lo. zio starts with z, so it is always lo zio.',
            'Ha visto lo zio?': 'You heard hai (it sounds like "eye"), the tu form. ha would be Lei.',
          },
          why: WHY_LO + ' (hai visto, "have you seen", is a past tense you will meet in Unit 12.)',
        },
        {
          id: 'u2-l1-e40', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r1',
          prompt: 'La zia arriva domani.', base: '', en: 'The aunt arrives tomorrow.',
          answers: ['La zia arriva domani.'],
          mistakes: { 'Lo zia arriva domani.': 'You heard la. zia is feminine, and feminine words take la before z too.' },
          why: WHY_LA,
        },
      ],
    },

    // ------------------------------------------------------------ the (plural)
    {
      id: 'u2-l2',
      title: 'i, gli, le',
      rules: [
        {
          id: 'u2-r2',
          title: 'i · gli · le',
          sentence: 'i treni · gli zaini · gli amici · le amiche',
          marks: [
            { word: 'i', kind: 'circle', color: 'pink' },
            { word: 'gli', kind: 'circle', color: 'pink' },
            { word: 'z', kind: 'underline', color: 'ultra' },
            { word: 'gli', kind: 'circle', color: 'pink' },
            { word: 'a', kind: 'underline', color: 'ultra' },
            { word: 'le', kind: 'circle', color: 'pink' },
          ],
          why: "In the plural, \"the\" has three forms, and the singular tells you which. Masculine words that take il take i. Masculine words that take lo or l' take gli. Every feminine word takes le, whatever sound it starts with.",
          table: {
            head: ['Singular', 'Plural', 'Example'],
            rows: [
              ['il', 'i', 'il treno → i treni'],
              ['lo', 'gli', 'lo zaino → gli zaini, lo studente → gli studenti'],
              ["l' (masculine)", 'gli', "l'amico → gli amici"],
              ['la', 'le', 'la casa → le case'],
              ["l' (feminine)", 'le', "l'amica → le amiche"],
            ],
            highlight: [1, 2],
          },
          careful: "l' doesn't tell you the plural: l'amico → gli amici, but l'amica → le amiche, so you need the gender. In modern Italian, le and gli don't shorten before a vowel: le amiche, gli italiani. And as in the singular, the article matches the next word: gli amici, but i vecchi amici.",
          howItaliansSayIt: {
            it: 'Come stanno gli zii?',
            en: 'How are your aunt and uncle?',
            note: 'gli zii is the aunt and uncle together: a mixed group takes the masculine plural. Italians often say "the" where English says "your": gli zii, i nonni.',
          },
        },
      ],
      examples: [
        { it: 'I treni per Roma sono in ritardo.', en: 'The trains to Rome are late.', reg: 'neutral' },
        { it: 'Gli zaini sono in macchina.', en: 'The backpacks are in the car.', reg: 'neutral' },
        { it: 'Gli amici di Marco arrivano alle otto.', en: "Marco's friends arrive at eight.", reg: 'neutral' },
        { it: 'Le amiche di Giulia sono simpatiche.', en: "Giulia's friends are nice.", reg: 'neutral' },
        { it: 'Gli studenti sono in vacanza.', en: 'The students are on holiday.', reg: 'neutral' },
        { it: 'Hai le chiavi?', en: 'Do you have the keys?', reg: 'tu' },
        { it: 'Scusi, dove sono i bagni?', en: 'Excuse me, where are the toilets?', reg: 'lei' },
        { it: 'Gli zii arrivano domani.', en: 'The aunt and uncle arrive tomorrow.', reg: 'neutral' },
        { it: 'Le zie di Marco abitano a Napoli.', en: "Marco's aunts live in Naples.", reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u2-l2-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r2',
          prompt: '___ treni per Roma sono in ritardo.', base: '"The trains to Rome are late."', en: 'The trains to Rome are late.',
          answers: ['I'], options: ['I', 'Gli', 'Le'],
          mistakes: {
            Gli: 'treno takes il in the singular, and il becomes i: i treni.',
            Le: 'le is the feminine plural. treno is masculine: i treni.',
          },
          why: WHY_I,
        },
        {
          id: 'u2-l2-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r2',
          prompt: '___ zaini sono in macchina.', base: '"The backpacks are in the car."', en: 'The backpacks are in the car.',
          answers: ['Gli'], options: ['I', 'Gli', 'Le'],
          mistakes: {
            I: 'zaino takes lo in the singular, so the plural is gli: gli zaini.',
            Le: 'le is the feminine plural. zaino is masculine: gli zaini.',
          },
          why: WHY_GLI,
        },
        {
          id: 'u2-l2-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r2',
          prompt: '___ amici di Marco arrivano alle otto.', base: '"Marco\'s friends arrive at eight."', en: "Marco's friends arrive at eight.",
          answers: ['Gli'], options: ['I', 'Gli', 'Le'],
          mistakes: {
            I: "amico takes l' in the singular, so the masculine plural is gli: gli amici.",
            Le: 'le is the feminine plural (le amiche). amici is masculine: gli amici.',
          },
          why: WHY_GLI,
        },
        {
          id: 'u2-l2-e04', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r2',
          prompt: '___ amiche di Giulia sono simpatiche.', base: '"Giulia\'s friends (all women) are nice."', en: "Giulia's friends are nice.",
          answers: ['Le'], options: ['Gli', 'Le', "L'"],
          mistakes: {
            Gli: 'gli is masculine. amiche is feminine, and every feminine plural takes le: le amiche.',
            "L'": "l' is singular only. In the plural, feminine words take le: le amiche.",
          },
          why: WHY_LE,
        },
        {
          id: 'u2-l2-e05', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u2-r2',
          prompt: 'Hai ___ biglietti?', base: '"Do you have the tickets?"', en: 'Do you have the tickets?',
          answers: ['i'], options: ['i', 'gli'],
          mistakes: { gli: 'biglietto takes il in the singular, so the plural takes i: i biglietti.' },
          why: WHY_I,
        },
        {
          id: 'u2-l2-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r2',
          prompt: '___ studenti sono in vacanza.', base: '"The students are on holiday."', en: 'The students are on holiday.',
          answers: ['Gli'], options: ['I', 'Gli', 'Le'],
          mistakes: {
            I: 'studente starts with s + consonant (lo studente), so the plural is gli: gli studenti.',
            Le: 'le is the feminine plural. studenti is masculine: gli studenti.',
          },
          why: WHY_GLI,
        },
        {
          id: 'u2-l2-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r2',
          prompt: 'Dove sono ___ chiavi?', base: '"Where are the keys?"', en: 'Where are the keys?',
          answers: ['le'], options: ['i', 'gli', 'le'],
          mistakes: {
            i: 'chiavi ends in -i, but it is feminine (la chiave), so le: le chiavi.',
            gli: 'gli is masculine. chiave is feminine, so le: le chiavi.',
          },
          why: WHY_LE,
        },
        {
          id: 'u2-l2-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r2',
          prompt: '___ zie di Marco abitano a Napoli.', base: '"Marco\'s aunts live in Naples."', en: "Marco's aunts live in Naples.",
          answers: ['Le'], options: ['Gli', 'Le'],
          mistakes: { Gli: 'gli zii are uncles (or aunt and uncle), but zie are aunts, feminine: le zie.' },
          why: WHY_LE,
        },

        // Rung 2: fill the gap
        {
          id: 'u2-l2-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r2',
          prompt: '___ zii arrivano domani.', base: '(the aunt and uncle)', en: 'The aunt and uncle arrive tomorrow.',
          answers: ['Gli'],
          mistakes: {
            i: 'zio takes lo in the singular, so the plural is gli: gli zii.',
            le: 'A mixed group takes the masculine plural: gli zii.',
            lo: 'lo is singular. The plural of lo zio is gli zii.',
          },
          why: WHY_GLI + ' ' + WHY_MIXED,
        },
        {
          id: 'u2-l2-e10', type: 'type', reg: 'lei', rung: 2, ruleId: 'u2-r2',
          prompt: 'Scusi, dove sono ___ bagni?', base: '(the toilets)', en: 'Excuse me, where are the toilets?',
          answers: ['i'],
          mistakes: {
            gli: 'bagno takes il in the singular, so the plural takes i: i bagni.',
            le: 'bagno is masculine: i bagni.',
          },
          why: WHY_I,
        },
        {
          id: 'u2-l2-e11', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r2',
          prompt: 'Mi piacciono ___ spaghetti alle vongole.', base: '(the spaghetti)', en: 'I like spaghetti with clams.',
          answers: ['gli'],
          mistakes: { i: 'spaghetti starts with s + consonant, so gli: gli spaghetti.' },
          why: WHY_GLI,
        },
        {
          id: 'u2-l2-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r2',
          prompt: 'Ecco ___ orari dei treni.', base: '(the timetables)', en: 'Here are the train timetables.',
          answers: ['gli'],
          mistakes: {
            i: "orario starts with a vowel (l'orario), so the plural is gli: gli orari.",
            le: 'orario is masculine: gli orari.',
            "l'": "l' is singular only. The plural of l'orario is gli orari.",
          },
          why: WHY_GLI,
        },
        {
          id: 'u2-l2-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r2',
          prompt: '___ olive sono buonissime.', base: '(the olives)', en: 'The olives are delicious.',
          answers: ['Le'],
          mistakes: {
            gli: "oliva is feminine (l'oliva), so the plural is le: le olive.",
            "l'": "l' is singular only. In the plural it is le: le olive.",
          },
          why: WHY_LE,
        },
        {
          id: 'u2-l2-e14', type: 'type', reg: 'tu', rung: 2, ruleId: 'u2-r2',
          prompt: 'Hai ___ occhiali?', base: '(the glasses)', en: 'Do you have your glasses?',
          answers: ['gli'],
          mistakes: {
            i: 'occhiali starts with a vowel, so the masculine plural is gli: gli occhiali.',
            le: 'occhiali is masculine: gli occhiali.',
          },
          why: WHY_GLI,
        },
        {
          id: 'u2-l2-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r2',
          prompt: '___ nonni di Giulia abitano in campagna.', base: '(the grandparents)', en: "Giulia's grandparents live in the countryside.",
          answers: ['I'],
          mistakes: {
            gli: 'nonno takes il in the singular, so the plural takes i: i nonni.',
            le: 'A mixed group (grandpa and grandma) takes the masculine plural: i nonni.',
          },
          why: WHY_I + ' ' + WHY_MIXED,
        },
        {
          id: 'u2-l2-e16', type: 'type', reg: 'tu', rung: 2, ruleId: 'u2-r2',
          prompt: 'Ti piacciono ___ gnocchi?', base: '(the gnocchi)', en: 'Do you like gnocchi?',
          answers: ['gli'],
          mistakes: { i: 'gnocchi starts with gn (lo gnocco), so the plural is gli: gli gnocchi.' },
          why: WHY_GLI,
        },

        // Rung 3: transform
        {
          id: 'u2-l2-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r2',
          prompt: 'Ecco il biglietto.', base: 'Make it plural (biglietti).', en: 'Here are the tickets.',
          answers: ['Ecco i biglietti.'],
          mistakes: {
            'Ecco gli biglietti.': 'il becomes i, not gli: i biglietti.',
            'Ecco il biglietti.': 'il is singular. In the plural it becomes i: i biglietti.',
          },
          why: WHY_I,
        },
        {
          id: 'u2-l2-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r2',
          prompt: 'Lo zaino è pesante.', base: 'Make it plural: zaini, pesanti, sono.', en: 'The backpacks are heavy.',
          answers: ['Gli zaini sono pesanti.'],
          mistakes: {
            'I zaini sono pesanti.': 'zaino takes lo, so the plural is gli: gli zaini.',
            'Lo zaini sono pesanti.': 'lo is singular. In the plural it becomes gli: gli zaini.',
          },
          why: WHY_GLI,
        },
        {
          id: 'u2-l2-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r2',
          prompt: "L'amico di Marco è simpatico.", base: 'Make it plural: amici, simpatici, sono.', en: "Marco's friends are nice.",
          answers: ['Gli amici di Marco sono simpatici.'],
          mistakes: {
            "L'amici di Marco sono simpatici.": "l' is singular only. Masculine l' becomes gli: gli amici.",
            'I amici di Marco sono simpatici.': 'amici starts with a vowel, so the masculine plural is gli: gli amici.',
            'Gli amichi di Marco sono simpatici.': 'amico is one of the exceptions with a soft c in the plural: amici.',
          },
          why: WHY_GLI,
        },
        {
          id: 'u2-l2-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r2',
          prompt: "L'amica di Giulia è simpatica.", base: 'Make it plural: amiche, simpatiche, sono.', en: "Giulia's friends are nice.",
          answers: ['Le amiche di Giulia sono simpatiche.'],
          mistakes: {
            'Gli amiche di Giulia sono simpatiche.': 'amica is feminine, so le: le amiche.',
            "L'amiche di Giulia sono simpatiche.": "Modern Italian doesn't shorten le: le amiche.",
            'Le amice di Giulia sono simpatiche.': 'amica keeps its hard c in the plural: amiche.',
            'Le amiche di Giulia sono simpatice.': 'simpatica keeps its hard c in the plural: simpatiche.',
          },
          why: WHY_LE,
        },
        {
          id: 'u2-l2-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r2',
          prompt: 'Lo studente arriva domani.', base: 'Make it plural: studenti, arrivano.', en: 'The students arrive tomorrow.',
          answers: ['Gli studenti arrivano domani.'],
          mistakes: {
            'I studenti arrivano domani.': 'studente takes lo (s + consonant), so the plural is gli: gli studenti.',
            'Lo studenti arrivano domani.': 'lo is singular. In the plural it becomes gli: gli studenti.',
          },
          why: WHY_GLI,
        },
        {
          id: 'u2-l2-e22', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r2',
          prompt: 'La camera è pronta.', base: 'Make it plural: camere, pronte, sono.', en: 'The rooms are ready.',
          answers: ['Le camere sono pronte.'],
          mistakes: { 'La camere sono pronte.': 'la is singular. In the plural it becomes le: le camere.' },
          why: WHY_LE,
        },

        // Rung 3: switch register
        {
          id: 'u2-l2-e23', type: 'register', reg: 'lei', rung: 3, ruleId: 'u2-r2',
          prompt: 'Hai i biglietti?', base: "You asked your partner about the concert tickets. Now ask their father (formal).", en: 'Do you have the tickets?',
          answers: ['Ha i biglietti?', 'Lei ha i biglietti?'],
          mistakes: {
            'Hai i biglietti?': 'That is still the tu form. For Lei, avere becomes ha.',
            'Ha gli biglietti?': 'Right verb, but biglietto takes il, so the plural is i: i biglietti.',
          },
          why: 'tu hai → Lei ha. The article stays i: i biglietti.',
        },
        {
          id: 'u2-l2-e24', type: 'register', reg: 'tu', rung: 3, ruleId: 'u2-r2',
          prompt: 'Prende gli gnocchi?', base: "You asked your partner's grandmother at the restaurant. Now ask your partner (informal).", en: 'Are you having the gnocchi?',
          answers: ['Prendi gli gnocchi?', 'Tu prendi gli gnocchi?'],
          mistakes: {
            'Prende gli gnocchi?': 'That is the Lei form. With tu, prende becomes prendi.',
            'Prendi i gnocchi?': 'Right verb, but gnocco takes lo, so the plural is gli: gli gnocchi.',
            'Prendi gli gnocci?': 'gnocco keeps its hard c in the plural: gnocchi.',
          },
          why: 'Lei prende → tu prendi. The article stays gli: gli gnocchi.',
        },

        // Rung 4: build from English
        {
          id: 'u2-l2-e25', type: 'build', reg: 'lei', rung: 4, ruleId: 'u2-r2',
          prompt: 'Translate: "Excuse me, where are the lifts?"', base: '(asking the hotel receptionist)', en: 'Excuse me, where are the lifts?',
          answers: ['Scusi, dove sono gli ascensori?', 'Mi scusi, dove sono gli ascensori?'],
          mistakes: {
            'Scusi, dove sono i ascensori?': "ascensore starts with a vowel (l'ascensore), so the plural is gli: gli ascensori.",
            'Scusi, dove sono le ascensori?': 'ascensore is masculine: gli ascensori.',
            'Scusa, dove sono gli ascensori?': 'scusa is for tu. At the reception desk, say scusi.',
          },
          why: WHY_GLI + ' scusi is the Lei form.',
        },
        {
          id: 'u2-l2-e26', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r2',
          prompt: 'Translate: "The aunt and uncle arrive tomorrow."', base: '(telling your partner)', en: 'The aunt and uncle arrive tomorrow.',
          answers: ['Gli zii arrivano domani.', 'Domani arrivano gli zii.'],
          mistakes: {
            'I zii arrivano domani.': 'zio takes lo, so the plural is gli: gli zii.',
            'Domani arrivano i zii.': 'zio takes lo, so the plural is gli: gli zii.',
          },
          why: WHY_GLI + ' ' + WHY_MIXED,
        },
        {
          id: 'u2-l2-e27', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r2',
          prompt: 'Translate: "Giulia\'s friends are nice."', base: '(her friends are all women)', en: "Giulia's friends are nice.",
          answers: ['Le amiche di Giulia sono simpatiche.'],
          mistakes: {
            'Gli amiche di Giulia sono simpatiche.': 'amiche is feminine, so le: le amiche.',
            "L'amiche di Giulia sono simpatiche.": "Modern Italian doesn't shorten le: le amiche.",
            'Le amice di Giulia sono simpatiche.': 'amica keeps its hard c in the plural: amiche.',
            'Le amiche di Giulia sono simpatice.': 'simpatica keeps its hard c in the plural: simpatiche.',
          },
          why: WHY_LE,
        },
        {
          id: 'u2-l2-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r2',
          prompt: 'Translate: "The students are on holiday."', base: '(about the students at the language school)', en: 'The students are on holiday.',
          answers: ['Gli studenti sono in vacanza.'],
          mistakes: { 'I studenti sono in vacanza.': 'studente takes lo, so the plural is gli: gli studenti.' },
          why: WHY_GLI,
        },
        {
          id: 'u2-l2-e29', type: 'build', reg: 'tu', rung: 4, ruleId: 'u2-r2',
          prompt: 'Translate: "Do you have the keys?"', base: '(to your partner, at the front door)', en: 'Do you have the keys?',
          answers: ['Hai le chiavi?', 'Tu hai le chiavi?'],
          mistakes: {
            'Hai i chiavi?': 'chiavi ends in -i, but it is feminine (la chiave): le chiavi.',
            'Hai gli chiavi?': 'gli is masculine. chiave is feminine: le chiavi.',
            'Ha le chiavi?': 'That is the Lei form. To your partner, use tu: hai.',
          },
          why: WHY_LE,
        },
        {
          id: 'u2-l2-e30', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r2',
          prompt: 'Translate: "The grandparents live in the countryside."', base: "(about Giulia's grandma and grandpa)", en: 'The grandparents live in the countryside.',
          answers: ['I nonni abitano in campagna.', 'I nonni vivono in campagna.'],
          mistakes: {
            'Gli nonni abitano in campagna.': 'nonno takes il, so the plural is i: i nonni.',
            'Le nonne abitano in campagna.': 'le nonne are grandmothers only. Grandma and grandpa together are i nonni.',
          },
          why: WHY_I + ' ' + WHY_MIXED,
        },

        // Rung 5: listen & type
        {
          id: 'u2-l2-e31', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r2',
          prompt: 'Gli zii arrivano stasera.', base: '', en: 'The aunt and uncle arrive tonight.',
          answers: ['Gli zii arrivano stasera.'],
          mistakes: { 'I zii arrivano stasera.': 'You heard gli ("lyee"): zio takes lo, so the plural is gli zii.' },
          why: WHY_GLI,
        },
        {
          id: 'u2-l2-e32', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r2',
          prompt: 'Le amiche di Giulia sono qui.', base: '', en: "Giulia's friends are here.",
          answers: ['Le amiche di Giulia sono qui.'],
          mistakes: {
            "L'amiche di Giulia sono qui.": 'You heard le, a separate word: modern Italian doesn\'t shorten le.',
            'Le amice di Giulia sono qui.': 'You heard a hard c, "k": amiche.',
          },
          why: WHY_LE,
        },
        {
          id: 'u2-l2-e33', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r2',
          prompt: 'Mi piacciono gli spaghetti.', base: '', en: 'I like spaghetti.',
          answers: ['Mi piacciono gli spaghetti.'],
          mistakes: { 'Mi piacciono i spaghetti.': 'You heard gli: spaghetti starts with s + consonant, so gli.' },
          why: WHY_GLI,
        },
        {
          id: 'u2-l2-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r2',
          prompt: 'I treni sono in ritardo.', base: '', en: 'The trains are late.',
          answers: ['I treni sono in ritardo.'],
          mistakes: { 'Gli treni sono in ritardo.': 'You heard i: treno takes il, so the plural is i treni.' },
          why: WHY_I,
        },
      ],
    },

    // ------------------------------------------------------------ a / an
    {
      id: 'u2-l3',
      title: "un, uno, una, un'",
      rules: [
        {
          id: 'u2-r3',
          title: "un · uno · una · un'",
          sentence: "un amico · un'amica · uno zaino",
          marks: [
            { word: 'un', kind: 'circle', color: 'pink' },
            { word: "un'", kind: 'circle', color: 'pink' },
            { word: 'uno', kind: 'circle', color: 'pink' },
            { word: 'z', kind: 'underline', color: 'ultra' },
          ],
          why: "\"A\" follows the same sounds as \"the\". Masculine words take un, or uno where \"the\" would be lo (s + consonant, z, gn, ps, x, y). Feminine words take una, which shortens to un' before a vowel. Masculine un never takes an apostrophe: un amico, but un'amica.",
          table: {
            head: ['Article', 'Before', 'Example'],
            rows: [
              ['un', 'masculine: most consonants, and vowels', 'un treno, un amico'],
              ['uno', 'masculine: s + consonant, z, gn, ps, x, y', 'uno zaino, uno studente'],
              ['una', 'feminine: any consonant', 'una pizza, una zia'],
              ["un'", 'feminine: a vowel', "un'amica, un'ora"],
            ],
            highlight: [3],
          },
          careful: "The apostrophe marks the feminine. un is a whole word, so before a vowel it stays un: un amico. una loses its a, so it gets the apostrophe: un'amica. You can't hear the apostrophe (un amica and un'amica sound the same), so it is a writing mistake worth watching for.",
          howItaliansSayIt: {
            it: "Un caffè e un'aranciata, per favore.",
            en: 'A coffee and an orange soda, please.',
            note: "Ordering is where you'll use \"a\" most: un caffè, uno spritz, una birra, un'aranciata. Say un' and its word as one: \"unaranciata\".",
          },
        },
      ],
      examples: [
        { it: 'Luca è un amico di Marco.', en: "Luca is a friend of Marco's.", reg: 'neutral' },
        { it: "Sara è un'amica dell'università.", en: 'Sara is a friend from university.', reg: 'neutral' },
        { it: "C'è uno sciopero dei treni domani.", en: "There's a train strike tomorrow.", reg: 'neutral' },
        { it: "Il treno parte tra un'ora.", en: 'The train leaves in an hour.', reg: 'neutral' },
        { it: 'Prendo uno spritz e una pizza.', en: "I'll have a spritz and a pizza.", reg: 'neutral' },
        { it: 'Hai uno zaino in più?', en: 'Do you have a spare backpack?', reg: 'tu' },
        { it: "Scusi, c'è un bagno qui?", en: 'Excuse me, is there a bathroom here?', reg: 'lei' },
        { it: 'Vorrei una camera per due notti.', en: "I'd like a room for two nights.", reg: 'neutral' },
        { it: 'Giulia ha uno zio a Milano.', en: 'Giulia has an uncle in Milan.', reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u2-l3-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r3',
          prompt: 'Luca è ___ amico di Marco.', base: '"Luca is a friend of Marco\'s."', en: "Luca is a friend of Marco's.",
          answers: ['un'], options: ['un', "un'", 'uno'],
          mistakes: {
            "un'": 'amico is masculine, and masculine un never takes an apostrophe: un amico.',
            uno: "uno goes where \"the\" would be lo. amico takes l' (lo shortened), and \"a\" is un: un amico.",
          },
          why: WHY_UN,
        },
        {
          id: 'u2-l3-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r3',
          prompt: "Sara è ___ amica dell'università.", base: '"Sara is a friend from university."', en: 'Sara is a friend from university.',
          answers: ["un'"], options: ['un', "un'", 'una'],
          mistakes: {
            un: "un without an apostrophe is masculine (un amico). amica is feminine: un'amica.",
            una: "Before a vowel, una shortens to un': un'amica.",
          },
          why: WHY_UN_AP,
        },
        {
          id: 'u2-l3-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r3',
          prompt: "C'è ___ sciopero dei treni domani.", base: '"There\'s a train strike tomorrow."', en: "There's a train strike tomorrow.",
          answers: ['uno'], options: ['un', 'uno', 'una'],
          mistakes: {
            un: 'sciopero starts with s + consonant (lo sciopero), so "a" is uno: uno sciopero.',
            una: 'sciopero ends in -o and is masculine: uno sciopero.',
          },
          why: WHY_UNO,
        },
        {
          id: 'u2-l3-e04', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r3',
          prompt: 'Prendo ___ pizza margherita.', base: '"I\'ll have a margherita pizza."', en: "I'll have a margherita pizza.",
          answers: ['una'], options: ['un', 'una', "un'"],
          mistakes: {
            un: 'un is masculine. pizza is feminine: una pizza.',
            "un'": "un' is for feminine words before a vowel. pizza starts with p: una pizza.",
          },
          why: WHY_UNA,
        },
        {
          id: 'u2-l3-e05', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u2-r3',
          prompt: 'Hai ___ zaino in più?', base: '"Do you have a spare backpack?"', en: 'Do you have a spare backpack?',
          answers: ['uno'], options: ['un', 'uno'],
          mistakes: { un: 'zaino starts with z (lo zaino), so uno: uno zaino.' },
          why: WHY_UNO,
        },
        {
          id: 'u2-l3-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r3',
          prompt: 'Ho ___ idea!', base: '"I\'ve got an idea!"', en: "I've got an idea!",
          answers: ["un'"], options: ['un', 'una', "un'"],
          mistakes: {
            un: "idea is feminine, so it needs the apostrophe: un'idea.",
            una: "Before a vowel, una shortens to un': un'idea.",
          },
          why: WHY_UN_AP,
        },
        {
          id: 'u2-l3-e07', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u2-r3',
          prompt: "Scusi, c'è ___ bagno qui?", base: '"Excuse me, is there a bathroom here?"', en: 'Excuse me, is there a bathroom here?',
          answers: ['un'], options: ['un', 'uno'],
          mistakes: { uno: 'bagno starts with b (il bagno), so un: un bagno.' },
          why: WHY_UN,
        },
        {
          id: 'u2-l3-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r3',
          prompt: 'Giulia ha ___ zia a Napoli.', base: '"Giulia has an aunt in Naples."', en: 'Giulia has an aunt in Naples.',
          answers: ['una'], options: ['uno', 'una', "un'"],
          mistakes: {
            uno: 'uno is masculine (uno zio). zia is feminine, and feminine words take una before z too: una zia.',
            "un'": "un' is only before a vowel. zia starts with z: una zia.",
          },
          why: WHY_UNA,
        },

        // Rung 2: fill the gap
        {
          id: 'u2-l3-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r3',
          prompt: 'Prendo ___ spritz, grazie.', base: '(a)', en: "I'll have a spritz, thanks.",
          answers: ['uno'],
          mistakes: { un: 'spritz starts with s + consonant (lo spritz), so uno: uno spritz.' },
          why: WHY_UNO,
        },
        {
          id: 'u2-l3-e10', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r3',
          prompt: 'Mi serve ___ penna.', base: '(a)', en: 'I need a pen.',
          answers: ['una'],
          mistakes: {
            un: 'penna ends in -a and is feminine: una penna.',
            "un'": "un' is only before a vowel. penna starts with p: una penna.",
          },
          why: WHY_UNA,
        },
        {
          id: 'u2-l3-e11', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r3',
          prompt: "C'è ___ albergo vicino alla stazione?", base: '(a)', en: 'Is there a hotel near the station?',
          answers: ['un'],
          mistakes: {
            "un'": 'albergo is masculine, so no apostrophe: un albergo.',
            uno: "albergo starts with a vowel (l'albergo), so \"a\" is un: un albergo.",
            una: 'albergo ends in -o and is masculine: un albergo.',
          },
          why: WHY_UN,
        },
        {
          id: 'u2-l3-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r3',
          prompt: 'È ___ ottima idea!', base: '(a)', en: "That's a great idea!",
          answers: ["un'"],
          mistakes: {
            una: "Before a vowel, una shortens to un'. The next word is ottima, so un'ottima idea.",
            un: "idea is feminine, so un' needs its apostrophe: un'ottima idea.",
          },
          why: "The article matches the word right after it, here ottima. " + WHY_UN_AP,
        },
        {
          id: 'u2-l3-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r3',
          prompt: 'Aspetto ___ amico.', base: '(a, a male friend)', en: "I'm waiting for a friend.",
          answers: ['un'],
          mistakes: {
            "un'": 'amico is masculine, and un never takes an apostrophe: un amico.',
            uno: "amico starts with a vowel (l'amico), so \"a\" is un: un amico.",
          },
          why: WHY_UN,
        },
        {
          id: 'u2-l3-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r3',
          prompt: 'Aspetto ___ amica.', base: '(a, a female friend)', en: "I'm waiting for a friend.",
          answers: ["un'"],
          mistakes: {
            un: "Without an apostrophe, un is masculine. amica is feminine: un'amica.",
            una: "Before a vowel, una shortens to un': un'amica.",
          },
          why: WHY_UN_AP,
        },
        {
          id: 'u2-l3-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r3',
          prompt: 'Prendiamo ___ yogurt?', base: '(a)', en: 'Shall we get a yogurt?',
          answers: ['uno'],
          mistakes: { un: 'yogurt starts with y (lo yogurt), so uno: uno yogurt.' },
          why: WHY_UNO,
        },
        {
          id: 'u2-l3-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r3',
          prompt: "In classe c'è ___ studente nuovo.", base: '(a)', en: "There's a new student in the class.",
          answers: ['uno'],
          mistakes: { un: 'studente starts with s + consonant (lo studente), so uno: uno studente.' },
          why: WHY_UNO,
        },

        // Rung 3: transform
        {
          id: 'u2-l3-e17', type: 'transform', reg: 'tu', rung: 3, ruleId: 'u2-r3',
          prompt: 'Hai lo zaino?', base: 'Ask for "a" backpack instead of "the" backpack.', en: 'Do you have a backpack?',
          answers: ['Hai uno zaino?', 'Tu hai uno zaino?'],
          mistakes: { 'Hai un zaino?': 'zaino takes lo, so "a" is uno: uno zaino.' },
          why: 'lo becomes uno. ' + WHY_UNO,
        },
        {
          id: 'u2-l3-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r3',
          prompt: "Prendo l'aranciata.", base: 'Order "an" orange soda instead of "the" orange soda.', en: "I'll have an orange soda.",
          answers: ["Prendo un'aranciata."],
          mistakes: {
            'Prendo un aranciata.': "aranciata is feminine, so un' needs its apostrophe: un'aranciata.",
            'Prendo una aranciata.': "Before a vowel, una shortens to un': un'aranciata.",
          },
          why: WHY_UN_AP,
        },
        {
          id: 'u2-l3-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r3',
          prompt: "L'amico di Marco arriva domani.", base: 'Make it "a friend of Marco\'s".', en: "A friend of Marco's arrives tomorrow.",
          answers: ['Un amico di Marco arriva domani.'],
          mistakes: {
            "Un'amico di Marco arriva domani.": 'amico is masculine, and un never takes an apostrophe: un amico.',
            'Uno amico di Marco arriva domani.': "amico takes l', and \"a\" is un: un amico.",
          },
          why: WHY_UN,
        },
        {
          id: 'u2-l3-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r3',
          prompt: 'Giulia ha uno zio a Roma.', base: 'Now it is an aunt (zia).', en: 'Giulia has an aunt in Rome.',
          answers: ['Giulia ha una zia a Roma.'],
          mistakes: { 'Giulia ha uno zia a Roma.': 'uno is masculine. zia is feminine, and feminine words take una before z too: una zia.' },
          why: WHY_UNA,
        },
        {
          id: 'u2-l3-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r3',
          prompt: 'Marco ha un amico a Bologna.', base: 'Now it is a female friend (amica).', en: 'Marco has a friend in Bologna.',
          answers: ["Marco ha un'amica a Bologna."],
          mistakes: {
            'Marco ha un amica a Bologna.': "Without the apostrophe, un is masculine. amica needs un': un'amica.",
            'Marco ha una amica a Bologna.': "Before a vowel, una shortens to un': un'amica.",
          },
          why: WHY_UN_AP,
        },
        {
          id: 'u2-l3-e22', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r3',
          prompt: 'Un caffè, per favore.', base: 'Order a spritz instead (spritz).', en: 'A spritz, please.',
          answers: ['Uno spritz, per favore.', 'Uno spritz, per piacere.'],
          mistakes: { 'Un spritz, per favore.': 'spritz starts with s + consonant, so uno: uno spritz.' },
          why: WHY_UNO,
        },

        // Rung 3: switch register
        {
          id: 'u2-l3-e23', type: 'register', reg: 'tu', rung: 3, ruleId: 'u2-r3',
          prompt: 'Ha un minuto?', base: "You asked a neighbour. Now ask your partner's brother (informal).", en: 'Do you have a minute?',
          answers: ['Hai un minuto?', 'Tu hai un minuto?'],
          mistakes: {
            'Ha un minuto?': 'That is the Lei form. With tu, avere becomes hai.',
            'Hai uno minuto?': 'minuto starts with m (il minuto), so un: un minuto.',
          },
          why: 'Lei ha → tu hai. The article stays un: un minuto.',
        },
        {
          id: 'u2-l3-e24', type: 'register', reg: 'lei', rung: 3, ruleId: 'u2-r3',
          prompt: 'Hai un ombrello?', base: 'You asked your partner. Now ask the hotel receptionist (formal).', en: 'Do you have an umbrella?',
          answers: ['Ha un ombrello?', 'Lei ha un ombrello?', 'Scusi, ha un ombrello?'],
          mistakes: {
            'Hai un ombrello?': 'That is still the tu form. For Lei, avere becomes ha.',
            "Ha un'ombrello?": 'ombrello is masculine, so no apostrophe: un ombrello.',
          },
          why: 'tu hai → Lei ha. The article stays un: un ombrello.',
        },

        // Rung 4: build from English
        {
          id: 'u2-l3-e25', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r3',
          prompt: 'Translate: "A coffee and an orange soda, please."', base: '(at the bar)', en: 'A coffee and an orange soda, please.',
          answers: ["Un caffè e un'aranciata, per favore.", "Un caffè e un'aranciata, per piacere."],
          mistakes: {
            'Un caffè e un aranciata, per favore.': "aranciata is feminine, so un' needs its apostrophe: un'aranciata.",
            'Un caffè e una aranciata, per favore.': "Before a vowel, una shortens to un': un'aranciata.",
            "Un caffè è un'aranciata, per favore.": 'è means "is". "and" is e, without an accent.',
          },
          why: WHY_UN + ' ' + WHY_UN_AP,
        },
        {
          id: 'u2-l3-e26', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r3',
          prompt: 'Translate: "Luca is a friend of Marco\'s."', base: '(introducing Luca to your partner)', en: "Luca is a friend of Marco's.",
          answers: ['Luca è un amico di Marco.'],
          mistakes: {
            "Luca è un'amico di Marco.": 'amico is masculine, and un never takes an apostrophe: un amico.',
            'Luca è uno amico di Marco.': "amico takes l', and \"a\" is un: un amico.",
          },
          why: WHY_UN,
        },
        {
          id: 'u2-l3-e27', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r3',
          prompt: 'Translate: "I\'d like a room for two nights."', base: '(at the hotel reception)', en: "I'd like a room for two nights.",
          answers: ['Vorrei una camera per due notti.', 'Vorrei una stanza per due notti.'],
          mistakes: { 'Vorrei un camera per due notti.': 'camera ends in -a and is feminine: una camera.' },
          why: WHY_UNA + ' Vorrei, "I\'d like", is the polite way to ask.',
        },
        {
          id: 'u2-l3-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r3',
          prompt: 'Translate: "Giulia has an uncle in Milan."', base: '(telling a friend)', en: 'Giulia has an uncle in Milan.',
          answers: ['Giulia ha uno zio a Milano.'],
          mistakes: { 'Giulia ha un zio a Milano.': 'zio starts with z (lo zio), so uno: uno zio.' },
          why: WHY_UNO,
        },
        {
          id: 'u2-l3-e29', type: 'build', reg: 'lei', rung: 4, ruleId: 'u2-r3',
          prompt: 'Translate: "Excuse me, is there a pharmacy near here?"', base: '(asking a passer-by)', en: 'Excuse me, is there a pharmacy near here?',
          answers: ["Scusi, c'è una farmacia qui vicino?", "Mi scusi, c'è una farmacia qui vicino?"],
          mistakes: {
            "Scusi, c'è un farmacia qui vicino?": 'farmacia ends in -a and is feminine: una farmacia.',
            "Scusa, c'è una farmacia qui vicino?": 'scusa is for tu. To stop a stranger, say scusi.',
          },
          why: WHY_UNA + " c'è means \"there is\".",
        },
        {
          id: 'u2-l3-e30', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r3',
          prompt: 'Translate: "The train leaves in an hour."', base: '(on the platform)', en: 'The train leaves in an hour.',
          answers: ["Il treno parte tra un'ora.", "Il treno parte fra un'ora."],
          mistakes: {
            'Il treno parte tra un ora.': "ora (hour) is feminine, so un' needs its apostrophe: un'ora.",
            'Il treno parte tra una ora.': "Before a vowel, una shortens to un': un'ora.",
          },
          why: WHY_UN_AP + ' tra means "in" for time from now.',
        },

        // Rung 5: listen & type
        {
          id: 'u2-l3-e31', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r3',
          prompt: 'Prendo uno spritz.', base: '', en: "I'll have a spritz.",
          answers: ['Prendo uno spritz.'],
          mistakes: { 'Prendo un spritz.': 'You heard uno: spritz starts with s + consonant, so uno.' },
          why: WHY_UNO,
        },
        {
          id: 'u2-l3-e32', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r3',
          prompt: "C'è uno sciopero domani.", base: '', en: "There's a strike tomorrow.",
          answers: ["C'è uno sciopero domani."],
          mistakes: { "C'è un sciopero domani.": 'You heard uno: sciopero starts with s + consonant, so uno.' },
          why: WHY_UNO,
        },
        {
          id: 'u2-l3-e33', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r3',
          prompt: 'Giulia ha una zia a Napoli.', base: '', en: 'Giulia has an aunt in Naples.',
          answers: ['Giulia ha una zia a Napoli.'],
          mistakes: { 'Giulia ha uno zia a Napoli.': 'You heard una: zia is feminine, and feminine words take una before z too.' },
          why: WHY_UNA,
        },
        {
          id: 'u2-l3-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r3',
          prompt: 'Aspetto un amico.', base: '', en: "I'm waiting for a friend.",
          answers: ['Aspetto un amico.'],
          mistakes: { "Aspetto un'amico.": 'You heard amico, a man, and un never takes an apostrophe: un amico.' },
          why: WHY_UN,
        },
        {
          id: 'u2-l3-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r3',
          prompt: "Aspetto un'amica.", base: '', en: "I'm waiting for a friend (a woman).",
          answers: ["Aspetto un'amica."],
          mistakes: { 'Aspetto un amica.': "You heard amica, a woman, so un' needs its apostrophe: un'amica." },
          why: WHY_UN_AP,
        },
      ],
    },

    // ------------------------------------------------------------ days and titles
    {
      id: 'u2-l4',
      title: 'Days and titles',
      rules: [
        {
          id: 'u2-r4',
          title: 'il lunedì · il signor Rossi',
          sentence: 'Il lunedì il signor Rossi è in ufficio.',
          marks: [
            { word: 'Il', kind: 'circle', color: 'pink' },
            { word: 'il', kind: 'circle', color: 'pink' },
            { word: 'signor', kind: 'underline', color: 'ultra' },
          ],
          why: 'Italian uses the article in two places where English doesn\'t. With a day of the week, il means "every week": il lunedì is "on Mondays", while lunedì alone is one particular Monday, usually the coming one. And titles such as signore, signora and dottore take the article when you talk about someone (il signor Rossi, la signora Bianchi), but not when you speak to them (Buongiorno, signor Rossi!).',
          table: {
            head: ['Say', 'Meaning', 'Example'],
            rows: [
              ['il lunedì', 'on Mondays, every week', 'Il lunedì lavoro da casa.'],
              ['lunedì', 'on Monday, one particular day', 'Lunedì arriva la nonna.'],
              ['la domenica', 'on Sundays (domenica is feminine)', 'La domenica dormo fino a tardi.'],
              ['il signor Rossi, la signora Bianchi', 'talking about them', 'Il signor Rossi abita qui accanto.'],
              ['signor Rossi, signora', 'talking to them', 'Buongiorno, signor Rossi!'],
            ],
            highlight: [0, 3],
          },
          careful: 'Before a name, signore drops its final e: il signore (the gentleman), but il signor Rossi. dottore and professore do the same: il dottor Neri, Buongiorno, professor Conti! Without a name, they keep the e: Buongiorno, dottore! And domenica is the one feminine day: la domenica. (You will also hear di lunedì for "on Mondays": same meaning.)',
          howItaliansSayIt: {
            it: 'Buonasera, signora!',
            en: 'Good evening!',
            note: 'Italians greet an older woman or a stranger with signora alone, no name and no article. It sounds warm and polite, not stiff. For a man without a name it is signore, with its e: Buonasera, signore!',
          },
        },
      ],
      examples: [
        { it: 'Il lunedì lavoro da casa.', en: 'On Mondays I work from home.', reg: 'neutral' },
        { it: 'Lunedì arriva la nonna.', en: 'Grandma arrives on Monday.', reg: 'neutral' },
        { it: 'La domenica dormo fino a tardi.', en: 'On Sundays I sleep in.', reg: 'neutral' },
        { it: 'Il sabato andiamo al mercato.', en: 'On Saturdays we go to the market.', reg: 'neutral' },
        { it: 'Il signor Rossi abita qui accanto.', en: 'Mr Rossi lives next door.', reg: 'neutral' },
        { it: 'Buongiorno, signor Rossi! Come sta?', en: 'Good morning, Mr Rossi! How are you?', reg: 'lei' },
        { it: 'La signora Bianchi è molto gentile.', en: 'Mrs Bianchi is very kind.', reg: 'neutral' },
        { it: 'Scusi, signora, è libero?', en: 'Excuse me, is this seat free?', reg: 'lei' },
        { it: 'Il dottor Neri lavora il martedì.', en: 'Dr Neri works on Tuesdays.', reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u2-l4-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r4',
          prompt: '___ vado in palestra.', base: '"On Mondays I go to the gym."', en: 'On Mondays I go to the gym.',
          answers: ['Il lunedì'], options: ['Il lunedì', 'Lunedì'],
          mistakes: { 'Lunedì': 'lunedì alone is one particular Monday. Every Monday is il lunedì.' },
          why: WHY_DAY,
        },
        {
          id: 'u2-l4-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r4',
          prompt: '___ arriva la nonna.', base: '"Grandma arrives on Monday." (this coming Monday)', en: 'Grandma arrives on Monday.',
          answers: ['Lunedì'], options: ['Il lunedì', 'Lunedì'],
          mistakes: { 'Il lunedì': 'il lunedì means every Monday. For one particular Monday, just lunedì.' },
          why: WHY_DAY,
        },
        {
          id: 'u2-l4-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r4',
          prompt: '___ dormo fino a tardi.', base: '"On Sundays I sleep in."', en: 'On Sundays I sleep in.',
          answers: ['La domenica'], options: ['Il domenica', 'La domenica', 'Domenica'],
          mistakes: {
            'Il domenica': 'domenica is the one feminine day: la domenica.',
            'Domenica': 'domenica alone is one particular Sunday. Every Sunday is la domenica.',
          },
          why: WHY_DOMENICA,
        },
        {
          id: 'u2-l4-e04', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r4',
          prompt: '___ abita qui accanto.', base: '"Mr Rossi lives next door."', en: 'Mr Rossi lives next door.',
          answers: ['Il signor Rossi'], options: ['Il signor Rossi', 'Signor Rossi', 'Il signore Rossi'],
          mistakes: {
            'Signor Rossi': 'When you talk about him, the title takes the article: il signor Rossi.',
            'Il signore Rossi': 'Before a name, signore drops its final e: il signor Rossi.',
          },
          why: WHY_TITLE,
        },
        {
          id: 'u2-l4-e05', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u2-r4',
          prompt: 'Buongiorno, ___!', base: '(greeting Mr Rossi in the street)', en: 'Good morning, Mr Rossi!',
          answers: ['signor Rossi'], options: ['signor Rossi', 'il signor Rossi'],
          mistakes: { 'il signor Rossi': 'When you speak to someone, drop the article: Buongiorno, signor Rossi!' },
          why: WHY_ADDRESS,
        },
        {
          id: 'u2-l4-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r4',
          prompt: '___ è molto gentile.', base: '"Mrs Bianchi is very kind."', en: 'Mrs Bianchi is very kind.',
          answers: ['La signora Bianchi'], options: ['La signora Bianchi', 'Signora Bianchi'],
          mistakes: { 'Signora Bianchi': 'When you talk about her, the title takes the article: la signora Bianchi.' },
          why: WHY_TITLE,
        },
        {
          id: 'u2-l4-e07', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u2-r4',
          prompt: 'Buonasera, ___! Come sta?', base: '(greeting an older lady you know)', en: 'Good evening! How are you?',
          answers: ['signora'], options: ['signora', 'la signora'],
          mistakes: { 'la signora': 'When you speak to her, no article: Buonasera, signora!' },
          why: WHY_ADDRESS,
        },
        {
          id: 'u2-l4-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r4',
          prompt: '___ lavora il sabato?', base: '"Does Dr Neri work on Saturdays?"', en: 'Does Dr Neri work on Saturdays?',
          answers: ['Il dottor Neri'], options: ['Il dottor Neri', 'Dottor Neri', 'Il dottore Neri'],
          mistakes: {
            'Dottor Neri': 'When you talk about him, the title takes the article: il dottor Neri.',
            'Il dottore Neri': 'Before a name, dottore drops its final e: il dottor Neri.',
          },
          why: WHY_TITLE + ' ' + WHY_SIGNOR,
        },

        // Rung 2: fill the gap
        {
          id: 'u2-l4-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r4',
          prompt: '___ sabato andiamo al mercato.', base: '(on Saturdays, every week)', en: 'On Saturdays we go to the market.',
          answers: ['Il', 'Di'],
          mistakes: { la: 'sabato is masculine: il sabato. domenica is the one feminine day.' },
          why: WHY_DAY,
        },
        {
          id: 'u2-l4-e10', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r4',
          prompt: '___ domenica pranziamo tutti insieme.', base: '(on Sundays, every week)', en: 'On Sundays we all have lunch together.',
          answers: ['La', 'Di'],
          mistakes: { il: 'domenica is the one feminine day: la domenica.' },
          why: WHY_DOMENICA,
        },
        {
          id: 'u2-l4-e11', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r4',
          prompt: 'Ci vediamo ___?', base: '(on Friday: this coming Friday)', en: 'Shall we meet on Friday?',
          answers: ['venerdì'],
          mistakes: { 'il venerdì': 'il venerdì means every Friday. For this Friday, just venerdì.' },
          why: WHY_DAY,
        },
        {
          id: 'u2-l4-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r4',
          prompt: 'Il museo è chiuso ___.', base: '(on Mondays, every week)', en: 'The museum is closed on Mondays.',
          answers: ['il lunedì', 'di lunedì'],
          mistakes: { 'lunedì': 'lunedì alone is one particular Monday. A rule for every week takes il: il lunedì.' },
          why: WHY_DAY,
        },
        {
          id: 'u2-l4-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r4',
          prompt: '___ Bianchi è al telefono.', base: '(Mrs Bianchi)', en: 'Mrs Bianchi is on the phone.',
          answers: ['La signora'],
          mistakes: { signora: 'When you talk about her, the title takes the article: la signora Bianchi.' },
          why: WHY_TITLE,
        },
        {
          id: 'u2-l4-e14', type: 'type', reg: 'lei', rung: 2, ruleId: 'u2-r4',
          prompt: 'Arrivederci, ___ Bianchi!', base: '(saying goodbye to Mrs Bianchi)', en: 'Goodbye, Mrs Bianchi!',
          answers: ['signora'],
          mistakes: { 'la signora': 'When you speak to her, no article: Arrivederci, signora Bianchi!' },
          why: WHY_ADDRESS,
        },
        {
          id: 'u2-l4-e15', type: 'type', reg: 'tu', rung: 2, ruleId: 'u2-r4',
          prompt: 'Conosci ___ Rossi?', base: '(Mr Rossi)', en: 'Do you know Mr Rossi?',
          answers: ['il signor'],
          mistakes: {
            'il signore': 'Before a name, signore drops its final e: il signor Rossi.',
            signor: 'When you talk about him, the title takes the article: il signor Rossi.',
          },
          why: WHY_TITLE + ' ' + WHY_SIGNOR,
        },
        {
          id: 'u2-l4-e16', type: 'type', reg: 'lei', rung: 2, ruleId: 'u2-r4',
          prompt: 'Buonasera, ___!', base: '(greeting the doctor, no name)', en: 'Good evening, Doctor!',
          answers: ['dottore'],
          mistakes: {
            dottor: 'Without a name, dottore keeps its e. Only before a name does it shorten: dottor Neri.',
            'il dottore': 'When you speak to him, no article: Buonasera, dottore!',
          },
          why: WHY_ADDRESS + ' Without a name, dottore keeps its final e.',
        },

        // Rung 3: transform
        {
          id: 'u2-l4-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r4',
          prompt: 'Lunedì vado a Roma.', base: 'Make it a weekly habit: every Monday.', en: 'On Mondays I go to Rome.',
          answers: ['Il lunedì vado a Roma.', 'Vado a Roma il lunedì.', 'Di lunedì vado a Roma.'],
          mistakes: { 'Lunedì vado a Roma.': 'That still means one particular Monday. Every Monday is il lunedì.' },
          why: WHY_DAY,
        },
        {
          id: 'u2-l4-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r4',
          prompt: 'Il sabato lavoro.', base: 'Make it just this Saturday.', en: "I'm working on Saturday.",
          answers: ['Sabato lavoro.', 'Lavoro sabato.'],
          mistakes: { 'Il sabato lavoro.': 'il sabato means every Saturday. For this Saturday, drop il.' },
          why: WHY_DAY,
        },
        {
          id: 'u2-l4-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r4',
          prompt: 'Il sabato dormo fino a tardi.', base: 'Now it is Sundays (domenica).', en: 'On Sundays I sleep in.',
          answers: ['La domenica dormo fino a tardi.'],
          mistakes: { 'Il domenica dormo fino a tardi.': 'domenica is the one feminine day: la domenica.' },
          why: WHY_DOMENICA,
        },
        {
          id: 'u2-l4-e20', type: 'transform', reg: 'lei', rung: 3, ruleId: 'u2-r4',
          prompt: 'Il signor Rossi è qui.', base: 'Now greet him directly: "Good morning, Mr Rossi!"', en: 'Good morning, Mr Rossi!',
          answers: ['Buongiorno, signor Rossi!'],
          mistakes: {
            'Buongiorno, il signor Rossi!': 'When you speak to him, drop the article: Buongiorno, signor Rossi!',
            'Buongiorno, signore Rossi!': 'Before a name, signore drops its final e: signor Rossi.',
          },
          why: WHY_ADDRESS,
        },
        {
          id: 'u2-l4-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r4',
          prompt: 'Buongiorno, signora Bianchi!', base: 'Now tell your partner that Mrs Bianchi is here (… è qui).', en: 'Mrs Bianchi is here.',
          answers: ['La signora Bianchi è qui.', 'È qui la signora Bianchi.'],
          mistakes: { 'Signora Bianchi è qui.': 'When you talk about her, the title takes the article: la signora Bianchi.' },
          why: WHY_TITLE,
        },
        {
          id: 'u2-l4-e22', type: 'transform', reg: 'lei', rung: 3, ruleId: 'u2-r4',
          prompt: 'Il dottor Neri arriva alle tre.', base: 'Now greet him directly: "Good morning, Dr Neri!"', en: 'Good morning, Dr Neri!',
          answers: ['Buongiorno, dottor Neri!'],
          mistakes: {
            'Buongiorno, il dottor Neri!': 'When you speak to him, drop the article: Buongiorno, dottor Neri!',
            'Buongiorno, dottore Neri!': 'Before a name, dottore drops its final e: dottor Neri.',
          },
          why: WHY_ADDRESS + ' ' + WHY_SIGNOR,
        },

        // Rung 3: switch register
        {
          id: 'u2-l4-e23', type: 'register', reg: 'lei', rung: 3, ruleId: 'u2-r4',
          prompt: 'Ciao, Paolo! Come stai?', base: "You greeted your partner's cousin in the morning. Now greet the neighbour, Mr Rossi (formal).", en: 'Good morning, Mr Rossi! How are you?',
          answers: ['Buongiorno, signor Rossi! Come sta?', 'Salve, signor Rossi! Come sta?'],
          mistakes: {
            'Buongiorno, il signor Rossi! Come sta?': 'When you speak to him, drop the article: signor Rossi.',
            'Buongiorno, signor Rossi! Come stai?': 'Come stai is tu. With Lei it is Come sta?',
            'Ciao, signor Rossi! Come sta?': 'Ciao is for tu. With signor Rossi, say Buongiorno.',
          },
          why: WHY_ADDRESS + ' tu stai → Lei sta.',
        },
        {
          id: 'u2-l4-e24', type: 'register', reg: 'lei', rung: 3, ruleId: 'u2-r4',
          prompt: "Scusa, sai dov'è la stazione?", base: 'You asked a student. Now ask an older lady (formal), and call her signora.', en: 'Excuse me, madam, do you know where the station is?',
          answers: ["Scusi, signora, sa dov'è la stazione?", "Mi scusi, signora, sa dov'è la stazione?", "Signora, scusi, sa dov'è la stazione?"],
          mistakes: {
            "Scusi, la signora, sa dov'è la stazione?": 'When you speak to her, no article: Scusi, signora.',
            "Scusa, signora, sa dov'è la stazione?": 'scusa is for tu. With signora, say scusi.',
            "Scusi, signora, sai dov'è la stazione?": 'sai is tu. With Lei, sapere becomes sa.',
          },
          why: WHY_ADDRESS + ' tu scusa, sai → Lei scusi, sa.',
        },

        // Rung 4: build from English
        {
          id: 'u2-l4-e25', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r4',
          prompt: 'Translate: "On Sundays the shops are closed."', base: '(explaining Italian life to a friend)', en: 'On Sundays the shops are closed.',
          answers: ['La domenica i negozi sono chiusi.', 'I negozi sono chiusi la domenica.', 'Di domenica i negozi sono chiusi.'],
          mistakes: {
            'Il domenica i negozi sono chiusi.': 'domenica is the one feminine day: la domenica.',
            'Domenica i negozi sono chiusi.': 'Without la, that is one particular Sunday. Every Sunday is la domenica.',
            'I negozi sono chiusi domenica.': 'Without la, that is one particular Sunday. Every Sunday is la domenica.',
          },
          why: WHY_DOMENICA,
        },
        {
          id: 'u2-l4-e26', type: 'build', reg: 'lei', rung: 4, ruleId: 'u2-r4',
          prompt: 'Translate: "Good evening, Mrs Bianchi!"', base: "(greeting your partner's neighbour)", en: 'Good evening, Mrs Bianchi!',
          answers: ['Buonasera, signora Bianchi!'],
          mistakes: {
            'Buonasera, la signora Bianchi!': 'When you speak to her, no article: Buonasera, signora Bianchi!',
            'Buonasera, signore Bianchi!': 'signore is for a man. Mrs is signora.',
          },
          why: WHY_ADDRESS,
        },
        {
          id: 'u2-l4-e27', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r4',
          prompt: 'Translate: "Mr Rossi is very kind."', base: '(telling your partner)', en: 'Mr Rossi is very kind.',
          answers: ['Il signor Rossi è molto gentile.', 'Il signor Rossi è gentilissimo.'],
          mistakes: {
            'Signor Rossi è molto gentile.': 'When you talk about him, the title takes the article: il signor Rossi.',
            'Il signore Rossi è molto gentile.': 'Before a name, signore drops its final e: il signor Rossi.',
          },
          why: WHY_TITLE + ' ' + WHY_SIGNOR,
        },
        {
          id: 'u2-l4-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r4',
          prompt: 'Translate: "On Thursdays I go to the gym."', base: '(talking about your week: I go = vado)', en: 'On Thursdays I go to the gym.',
          answers: ['Il giovedì vado in palestra.', 'Vado in palestra il giovedì.', 'Di giovedì vado in palestra.'],
          mistakes: {
            'Giovedì vado in palestra.': 'Without il, that is one particular Thursday. Every Thursday is il giovedì.',
            'Vado in palestra giovedì.': 'Without il, that is one particular Thursday. Every Thursday is il giovedì.',
          },
          why: WHY_DAY + ' vado = I go.',
        },
        {
          id: 'u2-l4-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r4',
          prompt: 'Translate: "See you on Saturday!"', base: '(to a friend, about this Saturday)', en: 'See you on Saturday!',
          answers: ['A sabato!', 'Ci vediamo sabato!'],
          mistakes: { 'Ci vediamo il sabato!': 'il sabato means every Saturday. For this Saturday, just sabato.' },
          why: WHY_DAY + ' A sabato! is the short way to say it.',
        },
        {
          id: 'u2-l4-e30', type: 'build', reg: 'lei', rung: 4, ruleId: 'u2-r4',
          prompt: 'Translate: "Excuse me, madam, is it free?"', base: '(pointing at a seat on the train)', en: 'Excuse me, madam, is it free?',
          answers: ['Scusi, signora, è libero?', 'Mi scusi, signora, è libero?', 'Signora, scusi, è libero?'],
          mistakes: {
            'Scusi, la signora, è libero?': 'When you speak to her, no article: Scusi, signora.',
            'Scusa, signora, è libero?': 'scusa is for tu. With signora, say scusi.',
          },
          why: WHY_ADDRESS + ' libero agrees with il posto, the seat.',
        },

        // Rung 5: listen & type
        {
          id: 'u2-l4-e31', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r4',
          prompt: 'Il lunedì il museo è chiuso.', base: '', en: 'On Mondays the museum is closed.',
          answers: ['Il lunedì il museo è chiuso.'],
          mistakes: { 'Lunedì il museo è chiuso.': 'You heard il at the start: il lunedì, every Monday.' },
          why: WHY_DAY,
        },
        {
          id: 'u2-l4-e32', type: 'listen', reg: 'lei', rung: 5, ruleId: 'u2-r4',
          prompt: 'Buongiorno, signor Rossi!', base: '', en: 'Good morning, Mr Rossi!',
          answers: ['Buongiorno, signor Rossi!'],
          mistakes: {
            'Buongiorno, signore Rossi!': 'You heard signor: before a name, signore drops its final e.',
            'Buongiorno, il signor Rossi!': 'You heard no article: speaking to him, it is just signor Rossi.',
          },
          why: WHY_ADDRESS + ' ' + WHY_SIGNOR,
        },
        {
          id: 'u2-l4-e33', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r4',
          prompt: 'La domenica dormo fino a tardi.', base: '', en: 'On Sundays I sleep in.',
          answers: ['La domenica dormo fino a tardi.'],
          mistakes: { 'Domenica dormo fino a tardi.': 'You heard la at the start: la domenica, every Sunday.' },
          why: WHY_DOMENICA,
        },
        {
          id: 'u2-l4-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r4',
          prompt: 'La signora Bianchi è al telefono.', base: '', en: 'Mrs Bianchi is on the phone.',
          answers: ['La signora Bianchi è al telefono.'],
          mistakes: { 'Signora Bianchi è al telefono.': 'You heard la: talking about her, the title takes the article.' },
          why: WHY_TITLE,
        },
      ],
    },
  ],
  scene: {
    title: 'Meeting the family\'s friends at a party',
    setting: "Saturday evening at Giulia's parents' house: a party for her brother Marco's thirtieth birthday. Giulia, your partner, introduces you to friends and relatives.",
    lines: [
      { speaker: 'Giulia', it: 'Vieni, ti presento gli amici di Marco!', en: "Come on, let me introduce you to Marco's friends!", reg: 'tu' },
      { speaker: 'Luca', it: "Ciao, piacere! Io sono Luca, e questa è Sara, un'amica dell'università.", en: "Hi, nice to meet you! I'm Luca, and this is Sara, a friend from university.", reg: 'neutral' },
      { speaker: 'You', it: 'Piacere! E la ragazza con lo zio Franco chi è?', en: "Nice to meet you! And who's the girl with Uncle Franco?", reg: 'neutral' },
      { speaker: 'Sara', it: 'È Chiara, la sorella di Luca.', en: "That's Chiara, Luca's sister.", reg: 'neutral' },
      { speaker: 'Luca', it: 'Senti, il giovedì giochiamo a calcetto. Vieni anche tu?', en: 'Listen, on Thursdays we play five-a-side. Do you want to come too?', reg: 'tu' },
      { speaker: 'You', it: 'Volentieri! Allora a giovedì!', en: 'Gladly! See you on Thursday, then!', reg: 'neutral' },
      { speaker: 'Giulia', it: "E lì c'è il signor Bianchi, un vecchio amico di papà.", en: "And over there is Mr Bianchi, an old friend of Dad's.", reg: 'neutral' },
      { speaker: 'You', it: 'Buonasera, signor Bianchi. Piacere!', en: 'Good evening, Mr Bianchi. Nice to meet you!', reg: 'lei' },
      { speaker: 'Signor Bianchi', it: 'Piacere mio! Le piace il vino?', en: 'The pleasure is mine! Do you like the wine?', reg: 'lei' },
      { speaker: 'You', it: 'Moltissimo! È buonissimo.', en: "Very much! It's excellent.", reg: 'neutral' },
      { speaker: 'Signor Bianchi', it: 'Lo zio Franco ha una vigna in campagna, sa?', en: 'Uncle Franco has a vineyard in the countryside, you know.', reg: 'lei' },
      { speaker: 'Giulia', it: 'Ah, ecco anche la signora Bianchi!', en: "Oh, and here's Mrs Bianchi too!", reg: 'neutral' },
      { speaker: 'Signora Bianchi', it: 'Buonasera! Allora, Le piace la festa?', en: 'Good evening! So, are you enjoying the party?', reg: 'lei' },
      { speaker: 'You', it: 'Sì, tanto! Gli amici di Marco sono simpaticissimi.', en: "Yes, a lot! Marco's friends are really nice.", reg: 'neutral' },
    ],
    exercises: [
      {
        id: 'u2-s-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r3',
        prompt: "Questa è Sara, ___ amica dell'università.", base: '"This is Sara, a friend from university."', en: 'This is Sara, a friend from university.',
        answers: ["un'"], options: ['un', "un'", 'una'],
        mistakes: {
          un: "un without an apostrophe is masculine (un amico). Sara is a woman: un'amica.",
          una: "Before a vowel, una shortens to un': un'amica.",
        },
        why: WHY_UN_AP,
      },
      {
        id: 'u2-s-e02', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u2-r2',
        prompt: 'Vieni, ti presento ___ amici di Marco!', base: '"Come on, let me introduce you to Marco\'s friends!"', en: "Come on, let me introduce you to Marco's friends!",
        answers: ['gli'], options: ['i', 'gli', 'le'],
        mistakes: {
          i: "amico takes l' in the singular, so the masculine plural is gli: gli amici.",
          le: 'le is the feminine plural (le amiche). amici is masculine: gli amici.',
        },
        why: WHY_GLI,
      },
      {
        id: 'u2-s-e03', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r1',
        prompt: 'E la ragazza con ___ zio Franco chi è?', base: '(the uncle)', en: "And who's the girl with Uncle Franco?",
        answers: ['lo'],
        mistakes: {
          il: 'zio starts with z, so lo: lo zio Franco.',
          la: 'la is feminine (la zia). An uncle takes lo: lo zio.',
        },
        why: WHY_LO + ' Relatives often take the article before their name: lo zio Franco, la nonna Maria.',
      },
      {
        id: 'u2-s-e04', type: 'type', reg: 'lei', rung: 2, ruleId: 'u2-r4',
        prompt: 'Buonasera, ___ Bianchi. Piacere!', base: '(greeting Mr Bianchi)', en: 'Good evening, Mr Bianchi. Nice to meet you!',
        answers: ['signor'],
        mistakes: {
          'il signor': 'When you speak to him, drop the article: Buonasera, signor Bianchi.',
          signore: 'Before a name, signore drops its final e: signor Bianchi.',
        },
        why: WHY_ADDRESS + ' ' + WHY_SIGNOR,
      },
      {
        id: 'u2-s-e05', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u2-r2',
        prompt: 'Ecco lo zio Franco.', base: 'Now Uncle Franco and Aunt Carla arrive together (zii).', en: "Here are the aunt and uncle.",
        answers: ['Ecco gli zii.'],
        mistakes: {
          'Ecco i zii.': 'zio takes lo, so the plural is gli: gli zii.',
          'Ecco lo zii.': 'lo is singular. In the plural it becomes gli: gli zii.',
        },
        why: WHY_GLI + ' ' + WHY_MIXED,
      },
      {
        id: 'u2-s-e06', type: 'transform', reg: 'lei', rung: 3, ruleId: 'u2-r4',
        prompt: "Lì c'è il signor Bianchi.", base: 'Now greet him directly: "Good evening, Mr Bianchi!"', en: 'Good evening, Mr Bianchi!',
        answers: ['Buonasera, signor Bianchi!'],
        mistakes: {
          'Buonasera, il signor Bianchi!': 'When you speak to him, drop the article: Buonasera, signor Bianchi!',
          'Buonasera, signore Bianchi!': 'Before a name, signore drops its final e: signor Bianchi.',
        },
        why: WHY_ADDRESS,
      },
      {
        id: 'u2-s-e07', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r4',
        prompt: 'Translate: "On Thursdays we play five-a-side."', base: '(repeating what Luca said: we play = giochiamo, five-a-side = calcetto)', en: 'On Thursdays we play five-a-side.',
        answers: ['Il giovedì giochiamo a calcetto.', 'Giochiamo a calcetto il giovedì.', 'Di giovedì giochiamo a calcetto.'],
        mistakes: {
          'Giovedì giochiamo a calcetto.': 'Without il, that is one particular Thursday. Every Thursday is il giovedì.',
          'Giochiamo a calcetto giovedì.': 'Without il, that is one particular Thursday. Every Thursday is il giovedì.',
        },
        why: WHY_DAY,
      },
      {
        id: 'u2-s-e08', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r3',
        prompt: 'Translate: "Sara is a friend from university."', base: '(telling Giulia who Sara is)', en: 'Sara is a friend from university.',
        answers: ["Sara è un'amica dell'università."],
        mistakes: {
          "Sara è un amica dell'università.": "Without the apostrophe, un is masculine. amica needs un': un'amica.",
          "Sara è una amica dell'università.": "Before a vowel, una shortens to un': un'amica.",
          "Sara è un'amica della università.": "Before a vowel, della shortens too: dell'università.",
        },
        why: WHY_UN_AP + " dell'università is di + l'università.",
      },
      {
        id: 'u2-s-e09', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r1',
        prompt: 'Lo zio Franco ha una vigna.', base: '', en: 'Uncle Franco has a vineyard.',
        answers: ['Lo zio Franco ha una vigna.'],
        mistakes: { 'Il zio Franco ha una vigna.': 'You heard lo: zio starts with z, so it is always lo zio.' },
        why: WHY_LO,
      },
      {
        id: 'u2-s-e10', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u2-r2',
        prompt: 'Gli amici di Marco sono simpaticissimi.', base: '', en: "Marco's friends are really nice.",
        answers: ['Gli amici di Marco sono simpaticissimi.'],
        mistakes: {
          'I amici di Marco sono simpaticissimi.': 'You heard gli: amici starts with a vowel, so the masculine plural is gli.',
          'Gli amichi di Marco sono simpaticissimi.': 'You heard a soft c, "ch": amico is an exception, and its plural is amici.',
        },
        why: WHY_GLI,
      },
    ],
  },
};
