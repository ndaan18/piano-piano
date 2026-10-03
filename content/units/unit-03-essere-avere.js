// Unit 3: Essere & avere. Data only (schema: spec §9).
// Exercise field use by type:
//   recognise  prompt with ___ gap, options (2–4, include the answer)
//   type       prompt with ___ gap, answers = the missing word(s)
//   transform  prompt = sentence to rewrite, base = the instruction
//   register   prompt = sentence said to one person, base = who to say it to now; reg = target register
//   build      prompt = 'Translate: "…"', base = context line
//   listen     prompt = the Italian sentence to speak, answers = that sentence
// Four lessons, one rule each: essere · avere · tu, Lei, voi · avere where English uses "to be".
// The partner is Giulia; her parents are Anna and Paolo Conti, her brother Marco.
// Voi lines are tagged neutral: voi is the plural "you" for everyone, formal or not.
// One-letter slips that the checker would pass as a typo get a key: sei/sai, ha/a, hai/ai,
// ho/o, hanno/anno, siete/sete, sonno/sono, sete/sette. è/e is left to the accent rule,
// except where e is a recognise option.

// u3-r1: essere
const WHY_IO = "With io, essere is sono: sono a casa = I'm at home. The ending already says who, so io is usually dropped.";
const WHY_TU = 'With tu, essere is sei: sei pronta? (sai, with an a, is another verb: "you know".)';
const WHY_E3 = 'For he, she or it, essere is è, with an accent. Without the accent, e means "and".';
const WHY_NOI = "With noi, essere is siamo: siamo in ritardo = we're late.";
const WHY_VOI = 'For "you" to two or more people, essere is siete: siete pronti? (sete, without the i, means "thirst".)';
const WHY_LORO = 'For "they", essere is sono, the same form as "I am": i nonni sono in giardino.';

// u3-r2: avere
const WHY_HO = 'With io, avere is ho. The h is silent ("o"), but it is always written: o on its own means "or".';
const WHY_HAI = 'With tu, avere is hai, said like English "eye". (ai, without the h, means "to the".)';
const WHY_HA = 'For he, she or it, avere is ha. The h is silent: a on its own means "to" or "at".';
const WHY_ABBIAMO = 'With noi, avere is abbiamo, with a double b.';
const WHY_AVETE = 'For "you" to two or more people, avere is avete.';
const WHY_HANNO = 'For "they", avere is hanno. The h is silent: anno, without it, means "year".';

// u3-r3: tu, Lei, voi
const WHY_LEI = 'Lei, the formal "you", takes the same verb form as "she": è, ha. Use it with strangers, staff, and older people you have just met, like your partner\'s parents.';
const WHY_TU_INF = 'tu is for your partner, friends, family, children and people your age: sei, hai.';
const WHY_SCUSI = 'scusa goes with tu, scusi with Lei. Both mean "excuse me" or "sorry".';
const WHY_STA = 'come stai? is the tu question, come sta? the Lei one. (Both come from stare, Unit 5: learn them as phrases for now.)';
const WHY_VOI_ALL = 'For two or more people, formal or not, use voi: siete, avete. scusate is the voi form of scusa.';
const WHY_ADJ = 'Lei takes the verb of "she", but adjectives still match the real person: to a man, Lei è stanco; to a woman, Lei è stanca.';

// u3-r4: avere where English uses "to be"
const WHY_FAME = 'Hunger, thirst, cold, heat and sleepiness are things you have in Italian: ho fame, ho sete, ho freddo, ho caldo, ho sonno.';
const WHY_AGE = "Age uses avere plus the word anni: ho trent'anni = I'm thirty. Never sono trent'anni.";
const WHY_RAGIONE = "Being right or wrong uses avere too: hai ragione = you're right, hai torto = you're wrong.";
const WHY_PAURA = "Fear and hurry are things you have: ho paura = I'm scared, ho fretta = I'm in a hurry.";
const WHY_MOLTA = 'fame, sete, paura and fretta are feminine nouns, so "very" is molta: molta fame. freddo, caldo and sonno are masculine: molto freddo.';

// Keys for one-letter slips that would otherwise pass as a typo.
const H_HA = 'a without the h means "to" or "at". ha, from avere, always keeps its silent h.';
const H_HAI = 'ai without the h means "to the". hai, from avere, always keeps its silent h.';
const H_HO = 'o without the h means "or". ho, from avere, always keeps its silent h.';
const SAI = 'sai means "you know". "You are" is sei.';
const SETE = 'sete means "thirst". "You are" (plural) is siete, with an i.';
const SETTE = 'sette is "seven". Thirst has one t: sete.';
const ANI = 'Years has a double n: anni.';

