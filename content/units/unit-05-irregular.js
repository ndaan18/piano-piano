// Unit 5: Irregular verbs. Data only (schema: spec §9).
// Exercise field use by type:
//   recognise  prompt with ___ gap, options (2–4, include the answer)
//   type       prompt with ___ gap, answers = the missing word(s)
//   transform  prompt = sentence to rewrite, base = the instruction
//   register   prompt = sentence said to one person, base = who to say it to now; reg = target register
//   build      prompt = 'Translate: "…"', base = context line
//   listen     prompt = the Italian sentence to speak, answers = that sentence
// Three lessons, one rule each: andare & venire · fare & stare · dire, uscire, dare, sapere.
// Cast as in Units 3–4: partner Giulia, her parents Anna and Paolo (on tu terms), her brother
// Marco, the grandparents, friends Luca and Sara, neighbour signor Bianchi. Lei goes to
// strangers, staff, Giulia's grandparents and signor Bianchi. Voi lines are tagged neutral.
// Person slips on a word's last letter (vai/va, dici/dice) never pass as a typo, and words of
// four letters or fewer (vado, sto, dà, sai) get no typo tolerance at all. Mid-word slips in
// longer words would pass, so they get keys through SLIPS: vadiamo/andamo, vengiamo/vienite,
// faciamo, stamo, dichono/dicano, esciamo/uscono, damo, sapiamo/sappete, and a single n in
// vanno, fanno, stanno, danno, sanno; in sentences, also first-letter swaps between short verbs
// (vai/fai/dai/sai, va/fa/sa/da). dà without its accent is left to the accent rule, as
// è/e is in Unit 3, except where da is a recognise option.

// Shared key messages for the mid-word slips listed above.
const IAMO = (right) => `The noi ending is -iamo, with an i: ${right}.`;
const AND = (right) => `noi and voi keep the and- of andare: ${right}.`;
const DOUBLE_N = (right) => `${right} has a double n.`;
const VIE = (right) => `venire adds an i with tu and with lui/lei/Lei: ${right}.`;
const NO_G = (right) => `Only io and loro add a g (vengo, vengono): ${right}.`;
const NO_IE = (right) => `The ie is only in vieni and viene: ${right}.`;
const CC = (right) => `fare has a double c here: ${right}.`;
const U_BACK = (right) => `With noi and voi, uscire keeps its u: ${right}.`;
const ESC = (right) => `uscire changes its u to e when the stress falls on the stem: ${right}.`;
const ONO = (inf, right) => `${inf} has -ono for "they", not -ano: ${right}.`;

// Mid-word slips that the checker would otherwise pass as a small typo. withSlipKeys (end of
// file) adds each one as a key to every typed answer containing the right word, in every
// word order the exercise accepts. Explicit keys in an exercise take precedence.
const SLIPS = {
  // andare
  andiamo: { andamo: IAMO('andiamo'), vadiamo: AND('andiamo') },
  andate: { andete: 'andare is an -are verb, so voi ends in -ate: andate.', andite: 'andare is an -are verb, so voi ends in -ate: andate.', vadate: AND('andate') },
  vanno: { vano: DOUBLE_N('vanno') },
  // venire
  vengo: { viengo: 'No i in vengo: only vieni and viene have one.', vengho: 'No h: g before o is already hard: vengo.' },
  vieni: { veni: VIE('vieni'), vengi: 'Only io and loro add a g. With tu: vieni.' },
  viene: { vene: VIE('viene'), venge: 'Only io and loro add a g. With lui/lei/Lei: viene.' },
  veniamo: { vengiamo: NO_G('veniamo'), vieniamo: NO_IE('veniamo'), venamo: IAMO('veniamo') },
  venite: { vengite: NO_G('venite'), vienite: NO_IE('venite'), venete: 'venire is an -ire verb, so voi ends in -ite: venite.' },
  vengono: { venono: 'Keep the g of vengo: vengono.', vengano: ONO('venire', 'vengono'), viengono: 'No i in vengono: only vieni and viene have one.' },
  // fare, stare
  faccio: { facio: CC('faccio'), facco: 'Keep the i: it makes the cc soft, as in "ch": faccio.' },
  facciamo: {
    faciamo: CC('facciamo'),
    facchiamo: 'No h: the c is soft before i: facciamo.',
    facciano: 'The noi ending is -iamo: facciamo. ("They do" is fanno.)',
  },
  fanno: { fano: DOUBLE_N('fanno') },
  stiamo: { stamo: IAMO('stiamo') },
  stanno: { stano: DOUBLE_N('stanno') },
  state: { stete: 'stare is an -are verb, so voi ends in -ate: state.' },
  // dire, uscire, dare, sapere
  dici: { dichi: 'No h: c before i is soft, as in "ch": dici.' },
  diciamo: { dicamo: IAMO('diciamo'), dichiamo: 'No h: the c of dic- is soft before i: diciamo.' },
  dicono: { dichono: 'No h: c before o is already hard: dicono.', dicano: ONO('dire', 'dicono') },
  usciamo: { esciamo: U_BACK('usciamo'), uscamo: IAMO('usciamo') },
  uscite: { escite: U_BACK('uscite'), uscete: 'uscire is an -ire verb, so voi ends in -ite: uscite.' },
  escono: { uscono: ESC('escono'), escano: ONO('uscire', 'escono'), esciono: 'No extra i: sc before o already sounds "sk": escono.', eschono: 'No h: sc before o already sounds "sk": escono.' },
  esco: { usco: ESC('esco') },
  esci: { usci: ESC('esci') },
  esce: { usce: ESC('esce') },
  dice: { dite: 'dite is "you say" to two or more people. One person says: dice.' },
  fate: { fatte: 'fate has one t.' },
  diamo: { damo: IAMO('diamo') },
  danno: { dano: DOUBLE_N('danno') },
  sappiamo: { sapiamo: 'sappiamo has a double p.' },
  sapete: { sappete: 'Only sappiamo has a double p: sapete.', sapite: 'sapere is an -ere verb, so voi ends in -ete: sapete.' },
  sanno: { sano: 'sano means "healthy". "They know" is sanno, with a double n.' },
};

// Short verbs one letter apart from each other (vai/fai/dai/sai, va/fa/sa/da, vanno/fanno/danno/sanno).
// Inside a sentence, a slip on the first letter of a short word passes as a typo, so each family
// member gets the others as keys. Only families whose swaps never make a correct sentence here:
// stiamo/siamo is left out, because "stasera siamo a casa" is fine Italian.
const VERB = {
  va: ['andare', 'go'], vai: ['andare', 'go'], vanno: ['andare', 'go'],
  fa: ['fare', 'do'], fai: ['fare', 'do'], fanno: ['fare', 'do'], fate: ['fare', 'do'],
  dai: ['dare', 'give'], danno: ['dare', 'give'], date: ['dare', 'give'], diamo: ['dare', 'give'], do: ['dare', 'give'],
  sa: ['sapere', 'know'], sai: ['sapere', 'know'], sanno: ['sapere', 'know'], so: ['sapere', 'know'],
  sta: ['stare', 'stay, be'], stai: ['stare', 'stay, be'], stanno: ['stare', 'stay, be'], sto: ['stare', 'stay, be'],
  sei: ['essere', 'be'], siamo: ['essere', 'be'], dice: ['dire', 'say'], dite: ['dire', 'say'],
};
const FAMILIES = [
  ['va', 'fa', 'sa', 'sta', 'da'], ['vai', 'fai', 'dai', 'sai', 'stai', 'sei'],
  ['vanno', 'fanno', 'danno', 'sanno', 'stanno'], ['fate', 'date'], ['diamo', 'siamo'], ['do', 'so', 'sto'], ['dice', 'dite'],
];
const describe = (w) => (w === 'da' ? 'da means "from"' : `${w} is from ${VERB[w][0]} ("${VERB[w][1]}")`);
const need = (w) => (w === 'da' ? 'da ("from")' : `${w}, from ${VERB[w][0]}`);
const oneEdit = (a, b) => {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return a.slice(i + 1) === b.slice(i + 1) || a.slice(i) === b.slice(i + 1) || a.slice(i + 1) === b.slice(i);
};
for (const family of FAMILIES) {
  for (const right of family) {
    for (const wrong of family) {
      if (wrong === right || !oneEdit(right, wrong)) continue;
      SLIPS[right] ??= {};
      SLIPS[right][wrong] ??= `${describe(wrong)}. Here you need ${need(right)}.`;
    }
  }
}

// u5-r1: andare & venire
const WHY_VADO = 'andare is irregular: vado, vai, va, vanno. Only noi and voi keep the and- of andare: andiamo, andate.';
const WHY_VA_LEI = 'Lei takes the "she" form of andare: va. tu takes vai.';
const WHY_ANDIAMO = 'noi and voi are the regular-looking forms of andare: andiamo, andate. The other four start with v-: vado, vai, va, vanno.';
const WHY_VENGO = 'venire adds a g with io and loro (vengo, vengono) and an i with tu and lui/lei/Lei (vieni, viene). noi and voi are regular: veniamo, venite.';
const WHY_VIENE_LEI = 'Lei takes the "she" form of venire: viene. tu takes vieni.';
const WHY_VENIRE = 'venire is for coming to where the speaker or listener is, or going along with them: Vieni con noi? = Are you coming with us?';
const WHY_A_IN = 'With andare, a city takes a (vado a Roma); a country or a region usually takes in (vado in Italia, in Toscana).';
const WHY_ANDARE_A = 'andare a + an infinitive means "go and do": andiamo a mangiare = let\'s go and eat. The a is needed.';

// u5-r2: fare & stare
const WHY_FACCIO = 'fare is irregular: faccio, fai, fa, facciamo, fate, fanno. faccio and facciamo have a double c.';
const WHY_FARE_LEI = 'Lei takes the "she" form of fare: fa. tu takes fai.';
const WHY_STO = 'stare goes sto, stai, sta, stiamo, state, stanno: the same endings as fare, apart from io and noi.';
const WHY_STARE_HOW = 'Italians ask how someone is with stare: Come stai? (tu), Come sta? (Lei). The answer is Sto bene, or just Bene.';
const WHY_WEATHER = 'For the weather Italians use fare: fa freddo, fa caldo, che tempo fa?';
const WHY_FARE_USES = 'Many everyday activities take fare: fare colazione, fare la spesa, fare una passeggiata, fare la doccia, fare una foto.';
const WHY_STAY = 'stare also means "stay": stasera sto a casa = I\'m staying at home tonight.';
const WHY_LAVORO = 'Che lavoro fai? (tu) / Che lavoro fa? (Lei) is how Italians ask what you do for a living.';

// u5-r3: dire, uscire, dare, sapere
const WHY_DIRE = 'dire works from the stem dic-: dico, dici, dice, diciamo, dicono. Only voi is different: dite.';
const WHY_USCIRE = 'uscire becomes esc- when the stress falls on the stem: esco, esci, esce, escono. usciamo and uscite keep the u.';
const WHY_DARE = 'dare goes do, dai, dà, diamo, date, danno. Only dà ("he/she gives") has an accent, to tell it apart from da ("from").';
const WHY_SAPERE = 'sapere goes so, sai, sa, sappiamo, sapete, sanno. Only sappiamo has a double p.';
const WHY_SAPERE_LEI = 'Lei takes the "she" form of sapere: sa. tu takes sai.';
const WHY_SAPERE_HOW = 'sapere + an infinitive means "know how to", where English often says "can": Sai nuotare? = Can you swim?';
const WHY_DARE_LEI = 'Lei takes the "she" form of dare: dà, with an accent. tu takes dai.';

