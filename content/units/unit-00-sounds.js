// Unit 0: Sounds. Data only (schema: spec §9; field use per type as in unit-02-articles.js).
// Audio-first (2026-10-03 spec §3–4): a recognise/type card speaks `say` before it is
// answered, so the sound comes from the audio. `base` (shown before answering) carries
// the meaning, never a respelling; `en` is shown in the feedback. In lessons 1–3 a gap
// holds the letters for the sound through the vowel you hear (ce, cio, chia, ghe, gli…),
// and the prompt with the gap filled is exactly `say`. The checker accepts a one-letter
// slip as a typo, so every minimal pair (sete/sette, ciave/chiave, perche/perché…) is a mistake key.

const WHY_SOFT = 'Before e or i, c and g are soft: c like "ch" in "church" (cena), g like "j" in "jam" (gelato).';
const WHY_HARD = 'Before a, o or u, c and g are hard (k, and g as in "go"). To keep them hard before e or i, add h: chiave, spaghetti.';
const WHY_SOFT_I = 'For a soft c or g before a, o or u, add an i that you don\'t hear: ciao ("chow"), cioccolato, giorno.';

const WHY_GLI = 'gli is one sound, like the "lli" in "million": famiglia, figlio, moglie.';
const WHY_GN = 'gn is one sound, like the "ny" in "canyon": bagno, gnocchi, cognome.';
const WHY_SC_SOFT = 'sc before e or i sounds "sh": pesce, uscita. Before a, o or u, an i you don\'t hear keeps it "sh": sciopero.';
const WHY_SC_HARD = 'sc before a, o or u sounds "sk": scusi, tasca. Before e or i, add h to keep the "sk": bruschetta, pesche.';

const WHY_DOUBLE = 'A double consonant is held longer, and it can change the word: sete (thirst) / sette (seven), nono (ninth) / nonno (grandfather).';
const WHY_DOUBLE_KEEP = 'Double letters stay double in the plural. (Plurals come in Unit 1.)';

const WHY_FINAL = 'In words of two or more syllables, a stressed last vowel is written with an accent: caffè, città, perché, lunedì.';
const WHY_ONE_SYLLABLE = 'One-syllable words usually take no accent (qui, qua, tre, su, no). They get one only to tell two words apart (è/e, lì/li, tè/te, sì/si) and in a handful of words like più, già, giù, può.';
const WHY_E = 'è with an accent means "is". e without one means "and": il caffè è caldo, tè e caffè.';
const WHY_LI = 'lì (there) has an accent. Without it, li means "them".';
const WHY_PLURAL_ACCENT = 'Words that end in an accented vowel never change in the plural: una città, due città.';

