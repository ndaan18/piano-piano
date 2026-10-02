// Unit 2: Articles. Data only (schema: spec §9).
// Exercise field use by type:
//   recognise  prompt with ___ gap, options (2–4, include the answer)
//   type       prompt with ___ gap, answers = the missing word(s)
//   transform  prompt = sentence to rewrite, base = the instruction
//   register   prompt = sentence said to one person, base = who to say it to now; reg = target register
//   build      prompt = 'Translate: "…"', base = context line
//   listen     prompt = the Italian sentence to speak, answers = that sentence
// Draft: only lesson u2-l1 so far; later content work adds the remaining rules.

const WHY_IL = 'Most consonants take il: il treno, il conto, il bagno.';
const WHY_LO = 'lo goes before s + consonant, z, gn, ps, x and y: lo zaino, lo scontrino, lo gnocco.';
const WHY_L = "Before a vowel (or a silent h), lo shortens to l' and glues to the word: l'albergo, l'hotel.";

export default {
  id: 2,
  slug: 'articles',
  title: 'Articles',
  teaser: "il · lo · la · l'",
  canSay: 'Hai visto lo zio?',
  draft: true,
  lessons: [
    {
      id: 'u2-l1',
      title: "il, lo, l'",
      rules: [
        {
          id: 'u2-r1',
          title: "il · lo · l'",
          sentence: 'lo zaino · il libro',
          marks: [
            { word: 'lo', kind: 'circle', color: 'pink' },
            { word: 'z', kind: 'underline', color: 'ultra' },
          ],
          why: "\"The\" for a masculine word depends on the sound the next word starts with. Most words take il. Sounds that are awkward after il (s + consonant, z, gn, ps, x, y) take lo. Before a vowel, lo shortens to l'.",
          table: {
            head: ['Article', 'Before', 'Example'],
            rows: [
              ['il', 'most consonants', 'il libro, il treno'],
              ['lo', 's + consonant, z, gn, ps, x, y', 'lo zaino, lo studente'],
              ["l'", 'a vowel or silent h', "l'amico, l'hotel"],
            ],
            highlight: [1],
          },
          careful: "The article matches the word right after it, not the noun: lo zaino but il nuovo zaino; l'amico but il vecchio amico. And s + vowel is a normal consonant: il sale, not lo sale.",
          howItaliansSayIt: {
            it: "Dov'è lo zaino?",
            en: "Where's the backpack?",
            note: "In speech dove è shortens to dov'è, and l' runs straight into its word: l'albergo sounds like one word, \"lalbergo\".",
          },
        },
      ],
      examples: [
        { it: 'Il treno è in ritardo.', en: 'The train is late.', reg: 'neutral' },
        { it: 'Lo zaino è in macchina.', en: 'The backpack is in the car.', reg: 'neutral' },
        { it: "L'albergo è vicino alla stazione.", en: 'The hotel is near the station.', reg: 'neutral' },
        { it: 'Hai lo scontrino?', en: 'Do you have the receipt?', reg: 'tu' },
        { it: "Scusi, dov'è l'ufficio turistico?", en: "Excuse me, where's the tourist office?", reg: 'lei' },
        { it: 'Il caffè qui è buonissimo.', en: 'The coffee here is excellent.', reg: 'neutral' },
        { it: 'Lo sciopero dei treni è domani.', en: 'The train strike is tomorrow.', reg: 'neutral' },
        { it: "L'amico di Giulia arriva stasera.", en: "Giulia's friend arrives tonight.", reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u2-l1-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r1',
          prompt: '___ treno parte alle nove.', base: '', en: 'The train leaves at nine.',
          answers: ['Il'], options: ['Il', 'Lo', "L'"],
          mistakes: {
            Lo: 'tr is an ordinary consonant cluster. Among clusters, only s + consonant, gn and ps take lo: il treno.',
            "L'": "l' is only for a vowel or a silent h. treno starts with t, so il.",
          },
          why: WHY_IL,
        },
        {
          id: 'u2-l1-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r1',
          prompt: "Dov'è ___ zaino?", base: '', en: "Where's the backpack?",
          answers: ['lo'], options: ['il', 'lo', "l'"],
          mistakes: {
            il: 'zaino starts with z, and z always takes lo: lo zaino.',
            "l'": "l' is for a vowel or a silent h. zaino starts with z, so lo.",
          },
          why: WHY_LO,
        },
        {
          id: 'u2-l1-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r1',
          prompt: '___ albergo è in centro.', base: '', en: 'The hotel is in the centre.',
          answers: ["L'"], options: ['Il', 'Lo', "L'"],
          mistakes: {
            Lo: "Before a vowel, lo shortens to l': l'albergo.",
            Il: "il never goes before a vowel. albergo starts with a, so l'albergo.",
          },
          why: WHY_L,
        },
        {
          id: 'u2-l1-e04', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u2-r1',
          prompt: 'Hai ___ biglietto?', base: '', en: 'Do you have the ticket?',
          answers: ['il'], options: ['il', 'lo'],
          mistakes: { lo: 'biglietto starts with b, a normal consonant: il biglietto.' },
          why: WHY_IL,
        },
        {
          id: 'u2-l1-e05', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u2-r1',
          prompt: 'Le serve ___ scontrino?', base: '', en: 'Do you need the receipt?',
          answers: ['lo'], options: ['il', 'lo', "l'"],
          mistakes: {
            il: 'scontrino starts with s + consonant (sc), so lo: lo scontrino.',
            "l'": "l' is for a vowel or a silent h. scontrino starts with s + c, so lo.",
          },
          why: WHY_LO,
        },
        {
          id: 'u2-l1-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u2-r1',
          prompt: 'Quanto costa ___ ombrello?', base: '', en: 'How much is the umbrella?',
          answers: ["l'"], options: ['il', 'lo', "l'"],
          mistakes: {
            lo: "Before a vowel, lo shortens to l': l'ombrello.",
            il: "il never goes before a vowel: l'ombrello.",
          },
          why: WHY_L,
        },
        {
          id: 'u2-l1-e07', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u2-r1',
          prompt: 'Mi passi ___ zucchero?', base: '', en: 'Can you pass me the sugar?',
          answers: ['lo'], options: ['il', 'lo'],
          mistakes: { il: 'zucchero starts with z, so lo: lo zucchero.' },
          why: WHY_LO,
        },

        // Rung 2: fill the gap
        {
          id: 'u2-l1-e08', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r1',
          prompt: '___ zio di Marco è simpatico.', base: '', en: "Marco's uncle is nice.",
          answers: ['Lo'],
          mistakes: {
            il: 'zio starts with z, so lo: lo zio.',
            "l'": "l' is for a vowel or a silent h. zio starts with z, so lo.",
          },
          why: WHY_LO,
        },
        {
          id: 'u2-l1-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r1',
          prompt: 'A che ora passa ___ autobus?', base: '', en: 'What time does the bus come?',
          answers: ["l'"],
          mistakes: {
            lo: "Before a vowel, lo shortens to l': l'autobus.",
            il: "il never goes before a vowel: l'autobus.",
          },
          why: WHY_L,
        },
        {
          id: 'u2-l1-e10', type: 'type', reg: 'lei', rung: 2, ruleId: 'u2-r1',
          prompt: 'Ci porta ___ conto, per favore?', base: '', en: 'Could you bring us the bill, please?',
          answers: ['il'],
          mistakes: {
            lo: 'conto starts with c + vowel, a normal consonant: il conto.',
            "l'": "l' is for a vowel or a silent h. conto starts with c, so il.",
          },
          why: WHY_IL,
        },
        {
          id: 'u2-l1-e11', type: 'type', reg: 'tu', rung: 2, ruleId: 'u2-r1',
          prompt: 'Ti piace ___ spumante?', base: '', en: 'Do you like the sparkling wine?',
          answers: ['lo'],
          mistakes: { il: 'spumante starts with s + consonant (sp), so lo: lo spumante.' },
          why: WHY_LO,
        },
        {
          id: 'u2-l1-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r1',
          prompt: '___ aeroporto è lontano?', base: '', en: 'Is the airport far?',
          answers: ["L'"],
          mistakes: {
            lo: "Before a vowel, lo shortens to l': l'aeroporto.",
            il: "il never goes before a vowel: l'aeroporto.",
          },
          why: WHY_L,
        },
        {
          id: 'u2-l1-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r1',
          prompt: 'Mi piace ___ gelato al pistacchio.', base: '', en: 'I like pistachio ice cream.',
          answers: ['il'],
          mistakes: {
            lo: 'Of the words starting with g, only gn takes lo: il gelato, but lo gnocco.',
            "l'": "l' is for a vowel or a silent h. gelato starts with g, so il.",
          },
          why: WHY_IL,
        },
        {
          id: 'u2-l1-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u2-r1',
          prompt: '___ gnocco fritto è buonissimo.', base: '', en: 'Gnocco fritto (fried dough) is delicious.',
          answers: ['Lo'],
          mistakes: { il: 'gnocco starts with gn, and gn takes lo: lo gnocco.' },
          why: WHY_LO,
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

        // Rung 3: switch register
        {
          id: 'u2-l1-e19', type: 'register', reg: 'lei', rung: 3, ruleId: 'u2-r1',
          prompt: 'Hai lo zaino?', base: "You asked your partner. Now ask their father (formal).", en: 'Do you have the backpack?',
          answers: ['Ha lo zaino?', 'Lei ha lo zaino?'],
          mistakes: {
            'Hai lo zaino?': 'That is still the tu form. For Lei, avere becomes ha.',
            'Ha il zaino?': 'Right verb, but zaino starts with z, so lo zaino.',
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
          },
          why: "Lei ha → tu hai. The article stays l': l'ombrello.",
        },

        // Rung 4: build from English
        {
          id: 'u2-l1-e22', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r1',
          prompt: 'Translate: "Where\'s the hotel?"', base: '(asking a passer-by)', en: "Where's the hotel?",
          answers: [
            "Dov'è l'albergo?", "Dove è l'albergo?", "Dov'è l'hotel?", "Dove è l'hotel?",
            "Scusi, dov'è l'albergo?", "Scusi, dov'è l'hotel?",
          ],
          mistakes: {
            "Dov'è il albergo?": "albergo starts with a vowel, so l': l'albergo.",
            "Dov'è lo albergo?": "Before a vowel, lo shortens to l': l'albergo.",
            "Dov'è il hotel?": "h is silent in Italian, so hotel starts with a vowel sound: l'hotel.",
            "Dov'è lo hotel?": "h is silent, so lo shortens to l': l'hotel.",
          },
          why: WHY_L,
        },
        {
          id: 'u2-l1-e23', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u2-r1',
          prompt: 'Translate: "The uncle arrives tomorrow."', base: '(telling your partner)', en: 'The uncle arrives tomorrow.',
          answers: ['Lo zio arriva domani.', 'Domani arriva lo zio.'],
          mistakes: { 'Il zio arriva domani.': 'zio starts with z, so lo: lo zio.' },
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
          prompt: 'Hai visto lo zio?', base: '', en: 'Did you see the uncle?',
          answers: ['Hai visto lo zio?'],
          mistakes: {
            'Hai visto il zio?': 'You heard lo. zio starts with z, so it is always lo zio.',
            'Ha visto lo zio?': 'You heard hai (sounds like "eye"), the tu form. ha would be Lei.',
          },
          why: WHY_LO,
        },
      ],
    },
  ],
  scene: {
    title: 'At the station',
    setting: 'You and your partner Giulia are catching a train to Bologna.',
    lines: [
      { speaker: 'Giulia', it: 'Allora, hai il biglietto?', en: 'So, do you have the ticket?', reg: 'tu' },
      { speaker: 'You', it: "Sì, ma dov'è lo zaino?", en: "Yes, but where's the backpack?", reg: 'neutral' },
      { speaker: 'Giulia', it: 'Eccolo! Andiamo, il treno parte tra dieci minuti.', en: "Here it is! Let's go, the train leaves in ten minutes.", reg: 'neutral' },
      { speaker: 'You', it: 'Scusi, da che binario parte il treno per Bologna?', en: 'Excuse me, which platform does the train to Bologna leave from?', reg: 'lei' },
      { speaker: 'Clerk', it: 'Dal binario tre, ma il treno è in ritardo di venti minuti.', en: 'From platform three, but the train is twenty minutes late.', reg: 'neutral' },
      { speaker: 'You', it: 'Grazie mille!', en: 'Thanks a lot!', reg: 'neutral' },
      { speaker: 'Giulia', it: 'Venti minuti? Allora andiamo al bar: il caffè qui è buono.', en: "Twenty minutes? Then let's go to the bar: the coffee here is good.", reg: 'neutral' },
      { speaker: 'You', it: "Perfetto. Hai l'ombrello? Piove.", en: "Perfect. Do you have the umbrella? It's raining.", reg: 'tu' },
    ],
    exercises: [],
  },
};