const unit = {
  id: 5,
  slug: 'irregular-verbs',
  title: 'Irregular verbs',
  teaser: 'vado, faccio, sto',
  canSay: 'Cosa facciamo stasera? Usciamo alle otto: vieni anche tu?',
  lessons: [
    // ------------------------------------------------------------ andare & venire
    {
      id: 'u5-l1',
      title: 'andare & venire',
      rules: [
        {
          id: 'u5-r1',
          title: 'vado · vai · va — vengo · vieni · viene',
          sentence: 'Vado a Roma · Vieni con noi? · I nonni vengono domenica',
          marks: [
            { word: 'Vado', kind: 'circle', color: 'pink' },
            { word: 'Vieni', kind: 'circle', color: 'pink' },
            { word: 'vengono', kind: 'underline', color: 'ultra' },
          ],
          why: 'andare ("go") and venire ("come") are irregular, so learn the six forms by heart. andare starts with v- in four forms (vado, vai, va, vanno), but noi and voi keep the and- of andare: andiamo, andate. venire adds a g with io and loro (vengo, vengono) and an i with tu and he/she/Lei (vieni, viene); noi and voi are regular: veniamo, venite. With andare, a city takes a (vado a Roma) and a country or region usually takes in (vado in Italia, vado in Toscana). And andare a + an infinitive means "go and do": Andiamo a mangiare? = Shall we go and eat?',
          table: {
            head: ['verb', 'andare (go)', 'venire (come)'],
            rows: [
              ['io', 'vado', 'vengo'],
              ['tu', 'vai', 'vieni'],
              ['lui / lei / Lei', 'va', 'viene'],
              ['noi', 'andiamo', 'veniamo'],
              ['voi', 'andate', 'venite'],
              ['loro', 'vanno', 'vengono'],
            ],
            highlight: [3, 4],
          },
          careful: 'venire is for moving towards the person you are talking to, or going along with them; for going anywhere else, use andare. So when someone calls you over, you answer Vengo! (I\'m coming to you), and when Giulia asks Vieni con noi? (are you coming with us?), you say Sì, vengo! Vado! on its own is for leaving: Ciao, vado! = Bye, I\'m off! Mind vai (tu) and va (he, she, Lei), one letter apart, and the double n in vanno.',
          howItaliansSayIt: {
            it: 'Dai, andiamo!',
            en: 'Come on, let\'s go!',
            note: 'andiamo is both "we go" and "let\'s go": the same form, said as an invitation. Here dai isn\'t "you give": it is a filler meaning "come on".',
          },
        },
      ],
      examples: [
        { it: 'Domani vado a Roma.', en: "I'm going to Rome tomorrow.", reg: 'neutral' },
        { it: 'Giulia va in Toscana con i nonni.', en: 'Giulia is going to Tuscany with her grandparents.', reg: 'neutral' },
        { it: 'Vieni con noi stasera?', en: 'Are you coming with us tonight?', reg: 'tu' },
        { it: 'Signora, viene anche Lei?', en: 'Are you coming too, madam?', reg: 'lei' },
        { it: 'Andiamo a mangiare una pizza?', en: 'Shall we go and eat a pizza?', reg: 'neutral' },
        { it: 'Scusi, dove va questo autobus?', en: 'Excuse me, where does this bus go?', reg: 'lei' },
        { it: 'I nonni vengono a pranzo domenica.', en: 'The grandparents are coming for lunch on Sunday.', reg: 'neutral' },
        { it: 'Vengo subito, amore!', en: "I'm coming, love!", reg: 'tu' },
        { it: 'Ragazzi, andate in centro?', en: 'Guys, are you going into town?', reg: 'neutral' },
        { it: 'Ciao, vado! A domani.', en: "Bye, I'm off! See you tomorrow.", reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u5-l1-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r1',
          prompt: 'Domani ___ a Roma.', base: '"I\'m going to Rome tomorrow."', en: "I'm going to Rome tomorrow.",
          answers: ['vado'], options: ['vado', 'vai', 'va'],
          mistakes: {
            vai: 'vai is "you go". "I go" is vado.',
            va: 'va is "he/she goes" or the formal "you go". "I go" is vado.',
          },
          why: WHY_VADO,
        },
        {
          id: 'u5-l1-e02', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u5-r1',
          prompt: 'Giulia, ___ con noi stasera?', base: '"Giulia, are you coming with us tonight?"', en: 'Giulia, are you coming with us tonight?',
          answers: ['vieni'], options: ['vieni', 'viene', 'vengo'],
          mistakes: {
            viene: 'viene is "he/she comes" or the Lei form. Giulia gets tu: vieni.',
            vengo: 'vengo is "I come". Asking Giulia: vieni.',
          },
          why: WHY_VENGO,
        },
        {
          id: 'u5-l1-e03', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u5-r1',
          prompt: 'Signora, ___ anche Lei?', base: '"Are you coming too, madam?"', en: 'Are you coming too, madam?',
          answers: ['viene'], options: ['viene', 'vieni', 'venite'],
          mistakes: {
            vieni: 'vieni is the tu form. With Lei: viene.',
            venite: 'venite is "you come" to two or more people. One signora with Lei: viene.',
          },
          why: WHY_VIENE_LEI,
        },
        {
          id: 'u5-l1-e04', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r1',
          prompt: 'I nonni ___ a pranzo domenica.', base: '"The grandparents are coming for lunch on Sunday."', en: 'The grandparents are coming for lunch on Sunday.',
          answers: ['vengono'], options: ['vengono', 'viene', 'vengano'],
          mistakes: {
            viene: 'viene is for one person. The grandparents are two: vengono.',
            vengano: ONO('venire', 'vengono'),
          },
          why: WHY_VENGO,
        },
        {
          id: 'u5-l1-e05', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u5-r1',
          prompt: 'Scusi, dove ___ questo autobus?', base: '"Excuse me, where does this bus go?" (to the driver)', en: 'Excuse me, where does this bus go?',
          answers: ['va'], options: ['va', 'vai', 'vanno'],
          mistakes: {
            vai: 'vai is "you go". The bus is "it": va.',
            vanno: 'vanno is "they go". One bus: va.',
          },
          why: WHY_VADO,
        },
        {
          id: 'u5-l1-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r1',
          prompt: '___ a mangiare una pizza?', base: '"Shall we go and eat a pizza?"', en: 'Shall we go and eat a pizza?',
          answers: ['Andiamo'], options: ['Andiamo', 'Vadiamo', 'Andate'],
          mistakes: {
            Vadiamo: AND('andiamo'),
            Andate: 'andate is "you go" (two or more people). "Shall we go" is andiamo.',
          },
          why: WHY_ANDIAMO + ' ' + WHY_ANDARE_A,
        },
        {
          id: 'u5-l1-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r1',
          prompt: '"Amore, a tavola!" "___ subito!"', base: '"Love, dinner\'s ready!" "I\'m coming!"', en: '"Love, dinner\'s ready!" "I\'m coming!"',
          answers: ['Vengo'], options: ['Vengo', 'Vado', 'Viene'],
          mistakes: {
            Vado: 'Vado! means "I\'m off". Giulia is calling you over, so you are coming to her: Vengo!',
            Viene: 'viene is "he/she comes". For yourself: vengo.',
          },
          why: WHY_VENIRE + ' Answering a call is Vengo! (or Arrivo!).',
        },
        {
          id: 'u5-l1-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r1',
          prompt: 'Giulia va ___ Toscana con i nonni.', base: '"Giulia is going to Tuscany with her grandparents."', en: 'Giulia is going to Tuscany with her grandparents.',
          answers: ['in'], options: ['in', 'a'],
          mistakes: {
            a: 'a is for cities (a Firenze). Tuscany is a region: in Toscana.',
          },
          why: WHY_A_IN,
        },

        // Rung 2: fill the gap
        {
          id: 'u5-l1-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r1',
          prompt: 'Io ___ a casa, ciao!', base: '(andare)', en: "I'm going home, bye!",
          answers: ['vado'],
          mistakes: {
            vai: 'vai is "you go". With io: vado.',
            va: 'va is "he/she goes". With io: vado.',
            ando: 'andare is irregular: "I go" is vado.',
          },
          why: WHY_VADO,
        },
        {
          id: 'u5-l1-e10', type: 'type', reg: 'tu', rung: 2, ruleId: 'u5-r1',
          prompt: 'Sara, ___ in centro?', base: '(andare)', en: 'Sara, are you going into town?',
          answers: ['vai'],
          mistakes: {
            va: 'va is the Lei form. Sara is a friend: vai.',
            vado: 'vado is "I go". Asking Sara: vai.',
            andi: 'andare is irregular: "you go" is vai.',
          },
          why: WHY_VADO,
        },
        {
          id: 'u5-l1-e11', type: 'type', reg: 'lei', rung: 2, ruleId: 'u5-r1',
          prompt: 'Signor Bianchi, ___ in centro?', base: '(andare)', en: 'Mr Bianchi, are you going into town?',
          answers: ['va'],
          mistakes: {
            vai: 'vai is the tu form. The neighbour gets Lei: va.',
            vado: 'vado is "I go". Asking him: va.',
          },
          why: WHY_VA_LEI,
        },
        {
          id: 'u5-l1-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r1',
          prompt: 'Noi ___ in Italia a luglio.', base: '(andare)', en: "We're going to Italy in July.",
          answers: ['andiamo'],
          mistakes: {
            vadiamo: AND('andiamo'),
            andamo: IAMO('andiamo'),
            vanno: 'vanno is "they go". With noi: andiamo.',
          },
          why: WHY_ANDIAMO,
        },
        {
          id: 'u5-l1-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r1',
          prompt: 'Marco e Sara ___ domani.', base: '(venire)', en: 'Marco and Sara are coming tomorrow.',
          answers: ['vengono'],
          mistakes: {
            viene: 'viene is for one person. Marco and Sara: vengono.',
            venono: 'Keep the g of vengo: vengono.',
            vengano: ONO('venire', 'vengono'),
            veniamo: 'veniamo is "we come". Talking about them: vengono.',
          },
          why: WHY_VENGO,
        },
        {
          id: 'u5-l1-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r1',
          prompt: 'Ragazzi, a che ora ___?', base: '(venire)', en: 'Guys, what time are you coming?',
          answers: ['venite'],
          mistakes: {
            vienite: NO_IE('venite'),
            vengite: NO_G('venite'),
            vengono: 'vengono is "they come". Asking the group: venite.',
          },
          why: WHY_VENGO,
        },
        {
          id: 'u5-l1-e15', type: 'type', reg: 'tu', rung: 2, ruleId: 'u5-r1',
          prompt: 'Luca, ___ a ballare con noi?', base: '(venire)', en: 'Luca, are you coming dancing with us?',
          answers: ['vieni'],
          mistakes: {
            viene: 'viene is the Lei form. Luca is a friend: vieni.',
            veni: VIE('vieni'),
            vengi: 'Only io and loro add a g. With tu: vieni.',
            vengo: 'vengo is "I come". Asking Luca: vieni.',
          },
          why: WHY_VENGO + ' ' + WHY_VENIRE,
        },
        {
          id: 'u5-l1-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r1',
          prompt: 'I ragazzi ___ a ballare stasera.', base: '(andare)', en: 'The guys are going dancing tonight.',
          answers: ['vanno'],
          mistakes: {
            vano: DOUBLE_N('vanno'),
            andano: 'andare is irregular: "they go" is vanno.',
            va: 'va is for one person. The guys: vanno.',
          },
          why: WHY_VADO,
        },

        // Rung 3: transform
        {
          id: 'u5-l1-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r1',
          prompt: 'Vado a Firenze.', base: 'Now say "we" (noi).', en: "We're going to Florence.",
          answers: ['Andiamo a Firenze.', 'Noi andiamo a Firenze.'],
          mistakes: {
            'Vadiamo a Firenze.': AND('andiamo'),
            'Noi vadiamo a Firenze.': AND('andiamo'),
            'Vanno a Firenze.': 'vanno is "they go". "We go" is andiamo.',
            'Andate a Firenze.': 'andate is "you go" (plural). "We go" is andiamo.',
          },
          why: WHY_ANDIAMO,
        },
        {
          id: 'u5-l1-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r1',
          prompt: 'Vengo domani.', base: 'Now say it about the grandparents: start with I nonni.', en: 'The grandparents are coming tomorrow.',
          answers: ['I nonni vengono domani.', 'I nonni domani vengono.'],
          mistakes: {
            'I nonni viene domani.': 'The grandparents are two people: vengono.',
            'I nonni vengo domani.': 'vengo is "I come". The grandparents: vengono.',
            'I nonni vienono domani.': 'No i in vengono, but a g: vengono.',
          },
          why: WHY_VENGO,
        },
        {
          id: 'u5-l1-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r1',
          prompt: 'Vai in Italia?', base: 'Now ask Giulia and Marco together (voi).', en: 'Are you (both) going to Italy?',
          answers: ['Andate in Italia?', 'Voi andate in Italia?'],
          mistakes: {
            'Vanno in Italia?': 'vanno is "they go". Speaking to them: andate.',
            'Vai in Italia?': 'vai is for one person. Two people: andate.',
          },
          why: WHY_ANDIAMO,
        },
        {
          id: 'u5-l1-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r1',
          prompt: 'Vado a Roma.', base: 'Now say you are going to Italy (Italia).', en: "I'm going to Italy.",
          answers: ['Vado in Italia.', 'Io vado in Italia.'],
          mistakes: {
            'Vado a Italia.': 'a is for cities (a Roma). Italy is a country: in Italia.',
            'Io vado a Italia.': 'a is for cities (a Roma). Italy is a country: in Italia.',
          },
          why: WHY_A_IN,
        },
        {
          id: 'u5-l1-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r1',
          prompt: 'Vieni stasera?', base: 'Now ask Luca and Sara together (voi).', en: 'Are you (both) coming tonight?',
          answers: ['Venite stasera?', 'Voi venite stasera?', 'Stasera venite?'],
          mistakes: {
            'Vengono stasera?': 'vengono is "they come". Speaking to them: venite.',
            'Vieni stasera?': 'vieni is for one person. Two people: venite.',
          },
          why: WHY_VENGO,
        },

        // Rung 3: switch register
        {
          id: 'u5-l1-e22', type: 'register', reg: 'lei', rung: 3, ruleId: 'u5-r1',
          prompt: 'Dove vai?', base: 'You asked Marco. Now ask an older man at the station (formal).', en: 'Where are you going?',
          answers: ['Dove va?', 'Lei dove va?', 'Dove va Lei?', 'Scusi, dove va?', 'Mi scusi, dove va?', 'Scusi, Lei dove va?'],
          mistakes: {
            'Dove vai?': 'That is still the tu form. With Lei: dove va?',
            'Scusi, dove vai?': 'scusi is right, but vai is tu. With Lei: va.',
            'Scusa, dove va?': 'va is right, but scusa is for tu. With Lei: scusi.',
            'Lei dove vai?': 'Lei takes the "she" form: Lei dove va?',
          },
          why: 'tu vai → Lei va. ' + WHY_VA_LEI,
        },
        {
          id: 'u5-l1-e23', type: 'register', reg: 'lei', rung: 3, ruleId: 'u5-r1',
          prompt: 'Vieni a pranzo domenica?', base: 'You asked Luca. Now invite signor Bianchi, the neighbour (formal).', en: 'Are you coming for lunch on Sunday?',
          answers: [
            'Viene a pranzo domenica?', 'Lei viene a pranzo domenica?', 'Domenica viene a pranzo?',
            'Signor Bianchi, viene a pranzo domenica?', 'Viene a pranzo domenica, signor Bianchi?',
          ],
          mistakes: {
            'Vieni a pranzo domenica?': 'That is still the tu form. With Lei: viene.',
            'Signor Bianchi, vieni a pranzo domenica?': 'With signor Bianchi you use Lei: viene.',
            'Lei vieni a pranzo domenica?': 'Lei takes the "she" form: Lei viene.',
          },
          why: 'tu vieni → Lei viene. ' + WHY_VIENE_LEI,
        },
        {
          id: 'u5-l1-e24', type: 'register', reg: 'tu', rung: 3, ruleId: 'u5-r1',
          prompt: 'Signora, va in centro?', base: 'You asked a neighbour. Now ask Sara (informal).', en: 'Are you going into town?',
          answers: ['Sara, vai in centro?', 'Vai in centro?', 'Vai in centro, Sara?', 'Tu vai in centro?', 'Sara, tu vai in centro?'],
          mistakes: {
            'Sara, va in centro?': 'va is the Lei form. To Sara: vai.',
            'Va in centro?': 'va is the Lei form. To Sara: vai.',
            'Va in centro, Sara?': 'va is the Lei form. To Sara: vai.',
          },
          why: 'Lei va → tu vai.',
        },
        {
          id: 'u5-l1-e25', type: 'register', reg: 'tu', rung: 3, ruleId: 'u5-r1',
          prompt: 'Da dove viene?', base: 'You asked an older lady on the train. Now ask a student at a party (informal).', en: 'Where are you from?',
          answers: ['Da dove vieni?', 'Tu da dove vieni?', 'Da dove vieni tu?', 'E tu, da dove vieni?'],
          mistakes: {
            'Da dove viene?': 'That is still the Lei form. With tu: vieni.',
            'Tu da dove viene?': 'With tu the verb is vieni: tu da dove vieni?',
          },
          why: 'Lei viene → tu vieni. Da dove vieni? = Where are you from?',
        },

        // Rung 4: build from English
        {
          id: 'u5-l1-e26', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u5-r1',
          prompt: 'Translate: "Come on, let\'s go home!"', base: '(to Giulia and Marco, at the end of a long evening)', en: "Come on, let's go home!",
          answers: ['Dai, andiamo a casa!', 'Andiamo a casa!', 'Dai, andiamo a casa.', 'Su, andiamo a casa!'],
          mistakes: {
            'Dai, andate a casa!': 'andate is "you go" (plural). "Let\'s go" is andiamo.',
            'Dai, andiamo alla casa!': 'Home is just a casa, with no article.',
          },
          why: WHY_ANDIAMO + ' andiamo also means "let\'s go".',
        },
        {
          id: 'u5-l1-e27', type: 'build', reg: 'lei', rung: 4, ruleId: 'u5-r1',
          prompt: 'Translate: "Where are you going?"', base: "(to Giulia's grandmother, who is putting on her coat)", en: 'Where are you going?',
          answers: ['Dove va?', 'Lei dove va?', 'Dove va Lei?', 'Signora, dove va?', 'Dove va, signora?', 'Dove sta andando?'],
          mistakes: {
            'Dove vai?': "You use Lei with Giulia's grandmother: dove va?",
            'Signora, dove vai?': 'With signora you use Lei: dove va?',
            'Dove vado?': 'vado is "I go". Asking her: dove va?',
          },
          why: WHY_VA_LEI,
        },
        {
          id: 'u5-l1-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u5-r1',
          prompt: 'Translate: "I\'m going to Italy in July."', base: '(telling a colleague about your holidays)', en: "I'm going to Italy in July.",
          answers: [
            'A luglio vado in Italia.', 'Vado in Italia a luglio.', 'A luglio io vado in Italia.', 'Io vado in Italia a luglio.',
            'In luglio vado in Italia.', 'Vado in Italia in luglio.',
          ],
          mistakes: {
            'A luglio vado a Italia.': 'a is for cities. Italy is a country: in Italia.',
            'Vado a Italia a luglio.': 'a is for cities. Italy is a country: in Italia.',
            'A luglio va in Italia.': 'va is "he/she goes". "I go" is vado.',
          },
          why: WHY_A_IN + ' The present covers plans: a luglio vado = I\'m going in July.',
        },
        {
          id: 'u5-l1-e29', type: 'build', reg: 'tu', rung: 4, ruleId: 'u5-r1',
          prompt: 'Translate: "Are you coming with us?"', base: "(to Giulia's brother Marco)", en: 'Are you coming with us?',
          answers: ['Vieni con noi?', 'Marco, vieni con noi?', 'Vieni con noi, Marco?', 'Tu vieni con noi?', 'Vieni anche tu con noi?'],
          mistakes: {
            'Viene con noi?': 'viene is the Lei form. Marco gets tu: vieni.',
            'Marco, viene con noi?': 'viene is the Lei form. Marco gets tu: vieni.',
            'Veni con noi?': VIE('vieni'),
          },
          why: WHY_VENIRE,
        },
        {
          id: 'u5-l1-e30', type: 'build', reg: 'lei', rung: 4, ruleId: 'u5-r1',
          prompt: 'Translate: "Excuse me, does this bus go to the centre?"', base: '(to the bus driver)', en: 'Excuse me, does this bus go to the centre?',
          answers: [
            'Scusi, questo autobus va in centro?', 'Mi scusi, questo autobus va in centro?',
            'Scusi, va in centro questo autobus?', 'Mi scusi, va in centro questo autobus?',
          ],
          mistakes: {
            'Scusa, questo autobus va in centro?': 'To the driver, use Lei: scusi.',
            'Scusi, questo autobus vai in centro?': 'vai is "you go". The bus is "it": va.',
            'Scusi, questo autobus va a centro?': 'The centre is in centro.',
          },
          why: 'The bus is "it", so va. Scusi is the Lei "excuse me", right for a driver.',
        },
        {
          id: 'u5-l1-e31', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u5-r1',
          prompt: 'Translate: "The grandparents are coming on Sunday."', base: '(telling Luca)', en: 'The grandparents are coming on Sunday.',
          answers: ['I nonni vengono domenica.', 'Domenica vengono i nonni.', 'Domenica i nonni vengono.', 'I nonni domenica vengono.'],
          mistakes: {
            'I nonni viene domenica.': 'The grandparents are two people: vengono.',
            'Domenica viene i nonni.': 'The grandparents are two people: vengono.',
          },
          why: WHY_VENGO,
        },

        // Rung 5: listen & type
        {
          id: 'u5-l1-e32', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u5-r1',
          prompt: 'Andiamo a mangiare una pizza?', base: '', en: 'Shall we go and eat a pizza?',
          answers: ['Andiamo a mangiare una pizza?'],
          mistakes: {
            'Andate a mangiare una pizza?': 'You heard andiamo, "shall we go". andate would be "you go".',
            'Andiamo mangiare una pizza?': 'You heard a before mangiare: andare a + infinitive.',
          },
          why: WHY_ANDARE_A,
        },
        {
          id: 'u5-l1-e33', type: 'listen', reg: 'lei', rung: 5, ruleId: 'u5-r1',
          prompt: 'Signora, viene anche Lei?', base: '', en: 'Are you coming too, madam?',
          answers: ['Signora, viene anche Lei?'],
          mistakes: {
            'Signora, vieni anche Lei?': 'You heard viene: with signora, the Lei form.',
          },
          why: WHY_VIENE_LEI,
        },
        {
          id: 'u5-l1-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u5-r1',
          prompt: 'I ragazzi vanno in Toscana.', base: '', en: 'The guys are going to Tuscany.',
          answers: ['I ragazzi vanno in Toscana.'],
          mistakes: {
            'I ragazzi vanno a Toscana.': 'You heard in: Tuscany is a region, so in Toscana.',
            'I ragazzi va in Toscana.': 'You heard vanno: the guys are more than one.',
          },
          why: WHY_VADO + ' ' + WHY_A_IN,
        },
        {
          id: 'u5-l1-e35', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u5-r1',
          prompt: 'Vengo subito, amore!', base: '', en: "I'm coming, love!",
          answers: ['Vengo subito, amore!'],
          mistakes: {
            'Vieni subito, amore!': 'You heard vengo, "I\'m coming". vieni would be "you come".',
          },
          why: WHY_VENIRE,
        },
      ],
    },

    // ------------------------------------------------------------ fare & stare
    {
      id: 'u5-l2',
      title: 'fare & stare',
      rules: [
        {
          id: 'u5-r2',
          title: 'faccio · fai · fa — sto · stai · sta',
          sentence: 'Faccio colazione · Che lavoro fa? · Come stai?',
          marks: [
            { word: 'Faccio', kind: 'circle', color: 'pink' },
            { word: 'fa', kind: 'circle', color: 'pink' },
            { word: 'stai', kind: 'underline', color: 'ultra' },
          ],
          why: 'fare means "do" or "make", and Italians use it for a lot of everyday things: fare colazione (have breakfast), fare la spesa (do the food shopping), fare una passeggiata (go for a walk), fare la doccia (have a shower), fare una foto (take a photo). Che lavoro fai? = What do you do for a living? It also does the weather: fa freddo, fa caldo = it\'s cold, it\'s hot. stare means "stay", and it is how Italians say how someone is: Come stai? Sto bene. Learn the two as a pair: fai/stai, fa/sta, fate/state, fanno/stanno. Only io and noi are different: faccio, facciamo; sto, stiamo.',
          table: {
            head: ['verb', 'fare (do, make)', 'stare (stay, be)'],
            rows: [
              ['io', 'faccio', 'sto'],
              ['tu', 'fai', 'stai'],
              ['lui / lei / Lei', 'fa', 'sta'],
              ['noi', 'facciamo', 'stiamo'],
              ['voi', 'fate', 'state'],
              ['loro', 'fanno', 'stanno'],
            ],
            highlight: [0, 3],
          },
          careful: 'faccio and facciamo have a double c; fanno and stanno have a double n. fa and sta have no accent. essere or stare? Keep it simple for now: for how someone is, use stare (Come sta? Sto bene); for where a thing or a place is, use essere (Dov\'è la stazione? Le chiavi sono in cucina). stare a casa means "stay at home". And for the weather Italian says fare, not "be": fa freddo = it\'s cold.',
          howItaliansSayIt: {
            it: 'Come stai? — Bene, grazie, e tu?',
            en: 'How are you? — Fine, thanks, and you?',
            note: 'Italians answer with just bene as often as with sto bene. To someone you call Lei: Come sta? — Bene, grazie, e Lei?',
          },
        },
      ],
      examples: [
        { it: 'Faccio colazione a casa.', en: 'I have breakfast at home.', reg: 'neutral' },
        { it: 'Che lavoro fa, signora?', en: 'What do you do for a living, madam?', reg: 'lei' },
        { it: 'Ciao Luca, come stai?', en: 'Hi Luca, how are you?', reg: 'tu' },
        { it: 'Buongiorno, signor Bianchi! Come sta?', en: 'Good morning, Mr Bianchi! How are you?', reg: 'lei' },
        { it: 'Oggi fa freddo.', en: "It's cold today.", reg: 'neutral' },
        { it: 'Facciamo una passeggiata in centro?', en: 'Shall we go for a walk in the centre?', reg: 'neutral' },
        { it: 'Stasera sto a casa.', en: "I'm staying at home tonight.", reg: 'neutral' },
        { it: 'Giulia e Marco fanno la spesa.', en: 'Giulia and Marco are doing the food shopping.', reg: 'neutral' },
        { it: 'Ragazzi, cosa fate stasera?', en: 'Guys, what are you doing tonight?', reg: 'neutral' },
        { it: 'Sto bene, grazie. E Lei?', en: "I'm fine, thanks. And you?", reg: 'lei' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u5-l2-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r2',
          prompt: '___ colazione a casa.', base: '"I have breakfast at home."', en: 'I have breakfast at home.',
          answers: ['Faccio'], options: ['Faccio', 'Fai', 'Fa'],
          mistakes: {
            Fai: 'fai is "you do". "I do" is faccio.',
            Fa: 'fa is "he/she does" or the formal "you do". "I do" is faccio.',
          },
          why: WHY_FACCIO + ' fare colazione = have breakfast.',
        },
        {
          id: 'u5-l2-e02', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u5-r2',
          prompt: 'Che lavoro ___, signora?', base: '"What do you do for a living, madam?"', en: 'What do you do for a living, madam?',
          answers: ['fa'], options: ['fa', 'fai', 'fate'],
          mistakes: {
            fai: 'fai is the tu form. A signora gets Lei: fa.',
            fate: 'fate is "you do" to two or more people. One signora: fa.',
          },
          why: WHY_LAVORO,
        },
        {
          id: 'u5-l2-e03', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u5-r2',
          prompt: 'Ciao Luca, come ___?', base: '"Hi Luca, how are you?"', en: 'Hi Luca, how are you?',
          answers: ['stai'], options: ['stai', 'sta', 'sei'],
          mistakes: {
            sta: 'sta is the Lei form. Luca is a friend: stai.',
            sei: 'Come sei? asks what someone is like. "How are you?" is come stai?',
          },
          why: WHY_STARE_HOW,
        },
        {
          id: 'u5-l2-e04', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u5-r2',
          prompt: 'Buongiorno, signor Bianchi! Come ___?', base: '"Good morning, Mr Bianchi! How are you?"', en: 'Good morning, Mr Bianchi! How are you?',
          answers: ['sta'], options: ['sta', 'stai', 'stanno'],
          mistakes: {
            stai: 'stai is the tu form. The neighbour gets Lei: sta.',
            stanno: 'stanno is "they are". One person with Lei: sta.',
          },
          why: WHY_STARE_HOW,
        },
        {
          id: 'u5-l2-e05', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r2',
          prompt: 'Oggi ___ freddo.', base: '"It\'s cold today."', en: "It's cold today.",
          answers: ['fa'], options: ['fa', 'è', 'sta'],
          mistakes: {
            'è': 'For the weather Italians say fa freddo. (È freddo describes a thing: il caffè è freddo.)',
            sta: 'For the weather Italians use fare: fa freddo.',
          },
          why: WHY_WEATHER,
        },
        {
          id: 'u5-l2-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r2',
          prompt: 'Stasera ___ a casa.', base: '"I\'m staying at home tonight."', en: "I'm staying at home tonight.",
          answers: ['sto'], options: ['sto', 'stai', 'sta'],
          mistakes: {
            stai: 'stai is "you stay". "I stay" is sto.',
            sta: 'sta is "he/she stays". "I stay" is sto.',
          },
          why: WHY_STAY,
        },
        {
          id: 'u5-l2-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r2',
          prompt: 'Giulia e Marco ___ la spesa.', base: '"Giulia and Marco are doing the food shopping."', en: 'Giulia and Marco are doing the food shopping.',
          answers: ['fanno'], options: ['fanno', 'fa', 'fate'],
          mistakes: {
            fa: 'fa is for one person. Giulia and Marco: fanno.',
            fate: 'fate is "you do" (plural). Talking about them: fanno.',
          },
          why: WHY_FACCIO + ' fare la spesa = do the food shopping.',
        },
        {
          id: 'u5-l2-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r2',
          prompt: 'Ragazzi, cosa ___ stasera?', base: '"Guys, what are you doing tonight?"', en: 'Guys, what are you doing tonight?',
          answers: ['fate'], options: ['fate', 'fanno', 'facciamo'],
          mistakes: {
            fanno: 'fanno is "they do". Asking the group: fate.',
            facciamo: 'facciamo is "we do". Asking the group: fate.',
          },
          why: WHY_FACCIO,
        },

        // Rung 2: fill the gap
        {
          id: 'u5-l2-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r2',
          prompt: 'Prima ___ la doccia.', base: '(fare: io)', en: "First I'll have a shower.",
          answers: ['faccio'],
          mistakes: {
            facio: CC('faccio'),
            fa: 'fa is "he/she does". "I do" is faccio.',
            fai: 'fai is "you do". "I do" is faccio.',
          },
          why: WHY_FACCIO + ' fare la doccia = have a shower.',
        },
        {
          id: 'u5-l2-e10', type: 'type', reg: 'tu', rung: 2, ruleId: 'u5-r2',
          prompt: 'Marco, che lavoro ___?', base: '(fare)', en: 'Marco, what do you do for a living?',
          answers: ['fai'],
          mistakes: {
            fa: 'fa is the Lei form. Marco gets tu: fai.',
            faci: 'fare is irregular: "you do" is fai.',
          },
          why: WHY_LAVORO,
        },
        {
          id: 'u5-l2-e11', type: 'type', reg: 'tu', rung: 2, ruleId: 'u5-r2',
          prompt: 'Amore, ___ bene?', base: '(stare)', en: 'Love, are you OK?',
          answers: ['stai'],
          mistakes: {
            sta: 'sta is the Lei form. To Giulia: stai.',
            sei: 'For how someone is, Italians use stare: stai bene?',
            sto: 'sto is "I am". Asking her: stai.',
          },
          why: WHY_STARE_HOW,
        },
        {
          id: 'u5-l2-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r2',
          prompt: 'Domenica ___ una passeggiata.', base: '(fare: noi)', en: "On Sunday we're going for a walk.",
          answers: ['facciamo'],
          mistakes: {
            faciamo: CC('facciamo'),
            fanno: 'fanno is "they do". "We do" is facciamo.',
            fate: 'fate is "you do" (plural). "We do" is facciamo.',
          },
          why: WHY_FACCIO + ' fare una passeggiata = go for a walk.',
        },
        {
          id: 'u5-l2-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r2',
          prompt: 'I nonni ___ bene, grazie.', base: '(stare)', en: 'The grandparents are well, thanks.',
          answers: ['stanno'],
          mistakes: {
            stano: DOUBLE_N('stanno'),
            sta: 'sta is for one person. The grandparents: stanno.',
            sono: 'For how someone is, Italians use stare: stanno bene.',
          },
          why: WHY_STO + ' ' + WHY_STARE_HOW,
        },
        {
          id: 'u5-l2-e14', type: 'type', reg: 'lei', rung: 2, ruleId: 'u5-r2',
          prompt: 'Scusi, ci ___ una foto?', base: '(fare)', en: 'Excuse me, could you take a photo of us?',
          answers: ['fa'],
          mistakes: {
            fai: 'fai is tu. With scusi, to a stranger: fa.',
            fate: 'scusi is for one person, so the verb is fa. (fate is for two or more.)',
          },
          why: WHY_FARE_LEI + ' ci = "us" here: ci fa una foto? = will you take a photo of us?',
        },
        {
          id: 'u5-l2-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r2',
          prompt: 'Ragazzi, come ___?', base: '(stare)', en: 'Guys, how are you?',
          answers: ['state'],
          mistakes: {
            stanno: 'stanno is "they are". Asking the group: state.',
            stai: 'stai is for one person. The group: state.',
          },
          why: WHY_STO,
        },
        {
          id: 'u5-l2-e16', type: 'type', reg: 'tu', rung: 2, ruleId: 'u5-r2',
          prompt: 'Perché ___ zitto, Marco?', base: '(stare)', en: 'Why are you so quiet, Marco?',
          answers: ['stai'],
          mistakes: {
            sta: 'sta is the Lei form. Marco gets tu: stai.',
          },
          why: 'stare zitto = keep quiet, be silent. ' + WHY_STO,
        },

        // Rung 3: transform
        {
          id: 'u5-l2-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r2',
          prompt: 'Faccio la spesa.', base: 'Now say "we" (noi).', en: "We're doing the food shopping.",
          answers: ['Facciamo la spesa.', 'Noi facciamo la spesa.'],
          mistakes: {
            'Fanno la spesa.': 'fanno is "they do". "We do" is facciamo.',
            'Fate la spesa.': 'fate is "you do" (plural). "We do" is facciamo.',
          },
          why: WHY_FACCIO,
        },
        {
          id: 'u5-l2-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r2',
          prompt: 'Sto bene.', base: 'Now say it about the grandparents: start with I nonni.', en: 'The grandparents are well.',
          answers: ['I nonni stanno bene.'],
          mistakes: {
            'I nonni sta bene.': 'The grandparents are two people: stanno.',
            'I nonni sono bene.': 'For how someone is, Italians use stare: stanno bene.',
            'I nonni stiamo bene.': 'stiamo is "we are". The grandparents: stanno.',
          },
          why: WHY_STARE_HOW,
        },
        {
          id: 'u5-l2-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r2',
          prompt: 'Fai una foto?', base: 'Now ask Giulia and Marco together (voi).', en: 'Are you (both) taking a photo?',
          answers: ['Fate una foto?', 'Voi fate una foto?'],
          mistakes: {
            'Fanno una foto?': 'fanno is "they do". Speaking to them: fate.',
            'Facete una foto?': 'fare is irregular: voi is fate.',
            'Fatte una foto?': 'fate has one t.',
          },
          why: WHY_FACCIO + ' fare una foto = take a photo.',
        },
        {
          id: 'u5-l2-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r2',
          prompt: 'Stasera sto a casa.', base: 'Now say "we" (noi).', en: "We're staying at home tonight.",
          answers: ['Stasera stiamo a casa.', 'Stasera noi stiamo a casa.', 'Noi stasera stiamo a casa.'],
          mistakes: {
            'Stasera stanno a casa.': 'stanno is "they stay". "We stay" is stiamo.',
            'Stasera state a casa.': 'state is "you stay" (plural). "We stay" is stiamo.',
          },
          why: WHY_STAY + ' ' + WHY_STO,
        },
        {
          id: 'u5-l2-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r2',
          prompt: 'Che lavoro fai?', base: 'Now ask Luca and Sara together (voi).', en: 'What do you (both) do for a living?',
          answers: ['Che lavoro fate?', 'Voi che lavoro fate?', 'Che lavoro fate voi?', 'Che lavori fate?'],
          mistakes: {
            'Che lavoro fanno?': 'fanno is "they do". Speaking to them: fate.',
            'Che lavoro facete?': 'fare is irregular: voi is fate.',
          },
          why: WHY_LAVORO + ' To two or more people: Che lavoro fate?',
        },

        // Rung 3: switch register
        {
          id: 'u5-l2-e22', type: 'register', reg: 'lei', rung: 3, ruleId: 'u5-r2',
          prompt: 'Come stai?', base: "You asked Sara. Now ask Giulia's grandmother (formal).", en: 'How are you?',
          answers: ['Come sta?', 'Lei come sta?', 'Come sta Lei?', 'Signora, come sta?', 'Come sta, signora?'],
          mistakes: {
            'Come stai?': 'That is still the tu form. With Lei: come sta?',
            'Signora, come stai?': 'With signora you use Lei: come sta?',
            'Lei come stai?': 'Lei takes the "she" form: Lei come sta?',
          },
          why: 'tu stai → Lei sta. ' + WHY_STARE_HOW,
        },
        {
          id: 'u5-l2-e23', type: 'register', reg: 'lei', rung: 3, ruleId: 'u5-r2',
          prompt: 'Che lavoro fai?', base: "You asked a guy at a party. Now ask an older man at Giulia's parents' dinner (formal).", en: 'What do you do for a living?',
          answers: ['Che lavoro fa?', 'Lei che lavoro fa?', 'Che lavoro fa Lei?', 'E Lei che lavoro fa?'],
          mistakes: {
            'Che lavoro fai?': 'That is still the tu form. With Lei: fa.',
            'Lei che lavoro fai?': 'Lei takes the "she" form: Lei che lavoro fa?',
          },
          why: 'tu fai → Lei fa. ' + WHY_LAVORO,
        },
        {
          id: 'u5-l2-e24', type: 'register', reg: 'tu', rung: 3, ruleId: 'u5-r2',
          prompt: 'Signora, cosa fa stasera?', base: 'You asked a neighbour. Now ask Sara (informal).', en: 'What are you doing tonight?',
          answers: [
            'Sara, cosa fai stasera?', 'Cosa fai stasera?', 'Cosa fai stasera, Sara?', 'Stasera cosa fai?',
            'Che fai stasera?', 'Sara, che fai stasera?', 'Che cosa fai stasera?', 'Sara, che cosa fai stasera?',
          ],
          mistakes: {
            'Sara, cosa fa stasera?': 'fa is the Lei form. To Sara: fai.',
            'Cosa fa stasera?': 'fa is the Lei form. To Sara: fai.',
            'Cosa fa stasera, Sara?': 'fa is the Lei form. To Sara: fai.',
          },
          why: 'Lei fa → tu fai.',
        },
        {
          id: 'u5-l2-e25', type: 'register', reg: 'lei', rung: 3, ruleId: 'u5-r2',
          prompt: 'Stai bene?', base: 'You asked Marco. Now ask an older lady who has just tripped on the stairs (formal).', en: 'Are you OK?',
          answers: ['Sta bene?', 'Signora, sta bene?', 'Sta bene, signora?', 'Lei sta bene?', 'Scusi, sta bene?'],
          mistakes: {
            'Stai bene?': 'That is still the tu form. With Lei: sta bene?',
            'Signora, stai bene?': 'With signora you use Lei: sta bene?',
            'Signora, è bene?': 'For how someone is, Italians use stare: sta bene?',
          },
          why: 'tu stai → Lei sta. ' + WHY_STARE_HOW,
        },

        // Rung 4: build from English
        {
          id: 'u5-l2-e26', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u5-r2',
          prompt: 'Translate: "It\'s cold today!"', base: '(looking out of the window in the morning)', en: "It's cold today!",
          answers: ['Oggi fa freddo!', 'Fa freddo oggi!', 'Che freddo oggi!', 'Oggi che freddo!'],
          mistakes: {
            'Oggi è freddo!': 'For the weather, standard Italian says fa freddo. (È freddo describes a thing: il caffè è freddo.)',
            'È freddo oggi!': 'For the weather, standard Italian says fa freddo. (È freddo describes a thing: il caffè è freddo.)',
            'Oggi fa fredda!': 'In fa freddo, freddo never changes: it means "cold weather".',
          },
          why: WHY_WEATHER,
        },
        {
          id: 'u5-l2-e27', type: 'build', reg: 'lei', rung: 4, ruleId: 'u5-r2',
          prompt: 'Translate: "What do you do for a living?"', base: "(to a friend of Giulia's grandfather, at lunch)", en: 'What do you do for a living?',
          answers: [
            'Che lavoro fa?', 'Lei che lavoro fa?', 'Che lavoro fa Lei?',
            'Cosa fa nella vita?', 'Che cosa fa nella vita?', 'Lei cosa fa nella vita?',
          ],
          mistakes: {
            'Che lavoro fai?': 'To an older stranger, use Lei: che lavoro fa?',
            'Cosa fai nella vita?': 'To an older stranger, use Lei: cosa fa nella vita?',
            'Che lavoro è?': 'Italians ask with fare: che lavoro fa?',
          },
          why: WHY_LAVORO + ' Cosa fa nella vita? is another common way to ask.',
        },
        {
          id: 'u5-l2-e28', type: 'build', reg: 'tu', rung: 4, ruleId: 'u5-r2',
          prompt: 'Translate: "How are you?"', base: '(to Luca, when you meet him at the bar)', en: 'How are you?',
          answers: ['Come stai?', 'Luca, come stai?', 'Ciao Luca, come stai?', 'Ciao, come stai?', 'Come stai, Luca?', 'Come va?', 'Ciao Luca, come va?'],
          mistakes: {
            'Come sta?': 'come sta is the Lei form. Luca is a friend: come stai?',
            'Come sei?': 'Come sei? asks what someone is like. "How are you?" is come stai?',
            'Luca, come sta?': 'come sta is the Lei form. Luca is a friend: come stai?',
          },
          why: WHY_STARE_HOW + ' Come va? ("how\'s it going?") works too.',
        },
        {
          id: 'u5-l2-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u5-r2',
          prompt: 'Translate: "We\'re doing the food shopping."', base: "(Giulia's mother phones to ask where you both are)", en: "We're doing the food shopping.",
          answers: ['Facciamo la spesa.', 'Noi facciamo la spesa.', 'Stiamo facendo la spesa.'],
          mistakes: {
            'Fanno la spesa.': 'fanno is "they do". "We do" is facciamo.',
            'Facciamo spesa.': 'The phrase keeps its article: fare la spesa.',
            'Siamo facendo la spesa.': 'With an -ando/-endo form Italians use stare, not essere: stiamo facendo.',
          },
          why: WHY_FACCIO + ' fare la spesa = do the food shopping.',
        },
        {
          id: 'u5-l2-e30', type: 'build', reg: 'tu', rung: 4, ruleId: 'u5-r2',
          prompt: 'Translate: "Marco! What are you doing here?"', base: "(you bump into Giulia's brother in town)", en: 'Marco! What are you doing here?',
          answers: ['Marco! Cosa fai qui?', 'Marco! Che fai qui?', 'Marco! Che cosa fai qui?', 'Marco, cosa fai qui?', 'Marco, che fai qui?', 'Marco, che cosa fai qui?'],
          mistakes: {
            'Marco! Cosa fa qui?': 'fa is the Lei form. Marco gets tu: fai.',
            'Marco, cosa fa qui?': 'fa is the Lei form. Marco gets tu: fai.',
            'Marco! Cosa fate qui?': 'fate is for two or more people. Just Marco: fai.',
          },
          why: 'Cosa fai? = What are you doing? Like stai, the tu form of fare is fai; fa is Lei.',
        },
        {
          id: 'u5-l2-e31', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u5-r2',
          prompt: 'Translate: "We\'re staying at home tonight."', base: '(Luca asks if you two are coming out)', en: "We're staying at home tonight.",
          answers: [
            'Stasera stiamo a casa.', 'Stiamo a casa stasera.', 'Stasera noi stiamo a casa.', 'Noi stiamo a casa stasera.',
            'Stasera restiamo a casa.', 'Restiamo a casa stasera.', 'Stasera rimaniamo a casa.', 'Rimaniamo a casa stasera.',
          ],
          mistakes: {
            'Stasera stanno a casa.': 'stanno is "they stay". "We stay" is stiamo.',
            'Stasera state a casa.': 'state is "you stay" (plural). "We stay" is stiamo.',
            'Stasera stiamo alla casa.': 'Home is just a casa, with no article.',
          },
          why: WHY_STAY + ' (restare and rimanere also mean "stay".)',
        },

        // Rung 5: listen & type
        {
          id: 'u5-l2-e32', type: 'listen', reg: 'lei', rung: 5, ruleId: 'u5-r2',
          prompt: 'Buongiorno, signora! Come sta?', base: '', en: 'Good morning! How are you?',
          answers: ['Buongiorno, signora! Come sta?', 'Buon giorno, signora! Come sta?'],
          mistakes: {
            'Buongiorno, signora! Come stai?': 'You heard sta: with signora, the Lei form.',
          },
          why: WHY_STARE_HOW,
        },
        {
          id: 'u5-l2-e33', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u5-r2',
          prompt: 'Domenica facciamo una passeggiata in centro.', base: '', en: "On Sunday we're going for a walk in the centre.",
          answers: ['Domenica facciamo una passeggiata in centro.'],
          mistakes: {
            'Domenica fanno una passeggiata in centro.': 'You heard facciamo, "we do". fanno would be "they do".',
            'Domenica facciamo una passegiata in centro.': 'passeggiata has a double g: you hear it held.',
          },
          why: WHY_FACCIO + ' fare una passeggiata = go for a walk.',
        },
        {
          id: 'u5-l2-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u5-r2',
          prompt: 'I nonni stanno bene, grazie.', base: '', en: 'The grandparents are well, thanks.',
          answers: ['I nonni stanno bene, grazie.'],
          mistakes: {
            'I nonni sta bene, grazie.': 'You heard stanno: the grandparents are two people.',
          },
          why: WHY_STARE_HOW,
        },
        {
          id: 'u5-l2-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u5-r2',
          prompt: 'Che tempo fa a Bologna?', base: '', en: "What's the weather like in Bologna?",
          answers: ['Che tempo fa a Bologna?'],
          mistakes: {
            'Che tempo fa in Bologna?': 'You heard a: a city takes a, a Bologna.',
            'Che tempo va a Bologna?': 'You heard fa: the weather takes fare.',
          },
          why: WHY_WEATHER,
        },
      ],
    },

    // ------------------------------------------------------------ dire, uscire, dare, sapere
    {
      id: 'u5-l3',
      title: 'dire, uscire, dare, sapere',
      rules: [
        {
          id: 'u5-r3',
          title: 'dico · esco · do · so',
          sentence: 'Cosa dici? · Stasera esco · Paolo dà una mano · Non so',
          marks: [
            { word: 'dici', kind: 'circle', color: 'pink' },
            { word: 'esco', kind: 'circle', color: 'pink' },
            { word: 'dà', kind: 'underline', color: 'ultra' },
            { word: 'so', kind: 'underline', color: 'ultra' },
          ],
          why: 'Four everyday verbs, each with its own pattern. dire ("say", "tell") works from the stem dic-: dico, dici, dice, diciamo, dicono; only voi is different: dite. uscire ("go out", "leave") changes u to e when the stress falls on the stem: esco, esci, esce, escono; usciamo and uscite keep the u. dare ("give") is short: do, dai, dà, diamo, date, danno. sapere ("know") is so, sai, sa, sappiamo, sapete, sanno. Use sapere for knowing a fact (Sai dov\'è la stazione?) and, with an infinitive straight after it, for knowing how to do something: So nuotare = I can swim.',
          table: {
            head: ['verb', 'dire (say)', 'uscire (go out)', 'dare (give)', 'sapere (know)'],
            rows: [
              ['io', 'dico', 'esco', 'do', 'so'],
              ['tu', 'dici', 'esci', 'dai', 'sai'],
              ['lui / lei / Lei', 'dice', 'esce', 'dà', 'sa'],
              ['noi', 'diciamo', 'usciamo', 'diamo', 'sappiamo'],
              ['voi', 'dite', 'uscite', 'date', 'sapete'],
              ['loro', 'dicono', 'escono', 'danno', 'sanno'],
            ],
            highlight: [2, 3],
          },
          careful: 'dà ("he/she gives") has an accent to tell it apart from da ("from"): Paolo dà una mano, but un regalo da Paolo. do ("I give") has no accent, and neither do sa and sai. sappiamo has a double p; sapete doesn\'t. sapere is not for people or places: to know a person or a place, Italians use another verb, conoscere: Conosci Luca? = Do you know Luca? uscire means going out of a place or going out for the evening: esco di casa = I leave the house; esco con Luca = I\'m going out with Luca.',
          howItaliansSayIt: {
            it: 'Boh, non lo so!',
            en: 'Dunno, no idea!',
            note: 'Italians usually say non lo so ("I don\'t know it"), with lo for "it". Plain non so works too, especially with more words after it: non so dov\'è. Boh is a shrug in one word.',
          },
        },
      ],
      examples: [
        { it: 'Cosa dici, andiamo?', en: 'What do you say, shall we go?', reg: 'tu' },
        { it: 'Giulia dice che fa freddo.', en: "Giulia says it's cold.", reg: 'neutral' },
        { it: 'Scusi, come dice?', en: 'Sorry, what did you say?', reg: 'lei' },
        { it: 'Stasera esco con Luca e Sara.', en: "I'm going out with Luca and Sara tonight.", reg: 'neutral' },
        { it: 'A che ora uscite?', en: 'What time are you (all) going out?', reg: 'neutral' },
        { it: 'Ti do una mano?', en: 'Shall I give you a hand?', reg: 'tu' },
        { it: 'Paolo dà una mano in cucina.', en: 'Paolo gives a hand in the kitchen.', reg: 'neutral' },
        { it: "Scusi, sa dov'è la stazione?", en: 'Excuse me, do you know where the station is?', reg: 'lei' },
        { it: 'Sai nuotare?', en: 'Can you swim?', reg: 'tu' },
        { it: "Non sappiamo l'indirizzo.", en: "We don't know the address.", reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u5-l3-e01', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u5-r3',
          prompt: 'Cosa ___, andiamo?', base: '"What do you say, shall we go?" (to Giulia)', en: 'What do you say, shall we go?',
          answers: ['dici'], options: ['dici', 'dice', 'dite'],
          mistakes: {
            dice: 'dice is "he/she says" or the Lei form. To Giulia: dici.',
            dite: 'dite is "you say" to two or more people. Just Giulia: dici.',
          },
          why: WHY_DIRE,
        },
        {
          id: 'u5-l3-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r3',
          prompt: 'Giulia ___ che fa freddo.', base: '"Giulia says it\'s cold."', en: "Giulia says it's cold.",
          answers: ['dice'], options: ['dice', 'dici', 'dico'],
          mistakes: {
            dici: 'dici is "you say". Talking about Giulia: dice.',
            dico: 'dico is "I say". Talking about Giulia: dice.',
          },
          why: WHY_DIRE,
        },
        {
          id: 'u5-l3-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r3',
          prompt: 'Stasera ___ con Luca e Sara.', base: '"I\'m going out with Luca and Sara tonight."', en: "I'm going out with Luca and Sara tonight.",
          answers: ['esco'], options: ['esco', 'usco', 'esce'],
          mistakes: {
            usco: ESC('esco'),
            esce: 'esce is "he/she goes out". For yourself: esco.',
          },
          why: WHY_USCIRE,
        },
        {
          id: 'u5-l3-e04', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u5-r3',
          prompt: "Scusi, ___ dov'è la stazione?", base: '"Excuse me, do you know where the station is?"', en: 'Excuse me, do you know where the station is?',
          answers: ['sa'], options: ['sa', 'sai', 'so'],
          mistakes: {
            sai: 'sai is the tu form. With scusi you are using Lei: sa.',
            so: 'so is "I know". Asking someone: sa.',
          },
          why: WHY_SAPERE_LEI,
        },
        {
          id: 'u5-l3-e05', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r3',
          prompt: 'Paolo ___ una mano in cucina.', base: '"Paolo gives a hand in the kitchen."', en: 'Paolo gives a hand in the kitchen.',
          answers: ['dà'], options: ['dà', 'da', 'dai'],
          mistakes: {
            da: 'da without an accent means "from". "He gives" is dà.',
            dai: 'dai is "you give". Talking about Paolo: dà.',
          },
          why: WHY_DARE,
        },
        {
          id: 'u5-l3-e06', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u5-r3',
          prompt: '___ nuotare?', base: '"Can you swim?" (to Luca, at the beach)', en: 'Can you swim?',
          answers: ['Sai'], options: ['Sai', 'Conosci', 'Sa'],
          mistakes: {
            Conosci: 'conoscere is for knowing people and places. Knowing how to do something is sapere: sai nuotare?',
            Sa: 'sa is the Lei form. Luca is a friend: sai.',
          },
          why: WHY_SAPERE_HOW,
        },
        {
          id: 'u5-l3-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r3',
          prompt: "Non ___ l'indirizzo.", base: '"We don\'t know the address."', en: "We don't know the address.",
          answers: ['sappiamo'], options: ['sappiamo', 'sapiamo', 'sanno'],
          mistakes: {
            sapiamo: 'sappiamo has a double p.',
            sanno: 'sanno is "they know". "We know" is sappiamo.',
          },
          why: WHY_SAPERE,
        },
        {
          id: 'u5-l3-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r3',
          prompt: 'A che ora ___ i ragazzi?', base: '"What time are the guys going out?"', en: 'What time are the guys going out?',
          answers: ['escono'], options: ['escono', 'uscono', 'esce'],
          mistakes: {
            uscono: ESC('escono'),
            esce: 'esce is for one person. The guys: escono.',
          },
          why: WHY_USCIRE,
        },

        // Rung 2: fill the gap
        {
          id: 'u5-l3-e09', type: 'type', reg: 'lei', rung: 2, ruleId: 'u5-r3',
          prompt: 'Scusi, come ___?', base: '(dire)', en: 'Sorry, what did you say?',
          answers: ['dice'],
          mistakes: {
            dici: 'dici is the tu form. With scusi you are using Lei: dice.',
            dite: 'dite is for two or more people. One person with Lei: dice.',
            dire: 'Use the Lei form of dire: come dice?',
          },
          why: 'Scusi, come dice? is the polite "Sorry?" when you didn\'t catch something. ' + WHY_DIRE,
        },
        {
          id: 'u5-l3-e10', type: 'type', reg: 'tu', rung: 2, ruleId: 'u5-r3',
          prompt: 'Luca, ___ stasera?', base: '(uscire)', en: 'Luca, are you going out tonight?',
          answers: ['esci'],
          mistakes: {
            usci: ESC('esci'),
            esce: 'esce is the Lei form. Luca is a friend: esci.',
            esco: 'esco is "I go out". Asking Luca: esci.',
          },
          why: WHY_USCIRE,
        },
        {
          id: 'u5-l3-e11', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r3',
          prompt: 'Noi ___ sempre la verità.', base: '(dire)', en: 'We always tell the truth.',
          answers: ['diciamo'],
          mistakes: {
            dicamo: IAMO('diciamo'),
            dichiamo: 'No h: the c of dic- is soft before i: diciamo.',
            dicono: 'dicono is "they say". "We say" is diciamo.',
            diamo: 'diamo is "we give" (dare). "We tell" is diciamo.',
          },
          why: WHY_DIRE,
        },
        {
          id: 'u5-l3-e12', type: 'type', reg: 'tu', rung: 2, ruleId: 'u5-r3',
          prompt: 'Ti ___ una mano?', base: '(dare: io)', en: 'Shall I give you a hand?',
          answers: ['do'],
          mistakes: {
            dai: 'dai is "you give". "I give" is do.',
            'dà': 'dà is "he/she gives". "I give" is do, with no accent.',
          },
          why: WHY_DARE + ' Ti do una mano? = Shall I give you a hand? (ti = "you", "to you".)',
        },
        {
          id: 'u5-l3-e13', type: 'type', reg: 'lei', rung: 2, ruleId: 'u5-r3',
          prompt: 'Signora, ___ fare le tagliatelle?', base: '(sapere)', en: 'Do you know how to make tagliatelle?',
          answers: ['sa'],
          mistakes: {
            sai: 'sai is the tu form. With signora: sa.',
            so: 'so is "I know". Asking her: sa.',
          },
          why: WHY_SAPERE_HOW + ' ' + WHY_SAPERE_LEI,
        },
        {
          id: 'u5-l3-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r3',
          prompt: 'Marco e Sara ___ sempre insieme.', base: '(uscire)', en: 'Marco and Sara always go out together.',
          answers: ['escono'],
          mistakes: {
            uscono: ESC('escono'),
            escano: ONO('uscire', 'escono'),
            esce: 'esce is for one person. Marco and Sara: escono.',
          },
          why: WHY_USCIRE,
        },
        {
          id: 'u5-l3-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r3',
          prompt: 'I ragazzi ___ una mano a Sara con il trasloco.', base: '(dare)', en: 'The guys are giving Sara a hand with the move.',
          answers: ['danno'],
          mistakes: {
            dano: DOUBLE_N('danno'),
            'dà': 'dà is for one person. The guys: danno.',
            dando: 'dare is short: "they give" is danno.',
          },
          why: WHY_DARE + ' dare una mano = give a hand.',
        },
        {
          id: 'u5-l3-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r3',
          prompt: 'Ragazzi, cosa ___?', base: '(dire)', en: 'Guys, what do you say?',
          answers: ['dite'],
          mistakes: {
            dicete: 'voi is the one irregular form of dire: dite.',
            dicite: 'voi is the one irregular form of dire: dite.',
            dicono: 'dicono is "they say". Asking the group: dite.',
          },
          why: WHY_DIRE,
        },

        // Rung 3: transform
        {
          id: 'u5-l3-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r3',
          prompt: 'Esco stasera.', base: 'Now say "we" (noi).', en: "We're going out tonight.",
          answers: ['Usciamo stasera.', 'Stasera usciamo.', 'Noi usciamo stasera.', 'Stasera noi usciamo.'],
          mistakes: {
            'Escono stasera.': 'escono is "they go out". "We go out" is usciamo.',
            'Uscite stasera.': 'uscite is "you go out" (plural). "We go out" is usciamo.',
          },
          why: WHY_USCIRE,
        },
        {
          id: 'u5-l3-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r3',
          prompt: 'Dico sempre di sì.', base: 'Now say it about Giulia: start with Giulia.', en: 'Giulia always says yes.',
          answers: ['Giulia dice sempre di sì.', 'Giulia dice sempre sì.'],
          mistakes: {
            'Giulia dici sempre di sì.': 'dici is "you say". Talking about Giulia: dice.',
            'Giulia dico sempre di sì.': 'dico is "I say". Talking about Giulia: dice.',
          },
          why: WHY_DIRE + ' dire di sì / di no = say yes / no.',
        },
        {
          id: 'u5-l3-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r3',
          prompt: "Sai dov'è il bar?", base: 'Now ask Luca and Sara together (voi).', en: 'Do you (both) know where the bar is?',
          answers: ["Sapete dov'è il bar?", "Voi sapete dov'è il bar?"],
          mistakes: {
            "Sanno dov'è il bar?": 'sanno is "they know". Speaking to them: sapete.',
            "Sappiamo dov'è il bar?": 'sappiamo is "we know". Speaking to them: sapete.',
            "Sai dov'è il bar?": 'sai is for one person. Two people: sapete.',
          },
          why: WHY_SAPERE,
        },
        {
          id: 'u5-l3-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r3',
          prompt: 'Do il numero a Luca.', base: 'Now say "we" (noi).', en: "We're giving Luca the number.",
          answers: ['Diamo il numero a Luca.', 'Noi diamo il numero a Luca.'],
          mistakes: {
            'Danno il numero a Luca.': 'danno is "they give". "We give" is diamo.',
            'Date il numero a Luca.': 'date is "you give" (plural). "We give" is diamo.',
          },
          why: WHY_DARE,
        },
        {
          id: 'u5-l3-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r3',
          prompt: 'Esci stasera?', base: 'Now ask Giulia and Marco together (voi).', en: 'Are you (both) going out tonight?',
          answers: ['Uscite stasera?', 'Voi uscite stasera?', 'Stasera uscite?'],
          mistakes: {
            'Escono stasera?': 'escono is "they go out". Speaking to them: uscite.',
            'Esci stasera?': 'esci is for one person. Two people: uscite.',
          },
          why: WHY_USCIRE,
        },

        // Rung 3: switch register
        {
          id: 'u5-l3-e22', type: 'register', reg: 'lei', rung: 3, ruleId: 'u5-r3',
          prompt: "Sai dov'è la stazione?", base: 'You asked Luca. Now ask a woman in the street (formal).', en: 'Do you know where the station is?',
          answers: [
            "Sa dov'è la stazione?", "Scusi, sa dov'è la stazione?", "Mi scusi, sa dov'è la stazione?",
            "Lei sa dov'è la stazione?", "Scusi, Lei sa dov'è la stazione?", "Signora, sa dov'è la stazione?",
          ],
          mistakes: {
            "Sai dov'è la stazione?": 'That is still the tu form. With Lei: sa.',
            "Scusi, sai dov'è la stazione?": 'scusi is right, but sai is tu. With Lei: sa.',
            "Scusa, sa dov'è la stazione?": 'sa is right, but scusa is for tu. With Lei: scusi.',
            "Lei sai dov'è la stazione?": 'Lei takes the "she" form: Lei sa.',
          },
          why: 'tu sai → Lei sa. ' + WHY_SAPERE_LEI,
        },
        {
          id: 'u5-l3-e23', type: 'register', reg: 'tu', rung: 3, ruleId: 'u5-r3',
          prompt: 'Scusi, come dice?', base: "You didn't catch what an older lady said. Now you didn't catch Giulia (informal).", en: 'Sorry, what did you say?',
          answers: ['Scusa, come dici?', 'Come dici?', 'Scusa, cosa dici?', 'Cosa dici?', 'Scusa, che dici?', 'Che dici?'],
          mistakes: {
            'Scusa, come dice?': 'scusa is right, but dice is Lei. With tu: dici.',
            'Scusi, come dici?': 'dici is right, but scusi is for Lei. With tu: scusa.',
            'Come dice?': 'That is still the Lei form. With tu: come dici?',
          },
          why: 'Lei dice → tu dici, and scusi → scusa.',
        },
        {
          id: 'u5-l3-e24', type: 'register', reg: 'lei', rung: 3, ruleId: 'u5-r3',
          prompt: 'Esci adesso?', base: 'You asked Sara. Now ask signor Bianchi, who has his coat on (formal).', en: 'Are you going out now?',
          answers: ['Esce adesso?', 'Lei esce adesso?', 'Signor Bianchi, esce adesso?', 'Esce adesso, signor Bianchi?'],
          mistakes: {
            'Esci adesso?': 'That is still the tu form. With Lei: esce.',
            'Signor Bianchi, esci adesso?': 'With signor Bianchi you use Lei: esce.',
            'Usce adesso?': ESC('esce'),
          },
          why: 'tu esci → Lei esce. ' + WHY_USCIRE,
        },
        {
          id: 'u5-l3-e25', type: 'register', reg: 'lei', rung: 3, ruleId: 'u5-r3',
          prompt: 'Mi dai una mano?', base: 'You asked Marco. Now ask a man at the station to help with your suitcase (formal).', en: 'Could you give me a hand?',
          answers: ['Mi dà una mano?', 'Scusi, mi dà una mano?', 'Mi scusi, mi dà una mano?', 'Signore, mi dà una mano?', 'Scusi, mi dà una mano, per favore?'],
          mistakes: {
            'Mi dai una mano?': 'That is still the tu form. With Lei: dà.',
            'Scusi, mi dai una mano?': 'scusi is right, but dai is tu. With Lei: dà.',
            "Scusi, mi da' una mano?": 'dà takes a written accent, not an apostrophe.',
            "Mi da' una mano?": 'dà takes a written accent, not an apostrophe.',
          },
          why: 'tu dai → Lei dà. ' + WHY_DARE_LEI + ' mi = "me", "to me".',
        },

        // Rung 4: build from English
        {
          id: 'u5-l3-e26', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u5-r3',
          prompt: 'Translate: "I\'m going out with Luca tonight."', base: '(texting Giulia)', en: "I'm going out with Luca tonight.",
          answers: ['Stasera esco con Luca.', 'Esco con Luca stasera.', 'Stasera io esco con Luca.', 'Io esco con Luca stasera.'],
          mistakes: {
            'Stasera usco con Luca.': ESC('esco'),
            'Usco con Luca stasera.': ESC('esco'),
            'Stasera esce con Luca.': 'esce is "he/she goes out". For yourself: esco.',
          },
          why: WHY_USCIRE + ' The present covers plans: stasera esco = I\'m going out tonight.',
        },
        {
          id: 'u5-l3-e27', type: 'build', reg: 'lei', rung: 4, ruleId: 'u5-r3',
          prompt: 'Translate: "Excuse me, do you know what time it is?"', base: '(to an older man at the bus stop)', en: 'Excuse me, do you know what time it is?',
          answers: [
            'Scusi, sa che ore sono?', 'Mi scusi, sa che ore sono?', 'Scusi, sa che ora è?', 'Mi scusi, sa che ora è?',
            'Scusi, Lei sa che ore sono?',
          ],
          mistakes: {
            'Scusi, sai che ore sono?': 'sai is tu. To an older stranger: sa.',
            'Scusa, sa che ore sono?': 'scusa is for tu. To a stranger: scusi.',
            'Scusi, conosce che ore sono?': 'conoscere is for people and places. For a fact, use sapere: sa che ore sono?',
          },
          why: WHY_SAPERE_LEI + ' Che ore sono? = What time is it?',
        },
        {
          id: 'u5-l3-e28', type: 'build', reg: 'tu', rung: 4, ruleId: 'u5-r3',
          prompt: 'Translate: "Can you swim?"', base: '(asking Luca whether he ever learned)', en: 'Can you swim?',
          answers: ['Sai nuotare?', 'Luca, sai nuotare?', 'Sai nuotare, Luca?', 'Tu sai nuotare?'],
          mistakes: {
            'Conosci nuotare?': 'conoscere is for people and places. For a skill, use sapere: sai nuotare?',
            'Sai a nuotare?': 'sapere takes the infinitive straight after it: sai nuotare?',
            'Sa nuotare?': 'sa is the Lei form. Luca is a friend: sai.',
            'Sei nuotare?': 'sei is "you are". "You know how to" is sai.',
          },
          why: WHY_SAPERE_HOW,
        },
        {
          id: 'u5-l3-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u5-r3',
          prompt: 'Translate: "We don\'t know."', base: "(Giulia's mother asks you both what time the film starts)", en: "We don't know.",
          answers: ['Non lo sappiamo.', 'Non sappiamo.', 'Noi non lo sappiamo.', 'Boh, non lo sappiamo.', 'Boh, non sappiamo.'],
          mistakes: {
            'Non lo sanno.': 'sanno is "they know". "We know" is sappiamo.',
            'Non conosciamo.': 'conoscere is for people and places. For a fact, use sapere: non lo sappiamo.',
            'No sappiamo.': 'Before a verb, "not" is non: non sappiamo.',
          },
          why: WHY_SAPERE + ' Italians usually add lo ("it"): non lo sappiamo.',
        },
        {
          id: 'u5-l3-e30', type: 'build', reg: 'lei', rung: 4, ruleId: 'u5-r3',
          prompt: 'Translate: "Could you give me the receipt, please?"', base: '(to the cashier at a bar)', en: 'Could you give me the receipt, please?',
          answers: [
            'Mi dà lo scontrino, per favore?', 'Scusi, mi dà lo scontrino?', 'Mi dà lo scontrino?',
            'Scusi, mi dà lo scontrino, per favore?', 'Per favore, mi dà lo scontrino?',
          ],
          mistakes: {
            'Mi dai lo scontrino, per favore?': 'dai is tu. To the cashier, use Lei: dà.',
            "Mi da' lo scontrino, per favore?": 'dà takes a written accent, not an apostrophe.',
            'Mi dà il scontrino, per favore?': 'scontrino starts with s + consonant, so it takes lo: lo scontrino.',
          },
          why: WHY_DARE_LEI + ' Mi dà…? (literally "do you give me…?") is the everyday polite way to ask for something.',
        },
        {
          id: 'u5-l3-e31', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u5-r3',
          prompt: 'Translate: "Giulia says it\'s late."', base: '(to Luca, at the end of the evening)', en: "Giulia says it's late.",
          answers: ['Giulia dice che è tardi.', 'Giulia dice che si è fatto tardi.'],
          mistakes: {
            'Giulia dici che è tardi.': 'dici is "you say". Talking about Giulia: dice.',
            'Giulia dice è tardi.': 'After dire, Italian needs che ("that"): dice che è tardi.',
            'Giulia dice che è tarda.': 'tardi ("late") never changes: è tardi.',
          },
          why: WHY_DIRE + ' Unlike English, Italian never drops che ("that") after dire.',
        },

        // Rung 5: listen & type
        {
          id: 'u5-l3-e32', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u5-r3',
          prompt: 'Marco dà una mano in cucina.', base: '', en: 'Marco gives a hand in the kitchen.',
          answers: ['Marco dà una mano in cucina.'],
          mistakes: {
            'Marco dai una mano in cucina.': 'You heard dà, "he gives". dai is "you give".',
          },
          why: WHY_DARE,
        },
        {
          id: 'u5-l3-e33', type: 'listen', reg: 'lei', rung: 5, ruleId: 'u5-r3',
          prompt: "Scusi, sa dov'è la fermata?", base: '', en: 'Excuse me, do you know where the stop is?',
          answers: ["Scusi, sa dov'è la fermata?"],
          mistakes: {
            "Scusi, sai dov'è la fermata?": 'You heard sa: with scusi, the Lei form.',
            "Scusi, sa dove la fermata?": "You heard dov'è, \"where is\": dove + è.",
          },
          why: WHY_SAPERE_LEI,
        },
        {
          id: 'u5-l3-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u5-r3',
          prompt: 'Usciamo alle otto, va bene?', base: '', en: "We're going out at eight, OK?",
          answers: ['Usciamo alle otto, va bene?'],
          mistakes: {
            'Uscite alle otto, va bene?': 'You heard usciamo, "we go out". uscite would be "you go out".',
          },
          why: WHY_USCIRE,
        },
        {
          id: 'u5-l3-e35', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u5-r3',
          prompt: 'Non so, tu cosa dici?', base: '', en: "I don't know, what do you say?",
          answers: ['Non so, tu cosa dici?'],
          mistakes: {
            'Non so, tu cosa dice?': 'You heard dici: with tu the form is dici.',
          },
          why: WHY_DIRE + ' ' + WHY_SAPERE,
        },
      ],
    },
  ],
  scene: {
    title: 'Making plans for the evening',
    setting: 'Friday afternoon at a bar in Bologna. You and Giulia are having a coffee with her friends Luca and Sara, and everyone is deciding what to do tonight.',
    lines: [
      { speaker: 'Giulia', it: 'Allora, cosa facciamo stasera?', en: 'So, what are we doing tonight?', reg: 'neutral' },
      { speaker: 'Luca', it: 'Andiamo a mangiare una pizza? E dopo andiamo a ballare!', en: "Shall we go for a pizza? And then we'll go dancing!", reg: 'neutral' },
      { speaker: 'Sara', it: 'Io vengo per la pizza, ma poi sto a casa: domani lavoro.', en: "I'm coming for the pizza, but then I'm staying at home: I'm working tomorrow.", reg: 'neutral' },
      { speaker: 'Giulia', it: 'E tu, amore, che dici? Vieni anche tu a ballare?', en: 'And you, love, what do you say? Are you coming dancing too?', reg: 'tu' },
      { speaker: 'You', it: 'Sì, vengo volentieri! Ma tu sai ballare, Luca?', en: "Yes, I'd love to! But can you dance, Luca?", reg: 'tu' },
      { speaker: 'Giulia', it: 'Lui? Non sa ballare per niente!', en: "Him? He can't dance at all!", reg: 'neutral' },
      { speaker: 'Luca', it: 'Non è vero! Io ballo benissimo.', en: "That's not true! I'm a brilliant dancer.", reg: 'neutral' },
      { speaker: 'Sara', it: 'Allora, a che ora usciamo? Alle otto?', en: 'So, what time are we going out? Eight?', reg: 'neutral' },
      { speaker: 'Giulia', it: 'Alle otto e mezza. Prima andiamo a casa e faccio la doccia.', en: 'Half past eight. First we go home and I have a shower.', reg: 'neutral' },
      { speaker: 'Luca', it: 'Va bene. E dove andiamo a mangiare?', en: 'OK. And where are we going to eat?', reg: 'neutral' },
      { speaker: 'Sara', it: "Marco dice che c'è una pizzeria buonissima in via Zamboni.", en: "Marco says there's a really good pizzeria on Via Zamboni.", reg: 'neutral' },
      { speaker: 'Giulia', it: 'Perfetto! Sara, ti do un passaggio?', en: 'Perfect! Sara, shall I give you a lift?', reg: 'tu' },
      { speaker: 'Sara', it: 'Sì, grazie! A dopo, ragazzi!', en: 'Yes, thanks! See you later, guys!', reg: 'neutral' },
    ],
    exercises: [
      {
        id: 'u5-s-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u5-r2',
        prompt: 'Allora, cosa ___ stasera?', base: '"So, what are we doing tonight?"', en: 'So, what are we doing tonight?',
        answers: ['facciamo'], options: ['facciamo', 'fate', 'fanno'],
        mistakes: {
          fate: 'fate is "you do" (plural). Giulia means "we": facciamo.',
          fanno: 'fanno is "they do". Giulia means "we": facciamo.',
        },
        why: WHY_FACCIO,
      },
      {
        id: 'u5-s-e02', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u5-r1',
        prompt: 'E tu, amore, che dici? ___ anche tu a ballare?', base: '"Are you coming dancing too?" (Giulia to you)', en: 'And you, love, what do you say? Are you coming dancing too?',
        answers: ['Vieni'], options: ['Vieni', 'Viene', 'Vengo'],
        mistakes: {
          Viene: 'viene is the Lei form (or "he/she comes"). Giulia uses tu: vieni.',
          Vengo: 'vengo is "I come". Giulia is asking you: vieni.',
        },
        why: WHY_VENGO + ' ' + WHY_VENIRE,
      },
      {
        id: 'u5-s-e03', type: 'type', reg: 'tu', rung: 2, ruleId: 'u5-r3',
        prompt: 'Ma tu ___ ballare, Luca?', base: '(sapere)', en: 'But can you dance, Luca?',
        answers: ['sai'],
        mistakes: {
          sa: 'sa is the Lei form. Luca is a friend: sai.',
          so: 'so is "I know". Asking Luca: sai.',
          sei: 'sei is "you are". "You know how to" is sai.',
          conosci: 'conoscere is for people and places. For a skill, use sapere: sai ballare?',
        },
        why: WHY_SAPERE_HOW,
      },
      {
        id: 'u5-s-e04', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u5-r3',
        prompt: 'Allora, a che ora ___? Alle otto?', base: '(uscire: noi)', en: 'So, what time are we going out? Eight?',
        answers: ['usciamo'],
        mistakes: {
          esciamo: U_BACK('usciamo'),
          escono: 'escono is "they go out". "We go out" is usciamo.',
          uscite: 'uscite is "you go out" (plural). "We go out" is usciamo.',
        },
        why: WHY_USCIRE,
      },
      {
        id: 'u5-s-e05', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u5-r2',
        prompt: 'Poi sto a casa.', base: 'Now say "we" (noi).', en: "Then we're staying at home.",
        answers: ['Poi stiamo a casa.', 'Poi noi stiamo a casa.'],
        mistakes: {
          'Poi stanno a casa.': 'stanno is "they stay". "We stay" is stiamo.',
          'Poi state a casa.': 'state is "you stay" (plural). "We stay" is stiamo.',
        },
        why: WHY_STAY + ' ' + WHY_STO,
      },
      {
        id: 'u5-s-e06', type: 'register', reg: 'lei', rung: 3, ruleId: 'u5-r1',
        prompt: 'Vieni anche tu?', base: 'Giulia asked you. Now ask signor Bianchi, the neighbour, who is at the bar too (formal).', en: 'Are you coming too?',
        answers: ['Viene anche Lei?', 'Signor Bianchi, viene anche Lei?', 'Viene anche Lei, signor Bianchi?', 'Anche Lei viene?'],
        mistakes: {
          'Vieni anche Lei?': 'Lei is right, but vieni is tu. With Lei: viene.',
          'Viene anche tu?': 'viene is right, but tu is informal. With Lei: viene anche Lei?',
          'Vieni anche tu?': 'That is still all tu. To signor Bianchi: Viene anche Lei?',
          'Signor Bianchi, vieni anche Lei?': 'With signor Bianchi you use Lei: viene.',
        },
        why: 'tu vieni → Lei viene, and anche tu → anche Lei.',
      },
      {
        id: 'u5-s-e07', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u5-r2',
        prompt: 'Translate: "What are we doing tonight?"', base: '(texting Luca and Sara)', en: 'What are we doing tonight?',
        answers: [
          'Cosa facciamo stasera?', 'Che facciamo stasera?', 'Che cosa facciamo stasera?',
          'Stasera cosa facciamo?', 'Stasera che facciamo?', 'Stasera che cosa facciamo?',
        ],
        mistakes: {
          'Cosa fate stasera?': 'fate is "you do" (plural). "We do" is facciamo.',
          'Cosa fanno stasera?': 'fanno is "they do". "We do" is facciamo.',
        },
        why: WHY_FACCIO + ' The present covers plans: cosa facciamo stasera? = what are we doing tonight?',
      },
      {
        id: 'u5-s-e08', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u5-r1',
        prompt: 'Translate: "Shall we go for a pizza?"', base: '(to Luca and Sara)', en: 'Shall we go for a pizza?',
        answers: ['Andiamo a mangiare una pizza?', 'Andiamo a mangiare la pizza?', 'Andiamo a prendere una pizza?'],
        mistakes: {
          'Andiamo mangiare una pizza?': 'After andare, add a before the infinitive: andiamo a mangiare.',
          'Andiamo per mangiare una pizza?': 'After andare, Italians use a, not per: andiamo a mangiare.',
          'Andate a mangiare una pizza?': 'andate is "you go" (plural). "Shall we go" is andiamo.',
        },
        why: WHY_ANDARE_A,
      },
      {
        id: 'u5-s-e09', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u5-r3',
        prompt: "Marco dice che c'è una pizzeria buonissima in via Zamboni.", base: '', en: "Marco says there's a really good pizzeria on Via Zamboni.",
        answers: ["Marco dice che c'è una pizzeria buonissima in via Zamboni."],
        mistakes: {
          "Marco dici che c'è una pizzeria buonissima in via Zamboni.": 'You heard dice: "Marco says".',
          "Marco dice che c'è una pizzeria buonissima a via Zamboni.": 'You heard in: streets take in, in via Zamboni.',
        },
        why: WHY_DIRE,
      },
      {
        id: 'u5-s-e10', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u5-r3',
        prompt: 'Sara, ti do un passaggio?', base: '', en: 'Sara, shall I give you a lift?',
        answers: ['Sara, ti do un passaggio?'],
        mistakes: {
          'Sara, ti dà un passaggio?': 'You heard do, "I give": Giulia is offering. dà would be "he/she gives".',
          'Sara, ti do un passagio?': 'passaggio has a double g: you hear it held.',
        },
        why: WHY_DARE + ' dare un passaggio = give someone a lift.',
      },
    ],
  },
};

/** Adds the SLIPS keys to every typed exercise whose answers contain the right word. */
function withSlipKeys(u) {
  const exercises = [...u.lessons.flatMap((l) => l.exercises), ...u.scene.exercises];
  for (const ex of exercises) {
    if (ex.type === 'recognise') continue; // options only: nothing can be typed
    const accepted = new Set(ex.answers.map((a) => a.toLowerCase()));
    for (const answer of ex.answers) {
      for (const [right, wrongs] of Object.entries(SLIPS)) {
        const re = new RegExp(`(^|[^\\p{L}])(${right})(?=$|[^\\p{L}])`, 'iu');
        if (!re.test(answer)) continue;
        for (const [wrong, message] of Object.entries(wrongs)) {
          const key = answer.replace(re, (_, pre, word) => pre + (word[0] === word[0].toUpperCase() ? wrong[0].toUpperCase() + wrong.slice(1) : wrong));
          if (!accepted.has(key.toLowerCase()) && !(key in ex.mistakes)) ex.mistakes[key] = message;
        }
      }
    }
  }
  return u;
}

export default withSlipKeys(unit);