export default {
  id: 0,
  slug: 'sounds',
  title: 'Sounds',
  teaser: 'c, g, gli, gn, double letters',
  canSay: 'Rossi: erre, o, doppia esse, i.',
  lessons: [
    // ---------------------------------------------------------------- c/ch, g/gh
    {
      id: 'u0-l1',
      title: 'c, ch, g, gh',
      rules: [
        {
          id: 'u0-r1',
          title: 'c · ch · g · gh',
          sentence: 'cena · chiave · gelato · spaghetti',
          marks: [
            { word: 'c', kind: 'circle', color: 'pink' },
            { word: 'ch', kind: 'underline', color: 'ultra' },
            { word: 'g', kind: 'circle', color: 'pink' },
            { word: 'gh', kind: 'underline', color: 'ultra' },
          ],
          why: 'c and g each have two sounds. Before e or i they are soft: c like "ch" in "church" (cena, ciao), g like "j" in "jam" (gelato, giorno). Before a, o or u they are hard: k, and g as in "go" (casa, gatto). To keep them hard before e or i, Italian adds an h: chiave, che, spaghetti, ghiaccio.',
          table: {
            head: ['Spelling', 'Sound', 'Example'],
            rows: [
              ['ca · co · cu', 'k', 'casa, come, cucina'],
              ['che · chi', 'k', 'che, chiave, bicchiere'],
              ['ce · ci', '"ch" as in church', 'cena, ciao, cioccolato'],
              ['ga · go · gu', 'g as in go', 'gatto, lago, gusto'],
              ['ghe · ghi', 'g as in go', 'spaghetti, ghiaccio'],
              ['ge · gi', '"j" as in jam', 'gelato, giorno, oggi'],
            ],
            highlight: [1, 4],
          },
          careful: 'The h is never heard, and ch is never the English "ch": it is always k. Chianti is "KYAN-tee", Michele is "mee-KEH-leh". And in ciao, giorno or giallo the i isn\'t heard either: it only softens the letter, so ciao is one syllable, "chow".',
          howItaliansSayIt: {
            it: 'Chiara, con l\'acca?',
            en: 'Chiara, with an h?',
            note: 'The letter h is called acca, and "con l\'acca?" is a question you often hear when a name has ch or gh. To spell clearly over the phone, Italians use city names: "C come Como, G come Genova".',
          },
        },
      ],
      examples: [
        { it: 'Ciao, Chiara!', en: 'Hi, Chiara!', reg: 'tu' },
        { it: 'Buongiorno, signora!', en: 'Good morning!', reg: 'lei' },
        { it: "Che cos'è?", en: 'What is it?', reg: 'neutral' },
        { it: 'La cena è pronta.', en: 'Dinner is ready.', reg: 'neutral' },
        { it: 'Un gelato al cioccolato, per favore.', en: 'A chocolate ice cream, please.', reg: 'neutral' },
        { it: 'Senza ghiaccio, grazie.', en: 'No ice, thanks.', reg: 'neutral' },
        { it: "Dov'è la chiave?", en: "Where's the key?", reg: 'neutral' },
        { it: 'Che caldo oggi!', en: "It's so hot today!", reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: hear & pick (the card speaks `say`; pick the spelling you heard)
        {
          id: 'u0-l1-e01', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u0-r1',
          prompt: '___, come stai?', say: 'Ciao, come stai?', base: '(hi, how are you?)', en: 'Hi, how are you?',
          answers: ['Ciao'], options: ['Ciao', 'Chao', 'Cao'],
          mistakes: {
            Chao: 'ch is always a hard k, so chao would be "kow". The soft sound before a is spelled ci: ciao.',
            Cao: 'c before a is hard, so cao would be "kow". Add an i to soften it: ciao.',
          },
          why: WHY_SOFT_I,
        },
        {
          id: 'u0-l1-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r1',
          prompt: 'La ___ è pronta.', say: 'La cena è pronta.', base: '(dinner)', en: 'Dinner is ready.',
          answers: ['cena'], options: ['cena', 'chena'],
          mistakes: { chena: 'The h makes c hard, so chena would be "KEH-na". For the soft sound before e, write just ce: cena.' },
          why: WHY_SOFT,
        },
        {
          id: 'u0-l1-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r1',
          prompt: "Dov'è la ___?", say: "Dov'è la chiave?", base: '(the key)', en: "Where's the key?",
          answers: ['chiave'], options: ['chiave', 'ciave', 'cave'],
          mistakes: {
            ciave: 'ci + a is the soft sound, "CHAH-veh". For a hard k before i, write chi: chiave.',
            cave: 'cave (quarries) has no "y" sound after the k. The key is chi + ave: chiave.',
          },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e04', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r1',
          prompt: 'Un ___ al pistacchio, per favore.', say: 'Un gelato al pistacchio, per favore.', base: '(an ice cream)', en: 'A pistachio ice cream, please.',
          answers: ['gelato'], options: ['gelato', 'ghelato', 'gielato'],
          mistakes: {
            ghelato: 'gh is always hard, as in "go". The soft "j" sound before e is just ge: gelato.',
            gielato: 'Before e, g is already soft, so no i is needed: gelato.',
          },
          why: WHY_SOFT,
        },
        {
          id: 'u0-l1-e05', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r1',
          prompt: "Un'acqua con ___, per favore.", say: "Un'acqua con ghiaccio, per favore.", base: '(ice)', en: 'A water with ice, please.',
          answers: ['ghiaccio'], options: ['ghiaccio', 'giaccio'],
          mistakes: { giaccio: 'gi + a is the soft "j" sound, "JAT-cho". For the g of "go" before i, write ghi: ghiaccio.' },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r1',
          prompt: 'La ___ è piccola.', say: 'La cucina è piccola.', base: '(the kitchen)', en: 'The kitchen is small.',
          answers: ['cucina'], options: ['cucina', 'cuchina', 'cugina'],
          mistakes: {
            cuchina: 'chi is a hard k, so cuchina would be "koo-KEE-na". The soft "ch" before i is just ci: cucina.',
            cugina: 'cugina, with a soft g like "j", is a female cousin. The kitchen has a soft c like "ch": cucina.',
          },
          why: WHY_SOFT,
        },
        {
          id: 'u0-l1-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r1',
          prompt: 'Una ___, per favore.', say: 'Una margherita, per favore.', base: '(the classic tomato and mozzarella pizza)', en: 'A margherita, please.',
          answers: ['margherita'], options: ['margherita', 'margerita', 'margarita'],
          mistakes: {
            margerita: 'ge is soft, "mar-jeh-REE-ta". The pizza has the g of "go" before e, so it needs h: margherita.',
            margarita: 'margarita is the cocktail. The pizza has an e after the g, and the h keeps that g hard: margherita.',
          },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r1',
          prompt: "___ cos'è?", say: "Che cos'è?", base: '(what is it?)', en: 'What is it?',
          answers: ['Che'], options: ['Che', 'Ce', 'Ke'],
          mistakes: {
            Ce: 'ce is soft, "cheh". The k sound before e is spelled che.',
            Ke: 'Italian uses k only in foreign words. The k sound before e is spelled ch: che.',
          },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e17', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r1',
          prompt: "Un ___ d'acqua, per favore.", say: "Un bicchiere d'acqua, per favore.", base: '(a glass)', en: 'A glass of water, please.',
          answers: ['bicchiere'], options: ['bicchiere', 'bicciere'],
          mistakes: { bicciere: 'cci is soft, "bit-CHEH-reh". You hear a hard k before i: cch, bicchiere.' },
          why: WHY_HARD,
        },

        // Rung 2: hear & spell. The gap holds the letters for the sound, through the vowel you hear.
        {
          id: 'u0-l1-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r1',
          prompt: 'Un piatto di spa___tti.', say: 'Un piatto di spaghetti.', base: '(a plate of pasta)', en: 'A plate of spaghetti.',
          answers: ['ghe'],
          mistakes: {
            ge: 'ge is soft, "spa-JET-ti". You hear the g of "go": before e, that is ghe.',
            gie: 'gie would be soft too. You hear the g of "go": before e, that is ghe.',
          },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e10', type: 'type', reg: 'tu', rung: 2, ruleId: 'u0-r1',
          prompt: '___o, Marco!', say: 'Ciao, Marco!', base: '(hi, Marco!)', en: 'Hi, Marco!',
          answers: ['Cia'],
          mistakes: {
            cha: 'ch is always a hard k. The soft sound before a is spelled cia: ciao.',
            ca: 'ca is hard, "kow". Add an i you don\'t hear to soften it: cia, ciao.',
          },
          why: WHY_SOFT_I,
        },
        {
          id: 'u0-l1-e11', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r1',
          prompt: 'Ecco la ___ve.', say: 'Ecco la chiave.', base: "(here's the key)", en: "Here's the key.",
          answers: ['chia'],
          mistakes: {
            cia: 'cia is soft, "CHAH-veh". You hear a hard k and then a "y": chia, chiave.',
            ca: 'ca would have no "y" after the k, "KAH-veh". You hear k + y + a: chia.',
          },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r1',
          prompt: 'Buon___rno!', say: 'Buongiorno!', base: '(good morning!)', en: 'Good morning!',
          answers: ['gio'],
          mistakes: {
            go: 'go is hard, "buon-GOR-no". You hear a soft "j": add an i you don\'t hear, gio.',
            gho: 'gh is always hard. The soft "j" sound before o is spelled gio: buongiorno.',
          },
          why: WHY_SOFT_I,
        },
        {
          id: 'u0-l1-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r1',
          prompt: 'A che ora è la ___na?', say: 'A che ora è la cena?', base: '(what time is dinner?)', en: 'What time is dinner?',
          answers: ['ce'],
          mistakes: {
            che: 'che is hard, so chena would be "KEH-na". You hear a soft "ch": ce, cena.',
            cie: 'Before e, c is already soft, so no i is needed: ce, cena.',
          },
          why: WHY_SOFT,
        },
        {
          id: 'u0-l1-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r1',
          prompt: 'Senza ___ccio, grazie.', say: 'Senza ghiaccio, grazie.', base: '(no ice, thanks)', en: 'No ice, thanks.',
          answers: ['ghia'],
          mistakes: {
            gia: 'gia is soft, "JAT-cho". You hear the g of "go" and then a "y": ghia, ghiaccio.',
            ga: 'ga would have no "y" after the g. You hear g + y + a: ghia.',
          },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r1',
          prompt: 'Un ___lato al limone.', say: 'Un gelato al limone.', base: '(a lemon ice cream)', en: 'A lemon ice cream.',
          answers: ['ge'],
          mistakes: {
            ghe: 'gh is always hard. The soft "j" sound before e is just ge: gelato.',
            gie: 'Before e, g is already soft, so no i is needed: gelato.',
          },
          why: WHY_SOFT,
        },
        {
          id: 'u0-l1-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r1',
          prompt: 'Mi piace il ___ccolato.', say: 'Mi piace il cioccolato.', base: '(I like chocolate)', en: 'I like chocolate.',
          answers: ['cio'],
          mistakes: {
            co: 'co is hard, "kok-ko-LAH-to". You hear a soft "ch": add an i you don\'t hear, cio.',
            cho: 'ch is always hard. The soft sound before o is spelled cio: cioccolato.',
          },
          why: WHY_SOFT_I,
        },
        {
          id: 'u0-l1-e37', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r1',
          prompt: "Dov'è la ___sa?", say: "Dov'è la chiesa?", base: '(the church)', en: "Where's the church?",
          answers: ['chie'],
          mistakes: {
            cie: 'cie is soft, "CHEH-za". You hear a hard k and then a "y": chie, chiesa.',
            che: 'che has no "y" after the k, "KEH-za". You hear k + y + e: chie.',
          },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e38', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r1',
          prompt: '___ è?', say: 'Chi è?', base: '(who is it?)', en: 'Who is it?',
          answers: ['Chi'],
          mistakes: {
            ci: 'ci is soft, "chee". You hear a hard k before i: chi.',
            ki: 'Italian uses k only in foreign words. A hard k before i is spelled chi.',
          },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e39', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r1',
          prompt: 'Mio cu___no si chiama Luca.', say: 'Mio cugino si chiama Luca.', base: '(my cousin is called Luca)', en: 'My cousin is called Luca.',
          answers: ['gi'],
          mistakes: {
            ghi: 'ghi is the g of "go", "koo-GHEE-no". You hear a soft "j" before i: just gi, cugino.',
            ji: 'Italian doesn\'t use j. The soft "j" sound before i is spelled gi: cugino.',
          },
          why: WHY_SOFT,
        },
        {
          id: 'u0-l1-e40', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r1',
          prompt: 'Una borsa ___lla.', say: 'Una borsa gialla.', base: '(a yellow bag)', en: 'A yellow bag.',
          answers: ['gia'],
          mistakes: {
            ga: 'ga is hard, as in "go": "GAHL-la". For a soft "j" before a, add an i you don\'t hear: gia.',
            ja: 'Italian doesn\'t use j. The soft "j" sound before a is spelled gia: gialla.',
            ghia: 'ghi is the g of "go". You hear a soft "j": gia, gialla.',
          },
          why: WHY_SOFT_I,
        },

        // Rung 3: sound pairs. The sound and the meaning both decide.
        {
          id: 'u0-l1-e41', type: 'recognise', reg: 'neutral', rung: 3, ruleId: 'u0-r1',
          prompt: 'Facciamo un ___?', say: 'Facciamo un giro?', base: '(shall we go for a stroll?)', en: 'Shall we go for a stroll?',
          answers: ['giro'], options: ['giro', 'ghiro'],
          mistakes: { ghiro: 'ghiro, with the g of "go", is a dormouse! A stroll or a ride is giro, with a soft "j".' },
          why: WHY_SOFT,
        },
        {
          id: 'u0-l1-e42', type: 'recognise', reg: 'neutral', rung: 3, ruleId: 'u0-r1',
          prompt: 'Dormo come un ___.', say: 'Dormo come un ghiro.', base: '(I sleep like a log; literally, like a dormouse)', en: 'I sleep like a log.',
          answers: ['ghiro'], options: ['ghiro', 'giro'],
          mistakes: { giro: 'giro, with a soft "j", is a stroll or a ride. The dormouse has the g of "go": ghiro.' },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e43', type: 'type', reg: 'neutral', rung: 3, ruleId: 'u0-r1',
          prompt: 'Il vino è troppo ___ro.', say: 'Il vino è troppo caro.', base: '(the wine is too expensive)', en: 'The wine is too expensive.',
          answers: ['ca'],
          mistakes: {
            chia: 'chiaro means "clear". Expensive is caro: a plain k with no "y" after it, ca.',
            cia: 'cia is soft, "CHAH-ro". You hear a hard k: ca.',
            cha: 'Italian writes ch only before e or i. Before a, a plain c is already hard: ca.',
          },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e44', type: 'type', reg: 'neutral', rung: 3, ruleId: 'u0-r1',
          prompt: 'Tutto ___ro?', say: 'Tutto chiaro?', base: '(is everything clear?)', en: 'Is everything clear?',
          answers: ['chia'],
          mistakes: {
            ca: 'caro means "dear" or "expensive". Clear has a "y" after the k: chia, chiaro.',
            cia: 'cia is soft, "CHAH-ro". Clear starts with a hard k: chia.',
          },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e45', type: 'recognise', reg: 'neutral', rung: 3, ruleId: 'u0-r1',
          prompt: 'Lascio la ___.', say: 'Lascio la mancia.', base: "(I'll leave a tip)", en: "I'll leave a tip.",
          answers: ['mancia'], options: ['mancia', 'manca'],
          mistakes: { manca: 'manca, with a hard k, means "is missing". A tip is mancia: soft, with an i you don\'t hear.' },
          why: WHY_SOFT_I,
        },
        {
          id: 'u0-l1-e46', type: 'recognise', reg: 'neutral', rung: 3, ruleId: 'u0-r1',
          prompt: '___ il sale.', say: 'Manca il sale.', base: '(it needs salt)', en: 'It needs salt.',
          answers: ['Manca'], options: ['Manca', 'Mancia'],
          mistakes: { Mancia: 'mancia, soft, is a tip. "Is missing" is manca, with a hard k: ca.' },
          why: WHY_HARD,
        },

        // Rung 4: build from English (words not taught yet are glossed in base)
        {
          id: 'u0-l1-e26', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r1',
          prompt: 'Translate: "The key, please."', base: '(at hotel reception; key = chiave)', en: 'The key, please.',
          answers: ['La chiave, per favore.', '[La] chiave, per {favore|piacere}.'],
          mistakes: { 'La ciave, per favore.': 'ci + a is soft, "chah". The key starts with a hard k: chiave.' },
          why: 'chiave: ch keeps the k sound before i.',
        },
        {
          id: 'u0-l1-e27', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r1',
          prompt: 'Translate: "No ice, thanks."', base: '(ordering a drink at the bar; without = senza, ice = ghiaccio)', en: 'No ice, thanks.',
          answers: ['Senza ghiaccio, grazie.', '{Senza|Niente} ghiaccio, grazie.'],
          mistakes: { 'Senza giaccio, grazie.': 'gia is soft, "jah". Ice has the g of "go": ghiaccio.' },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e28', type: 'build', reg: 'tu', rung: 4, ruleId: 'u0-r1',
          prompt: 'Translate: "Hi, Chiara!"', base: '(greeting a friend)', en: 'Hi, Chiara!',
          answers: ['Ciao, Chiara!', 'Chiara, ciao!'],
          mistakes: {
            'Ciao, Ciara!': 'Ciara would start soft, "CHAH-ra". Chiara starts with a hard k: Ch.',
            'Chiao, Chiara!': 'Chiao would be "kyow". The greeting is soft: ciao.',
          },
          why: 'ciao is soft (ci + a, "chow"); Chiara is hard (chi + a, "KYAH-ra").',
        },
        {
          id: 'u0-l1-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r1',
          prompt: 'Translate: "What time is dinner?"', base: '(asking at your hotel; what time = a che ora, dinner = cena)', en: 'What time is dinner?',
          answers: ['A che ora è la cena?', "A che ora {è|c'è} [la] cena?", 'A che ora si cena?'],
          mistakes: {
            'A ce ora è la cena?': 'ce is soft, "cheh". "What" is che, with a hard k.',
            'A che ora è la chena?': 'chena would be "KEH-na". Dinner is soft: cena.',
          },
          why: 'che is hard ("keh"), cena is soft ("CHEH-na"): the h makes the difference.',
        },
        {
          id: 'u0-l1-e30', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r1',
          prompt: 'Translate: "A chocolate ice cream, please."', base: '(at the gelateria; chocolate = cioccolato; the flavour comes after al)', en: 'A chocolate ice cream, please.',
          answers: ['Un gelato al cioccolato, per favore.', 'Un gelato al cioccolato, per piacere.'],
          mistakes: {
            'Un ghelato al cioccolato, per favore.': 'gh is hard. gelato has a soft g: ge.',
            'Un gelato al ciocolato, per favore.': 'cioccolato has a long cc in the middle: ciok-ko-LAH-to.',
            'Un gelato al cocolato, per favore.': 'co is hard. Chocolate starts soft: cio.',
          },
          why: 'gelato and cioccolato are both soft: ge, and ci before o.',
        },

        // Rung 5: listen & type
        {
          id: 'u0-l1-e31', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r1',
          prompt: 'Che bella chiesa!', base: '', en: 'What a beautiful church!',
          answers: ['Che bella chiesa!'],
          mistakes: {
            'Ce bella chiesa!': 'You heard a hard k ("keh"): that is che.',
            'Che bella ciesa!': 'You heard a hard k ("KYEH-za"): before i, that is chi, chiesa.',
          },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e32', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r1',
          prompt: 'Senza ghiaccio, grazie.', base: '', en: 'No ice, thanks.',
          answers: ['Senza ghiaccio, grazie.'],
          mistakes: { 'Senza giaccio, grazie.': 'You heard the g of "go": before i, that is ghi, ghiaccio.' },
          why: WHY_HARD,
        },
        {
          id: 'u0-l1-e33', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r1',
          prompt: 'La cena è pronta.', base: '', en: 'Dinner is ready.',
          answers: ['La cena è pronta.'],
          mistakes: { 'La chena è pronta.': 'You heard a soft "ch": before e, that is plain ce, cena.' },
          why: WHY_SOFT,
        },
        {
          id: 'u0-l1-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r1',
          prompt: 'Buongiorno, Chiara!', base: '', en: 'Good morning, Chiara!',
          answers: ['Buongiorno, Chiara!', 'Buon giorno, Chiara!'],
          mistakes: {
            'Buongorno, Chiara!': 'You heard a soft "j": before o, that needs gi, giorno.',
            'Buongiorno, Ciara!': 'You heard a hard k and a "y": Chiara starts with chi.',
          },
          why: WHY_SOFT_I,
        },
        {
          id: 'u0-l1-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r1',
          prompt: 'Un gelato, per favore.', base: '', en: 'An ice cream, please.',
          answers: ['Un gelato, per favore.'],
          mistakes: { 'Un ghelato, per favore.': 'You heard a soft "j": that is plain ge. gh would be the g of "go".' },
          why: WHY_SOFT,
        },
        {
          id: 'u0-l1-e36', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r1',
          prompt: 'Due bicchieri, per favore.', base: '', en: 'Two glasses, please.',
          answers: ['Due bicchieri, per favore.'],
          mistakes: {
            'Due biccieri, per favore.': 'You heard a hard k ("bik-KYEH-ree"): before i, that is ch, bicchieri.',
            'Due bichieri, per favore.': 'You heard a long k: bicchieri has cch.',
          },
          why: WHY_HARD,
        },
      ],
    },

    // ---------------------------------------------------------------- gli, gn, sc
    {
      id: 'u0-l2',
      title: 'gli, gn, sc',
      rules: [
        {
          id: 'u0-r2',
          title: 'gli · gn · sc',
          sentence: 'figlio · bagno · pesce · scusi',
          marks: [
            { word: 'gli', kind: 'circle', color: 'pink' },
            { word: 'gn', kind: 'circle', color: 'pink' },
            { word: 'sc', kind: 'underline', color: 'pink' },
            { word: 'sc', kind: 'underline', color: 'ultra' },
          ],
          why: 'Three letter groups spell sounds that English writes differently. gli is like the "lli" in "million" (figlio, famiglia). gn is like the "ny" in "canyon" (bagno, gnocchi). sc before e or i is "sh" (pesce, uscita); before a, o, u, or with an h, it is "sk" (scusi, bruschetta).',
          table: {
            head: ['Spelling', 'Sound', 'Example'],
            rows: [
              ['gli', '"lli" as in million', 'famiglia, figlio, moglie'],
              ['gn', '"ny" as in canyon', 'bagno, gnocchi, cognome'],
              ['sce · sci', 'sh', 'pesce, uscita, sciopero'],
              ['sca · sco · scu', 'sk', 'scusi, tasca, fresco'],
              ['sche · schi', 'sk', 'bruschetta, pesche'],
            ],
            highlight: [2, 4],
          },
          careful: 'Bruschetta is "brus-KET-ta", not "brushetta": sch is always "sk". In sciopero or sciarpa the i isn\'t heard, it only keeps sc soft: "SHO-pe-ro". And gl before a, e, o or u is a plain g + l: inglese is "in-GLEH-zeh".',
          howItaliansSayIt: {
            it: 'Prego? Il cognome?',
            en: 'Sorry? Your surname?',
            note: 'At a counter, "Prego?" with a rising voice means "Sorry, could you say that again?". cognome is "ko-NYO-meh": gn is one sound, not g + n.',
          },
        },
      ],
      examples: [
        { it: 'Questa è la mia famiglia.', en: 'This is my family.', reg: 'neutral' },
        { it: 'Il figlio di Anna si chiama Luca.', en: "Anna's son is called Luca.", reg: 'neutral' },
        { it: "Scusi, dov'è il bagno?", en: "Excuse me, where's the bathroom?", reg: 'lei' },
        { it: 'Gli gnocchi sono buonissimi.', en: 'The gnocchi are delicious.', reg: 'neutral' },
        { it: "Domani c'è sciopero.", en: "There's a strike tomorrow.", reg: 'neutral' },
        { it: 'Prendo il pesce, grazie.', en: "I'll have the fish, thanks.", reg: 'neutral' },
        { it: "Dov'è l'uscita?", en: "Where's the exit?", reg: 'neutral' },
        { it: 'Una bruschetta e un bicchiere di vino.', en: 'A bruschetta and a glass of wine.', reg: 'neutral' },
        { it: 'Conosci mia moglie?', en: 'Do you know my wife?', reg: 'tu' },
      ],
      exercises: [
        // Rung 1: hear & pick (the card speaks `say`; pick the spelling you heard)
        {
          id: 'u0-l2-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r2',
          prompt: 'Questa è la mia ___.', say: 'Questa è la mia famiglia.', base: '(family)', en: 'This is my family.',
          answers: ['famiglia'], options: ['famiglia', 'familia', 'famillia'],
          mistakes: {
            familia: 'familia is the Spanish spelling. Italian spells the "lly" sound gli: famiglia.',
            famillia: 'lli is a double l + i, "fa-MEEL-lya". The "lly" sound is spelled gli: famiglia.',
          },
          why: WHY_GLI,
        },
        {
          id: 'u0-l2-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r2',
          prompt: "Dov'è il ___?", say: "Dov'è il bagno?", base: '(the bathroom)', en: "Where's the bathroom?",
          answers: ['bagno'], options: ['bagno', 'banio'],
          mistakes: { banio: 'Italian spells the "ny" of canyon gn: bagno. ni would be a plain n plus a quick y, a lighter sound.' },
          why: WHY_GN,
        },
        {
          id: 'u0-l2-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r2',
          prompt: 'Un piatto di ___, per favore.', say: 'Un piatto di gnocchi, per favore.', base: '(potato dumplings)', en: 'A plate of gnocchi, please.',
          answers: ['gnocchi'], options: ['gnocchi', 'niocchi', 'gnocci'],
          mistakes: {
            niocchi: 'The "ny" sound is spelled gn: gnocchi.',
            gnocci: 'cci would be soft, "NYOT-chee". The hard k before i needs h: gnocchi.',
          },
          why: WHY_GN,
        },
        {
          id: 'u0-l2-e04', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r2',
          prompt: 'Prendo il ___.', say: 'Prendo il pesce.', base: '(the fish)', en: "I'll have the fish.",
          answers: ['pesce'], options: ['pesce', 'pesche', 'pesse'],
          mistakes: {
            pesche: 'sch is always "sk": pesche ("PES-keh") are peaches. Fish is pesce.',
            pesse: 'ss is a long s, not "sh". The "sh" sound before e is sc: pesce.',
          },
          why: WHY_SC_SOFT,
        },
        {
          id: 'u0-l2-e05', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u0-r2',
          prompt: "___, dov'è la stazione?", say: "Scusi, dov'è la stazione?", base: "(excuse me, where's the station?)", en: "Excuse me, where's the station?",
          answers: ['Scusi'], options: ['Scusi', 'Sciusi', 'Shusi'],
          mistakes: {
            Sciusi: 'sci + u would be "SHOO-zee". For "sk" before u, write just sc: scusi.',
            Shusi: 'Italian doesn\'t use sh for its own words. "sk" before u is sc: scusi.',
          },
          why: WHY_SC_HARD,
        },
        {
          id: 'u0-l2-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r2',
          prompt: 'Una ___ al pomodoro.', say: 'Una bruschetta al pomodoro.', base: '(grilled bread with tomatoes)', en: 'A tomato bruschetta.',
          answers: ['bruschetta'], options: ['bruschetta', 'bruscetta'],
          mistakes: { bruscetta: 'sce is "sh", so bruscetta would be "bru-SHET-ta". For "sk" before e, add h: bruschetta.' },
          why: WHY_SC_HARD,
        },
        {
          id: 'u0-l2-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r2',
          prompt: "Dov'è l'___?", say: "Dov'è l'uscita?", base: '(the exit)', en: "Where's the exit?",
          answers: ['uscita'], options: ['uscita', 'uschita', 'ussita'],
          mistakes: {
            uschita: 'sch is always "sk", "oo-SKEE-ta". You hear "sh" before i: plain sc, uscita.',
            ussita: 'ss is a long s, not "sh". Before i, "sh" is spelled sc: uscita.',
          },
          why: WHY_SC_SOFT,
        },
        {
          id: 'u0-l2-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r2',
          prompt: 'Il ___ di Anna si chiama Luca.', say: 'Il figlio di Anna si chiama Luca.', base: '(son)', en: "Anna's son is called Luca.",
          answers: ['figlio'], options: ['figlio', 'filio', 'figlo'],
          mistakes: {
            filio: 'li is a plain l plus a quick "y", a lighter sound. The "lli" sound of million is spelled gli: figlio.',
            figlo: 'gl before o is a plain g + l, "FEE-glo". Keep the i: figlio.',
          },
          why: WHY_GLI,
        },

        // Rung 2: hear & spell. The gap holds the letters for the sound, through the vowel you hear.
        {
          id: 'u0-l2-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r2',
          prompt: 'Il fi___ di Anna.', say: 'Il figlio di Anna.', base: "(Anna's son)", en: "Anna's son.",
          answers: ['glio'],
          mistakes: {
            lio: 'lio is a plain l plus a quick "y", a lighter sound. The "lli" sound of million is spelled gli: glio, figlio.',
            glo: 'glo is a plain g + l, "FEE-glo". Keep the i: glio, figlio.',
          },
          why: WHY_GLI,
        },
        {
          id: 'u0-l2-e10', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r2',
          prompt: 'Il co___me, per favore.', say: 'Il cognome, per favore.', base: '(your surname, please)', en: 'Your surname, please.',
          answers: ['gno'],
          mistakes: {
            nio: 'Italian spells the "ny" of canyon gn: gno, cognome. nio would be a plain n plus a quick y.',
            no: 'With a plain n it would be "ko-NO-meh". You hear "ny": gno, cognome.',
            gnio: 'gn already makes the "ny" sound, so no i is needed: gno.',
          },
          why: WHY_GN,
        },
        {
          id: 'u0-l2-e11', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r2',
          prompt: "Dov'è l'u___ta?", say: "Dov'è l'uscita?", base: "(where's the exit?)", en: "Where's the exit?",
          answers: ['sci'],
          mistakes: {
            shi: 'Italian spells "sh" as sc before i or e: sci, uscita.',
            schi: 'sch is "sk", "oo-SKEE-ta". For "sh", write just sc: sci, uscita.',
          },
          why: WHY_SC_SOFT,
        },
        {
          id: 'u0-l2-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r2',
          prompt: "Domani c'è ___pero.", say: "Domani c'è sciopero.", base: "(there's a strike tomorrow)", en: "There's a strike tomorrow.",
          answers: ['scio'],
          mistakes: {
            sco: 'sco is "sk", "SKO-pe-ro". An i you don\'t hear makes it "sh": scio, sciopero.',
            sho: 'Italian spells "sh" with sc. Before o, add an i you don\'t hear: scio.',
          },
          why: WHY_SC_SOFT,
        },
        {
          id: 'u0-l2-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r2',
          prompt: 'Gli ___cchi sono pronti.', say: 'Gli gnocchi sono pronti.', base: '(the potato dumplings are ready)', en: 'The gnocchi are ready.',
          answers: ['gno'],
          mistakes: {
            no: 'nocchi would be "NOK-kee". You hear "ny": gno, gnocchi.',
            nio: 'The "ny" sound is spelled gn: gno, gnocchi.',
          },
          why: WHY_GN,
        },
        {
          id: 'u0-l2-e14', type: 'type', reg: 'tu', rung: 2, ruleId: 'u0-r2',
          prompt: 'Ti presento mia mo___.', say: 'Ti presento mia moglie.', base: '(let me introduce my wife)', en: 'Let me introduce my wife.',
          answers: ['glie'],
          mistakes: {
            le: 'mole would be "MO-leh". You hear the "lly" sound: glie, moglie.',
            lie: 'lie is a plain l plus a quick "y", a lighter sound. The "lli" sound of million is spelled gli: glie, moglie.',
          },
          why: WHY_GLI,
        },
        {
          id: 'u0-l2-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r2',
          prompt: 'Una ___rpa rossa.', say: 'Una sciarpa rossa.', base: '(a red scarf)', en: 'A red scarf.',
          answers: ['scia'],
          mistakes: {
            sca: 'sca is "sk": scarpa is a shoe! For "sh" before a, add an i you don\'t hear: scia, sciarpa.',
            scha: 'sch is always "sk". For "sh" before a, write scia: sciarpa.',
            sha: 'Italian spells "sh" with sc. Before a, add an i you don\'t hear: scia.',
          },
          why: WHY_SC_SOFT,
        },
        {
          id: 'u0-l2-e17', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r2',
          prompt: "Una botti___ d'acqua, per favore.", say: "Una bottiglia d'acqua, per favore.", base: '(a bottle of water, please)', en: 'A bottle of water, please.',
          answers: ['glia'],
          mistakes: {
            lia: 'lia is a plain l plus a quick "y", a lighter sound. The "lli" sound of million is spelled gli: glia, bottiglia.',
            gla: 'gla is a plain g + l. Keep the i: glia, bottiglia.',
          },
          why: WHY_GLI,
        },
        {
          id: 'u0-l2-e38', type: 'type', reg: 'lei', rung: 2, ruleId: 'u0-r2',
          prompt: '___si, signora!', say: 'Scusi, signora!', base: '(excuse me, madam!)', en: 'Excuse me, madam!',
          answers: ['Scu'],
          mistakes: {
            sciu: 'sciu would be "shoo". You hear "sk" before u: plain scu, scusi.',
            schu: 'Italian writes sch only before e or i. Before u, sc is already "sk": scu.',
            sku: 'Italian uses k only in foreign words. "sk" before u is spelled scu.',
          },
          why: WHY_SC_HARD,
        },
        {
          id: 'u0-l2-e39', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r2',
          prompt: 'Il pane è fre___.', say: 'Il pane è fresco.', base: '(the bread is fresh)', en: 'The bread is fresh.',
          answers: ['sco'],
          mistakes: {
            scio: 'scio would be "sho". You hear "sk" before o: plain sco, fresco.',
            scho: 'Italian writes sch only before e or i. Before o, sc is already "sk": sco.',
            sko: 'Italian uses k only in foreign words. "sk" before o is spelled sco.',
          },
          why: WHY_SC_HARD,
        },
        {
          id: 'u0-l2-e40', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r2',
          prompt: 'Mi piace il pe___.', say: 'Mi piace il pesce.', base: '(I like fish)', en: 'I like fish.',
          answers: ['sce'],
          mistakes: {
            sche: 'sche is "sk", and pesche are peaches. You hear "sh" before e: sce, pesce.',
            scie: 'Before e, sc is already "sh", so no i is needed: sce.',
            she: 'Italian spells "sh" with sc: sce, pesce.',
          },
          why: WHY_SC_SOFT,
        },
        {
          id: 'u0-l2-e41', type: 'type', reg: 'lei', rung: 2, ruleId: 'u0-r2',
          prompt: 'Buonasera, si___ra!', say: 'Buonasera, signora!', base: '(good evening, madam!)', en: 'Good evening, madam!',
          answers: ['gno'],
          mistakes: {
            nio: 'The "ny" sound is spelled gn: gno, signora.',
            no: 'With a plain n it would be "see-NO-ra". You hear "ny": gno, signora.',
            gnio: 'gn already makes the "ny" sound, so no i is needed: gno.',
          },
          why: WHY_GN,
        },

        // Rung 3: sound pairs. The sound and the meaning both decide.
        {
          id: 'u0-l2-e16', type: 'type', reg: 'neutral', rung: 3, ruleId: 'u0-r2',
          prompt: 'Le pe___ sono mature.', say: 'Le pesche sono mature.', base: '(the peaches are ripe)', en: 'The peaches are ripe.',
          answers: ['sche'],
          mistakes: {
            sce: 'sce is "sh": pesce is fish! Peaches have "sk", and before e that needs h: sche.',
            ske: 'Italian uses k only in foreign words. "sk" before e is spelled sche.',
          },
          why: WHY_SC_HARD,
        },
        {
          id: 'u0-l2-e42', type: 'recognise', reg: 'neutral', rung: 3, ruleId: 'u0-r2',
          prompt: 'Che belle ___!', say: 'Che belle pesche!', base: '(what lovely peaches!)', en: 'What lovely peaches!',
          answers: ['pesche'], options: ['pesche', 'pesce'],
          mistakes: { pesce: 'pesce, with "sh", is fish. Peaches have "sk": pesche.' },
          why: WHY_SC_HARD,
        },
        {
          id: 'u0-l2-e43', type: 'recognise', reg: 'neutral', rung: 3, ruleId: 'u0-r2',
          prompt: 'Compro un paio di ___.', say: 'Compro un paio di scarpe.', base: "(I'm buying a pair of shoes)", en: "I'm buying a pair of shoes.",
          answers: ['scarpe'], options: ['scarpe', 'sciarpe'],
          mistakes: { sciarpe: 'sciarpe, with "sh", are scarves. Shoes have "sk": scarpe.' },
          why: WHY_SC_HARD,
        },
        {
          id: 'u0-l2-e44', type: 'type', reg: 'neutral', rung: 3, ruleId: 'u0-r2',
          prompt: 'È un so___!', say: 'È un sogno!', base: "(it's a dream!)", en: "It's a dream!",
          answers: ['gno'],
          mistakes: {
            no: 'sono means "I am" or "they are". A dream has the "ny" sound: gno, sogno.',
            nio: 'The "ny" sound is spelled gn: gno, sogno.',
          },
          why: WHY_GN,
        },
        {
          id: 'u0-l2-e45', type: 'type', reg: 'neutral', rung: 3, ruleId: 'u0-r2',
          prompt: 'Una casa in campa___.', say: 'Una casa in campagna.', base: '(a house in the countryside)', en: 'A house in the countryside.',
          answers: ['gna'],
          mistakes: {
            na: 'campana is a bell! The countryside has the "ny" sound: gna, campagna.',
            nia: 'The "ny" sound is spelled gn: gna, campagna.',
          },
          why: WHY_GN,
        },

        // Rung 4: build from English (words not taught yet are glossed in base)
        {
          id: 'u0-l2-e26', type: 'build', reg: 'lei', rung: 4, ruleId: 'u0-r2',
          prompt: 'Translate: "Excuse me, where\'s the bathroom?"', base: "(to a waiter; excuse me = scusi, where's = dov'è, bathroom = bagno)", en: "Excuse me, where's the bathroom?",
          answers: ["Scusi, dov'è il bagno?", "[Mi] scusi, {dov'è|dove è} il bagno?"],
          mistakes: {
            "Scusi, dov'è il banio?": 'The "ny" sound is gn: bagno.',
            "Scusi, dovè il bagno?": "Write dov'è with an apostrophe: it is dove + è, and the e of dove drops.",
            "Scusa, dov'è il bagno?": 'scusa is for friends and family. A waiter gets scusi.',
          },
          why: WHY_GN + ' A stranger gets scusi.',
        },
        {
          id: 'u0-l2-e27', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r2',
          prompt: 'Translate: "Where\'s the exit?"', base: "(in a museum; where's = dov'è, the exit = l'uscita)", en: "Where's the exit?",
          answers: ["Dov'è l'uscita?", "{Dov'è|Dove è} l'uscita?", "[Mi] scusi, {dov'è|dove è} l'uscita?"],
          mistakes: {
            "Dov'è l'ushita?": 'Italian spells "sh" as sc: uscita.',
            "Dov'è l'uschita?": 'sch is "sk". For "sh", write sc: uscita.',
            "Dovè l'uscita?": "Write dov'è with an apostrophe: it is dove + è, and the e of dove drops.",
          },
          why: WHY_SC_SOFT,
        },
        {
          id: 'u0-l2-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r2',
          prompt: 'Translate: "The gnocchi are delicious."', base: '(at dinner with the family; the = gli, are = sono, delicious = buonissimi)', en: 'The gnocchi are delicious.',
          answers: ['Gli gnocchi sono buonissimi.', 'Gli gnocchi sono {buonissimi|squisiti|deliziosi|ottimi|buoni}.'],
          mistakes: {
            'Gli nocchi sono buonissimi.': 'The "ny" sound is gn: gnocchi.',
            'I gnocchi sono buonissimi.': 'Masculine plural words starting with gn take gli for "the": gli gnocchi. (Articles come in Unit 2.)',
          },
          why: WHY_GN + ' For "the", words starting with gn take gli in the plural (Unit 2).',
        },
        {
          id: 'u0-l2-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r2',
          prompt: 'Translate: "There\'s a strike tomorrow."', base: "(warning your partner about the trains; tomorrow = domani, there's = c'è, strike = sciopero)", en: "There's a strike tomorrow.",
          answers: ["Domani c'è sciopero.", "Domani c'è {lo|uno|} sciopero.", "C'è {lo|uno|} sciopero domani."],
          mistakes: { "Domani c'è scopero.": 'sco would be "sko". For "sh" before o, add an i you don\'t hear: sciopero.' },
          why: WHY_SC_SOFT,
        },
        {
          id: 'u0-l2-e30', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r2',
          prompt: 'Translate: "A bottle of water, please."', base: "(at a restaurant; bottle = bottiglia, of water = d'acqua)", en: 'A bottle of water, please.',
          answers: ["Una bottiglia d'acqua, per favore.", "Una bottiglia {d'acqua|di acqua}, per {favore|piacere}."],
          mistakes: { "Una bottilia d'acqua, per favore.": 'The "lly" sound is gli: bottiglia.' },
          why: WHY_GLI,
        },
        {
          id: 'u0-l2-e31', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r2',
          prompt: 'Translate: "This is my family."', base: '(showing a photo to a friend; this is = questa è, my = la mia, family = famiglia)', en: 'This is my family.',
          answers: ['Questa è la mia famiglia.', 'Ecco la mia famiglia.'],
          mistakes: {
            'Questa è la mia familia.': 'familia is Spanish. Italian spells the "lly" sound gli: famiglia.',
            'Questa è mia famiglia.': 'With famiglia, Italians keep "the": la mia famiglia.',
          },
          why: WHY_GLI,
        },

        // Rung 5: listen & type
        {
          id: 'u0-l2-e32', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r2',
          prompt: "Dov'è il bagno?", base: '', en: "Where's the bathroom?",
          answers: ["Dov'è il bagno?", 'Dove è il bagno?'],
          mistakes: {
            "Dov'è il banio?": 'You heard one "ny" sound: that is gn, bagno.',
            'Dovè il bagno?': "Right sound! Write dov'è with an apostrophe: it is dove + è (where is), and the e of dove drops.",
            'Dove il bagno?': "You need \"is\" too: dov'è is dove + è (where is).",
          },
          why: WHY_GN,
        },
        {
          id: 'u0-l2-e33', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r2',
          prompt: 'Il pesce è fresco.', base: '', en: 'The fish is fresh.',
          answers: ['Il pesce è fresco.'],
          mistakes: {
            'Il pesche è fresco.': 'You heard "sh": that is sc + e, pesce. pesche ("sk") are peaches.',
            'Il pesce è fresho.': 'fresco has "sk": sc before o.',
          },
          why: WHY_SC_SOFT,
        },
        {
          id: 'u0-l2-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r2',
          prompt: 'Una bruschetta, per favore.', base: '', en: 'A bruschetta, please.',
          answers: ['Una bruschetta, per favore.'],
          mistakes: { 'Una bruscetta, per favore.': 'You heard "sk": before e, that needs sch, bruschetta.' },
          why: WHY_SC_HARD,
        },
        {
          id: 'u0-l2-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r2',
          prompt: 'Il cognome, per favore.', base: '', en: 'Your surname, please.',
          answers: ['Il cognome, per favore.'],
          mistakes: {
            'Il conome, per favore.': 'You heard "ny": that is gn, cognome.',
            'Il coniome, per favore.': 'The "ny" sound is spelled gn, with no i: cognome.',
          },
          why: WHY_GN,
        },
        {
          id: 'u0-l2-e36', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r2',
          prompt: 'La mia famiglia è grande.', base: '', en: 'My family is big.',
          answers: ['La mia famiglia è grande.'],
          mistakes: { 'La mia familia è grande.': 'You heard the "lli" of "million": Italian spells it gli, famiglia.' },
          why: WHY_GLI,
        },
        {
          id: 'u0-l2-e37', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r2',
          prompt: 'Lo sciopero è domani.', base: '', en: 'The strike is tomorrow.',
          answers: ['Lo sciopero è domani.'],
          mistakes: { 'Lo scopero è domani.': 'You heard "sh": before o, that is sci, sciopero.' },
          why: WHY_SC_SOFT,
        },
      ],
    },

    // ---------------------------------------------------------------- double consonants
    {
      id: 'u0-l3',
      title: 'Double letters',
      rules: [
        {
          id: 'u0-r3',
          title: 'Double letters',
          sentence: 'Ho sete · Sono le sette',
          marks: [
            { word: 't', kind: 'underline', color: 'ultra' },
            { word: 'tt', kind: 'circle', color: 'pink' },
          ],
          why: 'A double consonant is held a beat longer, and it changes the word: sete is thirst, sette is seven. Say it as if the letter closes one syllable and opens the next: set-te, non-no, pal-la.',
          table: {
            head: ['Single', 'Double', 'Meaning'],
            rows: [
              ['sete', 'sette', 'thirst · seven'],
              ['nono', 'nonno', 'ninth · grandfather'],
              ['casa', 'cassa', 'house · till'],
              ['pala', 'palla', 'shovel · ball'],
              ['caro', 'carro', 'dear, expensive · cart'],
            ],
            highlight: [1],
          },
          careful: 'English doubles letters without changing the sound (dinner, coffee), so English speakers tend to skip them. In Italian you hear them and must write them: nono is "ninth", not grandfather. cc and gg before e or i stay soft, just longer: cappuccino, oggi.',
          howItaliansSayIt: {
            it: 'Rossi: erre, o, doppia esse, i.',
            en: 'Rossi: R, O, double S, I.',
            note: 'When spelling, Italians say doppia (double) for a double letter, or "con due esse" (with two s\'s). Hold a double consonant a beat longer, like the kk in "bookkeeper".',
          },
        },
      ],
      examples: [
        { it: 'Ho sete.', en: "I'm thirsty.", reg: 'neutral' },
        { it: 'Sono le sette.', en: "It's seven o'clock.", reg: 'neutral' },
        { it: "Il nonno di Marco ha novant'anni.", en: "Marco's grandfather is ninety.", reg: 'neutral' },
        { it: 'Abito al nono piano.', en: 'I live on the ninth floor.', reg: 'neutral' },
        { it: "Scusi, dov'è la cassa?", en: "Excuse me, where's the till?", reg: 'lei' },
        { it: 'Una camera doppia per due notti.', en: 'A double room for two nights.', reg: 'neutral' },
        { it: 'Un cappuccino, per favore.', en: 'A cappuccino, please.', reg: 'neutral' },
        { it: 'Il vino è troppo caro.', en: 'The wine is too expensive.', reg: 'neutral' },
        { it: 'Tutto bene?', en: 'All good?', reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u0-l3-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r3',
          prompt: 'Ho ___.', base: '"I\'m thirsty."', en: "I'm thirsty.",
          answers: ['sete'], options: ['sete', 'sette'],
          mistakes: { sette: 'sette, with a long tt, is "seven". Thirst is sete, one t.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r3',
          prompt: 'Sono le ___.', base: '"It\'s seven o\'clock."', en: "It's seven o'clock.",
          answers: ['sette'], options: ['sete', 'sette'],
          mistakes: { sete: 'sete, with one t, is "thirst". Seven has a long tt: sette.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r3',
          prompt: "Il ___ di Marco ha novant'anni.", base: '"Marco\'s grandfather is ninety."', en: "Marco's grandfather is ninety.",
          answers: ['nonno'], options: ['nono', 'nonno'],
          mistakes: { nono: 'nono, with one n, means "ninth". Grandfather is nonno.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e04', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r3',
          prompt: 'Abito al ___ piano.', base: '"I live on the ninth floor."', en: 'I live on the ninth floor.',
          answers: ['nono'], options: ['nono', 'nonno'],
          mistakes: { nonno: 'nonno is grandfather. Ninth has a single n: nono.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e05', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u0-r3',
          prompt: "Scusi, dov'è la ___?", base: '"Excuse me, where\'s the till?" (in a shop)', en: "Excuse me, where's the till?",
          answers: ['cassa'], options: ['casa', 'cassa'],
          mistakes: { casa: 'casa, with one s, is "house". The till has a long ss: cassa.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r3',
          prompt: 'Torniamo a ___?', base: '"Shall we go home?"', en: 'Shall we go home?',
          answers: ['casa'], options: ['casa', 'cassa'],
          mistakes: { cassa: 'cassa is the till. Home is casa, with one s.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r3',
          prompt: 'Il bambino gioca con la ___.', base: '"The child is playing with the ball."', en: 'The child is playing with the ball.',
          answers: ['palla'], options: ['pala', 'palla'],
          mistakes: { pala: 'pala, with one l, is a shovel. Ball has a long ll: palla.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r3',
          prompt: 'Il vino è troppo ___.', base: '"The wine is too expensive."', en: 'The wine is too expensive.',
          answers: ['caro'], options: ['caro', 'carro'],
          mistakes: { carro: 'carro, with a long rr, is a cart. Expensive is caro, one r.' },
          why: WHY_DOUBLE,
        },

        // Rung 2: fill the missing letters
        {
          id: 'u0-l3-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r3',
          prompt: 'Una camera do___ia, per favore.', base: '(a double room)', en: 'A double room, please.',
          answers: ['pp'],
          mistakes: { p: 'The p in doppia is long: dop-pia.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e10', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r3',
          prompt: 'Per due no___i.', base: '(nights)', en: 'For two nights.',
          answers: ['tt'],
          mistakes: { t: 'Hold the t: not-ti. noti, with one t, means "known".' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e11', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r3',
          prompt: 'Un ca___uccino, per favore.', base: '(cappuccino)', en: 'A cappuccino, please.',
          answers: ['pp'],
          mistakes: { p: 'cappuccino has two doubles: cap-puc-ci-no.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r3',
          prompt: 'Ho se___e.', base: '"I\'m thirsty."', en: "I'm thirsty.",
          answers: ['t'],
          mistakes: { tt: 'sette, with tt, is "seven". Thirst is sete, one t.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r3',
          prompt: 'Sono le se___e.', base: '"It\'s seven o\'clock."', en: "It's seven o'clock.",
          answers: ['tt'],
          mistakes: { t: 'sete, with one t, is "thirst". Seven is set-te.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r3',
          prompt: 'Il no___o di Giulia.', base: '(grandfather)', en: "Giulia's grandfather.",
          answers: ['nn'],
          mistakes: { n: 'nono, with one n, means "ninth". Grandfather is non-no.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r3',
          prompt: 'Tu___o bene?', base: '(all good?)', en: 'All good?',
          answers: ['tt'],
          mistakes: { t: 'tutto has a long t: tut-to.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r3',
          prompt: "Dov'è la ca___a?", base: '(the till)', en: "Where's the till?",
          answers: ['ss'],
          mistakes: { s: 'casa, with one s, is "house". The till is cas-sa.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e17', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r3',
          prompt: 'Una bo___iglia di vino.', base: '(a bottle)', en: 'A bottle of wine.',
          answers: ['tt'],
          mistakes: { t: 'Hold the t: bot-ti-glia.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e18', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r3',
          prompt: 'E___o il treno!', base: '(here is)', en: "Here's the train!",
          answers: ['cc'],
          mistakes: { c: 'ecco has a long k: ek-ko. eco is an echo.' },
          why: WHY_DOUBLE,
        },

        // Rung 3: transform
        {
          id: 'u0-l3-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u0-r3',
          prompt: 'una notte', base: 'Make it plural: "two nights" (due …).', en: 'two nights',
          answers: ['due notti'],
          mistakes: { 'due noti': 'Keep the long tt in the plural: notte → notti.' },
          why: WHY_DOUBLE_KEEP,
        },
        {
          id: 'u0-l3-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u0-r3',
          prompt: 'una camera doppia', base: 'Make it plural: "two double rooms" (due …).', en: 'two double rooms',
          answers: ['due camere doppie'],
          mistakes: {
            'due camere dopie': 'Keep the long pp: doppia → doppie.',
            'due camere doppia': 'doppia changes too, to match camere: doppie.',
          },
          why: WHY_DOUBLE_KEEP + ' Both words change -a to -e.',
        },
        {
          id: 'u0-l3-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u0-r3',
          prompt: 'un cappuccino', base: 'Make it plural: "two cappuccinos" (due …).', en: 'two cappuccinos',
          answers: ['due cappuccini'],
          mistakes: {
            'due capuccini': 'Both doubles stay: cap-puc-ci-ni.',
            'due cappucini': 'Both doubles stay: cap-puc-ci-ni.',
          },
          why: WHY_DOUBLE_KEEP,
        },
        {
          id: 'u0-l3-e22', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u0-r3',
          prompt: 'il nonno', base: 'Make it plural: "the grandparents" (i …).', en: 'the grandparents',
          answers: ['i nonni'],
          mistakes: { 'i noni': 'noni would mean "ninths". Keep the nn: nonni.' },
          why: WHY_DOUBLE_KEEP,
        },
        {
          id: 'u0-l3-e23', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u0-r3',
          prompt: 'la bottiglia', base: 'Make it plural: "the bottles" (le …).', en: 'the bottles',
          answers: ['le bottiglie'],
          mistakes: { 'le botiglie': 'Keep the long tt: bottiglie.' },
          why: WHY_DOUBLE_KEEP,
        },
        {
          id: 'u0-l3-e24', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u0-r3',
          prompt: 'Rossi', base: 'Spell it with Italian letter names (erre, o, esse, i), saying doppia for the double letter.', en: 'R, O, double S, I.',
          answers: ['Erre, o, doppia esse, i.', 'Erre, o, esse, esse, i.', 'Erre, o, due esse, i.'],
          mistakes: { 'Erre, o, esse, i.': 'Rossi has a double s: say doppia esse.' },
          why: 'For a double letter, Italians say doppia: doppia esse.',
        },

        // Rung 4: build from English
        {
          id: 'u0-l3-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r3',
          prompt: 'Translate: "A double room, please."', base: '(at hotel reception)', en: 'A double room, please.',
          answers: ['Una camera doppia, per favore.', 'Una doppia, per favore.', 'Una camera doppia, per piacere.'],
          mistakes: { 'Una camera dopia, per favore.': 'doppia has a long pp: dop-pia.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r3',
          prompt: 'Translate: "I\'m thirsty."', base: '(to your partner, on a hot day)', en: "I'm thirsty.",
          answers: ['Ho sete.', 'Io ho sete.', 'Che sete!', 'Sono assetato.', 'Sono assetata.'],
          mistakes: {
            'Ho sette.': 'sette is seven. Thirst is sete, one t.',
            'Sono sete.': 'Italians "have" thirst: ho sete.',
          },
          why: 'Italians say ho sete, "I have thirst". sete has one t.',
        },
        {
          id: 'u0-l3-e30', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r3',
          prompt: 'Translate: "It\'s seven o\'clock."', base: '(your partner asks the time)', en: "It's seven o'clock.",
          answers: ['Sono le sette.'],
          mistakes: {
            'Sono le sete.': 'sete is thirst. Seven has a long tt: sette.',
            'È le sette.': 'With hours from two on, Italians say sono le: sono le sette.',
          },
          why: 'Times use sono le + the number: sono le sette, with a long tt.',
        },
        {
          id: 'u0-l3-e31', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r3',
          prompt: 'Translate: "For two nights."', base: '(booking a room)', en: 'For two nights.',
          answers: ['Per due notti.'],
          mistakes: { 'Per due noti.': 'notti has a long tt: not-ti.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e32', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r3',
          prompt: 'Translate: "The wine is too expensive."', base: '(in a wine shop, to your partner)', en: 'The wine is too expensive.',
          answers: ['Il vino è troppo caro.', 'Questo vino è troppo caro.'],
          mistakes: {
            'Il vino è troppo carro.': 'carro, with a long rr, is a cart. Expensive is caro.',
            'Il vino è tropo caro.': 'troppo has a long pp: trop-po.',
          },
          why: 'troppo has a long pp; caro has a single r.',
        },
        {
          id: 'u0-l3-e33', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r3',
          prompt: 'Translate: "Here\'s grandpa!"', base: '(telling your partner when the doorbell rings)', en: "Here's grandpa!",
          answers: ['Ecco il nonno!', "C'è il nonno!", 'Arriva il nonno!'],
          mistakes: {
            'Ecco il nono!': 'nono means "ninth". Grandpa is nonno.',
            'Eco il nonno!': 'ecco has a long k: ek-ko. eco is an echo.',
          },
          why: 'ecco and nonno both have a double letter: ek-ko, non-no.',
        },

        // Rung 5: listen & type
        {
          id: 'u0-l3-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r3',
          prompt: 'Ho sete.', base: '', en: "I'm thirsty.",
          answers: ['Ho sete.'],
          mistakes: { 'Ho sette.': 'You heard a short t: sete, thirst. sette (long tt) is seven.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r3',
          prompt: 'Sono le sette.', base: '', en: "It's seven o'clock.",
          answers: ['Sono le sette.'],
          mistakes: { 'Sono le sete.': 'You heard a long t: sette, seven. sete (one t) is thirst.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e36', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r3',
          prompt: 'Il nonno è stanco.', base: '', en: 'Grandpa is tired.',
          answers: ['Il nonno è stanco.'],
          mistakes: { 'Il nono è stanco.': 'You heard a long n: nonno, grandfather. nono is "ninth".' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e37', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r3',
          prompt: "Dov'è la cassa?", base: '', en: "Where's the till?",
          answers: ["Dov'è la cassa?", 'Dove è la cassa?'],
          mistakes: { "Dov'è la casa?": 'You heard a long s: cassa, the till. casa is house.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e38', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r3',
          prompt: 'Una camera doppia.', base: '', en: 'A double room.',
          answers: ['Una camera doppia.'],
          mistakes: { 'Una camera dopia.': 'You heard a long p: doppia.' },
          why: WHY_DOUBLE,
        },
        {
          id: 'u0-l3-e39', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r3',
          prompt: 'Il vino è troppo caro.', base: '', en: 'The wine is too expensive.',
          answers: ['Il vino è troppo caro.'],
          mistakes: {
            'Il vino è troppo carro.': 'You heard a short r: caro, expensive. carro is a cart.',
            'Il vino è tropo caro.': 'You heard a long p: troppo.',
          },
          why: WHY_DOUBLE,
        },
      ],
    },

    // ---------------------------------------------------------------- stress & accents
    {
      id: 'u0-l4',
      title: 'Stress & accents',
      rules: [
        {
          id: 'u0-r4',
          title: 'Stress & accents',
          sentence: 'Il caffè è caldo e buono.',
          marks: [
            { word: 'caffè', kind: 'underline', color: 'pink' },
            { word: 'è', kind: 'circle', color: 'pink' },
            { word: 'e', kind: 'circle', color: 'ultra' },
          ],
          why: 'Most Italian words are stressed on the second-to-last syllable: GRA-zie, a-MI-co, ra-GAZ-zo. In words of two or more syllables, a stressed last vowel is written with an accent: caffè, città, perché, lunedì. One-syllable words usually have none (qui, tre, su, va). They take one only to tell two words apart, like è (is) and e (and), lì (there) and li (them), tè (tea) and te (you), and in a handful of words like più, già, può.',
          table: {
            head: ['Word', 'Said', 'Meaning'],
            rows: [
              ['grazie', 'GRA-zie', 'thanks'],
              ['camera', 'CA-me-ra', 'room'],
              ['città', 'cit-TÀ', 'city'],
              ['caffè', 'caf-FÈ', 'coffee'],
              ['perché', 'per-KEH', 'why, because'],
              ['lunedì', 'lu-ne-DÌ', 'Monday'],
            ],
            highlight: [2, 3, 4, 5],
          },
          careful: 'Only a stressed last vowel can carry a written accent. camera is CA-me-ra, stressed early, with no mark: you learn those by ear. qui and tre have no accent, but ventitré does. Most accents lean left (à, è, ì, ò, ù), but perché and ventitré end in é. And È with an apostrophe (E\') is a typing shortcut, not Italian spelling.',
          howItaliansSayIt: {
            it: 'Perché? Perché sì!',
            en: 'Why? Just because!',
            note: 'perché means both "why" and "because", so "Perché sì!" is the classic answer when someone won\'t explain. Put the stress where the accent is: per-KEH, never PER-keh.',
          },
        },
      ],
      examples: [
        { it: 'Un caffè, per favore.', en: 'A coffee, please.', reg: 'neutral' },
        { it: 'Tè o caffè?', en: 'Tea or coffee?', reg: 'neutral' },
        { it: 'Firenze è una città bellissima.', en: 'Florence is a beautiful city.', reg: 'neutral' },
        { it: 'Perché no?', en: 'Why not?', reg: 'neutral' },
        { it: "Un po' di più, grazie.", en: 'A bit more, thanks.', reg: 'neutral' },
        { it: 'Ciao, papà!', en: 'Hi, Dad!', reg: 'tu' },
        { it: 'Ci vediamo lunedì.', en: 'See you on Monday.', reg: 'neutral' },
        { it: 'La camera è al terzo piano.', en: 'The room is on the third floor.', reg: 'neutral' },
        { it: 'È di qui, signora?', en: 'Are you from here?', reg: 'lei' },
        { it: 'È lì, a destra.', en: "It's there, on the right.", reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u0-l4-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r4',
          prompt: 'Un ___, per favore.', base: '(a coffee, said "caf-FEH")', en: 'A coffee, please.',
          answers: ['caffè'], options: ['caffè', 'caffe'],
          mistakes: { caffe: 'The stress is on the last vowel, caf-FÈ, so it is written with an accent: caffè.' },
          why: WHY_FINAL,
        },
        {
          id: 'u0-l4-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r4',
          prompt: 'Il treno ___ in ritardo.', base: '(is)', en: 'The train is late.',
          answers: ['è'], options: ['è', 'e'],
          mistakes: { e: 'e without an accent means "and". "is" is è.' },
          why: WHY_E,
        },
        {
          id: 'u0-l4-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r4',
          prompt: 'Un tè ___ un caffè, per favore.', base: '(and)', en: 'A tea and a coffee, please.',
          answers: ['e'], options: ['e', 'è'],
          mistakes: { è: 'è with an accent means "is". "and" is plain e.' },
          why: WHY_E,
        },
        {
          id: 'u0-l4-e04', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r4',
          prompt: 'Firenze è una ___ bellissima.', base: '(city, said "chit-TAH")', en: 'Florence is a beautiful city.',
          answers: ['città'], options: ['città', 'citta'],
          mistakes: { citta: 'The stress is on the last a, so it needs an accent: città.' },
          why: WHY_FINAL,
        },
        {
          id: 'u0-l4-e05', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u0-r4',
          prompt: '___ non vieni?', base: '(why, said "per-KEH")', en: "Why aren't you coming?",
          answers: ['Perché'], options: ['Perché', 'Perche'],
          mistakes: { Perche: 'The stress is on the last syllable, per-KEH, so it needs an accent: perché.' },
          why: WHY_FINAL,
        },
        {
          id: 'u0-l4-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r4',
          prompt: "Un po' di ___, grazie.", base: '(more)', en: 'A bit more, thanks.',
          answers: ['più'], options: ['più', 'piu'],
          mistakes: { piu: 'più always carries its accent on the u.' },
          why: 'più (more) is always written with an accent.',
        },
        {
          id: 'u0-l4-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r4',
          prompt: '___', base: 'Which word is stressed on the last syllable?', en: 'città: city',
          answers: ['città'], options: ['grazie', 'città', 'camera'],
          mistakes: {
            grazie: 'grazie is GRA-zie, stressed on the second-to-last syllable, like most words.',
            camera: 'camera is CA-me-ra: stressed on the third-to-last, with no written accent.',
          },
          why: WHY_FINAL,
        },
        {
          id: 'u0-l4-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r4',
          prompt: 'La chiave è ___.', base: '(there)', en: 'The key is there.',
          answers: ['lì'], options: ['lì', 'li'],
          mistakes: { li: 'Without the accent, li means "them". "there" is lì.' },
          why: WHY_LI,
        },

        // Rung 2: fill the gap
        {
          id: 'u0-l4-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r4',
          prompt: 'Il caffè ___ freddo.', base: '(is)', en: 'The coffee is cold.',
          answers: ['è'],
          mistakes: {
            e: 'e means "and". "is" needs the accent: è.',
            "e'": 'The apostrophe is a typing shortcut, not Italian spelling. Write è.',
          },
          why: WHY_E,
        },
        {
          id: 'u0-l4-e10', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r4',
          prompt: 'Pasta ___ fagioli.', base: '(and)', en: 'Pasta and beans.',
          answers: ['e'],
          mistakes: { è: 'è with an accent means "is". "and" is plain e.' },
          why: WHY_E,
        },
        {
          id: 'u0-l4-e11', type: 'type', reg: 'tu', rung: 2, ruleId: 'u0-r4',
          prompt: 'Ciao, pap___!', base: '(Dad, stressed on the last a)', en: 'Hi, Dad!',
          answers: ['à'],
          mistakes: { a: 'papà is stressed on the last a, pa-PÀ, so it is written à. papa without an accent is the Pope.' },
          why: WHY_FINAL,
        },
        {
          id: 'u0-l4-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r4',
          prompt: 'Ci vediamo luned___.', base: '(Monday, stressed on the last i)', en: 'See you on Monday.',
          answers: ['ì'],
          mistakes: { i: 'lunedì to venerdì are stressed on the last i: write ì.' },
          why: WHY_FINAL,
        },
        {
          id: 'u0-l4-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r4',
          prompt: 'Perch___ no?', base: '(why not?)', en: 'Why not?',
          answers: ['é'],
          mistakes: { e: 'perché is stressed on the last syllable, so the e needs an accent: é.' },
          why: WHY_FINAL + ' perché takes é, leaning right.',
        },
        {
          id: 'u0-l4-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r4',
          prompt: 'Abito in citt___.', base: '(in the city, stressed on the last a)', en: 'I live in the city.',
          answers: ['à'],
          mistakes: { a: 'città is stressed on the last a: write à.' },
          why: WHY_FINAL,
        },
        {
          id: 'u0-l4-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r4',
          prompt: 'Non ho ___ fame.', base: '(any more)', en: "I'm not hungry any more.",
          answers: ['più'],
          mistakes: { piu: 'più always carries its accent on the u.' },
          why: 'più (more, any more) is always written with an accent.',
        },
        {
          id: 'u0-l4-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r4',
          prompt: 'Due t___, per favore.', base: '(teas)', en: 'Two teas, please.',
          answers: ['è'],
          mistakes: { e: 'tè (tea) is written with an accent. te without it means "you".' },
          why: 'tè (tea) has an accent to tell it apart from te (you). Like caffè, it doesn\'t change in the plural.',
        },
        {
          id: 'u0-l4-e17', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r4',
          prompt: 'Il bagno è ___, a destra.', base: '(there)', en: "The bathroom is there, on the right.",
          answers: ['lì', 'là'],
          mistakes: {
            li: 'Without the accent, li means "them". "there" is lì.',
            la: 'Without the accent, la means "the" or "her". "there" is là.',
          },
          why: WHY_LI + ' là (there) works too.',
        },
        {
          id: 'u0-l4-e18', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r4',
          prompt: "Dov'___ la stazione?", base: '(is)', en: "Where's the station?",
          answers: ['è'],
          mistakes: {
            e: "dov'è is dove + è (is): keep the accent.",
            "e'": 'The apostrophe is a typing shortcut, not Italian spelling. Write è.',
          },
          why: "dov'è = dove + è. The accent stays after the apostrophe.",
        },

        // Rung 3: transform
        {
          id: 'u0-l4-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u0-r4',
          prompt: 'una città', base: 'Make it plural: "two cities" (due …).', en: 'two cities',
          answers: ['due città'],
          mistakes: {
            'due citte': WHY_PLURAL_ACCENT,
            'due citta': 'Keep the accent: città.',
          },
          why: WHY_PLURAL_ACCENT,
        },
        {
          id: 'u0-l4-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u0-r4',
          prompt: 'un caffè', base: 'Make it plural: "two coffees" (due …).', en: 'two coffees',
          answers: ['due caffè'],
          mistakes: {
            'due caffi': 'Words that end in an accented vowel never change in the plural: due caffè.',
            'due caffe': 'Keep the accent: caffè.',
          },
          why: WHY_PLURAL_ACCENT,
        },
        {
          id: 'u0-l4-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u0-r4',
          prompt: 'Il caffè è caldo.', base: 'Make it about tea (tè).', en: 'The tea is hot.',
          answers: ['Il tè è caldo.'],
          mistakes: {
            'Il te è caldo.': 'tè (tea) has an accent. te without it means "you".',
            'Il tè e caldo.': 'You still need è (is), with its accent.',
          },
          why: 'tè, like caffè, ends in a stressed è. And è (is) keeps its accent.',
        },
        {
          id: 'u0-l4-e22', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u0-r4',
          prompt: 'Il nonno è qui.', base: 'Change "here" (qui) to "there" (lì).', en: 'Grandpa is there.',
          answers: ['Il nonno è lì.', 'Il nonno è là.'],
          mistakes: {
            'Il nonno è li.': 'Without the accent, li means "them". "there" is lì.',
            'Il nonno e lì.': 'e means "and". "is" is è.',
          },
          why: WHY_LI,
        },
        {
          id: 'u0-l4-e23', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u0-r4',
          prompt: 'Ci vediamo domani.', base: 'Change "tomorrow" to "on Friday" (venerdì).', en: 'See you on Friday.',
          answers: ['Ci vediamo venerdì.'],
          mistakes: { 'Ci vediamo venerdi.': 'venerdì is stressed on the last i: write ì.' },
          why: WHY_FINAL,
        },

        // Rung 4: build from English
        {
          id: 'u0-l4-e27', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r4',
          prompt: 'Translate: "A coffee, please."', base: '(at the bar counter)', en: 'A coffee, please.',
          answers: ['Un caffè, per favore.', 'Un caffè, per piacere.', 'Un caffè, grazie.'],
          mistakes: { 'Un caffe, per favore.': 'caffè is stressed on the last syllable: write the accent.' },
          why: WHY_FINAL,
        },
        {
          id: 'u0-l4-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r4',
          prompt: 'Translate: "Why not?"', base: '(your partner suggests a gelato)', en: 'Why not?',
          answers: ['Perché no?'],
          mistakes: { 'Perche no?': 'perché needs its accent: per-KEH.' },
          why: WHY_FINAL,
        },
        {
          id: 'u0-l4-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r4',
          prompt: 'Translate: "The city is beautiful."', base: '(on a walk in Florence)', en: 'The city is beautiful.',
          answers: ['La città è bella.', 'La città è bellissima.'],
          mistakes: {
            'La citta è bella.': 'città needs its accent: cit-TÀ.',
            'La città e bella.': 'e means "and". "is" is è.',
          },
          why: WHY_FINAL + ' And "is" is è.',
        },
        {
          id: 'u0-l4-e30', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r4',
          prompt: 'Translate: "Tea or coffee?"', base: '(offering a drink to a guest)', en: 'Tea or coffee?',
          answers: ['Tè o caffè?', 'Un tè o un caffè?'],
          mistakes: {
            'Te o caffè?': 'tè (tea) has an accent. te means "you".',
            'Tè o caffe?': 'caffè needs its accent.',
          },
          why: 'tè and caffè both end in a stressed è.',
        },
        {
          id: 'u0-l4-e31', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r4',
          prompt: 'Translate: "A bit more, thanks."', base: "(your partner's grandmother offers more pasta)", en: 'A bit more, thanks.',
          answers: ["Un po' di più, grazie.", "Ancora un po', grazie."],
          mistakes: {
            "Un po' di piu, grazie.": 'più always carries its accent.',
            'Un pò di più, grazie.': "po' is short for poco, so it takes an apostrophe, not an accent.",
          },
          why: "più has an accent; po' (short for poco) has an apostrophe.",
        },

        // Rung 5: listen & type
        {
          id: 'u0-l4-e32', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r4',
          prompt: 'Un caffè, per favore.', base: '', en: 'A coffee, please.',
          answers: ['Un caffè, per favore.'],
          mistakes: { 'Un caffe, per favore.': 'You heard the stress on the last syllable, caf-FÈ: write the accent.' },
          why: WHY_FINAL,
        },
        {
          id: 'u0-l4-e33', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r4',
          prompt: 'Perché no?', base: '', en: 'Why not?',
          answers: ['Perché no?'],
          mistakes: { 'Perche no?': 'Stressed on the last syllable: perché needs its accent.' },
          why: WHY_FINAL,
        },
        {
          id: 'u0-l4-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r4',
          prompt: 'La città è bella.', base: '', en: 'The city is beautiful.',
          answers: ['La città è bella.'],
          mistakes: {
            'La citta è bella.': 'You heard the stress on the last a, cit-TÀ: write the accent.',
            'La città e bella.': 'e is "and". Here you heard "is": è.',
          },
          why: WHY_FINAL,
        },
        {
          id: 'u0-l4-e35', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u0-r4',
          prompt: 'Ciao, papà!', base: '', en: 'Hi, Dad!',
          answers: ['Ciao, papà!'],
          mistakes: { 'Ciao, papa!': 'You heard the stress on the last a, pa-PÀ: papà. papa is the Pope.' },
          why: WHY_FINAL,
        },
        {
          id: 'u0-l4-e36', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r4',
          prompt: 'Il bagno è lì, a destra.', base: '', en: 'The bathroom is there, on the right.',
          answers: ['Il bagno è lì, a destra.'],
          mistakes: {
            'Il bagno e lì, a destra.': 'e means "and". The bathroom "is" there: è, with an accent.',
            'Il bagno è li, a destra.': 'lì (there) needs its accent.',
            "Il bagno e' lì, a destra.": "e' with an apostrophe is a typing shortcut: write è.",
          },
          why: WHY_E + ' ' + WHY_LI,
        },
        {
          id: 'u0-l4-e37', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r4',
          prompt: 'Ci vediamo lunedì.', base: '', en: 'See you on Monday.',
          answers: ['Ci vediamo lunedì.'],
          mistakes: { 'Ci vediamo lunedi.': 'You heard the stress on the last i: lunedì.' },
          why: WHY_FINAL,
        },

        // One-syllable words: no accent unless it tells two words apart
        {
          id: 'u0-l4-e38', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r4',
          prompt: 'Il nonno è ___.', base: '(here)', en: 'Grandpa is here.',
          answers: ['qui'], options: ['qui', 'quì'],
          mistakes: { quì: 'qui has one syllable and there is no other qui to tell apart, so it takes no accent.' },
          why: WHY_ONE_SYLLABLE,
        },
        {
          id: 'u0-l4-e39', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r4',
          prompt: 'Sono ___, a destra!', base: '(here)', en: "I'm here, on the right!",
          answers: ['qui', 'qua'],
          mistakes: {
            quì: 'qui has one syllable, so it takes no accent: qui.',
            quà: 'qua has one syllable, so it takes no accent: qua.',
          },
          why: WHY_ONE_SYLLABLE,
        },
        {
          id: 'u0-l4-e40', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r4',
          prompt: 'Siamo in tre.', base: '', en: 'There are three of us.',
          answers: ['Siamo in tre.'],
          mistakes: {
            'Siamo in trè.': 'tre has one syllable, so it takes no accent. Only longer numbers ending in it do: ventitré.',
            'Siamo in tré.': 'tre has one syllable, so it takes no accent. Only longer numbers ending in it do: ventitré.',
          },
          why: WHY_ONE_SYLLABLE,
        },
      ],
    },
  ],
  scene: {
    title: 'Spelling your name at check-in',
    setting: 'You arrive at a small hotel in Bologna and spell your surname for the receptionist. Italian letter names: a, bi, ci, di, e, effe, gi, acca, i, elle, emme, enne, o, pi, cu, erre, esse, ti, u, vu, zeta. For a double letter, say doppia: doppia elle.',
    lines: [
      { speaker: 'Receptionist', it: 'Buonasera! Ha una prenotazione?', en: 'Good evening! Do you have a booking?', reg: 'lei' },
      { speaker: 'You', it: 'Sì, per due notti.', en: 'Yes, for two nights.', reg: 'neutral' },
      { speaker: 'Receptionist', it: 'Mi dice il cognome, per favore?', en: 'Could you tell me your surname, please?', reg: 'lei' },
      { speaker: 'You', it: 'Mitchell.', en: 'Mitchell.', reg: 'neutral' },
      { speaker: 'Receptionist', it: 'Prego? Come si scrive?', en: 'Sorry? How do you spell it?', reg: 'neutral' },
      { speaker: 'You', it: 'Emme, i, ti, ci, acca, e, doppia elle.', en: 'M, I, T, C, H, E, double L.', reg: 'neutral' },
      { speaker: 'Receptionist', it: 'Ci come Como, poi acca?', en: 'C as in Como, then H?', reg: 'neutral' },
      { speaker: 'You', it: 'Sì, esatto. Con due elle alla fine.', en: 'Yes, exactly. With two Ls at the end.', reg: 'neutral' },
      { speaker: 'Receptionist', it: 'Ecco: camera doppia, due notti, colazione inclusa.', en: 'Here it is: double room, two nights, breakfast included.', reg: 'neutral' },
      { speaker: 'You', it: 'Perfetto. A che ora è la colazione?', en: 'Perfect. What time is breakfast?', reg: 'neutral' },
      { speaker: 'Receptionist', it: 'Dalle sette alle dieci. Ecco la chiave: camera ventitré.', en: "From seven to ten. Here's the key: room twenty-three.", reg: 'neutral' },
      { speaker: 'You', it: "Grazie mille. C'è l'ascensore?", en: 'Thanks a lot. Is there a lift?', reg: 'neutral' },
      { speaker: 'Receptionist', it: 'Sì, lì a destra. Buona permanenza!', en: 'Yes, there on the right. Enjoy your stay!', reg: 'neutral' },
    ],
    exercises: [
      {
        id: 'u0-s-e01', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u0-r2',
        prompt: 'Mi dice il ___, per favore?', base: '(your surname, said "ko-NYO-meh")', en: 'Could you tell me your surname, please?',
        answers: ['cognome'], options: ['cognome', 'conome', 'cogniome'],
        mistakes: {
          conome: 'The "ny" sound is spelled gn: cognome.',
          cogniome: 'gn already makes the "ny" sound, so no i is needed: cognome.',
        },
        why: WHY_GN,
      },
      {
        id: 'u0-s-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u0-r4',
        prompt: 'Ecco la chiave: camera ___.', base: '(room 23, said "ven-tee-TREH")', en: "Here's the key: room twenty-three.",
        answers: ['ventitré'], options: ['ventitré', 'ventitre'],
        mistakes: { ventitre: 'ventitré is stressed on the last syllable, so it needs an accent: ventitré.' },
        why: WHY_FINAL + ' tre alone has no accent, but ventitré, stressed on its last syllable, does, with é like perché.',
      },
      {
        id: 'u0-s-e03', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r1',
        prompt: 'Ecco la ___iave: camera ventitré.', base: '(the key, hard k)', en: "Here's the key: room twenty-three.",
        answers: ['ch'],
        mistakes: { c: 'ci + a would be soft, "CHAH-veh". For a hard k before i, write ch: chiave.' },
        why: WHY_HARD,
      },
      {
        id: 'u0-s-e04', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r3',
        prompt: 'Sì, per due no___i.', base: '(nights)', en: 'Yes, for two nights.',
        answers: ['tt'],
        mistakes: { t: 'Hold the t: not-ti. noti, with one t, means "known".' },
        why: WHY_DOUBLE,
      },
      {
        id: 'u0-s-e05', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u0-r4',
        prompt: 'Sì, ___ a destra.', base: '(there)', en: 'Yes, there on the right.',
        answers: ['lì', 'là'],
        mistakes: {
          li: 'Without the accent, li means "them". "there" is lì.',
          la: 'Without the accent, la means "the" or "her". "there" is là.',
        },
        why: WHY_LI,
      },
      {
        id: 'u0-s-e06', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u0-r3',
        prompt: 'Mitchell', base: 'Spell it as you did at check-in: letter names, and doppia for the double letter.', en: 'M, I, T, C, H, E, double L.',
        answers: ['Emme, i, ti, ci, acca, e, doppia elle.', 'Emme, i, ti, ci, acca, e, elle, elle.', 'Emme, i, ti, ci, acca, e, due elle.'],
        mistakes: {
          'Emme, i, ti, ci, acca, e, elle.': 'Mitchell ends in a double l: doppia elle.',
          'Emme, i, ti, ci, e, doppia elle.': 'Mitchell has an h after the c: ci, acca.',
        },
        why: 'h is called acca. For a double letter, Italians say doppia: doppia elle.',
      },
      {
        id: 'u0-s-e07', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r3',
        prompt: 'Translate: "Double room, two nights."', base: '(confirming your booking)', en: 'Double room, two nights.',
        answers: ['Camera doppia, due notti.', 'Una camera doppia, due notti.', 'Camera doppia per due notti.', 'Una camera doppia per due notti.'],
        mistakes: {
          'Camera dopia, due notti.': 'doppia has a long pp: dop-pia.',
          'Camera doppia, due noti.': 'notti has a long tt: not-ti.',
        },
        why: WHY_DOUBLE,
      },
      {
        id: 'u0-s-e08', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u0-r1',
        prompt: 'Translate: "What time is breakfast?"', base: '(asking the receptionist)', en: 'What time is breakfast?',
        answers: ['A che ora è la colazione?', 'A che ora è colazione?', 'A che ora si fa colazione?'],
        mistakes: { 'A ce ora è la colazione?': 'ce is soft, "cheh". "What" is che, with a hard k.' },
        why: 'che has a hard k ("keh"): the h keeps c hard before e.',
      },
      {
        id: 'u0-s-e09', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r2',
        prompt: "C'è l'ascensore?", base: '', en: 'Is there a lift?',
        answers: ["C'è l'ascensore?"],
        mistakes: {
          "C'è l'asciensore?": 'sc before e is already "sh", so no i is needed: ascensore.',
          "C'è l'assensore?": 'You heard "sh": that is sc before e, ascensore.',
        },
        why: WHY_SC_SOFT,
      },
      {
        id: 'u0-s-e10', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u0-r3',
        prompt: 'Dalle sette alle dieci.', base: '', en: 'From seven to ten.',
        answers: ['Dalle sette alle dieci.'],
        mistakes: {
          'Dalle sete alle dieci.': 'You heard a long t: sette, seven.',
          'Dale sette ale dieci.': 'dalle and alle have a long ll.',
        },
        why: WHY_DOUBLE,
      },
    ],
  },
};