export default {
  id: 3,
  slug: 'essere-avere',
  title: 'Essere & avere',
  teaser: 'to be, to have',
  canSay: 'Signora, ha fame? E tu, Giulia, sei stanca?',
  lessons: [
    // ------------------------------------------------------------ essere
    {
      id: 'u3-l1',
      title: 'essere: to be',
      rules: [
        {
          id: 'u3-r1',
          title: 'sono · sei · è · siamo · siete',
          sentence: 'Sono a casa · Giulia è a casa · I nonni sono a casa',
          marks: [
            { word: 'Sono', kind: 'circle', color: 'pink' },
            { word: 'è', kind: 'circle', color: 'pink' },
            { word: 'sono', kind: 'circle', color: 'ultra' },
          ],
          why: 'essere means "to be". Like "to be" in English it is irregular, so learn the six forms by heart. The verb already says who it is, so Italians usually drop io, tu and noi: Sono a casa = I\'m at home. Add the pronoun only for contrast: Io sono di Utrecht, lui è di Bologna.',
          table: {
            head: ['verb', 'essere', 'English'],
            rows: [
              ['io', 'sono', 'I am'],
              ['tu', 'sei', 'you are (informal)'],
              ['lui / lei / Lei', 'è', 'he is / she is / you are (formal)'],
              ['noi', 'siamo', 'we are'],
              ['voi', 'siete', 'you are (two or more people)'],
              ['loro', 'sono', 'they are'],
            ],
            highlight: [0, 5],
          },
          careful: 'sono is both "I am" and "they are", and context decides: Sono a casa (I\'m at home), I nonni sono a casa (the grandparents are at home). è with an accent is "is"; e without it is "and": Marco è qui, but Marco e Giulia sono qui. At the start of a sentence write È, not E\'. And è is also the formal "you are" (Lei è…), which comes in lesson 3.',
          howItaliansSayIt: {
            it: 'Dove sei? Siamo già al ristorante.',
            en: "Where are you? We're already at the restaurant.",
            note: 'No tu, no noi: sei and siamo already say who. Adding them (Tu dove sei?) puts extra weight on the person, as if to say "and where are YOU?".',
          },
        },
      ],
      examples: [
        { it: 'Sono a casa.', en: "I'm at home.", reg: 'neutral' },
        { it: 'Giulia è in cucina.', en: 'Giulia is in the kitchen.', reg: 'neutral' },
        { it: 'Giulia, sei pronta?', en: 'Giulia, are you ready?', reg: 'tu' },
        { it: 'Siamo in ritardo!', en: "We're late!", reg: 'neutral' },
        { it: 'Ragazzi, siete di Bologna?', en: 'Guys, are you from Bologna?', reg: 'neutral' },
        { it: 'I nonni sono in giardino.', en: 'The grandparents are in the garden.', reg: 'neutral' },
        { it: 'Marco e Giulia sono qui.', en: 'Marco and Giulia are here.', reg: 'neutral' },
        { it: 'Il museo è chiuso il lunedì.', en: 'The museum is closed on Mondays.', reg: 'neutral' },
        { it: 'Scusi, è libero questo posto?', en: 'Excuse me, is this seat free?', reg: 'lei' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u3-l1-e01', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u3-r1',
          prompt: '___ in ritardo, scusa!', base: '"I\'m late, sorry!" (texting Giulia)', en: "I'm late, sorry!",
          answers: ['Sono'], options: ['Sono', 'Sei', 'È'],
          mistakes: {
            Sei: 'sei is "you are". For "I am", say sono.',
            'È': 'è is "he/she/it is". For "I am", say sono.',
          },
          why: WHY_IO,
        },
        {
          id: 'u3-l1-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r1',
          prompt: 'Giulia ___ in cucina.', base: '"Giulia is in the kitchen."', en: 'Giulia is in the kitchen.',
          answers: ['è'], options: ['è', 'e', 'sei'],
          mistakes: {
            e: 'Without the accent, e means "and". "Is" is è.',
            sei: 'sei is "you are". You are talking about Giulia, so è.',
          },
          why: WHY_E3,
        },
        {
          id: 'u3-l1-e03', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u3-r1',
          prompt: '___ pronta, amore?', base: '"Are you ready, love?" (to Giulia)', en: 'Are you ready, love?',
          answers: ['Sei'], options: ['Sei', 'Sai', 'È'],
          mistakes: {
            Sai: 'sai is "you know", from sapere. "You are" is sei.',
            'È': 'è is "she is" or the formal "you are". Giulia gets tu: sei.',
          },
          why: WHY_TU,
        },
        {
          id: 'u3-l1-e04', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r1',
          prompt: 'Noi ___ in ritardo!', base: '"We\'re late!"', en: "We're late!",
          answers: ['siamo'], options: ['siamo', 'siete', 'sono'],
          mistakes: {
            siete: 'siete is "you are" to two or more people. "We are" is siamo.',
            sono: 'sono is "I am" or "they are". "We are" is siamo.',
          },
          why: WHY_NOI,
        },
        {
          id: 'u3-l1-e05', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r1',
          prompt: 'Ragazzi, ___ pronti?', base: '"Guys, are you ready?" (to a group of friends)', en: 'Guys, are you ready?',
          answers: ['siete'], options: ['siete', 'siamo', 'sono'],
          mistakes: {
            siamo: 'siamo is "we are". Asking the group, "you are" is siete.',
            sono: 'sono is "I am" or "they are". Speaking to the group: siete.',
          },
          why: WHY_VOI,
        },
        {
          id: 'u3-l1-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r1',
          prompt: 'I nonni ___ in giardino.', base: '"The grandparents are in the garden."', en: 'The grandparents are in the garden.',
          answers: ['sono'], options: ['è', 'sono', 'siamo'],
          mistakes: {
            'è': 'è is for one person or thing. The grandparents are two people: sono.',
            siamo: 'siamo is "we are". "They are" is sono.',
          },
          why: WHY_LORO,
        },
        {
          id: 'u3-l1-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r1',
          prompt: 'Il museo ___ chiuso il lunedì.', base: '"The museum is closed on Mondays."', en: 'The museum is closed on Mondays.',
          answers: ['è'], options: ['è', 'e'],
          mistakes: { e: 'Without the accent, e means "and". "Is" is è.' },
          why: WHY_E3,
        },
        {
          id: 'u3-l1-e08', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u3-r1',
          prompt: 'Tu e Marco ___ di Bologna, vero?', base: '"You and Marco are from Bologna, right?"', en: 'You and Marco are from Bologna, right?',
          answers: ['siete'], options: ['siete', 'siamo', 'sono'],
          mistakes: {
            siamo: 'siamo is "we are". You and Marco are "you" (two people): siete.',
            sono: 'sono is "they are". Speaking to you and Marco: siete.',
          },
          why: WHY_VOI,
        },

        // Rung 2: fill the gap
        {
          id: 'u3-l1-e09', type: 'type', reg: 'tu', rung: 2, ruleId: 'u3-r1',
          prompt: '___ a casa, e tu?', base: '(essere: I am)', en: "I'm at home, and you?",
          answers: ['Sono', 'Io sono'],
          mistakes: {
            sei: 'sei is "you are". "I am" is sono.',
            'è': 'è is "he/she/it is". "I am" is sono.',
          },
          why: WHY_IO,
        },
        {
          id: 'u3-l1-e10', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r1',
          prompt: 'Giulia ___ stanca.', base: '(essere)', en: 'Giulia is tired.',
          answers: ['è'],
          mistakes: {
            sei: 'sei is "you are". Talking about Giulia: è.',
            ha: 'ha is "has", from avere. "Is" is è.',
          },
          why: WHY_E3,
        },
        {
          id: 'u3-l1-e11', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r1',
          prompt: 'Noi ___ di Bologna.', base: '(essere)', en: "We're from Bologna.",
          answers: ['siamo'],
          mistakes: {
            siete: 'siete is "you are" (two or more people). "We are" is siamo.',
            sono: 'sono is "I am" or "they are". "We are" is siamo.',
          },
          why: WHY_NOI,
        },
        {
          id: 'u3-l1-e12', type: 'type', reg: 'tu', rung: 2, ruleId: 'u3-r1',
          prompt: 'Tu ___ sempre in ritardo!', base: '(essere)', en: "You're always late!",
          answers: ['sei'],
          mistakes: {
            sai: 'sai means "you know". "You are" is sei.',
            'è': 'è is "he/she is" or the formal "you". With tu: sei.',
          },
          why: WHY_TU,
        },
        {
          id: 'u3-l1-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r1',
          prompt: 'Voi ___ di Roma?', base: '(essere)', en: 'Are you (both) from Rome?',
          answers: ['siete'],
          mistakes: {
            siamo: 'siamo is "we are". To two or more people: siete.',
            sono: 'sono is "I am" or "they are". To two or more people: siete.',
            sete: 'sete means "thirst". "You are" (plural) is siete, with an i.',
          },
          why: WHY_VOI,
        },
        {
          id: 'u3-l1-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r1',
          prompt: 'I treni ___ in ritardo.', base: '(essere)', en: 'The trains are late.',
          answers: ['sono'],
          mistakes: {
            'è': 'è is singular. The trains are plural: sono.',
            siamo: 'siamo is "we are". "They are" is sono.',
          },
          why: WHY_LORO,
        },
        {
          id: 'u3-l1-e15', type: 'type', reg: 'lei', rung: 2, ruleId: 'u3-r1',
          prompt: 'Scusi, ___ libero questo posto?', base: '(essere: is it)', en: 'Excuse me, is this seat free?',
          answers: ['è'],
          mistakes: {
            sono: 'sono is "I am" or "they are". One seat: è.',
            ha: 'ha is "has". "Is" is è.',
          },
          why: WHY_E3,
        },
        {
          id: 'u3-l1-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r1',
          prompt: 'Marco ___ in ufficio.', base: '(essere)', en: 'Marco is at the office.',
          answers: ['è'],
          mistakes: {
            ha: 'ha is "has", from avere. "Is" is è.',
            sei: 'sei is "you are". Talking about Marco: è.',
          },
          why: WHY_E3,
        },

        // Rung 3: transform
        {
          id: 'u3-l1-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r1',
          prompt: 'Sono in ritardo.', base: 'Now say it about Giulia and Marco: start with their names.', en: 'Giulia and Marco are late.',
          answers: ['Giulia e Marco sono in ritardo.', 'Marco e Giulia sono in ritardo.'],
          mistakes: {
            'Giulia e Marco è in ritardo.': 'è is for one person. Two people: sono.',
            'Giulia e Marco siete in ritardo.': 'siete is "you are". Talking about them: sono.',
            'Giulia e Marco siamo in ritardo.': 'siamo is "we are". Talking about them: sono.',
          },
          why: 'The verb doesn\'t change: sono is "I am" and also "they are".',
        },
        {
          id: 'u3-l1-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r1',
          prompt: 'Sono di Bologna.', base: 'Now say "we" (noi).', en: "We're from Bologna.",
          answers: ['Siamo di Bologna.', 'Noi siamo di Bologna.'],
          mistakes: {
            'Siete di Bologna.': 'siete is "you are" (plural). "We are" is siamo.',
            'Sono di Bologna.': 'sono is "I am" or "they are". "We are" is siamo.',
            'Noi sono di Bologna.': 'With noi, essere is siamo.',
          },
          why: WHY_NOI,
        },
        {
          id: 'u3-l1-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r1',
          prompt: 'Sei a casa?', base: 'Now ask two friends (voi).', en: 'Are you (both) at home?',
          answers: ['Siete a casa?', 'Voi siete a casa?'],
          mistakes: {
            'Sei a casa?': 'sei is for one person. Two friends: siete.',
            'Siamo a casa?': 'siamo is "we are". To two friends: siete.',
            'Sete a casa?': 'sete means "thirst". "You are" (plural) is siete, with an i.',
            'Voi sete a casa?': SETE,
          },
          why: WHY_VOI,
        },
        {
          id: 'u3-l1-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r1',
          prompt: 'Il museo è chiuso.', base: 'Make it plural: i musei, chiusi.', en: 'The museums are closed.',
          answers: ['I musei sono chiusi.'],
          mistakes: {
            'I musei è chiusi.': 'è is singular. With a plural subject: sono.',
            'I musei sono chiuso.': 'chiuso has to agree with i musei: chiusi.',
          },
          why: WHY_LORO,
        },
        {
          id: 'u3-l1-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r1',
          prompt: 'Marco è a Roma.', base: 'Now say "Marco and I are in Rome".', en: 'Marco and I are in Rome.',
          answers: ['Io e Marco siamo a Roma.', 'Marco e io siamo a Roma.'],
          mistakes: {
            'Io e Marco sono a Roma.': 'Marco and I = we: siamo.',
            'Marco e io sono a Roma.': 'Marco and I = we: siamo.',
            'Io e Marco è a Roma.': 'Marco and I = we: siamo.',
          },
          why: WHY_NOI + ' In speech, Italians usually say io e Marco.',
        },

        // Rung 3: switch register
        {
          id: 'u3-l1-e22', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r1',
          prompt: 'Sei a casa?', base: 'You asked Giulia on the phone. Now ask her mother (formal).', en: 'Are you at home?',
          answers: ['È a casa?', 'Lei è a casa?', 'Signora, è a casa?'],
          mistakes: {
            'Sei a casa?': 'That is still the tu form. With Lei, essere is è.',
            "E' a casa?": "Write È with an accent, not E'. (On a phone, hold down E.)",
            'Signora, sei a casa?': 'With signora you use Lei: è a casa?',
          },
          why: 'tu sei → Lei è, the same form as "she is". (More on Lei in lesson 3.)',
        },
        {
          id: 'u3-l1-e23', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r1',
          prompt: 'Sei di Bologna?', base: "You asked Giulia's friend Luca. Now ask her grandfather (formal).", en: 'Are you from Bologna?',
          answers: ['È di Bologna?', 'Lei è di Bologna?'],
          mistakes: {
            'Sei di Bologna?': 'That is still the tu form. With Lei, essere is è.',
            "E' di Bologna?": "Write È with an accent, not E'. (On a phone, hold down E.)",
          },
          why: 'tu sei → Lei è. An older relative you are meeting for the first time gets Lei.',
        },
        {
          id: 'u3-l1-e24', type: 'register', reg: 'tu', rung: 3, ruleId: 'u3-r1',
          prompt: 'È pronto, signor Conti?', base: "You asked Giulia's father. Now ask Giulia (informal).", en: 'Are you ready, Giulia?',
          answers: ['Sei pronta, Giulia?', 'Giulia, sei pronta?', 'Sei pronta?', 'Tu sei pronta?'],
          mistakes: {
            'Sei pronto, Giulia?': 'Right verb, but Giulia is a woman: pronta.',
            'È pronta, Giulia?': 'That is the Lei form. Giulia gets tu: sei.',
            'Sai pronta, Giulia?': 'sai means "you know". "You are" is sei.',
            'Giulia, sai pronta?': 'sai means "you know". "You are" is sei.',
            'Sai pronta?': SAI,
            'Tu sai pronta?': SAI,
          },
          why: 'Lei è → tu sei. And pronto becomes pronta for a woman.',
        },
        {
          id: 'u3-l1-e25', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r1',
          prompt: 'Scusa, sei italiano?', base: 'You asked a guy your age at a party. Now ask an older man on the train (formal).', en: 'Excuse me, are you Italian?',
          answers: ['Scusi, è italiano?', 'Mi scusi, è italiano?', 'Scusi, Lei è italiano?'],
          mistakes: {
            'Scusa, è italiano?': 'è is right, but scusa is for tu. With Lei: scusi.',
            'Scusi, sei italiano?': 'scusi is right, but sei is tu. With Lei: è.',
            'Scusa, sei italiano?': 'That is still all tu. To an older stranger: Scusi, è italiano?',
          },
          why: 'tu sei → Lei è, and scusa → scusi.',
        },

        // Rung 4: build from English
        {
          id: 'u3-l1-e26', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u3-r1',
          prompt: 'Translate: "We\'re late!"', base: '(texting Giulia from the bus)', en: "We're late!",
          answers: ['Siamo in ritardo!', 'Noi siamo in ritardo!'],
          mistakes: {
            'Siete in ritardo!': 'siete is "you are" (plural). "We are" is siamo.',
            'Sono in ritardo!': 'sono is "I am" or "they are". "We are" is siamo.',
          },
          why: WHY_NOI + ' "Late" is in ritardo.',
        },
        {
          id: 'u3-l1-e27', type: 'build', reg: 'tu', rung: 4, ruleId: 'u3-r1',
          prompt: 'Translate: "Where are you?"', base: '(calling Giulia)', en: 'Where are you?',
          answers: ['Dove sei?', 'Tu dove sei?', 'Dove sei tu?'],
          mistakes: {
            "Dov'è?": 'That is "where is it?" (or the Lei form). To Giulia: dove sei?',
            'Dove sai?': 'sai means "you know". "You are" is sei.',
            'Tu dove sai?': SAI,
            'Dove sai tu?': SAI,
          },
          why: WHY_TU,
        },
        {
          id: 'u3-l1-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u3-r1',
          prompt: 'Translate: "The grandparents are in the garden."', base: '(telling Giulia where everyone is)', en: 'The grandparents are in the garden.',
          answers: ['I nonni sono in giardino.'],
          mistakes: {
            'I nonni è in giardino.': 'The grandparents are two people: sono.',
            'Gli nonni sono in giardino.': 'nonno takes il, so the plural is i: i nonni.',
          },
          why: WHY_LORO,
        },
        {
          id: 'u3-l1-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u3-r1',
          prompt: 'Translate: "Marco and Giulia are at home."', base: '(answering a friend on the phone)', en: 'Marco and Giulia are at home.',
          answers: ['Marco e Giulia sono a casa.', 'Giulia e Marco sono a casa.'],
          mistakes: {
            'Marco e Giulia è a casa.': 'Two people: sono.',
            'Giulia e Marco è a casa.': 'Two people: sono.',
          },
          why: WHY_LORO + ' "And" is e, with no accent.',
        },
        {
          id: 'u3-l1-e30', type: 'build', reg: 'lei', rung: 4, ruleId: 'u3-r1',
          prompt: 'Translate: "Excuse me, is this seat free?"', base: '(on the train, to a woman next to an empty seat)', en: 'Excuse me, is this seat free?',
          answers: [
            'Scusi, è libero questo posto?', 'Mi scusi, è libero questo posto?',
            'Scusi, questo posto è libero?', 'Mi scusi, questo posto è libero?',
          ],
          mistakes: {
            'Scusa, è libero questo posto?': 'scusa is for tu. To a stranger: scusi.',
            'Scusa, questo posto è libero?': 'scusa is for tu. To a stranger: scusi.',
            'Scusi, questo posto è libera?': 'libero agrees with il posto, which is masculine: libero.',
          },
          why: WHY_E3 + ' scusi is how you stop a stranger politely.',
        },
        {
          id: 'u3-l1-e31', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u3-r1',
          prompt: 'Translate: "Are you ready?"', base: '(to Giulia and Marco together)', en: 'Are you ready?',
          answers: ['Siete pronti?', 'Voi siete pronti?', 'Siete pronti voi?'],
          mistakes: {
            'Sei pronto?': 'sei is for one person. Two people: siete pronti.',
            'Sei pronti?': 'sei is for one person. Two people: siete.',
            'Siete pronte?': 'With Marco in the group, the plural is masculine: pronti.',
            'Sete pronti?': 'sete means "thirst". "You are" (plural) is siete, with an i.',
            'Voi sete pronti?': SETE,
            'Sete pronti voi?': SETE,
          },
          why: WHY_VOI,
        },
        {
          id: 'u3-l1-e32', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u3-r1',
          prompt: 'Translate: "Giulia\'s parents are very nice."', base: '(telling a friend about the weekend)', en: "Giulia's parents are very nice.",
          answers: [
            'I genitori di Giulia sono molto simpatici.', 'I genitori di Giulia sono simpaticissimi.',
            'I genitori di Giulia sono molto gentili.', 'I genitori di Giulia sono gentilissimi.',
          ],
          mistakes: {
            'I genitori di Giulia è molto simpatici.': 'Two parents: sono.',
            'I genitori di Giulia sono molto simpatichi.': 'simpatico has a soft c in the plural: simpatici.',
            'I genitori di Giulia sono simpatichissimi.': 'simpatico has a soft c in the plural: simpaticissimi.',
            'I genitori di Giulia sono molto simpatico.': 'simpatico has to agree with i genitori: simpatici.',
          },
          why: WHY_LORO,
        },

        // Rung 5: listen & type
        {
          id: 'u3-l1-e33', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u3-r1',
          prompt: 'Siamo in ritardo!', base: '', en: "We're late!",
          answers: ['Siamo in ritardo!'],
          mistakes: { 'Siete in ritardo!': 'You heard siamo, "we are". siete would be "you are" (plural).' },
          why: WHY_NOI,
        },
        {
          id: 'u3-l1-e34', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u3-r1',
          prompt: 'Sei pronta, Giulia?', base: '', en: 'Are you ready, Giulia?',
          answers: ['Sei pronta, Giulia?'],
          mistakes: {
            'Sai pronta, Giulia?': 'You heard sei, "you are". sai would be "you know".',
            'Sei pronto, Giulia?': 'You heard pronta: Giulia is a woman.',
          },
          why: WHY_TU,
        },
        {
          id: 'u3-l1-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u3-r1',
          prompt: 'I nonni sono in giardino.', base: '', en: 'The grandparents are in the garden.',
          answers: ['I nonni sono in giardino.'],
          mistakes: { 'I nonni è in giardino.': 'You heard sono: the grandparents are two people.' },
          why: WHY_LORO,
        },
        {
          id: 'u3-l1-e36', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u3-r1',
          prompt: 'Siete di Bologna?', base: '', en: 'Are you (all) from Bologna?',
          answers: ['Siete di Bologna?'],
          mistakes: {
            'Sete di Bologna?': 'You heard siete, with an i: "you are". sete means "thirst".',
            'Siamo di Bologna?': 'You heard siete, "you are" (plural). siamo would be "we are".',
          },
          why: WHY_VOI,
        },
      ],
    },

    // ------------------------------------------------------------ avere
    {
      id: 'u3-l2',
      title: 'avere: to have',
      rules: [
        {
          id: 'u3-r2',
          title: 'ho · hai · ha · abbiamo · avete · hanno',
          sentence: 'Ho una sorella · Giulia ha un fratello · I nonni hanno un cane',
          marks: [
            { word: 'Ho', kind: 'circle', color: 'pink' },
            { word: 'ha', kind: 'circle', color: 'pink' },
            { word: 'hanno', kind: 'circle', color: 'pink' },
          ],
          why: 'avere means "to have", and like essere it is irregular: learn the six forms. Four of them start with an h that is never pronounced. It is there only in writing, to tell ho, hai, ha and hanno apart from o (or), ai (to the), a (to, at) and anno (year).',
          table: {
            head: ['verb', 'avere', 'English'],
            rows: [
              ['io', 'ho', 'I have'],
              ['tu', 'hai', 'you have (informal)'],
              ['lui / lei / Lei', 'ha', 'he has / she has / you have (formal)'],
              ['noi', 'abbiamo', 'we have'],
              ['voi', 'avete', 'you have (two or more people)'],
              ['loro', 'hanno', 'they have'],
            ],
            highlight: [0, 1, 2, 5],
          },
          careful: 'Because the h is silent, ho, ha and hanno sound exactly like o, a and anno: only the context tells you which one you heard, and in writing the h must be there. hai sounds like English "eye". Don\'t mix up ha (has) and è (is): Marco ha una macchina, Marco è in macchina. And there is no "got": Hai una penna? = Have you got a pen?',
          howItaliansSayIt: {
            it: "Hai il passaporto? Sì, ce l'ho!",
            en: "Have you got the passport? Yes, I've got it!",
            note: "When \"have\" points back to one thing already mentioned, Italians often say ce l'ho (I've got it), ce l'hai?, ce l'ha. Learn it as a chunk for now: the pieces come in Unit 14.",
          },
        },
      ],
      examples: [
        { it: 'Ho una sorella e un fratello.', en: 'I have a sister and a brother.', reg: 'neutral' },
        { it: 'Hai le chiavi?', en: 'Have you got the keys?', reg: 'tu' },
        { it: 'Giulia ha un fratello, Marco.', en: 'Giulia has a brother, Marco.', reg: 'neutral' },
        { it: 'Signora, ha un momento?', en: 'Madam, do you have a moment?', reg: 'lei' },
        { it: 'Abbiamo una prenotazione per due.', en: 'We have a booking for two.', reg: 'neutral' },
        { it: 'Scusi, avete una camera libera?', en: 'Excuse me, do you have a free room?', reg: 'lei' },
        { it: 'I nonni hanno un cane.', en: 'The grandparents have a dog.', reg: 'neutral' },
        { it: 'Scusi, ha una penna?', en: 'Excuse me, do you have a pen?', reg: 'lei' },
        { it: 'Oggi non ho tempo.', en: "I don't have time today.", reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u3-l2-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r2',
          prompt: '___ una sorella e un fratello.', base: '"I have a sister and a brother."', en: 'I have a sister and a brother.',
          answers: ['Ho'], options: ['Ho', 'Hai', 'Ha'],
          mistakes: {
            Hai: 'hai is "you have". "I have" is ho.',
            Ha: 'ha is "he/she has". "I have" is ho.',
          },
          why: WHY_HO,
        },
        {
          id: 'u3-l2-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r2',
          prompt: 'Giulia ___ un fratello, Marco.', base: '"Giulia has a brother, Marco."', en: 'Giulia has a brother, Marco.',
          answers: ['ha'], options: ['ha', 'a', 'è'],
          mistakes: {
            a: 'a without the h means "to" or "at". "Has" is ha: the h is silent, but written.',
            'è': 'è is "is". "Has" is ha.',
          },
          why: WHY_HA,
        },
        {
          id: 'u3-l2-e03', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u3-r2',
          prompt: '___ le chiavi, amore?', base: '"Have you got the keys, love?"', en: 'Have you got the keys, love?',
          answers: ['Hai'], options: ['Hai', 'Ha', 'Ai'],
          mistakes: {
            Ha: 'ha is "he/she has" or the formal "you have". Giulia gets tu: hai.',
            Ai: 'ai without the h means "to the". "You have" is hai.',
          },
          why: WHY_HAI,
        },
        {
          id: 'u3-l2-e04', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r2',
          prompt: 'I nonni ___ un cane.', base: '"The grandparents have a dog."', en: 'The grandparents have a dog.',
          answers: ['hanno'], options: ['hanno', 'anno', 'ha'],
          mistakes: {
            anno: 'anno without the h means "year". "They have" is hanno.',
            ha: 'ha is for one person. The grandparents are two: hanno.',
          },
          why: WHY_HANNO,
        },
        {
          id: 'u3-l2-e05', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r2',
          prompt: 'Noi ___ una prenotazione per due.', base: '"We have a booking for two."', en: 'We have a booking for two.',
          answers: ['abbiamo'], options: ['abbiamo', 'avete', 'hanno'],
          mistakes: {
            avete: 'avete is "you have" (two or more people). "We have" is abbiamo.',
            hanno: 'hanno is "they have". "We have" is abbiamo.',
          },
          why: WHY_ABBIAMO,
        },
        {
          id: 'u3-l2-e06', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u3-r2',
          prompt: 'Scusi, ___ una camera libera?', base: '"Excuse me, do you have a free room?" (asking at the hotel)', en: 'Excuse me, do you have a free room?',
          answers: ['avete'], options: ['avete', 'abbiamo', 'hanno'],
          mistakes: {
            abbiamo: 'abbiamo is "we have". You are asking the hotel: avete.',
            hanno: 'hanno is "they have". Speaking to the hotel: avete.',
          },
          why: 'Asking a hotel, shop or restaurant what it has, Italians use voi (you, the business): avete? scusi is for the one person you are talking to.',
        },
        {
          id: 'u3-l2-e07', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u3-r2',
          prompt: 'Signora, ___ un momento?', base: '"Madam, do you have a moment?"', en: 'Madam, do you have a moment?',
          answers: ['ha'], options: ['ha', 'hai', 'ho'],
          mistakes: {
            hai: 'hai is the tu form. A signora gets Lei: ha.',
            ho: 'ho is "I have". "You have" (Lei) is ha.',
          },
          why: WHY_HA + ' It is also the formal "you have" (Lei).',
        },
        {
          id: 'u3-l2-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r2',
          prompt: 'Ragazzi, ___ la macchina?', base: '"Guys, have you got the car?"', en: 'Guys, have you got the car?',
          answers: ['avete'], options: ['avete', 'abbiamo', 'hanno'],
          mistakes: {
            abbiamo: 'abbiamo is "we have". Asking the group: avete.',
            hanno: 'hanno is "they have". Asking the group: avete.',
          },
          why: WHY_AVETE,
        },

        // Rung 2: fill the gap
        {
          id: 'u3-l2-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r2',
          prompt: 'Marco ___ una macchina nuova.', base: '(avere)', en: 'Marco has a new car.',
          answers: ['ha'],
          mistakes: {
            a: 'a without the h means "to" or "at". "Has" is ha.',
            'è': 'è is "is". "Has" is ha.',
            hai: 'hai is "you have". Marco has: ha.',
          },
          why: WHY_HA,
        },
        {
          id: 'u3-l2-e10', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r2',
          prompt: 'Io ___ una sorella.', base: '(avere)', en: 'I have a sister.',
          answers: ['ho'],
          mistakes: {
            o: 'o without the h means "or". "I have" is ho.',
            ha: 'ha is "he/she has". With io: ho.',
            sono: 'sono is "I am". "I have" is ho.',
          },
          why: WHY_HO,
        },
        {
          id: 'u3-l2-e11', type: 'type', reg: 'tu', rung: 2, ruleId: 'u3-r2',
          prompt: 'Tu ___ il passaporto?', base: '(avere)', en: 'Have you got the passport?',
          answers: ['hai'],
          mistakes: {
            ai: 'ai without the h means "to the". "You have" is hai.',
            ha: 'ha is "he/she has" or the Lei form. With tu: hai.',
          },
          why: WHY_HAI,
        },
        {
          id: 'u3-l2-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r2',
          prompt: 'Loro ___ due figli.', base: '(avere)', en: 'They have two children.',
          answers: ['hanno'],
          mistakes: {
            anno: 'anno means "year". "They have" is hanno: the h is silent, but written.',
            ha: 'ha is for one person. With loro: hanno.',
          },
          why: WHY_HANNO,
        },
        {
          id: 'u3-l2-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r2',
          prompt: 'Oggi non ___ tempo.', base: '(avere: we)', en: "We don't have time today.",
          answers: ['abbiamo'],
          mistakes: {
            avete: 'avete is "you have" (plural). "We have" is abbiamo.',
            hanno: 'hanno is "they have". "We have" is abbiamo.',
            siamo: 'siamo is "we are". "We have" is abbiamo.',
          },
          why: WHY_ABBIAMO,
        },
        {
          id: 'u3-l2-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r2',
          prompt: 'Voi ___ figli?', base: '(avere: asking a couple)', en: 'Do you (two) have children?',
          answers: ['avete'],
          mistakes: {
            abbiamo: 'abbiamo is "we have". Asking the couple: avete.',
            hanno: 'hanno is "they have". Speaking to them: avete.',
          },
          why: WHY_AVETE,
        },
        {
          id: 'u3-l2-e15', type: 'type', reg: 'lei', rung: 2, ruleId: 'u3-r2',
          prompt: 'Signor Conti, ___ un momento?', base: '(avere)', en: 'Mr Conti, do you have a moment?',
          answers: ['ha'],
          mistakes: {
            hai: 'hai is tu. Giulia\'s father gets Lei: ha.',
            a: 'a without the h means "to" or "at". "You have" (Lei) is ha.',
          },
          why: WHY_HA + ' It is also the formal "you have" (Lei).',
        },
        {
          id: 'u3-l2-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r2',
          prompt: 'Giulia e Marco ___ una casa al mare.', base: '(avere)', en: 'Giulia and Marco have a house at the seaside.',
          answers: ['hanno'],
          mistakes: {
            anno: 'anno means "year". "They have" is hanno.',
            ha: 'ha is for one person. Giulia and Marco: hanno.',
            avete: 'avete is "you have". Talking about them: hanno.',
          },
          why: WHY_HANNO,
        },

        // Rung 3: transform
        {
          id: 'u3-l2-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r2',
          prompt: 'Ho una macchina.', base: 'Now say "we" (noi).', en: 'We have a car.',
          answers: ['Abbiamo una macchina.', 'Noi abbiamo una macchina.'],
          mistakes: {
            'Avete una macchina.': 'avete is "you have" (plural). "We have" is abbiamo.',
            'Hanno una macchina.': 'hanno is "they have". "We have" is abbiamo.',
          },
          why: WHY_ABBIAMO,
        },
        {
          id: 'u3-l2-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r2',
          prompt: 'Hai le chiavi?', base: 'Now ask Giulia and Marco together (voi).', en: 'Have you (both) got the keys?',
          answers: ['Avete le chiavi?', 'Voi avete le chiavi?'],
          mistakes: {
            'Hanno le chiavi?': 'hanno is "they have". Speaking to them: avete.',
            'Abbiamo le chiavi?': 'abbiamo is "we have". To two people: avete.',
            'Hai le chiavi?': 'hai is for one person. Two people: avete.',
          },
          why: WHY_AVETE,
        },
        {
          id: 'u3-l2-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r2',
          prompt: 'Marco ha un cane.', base: 'Now it is Marco and Giulia.', en: 'Marco and Giulia have a dog.',
          answers: ['Marco e Giulia hanno un cane.'],
          mistakes: {
            'Marco e Giulia ha un cane.': 'Two people: hanno.',
            'Marco e Giulia anno un cane.': 'anno means "year". "They have" is hanno: the h is silent, but written.',
          },
          why: WHY_HANNO,
        },
        {
          id: 'u3-l2-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r2',
          prompt: 'Ho una domanda.', base: 'Now say it about Giulia.', en: 'Giulia has a question.',
          answers: ['Giulia ha una domanda.'],
          mistakes: {
            'Giulia a una domanda.': 'a means "to" or "at". "Has" is ha.',
            'Giulia ho una domanda.': 'ho is "I have". Giulia has: ha.',
            'Giulia hai una domanda.': 'hai is "you have". Giulia has: ha.',
          },
          why: WHY_HA,
        },
        {
          id: 'u3-l2-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r2',
          prompt: 'I nonni hanno una casa in campagna.', base: 'Now it is just the grandmother: la nonna.', en: 'Grandma has a house in the countryside.',
          answers: ['La nonna ha una casa in campagna.'],
          mistakes: {
            'La nonna hanno una casa in campagna.': 'One person: ha.',
            'La nonna a una casa in campagna.': 'a means "to" or "at". "Has" is ha.',
          },
          why: WHY_HA,
        },

        // Rung 3: switch register
        {
          id: 'u3-l2-e22', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r2',
          prompt: 'Hai un momento?', base: "You asked Giulia. Now ask her father (formal).", en: 'Do you have a moment?',
          answers: ['Ha un momento?', 'Lei ha un momento?', 'Signor Conti, ha un momento?'],
          mistakes: {
            'Hai un momento?': 'That is still the tu form. For Lei, avere is ha.',
            'A un momento?': 'a means "to" or "at". "You have" (Lei) is ha, with a silent h.',
            'Signor Conti, hai un momento?': 'With signor Conti you use Lei: ha.',
            'Lei a un momento?': H_HA,
            'Signor Conti, a un momento?': H_HA,
          },
          why: 'tu hai → Lei ha, the same form as "she has".',
        },
        {
          id: 'u3-l2-e23', type: 'register', reg: 'tu', rung: 3, ruleId: 'u3-r2',
          prompt: 'Ha una penna?', base: 'You asked the receptionist. Now ask Giulia (informal).', en: 'Have you got a pen?',
          answers: ['Hai una penna?', 'Tu hai una penna?'],
          mistakes: {
            'Ha una penna?': 'That is the Lei form. With tu, avere is hai.',
            'Ai una penna?': 'ai means "to the". "You have" is hai.',
            'Tu ai una penna?': H_HAI,
          },
          why: 'Lei ha → tu hai.',
        },
        {
          id: 'u3-l2-e24', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r2',
          prompt: 'Hai fratelli?', base: "You asked Giulia's friend Sara. Now ask Giulia's grandmother (formal).", en: 'Do you have brothers and sisters?',
          answers: ['Ha fratelli?', 'Lei ha fratelli?'],
          mistakes: {
            'Hai fratelli?': 'That is still the tu form. For Lei, avere is ha.',
            'A fratelli?': 'a means "to" or "at". "You have" (Lei) is ha.',
            'Lei a fratelli?': H_HA,
          },
          why: 'tu hai → Lei ha. fratelli covers brothers and sisters together.',
        },
        {
          id: 'u3-l2-e25', type: 'register', reg: 'tu', rung: 3, ruleId: 'u3-r2',
          prompt: 'Ha il numero di Giulia?', base: "You asked Giulia's mother. Now ask Marco (informal).", en: "Have you got Giulia's number?",
          answers: ['Hai il numero di Giulia?', 'Tu hai il numero di Giulia?'],
          mistakes: {
            'Ha il numero di Giulia?': 'That is the Lei form. With tu: hai.',
            'Ai il numero di Giulia?': 'ai means "to the". "You have" is hai.',
            'Tu ai il numero di Giulia?': H_HAI,
          },
          why: 'Lei ha → tu hai.',
        },
        {
          id: 'u3-l2-e26', type: 'register', reg: 'neutral', rung: 3, ruleId: 'u3-r2',
          prompt: 'Hai una macchina?', base: 'You asked Marco. Now ask Marco and his girlfriend together (voi).', en: 'Do you (two) have a car?',
          answers: ['Avete una macchina?', 'Voi avete una macchina?'],
          mistakes: {
            'Hanno una macchina?': 'hanno is "they have". Speaking to them: avete.',
            'Hai una macchina?': 'hai is for one person. Two people: avete.',
          },
          why: WHY_AVETE,
        },

        // Rung 4: build from English
        {
          id: 'u3-l2-e27', type: 'build', reg: 'lei', rung: 4, ruleId: 'u3-r2',
          prompt: 'Translate: "Do you have a pen?"', base: '(to the receptionist)', en: 'Do you have a pen?',
          answers: ['Ha una penna?', 'Lei ha una penna?', 'Scusi, ha una penna?', 'Mi scusi, ha una penna?'],
          mistakes: {
            'Hai una penna?': 'At reception you use Lei: ha.',
            'Scusi, hai una penna?': 'scusi is right, but hai is tu. With Lei: ha.',
            'A una penna?': 'a means "to" or "at". "You have" (Lei) is ha.',
            'Lei a una penna?': H_HA,
            'Scusi, a una penna?': H_HA,
            'Mi scusi, a una penna?': H_HA,
          },
          why: 'With a receptionist, use Lei: ha.',
        },
        {
          id: 'u3-l2-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u3-r2',
          prompt: 'Translate: "We have a booking for two."', base: '(arriving at a restaurant)', en: 'We have a booking for two.',
          answers: ['Abbiamo una prenotazione per due.', 'Noi abbiamo una prenotazione per due.'],
          mistakes: {
            'Avete una prenotazione per due.': 'avete is "you have" (plural). "We have" is abbiamo.',
            'Abbiamo un prenotazione per due.': 'prenotazione is feminine (nouns in -zione are): una.',
          },
          why: WHY_ABBIAMO,
        },
        {
          id: 'u3-l2-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u3-r2',
          prompt: 'Translate: "Giulia has a brother."', base: '(telling a friend about her family)', en: 'Giulia has a brother.',
          answers: ['Giulia ha un fratello.'],
          mistakes: {
            'Giulia a un fratello.': 'a means "to" or "at". "Has" is ha.',
            'Giulia è un fratello.': 'è means "is": that says Giulia is a brother! "Has" is ha.',
          },
          why: WHY_HA,
        },
        {
          id: 'u3-l2-e30', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u3-r2',
          prompt: 'Translate: "The grandparents have a dog."', base: "(about Giulia's grandparents)", en: 'The grandparents have a dog.',
          answers: ['I nonni hanno un cane.'],
          mistakes: {
            'I nonni anno un cane.': 'anno means "year". "They have" is hanno.',
            'I nonni ha un cane.': 'The grandparents are two people: hanno.',
          },
          why: WHY_HANNO,
        },
        {
          id: 'u3-l2-e31', type: 'build', reg: 'lei', rung: 4, ruleId: 'u3-r2',
          prompt: 'Translate: "Do you have children?"', base: '(to an older woman, chatting on the train)', en: 'Do you have children?',
          answers: ['Ha figli?', 'Lei ha figli?', 'Ha dei figli?', 'Signora, ha figli?'],
          mistakes: {
            'Hai figli?': 'To an older stranger, use Lei: ha.',
            'A figli?': 'a means "to" or "at". "You have" (Lei) is ha.',
            'Lei a figli?': H_HA,
            'A dei figli?': H_HA,
            'Signora, a figli?': H_HA,
          },
          why: 'With Lei, avere is ha. figli covers sons and daughters together.',
        },
        {
          id: 'u3-l2-e32', type: 'build', reg: 'tu', rung: 4, ruleId: 'u3-r2',
          prompt: 'Translate: "Have you got a minute?"', base: '(to Giulia)', en: 'Have you got a minute?',
          answers: ['Hai un minuto?', 'Hai un momento?', 'Hai un attimo?', 'Tu hai un minuto?'],
          mistakes: {
            'Ha un minuto?': 'That is the Lei form. To Giulia: hai.',
            'Ai un minuto?': 'ai means "to the". "You have" is hai.',
            'Ai un momento?': H_HAI,
            'Ai un attimo?': H_HAI,
            'Tu ai un minuto?': H_HAI,
          },
          why: WHY_HAI,
        },

        // Rung 5: listen & type
        {
          id: 'u3-l2-e33', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u3-r2',
          prompt: 'Ho una sorella.', base: '', en: 'I have a sister.',
          answers: ['Ho una sorella.'],
          mistakes: { 'O una sorella.': 'You heard ho, "I have": the h is silent, but it is always written.' },
          why: WHY_HO,
        },
        {
          id: 'u3-l2-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u3-r2',
          prompt: 'Giulia ha un fratello.', base: '', en: 'Giulia has a brother.',
          answers: ['Giulia ha un fratello.'],
          mistakes: { 'Giulia a un fratello.': 'You heard ha, "has": the h is silent, but it is always written.' },
          why: WHY_HA,
        },
        {
          id: 'u3-l2-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u3-r2',
          prompt: 'I nonni hanno un cane.', base: '', en: 'The grandparents have a dog.',
          answers: ['I nonni hanno un cane.'],
          mistakes: { 'I nonni anno un cane.': 'You heard hanno, "they have": the h is silent, but it is always written.' },
          why: WHY_HANNO,
        },
        {
          id: 'u3-l2-e36', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u3-r2',
          prompt: 'Hai le chiavi?', base: '', en: 'Have you got the keys?',
          answers: ['Hai le chiavi?'],
          mistakes: {
            'Ai le chiavi?': 'You heard hai, "you have": the h is silent, but it is always written.',
            'Ha le chiavi?': 'You heard hai (like "eye"), the tu form. ha would be Lei.',
          },
          why: WHY_HAI,
        },
        {
          id: 'u3-l2-e37', type: 'listen', reg: 'lei', rung: 5, ruleId: 'u3-r2',
          prompt: 'Signora, ha un momento?', base: '', en: 'Madam, do you have a moment?',
          answers: ['Signora, ha un momento?'],
          mistakes: {
            'Signora, hai un momento?': 'You heard ha, the Lei form: a signora gets Lei.',
            'Signora, a un momento?': 'You heard ha, "you have": the h is silent, but it is always written.',
          },
          why: WHY_HA + ' It is also the formal "you have" (Lei).',
        },
      ],
    },

    // ------------------------------------------------------------ tu, Lei, voi
    {
      id: 'u3-l3',
      title: 'tu or Lei?',
      rules: [
        {
          id: 'u3-r3',
          title: 'tu · Lei · voi',
          sentence: 'Giulia, sei stanca? · Signora, è stanca?',
          marks: [
            { word: 'sei', kind: 'circle', color: 'pink' },
            { word: 'Signora', kind: 'underline', color: 'ultra' },
            { word: 'è', kind: 'circle', color: 'ultra' },
          ],
          why: 'Italian has two ways to say "you" to one person. tu is informal: for your partner, friends, family, children and people your age. Lei is formal: for strangers, shop staff, waiters, officials, and older people you have just met, like your partner\'s parents and grandmother. Lei takes the same verb form as "she": è, ha. For two or more people, formal or not, use voi: siete, avete.',
          table: {
            head: ['tu (informal)', 'Lei (formal)', 'English'],
            rows: [
              ['sei', 'è', 'you are'],
              ['hai', 'ha', 'you have'],
              ['scusa', 'scusi', 'excuse me, sorry'],
              ['come stai?', 'come sta?', 'how are you?'],
              ['ciao', 'buongiorno, buonasera', 'hello'],
            ],
            highlight: [0, 1],
          },
          careful: 'Lei with a capital L is the formal "you"; lei is "she". They sound the same and take the same verb, so context tells you which. Adjectives still match the real person: Lei è stanco, signor Conti? Let the older person offer tu first. Many families soon say "Dammi del tu!" (call me tu): then switch for good, because going back to Lei would sound cold. And use voi for any group, your partner\'s whole family included: Mamma, papà, siete pronti?',
          howItaliansSayIt: {
            it: 'Ma dai, dammi del tu!',
            en: 'Oh, come on, call me tu!',
            note: 'dare del tu means "to use tu with someone", and dare del Lei "to use Lei". When your partner\'s parents say this, answer "Va bene, grazie!" and use tu from then on. (dammi, "give me", is an imperative: Unit 17.)',
          },
        },
      ],
      examples: [
        { it: 'Giulia, sei stanca?', en: 'Giulia, are you tired?', reg: 'tu' },
        { it: 'Signora, è stanca?', en: 'Are you tired, madam?', reg: 'lei' },
        { it: 'Ciao Luca, come stai?', en: 'Hi Luca, how are you?', reg: 'tu' },
        { it: 'Buongiorno, signora, come sta?', en: 'Good morning, madam, how are you?', reg: 'lei' },
        { it: 'Scusa, hai un minuto?', en: 'Sorry, have you got a minute?', reg: 'tu' },
        { it: 'Scusi, ha un minuto?', en: 'Excuse me, have you got a minute?', reg: 'lei' },
        { it: 'Mamma, papà, siete pronti?', en: 'Mum, Dad, are you ready?', reg: 'neutral' },
        { it: 'Lei è di Bologna, signor Conti?', en: 'Are you from Bologna, Mr Conti?', reg: 'lei' },
        { it: 'Grazie, Lei è molto gentile.', en: "Thank you, you're very kind.", reg: 'lei' },
        { it: 'Dammi del tu!', en: 'Call me tu!', reg: 'tu' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u3-l3-e01', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u3-r3',
          prompt: 'Signora, ___ stanca?', base: '"Are you tired, madam?" (to Giulia\'s grandmother)', en: 'Are you tired, madam?',
          answers: ['è'], options: ['sei', 'è'],
          mistakes: { sei: 'sei is tu. Giulia\'s grandmother gets Lei: è.' },
          why: WHY_LEI,
        },
        {
          id: 'u3-l3-e02', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u3-r3',
          prompt: 'Giulia, ___ le chiavi?', base: '"Giulia, have you got the keys?"', en: 'Giulia, have you got the keys?',
          answers: ['hai'], options: ['hai', 'ha'],
          mistakes: { ha: 'ha is the Lei form. Your partner gets tu: hai.' },
          why: WHY_TU_INF,
        },
        {
          id: 'u3-l3-e03', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u3-r3',
          prompt: 'Buongiorno, signor Conti, come ___?', base: '"Good morning, Mr Conti, how are you?"', en: 'Good morning, Mr Conti, how are you?',
          answers: ['sta'], options: ['stai', 'sta'],
          mistakes: { stai: 'stai is the tu form. To Giulia\'s father: come sta?' },
          why: WHY_STA,
        },
        {
          id: 'u3-l3-e04', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u3-r3',
          prompt: "___, dov'è la stazione?", base: '"Excuse me, where\'s the station?" (to a passer-by)', en: "Excuse me, where's the station?",
          answers: ['Scusi'], options: ['Scusa', 'Scusi'],
          mistakes: { Scusa: 'scusa is for tu. To a stranger: scusi.' },
          why: WHY_SCUSI,
        },
        {
          id: 'u3-l3-e05', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u3-r3',
          prompt: 'Ciao Luca, come ___?', base: '"Hi Luca, how are you?"', en: 'Hi Luca, how are you?',
          answers: ['stai'], options: ['stai', 'sta'],
          mistakes: { sta: 'sta is the Lei form. Luca is a friend: come stai?' },
          why: WHY_STA,
        },
        {
          id: 'u3-l3-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r3',
          prompt: 'Mamma, papà, ___ pronti?', base: '"Mum, Dad, are you ready?" (Giulia to her parents)', en: 'Mum, Dad, are you ready?',
          answers: ['siete'], options: ['siete', 'sei', 'è'],
          mistakes: {
            sei: 'sei is for one person. Two people: siete.',
            'è': 'è is for one person (Lei). Two people, formal or not: siete.',
          },
          why: WHY_VOI_ALL,
        },
        {
          id: 'u3-l3-e07', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u3-r3',
          prompt: 'Signor Conti, Lei ___ di Bologna?', base: '"Mr Conti, are you from Bologna?"', en: 'Mr Conti, are you from Bologna?',
          answers: ['è'], options: ['è', 'sei'],
          mistakes: { sei: 'Lei never takes sei. Lei takes the "she" form: è.' },
          why: WHY_LEI,
        },
        {
          id: 'u3-l3-e08', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u3-r3',
          prompt: '___, hai un minuto?', base: '"Sorry, have you got a minute?" (to Giulia)', en: 'Sorry, have you got a minute?',
          answers: ['Scusa'], options: ['Scusa', 'Scusi'],
          mistakes: { Scusi: 'scusi goes with Lei. With hai (tu), say scusa.' },
          why: WHY_SCUSI,
        },

        // Rung 2: fill the gap
        {
          id: 'u3-l3-e09', type: 'type', reg: 'lei', rung: 2, ruleId: 'u3-r3',
          prompt: 'Signora, ___ bisogno di aiuto?', base: '(avere: "do you need" = "do you have need")', en: 'Madam, do you need any help?',
          answers: ['ha'],
          mistakes: {
            hai: 'hai is tu. An older lady you don\'t know gets Lei: ha.',
            a: 'a means "to" or "at". "You have" (Lei) is ha.',
          },
          why: WHY_LEI,
        },
        {
          id: 'u3-l3-e10', type: 'type', reg: 'tu', rung: 2, ruleId: 'u3-r3',
          prompt: 'Giulia, ___ stanca?', base: '(essere)', en: 'Giulia, are you tired?',
          answers: ['sei'],
          mistakes: {
            'è': 'è is the Lei form. Giulia gets tu: sei.',
            sai: 'sai means "you know". "You are" is sei.',
          },
          why: WHY_TU_INF,
        },
        {
          id: 'u3-l3-e11', type: 'type', reg: 'lei', rung: 2, ruleId: 'u3-r3',
          prompt: '___, signora, è libero questo posto?', base: '(excuse me)', en: 'Excuse me, madam, is this seat free?',
          answers: ['Scusi', 'Mi scusi'],
          mistakes: { scusa: 'scusa is for tu. To a signora: scusi.' },
          why: WHY_SCUSI,
        },
        {
          id: 'u3-l3-e12', type: 'type', reg: 'lei', rung: 2, ruleId: 'u3-r3',
          prompt: 'Signora, come ___?', base: '(how are you?)', en: 'How are you, madam?',
          answers: ['sta'],
          mistakes: { stai: 'stai is tu. To a signora: come sta?' },
          why: WHY_STA,
        },
        {
          id: 'u3-l3-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r3',
          prompt: 'Ragazzi, ___ di Roma?', base: '(essere)', en: 'Guys, are you from Rome?',
          answers: ['siete'],
          mistakes: {
            sei: 'sei is for one person. A group: siete.',
            siamo: 'siamo is "we are". Asking the group: siete.',
            sete: 'sete means "thirst". "You are" (plural) is siete, with an i.',
          },
          why: WHY_VOI_ALL,
        },
        {
          id: 'u3-l3-e14', type: 'type', reg: 'lei', rung: 2, ruleId: 'u3-r3',
          prompt: 'Lei ___ molto gentile, signora.', base: '(essere)', en: "You're very kind, madam.",
          answers: ['è'],
          mistakes: { sei: 'Lei never takes sei. Lei takes the "she" form: è.' },
          why: WHY_LEI,
        },
        {
          id: 'u3-l3-e15', type: 'type', reg: 'tu', rung: 2, ruleId: 'u3-r3',
          prompt: 'Marco, ___ il numero di Giulia?', base: '(avere)', en: "Marco, have you got Giulia's number?",
          answers: ['hai'],
          mistakes: {
            ha: 'ha is the Lei form. Giulia\'s brother gets tu: hai.',
            ai: 'ai means "to the". "You have" is hai.',
          },
          why: WHY_TU_INF,
        },

        // Rung 3: transform
        {
          id: 'u3-l3-e16', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r3',
          prompt: 'Sei pronta?', base: 'You asked Giulia. Now ask Giulia and Marco together.', en: 'Are you (both) ready?',
          answers: ['Siete pronti?', 'Voi siete pronti?'],
          mistakes: {
            'Sei pronti?': 'sei is for one person. Two people: siete.',
            'Siete pronte?': 'With Marco in the group, the plural is masculine: pronti.',
            'Sete pronti?': 'sete means "thirst". "You are" (plural) is siete, with an i.',
            'Voi sete pronti?': SETE,
          },
          why: WHY_VOI_ALL,
        },
        {
          id: 'u3-l3-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r3',
          prompt: 'Signora, è pronta?', base: 'You asked Giulia\'s mother. Now ask her and her husband together.', en: 'Are you (both) ready?',
          answers: ['Siete pronti?', 'Voi siete pronti?'],
          mistakes: {
            'Sono pronti?': 'sono pronti is "they are ready", talking about them. Speaking to them: siete.',
            'Siete pronte?': 'With a man in the group, the plural is masculine: pronti.',
            'Sete pronti?': 'sete means "thirst". "You are" (plural) is siete, with an i.',
            'Voi sete pronti?': SETE,
          },
          why: WHY_VOI_ALL,
        },
        {
          id: 'u3-l3-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r3',
          prompt: 'Hai un minuto?', base: "You asked Giulia. Now ask her parents together.", en: 'Have you (both) got a minute?',
          answers: ['Avete un minuto?', 'Voi avete un minuto?'],
          mistakes: {
            'Hanno un minuto?': 'hanno is "they have", talking about them. Speaking to them: avete.',
            'Ha un minuto?': 'ha is Lei, for one person. Two people: avete.',
          },
          why: WHY_VOI_ALL,
        },
        {
          id: 'u3-l3-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r3',
          prompt: 'Scusa, sei di qui?', base: 'You asked a woman your age. Now ask two people at the bus stop.', en: 'Excuse me, are you from around here?',
          answers: ['Scusate, siete di qui?', 'Scusi, siete di qui?'],
          mistakes: {
            'Scusa, siete di qui?': 'scusa is for one person you call tu. To two people: scusate.',
            'Scusate, sei di qui?': 'sei is for one person. Two people: siete.',
            'Scusate, sete di qui?': 'sete means "thirst". "You are" (plural) is siete, with an i.',
            'Scusi, sete di qui?': SETE,
          },
          why: WHY_VOI_ALL,
        },

        // Rung 3: switch register
        {
          id: 'u3-l3-e20', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r3',
          prompt: 'Come stai?', base: "You asked Giulia. Now ask her grandmother (formal).", en: 'How are you?',
          answers: ['Come sta?', 'Lei come sta?', 'Come sta, signora?', 'Signora, come sta?'],
          mistakes: {
            'Come stai?': 'That is still the tu form. With Lei: come sta?',
            'Come stai, signora?': 'With a signora you use Lei: come sta?',
          },
          why: WHY_STA,
        },
        {
          id: 'u3-l3-e21', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r3',
          prompt: 'Sei pronto, Marco?', base: "You asked Giulia's brother. Now ask her father, signor Conti (formal).", en: 'Are you ready, Mr Conti?',
          answers: ['È pronto, signor Conti?', 'Signor Conti, è pronto?', 'È pronto?', 'Lei è pronto?'],
          mistakes: {
            'Sei pronto, signor Conti?': 'With Lei, essere is è: È pronto, signor Conti?',
            "E' pronto, signor Conti?": "Write È with an accent, not E'. (On a phone, hold down E.)",
            'È pronta, signor Conti?': 'Lei takes the verb of "she", but the adjective matches the man: pronto.',
          },
          why: 'tu sei → Lei è. ' + WHY_ADJ,
        },
        {
          id: 'u3-l3-e22', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r3',
          prompt: 'Scusa, hai un minuto?', base: "You asked Giulia. Now ask her father (formal).", en: 'Excuse me, have you got a minute?',
          answers: ['Scusi, ha un minuto?', 'Mi scusi, ha un minuto?'],
          mistakes: {
            'Scusa, ha un minuto?': 'ha is right, but scusa is tu. With Lei: scusi.',
            'Scusi, hai un minuto?': 'scusi is right, but hai is tu. With Lei: ha.',
            'Scusa, hai un minuto?': 'That is still all tu. With Lei: Scusi, ha un minuto?',
            'Scusi, a un minuto?': H_HA,
            'Mi scusi, a un minuto?': H_HA,
          },
          why: 'tu hai → Lei ha, and scusa → scusi.',
        },
        {
          id: 'u3-l3-e23', type: 'register', reg: 'tu', rung: 3, ruleId: 'u3-r3',
          prompt: 'Lei è molto gentile.', base: "You said it to Giulia's mother. Now say it to Giulia (informal).", en: "You're very kind.",
          answers: ['Sei molto gentile.', 'Tu sei molto gentile.', 'Sei gentilissima.'],
          mistakes: {
            'Lei sei molto gentile.': 'Drop Lei: with tu it is sei molto gentile.',
            'È molto gentile.': 'That is still the Lei form. With tu: sei.',
            'Sai molto gentile.': SAI,
            'Tu sai molto gentile.': SAI,
            'Sai gentilissima.': SAI,
          },
          why: 'Lei è → tu sei.',
        },
        {
          id: 'u3-l3-e24', type: 'register', reg: 'tu', rung: 3, ruleId: 'u3-r3',
          prompt: 'Come sta, signora?', base: 'You asked a neighbour. Now ask your friend Luca (informal).', en: 'How are you, Luca?',
          answers: ['Come stai, Luca?', 'Luca, come stai?', 'Ciao Luca, come stai?', 'Come stai?'],
          mistakes: {
            'Come sta, Luca?': 'sta is the Lei form. To a friend: come stai?',
            'Luca, come sta?': 'sta is the Lei form. To a friend: come stai?',
          },
          why: WHY_STA,
        },
        {
          id: 'u3-l3-e25', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r3',
          prompt: 'Hai bisogno di aiuto?', base: "You asked Giulia in the kitchen. Now ask her grandmother (formal).", en: 'Do you need any help?',
          answers: ['Ha bisogno di aiuto?', 'Lei ha bisogno di aiuto?', 'Signora, ha bisogno di aiuto?'],
          mistakes: {
            'Hai bisogno di aiuto?': 'That is still the tu form. With Lei: ha.',
            'A bisogno di aiuto?': 'a means "to" or "at". "You have" (Lei) is ha.',
            'Lei a bisogno di aiuto?': H_HA,
            'Signora, a bisogno di aiuto?': H_HA,
          },
          why: 'tu hai → Lei ha. avere bisogno di = to need.',
        },
        {
          id: 'u3-l3-e26', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r3',
          prompt: 'Di dove sei?', base: 'You asked a student at the language school. Now ask the older man next to you on the train (formal).', en: 'Where are you from?',
          answers: ["Di dov'è?", 'Di dove è?', "Lei di dov'è?", "Di dov'è Lei?"],
          mistakes: {
            'Di dove sei?': 'That is still the tu form. With Lei: di dov\'è?',
            "Di dov'è sei?": "dov'è already contains è. Just say: di dov'è?",
          },
          why: "tu sei → Lei è. dove + è shortens to dov'è.",
        },
        {
          id: 'u3-l3-e27', type: 'register', reg: 'tu', rung: 3, ruleId: 'u3-r3',
          prompt: 'Signora, è di Bologna?', base: "You asked Giulia's grandmother. Now ask Giulia's friend Sara (informal).", en: 'Sara, are you from Bologna?',
          answers: ['Sara, sei di Bologna?', 'Sei di Bologna, Sara?', 'Sei di Bologna?'],
          mistakes: {
            'Sara, è di Bologna?': 'è is the Lei form. Sara is a friend: sei.',
            'Sara, sai di Bologna?': 'sai means "you know". "You are" is sei.',
            'Sai di Bologna, Sara?': SAI,
            'Sai di Bologna?': SAI,
          },
          why: 'Lei è → tu sei.',
        },
        {
          id: 'u3-l3-e28', type: 'register', reg: 'neutral', rung: 3, ruleId: 'u3-r3',
          prompt: 'Hai tempo stasera?', base: 'You asked Giulia. Now ask her parents together (voi).', en: 'Are you (both) free tonight?',
          answers: ['Avete tempo stasera?', 'Voi avete tempo stasera?'],
          mistakes: {
            'Ha tempo stasera?': 'ha is Lei, for one person. Two people: avete.',
            'Hanno tempo stasera?': 'hanno is "they have", talking about them. Speaking to them: avete.',
          },
          why: WHY_VOI_ALL,
        },
        {
          id: 'u3-l3-e29', type: 'register', reg: 'tu', rung: 3, ruleId: 'u3-r3',
          prompt: "Scusi, ha l'ora?", base: 'You asked an older lady. Now ask a teenager at the station (informal).', en: 'Excuse me, have you got the time?',
          answers: ["Scusa, hai l'ora?", "Scusami, hai l'ora?"],
          mistakes: {
            "Scusa, ha l'ora?": 'scusa is right, but ha is Lei. With tu: hai.',
            "Scusi, hai l'ora?": 'hai is right, but scusi is Lei. With tu: scusa.',
            "Scusa, ai l'ora?": 'ai means "to the". "You have" is hai.',
            "Scusami, ai l'ora?": H_HAI,
          },
          why: 'Lei ha → tu hai, and scusi → scusa. Teenagers and people your age get tu.',
        },
        {
          id: 'u3-l3-e30', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r3',
          prompt: 'Sei di qui?', base: 'You asked a guy at a party. Now ask the waiter (formal).', en: 'Are you from around here?',
          answers: ['È di qui?', 'Lei è di qui?'],
          mistakes: {
            'Sei di qui?': 'That is still the tu form. With a waiter: è di qui?',
            "E' di qui?": "Write È with an accent, not E'. (On a phone, hold down E.)",
          },
          why: 'tu sei → Lei è. Waiters and shop staff get Lei.',
        },
        {
          id: 'u3-l3-e31', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r3',
          prompt: 'Mamma, sei stanca?', base: 'Giulia asked her mother. Now you ask her: you still use Lei.', en: 'Are you tired, madam?',
          answers: ['Signora, è stanca?', 'È stanca, signora?', 'È stanca?', 'Lei è stanca?'],
          mistakes: {
            'Signora, sei stanca?': 'You give her Lei until she offers tu: è stanca?',
            'È stanco, signora?': 'Giulia\'s mother is a woman: stanca.',
            "E' stanca?": "Write È with an accent, not E'. (On a phone, hold down E.)",
          },
          why: 'Giulia uses tu with her own mother; you use Lei until she offers tu. ' + WHY_LEI,
        },

        // Rung 4: build from English
        {
          id: 'u3-l3-e32', type: 'build', reg: 'lei', rung: 4, ruleId: 'u3-r3',
          prompt: 'Translate: "How are you, madam?"', base: "(greeting Giulia's grandmother)", en: 'How are you, madam?',
          answers: ['Come sta, signora?', 'Signora, come sta?', 'Come sta?'],
          mistakes: {
            'Come stai, signora?': 'With a signora you have just met, use Lei: come sta?',
            'Signora, come stai?': 'With a signora you have just met, use Lei: come sta?',
          },
          why: WHY_STA,
        },
        {
          id: 'u3-l3-e33', type: 'build', reg: 'lei', rung: 4, ruleId: 'u3-r3',
          prompt: 'Translate: "Are you from Bologna?"', base: "(to Giulia's father)", en: 'Are you from Bologna?',
          answers: ['È di Bologna?', 'Lei è di Bologna?', 'Signor Conti, è di Bologna?', 'È di Bologna, signor Conti?'],
          mistakes: {
            'Sei di Bologna?': "To Giulia's father you use Lei: è di Bologna?",
            "E' di Bologna?": "Write È with an accent, not E'. (On a phone, hold down E.)",
          },
          why: WHY_LEI,
        },
        {
          id: 'u3-l3-e34', type: 'build', reg: 'lei', rung: 4, ruleId: 'u3-r3',
          prompt: 'Translate: "Thank you, you\'re very kind."', base: '(to the woman who gave you directions)', en: "Thank you, you're very kind.",
          answers: [
            'Grazie, Lei è molto gentile.', 'Grazie, è molto gentile.',
            'Grazie, Lei è gentilissima.', 'Grazie, è gentilissima.',
            'Grazie mille, è molto gentile.', 'Grazie mille, Lei è molto gentile.',
          ],
          mistakes: {
            'Grazie, sei molto gentile.': 'To a stranger, use Lei: è molto gentile.',
            'Grazie, Lei sei molto gentile.': 'Lei never takes sei: Lei è.',
          },
          why: WHY_LEI,
        },
        {
          id: 'u3-l3-e35', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u3-r3',
          prompt: 'Translate: "Mum, Dad, are you tired?"', base: '(how Giulia asks her parents: one question for both)', en: 'Mum, Dad, are you tired?',
          answers: ['Mamma, papà, siete stanchi?'],
          mistakes: {
            'Mamma, papà, sei stanco?': 'sei is for one person. Two people: siete stanchi.',
            'Mamma, papà, siete stanche?': 'Mum and Dad together take the masculine plural: stanchi.',
            'Mamma, papà, siete stanci?': 'stanco keeps its hard c in the plural: stanchi.',
            'Mamma, papà, sete stanchi?': 'sete means "thirst". "You are" (plural) is siete, with an i.',
          },
          why: WHY_VOI_ALL,
        },
        {
          id: 'u3-l3-e36', type: 'build', reg: 'tu', rung: 4, ruleId: 'u3-r3',
          prompt: 'Translate: "Sorry, have you got a minute?"', base: '(to Giulia, who is busy)', en: 'Sorry, have you got a minute?',
          answers: ['Scusa, hai un minuto?', 'Scusa, hai un momento?', 'Scusa, hai un attimo?'],
          mistakes: {
            'Scusi, hai un minuto?': 'scusi is Lei. With hai (tu), say scusa.',
            'Scusi, ha un minuto?': 'That is all Lei. Giulia gets tu: Scusa, hai un minuto?',
            'Scusa, ai un minuto?': 'ai means "to the". "You have" is hai.',
            'Scusa, ai un momento?': H_HAI,
            'Scusa, ai un attimo?': H_HAI,
          },
          why: WHY_SCUSI,
        },
        {
          id: 'u3-l3-e37', type: 'build', reg: 'tu', rung: 4, ruleId: 'u3-r3',
          prompt: 'Translate: "Call me tu!"', base: "(Giulia's mother says it to you: dammi = give me)", en: 'Call me tu!',
          answers: ['Dammi del tu!', 'Ma dammi del tu!', 'Dammi pure del tu!'],
          mistakes: {
            'Dammi del Lei!': 'dare del Lei is "to use Lei". She wants tu: dammi del tu.',
            'Dammi il tu!': 'The phrase uses del: dammi del tu.',
          },
          why: 'dare del tu = to use tu with someone. It is the older person who offers it.',
        },
        {
          id: 'u3-l3-e38', type: 'build', reg: 'tu', rung: 4, ruleId: 'u3-r3',
          prompt: 'Translate: "So, how are you?"', base: '(Giulia\'s mother has just said "Dammi del tu!": switch)', en: 'So, how are you?',
          answers: ['Allora, come stai?', 'Come stai, allora?'],
          mistakes: { 'Allora, come sta?': 'She has just offered tu: switch to come stai.' },
          why: 'Once someone offers tu, use it straight away. ' + WHY_STA,
        },

        // Rung 5: listen & type
        {
          id: 'u3-l3-e39', type: 'listen', reg: 'lei', rung: 5, ruleId: 'u3-r3',
          prompt: 'Buonasera, signora, come sta?', base: '', en: 'Good evening, madam, how are you?',
          answers: ['Buonasera, signora, come sta?'],
          mistakes: { 'Buonasera, signora, come stai?': 'You heard sta, the Lei form: no i at the end.' },
          why: WHY_STA,
        },
        {
          id: 'u3-l3-e40', type: 'listen', reg: 'lei', rung: 5, ruleId: 'u3-r3',
          prompt: 'Scusi, Lei è di qui?', base: '', en: 'Excuse me, are you from around here?',
          answers: ['Scusi, Lei è di qui?'],
          mistakes: { 'Scusa, Lei è di qui?': 'You heard scusi, with an i at the end: the Lei form.' },
          why: WHY_SCUSI,
        },
        {
          id: 'u3-l3-e41', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u3-r3',
          prompt: 'Ragazzi, siete pronti?', base: '', en: 'Guys, are you ready?',
          answers: ['Ragazzi, siete pronti?'],
          mistakes: {
            'Ragazzi, siamo pronti?': 'You heard siete, "you are" (plural). siamo would be "we are".',
            'Ragazzi, sete pronti?': 'You heard siete, with an i: "you are". sete means "thirst".',
          },
          why: WHY_VOI_ALL,
        },
        {
          id: 'u3-l3-e42', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u3-r3',
          prompt: 'Giulia, hai un minuto?', base: '', en: 'Giulia, have you got a minute?',
          answers: ['Giulia, hai un minuto?'],
          mistakes: {
            'Giulia, ha un minuto?': 'You heard hai (like "eye"), the tu form.',
            'Giulia, ai un minuto?': 'You heard hai, "you have": the h is silent, but it is always written.',
          },
          why: WHY_TU_INF,
        },
      ],
    },

    // ------------------------------------------------------------ avere where English uses "to be"
    {
      id: 'u3-l4',
      title: 'Hunger, cold and age',
      rules: [
        {
          id: 'u3-r4',
          title: "ho fame · ho freddo · ho trent'anni",
          sentence: "Ho fame, ho sonno e ho trent'anni",
          marks: [
            { word: 'Ho', kind: 'circle', color: 'pink' },
            { word: 'fame', kind: 'underline', color: 'ultra' },
            { word: 'ho', kind: 'circle', color: 'pink' },
            { word: 'sonno', kind: 'underline', color: 'ultra' },
            { word: 'ho', kind: 'circle', color: 'pink' },
            { word: 'anni', kind: 'underline', color: 'ultra' },
          ],
          why: 'Where English says "I am hungry", Italian says "I have hunger": ho fame. The same goes for thirst, cold, heat, sleepiness, hurry, fear, and being right or wrong. Age works this way too: you have years, so "I\'m thirty" is ho trent\'anni. These words are nouns, not adjectives, so they never change for a man or a woman: Giulia ha freddo, Marco ha freddo.',
          table: {
            head: ['Italian', 'English', 'Literally'],
            rows: [
              ['ho fame', "I'm hungry", 'I have hunger'],
              ['ho sete', "I'm thirsty", 'I have thirst'],
              ['ho freddo · ho caldo', "I'm cold · I'm hot", 'I have cold · I have heat'],
              ['ho sonno', "I'm sleepy", 'I have sleep'],
              ['ho fretta', "I'm in a hurry", 'I have hurry'],
              ['ho paura', "I'm scared", 'I have fear'],
              ['ho ragione · ho torto', "I'm right · I'm wrong", 'I have reason · I have wrong'],
              ["ho trent'anni", "I'm thirty", 'I have thirty years'],
            ],
            highlight: [7],
          },
          careful: "Never sono fame or sono trent'anni. With age, keep the word anni: ho trent'anni, not ho trenta (a one-word answer, Trenta!, is fine). \"Very\" matches the noun: molta fame, molta sete, molta paura, molta fretta, but molto freddo, molto caldo, molto sonno. Mind the near-twins: sonno (sleep) has a long n, sono (I am) a short one; sete (thirst) has one t, sette (seven) two. For the weather, Italians say fa freddo (Unit 5): ho freddo is how you feel. Hurry also works with essere: sono di fretta.",
          howItaliansSayIt: {
            it: 'Ho una fame da lupi!',
            en: "I'm starving!",
            note: 'Literally "I have a hunger of wolves". Because fame is a noun, it can take una and a description: una fame da lupi, una sete incredibile.',
          },
        },
      ],
      examples: [
        { it: 'Ho fame, mangiamo?', en: "I'm hungry, shall we eat?", reg: 'neutral' },
        { it: "Hai sete? C'è l'acqua in frigo.", en: "Are you thirsty? There's water in the fridge.", reg: 'tu' },
        { it: 'Signora, ha freddo? Chiudo la finestra.', en: "Are you cold, madam? I'll close the window.", reg: 'lei' },
        { it: "Il nonno ha novant'anni.", en: 'Grandpa is ninety.', reg: 'neutral' },
        { it: 'Quanti anni hai?', en: 'How old are you?', reg: 'tu' },
        { it: 'Hai ragione!', en: "You're right!", reg: 'tu' },
        { it: 'Ha ragione Lei, signor Conti.', en: "You're right, Mr Conti.", reg: 'lei' },
        { it: 'Scusate, abbiamo fretta.', en: "Sorry, we're in a hurry.", reg: 'neutral' },
        { it: 'I bambini hanno sonno.', en: 'The kids are sleepy.', reg: 'neutral' },
        { it: 'Ho molto caldo.', en: "I'm very hot.", reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u3-l4-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r4',
          prompt: '___ fame, mangiamo?', base: '"I\'m hungry, shall we eat?"', en: "I'm hungry, shall we eat?",
          answers: ['Ho'], options: ['Ho', 'Sono'],
          mistakes: { Sono: 'Hunger is something you have: ho fame.' },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r4',
          prompt: 'Giulia ___ freddo.', base: '"Giulia is cold."', en: 'Giulia is cold.',
          answers: ['ha'], options: ['ha', 'è'],
          mistakes: { 'è': 'Feeling cold is something you have: Giulia ha freddo.' },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r4',
          prompt: "Il nonno ___ novant'anni.", base: '"Grandpa is ninety."', en: 'Grandpa is ninety.',
          answers: ['ha'], options: ['ha', 'è'],
          mistakes: { 'è': "Age uses avere: il nonno ha novant'anni." },
          why: WHY_AGE,
        },
        {
          id: 'u3-l4-e04', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u3-r4',
          prompt: 'Signora, ___ sete?', base: '"Are you thirsty, madam?"', en: 'Are you thirsty, madam?',
          answers: ['ha'], options: ['ha', 'hai', 'è'],
          mistakes: {
            hai: 'hai is tu. A signora gets Lei: ha sete?',
            'è': 'Thirst is something you have: ha sete?',
          },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e05', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u3-r4',
          prompt: '___ ragione, amore.', base: '"You\'re right, love."', en: "You're right, love.",
          answers: ['Hai'], options: ['Hai', 'Sei'],
          mistakes: { Sei: 'Being right is avere: hai ragione.' },
          why: WHY_RAGIONE,
        },
        {
          id: 'u3-l4-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r4',
          prompt: 'Scusate, ___ fretta.', base: '"Sorry, we\'re in a hurry."', en: "Sorry, we're in a hurry.",
          answers: ['abbiamo'], options: ['abbiamo', 'siamo', 'avete'],
          mistakes: {
            siamo: 'fretta here is a noun you have: abbiamo fretta. (With essere it would be siamo di fretta.)',
            avete: 'avete is "you have" (plural). "We" is abbiamo.',
          },
          why: WHY_PAURA,
        },
        {
          id: 'u3-l4-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r4',
          prompt: 'I bambini ___ sonno.', base: '"The kids are sleepy."', en: 'The kids are sleepy.',
          answers: ['hanno'], options: ['hanno', 'sono', 'anno'],
          mistakes: {
            sono: 'Sleepiness is something you have: hanno sonno.',
            anno: 'anno means "year". "They have" is hanno.',
          },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r4',
          prompt: 'Ho ___ fame.', base: '"I\'m very hungry."', en: "I'm very hungry.",
          answers: ['molta'], options: ['molta', 'molto'],
          mistakes: { molto: 'fame is a feminine noun, so "much" agrees with it: molta fame.' },
          why: WHY_MOLTA,
        },

        // Rung 2: fill the gap
        {
          id: 'u3-l4-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r4',
          prompt: 'Io ___ sete.', base: '(avere)', en: "I'm thirsty.",
          answers: ['ho'],
          mistakes: {
            sono: 'Thirst is something you have: ho sete.',
            o: 'o without the h means "or". "I have" is ho.',
          },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e10', type: 'type', reg: 'lei', rung: 2, ruleId: 'u3-r4',
          prompt: 'Signor Conti, ___ caldo?', base: '(avere)', en: 'Are you hot, Mr Conti?',
          answers: ['ha'],
          mistakes: {
            hai: 'hai is tu. Giulia\'s father gets Lei: ha.',
            'è': 'Feeling hot is avere: ha caldo. (È caldo is said of a thing, like the soup.)',
          },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e11', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r4',
          prompt: "Marco ___ trent'anni.", base: '(avere)', en: 'Marco is thirty.',
          answers: ['ha'],
          mistakes: {
            'è': "Age uses avere: Marco ha trent'anni.",
            a: 'a means "to" or "at". "Has" is ha.',
          },
          why: WHY_AGE,
        },
        {
          id: 'u3-l4-e12', type: 'type', reg: 'tu', rung: 2, ruleId: 'u3-r4',
          prompt: 'Quanti anni ___, Giulia?', base: '(avere)', en: 'How old are you, Giulia?',
          answers: ['hai'],
          mistakes: {
            sei: 'Age uses avere: quanti anni hai?',
            ha: 'ha is the Lei form. Giulia gets tu: hai.',
          },
          why: WHY_AGE,
        },
        {
          id: 'u3-l4-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r4',
          prompt: 'Ho ___.', base: '(sleepy: the noun "sleep")', en: "I'm sleepy.",
          answers: ['sonno'],
          mistakes: { sono: 'sono is "I am". Sleep has a long n: sonno.' },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e14', type: 'type', reg: 'tu', rung: 2, ruleId: 'u3-r4',
          prompt: "Hai ___? C'è l'acqua in frigo.", base: '(thirst)', en: "Are you thirsty? There's water in the fridge.",
          answers: ['sete'],
          mistakes: { sette: 'sette is "seven". Thirst has one t: sete.' },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r4',
          prompt: 'La nonna ___ paura del cane.', base: '(avere)', en: "Grandma is scared of the dog.",
          answers: ['ha'],
          mistakes: {
            'è': 'Being scared is avere: ha paura.',
            a: 'a means "to" or "at". "Has" is ha.',
          },
          why: WHY_PAURA,
        },
        {
          id: 'u3-l4-e16', type: 'type', reg: 'tu', rung: 2, ruleId: 'u3-r4',
          prompt: 'Hai ___!', base: "(you're right)", en: "You're right!",
          answers: ['ragione'],
          mistakes: { torto: 'torto is "wrong": hai torto = you\'re wrong.' },
          why: WHY_RAGIONE,
        },

        // Rung 3: transform
        {
          id: 'u3-l4-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r4',
          prompt: 'Ho fame.', base: 'Now say it about Giulia and Marco.', en: 'Giulia and Marco are hungry.',
          answers: ['Giulia e Marco hanno fame.'],
          mistakes: {
            'Giulia e Marco ha fame.': 'Two people: hanno.',
            'Giulia e Marco anno fame.': 'anno means "year". "They have" is hanno.',
            'Giulia e Marco sono fame.': 'Hunger is something you have: hanno fame.',
          },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r4',
          prompt: 'Giulia è stanca.', base: 'Now say she is sleepy: use avere and sonno.', en: 'Giulia is sleepy.',
          answers: ['Giulia ha sonno.'],
          mistakes: {
            'Giulia è sonno.': 'sonno is a noun: you have it. Giulia ha sonno.',
            'Giulia ha sono.': 'sono is "I am". Sleep has a long n: sonno.',
            'Giulia a sonno.': 'a means "to" or "at". "Has" is ha.',
          },
          why: 'stanca (tired) is an adjective, so it takes essere. sonno is a noun, so it takes avere.',
        },
        {
          id: 'u3-l4-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r4',
          prompt: "Il nonno ha novant'anni.", base: 'Now it is the grandmother: she is 88 (ottantotto).', en: 'Grandma is 88.',
          answers: ['La nonna ha ottantotto anni.', 'La nonna ha 88 anni.'],
          mistakes: {
            'La nonna è ottantotto anni.': 'Age uses avere: ha ottantotto anni.',
            'La nonna è 88 anni.': 'Age uses avere: ha 88 anni.',
            'La nonna ha ottantotto.': 'Keep the word anni: ha ottantotto anni.',
            'La nonna ha 88.': 'Keep the word anni: ha 88 anni.',
            'La nonna a ottantotto anni.': H_HA,
            'La nonna ha ottantotto ani.': ANI,
            'La nonna a 88 anni.': H_HA,
            'La nonna ha 88 ani.': ANI,
          },
          why: WHY_AGE,
        },
        {
          id: 'u3-l4-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r4',
          prompt: 'Ho caldo.', base: 'Now say "we" (noi).', en: "We're hot.",
          answers: ['Abbiamo caldo.', 'Noi abbiamo caldo.'],
          mistakes: {
            'Siamo caldi.': 'That means you are hot to the touch! Feeling hot is abbiamo caldo.',
            'Siamo caldo.': 'Feeling hot is avere: abbiamo caldo.',
            'Avete caldo.': 'avete is "you have" (plural). "We" is abbiamo.',
          },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e21', type: 'transform', reg: 'tu', rung: 3, ruleId: 'u3-r4',
          prompt: 'Hai ragione.', base: 'Now say the opposite: "You\'re wrong."', en: "You're wrong.",
          answers: ['Hai torto.', 'Tu hai torto.'],
          mistakes: {
            'Sei torto.': 'Being wrong is avere: hai torto.',
            'Sei sbagliato.': 'That says the person is "wrong" as a person! Being wrong about something is hai torto.',
            'Sei sbagliata.': 'That says the person is "wrong" as a person! Being wrong about something is hai torto.',
            'Ai torto.': H_HAI,
            'Tu ai torto.': H_HAI,
          },
          why: WHY_RAGIONE,
        },

        // Rung 3: switch register
        {
          id: 'u3-l4-e22', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r4',
          prompt: 'Hai fame?', base: "You asked Giulia. Now ask her mother (formal).", en: 'Are you hungry?',
          answers: ['Ha fame?', 'Lei ha fame?', 'Signora, ha fame?'],
          mistakes: {
            'Hai fame?': 'That is still the tu form. With Lei: ha fame?',
            'A fame?': 'a means "to" or "at". "You have" (Lei) is ha.',
            'Signora, hai fame?': 'With signora you use Lei: ha fame?',
            'Lei a fame?': H_HA,
            'Signora, a fame?': H_HA,
          },
          why: 'tu hai → Lei ha. ' + WHY_FAME,
        },
        {
          id: 'u3-l4-e23', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r4',
          prompt: 'Hai freddo?', base: "You asked Giulia. Now ask her grandmother (formal).", en: 'Are you cold?',
          answers: ['Ha freddo?', 'Lei ha freddo?', 'Signora, ha freddo?'],
          mistakes: {
            'Hai freddo?': 'That is still the tu form. With Lei: ha freddo?',
            'A freddo?': 'a means "to" or "at". "You have" (Lei) is ha.',
            'È fredda?': 'That asks if she is cold to the touch! Feeling cold is ha freddo?',
            'Lei a freddo?': H_HA,
            'Signora, a freddo?': H_HA,
          },
          why: 'tu hai → Lei ha. ' + WHY_FAME,
        },
        {
          id: 'u3-l4-e24', type: 'register', reg: 'tu', rung: 3, ruleId: 'u3-r4',
          prompt: 'Ha ragione, signor Conti.', base: "You said it to Giulia's father. Now say it to Giulia (informal).", en: "You're right, Giulia.",
          answers: ['Hai ragione, Giulia.', 'Giulia, hai ragione.', 'Hai ragione.', 'Hai ragione tu.'],
          mistakes: {
            'Ha ragione, Giulia.': 'ha is the Lei form. Giulia gets tu: hai.',
            'Ai ragione, Giulia.': 'ai means "to the". "You have" is hai.',
            'Sei ragione, Giulia.': 'Being right is avere: hai ragione.',
            'Giulia, ai ragione.': H_HAI,
            'Ai ragione.': H_HAI,
            'Ai ragione tu.': H_HAI,
          },
          why: 'Lei ha → tu hai. ' + WHY_RAGIONE,
        },
        {
          id: 'u3-l4-e25', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r4',
          prompt: 'Quanti anni hai?', base: "You asked Giulia's little cousin. Now ask her grandfather, who is proud of his age (formal).", en: 'How old are you?',
          answers: ['Quanti anni ha?', 'Lei quanti anni ha?'],
          mistakes: {
            'Quanti anni hai?': 'That is still the tu form. With Lei: quanti anni ha?',
            'Quanti anni è?': 'Age uses avere: quanti anni ha?',
            'Quanti anni a?': H_HA,
            'Lei quanti anni a?': H_HA,
            'Quanti ani ha?': ANI,
            'Lei quanti ani ha?': ANI,
          },
          why: 'tu hai → Lei ha. ' + WHY_AGE,
        },
        {
          id: 'u3-l4-e26', type: 'register', reg: 'tu', rung: 3, ruleId: 'u3-r4',
          prompt: 'Ha sete, signora?', base: 'You asked a neighbour. Now ask your friend Luca (informal).', en: 'Are you thirsty, Luca?',
          answers: ['Hai sete, Luca?', 'Luca, hai sete?', 'Hai sete?'],
          mistakes: {
            'Ha sete, Luca?': 'ha is the Lei form. A friend gets tu: hai.',
            'Hai sette, Luca?': 'sette is "seven". Thirst has one t: sete.',
            'Luca, hai sette?': 'sette is "seven". Thirst has one t: sete.',
            'Ai sete, Luca?': H_HAI,
            'Luca, ai sete?': H_HAI,
            'Ai sete?': H_HAI,
            'Hai sette?': SETTE,
          },
          why: 'Lei ha → tu hai. ' + WHY_FAME,
        },
        {
          id: 'u3-l4-e27', type: 'register', reg: 'lei', rung: 3, ruleId: 'u3-r4',
          prompt: 'Hai fretta?', base: 'You asked Giulia. Now ask the taxi driver (formal).', en: 'Are you in a hurry?',
          answers: ['Ha fretta?', 'Lei ha fretta?', 'È di fretta?'],
          mistakes: {
            'Hai fretta?': 'That is still the tu form. With Lei: ha fretta?',
            'A fretta?': 'a means "to" or "at". "You have" (Lei) is ha.',
            'Lei a fretta?': H_HA,
          },
          why: 'tu hai → Lei ha. ' + WHY_PAURA,
        },

        // Rung 4: build from English
        {
          id: 'u3-l4-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u3-r4',
          prompt: 'Translate: "I\'m thirty."', base: "(Giulia's mother asks how old you are)", en: "I'm thirty.",
          answers: ["Ho trent'anni.", 'Ho trenta anni.', 'Ho 30 anni.', "Io ho trent'anni.", 'Ne ho trenta.'],
          mistakes: {
            "Sono trent'anni.": "Age uses avere: ho trent'anni.",
            'Sono trenta anni.': "Age uses avere: ho trent'anni.",
            'Sono 30 anni.': 'Age uses avere: ho 30 anni.',
            'Sono trenta.': "Age uses avere: ho trent'anni.",
            'Sono 30.': 'Age uses avere: ho 30 anni.',
            'Ho trenta.': "Keep the word anni: ho trent'anni.",
            'Ho 30.': 'Keep the word anni: ho 30 anni.',
            'Ho trentanni.': "trenta + anni shortens with an apostrophe: trent'anni.",
            "Ho trent'ani.": 'Years has a double n: anni. (ani means something quite different!)',
            "O trent'anni.": H_HO,
            'O trenta anni.': H_HO,
            'O 30 anni.': H_HO,
            "Io o trent'anni.": H_HO,
            'Ne o trenta.': H_HO,
            'Ho trenta ani.': ANI,
            'Ho 30 ani.': ANI,
            "Io ho trent'ani.": ANI,
          },
          why: WHY_AGE,
        },
        {
          id: 'u3-l4-e29', type: 'build', reg: 'lei', rung: 4, ruleId: 'u3-r4',
          prompt: 'Translate: "Are you hungry, madam?"', base: "(to Giulia's grandmother, at the table)", en: 'Are you hungry, madam?',
          answers: ['Ha fame, signora?', 'Signora, ha fame?', 'Lei ha fame, signora?'],
          mistakes: {
            'Hai fame, signora?': 'With a signora, use Lei: ha fame?',
            'A fame, signora?': 'a means "to" or "at". "You have" (Lei) is ha.',
            'È fame, signora?': 'Hunger is something you have: ha fame?',
            'Signora, a fame?': H_HA,
            'Lei a fame, signora?': H_HA,
          },
          why: WHY_FAME + ' With Lei: ha.',
        },
        {
          id: 'u3-l4-e30', type: 'build', reg: 'lei', rung: 4, ruleId: 'u3-r4',
          prompt: 'Translate: "We\'re in a hurry."', base: '(to the waiter, asking for the bill)', en: "We're in a hurry.",
          answers: ['Abbiamo fretta.', 'Noi abbiamo fretta.', 'Scusi, abbiamo fretta.', 'Siamo di fretta.', 'Scusi, siamo di fretta.'],
          mistakes: {
            'Siamo fretta.': 'fretta is a noun: abbiamo fretta (or siamo di fretta).',
            'Avete fretta.': 'avete is "you have" (plural). "We" is abbiamo.',
          },
          why: WHY_PAURA,
        },
        {
          id: 'u3-l4-e31', type: 'build', reg: 'tu', rung: 4, ruleId: 'u3-r4',
          prompt: 'Translate: "You\'re right!"', base: '(to Giulia)', en: "You're right!",
          answers: ['Hai ragione!', 'Hai ragione tu!', 'Tu hai ragione!'],
          mistakes: {
            'Sei ragione!': 'Being right is avere: hai ragione.',
            'Sei giusta!': 'giusto means "fair" or "correct". Being right is avere ragione: hai ragione.',
            'Ha ragione!': 'That is the Lei form. To Giulia: hai.',
            'Ai ragione!': H_HAI,
            'Ai ragione tu!': H_HAI,
            'Tu ai ragione!': H_HAI,
          },
          why: WHY_RAGIONE,
        },
        {
          id: 'u3-l4-e32', type: 'build', reg: 'lei', rung: 4, ruleId: 'u3-r4',
          prompt: 'Translate: "You\'re right, Mr Conti."', base: "(agreeing with Giulia's father)", en: "You're right, Mr Conti.",
          answers: ['Ha ragione, signor Conti.', 'Signor Conti, ha ragione.', 'Ha ragione Lei, signor Conti.', 'Lei ha ragione, signor Conti.'],
          mistakes: {
            'Hai ragione, signor Conti.': "Giulia's father gets Lei: ha ragione.",
            'Ha ragione, signore Conti.': 'Before a name, signore drops its final e: signor Conti.',
            'È ragione, signor Conti.': 'Being right is avere: ha ragione.',
            'A ragione, signor Conti.': H_HA,
            'Signor Conti, a ragione.': H_HA,
            'A ragione Lei, signor Conti.': H_HA,
            'Lei a ragione, signor Conti.': H_HA,
          },
          why: WHY_RAGIONE + ' With Lei: ha.',
        },
        {
          id: 'u3-l4-e33', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u3-r4',
          prompt: 'Translate: "Grandma is cold."', base: '(telling Giulia, on the terrace)', en: 'Grandma is cold.',
          answers: ['La nonna ha freddo.'],
          mistakes: {
            'La nonna è fredda.': '"È fredda" means she is cold to the touch (or unfriendly). Feeling cold is ha freddo.',
            'La nonna è freddo.': 'Feeling cold is avere: ha freddo.',
            'La nonna a freddo.': 'a means "to" or "at". "Has" is ha.',
          },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e34', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u3-r4',
          prompt: 'Translate: "The kids are scared."', base: '(during a thunderstorm)', en: 'The kids are scared.',
          answers: ['I bambini hanno paura.', 'I bambini sono spaventati.'],
          mistakes: {
            'I bambini sono paura.': 'paura is a noun: you have it. I bambini hanno paura.',
            'I bambini anno paura.': 'anno means "year". "They have" is hanno.',
            'I bambini ha paura.': 'The kids are more than one: hanno.',
          },
          why: WHY_PAURA,
        },

        // Rung 5: listen & type
        {
          id: 'u3-l4-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u3-r4',
          prompt: 'Ho una fame da lupi!', base: '', en: "I'm starving!",
          answers: ['Ho una fame da lupi!'],
          mistakes: { 'O una fame da lupi!': 'You heard ho, "I have": the h is silent, but it is always written.' },
          why: WHY_FAME + ' una fame da lupi = "a wolves\' hunger".',
        },
        {
          id: 'u3-l4-e36', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u3-r4',
          prompt: 'Ho sonno.', base: '', en: "I'm sleepy.",
          answers: ['Ho sonno.'],
          mistakes: {
            'Ho sono.': 'You heard a long n: sonno, sleep. sono is "I am".',
            'O sonno.': 'You heard ho, "I have": the h is silent, but it is always written.',
          },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e37', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u3-r4',
          prompt: 'Hai sete, amore?', base: '', en: 'Are you thirsty, love?',
          answers: ['Hai sete, amore?'],
          mistakes: {
            'Hai sette, amore?': 'You heard one t: sete, thirst. sette is "seven".',
            'Ai sete, amore?': 'You heard hai, "you have": the h is silent, but it is always written.',
          },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e38', type: 'listen', reg: 'lei', rung: 5, ruleId: 'u3-r4',
          prompt: 'Signora, ha freddo?', base: '', en: 'Are you cold, madam?',
          answers: ['Signora, ha freddo?'],
          mistakes: {
            'Signora, hai freddo?': 'You heard ha, the Lei form: a signora gets Lei.',
            'Signora, a freddo?': 'You heard ha, "you have": the h is silent, but it is always written.',
          },
          why: WHY_FAME,
        },
        {
          id: 'u3-l4-e39', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u3-r4',
          prompt: "Marco ha trent'anni.", base: '', en: 'Marco is thirty.',
          answers: ["Marco ha trent'anni.", 'Marco ha trenta anni.', 'Marco ha 30 anni.'],
          mistakes: {
            "Marco a trent'anni.": 'You heard ha, "has": the h is silent, but it is always written.',
            "Marco ha trent'ani.": 'You heard a long n: anni, years.',
            'Marco a trenta anni.': H_HA,
            'Marco a 30 anni.': H_HA,
            'Marco ha trenta ani.': ANI,
            'Marco ha 30 ani.': ANI,
          },
          why: WHY_AGE,
        },
      ],
    },
  ],
  scene: {
    title: "First dinner with the partner's parents",
    setting: "Friday evening in Bologna. You and Giulia arrive for your first real dinner with her parents, Anna and Paolo Conti. You start with Lei; they don't stay formal for long.",
    lines: [
      { speaker: 'Giulia', it: 'Mamma, papà, eccoci! Scusate il ritardo.', en: "Mum, Dad, here we are! Sorry we're late.", reg: 'neutral' },
      { speaker: 'Anna', it: 'Finalmente! Piacere, io sono Anna. Prego, si accomodi.', en: "At last! Nice to meet you, I'm Anna. Please, have a seat.", reg: 'lei' },
      { speaker: 'You', it: "Piacere, signora. Grazie dell'invito!", en: 'Nice to meet you. Thank you for having me!', reg: 'lei' },
      { speaker: 'Paolo', it: "Allora, Lei è olandese, vero? Di dov'è?", en: "So, you're Dutch, right? Where are you from?", reg: 'lei' },
      { speaker: 'You', it: 'Sì, sono di Utrecht. È una città vicino ad Amsterdam.', en: "Yes, I'm from Utrecht. It's a city near Amsterdam.", reg: 'neutral' },
      { speaker: 'Anna', it: 'E quanti anni ha, se posso chiedere?', en: 'And how old are you, if I may ask?', reg: 'lei' },
      { speaker: 'You', it: 'Ho trentadue anni.', en: "I'm thirty-two.", reg: 'neutral' },
      { speaker: 'Paolo', it: 'E che lavoro fa?', en: 'And what do you do for a living?', reg: 'lei' },
      { speaker: 'You', it: 'Sono insegnante, in una scuola di lingue.', en: "I'm a teacher, at a language school.", reg: 'neutral' },
      { speaker: 'Giulia', it: 'Amore, hai fame? Ci sono le lasagne!', en: "Love, are you hungry? There's lasagne!", reg: 'tu' },
      { speaker: 'You', it: "Sì, ho una fame da lupi! E anche un po' di sete.", en: "Yes, I'm starving! And a bit thirsty too.", reg: 'neutral' },
      { speaker: 'Anna', it: 'Ma dai, dammi del tu! Siamo in famiglia.', en: "Oh, come on, call me tu! We're family.", reg: 'tu' },
      { speaker: 'You', it: 'Va bene, grazie, Anna! Sei molto gentile.', en: "OK, thank you, Anna! You're very kind.", reg: 'tu' },
      { speaker: 'Paolo', it: 'E vale anche per me! Io sono Paolo.', en: "And that goes for me too! I'm Paolo.", reg: 'neutral' },
    ],
    exercises: [
      {
        id: 'u3-s-e01', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u3-r1',
        prompt: 'Allora, Lei ___ olandese, vero?', base: '"So, you\'re Dutch, right?"', en: "So, you're Dutch, right?",
        answers: ['è'], options: ['è', 'sei', 'e'],
        mistakes: {
          sei: 'Paolo uses Lei with you, and Lei takes è.',
          e: 'Without the accent, e means "and". "You are" (Lei) is è.',
        },
        why: WHY_E3 + ' It is also the formal "you are" (Lei).',
      },
      {
        id: 'u3-s-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u3-r4',
        prompt: 'Sì, ___ una fame da lupi!', base: '"Yes, I\'m starving!"', en: "Yes, I'm starving!",
        answers: ['ho'], options: ['ho', 'sono', 'o'],
        mistakes: {
          sono: 'Hunger is something you have: ho una fame da lupi.',
          o: 'o without the h means "or". "I have" is ho.',
        },
        why: WHY_FAME,
      },
      {
        id: 'u3-s-e03', type: 'type', reg: 'lei', rung: 2, ruleId: 'u3-r2',
        prompt: 'E quanti anni ___, se posso chiedere?', base: '(avere: Anna asks you)', en: 'And how old are you, if I may ask?',
        answers: ['ha'],
        mistakes: {
          hai: 'Anna still uses Lei with you here: ha.',
          'è': 'Age uses avere: quanti anni ha?',
        },
        why: WHY_HA + ' It is also the formal "you have" (Lei).',
      },
      {
        id: 'u3-s-e04', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u3-r1',
        prompt: '___ insegnante, in una scuola di lingue.', base: '(essere: I am)', en: "I'm a teacher, at a language school.",
        answers: ['Sono', 'Io sono'],
        mistakes: {
          ho: 'Your job is what you are: sono insegnante.',
          'è': 'è is "he/she is". "I am" is sono.',
        },
        why: WHY_IO + ' With a job, Italians often skip "a": sono insegnante.',
      },
      {
        id: 'u3-s-e05', type: 'register', reg: 'tu', rung: 3, ruleId: 'u3-r3',
        prompt: 'Grazie, signora, Lei è molto gentile.', base: 'Anna has just said "Dammi del tu!". Say it to her again, now with tu.', en: "Thank you, Anna, you're very kind.",
        answers: ['Grazie, Anna, sei molto gentile.', 'Grazie, sei molto gentile.', 'Grazie, Anna, sei gentilissima.'],
        mistakes: {
          'Grazie, Anna, Lei è molto gentile.': 'She has offered tu: switch to sei.',
          'Grazie, Anna, è molto gentile.': 'She has offered tu: switch to sei.',
          'Grazie, Anna, Lei sei molto gentile.': 'Drop Lei when you use tu: sei molto gentile.',
          'Grazie, Anna, sai molto gentile.': SAI,
          'Grazie, sai molto gentile.': SAI,
          'Grazie, Anna, sai gentilissima.': SAI,
        },
        why: 'Once she offers tu, use it: Lei è → tu sei. And she is Anna now, not signora.',
      },
      {
        id: 'u3-s-e06', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u3-r4',
        prompt: 'Ho trentadue anni.', base: 'Now say how old Giulia is: 29 (ventinove).', en: 'Giulia is 29.',
        answers: ['Giulia ha ventinove anni.', 'Giulia ha 29 anni.'],
        mistakes: {
          'Giulia è ventinove anni.': 'Age uses avere: Giulia ha ventinove anni.',
          'Giulia è 29 anni.': 'Age uses avere: Giulia ha 29 anni.',
          'Giulia ha ventinove.': 'Keep the word anni: ha ventinove anni.',
          'Giulia ha 29.': 'Keep the word anni: ha 29 anni.',
          'Giulia a ventinove anni.': 'a means "to" or "at". "Has" is ha.',
          'Giulia ha ventinove ani.': 'Years has a double n: anni.',
          'Giulia a 29 anni.': H_HA,
          'Giulia ha 29 ani.': ANI,
        },
        why: WHY_AGE,
      },
      {
        id: 'u3-s-e07', type: 'build', reg: 'lei', rung: 4, ruleId: 'u3-r3',
        prompt: 'Translate: "And you, where are you from?"', base: '(asking Paolo back, still with Lei)', en: 'And you, where are you from?',
        answers: ["E Lei, di dov'è?", 'E Lei, di dove è?', "Lei di dov'è?"],
        mistakes: {
          'E tu, di dove sei?': "Paolo hasn't offered tu yet: E Lei, di dov'è?",
          'E Lei, di dove sei?': "With Lei, essere is è: di dov'è?",
        },
        why: "Lei takes è, and dove + è shortens to dov'è.",
      },
      {
        id: 'u3-s-e08', type: 'build', reg: 'tu', rung: 4, ruleId: 'u3-r4',
        prompt: 'Translate: "Love, are you hungry?"', base: "(Giulia's question to you: ask it back to her)", en: 'Love, are you hungry?',
        answers: ['Amore, hai fame?', 'Hai fame, amore?'],
        mistakes: {
          'Amore, sei fame?': 'Hunger is something you have: hai fame?',
          'Amore, ha fame?': 'ha is the Lei form. To Giulia: hai.',
          'Amore, ai fame?': 'ai means "to the". "You have" is hai.',
          'Ai fame, amore?': H_HAI,
        },
        why: WHY_FAME,
      },
      {
        id: 'u3-s-e09', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u3-r3',
        prompt: 'Ma dai, dammi del tu!', base: '', en: 'Oh, come on, call me tu!',
        answers: ['Ma dai, dammi del tu!'],
        mistakes: { 'Ma dai, dammi del Lei!': 'You heard tu: she is offering the informal "you".' },
        why: 'dare del tu = to use tu with someone. When the older person offers it, switch.',
      },
      {
        id: 'u3-s-e10', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u3-r1',
        prompt: 'Siamo in famiglia.', base: '', en: "We're family.",
        answers: ['Siamo in famiglia.'],
        mistakes: { 'Siete in famiglia.': 'You heard siamo, "we are". siete would be "you are" (plural).' },
        why: WHY_NOI,
      },
    ],
  },
};
