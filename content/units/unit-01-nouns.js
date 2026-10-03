// Unit 1: Nouns. Data only (schema: spec §9; field use per type as in unit-02-articles.js).
// Articles get their own unit (Unit 2). Here il / la / i / le (and un / una) appear only
// as gender labels; lo, gli and uno are avoided except in l'uomo → gli uomini (flagged).
// The checker accepts a one-letter slip inside a word as a typo, so every mid-word
// grammar slip (amichi, bance, pesce, fici, arancie…) is a mistake key.

const WHY_O = '-o nouns are usually masculine: il treno, il conto, il nonno.';
const WHY_A = '-a nouns are usually feminine: la pizza, la casa, la nonna.';
const WHY_E = 'Nouns in -e can be masculine or feminine, so learn each one with il or la: il padre, il pane, il mare; la madre, la notte, la chiave.';
const WHY_ZIONE = 'Nouns in -zione are always feminine: la stazione, la colazione.';
const WHY_UN = '"A" works like "the": un for masculine nouns, una for feminine ones (un panino, una pizza).';

const WHY_PL_O = 'Masculine -o becomes -i in the plural (treno → treni), and il becomes i.';
const WHY_PL_A = 'Feminine -a becomes -e in the plural (pizza → pizze), and la becomes le.';
const WHY_PL_E = 'Nouns in -e take -i in the plural, masculine or feminine: padre → padri, notte → notti.';
const WHY_PL_CA = 'Feminine -ca and -ga become -che and -ghe: the h keeps the hard sound (banca → banche, amica → amiche).';
const WHY_PL_CO = '-co and -go usually become -chi and -ghi, which keeps the hard sound: parco → parchi, lago → laghi.';
const WHY_AMICO = 'amico → amici and medico → medici break the -chi pattern: their plural has a soft c, "chee". Learn these two.';
const WHY_NO_S = 'Italian never adds -s for the plural: it changes the last vowel instead.';
const WHY_MIXED = 'A mixed group takes the masculine plural: i nonni are grandpa and grandma together.';

const WHY_ACCENT = 'Nouns that end in an accented vowel never change in the plural: un caffè, due caffè; una città, due città.';
const WHY_FOREIGN = "Foreign words don't change in the plural, and Italian never adds -s: il film, i film; il bar, i bar.";
const WHY_SHORT = "Shortened words don't change in the plural: la foto (from fotografia), le foto; la bici (from bicicletta), le bici.";
const WHY_MANO = 'la mano is feminine although it ends in -o. Its plural is le mani.';
const WHY_MA = 'A few nouns in -a are masculine: il problema, il programma. Like other masculine nouns, their plural ends in -i: i problemi.';
const WHY_PAPA = 'papà ends in -a but means dad, so it is masculine: il papà. Its last vowel is accented, so the plural stays the same: i papà.';
const WHY_ISTA = 'Nouns in -ista take il for a man and la for a woman: il turista, la turista. Plural: i turisti (men, or a mixed group), le turiste (women only).';
const WHY_UOMO = "l'uomo → gli uomini is irregular: learn it as a pair. gli is a plural \"the\" for masculine nouns, which comes in Unit 2.";

export default {
  id: 1,
  slug: 'nouns',
  title: 'Nouns',
  teaser: 'gender & plurals',
  canSay: 'Un chilo di pomodori e tre limoni, per favore.',
  lessons: [
    // ---------------------------------------------------------------- gender
    {
      id: 'u1-l1',
      title: 'Masculine or feminine?',
      rules: [
        {
          id: 'u1-r1',
          title: 'Masculine or feminine',
          sentence: 'il treno · la pizza · il padre · la madre',
          marks: [
            { word: 'il', kind: 'underline', color: 'ultra' },
            { word: 'o', kind: 'circle', color: 'pink' },
            { word: 'la', kind: 'underline', color: 'ultra' },
            { word: 'a', kind: 'circle', color: 'pink' },
            { word: 'il', kind: 'underline', color: 'ultra' },
            { word: 'la', kind: 'underline', color: 'ultra' },
          ],
          why: 'Every Italian noun is masculine or feminine, even nouns for things: il treno (the train) is masculine, la pizza is feminine. The ending usually tells you: -o is usually masculine, -a usually feminine. Nouns in -e can be either, so learn them together with il or la. For now, treat il and la as gender labels: il for masculine, la for feminine (and un, una for "a"). The full rules for "the" and "a" come in Unit 2.',
          table: {
            head: ['Ending', 'Gender', 'Examples'],
            rows: [
              ['-o', 'usually masculine', 'il treno, il conto, il nonno'],
              ['-a', 'usually feminine', 'la pizza, la casa, la nonna'],
              ['-e', 'either: learn it with il or la', 'il padre, il pane, il mare · la madre, la notte, la chiave'],
              ['-zione', 'always feminine', 'la stazione, la colazione'],
            ],
            highlight: [2],
          },
          careful: '"Usually" matters: la mano (the hand) and il problema break the pattern, and they get Lesson 3. Nouns in -e give no clue at all, so never learn just "pane" or "notte": learn "il pane", "la notte". And before a vowel, "the" is l\' for both genders, so l\'albergo (masculine) and l\'acqua (feminine) don\'t show it.',
          howItaliansSayIt: {
            it: 'Si dice il o la?',
            en: 'Do you say il or la?',
            note: 'Ask this whenever you are not sure: any Italian will answer at once. Then say the word back with its label, "la chiave", so the pair sticks.',
          },
        },
      ],
      examples: [
        { it: 'Il treno è in ritardo.', en: 'The train is late.', reg: 'neutral' },
        { it: 'La pizza è buonissima.', en: 'The pizza is delicious.', reg: 'neutral' },
        { it: 'Il padre di Giulia si chiama Paolo.', en: "Giulia's father is called Paolo.", reg: 'neutral' },
        { it: 'La madre di Marco è molto simpatica.', en: "Marco's mother is very nice.", reg: 'neutral' },
        { it: 'Il pane è ancora caldo.', en: 'The bread is still warm.', reg: 'neutral' },
        { it: 'Hai la chiave?', en: 'Do you have the key?', reg: 'tu' },
        { it: 'La stazione è lontana?', en: 'Is the station far?', reg: 'neutral' },
        { it: 'Il mare è bellissimo.', en: 'The sea is beautiful.', reg: 'neutral' },
        { it: 'La colazione è alle otto.', en: 'Breakfast is at eight.', reg: 'neutral' },
        { it: 'Un caffè e una pizza, per favore.', en: 'A coffee and a pizza, please.', reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u1-l1-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r1',
          prompt: '___ treno è in ritardo.', base: '"The train is late."', en: 'The train is late.',
          answers: ['Il'], options: ['Il', 'La'],
          mistakes: { La: 'treno ends in -o, and -o nouns are usually masculine: il treno.' },
          why: WHY_O,
        },
        {
          id: 'u1-l1-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r1',
          prompt: '___ pizza è buonissima.', base: '"The pizza is delicious."', en: 'The pizza is delicious.',
          answers: ['La'], options: ['Il', 'La'],
          mistakes: { Il: 'pizza ends in -a, and -a nouns are usually feminine: la pizza.' },
          why: WHY_A,
        },
        {
          id: 'u1-l1-e03', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u1-r1',
          prompt: 'Hai ___ chiave?', base: '"Do you have the key?"', en: 'Do you have the key?',
          answers: ['la'], options: ['il', 'la'],
          mistakes: { il: 'chiave ends in -e, so the ending gives no clue, and chiave is feminine: la chiave.' },
          why: WHY_E,
        },
        {
          id: 'u1-l1-e04', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r1',
          prompt: '___ pane è ancora caldo.', base: '"The bread is still warm."', en: 'The bread is still warm.',
          answers: ['Il'], options: ['Il', 'La'],
          mistakes: { La: 'pane ends in -e, so the ending gives no clue, and pane is masculine: il pane.' },
          why: WHY_E,
        },
        {
          id: 'u1-l1-e05', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r1',
          prompt: '___ stazione è lontana?', base: '"Is the station far?"', en: 'Is the station far?',
          answers: ['La'], options: ['Il', 'La'],
          mistakes: { Il: 'Nouns in -zione are always feminine: la stazione.' },
          why: WHY_ZIONE,
        },
        {
          id: 'u1-l1-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r1',
          prompt: '___ padre di Giulia si chiama Paolo.', base: '"Giulia\'s father is called Paolo."', en: "Giulia's father is called Paolo.",
          answers: ['Il'], options: ['Il', 'La'],
          mistakes: { La: 'padre ends in -e, so the ending gives no clue, and a father is masculine: il padre.' },
          why: WHY_E,
        },
        {
          id: 'u1-l1-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r1',
          prompt: '___ madre di Marco è molto simpatica.', base: '"Marco\'s mother is very nice."', en: "Marco's mother is very nice.",
          answers: ['La'], options: ['Il', 'La'],
          mistakes: { Il: 'madre ends in -e like padre, but a mother is feminine: la madre.' },
          why: WHY_E,
        },
        {
          id: 'u1-l1-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r1',
          prompt: '___', base: 'Which noun is masculine?', en: 'il vino: the wine',
          answers: ['vino'], options: ['pizza', 'vino', 'birra'],
          mistakes: {
            pizza: 'pizza ends in -a, so it is feminine: la pizza.',
            birra: 'birra ends in -a, so it is feminine: la birra.',
          },
          why: WHY_O,
        },
        {
          id: 'u1-l1-e09', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r1',
          prompt: '___', base: 'These all end in -e. Which one is feminine?', en: 'la notte: the night',
          answers: ['notte'], options: ['pane', 'notte', 'mare'],
          mistakes: {
            pane: 'pane is one of the masculine -e nouns: il pane.',
            mare: 'mare is one of the masculine -e nouns: il mare.',
          },
          why: WHY_E,
        },

        // Rung 2: type the label
        {
          id: 'u1-l1-e10', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r1',
          prompt: '___ conto, per favore.', base: '(the bill: il or la?)', en: 'The bill, please.',
          answers: ['Il'],
          mistakes: { La: 'conto ends in -o, so it is masculine: il conto.' },
          why: WHY_O,
        },
        {
          id: 'u1-l1-e11', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r1',
          prompt: '___ colazione è alle otto.', base: '(breakfast: il or la?)', en: 'Breakfast is at eight.',
          answers: ['La'],
          mistakes: { Il: 'Nouns in -zione are always feminine: la colazione.' },
          why: WHY_ZIONE,
        },
        {
          id: 'u1-l1-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r1',
          prompt: "Dov'è ___ macchina?", base: '(the car: il or la?)', en: "Where's the car?",
          answers: ['la'],
          mistakes: { il: 'macchina ends in -a, so it is feminine: la macchina.' },
          why: WHY_A,
        },
        {
          id: 'u1-l1-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r1',
          prompt: 'Ecco ___ chiave.', base: '(the key: il or la?)', en: "Here's the key.",
          answers: ['la'],
          mistakes: { il: 'chiave is one of the feminine -e nouns: la chiave.' },
          why: WHY_E,
        },
        {
          id: 'u1-l1-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r1',
          prompt: "___ nonno di Luca ha novant'anni.", base: '(the grandfather: il or la?)', en: "Luca's grandfather is ninety.",
          answers: ['Il'],
          mistakes: { La: 'nonno ends in -o, and a grandfather is masculine: il nonno. Grandma is la nonna.' },
          why: WHY_O,
        },
        {
          id: 'u1-l1-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r1',
          prompt: '___ sorella di Marco abita a Milano.', base: '(the sister: il or la?)', en: "Marco's sister lives in Milan.",
          answers: ['La'],
          mistakes: { Il: 'sorella ends in -a, and a sister is feminine: la sorella.' },
          why: WHY_A,
        },
        {
          id: 'u1-l1-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r1',
          prompt: 'Qui ___ notte è tranquilla.', base: '(the night: il or la?)', en: 'Nights here are quiet.',
          answers: ['la'],
          mistakes: { il: 'notte is one of the feminine -e nouns: la notte.' },
          why: WHY_E,
        },
        {
          id: 'u1-l1-e17', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r1',
          prompt: '___ mare è lontano?', base: '(the sea: il or la?)', en: 'Is the sea far?',
          answers: ['Il'],
          mistakes: { La: 'mare is one of the masculine -e nouns: il mare.' },
          why: WHY_E,
        },
        {
          id: 'u1-l1-e18', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r1',
          prompt: 'Un caffè e ___ pizza, per favore.', base: '(a: un or una?)', en: 'A coffee and a pizza, please.',
          answers: ['una'],
          mistakes: { un: 'pizza is feminine, so "a" is una: una pizza.' },
          why: WHY_UN,
        },

        // Rung 3: transform
        {
          id: 'u1-l1-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r1',
          prompt: 'Il pane, per favore.', base: 'Ask for the pizza instead (pizza).', en: 'The pizza, please.',
          answers: ['La pizza, per favore.', 'La pizza, per piacere.'],
          mistakes: { 'Il pizza, per favore.': 'pizza ends in -a, so it takes la: la pizza.' },
          why: WHY_A,
        },
        {
          id: 'u1-l1-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r1',
          prompt: "Dov'è il treno?", base: 'Ask about the station instead (stazione).', en: "Where's the station?",
          answers: ["Dov'è la stazione?", 'Dove è la stazione?'],
          mistakes: {
            "Dov'è il stazione?": 'Nouns in -zione are always feminine: la stazione.',
            'Dove è il stazione?': 'Nouns in -zione are always feminine: la stazione.',
          },
          why: WHY_ZIONE,
        },
        {
          id: 'u1-l1-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r1',
          prompt: 'Ecco il padre di Giulia.', base: 'Now introduce her mother (madre).', en: "Here's Giulia's mother.",
          answers: ['Ecco la madre di Giulia.'],
          mistakes: { 'Ecco il madre di Giulia.': 'madre ends in -e like padre, but a mother is feminine: la madre.' },
          why: WHY_E,
        },
        {
          id: 'u1-l1-e22', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r1',
          prompt: 'Un caffè, per favore.', base: 'Order a pizza instead: un or una?', en: 'A pizza, please.',
          answers: ['Una pizza, per favore.', 'Una pizza, per piacere.'],
          mistakes: { 'Un pizza, per favore.': 'pizza is feminine, so "a" is una: una pizza.' },
          why: WHY_UN,
        },
        {
          id: 'u1-l1-e23', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r1',
          prompt: 'La chiave è qui.', base: 'Talk about the passport instead (passaporto).', en: 'The passport is here.',
          answers: ['Il passaporto è qui.'],
          mistakes: { 'La passaporto è qui.': 'passaporto ends in -o, so it is masculine: il passaporto.' },
          why: WHY_O,
        },
        {
          id: 'u1-l1-e24', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r1',
          prompt: 'Il nonno è in cucina.', base: 'Now it is grandma (nonna).', en: 'Grandma is in the kitchen.',
          answers: ['La nonna è in cucina.'],
          mistakes: { 'Il nonna è in cucina.': 'nonna ends in -a, and a grandmother is feminine: la nonna.' },
          why: WHY_A,
        },
        {
          id: 'u1-l1-e25', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r1',
          prompt: 'Una birra, per favore.', base: 'Order a sandwich instead (panino): un or una?', en: 'A sandwich, please.',
          answers: ['Un panino, per favore.', 'Un panino, per piacere.'],
          mistakes: { 'Una panino, per favore.': 'panino ends in -o, so it is masculine: un panino.' },
          why: WHY_UN,
        },

        // Rung 4: build from English
        {
          id: 'u1-l1-e26', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r1',
          prompt: 'Translate: "The bill, please."', base: '(at the restaurant)', en: 'The bill, please.',
          answers: ['Il conto, per favore.', 'Il conto, per piacere.'],
          mistakes: { 'La conto, per favore.': 'conto ends in -o, so it is masculine: il conto.' },
          why: WHY_O,
        },
        {
          id: 'u1-l1-e27', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r1',
          prompt: 'Translate: "Where\'s the station?"', base: '(asking your partner)', en: "Where's the station?",
          answers: ["Dov'è la stazione?", 'Dove è la stazione?'],
          mistakes: {
            "Dov'è il stazione?": 'Nouns in -zione are always feminine: la stazione.',
            'Dove è il stazione?': 'Nouns in -zione are always feminine: la stazione.',
          },
          why: WHY_ZIONE,
        },
        {
          id: 'u1-l1-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r1',
          prompt: 'Translate: "A pizza and a beer, please."', base: '(ordering at a pizzeria)', en: 'A pizza and a beer, please.',
          answers: ['Una pizza e una birra, per favore.', 'Una pizza e una birra, per piacere.'],
          mistakes: {
            'Un pizza e una birra, per favore.': 'pizza is feminine, so "a" is una: una pizza.',
            'Una pizza e un birra, per favore.': 'birra is feminine, so "a" is una: una birra.',
            'Un pizza e un birra, per favore.': 'pizza and birra both end in -a, so both take una.',
          },
          why: WHY_UN,
        },
        {
          id: 'u1-l1-e29', type: 'build', reg: 'tu', rung: 4, ruleId: 'u1-r1',
          prompt: 'Translate: "Do you have the key?"', base: '(to your partner, at the front door)', en: 'Do you have the key?',
          answers: ['Hai la chiave?', 'Tu hai la chiave?'],
          mistakes: {
            'Hai il chiave?': 'chiave is one of the feminine -e nouns: la chiave.',
            'Tu hai il chiave?': 'chiave is one of the feminine -e nouns: la chiave.',
            'Ha la chiave?': 'ha is the formal Lei form. With your partner, use tu: hai.',
          },
          why: WHY_E + ' To your partner, "you have" is hai.',
        },
        {
          id: 'u1-l1-e30', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r1',
          prompt: 'Translate: "Breakfast is at eight."', base: '(telling your partner what the hotel said)', en: 'Breakfast is at eight.',
          answers: ['La colazione è alle otto.', 'La colazione è alle 8.'],
          mistakes: {
            'Il colazione è alle otto.': 'Nouns in -zione are always feminine: la colazione.',
            'La colazione e alle otto.': 'e means "and". "is" is è, with an accent.',
          },
          why: WHY_ZIONE,
        },
        {
          id: 'u1-l1-e31', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r1',
          prompt: 'Translate: "A coffee and a croissant, please."', base: '(breakfast at the bar)', en: 'A coffee and a croissant, please.',
          answers: [
            'Un caffè e un cornetto, per favore.', 'Un caffè e un cornetto, per piacere.',
            'Un caffè e una brioche, per favore.', 'Un caffè e una brioche, per piacere.',
          ],
          mistakes: { 'Un caffè e una cornetto, per favore.': 'cornetto ends in -o, so it is masculine: un cornetto.' },
          why: WHY_UN + ' In the north, a croissant is often una brioche (feminine).',
        },

        // Rung 5: listen & type
        {
          id: 'u1-l1-e32', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r1',
          prompt: 'Il treno è in ritardo.', base: '', en: 'The train is late.',
          answers: ['Il treno è in ritardo.'],
          mistakes: { 'Il treno e in ritardo.': 'e means "and". The train "is" late: è, with an accent.' },
          why: WHY_O,
        },
        {
          id: 'u1-l1-e33', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r1',
          prompt: 'La stazione è lontana?', base: '', en: 'Is the station far?',
          answers: ['La stazione è lontana?'],
          mistakes: {
            'La stazione e lontana?': 'e means "and". Here you heard "is": è.',
            'La stazzione è lontana?': 'The -zione ending has a single z: stazione.',
          },
          why: WHY_ZIONE,
        },
        {
          id: 'u1-l1-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r1',
          prompt: 'Ecco la madre di Giulia.', base: '', en: "Here's Giulia's mother.",
          answers: ['Ecco la madre di Giulia.'],
          mistakes: { 'Ecco il madre di Giulia.': 'You heard la: madre is feminine, la madre.' },
          why: WHY_E,
        },
        {
          id: 'u1-l1-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r1',
          prompt: 'Il pane è ancora caldo.', base: '', en: 'The bread is still warm.',
          answers: ['Il pane è ancora caldo.'],
          mistakes: { 'Il pane e ancora caldo.': 'e means "and". The bread "is" warm: è.' },
          why: WHY_E,
        },
        {
          id: 'u1-l1-e36', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r1',
          prompt: 'Una pizza, per favore.', base: '', en: 'A pizza, please.',
          answers: ['Una pizza, per favore.'],
          mistakes: { 'Un pizza, per favore.': 'You heard una: pizza is feminine.' },
          why: WHY_UN,
        },
        {
          id: 'u1-l1-e37', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u1-r1',
          prompt: 'Hai la chiave?', base: '', en: 'Do you have the key?',
          answers: ['Hai la chiave?'],
          mistakes: {
            'Ha la chiave?': 'You heard hai (like "eye"), the tu form. ha would be Lei.',
            'Hai la ciave?': 'You heard a hard k: before i, that is ch, chiave.',
          },
          why: WHY_E,
        },
      ],
    },

    // ---------------------------------------------------------------- plurals
    {
      id: 'u1-l2',
      title: 'Plurals',
      rules: [
        {
          id: 'u1-r2',
          title: 'Regular plurals',
          sentence: 'treno → treni · pizza → pizze · notte → notti',
          marks: [
            { word: 'i', kind: 'circle', color: 'ultra' },
            { word: 'e', kind: 'circle', color: 'pink' },
            { word: 'i', kind: 'circle', color: 'ultra' },
          ],
          why: 'Italian makes a plural by changing the last vowel, never by adding -s. Masculine -o becomes -i (il treno → i treni), feminine -a becomes -e (la pizza → le pizze), and -e becomes -i for both genders (il padre → i padri, la notte → le notti). The labels change too: il becomes i, la becomes le. Words in -ca, -ga, -co and -go add an h where they need it, to keep the hard sound.',
          table: {
            head: ['Singular', 'Plural', 'Example'],
            rows: [
              ['-o (masculine)', '-i', 'il treno → i treni'],
              ['-a (feminine)', '-e', 'la pizza → le pizze'],
              ['-e (either)', '-i', 'il padre → i padri · la notte → le notti'],
              ['-ca · -ga', '-che · -ghe', 'la pesca → le pesche · la bottega → le botteghe'],
              ['-co · -go', 'usually -chi · -ghi', 'il fico → i fichi · il lago → i laghi'],
            ],
            highlight: [3, 4],
          },
          careful: 'amico → amici and medico → medici break the -chi pattern: learn these two. -io with an unstressed i keeps just one i: il figlio → i figli, il negozio → i negozi. And -cia and -gia usually drop the i after a consonant but keep it after a vowel: l\'arancia → le arance, la valigia → le valigie.',
          howItaliansSayIt: {
            it: 'Hai fratelli?',
            en: 'Do you have any brothers or sisters?',
            note: 'A mixed group takes the masculine plural, so fratelli can mean brothers and sisters, i nonni are grandpa and grandma, and i figli are sons and daughters. Sisters only would be sorelle.',
          },
        },
      ],
      examples: [
        { it: 'Due cornetti, per favore.', en: 'Two croissants, please.', reg: 'neutral' },
        { it: 'Ho due fratelli e una sorella.', en: 'I have two brothers and a sister.', reg: 'neutral' },
        { it: 'I nonni di Marco abitano a Napoli.', en: "Marco's grandparents live in Naples.", reg: 'neutral' },
        { it: 'Ecco le chiavi.', en: 'Here are the keys.', reg: 'neutral' },
        { it: 'Tre biglietti per Firenze, per favore.', en: 'Three tickets to Florence, please.', reg: 'neutral' },
        { it: 'Le pesche sono buonissime.', en: 'The peaches are delicious.', reg: 'neutral' },
        { it: 'Una camera per due notti.', en: 'A room for two nights.', reg: 'neutral' },
        { it: 'Ho due amici a Bologna.', en: 'I have two friends in Bologna.', reg: 'neutral' },
        { it: 'I genitori di Giulia arrivano domani.', en: "Giulia's parents arrive tomorrow.", reg: 'neutral' },
        { it: 'Le valigie sono in macchina.', en: 'The suitcases are in the car.', reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u1-l2-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r2',
          prompt: 'Due ___, per favore.', base: '(two croissants: cornetto)', en: 'Two croissants, please.',
          answers: ['cornetti'], options: ['cornetti', 'cornette', 'cornettos'],
          mistakes: {
            cornette: 'cornetto is masculine, and masculine -o becomes -i: cornetti.',
            cornettos: 'Italian plurals never add -s: -o becomes -i, cornetti.',
          },
          why: WHY_PL_O,
        },
        {
          id: 'u1-l2-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r2',
          prompt: 'Due ___ margherita, per favore.', base: '(two pizzas: pizza)', en: 'Two margherita pizzas, please.',
          answers: ['pizze'], options: ['pizze', 'pizzi', 'pizzas'],
          mistakes: {
            pizzi: 'pizza is feminine, and feminine -a becomes -e: pizze.',
            pizzas: 'Italian plurals never add -s: -a becomes -e, pizze.',
          },
          why: WHY_PL_A,
        },
        {
          id: 'u1-l2-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r2',
          prompt: 'Una camera per due ___.', base: '(two nights: notte)', en: 'A room for two nights.',
          answers: ['notti'], options: ['notti', 'notte'],
          mistakes: { notte: 'notte is singular. In the plural, -e becomes -i, even for feminine nouns: notti.' },
          why: WHY_PL_E,
        },
        {
          id: 'u1-l2-e04', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r2',
          prompt: 'Ecco le ___.', base: '(the keys: chiave)', en: 'Here are the keys.',
          answers: ['chiavi'], options: ['chiavi', 'chiave'],
          mistakes: { chiave: 'chiave is singular. In the plural, -e becomes -i: chiavi.' },
          why: WHY_PL_E,
        },
        {
          id: 'u1-l2-e05', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r2',
          prompt: 'Le ___ sono buonissime.', base: '(the peaches: pesca)', en: 'The peaches are delicious.',
          answers: ['pesche'], options: ['pesche', 'pesce', 'pesci'],
          mistakes: {
            pesce: 'pesce ("PEH-sheh") is fish. To keep the hard "sk" of pesca, -ca becomes -che: pesche.',
            pesci: 'pesci are fish. pesca is feminine, so -ca becomes -che: pesche.',
          },
          why: WHY_PL_CA,
        },
        {
          id: 'u1-l2-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r2',
          prompt: 'Ho due ___ a Bologna.', base: '(two friends: amico)', en: 'I have two friends in Bologna.',
          answers: ['amici'], options: ['amici', 'amichi', 'amice'],
          mistakes: {
            amichi: 'amico is one of the exceptions: its plural is amici, with a soft c, "a-MEE-chee".',
            amice: 'amico is masculine, so its plural ends in -i: amici.',
          },
          why: WHY_AMICO,
        },
        {
          id: 'u1-l2-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r2',
          prompt: 'I ___ di Marco abitano a Napoli.', base: '(grandparents: nonno)', en: "Marco's grandparents live in Naples.",
          answers: ['nonni'], options: ['nonni', 'nonne', 'nonnos'],
          mistakes: {
            nonne: 'le nonne are grandmothers only. Grandpa and grandma together take the masculine plural: i nonni.',
            nonnos: 'Italian plurals never add -s: -o becomes -i, nonni.',
          },
          why: WHY_MIXED,
        },
        {
          id: 'u1-l2-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r2',
          prompt: 'In centro ci sono tre ___.', base: '(banks: banca)', en: 'There are three banks in the centre.',
          answers: ['banche'], options: ['banche', 'bance', 'banchi'],
          mistakes: {
            bance: 'bance would make the c soft, "BAN-cheh". -ca becomes -che to keep the k: banche.',
            banchi: 'banchi are desks or market stalls. banca is feminine, so -ca becomes -che: banche.',
          },
          why: WHY_PL_CA,
        },

        // Rung 2: type the plural
        {
          id: 'u1-l2-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r2',
          prompt: 'Tre ___ per Firenze, per favore.', base: '(biglietto: tickets)', en: 'Three tickets to Florence, please.',
          answers: ['biglietti'],
          mistakes: {
            biglietto: 'After tre the noun goes plural: -o becomes -i, biglietti.',
            bigliette: 'biglietto is masculine, so -o becomes -i: biglietti.',
          },
          why: WHY_PL_O,
        },
        {
          id: 'u1-l2-e10', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r2',
          prompt: 'Due ___, per favore.', base: '(birra: beers)', en: 'Two beers, please.',
          answers: ['birre'],
          mistakes: {
            birra: 'After due the noun goes plural: -a becomes -e, birre.',
            birri: 'birra is feminine, so -a becomes -e: birre.',
          },
          why: WHY_PL_A,
        },
        {
          id: 'u1-l2-e11', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r2',
          prompt: 'Ho due ___ e una sorella.', base: '(fratello: brothers)', en: 'I have two brothers and a sister.',
          answers: ['fratelli'],
          mistakes: {
            fratello: 'After due the noun goes plural: -o becomes -i, fratelli.',
            fratelle: 'fratello is masculine, so -o becomes -i: fratelli.',
          },
          why: WHY_PL_O,
        },
        {
          id: 'u1-l2-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r2',
          prompt: 'I ___ di Giulia arrivano domani.', base: '(genitore: parents)', en: "Giulia's parents arrive tomorrow.",
          answers: ['genitori'],
          mistakes: { genitore: 'genitore is singular. In the plural, -e becomes -i: genitori.' },
          why: WHY_PL_E,
        },
        {
          id: 'u1-l2-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r2',
          prompt: 'Dove sono le ___?', base: '(chiave: the keys)', en: 'Where are the keys?',
          answers: ['chiavi'],
          mistakes: { chiave: 'chiave is singular. In the plural, -e becomes -i, even for feminine nouns: chiavi.' },
          why: WHY_PL_E,
        },
        {
          id: 'u1-l2-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r2',
          prompt: 'Due ___ di vino rosso.', base: '(bicchiere: glasses)', en: 'Two glasses of red wine.',
          answers: ['bicchieri'],
          mistakes: { bicchiere: 'bicchiere is singular. In the plural, -e becomes -i: bicchieri.' },
          why: WHY_PL_E,
        },
        {
          id: 'u1-l2-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r2',
          prompt: 'A Roma ci sono tanti ___.', base: '(parco: parks)', en: 'There are lots of parks in Rome.',
          answers: ['parchi'],
          mistakes: {
            parci: 'parci would make the c soft, "PAR-chee". -co usually becomes -chi to keep the k: parchi.',
            parco: 'After tanti the noun goes plural: parchi.',
          },
          why: WHY_PL_CO,
        },
        {
          id: 'u1-l2-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r2',
          prompt: 'Ho tre ___ in Italia.', base: '(amica: female friends)', en: 'I have three (female) friends in Italy.',
          answers: ['amiche'],
          mistakes: {
            amice: 'amice would make the c soft, "a-MEE-cheh". Feminine -ca becomes -che: amiche.',
            amici: 'amici are male friends, or a mixed group. Female friends are amiche.',
          },
          why: WHY_PL_CA,
        },
        {
          id: 'u1-l2-e17', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r2',
          prompt: 'Visitiamo due ___: Como e Garda.', base: '(lago: lakes)', en: "We're visiting two lakes: Como and Garda.",
          answers: ['laghi'],
          mistakes: {
            lagi: 'lagi would make the g soft, "LAH-jee". -go usually becomes -ghi to keep the g of "go": laghi.',
            lago: 'After due the noun goes plural: laghi.',
          },
          why: WHY_PL_CO,
        },
        {
          id: 'u1-l2-e18', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r2',
          prompt: 'Marco e Luca sono ___.', base: '(medico: doctors)', en: 'Marco and Luca are doctors.',
          answers: ['medici'],
          mistakes: {
            medichi: 'medico is one of the exceptions: its plural is medici, with a soft c, "MEH-dee-chee".',
            medico: 'Two people, so the noun goes plural: medici.',
          },
          why: WHY_AMICO,
        },
        {
          id: 'u1-l2-e19', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r2',
          prompt: 'Anna ha due ___.', base: '(figlio: children)', en: 'Anna has two children.',
          answers: ['figli'],
          mistakes: {
            figlii: '-io with an unstressed i keeps just one i in the plural: figli.',
            figlio: 'After due the noun goes plural: figli.',
          },
          why: 'figlio → figli: the i of -io isn\'t stressed, so the plural keeps just one i. For a mixed group (a son and a daughter), the plural is masculine.',
        },

        // Rung 3: transform
        {
          id: 'u1-l2-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r2',
          prompt: 'un cornetto', base: 'Make it plural: "two croissants" (due …).', en: 'two croissants',
          answers: ['due cornetti'],
          mistakes: {
            'due cornette': 'cornetto is masculine, so -o becomes -i: cornetti.',
            'due cornettos': 'Italian plurals never add -s: cornetti.',
            'due cornetto': 'After due the noun goes plural: cornetti.',
          },
          why: WHY_PL_O,
        },
        {
          id: 'u1-l2-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r2',
          prompt: 'una pizza', base: 'Make it plural: "two pizzas" (due …).', en: 'two pizzas',
          answers: ['due pizze'],
          mistakes: {
            'due pizzi': 'pizza is feminine, so -a becomes -e: pizze.',
            'due pizza': 'After due the noun goes plural: pizze.',
            'due pizzas': 'Italian plurals never add -s: pizze.',
          },
          why: WHY_PL_A,
        },
        {
          id: 'u1-l2-e22', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r2',
          prompt: 'Il treno è in ritardo.', base: 'Make it plural: "The trains are late." (are = sono)', en: 'The trains are late.',
          answers: ['I treni sono in ritardo.'],
          mistakes: {
            'Il treni sono in ritardo.': 'il is singular. With a plural masculine noun, il becomes i: i treni.',
            'I treno sono in ritardo.': 'treno must go plural too: -o becomes -i, treni.',
            'I treni è in ritardo.': 'With a plural, "is" (è) becomes "are": sono.',
          },
          why: 'il treno → i treni: the label and the noun both go plural, and è becomes sono.',
        },
        {
          id: 'u1-l2-e23', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r2',
          prompt: 'la chiave', base: 'Make it plural: "the keys" (le …).', en: 'the keys',
          answers: ['le chiavi'],
          mistakes: {
            'le chiave': 'chiave must go plural too: -e becomes -i, even for feminine nouns: chiavi.',
            'i chiavi': 'chiave is feminine, so its plural label is le: le chiavi.',
          },
          why: WHY_PL_E,
        },
        {
          id: 'u1-l2-e24', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r2',
          prompt: 'la banca', base: 'Make it plural: "the banks" (le …).', en: 'the banks',
          answers: ['le banche'],
          mistakes: {
            'le bance': 'bance would make the c soft. Feminine -ca becomes -che: banche.',
            'le banchi': 'banca is feminine, so -ca becomes -che: banche.',
          },
          why: WHY_PL_CA,
        },
        {
          id: 'u1-l2-e25', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r2',
          prompt: 'un amico', base: 'Make it plural: "two friends" (due …).', en: 'two friends',
          answers: ['due amici'],
          mistakes: {
            'due amichi': 'amico is one of the exceptions: its plural is amici, with a soft c.',
            'due amiche': 'amiche are female friends. amico is masculine: amici.',
          },
          why: WHY_AMICO,
        },
        {
          id: 'u1-l2-e26', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r2',
          prompt: 'la sorella', base: 'Make it plural: "the sisters" (le …).', en: 'the sisters',
          answers: ['le sorelle'],
          mistakes: {
            'le sorelli': 'sorella is feminine, so -a becomes -e: sorelle.',
            'i sorelle': 'sorella is feminine, so its plural label is le: le sorelle.',
          },
          why: WHY_PL_A,
        },
        {
          id: 'u1-l2-e27', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r2',
          prompt: 'la stazione', base: 'Make it plural: "the stations" (le …).', en: 'the stations',
          answers: ['le stazioni'],
          mistakes: {
            'le stazione': 'stazione must go plural too: -e becomes -i, even for feminine nouns: stazioni.',
            'i stazioni': 'stazione is feminine, so its plural label is le: le stazioni.',
          },
          why: WHY_PL_E,
        },

        // Rung 4: build from English
        {
          id: 'u1-l2-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r2',
          prompt: 'Translate: "Two beers, please."', base: '(at the bar)', en: 'Two beers, please.',
          answers: ['Due birre, per favore.', 'Due birre, per piacere.'],
          mistakes: {
            'Due birri, per favore.': 'birra is feminine, so -a becomes -e: birre.',
            'Due birra, per favore.': 'After due the noun goes plural: birre.',
          },
          why: WHY_PL_A,
        },
        {
          id: 'u1-l2-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r2',
          prompt: 'Translate: "Three tickets to Florence, please."', base: '(at the station ticket desk)', en: 'Three tickets to Florence, please.',
          answers: ['Tre biglietti per Firenze, per favore.', 'Tre biglietti per Firenze, per piacere.'],
          mistakes: {
            'Tre biglietto per Firenze, per favore.': 'After tre the noun goes plural: biglietti.',
            'Tre bigliette per Firenze, per favore.': 'biglietto is masculine, so -o becomes -i: biglietti.',
          },
          why: WHY_PL_O,
        },
        {
          id: 'u1-l2-e30', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r2',
          prompt: 'Translate: "I have two brothers."', base: "(chatting with your partner's family)", en: 'I have two brothers.',
          answers: ['Ho due fratelli.', 'Io ho due fratelli.'],
          mistakes: {
            'Ho due fratello.': 'After due the noun goes plural: fratelli.',
            'Io ho due fratello.': 'After due the noun goes plural: fratelli.',
          },
          why: WHY_PL_O,
        },
        {
          id: 'u1-l2-e31', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r2',
          prompt: 'Translate: "Here are the keys."', base: '(handing your partner the keys)', en: 'Here are the keys.',
          answers: ['Ecco le chiavi.'],
          mistakes: {
            'Ecco le chiave.': 'chiave must go plural too: -e becomes -i, chiavi.',
            'Ecco i chiavi.': 'chiave is feminine, so its plural label is le: le chiavi.',
          },
          why: WHY_PL_E,
        },
        {
          id: 'u1-l2-e32', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r2',
          prompt: 'Translate: "A room for two nights."', base: '(at hotel reception)', en: 'A room for two nights.',
          answers: ['Una camera per due notti.', 'Una stanza per due notti.'],
          mistakes: {
            'Una camera per due notte.': 'After due the noun goes plural: -e becomes -i, notti.',
            'Una stanza per due notte.': 'After due the noun goes plural: -e becomes -i, notti.',
          },
          why: WHY_PL_E,
        },
        {
          id: 'u1-l2-e33', type: 'build', reg: 'lei', rung: 4, ruleId: 'u1-r2',
          prompt: 'Translate: "Excuse me, how much are the peaches?"', base: '(to the stallholder at the market)', en: 'Excuse me, how much are the peaches?',
          answers: ['Scusi, quanto costano le pesche?', 'Mi scusi, quanto costano le pesche?', 'Quanto costano le pesche?'],
          mistakes: {
            'Scusi, quanto costano le pesce?': 'pesce is fish. To keep the "sk" of pesca, -ca becomes -che: pesche.',
            'Mi scusi, quanto costano le pesce?': 'pesce is fish. To keep the "sk" of pesca, -ca becomes -che: pesche.',
            'Quanto costano le pesce?': 'pesce is fish. To keep the "sk" of pesca, -ca becomes -che: pesche.',
            'Scusa, quanto costano le pesche?': 'scusa is for tu. A stallholder gets scusi.',
          },
          why: WHY_PL_CA + ' A stranger gets scusi.',
        },

        // Rung 5: listen & type
        {
          id: 'u1-l2-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r2',
          prompt: 'Due cornetti, per favore.', base: '', en: 'Two croissants, please.',
          answers: ['Due cornetti, per favore.'],
          mistakes: { 'Due cornetto, per favore.': 'You heard -i at the end: cornetti.' },
          why: WHY_PL_O,
        },
        {
          id: 'u1-l2-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r2',
          prompt: 'Ecco le chiavi.', base: '', en: 'Here are the keys.',
          answers: ['Ecco le chiavi.'],
          mistakes: { 'Ecco le chiave.': 'You heard -i at the end: le chiavi.' },
          why: WHY_PL_E,
        },
        {
          id: 'u1-l2-e36', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r2',
          prompt: 'Marco ha due fratelli.', base: '', en: 'Marco has two brothers.',
          answers: ['Marco ha due fratelli.'],
          mistakes: {
            'Marco a due fratelli.': 'ha ("has") is spelled with an h that you don\'t hear.',
            'Marco ha due fratello.': 'You heard -i at the end: fratelli.',
          },
          why: WHY_PL_O,
        },
        {
          id: 'u1-l2-e37', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r2',
          prompt: 'Le pesche sono buonissime.', base: '', en: 'The peaches are delicious.',
          answers: ['Le pesche sono buonissime.'],
          mistakes: { 'Le pesce sono buonissime.': 'You heard "sk": pesche, peaches. pesce, with "sh", is fish.' },
          why: WHY_PL_CA,
        },
        {
          id: 'u1-l2-e38', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r2',
          prompt: 'I nonni arrivano domani.', base: '', en: 'Grandpa and Grandma arrive tomorrow.',
          answers: ['I nonni arrivano domani.'],
          mistakes: { 'I noni arrivano domani.': 'You heard a long n: nonni.' },
          why: WHY_MIXED,
        },
        {
          id: 'u1-l2-e39', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r2',
          prompt: 'Le valigie sono in macchina.', base: '', en: 'The suitcases are in the car.',
          answers: ['Le valigie sono in macchina.', 'Le valige sono in macchina.'],
          mistakes: {
            'Le valigia sono in macchina.': 'You heard -e at the end: le valigie.',
            'Le valighe sono in macchina.': 'You heard a soft g, "j": gh would make it hard. The plural is valigie.',
          },
          why: 'valigia → valigie: after a vowel, -gia usually keeps its i in the plural (valige is also accepted).',
        },
      ],
    },

    // ---------------------------------------------------------------- exceptions
    {
      id: 'u1-l3',
      title: 'Exceptions',
      rules: [
        {
          id: 'u1-r3',
          title: 'Exceptions',
          sentence: 'un caffè → due caffè · la mano → le mani',
          marks: [
            { word: 'caffè', kind: 'underline', color: 'ultra' },
            { word: 'caffè', kind: 'circle', color: 'pink' },
            { word: 'la', kind: 'underline', color: 'ultra' },
            { word: 'o', kind: 'circle', color: 'pink' },
          ],
          why: 'Some nouns don\'t change in the plural: only the label does. That covers nouns ending in an accented vowel (la città, le città), one-syllable nouns (il re, i re), foreign words (il film, i film) and shortened words (la foto, le foto). A few nouns have the "wrong" ending for their gender: la mano is feminine, il problema and il programma are masculine. Nouns in -ista can be either: il turista, la turista.',
          table: {
            head: ['Kind', 'Singular', 'Plural'],
            rows: [
              ['accented last vowel', 'la città, il caffè', 'le città, i caffè'],
              ['one syllable', 'il re, il tè', 'i re, i tè'],
              ['foreign words', 'il film, il bar', 'i film, i bar'],
              ['shortened words', 'la foto, la bici', 'le foto, le bici'],
              ['-a but masculine', 'il problema, il programma, il papà', 'i problemi, i programmi, i papà'],
              ['-o but feminine', 'la mano', 'le mani'],
              ['-ista: either', 'il turista, la turista', 'i turisti, le turiste'],
            ],
            highlight: [4, 5],
          },
          careful: 'English speakers want to add -s, but Italian never does: i film, i bar, not films or bars. Masculine nouns in -a go to -i like other masculine nouns: i problemi, i programmi (papà stays the same because of its accent). And a few plurals are simply irregular: l\'uomo (the man) → gli uomini (the men), l\'uovo (the egg) → le uova. gli is a plural "the" that comes in Unit 2.',
          howItaliansSayIt: {
            it: 'Due caffè e due cappuccini, per favore!',
            en: 'Two coffees and two cappuccinos, please!',
            note: 'You will hear this at every bar counter. caffè ends in an accented vowel, so it stays the same; cappuccino follows the normal rule, -o → -i.',
          },
        },
      ],
      examples: [
        { it: 'Due caffè, per favore.', en: 'Two coffees, please.', reg: 'neutral' },
        { it: 'Firenze e Siena sono due città bellissime.', en: 'Florence and Siena are two beautiful cities.', reg: 'neutral' },
        { it: 'In centro ci sono tanti bar.', en: 'There are lots of bars in the centre.', reg: 'neutral' },
        { it: 'Ecco le foto delle vacanze.', en: 'Here are the holiday photos.', reg: 'neutral' },
        { it: 'Ho un problema con la camera.', en: 'I have a problem with the room.', reg: 'neutral' },
        { it: 'Ho le mani fredde.', en: 'My hands are cold.', reg: 'neutral' },
        { it: 'In agosto ci sono tanti turisti.', en: 'In August there are lots of tourists.', reg: 'neutral' },
        { it: 'Il papà di Giulia è molto simpatico.', en: "Giulia's dad is really nice.", reg: 'neutral' },
        { it: 'Prendiamo le bici?', en: 'Shall we take the bikes?', reg: 'neutral' },
        { it: 'Gli uomini giocano a carte al bar.', en: 'The men are playing cards at the bar.', reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u1-l3-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r3',
          prompt: 'Due ___, per favore.', base: '(two coffees: caffè)', en: 'Two coffees, please.',
          answers: ['caffè'], options: ['caffè', 'caffi', 'caffès'],
          mistakes: {
            caffi: 'caffè ends in an accented vowel, so it never changes: due caffè.',
            caffès: 'Italian never adds -s, and caffè ends in an accented vowel, so it stays: due caffè.',
          },
          why: WHY_ACCENT,
        },
        {
          id: 'u1-l3-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r3',
          prompt: 'Firenze e Siena sono due ___ bellissime.', base: '(cities: città)', en: 'Florence and Siena are two beautiful cities.',
          answers: ['città'], options: ['città', 'citte', 'cittàs'],
          mistakes: {
            citte: 'città ends in an accented vowel, so it never changes: due città.',
            cittàs: 'Italian plurals never add -s: due città.',
          },
          why: WHY_ACCENT,
        },
        {
          id: 'u1-l3-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r3',
          prompt: 'In centro ci sono tanti ___.', base: '(bars: bar)', en: 'There are lots of bars in the centre.',
          answers: ['bar'], options: ['bar', 'bars', 'bari'],
          mistakes: {
            bars: 'Foreign words never add -s in Italian: i bar.',
            bari: 'bar is a foreign word, so it doesn\'t change: i bar.',
          },
          why: WHY_FOREIGN,
        },
        {
          id: 'u1-l3-e04', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u1-r3',
          prompt: 'Dammi ___ mano!', base: '"Give me your hand!" (crossing a busy road)', en: 'Give me your hand!',
          answers: ['la'], options: ['il', 'la'],
          mistakes: { il: 'mano ends in -o but is feminine: la mano.' },
          why: WHY_MANO + ' (Dammi means "give me".)',
        },
        {
          id: 'u1-l3-e05', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r3',
          prompt: "C'è ___ problema.", base: '"There\'s a problem."', en: "There's a problem.",
          answers: ['un'], options: ['un', 'una'],
          mistakes: { una: 'problema ends in -a but is masculine: un problema.' },
          why: WHY_MA,
        },
        {
          id: 'u1-l3-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r3',
          prompt: '___ papà di Giulia è molto simpatico.', base: '"Giulia\'s dad is really nice."', en: "Giulia's dad is really nice.",
          answers: ['Il'], options: ['Il', 'La'],
          mistakes: { La: 'papà ends in -a but means dad, so it is masculine: il papà.' },
          why: WHY_PAPA,
        },
        {
          id: 'u1-l3-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r3',
          prompt: 'In agosto ci sono tanti ___.', base: '(tourists, men and women: turista)', en: 'In August there are lots of tourists.',
          answers: ['turisti'], options: ['turisti', 'turiste', 'turistas'],
          mistakes: {
            turiste: 'le turiste are women only. A mixed group takes the masculine plural: turisti.',
            turistas: 'turistas is Spanish. Italian plurals never add -s: turisti.',
          },
          why: WHY_ISTA,
        },
        {
          id: 'u1-l3-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r3',
          prompt: 'Ecco le ___ delle vacanze.', base: '(photos: foto)', en: 'Here are the holiday photos.',
          answers: ['foto'], options: ['foto', 'fote', 'foti'],
          mistakes: {
            fote: 'foto is short for fotografia, and shortened words don\'t change: le foto.',
            foti: 'foto is short for fotografia, and shortened words don\'t change: le foto.',
          },
          why: WHY_SHORT,
        },

        // Rung 2: type
        {
          id: 'u1-l3-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r3',
          prompt: 'Tre ___, per favore.', base: '(caffè: coffees)', en: 'Three coffees, please.',
          answers: ['caffè'],
          mistakes: {
            caffi: 'caffè ends in an accented vowel, so it never changes: tre caffè.',
            caffès: 'Italian never adds -s: tre caffè.',
          },
          why: WHY_ACCENT,
        },
        {
          id: 'u1-l3-e10', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r3',
          prompt: 'Ho due ___ con la camera.', base: '(problema: problems)', en: 'I have two problems with the room.',
          answers: ['problemi'],
          mistakes: {
            probleme: 'problema is masculine, so its plural ends in -i: problemi.',
            problema: 'After due the noun goes plural: problemi.',
          },
          why: WHY_MA,
        },
        {
          id: 'u1-l3-e11', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r3',
          prompt: 'Ho le ___ fredde.', base: '(mano: hands)', en: 'My hands are cold.',
          answers: ['mani'],
          mistakes: {
            mane: 'mano is feminine, but its plural ends in -i: le mani.',
            mano: 'le needs the plural: mani.',
          },
          why: WHY_MANO,
        },
        {
          id: 'u1-l3-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r3',
          prompt: 'Stasera ci sono due ___ in TV.', base: '(film: films)', en: 'There are two films on TV tonight.',
          answers: ['film'],
          mistakes: { films: 'Foreign words never add -s in Italian: due film.' },
          why: WHY_FOREIGN,
        },
        {
          id: 'u1-l3-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r3',
          prompt: 'Prendiamo le ___?', base: '(bici: bikes)', en: 'Shall we take the bikes?',
          answers: ['bici', 'biciclette'],
          mistakes: { bicis: 'Italian never adds -s, and bici, short for bicicletta, doesn\'t change: le bici.' },
          why: WHY_SHORT,
        },
        {
          id: 'u1-l3-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r3',
          prompt: '___ turista è tedesca.', base: '(the tourist, a woman: il or la?)', en: 'The tourist is German.',
          answers: ['La'],
          mistakes: { Il: 'For a woman, -ista nouns take la: la turista.' },
          why: WHY_ISTA,
        },
        {
          id: 'u1-l3-e15', type: 'type', reg: 'tu', rung: 2, ruleId: 'u1-r3',
          prompt: 'Guardi i ___ italiani?', base: '(programma: TV shows)', en: 'Do you watch Italian TV shows?',
          answers: ['programmi'],
          mistakes: {
            programme: 'programma is masculine, so its plural ends in -i: programmi.',
            programma: 'i needs the plural: programmi.',
          },
          why: WHY_MA,
        },
        {
          id: 'u1-l3-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r3',
          prompt: 'In Italia ci sono tante ___ antiche.', base: '(università: universities)', en: 'There are lots of old universities in Italy.',
          answers: ['università'],
          mistakes: {
            universite: 'università ends in an accented vowel, so it never changes: le università.',
            universitàs: 'Italian plurals never add -s: le università.',
          },
          why: WHY_ACCENT,
        },
        {
          id: 'u1-l3-e17', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r3',
          prompt: 'Marco e Luca fanno i ___.', base: '(barista: baristas)', en: 'Marco and Luca work as baristas.',
          answers: ['baristi'],
          mistakes: {
            bariste: 'le bariste are women only. For men, or a mixed group: i baristi.',
            barista: 'i needs the plural: baristi.',
          },
          why: WHY_ISTA,
        },

        // Rung 3: transform
        {
          id: 'u1-l3-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r3',
          prompt: 'un caffè', base: 'Make it plural: "two coffees" (due …).', en: 'two coffees',
          answers: ['due caffè'],
          mistakes: {
            'due caffi': 'caffè ends in an accented vowel, so it never changes: due caffè.',
            'due caffès': 'Italian never adds -s: due caffè.',
          },
          why: WHY_ACCENT,
        },
        {
          id: 'u1-l3-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r3',
          prompt: 'Il film è bello.', base: 'Make it plural: "The films are good." (are = sono)', en: 'The films are good.',
          answers: ['I film sono belli.'],
          mistakes: {
            'I films sono belli.': 'Foreign words never add -s in Italian: i film.',
            'Il film sono belli.': 'il is singular. In the plural it becomes i: i film.',
            'I film sono bello.': 'bello describes the films, so it goes plural too: -o becomes -i, belli.',
          },
          why: WHY_FOREIGN + ' bello follows the normal rule: belli.',
        },
        {
          id: 'u1-l3-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r3',
          prompt: 'il problema', base: 'Make it plural: "the problems" (i …).', en: 'the problems',
          answers: ['i problemi'],
          mistakes: {
            'i probleme': 'problema is masculine, so its plural ends in -i: problemi.',
            'le probleme': 'problema is masculine, so it is i problemi.',
            'i problema': 'problema must go plural too: problemi.',
          },
          why: WHY_MA,
        },
        {
          id: 'u1-l3-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r3',
          prompt: 'la mano', base: 'Make it plural: "the hands" (le …).', en: 'the hands',
          answers: ['le mani'],
          mistakes: {
            'le mane': 'mano is feminine, but its plural ends in -i: le mani.',
            'i mani': 'mano is feminine, so its plural label is le: le mani.',
            'le mano': 'mano must go plural too: mani.',
          },
          why: WHY_MANO,
        },
        {
          id: 'u1-l3-e22', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r3',
          prompt: 'il turista', base: 'Make it plural: "the tourists", a mixed group (i …).', en: 'the tourists',
          answers: ['i turisti'],
          mistakes: {
            'le turiste': 'le turiste are women only. A mixed group is i turisti.',
            'i turiste': 'For men or a mixed group, -ista becomes -isti: i turisti.',
            'i turista': 'turista must go plural too: turisti.',
          },
          why: WHY_ISTA,
        },
        {
          id: 'u1-l3-e23', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r3',
          prompt: 'la foto', base: 'Make it plural: "the photos" (le …).', en: 'the photos',
          answers: ['le foto'],
          mistakes: {
            'le fote': 'foto is short for fotografia, and shortened words don\'t change: le foto.',
            'le fotos': 'Italian never adds -s: le foto.',
            'i foto': 'foto is feminine (it is short for la fotografia): le foto.',
          },
          why: WHY_SHORT,
        },
        {
          id: 'u1-l3-e24', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r3',
          prompt: "l'uomo", base: 'Make it plural: "the men" (gli …).', en: 'the men',
          answers: ['gli uomini'],
          mistakes: {
            'gli uomi': 'uomo has an irregular plural: uomini.',
            'gli uomo': 'uomo must go plural too, and its plural is irregular: uomini.',
            'i uomini': 'Right noun! The label is gli: gli uomini (gli comes in Unit 2).',
          },
          why: WHY_UOMO,
        },
        {
          id: 'u1-l3-e25', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r3',
          prompt: 'un uovo', base: 'Make it plural: "six eggs" (sei …).', en: 'six eggs',
          answers: ['sei uova'],
          mistakes: {
            'sei uovi': 'uovo has an irregular plural: uova (and the plural is feminine: le uova).',
            'sei uovo': 'After sei the noun goes plural, and it is irregular: uova.',
          },
          why: "l'uovo → le uova is irregular: the plural ends in -a and is feminine. Learn it as a pair.",
        },

        // Rung 4: build from English
        {
          id: 'u1-l3-e26', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r3',
          prompt: 'Translate: "Two coffees, please."', base: '(at the bar counter)', en: 'Two coffees, please.',
          answers: ['Due caffè, per favore.', 'Due caffè, per piacere.'],
          mistakes: {
            'Due caffi, per favore.': 'caffè ends in an accented vowel, so it never changes: due caffè.',
            'Due caffès, per favore.': 'Italian never adds -s: due caffè.',
          },
          why: WHY_ACCENT,
        },
        {
          id: 'u1-l3-e27', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r3',
          prompt: 'Translate: "Two coffees and two cappuccinos, please."', base: '(ordering for four at the bar)', en: 'Two coffees and two cappuccinos, please.',
          answers: ['Due caffè e due cappuccini, per favore.', 'Due caffè e due cappuccini, per piacere.'],
          mistakes: {
            'Due caffè e due cappuccino, per favore.': 'cappuccino follows the normal rule, -o → -i: due cappuccini.',
            'Due caffi e due cappuccini, per favore.': 'caffè ends in an accented vowel, so it never changes: due caffè.',
          },
          why: 'caffè stays the same (accented last vowel), but cappuccino follows the normal rule: cappuccini.',
        },
        {
          id: 'u1-l3-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r3',
          prompt: 'Translate: "I have a problem."', base: '(at hotel reception)', en: 'I have a problem.',
          answers: ['Ho un problema.', 'Io ho un problema.', 'Scusi, ho un problema.'],
          mistakes: {
            'Ho una problema.': 'problema ends in -a but is masculine: un problema.',
            'Io ho una problema.': 'problema ends in -a but is masculine: un problema.',
          },
          why: WHY_MA,
        },
        {
          id: 'u1-l3-e29', type: 'build', reg: 'tu', rung: 4, ruleId: 'u1-r3',
          prompt: 'Translate: "Do you have the photos?"', base: '(to your partner, after a day out)', en: 'Do you have the photos?',
          answers: ['Hai le foto?', 'Tu hai le foto?'],
          mistakes: {
            'Hai le fote?': 'foto is a shortened word, so it doesn\'t change: le foto.',
            'Hai le fotos?': 'Italian never adds -s: le foto.',
            'Hai i foto?': 'foto is feminine (short for la fotografia): le foto.',
            'Ha le foto?': 'ha is the formal Lei form. With your partner, use tu: hai.',
          },
          why: WHY_SHORT,
        },
        {
          id: 'u1-l3-e30', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r3',
          prompt: 'Translate: "Giulia\'s dad is called Paolo."', base: '(telling a friend)', en: "Giulia's dad is called Paolo.",
          answers: ['Il papà di Giulia si chiama Paolo.', 'Il padre di Giulia si chiama Paolo.'],
          mistakes: {
            'La papà di Giulia si chiama Paolo.': 'papà ends in -a but means dad, so it is masculine: il papà.',
            'Il papa di Giulia si chiama Paolo.': 'Without the accent, papa is the Pope: papà.',
          },
          why: WHY_PAPA,
        },
        {
          id: 'u1-l3-e31', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r3',
          prompt: 'Translate: "Shall we take the bikes?"', base: '(on holiday with your partner)', en: 'Shall we take the bikes?',
          answers: ['Prendiamo le bici?', 'Prendiamo le biciclette?'],
          mistakes: {
            'Prendiamo le bicis?': 'Italian never adds -s, and bici doesn\'t change: le bici.',
            'Prendiamo i bici?': 'bici is feminine (short for la bicicletta): le bici.',
          },
          why: WHY_SHORT,
        },

        // Rung 5: listen & type
        {
          id: 'u1-l3-e32', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r3',
          prompt: 'Tre caffè e due cappuccini.', base: '', en: 'Three coffees and two cappuccinos.',
          answers: ['Tre caffè e due cappuccini.'],
          mistakes: { 'Tre caffè e due cappuccino.': 'You heard -i at the end: cappuccino follows the normal rule, cappuccini.' },
          why: 'caffè stays the same (accented last vowel), but cappuccino follows the normal rule: cappuccini.',
        },
        {
          id: 'u1-l3-e33', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r3',
          prompt: "C'è un problema con la camera.", base: '', en: "There's a problem with the room.",
          answers: ["C'è un problema con la camera."],
          mistakes: { "C'è una problema con la camera.": 'You heard un: problema is masculine.' },
          why: WHY_MA,
        },
        {
          id: 'u1-l3-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r3',
          prompt: 'Ho le mani fredde.', base: '', en: 'My hands are cold.',
          answers: ['Ho le mani fredde.'],
          mistakes: { 'Ho le mane fredde.': 'You heard -i: the plural of mano is mani.' },
          why: WHY_MANO,
        },
        {
          id: 'u1-l3-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r3',
          prompt: 'Ci sono tanti turisti.', base: '', en: 'There are lots of tourists.',
          answers: ['Ci sono tanti turisti.'],
          mistakes: { 'Ci sono tanti turiste.': 'You heard -i: turisti, a mixed group.' },
          why: WHY_ISTA,
        },
        {
          id: 'u1-l3-e36', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r3',
          prompt: 'Qui ci sono due bar.', base: '', en: 'There are two bars here.',
          answers: ['Qui ci sono due bar.'],
          mistakes: { 'Qui ci sono due bars.': 'Italian never adds -s: due bar.' },
          why: WHY_FOREIGN,
        },
        {
          id: 'u1-l3-e37', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r3',
          prompt: 'Il papà di Giulia è simpatico.', base: '', en: "Giulia's dad is nice.",
          answers: ['Il papà di Giulia è simpatico.'],
          mistakes: { 'Il papa di Giulia è simpatico.': 'You heard the stress on the last a, pa-PÀ: papà. papa is the Pope.' },
          why: WHY_PAPA,
        },
      ],
    },
  ],
  scene: {
    title: 'At the market with your partner',
    setting: 'Saturday morning at the market in Bologna. You and your partner Giulia are buying fruit and vegetables for lunch with her family.',
    lines: [
      { speaker: 'Giulia', it: 'Hai la lista della spesa?', en: 'Do you have the shopping list?', reg: 'tu' },
      { speaker: 'You', it: 'Sì: pomodori, limoni, pesche e un chilo di arance.', en: 'Yes: tomatoes, lemons, peaches and a kilo of oranges.', reg: 'neutral' },
      { speaker: 'Stallholder', it: 'Buongiorno! Cosa desidera?', en: 'Good morning! What would you like?', reg: 'lei' },
      { speaker: 'You', it: 'Buongiorno. Tre pomodori e due limoni, per favore.', en: 'Good morning. Three tomatoes and two lemons, please.', reg: 'neutral' },
      { speaker: 'Stallholder', it: 'Ecco. Altro?', en: 'Here you go. Anything else?', reg: 'neutral' },
      { speaker: 'You', it: 'Un chilo di arance. Quanto costano le pesche?', en: 'A kilo of oranges. How much are the peaches?', reg: 'neutral' },
      { speaker: 'Stallholder', it: 'Tre euro al chilo. Sono buonissime, le assaggi!', en: "Three euros a kilo. They're delicious, try them!", reg: 'lei' },
      { speaker: 'Giulia', it: 'Mmm, è vero. Prendiamo sei pesche?', en: "Mmm, it's true. Shall we get six peaches?", reg: 'neutral' },
      { speaker: 'You', it: 'Sì, e anche due mele per la nonna.', en: 'Yes, and two apples for Grandma too.', reg: 'neutral' },
      { speaker: 'Stallholder', it: "Sei pesche e due mele. Nient'altro?", en: 'Six peaches and two apples. Anything else?', reg: 'neutral' },
      { speaker: 'Giulia', it: 'Guarda, i fichi! Ti piacciono i fichi?', en: 'Look, figs! Do you like figs?', reg: 'tu' },
      { speaker: 'You', it: 'Sì, tanto! Allora anche quattro fichi.', en: 'Yes, a lot! Then four figs as well.', reg: 'neutral' },
      { speaker: 'Stallholder', it: 'Perfetto. Sono dieci euro in tutto.', en: "Perfect. That's ten euros altogether.", reg: 'neutral' },
      { speaker: 'You', it: 'Ecco a Lei. Grazie, buona giornata!', en: 'Here you are. Thanks, have a nice day!', reg: 'lei' },
    ],
    exercises: [
      {
        id: 'u1-s-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r2',
        prompt: 'Tre ___ e due limoni, per favore.', base: '(tomatoes: pomodoro)', en: 'Three tomatoes and two lemons, please.',
        answers: ['pomodori'], options: ['pomodori', 'pomodore', 'pomodoros'],
        mistakes: {
          pomodore: 'pomodoro is masculine, so -o becomes -i: pomodori.',
          pomodoros: 'Italian plurals never add -s: pomodori.',
        },
        why: WHY_PL_O,
      },
      {
        id: 'u1-s-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u1-r1',
        prompt: 'Sì, e anche due mele per ___ nonna.', base: '(Grandma: il or la?)', en: 'Yes, and two apples for Grandma too.',
        answers: ['la'], options: ['il', 'la'],
        mistakes: { il: 'nonna ends in -a, and a grandmother is feminine: la nonna.' },
        why: WHY_A,
      },
      {
        id: 'u1-s-e03', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r2',
        prompt: 'Quanto costano le ___?', base: '(pesca: peaches)', en: 'How much are the peaches?',
        answers: ['pesche'],
        mistakes: {
          pesce: 'pesce is fish. To keep the "sk" of pesca, -ca becomes -che: pesche.',
          pesci: 'pesci are fish. pesca is feminine, so -ca becomes -che: pesche.',
          pesca: 'le needs the plural: pesche.',
        },
        why: WHY_PL_CA,
      },
      {
        id: 'u1-s-e04', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u1-r3',
        prompt: 'Tre ___ al chilo.', base: '(euro: euros)', en: 'Three euros a kilo.',
        answers: ['euro'],
        mistakes: {
          euri: 'euro never changes in the plural: tre euro, dieci euro.',
          euros: 'Italian never adds -s: tre euro.',
        },
        why: 'euro is one of the nouns that never change: un euro, tre euro.',
      },
      {
        id: 'u1-s-e05', type: 'type', reg: 'tu', rung: 2, ruleId: 'u1-r2',
        prompt: 'Guarda, i ___! Ti piacciono?', base: '(fico: figs)', en: 'Look, figs! Do you like them?',
        answers: ['fichi'],
        mistakes: {
          fici: 'fici would make the c soft, "FEE-chee". -co usually becomes -chi to keep the k: fichi.',
          fico: 'i needs the plural: fichi.',
        },
        why: WHY_PL_CO,
      },
      {
        id: 'u1-s-e06', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u1-r2',
        prompt: 'una mela', base: 'Make it plural: "two apples" (due …).', en: 'two apples',
        answers: ['due mele'],
        mistakes: {
          'due meli': 'mela is feminine, so -a becomes -e: mele (meli are apple trees).',
          'due mela': 'After due the noun goes plural: mele.',
        },
        why: WHY_PL_A,
      },
      {
        id: 'u1-s-e07', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u1-r2',
        prompt: 'Translate: "Three tomatoes and two lemons, please."', base: '(to the stallholder)', en: 'Three tomatoes and two lemons, please.',
        answers: ['Tre pomodori e due limoni, per favore.', 'Tre pomodori e due limoni, per piacere.'],
        mistakes: {
          'Tre pomodori e due limone, per favore.': 'limone ends in -e, and -e becomes -i in the plural: limoni.',
          'Tre pomodoro e due limoni, per favore.': 'After tre the noun goes plural: pomodori.',
          'Tre pomodori è due limoni, per favore.': 'è means "is". "and" is e, without an accent.',
        },
        why: WHY_PL_O + ' ' + WHY_PL_E,
      },
      {
        id: 'u1-s-e08', type: 'build', reg: 'tu', rung: 4, ruleId: 'u1-r1',
        prompt: 'Translate: "Do you have the shopping list?"', base: '(to your partner, before leaving the house)', en: 'Do you have the shopping list?',
        answers: ['Hai la lista della spesa?', 'Tu hai la lista della spesa?', 'Hai la lista della spesa, amore?'],
        mistakes: {
          'Hai il lista della spesa?': 'lista ends in -a, so it is feminine: la lista.',
          'Tu hai il lista della spesa?': 'lista ends in -a, so it is feminine: la lista.',
          'Ha la lista della spesa?': 'ha is the formal Lei form. With your partner, use tu: hai.',
        },
        why: WHY_A + ' "The shopping list" is la lista della spesa.',
      },
      {
        id: 'u1-s-e09', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r2',
        prompt: 'Un chilo di arance, per favore.', base: '', en: 'A kilo of oranges, please.',
        answers: ['Un chilo di arance, per favore.', 'Un kilo di arance, per favore.'],
        mistakes: {
          'Un chilo di arancie, per favore.': 'arancia drops its i in the plural, after the n: arance.',
          'Un kilo di arancie, per favore.': 'arancia drops its i in the plural, after the n: arance.',
          'Un chilo di aranche, per favore.': 'You heard a soft c, "ch": ch would make it hard. The plural is arance.',
          'Un kilo di aranche, per favore.': 'You heard a soft c, "ch": ch would make it hard. The plural is arance.',
          'Un chilo di arancia, per favore.': 'You heard -e at the end: arance.',
        },
        why: "l'arancia → le arance: after a consonant, -cia usually drops its i in the plural.",
      },
      {
        id: 'u1-s-e10', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u1-r3',
        prompt: 'Sono dieci euro in tutto.', base: '', en: "That's ten euros altogether.",
        answers: ['Sono dieci euro in tutto.'],
        mistakes: { 'Sono dieci euri in tutto.': 'You heard euro: it never changes in the plural.' },
        why: 'euro never changes in the plural: un euro, dieci euro.',
      },
    ],
  },
};
