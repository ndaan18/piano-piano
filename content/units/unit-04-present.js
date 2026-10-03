// Unit 4: Present tense. Data only (schema: spec §9).
// Exercise field use by type:
//   recognise  prompt with ___ gap, options (2–4, include the answer)
//   type       prompt with ___ gap, answers = the missing word(s)
//   transform  prompt = sentence to rewrite, base = the instruction
//   register   prompt = sentence said to one person, base = who to say it to now; reg = target register
//   build      prompt = 'Translate: "…"', base = context line
//   listen     prompt = the Italian sentence to speak, answers = that sentence
// Four lessons, one rule each: -are · -ere · -ire (with -isc-) · spelling verbs and dropping io.
// Cast as in Unit 3: partner Giulia, her parents Anna and Paolo (on tu terms since Unit 3's
// dinner), her brother Marco, the grandparents, friends Luca and Sara, neighbour signor Bianchi.
// Lei goes to strangers, staff and Giulia's grandparents. Voi lines are tagged neutral.
// fare, andare and other irregular verbs wait for Unit 5.
// Person slips on a word's last letter (parlo/parla, prendi/prende) never pass as a typo.
// Mid-word slips would, so they get keys: -ano/-ono, -ate/-ete/-ite, a missing i in -iamo,
// cerci/pagi (no h), mangii/studii (double i), capiscio/finiscie/capischi (extra i or h),
// leggio/lego, and -isc- in the wrong person (capiscete, pulisciamo).

// Shared key messages for the mid-word slips listed above.
const IAMO = (right) => `The noi ending is -iamo, with an i: ${right}.`;
const ARE_ANO = (inf, right) => `${inf} is an -are verb, so "they" ends in -ano: ${right}.`;
const ERE_ONO = (inf, right) => `${inf} is an -${inf.slice(-3)} verb, so "they" ends in -ono: ${right}.`;
const ARE_ATE = (inf, right) => `${inf} is an -are verb, so voi ends in -ate: ${right}.`;
const ERE_ETE = (inf, right) => `${inf} is an -ere verb, so voi ends in -ete: ${right}.`;
const IRE_ITE = (inf, right) => `${inf} is an -ire verb, so voi ends in -ite: ${right}.`;
const NO_ISC = (inf, right) => `${inf} has no -isc-: ${right}.`;
const ISC_NOI_VOI = (right) => `noi and voi never take -isc-: ${right}.`;
const SC_NO_I = (right) => `sc before o is already "sk", and before e already "sh": no extra i in ${right}.`;
const SC_NO_H = (right) => `No h here: sc already sounds "sk" before o and "sh" before i or e: ${right}.`;
const CH = (right) => `cercare keeps its hard c, so before i it adds an h: ${right}.`;
const GH = (right) => `pagare keeps its hard g, so before i it adds an h: ${right}.`;
const H_ONLY_I = (right) => `The h is only needed before i or e: ${right}.`;
const ONE_I = (right) => `The stem already ends in i, and it isn't doubled: ${right}.`;
const GG_HARD = (right) => `Before o, gg is hard without any i: ${right}.`;
const GG_SOFT = (right) => `Before i and e, gg is already soft: ${right}, no extra i.`;
const GG_DOUBLE = (right) => `leggere has a double g all through: ${right}.`;
const GG_NO_H = (right) => `No h: in leggere the spelling never changes, only the sound: ${right}.`;
const AMO_ANO = (right) => `"They" ends in -ano, with an n: ${right}. (-iamo is for noi.)`;
const KEEP_I = (right) => `Keep the i of the stem: it is what makes the c or g soft. ${right}.`;
const SOFT_NO_H = (right) => `No h: here the c or g is soft, and an h would make it hard: ${right}.`;
const ISC_NEEDED = (inf, right) => `${inf} takes -isc- here: ${right}.`;
const THEY_NOT_WE = (wrong, right, en) => `${wrong} is "they ${en}". "We ${en}" is ${right}.`;

// Mid-word slips that the checker would otherwise pass as a small typo. withSlipKeys (end of
// file) adds each one as a key to every typed answer containing the right word, in every
// word order the exercise accepts. Explicit keys in an exercise take precedence.
const SLIPS = {
  // voi: -ate (-are), -ete (-ere), -ite (-ire)
  guardate: { guardete: ARE_ATE('guardare', 'guardate'), guardite: ARE_ATE('guardare', 'guardate') },
  ascoltate: { ascoltete: ARE_ATE('ascoltare', 'ascoltate'), ascoltite: ARE_ATE('ascoltare', 'ascoltate') },
  cercate: { cercete: ARE_ATE('cercare', 'cercate'), cercite: ARE_ATE('cercare', 'cercate'), cerchate: H_ONLY_I('cercate') },
  prendete: { prendate: ERE_ETE('prendere', 'prendete'), prendite: ERE_ETE('prendere', 'prendete') },
  vedete: { vedate: ERE_ETE('vedere', 'vedete'), vedite: ERE_ETE('vedere', 'vedete') },
  dormite: { dormete: IRE_ITE('dormire', 'dormite'), dormate: IRE_ITE('dormire', 'dormite') },
  partite: { partete: IRE_ITE('partire', 'partite'), partate: IRE_ITE('partire', 'partite') },
  preferite: { preferete: IRE_ITE('preferire', 'preferite'), preferate: IRE_ITE('preferire', 'preferite'), preferiscete: ISC_NOI_VOI('preferite') },
  capite: { capete: IRE_ITE('capire', 'capite'), capate: IRE_ITE('capire', 'capite'), capiscete: ISC_NOI_VOI('capite') },
  // loro: -ano (-are), -ono (-ere, -ire)
  abitano: { abitono: ARE_ANO('abitare', 'abitano'), abitamo: AMO_ANO('abitano') },
  lavorano: { lavorono: ARE_ANO('lavorare', 'lavorano'), lavoramo: AMO_ANO('lavorano') },
  comprano: { comprono: ARE_ANO('comprare', 'comprano'), compramo: AMO_ANO('comprano') },
  chiudono: { chiudano: ERE_ONO('chiudere', 'chiudono') },
  leggono: { leggano: ERE_ONO('leggere', 'leggono'), leggiono: GG_HARD('leggono'), legono: GG_DOUBLE('leggono'), legghono: GG_NO_H('leggono') },
  vivono: { vivano: ERE_ONO('vivere', 'vivono') },
  dormono: { dormano: ERE_ONO('dormire', 'dormono') },
  capiscono: { capiscano: ERE_ONO('capire', 'capiscono'), capisciono: SC_NO_I('capiscono'), capischono: SC_NO_H('capiscono') },
  finiscono: { finiscano: ERE_ONO('finire', 'finiscono'), finisciono: SC_NO_I('finiscono'), finischono: SC_NO_H('finiscono') },
  // noi: -iamo
  parliamo: { parlamo: IAMO('parliamo') },
  compriamo: { compramo: IAMO('compriamo') },
  guardiamo: { guardamo: IAMO('guardiamo') },
  ceniamo: { cenamo: IAMO('ceniamo') },
  laviamo: { lavamo: IAMO('laviamo') },
  portiamo: { portamo: IAMO('portiamo') },
  prendiamo: { prendamo: IAMO('prendiamo') },
  vediamo: { vedamo: IAMO('vediamo') },
  crediamo: { credamo: IAMO('crediamo') },
  scriviamo: { scrivamo: IAMO('scriviamo') },
  partiamo: { partamo: IAMO('partiamo') },
  capiamo: { capamo: IAMO('capiamo'), capisciamo: ISC_NOI_VOI('capiamo') },
  puliamo: { pulamo: IAMO('puliamo'), pulisciamo: ISC_NOI_VOI('puliamo') },
  cerchiamo: { cerciamo: CH('cerchiamo'), cerchamo: IAMO('cerchiamo') },
  paghiamo: { pagiamo: GH('paghiamo'), paghamo: IAMO('paghiamo') },
  mangiamo: { mangiano: THEY_NOT_WE('mangiano', 'mangiamo', 'eat'), mangiiamo: ONE_I('mangiamo'), mangamo: KEEP_I('mangiamo'), manghiamo: SOFT_NO_H('mangiamo') },
  cominciamo: { cominciano: THEY_NOT_WE('cominciano', 'cominciamo', 'start'), cominciiamo: ONE_I('cominciamo'), comincamo: KEEP_I('cominciamo'), cominchiamo: SOFT_NO_H('cominciamo') },
  iniziamo: { iniziano: THEY_NOT_WE('iniziano', 'iniziamo', 'start'), iniziiamo: ONE_I('iniziamo'), inizamo: IAMO('iniziamo') },
  // -isc-: no extra i or h
  capisco: { capiscio: SC_NO_I('capisco'), capischo: SC_NO_H('capisco') },
  capisce: { capiscie: SC_NO_I('capisce'), capische: SC_NO_H('capisce'), cape: ISC_NEEDED('capire', 'capisce') },
  finisce: { finiscie: SC_NO_I('finisce'), finische: SC_NO_H('finisce') },
  preferisce: { preferiscie: SC_NO_I('preferisce'), preferische: SC_NO_H('preferisce'), prefere: ISC_NEEDED('preferire', 'preferisce') },
  preferisci: { preferischi: SC_NO_H('preferisci'), preferi: ISC_NEEDED('preferire', 'preferisci') },
  pulisce: { puliscie: SC_NO_I('pulisce'), pulische: SC_NO_H('pulisce'), pulise: 'Keep the c of -isc-: pulisce.' },
  pulisci: { pulischi: SC_NO_H('pulisci') },
  // c/g + h, and the i of -ciare/-giare/-iare
  cerchi: { cerci: CH('cerchi') },
  cerca: { cercha: H_ONLY_I('cerca') },
  cerco: { cercho: H_ONLY_I('cerco') },
  paghi: { pagi: GH('paghi') },
  paga: { pagha: H_ONLY_I('paga') },
  pago: { pagho: H_ONLY_I('pago') },
  mangi: { mangii: ONE_I('mangi'), manghi: SOFT_NO_H('mangi') },
  mangia: { manga: KEEP_I('mangia'), manghia: SOFT_NO_H('mangia') },
  studi: { studii: ONE_I('studi') },
  studia: { studa: 'Keep the i of the stem: studi- + a = studia.' },
  legge: { leggie: GG_SOFT('legge'), lege: GG_DOUBLE('legge'), legghe: GG_NO_H('legge') },
  leggi: { legi: GG_DOUBLE('leggi'), legghi: GG_NO_H('leggi') },
  leggo: { leggio: GG_HARD('leggo'), lego: GG_DOUBLE('leggo'), leggho: GG_NO_H('leggo') },
  // words one letter from another word
  sente: { sete: 'sete means "thirst". "You feel" (Lei) is sente.' },
  stai: { sai: 'sai means "you know". stai dormendo = are you sleeping.' },
};

// u4-r1: -are
const WHY_ARE_IO = 'With io, -are verbs end in -o: parlo, lavoro, abito. The ending already says "I", so io is usually dropped.';
const WHY_ARE_TU = 'With tu, -are verbs end in -i: parli, abiti, ascolti.';
const WHY_ARE_3 = 'For he, she and it, -are verbs end in -a: parla, lavora, arriva.';
const WHY_ARE_LEI = 'Lei, the formal "you", takes the same form as "she": parla, abita, aspetta. tu takes -i: parli, abiti, aspetti.';
const WHY_ARE_NOI = 'With noi, regular verbs end in -iamo: parliamo, compriamo, mangiamo.';
const WHY_ARE_VOI = 'For "you" to two or more people, -are verbs end in -ate: parlate, guardate, ascoltate.';
const WHY_ARE_LORO = 'For "they", -are verbs end in -ano, with the stress on the same syllable as the io form: PAR-la-no, A-bi-ta-no, la-VO-ra-no.';

// u4-r2: -ere
const WHY_ERE_IO = 'With io, -ere verbs end in -o, just like -are verbs: prendo, scrivo, rispondo.';
const WHY_ERE_TU = 'With tu, -ere verbs end in -i, just like -are verbs: prendi, leggi, vivi.';
const WHY_ERE_3 = 'For he, she and it, -ere verbs end in -e, not -a: prende, legge, chiude, vive.';
const WHY_ERE_LEI = 'Lei takes the "she" form, which for -ere verbs ends in -e: prende, legge, vive.';
const WHY_ERE_NOI = 'With noi, -ere verbs end in -iamo, like every regular verb: prendiamo, vediamo, crediamo.';
const WHY_ERE_VOI = 'For "you" to two or more people, -ere verbs end in -ete, not -ate: prendete, vedete.';
const WHY_ERE_LORO = 'For "they", -ere verbs end in -ono, not -ano: prendono, leggono, chiudono.';
const WHY_LEGGERE = 'leggere keeps gg in every form. It sounds hard before o (leggo, leggono) and soft before i and e (leggi, legge): the spelling stays, the sound changes.';
const WHY_ORDER = 'At the bar, prendere ("take") is how you order: Prendo un caffè = I\'ll have a coffee.';

// u4-r3: -ire and -isc-
const WHY_IRE = 'dormire, partire, aprire, sentire and offrire have no -isc-: dormo, dormi, dorme, dormiamo, dormite, dormono.';
const WHY_ISC = 'capire, finire, preferire and pulire add -isc- for io, tu, he/she/Lei and loro: capisco, capisci, capisce, capiscono.';
const WHY_ISC_NOI_VOI = 'noi and voi never take -isc-: capiamo, capite; puliamo, pulite.';
const WHY_IRE_VOI = 'For "you" to two or more people, -ire verbs end in -ite: dormite, partite, capite.';
const WHY_IRE_LORO = 'For "they", -ire verbs end in -ono, like -ere verbs: dormono, partono. -isc- verbs keep -isc-: capiscono, finiscono.';
const WHY_SC = 'sc sounds "sk" before o (capisco, capiscono) and "sh" before i or e (capisci, capisce). The spelling is just -isc- plus the ending: no extra i or h.';

// u4-r4: spelling verbs and dropping io
const WHY_CH = 'cercare keeps its hard c ("k") in every form, so before an ending that starts with i it adds an h: cerchi, cerchiamo.';
const WHY_GH = 'pagare keeps its hard g (as in "go") in every form, so before an ending that starts with i it adds an h: paghi, paghiamo.';
const WHY_CIA = 'In mangiare and cominciare the i is only there to make g or c soft. Before an ending that starts with i it isn\'t repeated: mangi, mangiamo; cominci, cominciamo.';
const WHY_STUDI = 'studiare works like mangiare: studio, studi (one i), studia, studiamo.';
const WHY_DROP = 'The ending already says who, so Italians leave out io, tu and noi unless they want to stress or contrast the person.';
const WHY_STRESS = 'To stress who does something, Italians keep the pronoun, often after the verb: Pago io! = I\'ll pay (me, not you).';
const WHY_PLAN = 'With a time word like domani or stasera, the present tense covers plans: Domani parto = I\'m leaving tomorrow.';

const unit = {
  id: 4,
  slug: 'present-tense',
  title: 'Present tense',
  teaser: '-are · -ere · -ire',
  canSay: 'Cosa prende, signora? Oggi pago io!',
  lessons: [
    // ------------------------------------------------------------ -are
    {
      id: 'u4-l1',
      title: '-are verbs: parlare',
      rules: [
        {
          id: 'u4-r1',
          title: 'parlo · parli · parla · parliamo · parlate · parlano',
          sentence: 'Parlo italiano · Giulia parla inglese · I nonni parlano dialetto',
          marks: [
            { word: 'Parlo', kind: 'circle', color: 'pink' },
            { word: 'parla', kind: 'circle', color: 'pink' },
            { word: 'parlano', kind: 'underline', color: 'ultra' },
          ],
          why: 'Most Italian verbs end in -are, and almost all of them are regular (andare, dare, stare and fare come in Unit 5). Take off -are to get the stem (parl-), then add an ending that says who: -o, -i, -a, -iamo, -ate, -ano. Because the ending says who, Italians usually drop io, tu and noi: Parlo italiano = I speak Italian. One present covers English "I speak", "I\'m speaking" and "do you speak?": there is no "do" in Italian questions, only a rising voice. Parli inglese? = Do you speak English?',
          table: {
            head: ['verb', 'ending', 'parlare', 'English'],
            rows: [
              ['io', '-o', 'parlo', 'I speak'],
              ['tu', '-i', 'parli', 'you speak (informal)'],
              ['lui / lei / Lei', '-a', 'parla', 'he / she speaks, you speak (formal)'],
              ['noi', '-iamo', 'parliamo', 'we speak'],
              ['voi', '-ate', 'parlate', 'you speak (two or more people)'],
              ['loro', '-ano', 'parlano', 'they speak'],
            ],
            highlight: [5],
          },
          careful: 'In the loro form the stress does not move to the ending: it stays on the same syllable as in the io form. PAR-lo, PAR-la-no; A-bi-to, A-bi-ta-no; la-VO-ro, la-VO-ra-no. Never par-LA-no. Mind the three endings that are one letter apart: parlo (I), parli (you), parla (he, she, Lei). And aspettare, cercare and ascoltare already contain "for" and "to": aspetto il treno = I\'m waiting for the train, ascolto la radio = I\'m listening to the radio.',
          howItaliansSayIt: {
            it: 'Arrivo, arrivo!',
            en: 'Coming, coming!',
            note: 'When someone calls you, Italians often answer with the present of arrivare ("arrive") rather than "come". The -o already says it\'s you, so no io. Italian uses the present for things happening right now, where English says "I\'m …-ing".',
          },
        },
      ],
      examples: [
        { it: "Parlo un po' di italiano.", en: 'I speak a little Italian.', reg: 'neutral' },
        { it: 'Giulia lavora in centro.', en: 'Giulia works in the centre.', reg: 'neutral' },
        { it: 'Luca, abiti in centro?', en: 'Luca, do you live in the centre?', reg: 'tu' },
        { it: 'Scusi, parla inglese?', en: 'Excuse me, do you speak English?', reg: 'lei' },
        { it: 'Stasera mangiamo a casa.', en: "We're eating at home tonight.", reg: 'neutral' },
        { it: 'Ragazzi, cosa guardate?', en: 'Guys, what are you watching?', reg: 'neutral' },
        { it: 'I nonni abitano in campagna.', en: 'The grandparents live in the countryside.', reg: 'neutral' },
        { it: 'Signora, aspetta il treno per Firenze?', en: 'Madam, are you waiting for the train to Florence?', reg: 'lei' },
        { it: 'Arrivo tra cinque minuti!', en: "I'll be there in five minutes!", reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u4-l1-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r1',
          prompt: "___ un po' di italiano.", base: '"I speak a little Italian."', en: 'I speak a little Italian.',
          answers: ['Parlo'], options: ['Parlo', 'Parli', 'Parla'],
          mistakes: {
            Parli: 'parli is "you speak". "I speak" is parlo.',
            Parla: 'parla is "he/she speaks" or the formal "you speak". "I speak" is parlo.',
          },
          why: WHY_ARE_IO,
        },
        {
          id: 'u4-l1-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r1',
          prompt: 'Giulia ___ in centro.', base: '"Giulia works in the centre."', en: 'Giulia works in the centre.',
          answers: ['lavora'], options: ['lavora', 'lavori', 'lavoro'],
          mistakes: {
            lavori: 'lavori is "you work". Talking about Giulia: lavora.',
            lavoro: 'lavoro is "I work". Talking about Giulia: lavora.',
          },
          why: WHY_ARE_3,
        },
        {
          id: 'u4-l1-e03', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u4-r1',
          prompt: 'Luca, ___ in centro?', base: '"Luca, do you live in the centre?"', en: 'Luca, do you live in the centre?',
          answers: ['abiti'], options: ['abiti', 'abita', 'abito'],
          mistakes: {
            abita: 'abita is "he/she lives" or the formal Lei form. Luca is a friend: abiti.',
            abito: 'abito is "I live". Asking Luca: abiti.',
          },
          why: WHY_ARE_TU,
        },
        {
          id: 'u4-l1-e04', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u4-r1',
          prompt: 'Scusi, ___ inglese?', base: '"Excuse me, do you speak English?" (to a ticket inspector)', en: 'Excuse me, do you speak English?',
          answers: ['parla'], options: ['parla', 'parli', 'parlo'],
          mistakes: {
            parli: 'parli is the tu form. With scusi you are using Lei: parla.',
            parlo: 'parlo is "I speak". Asking him: parla.',
          },
          why: WHY_ARE_LEI,
        },
        {
          id: 'u4-l1-e05', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r1',
          prompt: 'Stasera ___ a casa.', base: '"We\'re eating at home tonight."', en: "We're eating at home tonight.",
          answers: ['mangiamo'], options: ['mangiamo', 'mangiate', 'mangiano'],
          mistakes: {
            mangiate: 'mangiate is "you eat" (two or more people). "We eat" is mangiamo.',
            mangiano: 'mangiano is "they eat". "We eat" is mangiamo.',
          },
          why: WHY_ARE_NOI,
        },
        {
          id: 'u4-l1-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r1',
          prompt: 'I nonni ___ in campagna.', base: '"The grandparents live in the countryside."', en: 'The grandparents live in the countryside.',
          answers: ['abitano'], options: ['abitano', 'abita', 'abitono'],
          mistakes: {
            abita: 'abita is for one person. The grandparents are two: abitano.',
            abitono: ARE_ANO('abitare', 'abitano'),
          },
          why: WHY_ARE_LORO,
        },
        {
          id: 'u4-l1-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r1',
          prompt: 'Ragazzi, cosa ___?', base: '"Guys, what are you watching?"', en: 'Guys, what are you watching?',
          answers: ['guardate'], options: ['guardate', 'guardiamo', 'guardano'],
          mistakes: {
            guardiamo: 'guardiamo is "we watch". Asking the group: guardate.',
            guardano: 'guardano is "they watch". Speaking to the group: guardate.',
          },
          why: WHY_ARE_VOI,
        },
        {
          id: 'u4-l1-e08', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u4-r1',
          prompt: 'Signora, ___ il treno per Firenze?', base: '"Madam, are you waiting for the train to Florence?"', en: 'Madam, are you waiting for the train to Florence?',
          answers: ['aspetta'], options: ['aspetta', 'aspetti', 'aspetto'],
          mistakes: {
            aspetti: 'aspetti is the tu form. A signora gets Lei: aspetta.',
            aspetto: 'aspetto is "I wait". Asking her: aspetta.',
          },
          why: WHY_ARE_LEI,
        },

        // Rung 2: fill the gap
        {
          id: 'u4-l1-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r1',
          prompt: 'Io ___ in una scuola di lingue.', base: '(lavorare)', en: 'I work at a language school.',
          answers: ['lavoro'],
          mistakes: {
            lavora: 'lavora is "he/she works". With io: lavoro.',
            lavori: 'lavori is "you work". With io: lavoro.',
          },
          why: WHY_ARE_IO,
        },
        {
          id: 'u4-l1-e10', type: 'type', reg: 'tu', rung: 2, ruleId: 'u4-r1',
          prompt: 'Amore, ___ la radio?', base: '(ascoltare)', en: 'Love, are you listening to the radio?',
          answers: ['ascolti'],
          mistakes: {
            ascolta: 'ascolta is "he/she listens" or Lei. To Giulia: ascolti.',
            ascolto: 'ascolto is "I listen". Asking Giulia: ascolti.',
          },
          why: WHY_ARE_TU,
        },
        {
          id: 'u4-l1-e11', type: 'type', reg: 'lei', rung: 2, ruleId: 'u4-r1',
          prompt: 'Signora, ___ qui vicino?', base: '(abitare)', en: 'Madam, do you live near here?',
          answers: ['abita'],
          mistakes: {
            abiti: 'abiti is the tu form. A signora gets Lei: abita.',
            abito: 'abito is "I live". Asking her: abita.',
          },
          why: WHY_ARE_LEI,
        },
        {
          id: 'u4-l1-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r1',
          prompt: 'Noi ___ sempre il pane qui.', base: '(comprare)', en: 'We always buy our bread here.',
          answers: ['compriamo'],
          mistakes: {
            compramo: IAMO('compriamo'),
            comprate: 'comprate is "you buy" (two or more people). "We buy" is compriamo.',
            comprano: 'comprano is "they buy". "We buy" is compriamo.',
          },
          why: WHY_ARE_NOI,
        },
        {
          id: 'u4-l1-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r1',
          prompt: 'Il treno ___ adesso.', base: '(arrivare)', en: 'The train is arriving now.',
          answers: ['arriva'],
          mistakes: {
            arrivano: 'arrivano is "they arrive". One train: arriva.',
            arrivi: 'arrivi is "you arrive". The train: arriva.',
          },
          why: WHY_ARE_3,
        },
        {
          id: 'u4-l1-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r1',
          prompt: 'Voi ___ la partita stasera?', base: '(guardare)', en: 'Are you (two) watching the match tonight?',
          answers: ['guardate'],
          mistakes: {
            guardete: ARE_ATE('guardare', 'guardate'),
            guardiamo: 'guardiamo is "we watch". Asking them: guardate.',
            guardano: 'guardano is "they watch". Speaking to them: guardate.',
          },
          why: WHY_ARE_VOI,
        },
        {
          id: 'u4-l1-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r1',
          prompt: 'Marco e Luca ___ in banca.', base: '(lavorare)', en: 'Marco and Luca work at a bank.',
          answers: ['lavorano'],
          mistakes: {
            lavorono: ARE_ANO('lavorare', 'lavorano'),
            lavora: 'lavora is for one person. Marco and Luca: lavorano.',
            lavoriamo: 'lavoriamo is "we work". Talking about them: lavorano.',
          },
          why: WHY_ARE_LORO,
        },
        {
          id: 'u4-l1-e16', type: 'type', reg: 'lei', rung: 2, ruleId: 'u4-r1',
          prompt: 'Signor Bianchi, ___ qualcuno?', base: '(aspettare)', en: 'Mr Bianchi, are you waiting for someone?',
          answers: ['aspetta'],
          mistakes: {
            aspetti: 'aspetti is the tu form. The neighbour gets Lei: aspetta.',
            aspetto: 'aspetto is "I wait". Asking him: aspetta.',
          },
          why: WHY_ARE_LEI,
        },

        // Rung 3: transform
        {
          id: 'u4-l1-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r1',
          prompt: 'Parlo inglese.', base: 'Now say "we" (noi).', en: 'We speak English.',
          answers: ['Parliamo inglese.', 'Noi parliamo inglese.'],
          mistakes: {
            'Parlamo inglese.': IAMO('parliamo'),
            'Noi parlamo inglese.': IAMO('parliamo'),
            'Parlate inglese.': 'parlate is "you speak" (plural). "We speak" is parliamo.',
            'Parlano inglese.': 'parlano is "they speak". "We speak" is parliamo.',
          },
          why: WHY_ARE_NOI,
        },
        {
          id: 'u4-l1-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r1',
          prompt: 'Giulia lavora in centro.', base: 'Now say it about Giulia and Marco.', en: 'Giulia and Marco work in the centre.',
          answers: ['Giulia e Marco lavorano in centro.', 'Marco e Giulia lavorano in centro.'],
          mistakes: {
            'Giulia e Marco lavora in centro.': 'Two people: lavorano.',
            'Marco e Giulia lavora in centro.': 'Two people: lavorano.',
            'Giulia e Marco lavorono in centro.': ARE_ANO('lavorare', 'lavorano'),
            'Marco e Giulia lavorono in centro.': ARE_ANO('lavorare', 'lavorano'),
          },
          why: WHY_ARE_LORO,
        },
        {
          id: 'u4-l1-e19', type: 'transform', reg: 'tu', rung: 3, ruleId: 'u4-r1',
          prompt: 'Abito a Utrecht.', base: 'Now ask Luca if he lives in Bologna.', en: 'Do you live in Bologna?',
          answers: ['Abiti a Bologna?', 'Tu abiti a Bologna?', 'Luca, abiti a Bologna?', 'Abiti a Bologna, Luca?'],
          mistakes: {
            'Abita a Bologna?': 'abita is the Lei form. Luca is a friend: abiti.',
            'Luca, abita a Bologna?': 'abita is the Lei form. Luca is a friend: abiti.',
            'Abito a Bologna?': 'abito is "I live". Asking Luca: abiti.',
            'Abiti in Bologna?': 'With a city, "in" is a: abiti a Bologna.',
          },
          why: WHY_ARE_TU,
        },
        {
          id: 'u4-l1-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r1',
          prompt: 'Compro il pane.', base: 'Now say "they" (loro).', en: 'They buy the bread.',
          answers: ['Comprano il pane.', 'Loro comprano il pane.'],
          mistakes: {
            'Comprono il pane.': ARE_ANO('comprare', 'comprano'),
            'Loro comprono il pane.': ARE_ANO('comprare', 'comprano'),
            'Compra il pane.': 'compra is for one person. "They buy" is comprano.',
            'Loro compra il pane.': 'compra is for one person. With loro: comprano.',
          },
          why: WHY_ARE_LORO,
        },
        {
          id: 'u4-l1-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r1',
          prompt: 'Ascolti la radio?', base: 'Now ask Giulia and Marco together (voi).', en: 'Are you (both) listening to the radio?',
          answers: ['Ascoltate la radio?', 'Voi ascoltate la radio?'],
          mistakes: {
            'Ascoltete la radio?': ARE_ATE('ascoltare', 'ascoltate'),
            'Voi ascoltete la radio?': ARE_ATE('ascoltare', 'ascoltate'),
            'Ascoltano la radio?': 'ascoltano is "they listen". Speaking to them: ascoltate.',
            'Ascolti la radio?': 'ascolti is for one person. Two people: ascoltate.',
          },
          why: WHY_ARE_VOI,
        },

        // Rung 3: switch register
        {
          id: 'u4-l1-e22', type: 'register', reg: 'lei', rung: 3, ruleId: 'u4-r1',
          prompt: 'Parli inglese?', base: 'You asked Luca. Now ask a woman at the station (formal).', en: 'Do you speak English?',
          answers: ['Parla inglese?', 'Lei parla inglese?', 'Scusi, parla inglese?', 'Mi scusi, parla inglese?', 'Scusi, Lei parla inglese?', 'Signora, parla inglese?'],
          mistakes: {
            'Parli inglese?': 'That is still the tu form. With Lei: parla.',
            'Scusi, parli inglese?': 'scusi is right, but parli is tu. With Lei: parla.',
            'Scusa, parla inglese?': 'parla is right, but scusa is for tu. With Lei: scusi.',
            'Lei parli inglese?': 'Lei takes the "she" form: Lei parla.',
            'Signora, parli inglese?': 'With signora you use Lei: parla.',
          },
          why: 'tu parli → Lei parla, the same form as "she speaks".',
        },
        {
          id: 'u4-l1-e23', type: 'register', reg: 'lei', rung: 3, ruleId: 'u4-r1',
          prompt: 'Abiti qui vicino?', base: 'You asked Sara. Now ask an older neighbour on the stairs (formal).', en: 'Do you live near here?',
          answers: ['Abita qui vicino?', 'Lei abita qui vicino?', 'Scusi, abita qui vicino?', 'Signora, abita qui vicino?'],
          mistakes: {
            'Abiti qui vicino?': 'That is still the tu form. With Lei: abita.',
            'Lei abiti qui vicino?': 'Lei takes the "she" form: Lei abita.',
            'Scusi, abiti qui vicino?': 'scusi is right, but abiti is tu. With Lei: abita.',
            'Signora, abiti qui vicino?': 'With signora you use Lei: abita.',
          },
          why: 'tu abiti → Lei abita.',
        },
        {
          id: 'u4-l1-e24', type: 'register', reg: 'tu', rung: 3, ruleId: 'u4-r1',
          prompt: "Signora, aspetta l'autobus?", base: 'You asked an older lady at the bus stop. Now ask Giulia (informal).', en: 'Are you waiting for the bus?',
          answers: ["Giulia, aspetti l'autobus?", "Aspetti l'autobus?", "Aspetti l'autobus, Giulia?", "Tu aspetti l'autobus?"],
          mistakes: {
            "Giulia, aspetta l'autobus?": 'aspetta is the Lei form. To Giulia: aspetti.',
            "Aspetta l'autobus?": 'aspetta is the Lei form. To Giulia: aspetti.',
            "Aspetta l'autobus, Giulia?": 'aspetta is the Lei form. To Giulia: aspetti.',
            "Giulia, aspetti per l'autobus?": 'aspettare already means "wait for": no per.',
          },
          why: 'Lei aspetta → tu aspetti.',
        },
        {
          id: 'u4-l1-e25', type: 'register', reg: 'tu', rung: 3, ruleId: 'u4-r1',
          prompt: 'Scusi, lavora qui?', base: 'You asked a man in a shop. Now ask a guy your age at a bar (informal).', en: 'Excuse me, do you work here?',
          answers: ['Scusa, lavori qui?', 'Lavori qui?', 'Tu lavori qui?', 'Scusa, tu lavori qui?'],
          mistakes: {
            'Scusa, lavora qui?': 'scusa is right, but lavora is Lei. With tu: lavori.',
            'Scusi, lavori qui?': 'lavori is right, but scusi is for Lei. With tu: scusa.',
            'Scusi, lavora qui?': 'That is still all Lei. To a guy your age: Scusa, lavori qui?',
          },
          why: 'Lei lavora → tu lavori, and scusi → scusa.',
        },
        {
          id: 'u4-l1-e26', type: 'register', reg: 'lei', rung: 3, ruleId: 'u4-r1',
          prompt: 'Guardi la partita?', base: "You asked Marco. Now ask Giulia's grandfather (formal).", en: 'Are you watching the match?',
          answers: ['Guarda la partita?', 'Lei guarda la partita?'],
          mistakes: {
            'Guardi la partita?': 'That is still the tu form. With Lei: guarda.',
            'Lei guardi la partita?': 'Lei takes the "she" form: Lei guarda.',
          },
          why: 'tu guardi → Lei guarda.',
        },

        // Rung 4: build from English
        {
          id: 'u4-l1-e27', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r1',
          prompt: 'Translate: "I speak a little Italian."', base: '(to a waiter who starts in English)', en: 'I speak a little Italian.',
          answers: [
            "Parlo un po' di italiano.", "Parlo un po' d'italiano.",
            "Io parlo un po' di italiano.", "Io parlo un po' d'italiano.", 'Parlo un poco di italiano.',
          ],
          mistakes: {
            "Parla un po' di italiano.": 'parla is "he/she speaks" or Lei. "I speak" is parlo.',
            "Parli un po' di italiano.": 'parli is "you speak". "I speak" is parlo.',
            'Parlo un po di italiano.': "po' is short for poco and always takes an apostrophe: un po'.",
            'Parlo un pò di italiano.': "po' takes an apostrophe, not an accent: un po'.",
          },
          why: WHY_ARE_IO + " \"A little\" is un po' (short for un poco).",
        },
        {
          id: 'u4-l1-e28', type: 'build', reg: 'lei', rung: 4, ruleId: 'u4-r1',
          prompt: 'Translate: "Where do you live?"', base: '(to an older lady you are chatting with on the train)', en: 'Where do you live?',
          answers: ['Dove abita?', 'Lei dove abita?', 'Dove abita Lei?', 'Signora, dove abita?', 'Dove vive?', 'Lei dove vive?'],
          mistakes: {
            'Dove abiti?': 'To an older stranger, use Lei: dove abita?',
            'Dove vivi?': 'To an older stranger, use Lei: dove vive?',
            'Lei dove abiti?': 'Lei takes the "she" form: Lei dove abita?',
            'Signora, dove abiti?': 'With signora you use Lei: dove abita?',
          },
          why: WHY_ARE_LEI + ' (vivere, "to live", works too: Dove vive? See lesson 2.)',
        },
        {
          id: 'u4-l1-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r1',
          prompt: 'Translate: "We\'re eating at home tonight."', base: '(texting Marco)', en: "We're eating at home tonight.",
          answers: [
            'Stasera mangiamo a casa.', 'Mangiamo a casa stasera.',
            'Stasera noi mangiamo a casa.', 'Noi mangiamo a casa stasera.',
            'Stasera ceniamo a casa.', 'Ceniamo a casa stasera.',
          ],
          mistakes: {
            'Stasera mangiano a casa.': 'mangiano is "they eat". "We eat" is mangiamo.',
            'Mangiano a casa stasera.': 'mangiano is "they eat". "We eat" is mangiamo.',
            'Stasera mangiate a casa.': 'mangiate is "you eat" (plural). "We eat" is mangiamo.',
            'Stasera mangiiamo a casa.': ONE_I('mangiamo'),
            'Mangiiamo a casa stasera.': ONE_I('mangiamo'),
          },
          why: WHY_ARE_NOI + ' The present also covers plans: stasera mangiamo = we\'re eating tonight.',
        },
        {
          id: 'u4-l1-e30', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r1',
          prompt: 'Translate: "The grandparents live in the countryside."', base: "(telling a friend about Giulia's family)", en: 'The grandparents live in the countryside.',
          answers: ['I nonni abitano in campagna.', 'I nonni vivono in campagna.'],
          mistakes: {
            'I nonni abita in campagna.': 'The grandparents are two people: abitano.',
            'I nonni abitono in campagna.': ARE_ANO('abitare', 'abitano'),
            'I nonni abitano a campagna.': 'The countryside is in campagna.',
          },
          why: WHY_ARE_LORO,
        },
        {
          id: 'u4-l1-e31', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r1',
          prompt: 'Translate: "Are you watching the match?"', base: '(to Giulia and Marco together)', en: 'Are you (both) watching the match?',
          answers: ['Guardate la partita?', 'Voi guardate la partita?', 'Guardate la partita voi?'],
          mistakes: {
            'Guardi la partita?': 'guardi is for one person. Two people: guardate.',
            'Guardano la partita?': 'guardano is "they watch". Speaking to them: guardate.',
            'Guardete la partita?': ARE_ATE('guardare', 'guardate'),
            'Voi guardete la partita?': ARE_ATE('guardare', 'guardate'),
          },
          why: WHY_ARE_VOI,
        },
        {
          id: 'u4-l1-e32', type: 'build', reg: 'lei', rung: 4, ruleId: 'u4-r1',
          prompt: 'Translate: "Excuse me, are you waiting for the bus?"', base: '(to an older man at the bus stop)', en: 'Excuse me, are you waiting for the bus?',
          answers: ["Scusi, aspetta l'autobus?", "Mi scusi, aspetta l'autobus?", "Scusi, Lei aspetta l'autobus?"],
          mistakes: {
            "Scusi, aspetta per l'autobus?": 'aspettare already means "wait for": aspetta l\'autobus, no per.',
            "Scusi, aspetti l'autobus?": 'aspetti is tu. To an older stranger: aspetta.',
            "Scusa, aspetta l'autobus?": 'scusa is for tu. To a stranger: scusi.',
          },
          why: WHY_ARE_LEI,
        },
        {
          id: 'u4-l1-e33', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r1',
          prompt: 'Translate: "Coming!"', base: '(Giulia calls you from the kitchen)', en: 'Coming!',
          answers: ['Arrivo!', 'Arrivo, arrivo!', 'Vengo!', 'Vengo, vengo!'],
          mistakes: {
            'Arriva!': 'arriva is "he/she is coming". For yourself: arrivo.',
            'Arrivi!': 'arrivi is "you arrive". For yourself: arrivo.',
          },
          why: 'Italians answer a call with Arrivo! ("I\'m arriving"). The -o already says it\'s you.',
        },

        // Rung 5: listen & type
        {
          id: 'u4-l1-e34', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u4-r1',
          prompt: 'Parliamo italiano con i nonni.', base: '', en: 'We speak Italian with the grandparents.',
          answers: ['Parliamo italiano con i nonni.'],
          mistakes: {
            'Parlamo italiano con i nonni.': 'You heard parliamo, with an i: the noi ending is -iamo.',
            'Parlano italiano con i nonni.': 'You heard parliamo, "we speak". parlano would be "they speak".',
          },
          why: WHY_ARE_NOI,
        },
        {
          id: 'u4-l1-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u4-r1',
          prompt: 'I nonni abitano in campagna.', base: '', en: 'The grandparents live in the countryside.',
          answers: ['I nonni abitano in campagna.'],
          mistakes: {
            'I nonni abita in campagna.': 'You heard abitano: the grandparents are two people.',
            'I nonni abitono in campagna.': 'You heard -ano: abitare is an -are verb.',
          },
          why: WHY_ARE_LORO,
        },
        {
          id: 'u4-l1-e36', type: 'listen', reg: 'lei', rung: 5, ruleId: 'u4-r1',
          prompt: 'Signora, aspetta il treno per Firenze?', base: '', en: 'Madam, are you waiting for the train to Florence?',
          answers: ['Signora, aspetta il treno per Firenze?'],
          mistakes: {
            'Signora, aspetti il treno per Firenze?': 'You heard aspetta, the Lei form: a signora gets Lei.',
          },
          why: WHY_ARE_LEI,
        },
        {
          id: 'u4-l1-e37', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u4-r1',
          prompt: 'Lavori oggi?', base: '', en: 'Are you working today?',
          answers: ['Lavori oggi?'],
          mistakes: {
            'Lavora oggi?': 'You heard lavori, the tu form. lavora would be Lei.',
            'Lavoro oggi?': 'You heard lavori, "you work". lavoro is "I work".',
          },
          why: WHY_ARE_TU,
        },
      ],
    },

    // ------------------------------------------------------------ -ere
    {
      id: 'u4-l2',
      title: '-ere verbs: prendere',
      rules: [
        {
          id: 'u4-r2',
          title: 'prendo · prendi · prende · prendiamo · prendete · prendono',
          sentence: 'Prendo un caffè · Giulia prende un tè · I nonni prendono un gelato',
          marks: [
            { word: 'Prendo', kind: 'circle', color: 'pink' },
            { word: 'prende', kind: 'circle', color: 'ultra' },
            { word: 'prendono', kind: 'circle', color: 'ultra' },
          ],
          why: '-ere verbs work like -are verbs: take off -ere (prend-) and add the endings. io, tu and noi end exactly as with -are: prendo, prendi, prendiamo. Three endings are different: -e for he, she and Lei (prende), -ete for voi (prendete) and -ono for loro (prendono). Other common -ere verbs: vivere, leggere, scrivere, vedere, credere, chiudere, rispondere, mettere.',
          table: {
            head: ['verb', 'ending', 'prendere', 'English'],
            rows: [
              ['io', '-o', 'prendo', 'I take'],
              ['tu', '-i', 'prendi', 'you take (informal)'],
              ['lui / lei / Lei', '-e', 'prende', 'he / she takes, you take (formal)'],
              ['noi', '-iamo', 'prendiamo', 'we take'],
              ['voi', '-ete', 'prendete', 'you take (two or more people)'],
              ['loro', '-ono', 'prendono', 'they take'],
            ],
            highlight: [2, 4, 5],
          },
          careful: 'Don\'t carry the -are endings over: prende, not prenda; prendete, not prendate; prendono, not prendano. The spelling of the stem never changes, but its sound can. In leggere, gg is hard before o, as in "leg go": leggo, leggono. Before i and e it is soft, like the j in "jet": leggi, legge, leggiamo, leggete. No i or h is added. As with -are, the loro form keeps the stress of the io form: PREN-do, PREN-do-no; LEG-go, LEG-go-no.',
          howItaliansSayIt: {
            it: 'Cosa prende? Un cappuccino, grazie.',
            en: 'What will you have? A cappuccino, thanks.',
            note: 'At a bar or restaurant, prendere ("take") is the ordering verb. The waiter asks Cosa prende? (Lei) or, to a group, Cosa prendete? You answer Prendo un… or just name the drink.',
          },
        },
      ],
      examples: [
        { it: 'Prendo un caffè, grazie.', en: "I'll have a coffee, thanks.", reg: 'neutral' },
        { it: 'Cosa prende, signora?', en: 'What will you have, madam?', reg: 'lei' },
        { it: 'Giulia legge il giornale.', en: 'Giulia is reading the newspaper.', reg: 'neutral' },
        { it: 'Amore, cosa leggi?', en: 'Love, what are you reading?', reg: 'tu' },
        { it: 'Scusi, a che ora chiude il museo?', en: 'Excuse me, what time does the museum close?', reg: 'lei' },
        { it: 'Stasera vediamo un film?', en: 'Shall we watch a film tonight?', reg: 'neutral' },
        { it: 'Ragazzi, cosa prendete?', en: 'Guys, what are you having?', reg: 'neutral' },
        { it: 'Marco vive da solo.', en: 'Marco lives on his own.', reg: 'neutral' },
        { it: 'Il telefono! Rispondo io.', en: "The phone! I'll get it.", reg: 'neutral' },
        { it: 'Credo di sì.', en: 'I think so.', reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u4-l2-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r2',
          prompt: '___ un caffè, grazie.', base: '"I\'ll have a coffee, thanks." (at the bar)', en: "I'll have a coffee, thanks.",
          answers: ['Prendo'], options: ['Prendo', 'Prende', 'Prendi'],
          mistakes: {
            Prende: 'prende is "he/she takes" or Lei. For yourself: prendo.',
            Prendi: 'prendi is "you take". For yourself: prendo.',
          },
          why: WHY_ERE_IO + ' ' + WHY_ORDER,
        },
        {
          id: 'u4-l2-e02', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u4-r2',
          prompt: 'Cosa ___, signora?', base: '"What will you have, madam?" (you ask Giulia\'s grandmother at the bar)', en: 'What will you have, madam?',
          answers: ['prende'], options: ['prende', 'prendi', 'prenda'],
          mistakes: {
            prendi: 'prendi is the tu form. A signora gets Lei: prende.',
            prenda: 'prendere is an -ere verb, so the Lei form ends in -e: prende.',
          },
          why: WHY_ERE_LEI,
        },
        {
          id: 'u4-l2-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r2',
          prompt: 'Giulia ___ il giornale.', base: '"Giulia is reading the newspaper."', en: 'Giulia is reading the newspaper.',
          answers: ['legge'], options: ['legge', 'leggi', 'leggo'],
          mistakes: {
            leggi: 'leggi is "you read". Talking about Giulia: legge.',
            leggo: 'leggo is "I read". Talking about Giulia: legge.',
          },
          why: WHY_ERE_3,
        },
        {
          id: 'u4-l2-e04', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u4-r2',
          prompt: 'Amore, cosa ___?', base: '"Love, what are you reading?"', en: 'Love, what are you reading?',
          answers: ['leggi'], options: ['leggi', 'legge', 'leggo'],
          mistakes: {
            legge: 'legge is "he/she reads" or Lei. To Giulia: leggi.',
            leggo: 'leggo is "I read". Asking Giulia: leggi.',
          },
          why: WHY_ERE_TU,
        },
        {
          id: 'u4-l2-e05', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r2',
          prompt: 'I negozi ___ presto il sabato.', base: '"The shops close early on Saturdays."', en: 'The shops close early on Saturdays.',
          answers: ['chiudono'], options: ['chiudono', 'chiudano', 'chiude'],
          mistakes: {
            chiudano: ERE_ONO('chiudere', 'chiudono'),
            chiude: 'chiude is for one thing. The shops: chiudono.',
          },
          why: WHY_ERE_LORO,
        },
        {
          id: 'u4-l2-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r2',
          prompt: 'Ragazzi, cosa ___?', base: '"Guys, what are you having?"', en: 'Guys, what are you having?',
          answers: ['prendete'], options: ['prendete', 'prendate', 'prendiamo'],
          mistakes: {
            prendate: ERE_ETE('prendere', 'prendete'),
            prendiamo: 'prendiamo is "we take". Asking the group: prendete.',
          },
          why: WHY_ERE_VOI,
        },
        {
          id: 'u4-l2-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r2',
          prompt: 'Stasera ___ un film.', base: '"We\'re watching a film tonight."', en: "We're watching a film tonight.",
          answers: ['vediamo'], options: ['vediamo', 'vedete', 'vedono'],
          mistakes: {
            vedete: 'vedete is "you see" (plural). "We see" is vediamo.',
            vedono: 'vedono is "they see". "We see" is vediamo.',
          },
          why: WHY_ERE_NOI + ' For a film, Italians say vedere or guardare.',
        },
        {
          id: 'u4-l2-e08', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u4-r2',
          prompt: 'Scusi, a che ora ___ il museo?', base: '"Excuse me, what time does the museum close?"', en: 'Excuse me, what time does the museum close?',
          answers: ['chiude'], options: ['chiude', 'chiuda', 'chiudono'],
          mistakes: {
            chiuda: 'chiudere is an -ere verb, so "it" ends in -e: chiude.',
            chiudono: 'chiudono is for more than one. One museum: chiude.',
          },
          why: WHY_ERE_3,
        },

        // Rung 2: fill the gap
        {
          id: 'u4-l2-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r2',
          prompt: 'Io ___ un messaggio a Marco.', base: '(scrivere)', en: "I'm writing a message to Marco.",
          answers: ['scrivo'],
          mistakes: {
            scrive: 'scrive is "he/she writes". With io: scrivo.',
            scrivi: 'scrivi is "you write". With io: scrivo.',
          },
          why: WHY_ERE_IO,
        },
        {
          id: 'u4-l2-e10', type: 'type', reg: 'tu', rung: 2, ruleId: 'u4-r2',
          prompt: 'Amore, ___ il caffè con lo zucchero?', base: '(prendere)', en: 'Love, do you take your coffee with sugar?',
          answers: ['prendi'],
          mistakes: {
            prende: 'prende is "he/she takes" or Lei. To Giulia: prendi.',
            prendo: 'prendo is "I take". Asking Giulia: prendi.',
          },
          why: WHY_ERE_TU,
        },
        {
          id: 'u4-l2-e11', type: 'type', reg: 'lei', rung: 2, ruleId: 'u4-r2',
          prompt: 'Signora, ___ il giornale ogni mattina?', base: '(leggere)', en: 'Madam, do you read the newspaper every morning?',
          answers: ['legge'],
          mistakes: {
            leggi: 'leggi is the tu form. A signora gets Lei: legge.',
            leggie: GG_SOFT('legge'),
            lege: GG_DOUBLE('legge'),
          },
          why: WHY_ERE_LEI,
        },
        {
          id: 'u4-l2-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r2',
          prompt: 'Marco ___ da solo.', base: '(vivere)', en: 'Marco lives on his own.',
          answers: ['vive'],
          mistakes: {
            vivi: 'vivi is "you live". Marco: vive.',
            viva: 'vivere is an -ere verb, so "he" ends in -e: vive.',
          },
          why: WHY_ERE_3,
        },
        {
          id: 'u4-l2-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r2',
          prompt: 'Noi ___ di sì.', base: '(credere: "we think so")', en: 'We think so.',
          answers: ['crediamo'],
          mistakes: {
            credamo: IAMO('crediamo'),
            credete: 'credete is "you think" (plural). "We think" is crediamo.',
          },
          why: WHY_ERE_NOI,
        },
        {
          id: 'u4-l2-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r2',
          prompt: 'Voi ___ il caffè o il tè?', base: '(prendere: asking Giulia and Marco)', en: 'Are you (two) having coffee or tea?',
          answers: ['prendete'],
          mistakes: {
            prendate: ERE_ETE('prendere', 'prendete'),
            prendite: ERE_ETE('prendere', 'prendete'),
            prendiamo: 'prendiamo is "we take". Asking them: prendete.',
            prendono: 'prendono is "they take". Speaking to them: prendete.',
          },
          why: WHY_ERE_VOI,
        },
        {
          id: 'u4-l2-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r2',
          prompt: 'I nonni ___ il giornale.', base: '(leggere)', en: 'The grandparents are reading the newspaper.',
          answers: ['leggono'],
          mistakes: {
            leggano: ERE_ONO('leggere', 'leggono'),
            leggiono: GG_HARD('leggono'),
            legono: GG_DOUBLE('leggono'),
            legge: 'legge is for one person. The grandparents: leggono.',
          },
          why: WHY_ERE_LORO + ' ' + WHY_LEGGERE,
        },
        {
          id: 'u4-l2-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r2',
          prompt: 'Il telefono! ___ io.', base: '(rispondere: "I\'ll get it")', en: "The phone! I'll get it.",
          answers: ['Rispondo'],
          mistakes: {
            Risponde: 'risponde is "he/she answers". With io: rispondo.',
            Rispondi: 'rispondi is "you answer". With io: rispondo.',
          },
          why: WHY_ERE_IO + ' Putting io after the verb stresses it: Rispondo io = I\'ll answer (not you).',
        },

        // Rung 3: transform
        {
          id: 'u4-l2-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r2',
          prompt: 'Prendo un cappuccino.', base: 'Now say it about Giulia.', en: 'Giulia is having a cappuccino.',
          answers: ['Giulia prende un cappuccino.'],
          mistakes: {
            'Giulia prendi un cappuccino.': 'prendi is "you take". Giulia: prende.',
            'Giulia prenda un cappuccino.': 'prendere is an -ere verb, so "she" ends in -e: prende.',
            'Giulia prendo un cappuccino.': 'prendo is "I take". Giulia: prende.',
          },
          why: WHY_ERE_3,
        },
        {
          id: 'u4-l2-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r2',
          prompt: 'Leggo il giornale.', base: 'Now say it about the grandparents: start with I nonni.', en: 'The grandparents read the newspaper.',
          answers: ['I nonni leggono il giornale.'],
          mistakes: {
            'I nonni leggano il giornale.': ERE_ONO('leggere', 'leggono'),
            'I nonni leggiono il giornale.': GG_HARD('leggono'),
            'I nonni legono il giornale.': GG_DOUBLE('leggono'),
            'I nonni legge il giornale.': 'legge is for one person. The grandparents: leggono.',
          },
          why: WHY_ERE_LORO,
        },
        {
          id: 'u4-l2-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r2',
          prompt: 'Vedi Marco stasera?', base: 'You asked Giulia. Now ask Giulia and Sara together (voi).', en: 'Are you (two) seeing Marco tonight?',
          answers: ['Vedete Marco stasera?', 'Voi vedete Marco stasera?'],
          mistakes: {
            'Vedate Marco stasera?': ERE_ETE('vedere', 'vedete'),
            'Voi vedate Marco stasera?': ERE_ETE('vedere', 'vedete'),
            'Vedono Marco stasera?': 'vedono is "they see". Speaking to them: vedete.',
            'Vedi Marco stasera?': 'vedi is for one person. Two people: vedete.',
          },
          why: WHY_ERE_VOI,
        },
        {
          id: 'u4-l2-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r2',
          prompt: 'Scrivo a Sara.', base: 'Now say "we" (noi).', en: "We're writing to Sara.",
          answers: ['Scriviamo a Sara.', 'Noi scriviamo a Sara.'],
          mistakes: {
            'Scrivamo a Sara.': IAMO('scriviamo'),
            'Noi scrivamo a Sara.': IAMO('scriviamo'),
            'Scrivete a Sara.': 'scrivete is "you write" (plural). "We write" is scriviamo.',
            'Scrivono a Sara.': 'scrivono is "they write". "We write" is scriviamo.',
          },
          why: WHY_ERE_NOI,
        },
        {
          id: 'u4-l2-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r2',
          prompt: 'Il bar chiude presto.', base: 'Make it plural: i bar (bar doesn\'t change).', en: 'The bars close early.',
          answers: ['I bar chiudono presto.'],
          mistakes: {
            'I bar chiude presto.': 'Plural subject: chiudono.',
            'I bar chiudano presto.': ERE_ONO('chiudere', 'chiudono'),
            'I bars chiudono presto.': 'Words borrowed from English, like bar, don\'t change in the plural: i bar.',
          },
          why: WHY_ERE_LORO,
        },

        // Rung 3: switch register
        {
          id: 'u4-l2-e22', type: 'register', reg: 'lei', rung: 3, ruleId: 'u4-r2',
          prompt: 'Cosa prendi?', base: 'You asked Giulia at the bar. Now ask her grandmother (formal).', en: 'What will you have?',
          answers: ['Cosa prende?', 'Che cosa prende?', 'Che prende?', 'Lei cosa prende?', 'Signora, cosa prende?', 'Signora, che cosa prende?', 'Cosa prende, signora?'],
          mistakes: {
            'Cosa prendi?': 'That is still the tu form. With Lei: prende.',
            'Signora, cosa prendi?': 'With signora you use Lei: prende.',
            'Cosa prendi, signora?': 'With signora you use Lei: prende.',
            'Cosa prenda?': 'prendere is an -ere verb, so the Lei form ends in -e: prende.',
            'Lei cosa prendi?': 'Lei takes the "she" form: prende.',
          },
          why: 'tu prendi → Lei prende.',
        },
        {
          id: 'u4-l2-e23', type: 'register', reg: 'tu', rung: 3, ruleId: 'u4-r2',
          prompt: 'Legge il giornale, signor Bianchi?', base: 'You asked the neighbour. Now ask Marco (informal).', en: 'Are you reading the newspaper, Marco?',
          answers: ['Leggi il giornale, Marco?', 'Marco, leggi il giornale?', 'Leggi il giornale?', 'Tu leggi il giornale?'],
          mistakes: {
            'Legge il giornale, Marco?': 'That is the Lei form. To Marco: leggi.',
            'Marco, legge il giornale?': 'That is the Lei form. To Marco: leggi.',
            'Legge il giornale?': 'That is the Lei form. To Marco: leggi.',
          },
          why: 'Lei legge → tu leggi.',
        },
        {
          id: 'u4-l2-e24', type: 'register', reg: 'lei', rung: 3, ruleId: 'u4-r2',
          prompt: 'Vivi qui?', base: 'You asked a guy at a party. Now ask an older lady at the market (formal).', en: 'Do you live here?',
          answers: ['Vive qui?', 'Lei vive qui?', 'Signora, vive qui?', 'Scusi, vive qui?', 'Abita qui?', 'Lei abita qui?', 'Signora, abita qui?'],
          mistakes: {
            'Vivi qui?': 'That is still the tu form. With Lei: vive.',
            'Lei vivi qui?': 'Lei takes the "she" form: Lei vive.',
            'Signora, vivi qui?': 'With signora you use Lei: vive.',
            'Viva qui?': 'vivere is an -ere verb, so the Lei form ends in -e: vive.',
          },
          why: 'tu vivi → Lei vive.',
        },
        {
          id: 'u4-l2-e25', type: 'register', reg: 'lei', rung: 3, ruleId: 'u4-r2',
          prompt: 'Prendi un caffè?', base: "You offered Luca a coffee. Now offer one to Giulia's grandfather (formal).", en: 'Will you have a coffee?',
          answers: ['Prende un caffè?', 'Lei prende un caffè?'],
          mistakes: {
            'Prendi un caffè?': 'That is still the tu form. With Lei: prende.',
            'Lei prendi un caffè?': 'Lei takes the "she" form: Lei prende.',
            'Prenda un caffè?': 'prendere is an -ere verb, so the Lei form ends in -e: prende.',
          },
          why: 'tu prendi → Lei prende. Offering with the present is natural: Prende un caffè?',
        },
        {
          id: 'u4-l2-e26', type: 'register', reg: 'tu', rung: 3, ruleId: 'u4-r2',
          prompt: "Prende l'autobus, signora?", base: 'You asked an older lady at the stop. Now ask Giulia (informal).', en: 'Are you taking the bus?',
          answers: ["Prendi l'autobus, Giulia?", "Giulia, prendi l'autobus?", "Prendi l'autobus?", "Tu prendi l'autobus?"],
          mistakes: {
            "Prende l'autobus, Giulia?": 'That is the Lei form. To Giulia: prendi.',
            "Giulia, prende l'autobus?": 'That is the Lei form. To Giulia: prendi.',
            "Prende l'autobus?": 'That is the Lei form. To Giulia: prendi.',
          },
          why: 'Lei prende → tu prendi.',
        },

        // Rung 4: build from English
        {
          id: 'u4-l2-e27', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r2',
          prompt: 'Translate: "I\'ll have a cappuccino, thanks."', base: '(ordering at the bar)', en: "I'll have a cappuccino, thanks.",
          answers: ['Prendo un cappuccino, grazie.', 'Io prendo un cappuccino, grazie.', 'Per me un cappuccino, grazie.'],
          mistakes: {
            'Prende un cappuccino, grazie.': 'prende is "he/she takes" or Lei. For yourself: prendo.',
            'Prendi un cappuccino, grazie.': 'prendi is "you take". For yourself: prendo.',
            'Prendo una cappuccino, grazie.': 'cappuccino is masculine: un cappuccino.',
          },
          why: WHY_ORDER,
        },
        {
          id: 'u4-l2-e28', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r2',
          prompt: 'Translate: "What are you having?"', base: "(to Giulia's grandparents together, at the restaurant)", en: 'What are you having?',
          answers: ['Cosa prendete?', 'Che cosa prendete?', 'Che prendete?', 'Voi cosa prendete?'],
          mistakes: {
            'Cosa prendate?': ERE_ETE('prendere', 'prendete'),
            'Che cosa prendate?': ERE_ETE('prendere', 'prendete'),
            'Cosa prende?': 'prende is for one person. Two people, formal or not: prendete.',
            'Cosa prendono?': 'prendono is "they take". Speaking to them: prendete.',
          },
          why: WHY_ERE_VOI + ' For two or more people, voi is right even with grandparents.',
        },
        {
          id: 'u4-l2-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r2',
          prompt: 'Translate: "Giulia is reading the newspaper."', base: '(answering Marco on the phone)', en: 'Giulia is reading the newspaper.',
          answers: ['Giulia legge il giornale.', 'Giulia sta leggendo il giornale.'],
          mistakes: {
            'Giulia leggi il giornale.': 'leggi is "you read". Giulia: legge.',
            'Giulia leggie il giornale.': GG_SOFT('legge'),
            'Giulia lege il giornale.': GG_DOUBLE('legge'),
            'Giulia è legge il giornale.': 'No è: "is reading" is just legge.',
          },
          why: WHY_ERE_3 + ' "Is reading" is just legge: no "is" needed.',
        },
        {
          id: 'u4-l2-e30', type: 'build', reg: 'lei', rung: 4, ruleId: 'u4-r2',
          prompt: 'Translate: "Excuse me, what time does the museum close?"', base: '(asking at the hotel reception)', en: 'Excuse me, what time does the museum close?',
          answers: [
            'Scusi, a che ora chiude il museo?', 'Mi scusi, a che ora chiude il museo?',
            'Scusi, il museo a che ora chiude?', 'Scusi, a che ora chiudono il museo?',
          ],
          mistakes: {
            'Scusi, a che ora chiuda il museo?': 'chiudere is an -ere verb, so "it" ends in -e: chiude.',
            'Scusa, a che ora chiude il museo?': 'scusa is for tu. At reception: scusi.',
            'Scusi, quando ora chiude il museo?': '"What time" is a che ora.',
          },
          why: WHY_ERE_3,
        },
        {
          id: 'u4-l2-e31', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r2',
          prompt: 'Translate: "We\'re watching a film tonight."', base: '(telling Marco your plans)', en: "We're watching a film tonight.",
          answers: [
            'Stasera vediamo un film.', 'Vediamo un film stasera.',
            'Stasera guardiamo un film.', 'Guardiamo un film stasera.',
            'Stasera noi vediamo un film.', 'Noi vediamo un film stasera.',
          ],
          mistakes: {
            'Stasera vedono un film.': 'vedono is "they see". "We see" is vediamo.',
            'Stasera vedete un film.': 'vedete is "you see" (plural). "We see" is vediamo.',
            'Stasera vedamo un film.': IAMO('vediamo'),
            'Vedamo un film stasera.': IAMO('vediamo'),
          },
          why: WHY_ERE_NOI,
        },
        {
          id: 'u4-l2-e32', type: 'build', reg: 'tu', rung: 4, ruleId: 'u4-r2',
          prompt: 'Translate: "Do you live on your own?"', base: '(to Marco)', en: 'Do you live on your own?',
          answers: ['Vivi da solo?', 'Tu vivi da solo?', 'Marco, vivi da solo?', 'Abiti da solo?'],
          mistakes: {
            'Vive da solo?': 'That is the Lei form. To Marco: vivi.',
            'Vivi da sola?': 'Marco is a man: da solo.',
            'Viva da solo?': "viva isn't the tu form. To Marco: vivi.",
          },
          why: WHY_ERE_TU + ' "On your own" is da solo (da sola for a woman).',
        },
        {
          id: 'u4-l2-e33', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r2',
          prompt: 'Translate: "I think so."', base: '(Giulia asks if the bakery is open on Sundays)', en: 'I think so.',
          answers: ['Credo di sì.', 'Penso di sì.', 'Io credo di sì.'],
          mistakes: {
            'Credo sì.': 'Italian adds di: credo di sì.',
            'Credo che sì.': 'Before sì, Italian uses di: credo di sì.',
            'Crede di sì.': 'crede is "he/she thinks". For yourself: credo.',
          },
          why: WHY_ERE_IO + ' "I think so" is credo di sì, with di.',
        },

        // Rung 5: listen & type
        {
          id: 'u4-l2-e34', type: 'listen', reg: 'lei', rung: 5, ruleId: 'u4-r2',
          prompt: 'Cosa prende, signora?', base: '', en: 'What will you have, madam?',
          answers: ['Cosa prende, signora?'],
          mistakes: {
            'Cosa prendi, signora?': 'You heard prende, the Lei form: a signora gets Lei.',
            'Cosa prenda, signora?': 'You heard prende, with -e: prendere is an -ere verb.',
          },
          why: WHY_ERE_LEI,
        },
        {
          id: 'u4-l2-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u4-r2',
          prompt: 'I nonni leggono il giornale.', base: '', en: 'The grandparents are reading the newspaper.',
          answers: ['I nonni leggono il giornale.'],
          mistakes: {
            'I nonni leggano il giornale.': 'You heard -ono: leggere is an -ere verb.',
            'I nonni leggiono il giornale.': 'You heard a hard g: before o, gg needs no i.',
            'I nonni legono il giornale.': 'You heard a long gg: leggono.',
            'I nonni legge il giornale.': 'You heard leggono: the grandparents are two people.',
          },
          why: WHY_LEGGERE,
        },
        {
          id: 'u4-l2-e36', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u4-r2',
          prompt: 'Ragazzi, cosa prendete?', base: '', en: 'Guys, what are you having?',
          answers: ['Ragazzi, cosa prendete?'],
          mistakes: {
            'Ragazzi, cosa prendate?': 'You heard -ete: prendere is an -ere verb.',
            'Ragazzi, cosa prendiamo?': 'You heard prendete, "you take". prendiamo would be "we take".',
          },
          why: WHY_ERE_VOI,
        },
        {
          id: 'u4-l2-e37', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u4-r2',
          prompt: 'Leggo il giornale ogni mattina.', base: '', en: 'I read the newspaper every morning.',
          answers: ['Leggo il giornale ogni mattina.'],
          mistakes: {
            'Leggio il giornale ogni mattina.': 'You heard a hard g: leggo. Before o, gg needs no i.',
            'Lego il giornale ogni mattina.': 'You heard a long gg: leggo, from leggere.',
            'Legge il giornale ogni mattina.': 'You heard leggo, "I read". legge would be "he/she reads".',
          },
          why: WHY_LEGGERE,
        },
      ],
    },

    // ------------------------------------------------------------ -ire
    {
      id: 'u4-l3',
      title: '-ire verbs: dormire, capire',
      rules: [
        {
          id: 'u4-r3',
          title: 'dormo · dormi · dorme · capisco · capisci · capisce',
          sentence: 'Dormo fino a tardi · Capisco tutto · Giulia preferisce il tè',
          marks: [
            { word: 'Dormo', kind: 'circle', color: 'pink' },
            { word: 'isc', kind: 'underline', color: 'ultra' },
            { word: 'isce', kind: 'underline', color: 'ultra' },
          ],
          why: '-ire verbs come in two groups. In the first (dormire, partire, aprire, sentire, offrire) the endings are those of -ere, except voi: dormo, dormi, dorme, dormiamo, dormite, dormono. The second group (capire, finire, preferire, pulire) adds -isc- between the stem and the ending for io, tu, he/she/Lei and loro: capisco, capisci, capisce, capiscono. noi and voi have no -isc-: capiamo, capite. Nothing in the infinitive tells you which group a verb is in, so learn each -ire verb together with its io form: dormire, dormo; capire, capisco.',
          table: {
            head: ['verb', 'dormire', 'capire', 'English'],
            rows: [
              ['io', 'dormo', 'capisco', 'I sleep / understand'],
              ['tu', 'dormi', 'capisci', 'you sleep / understand (informal)'],
              ['lui / lei / Lei', 'dorme', 'capisce', 'he / she sleeps, understands; you (formal)'],
              ['noi', 'dormiamo', 'capiamo', 'we sleep / understand'],
              ['voi', 'dormite', 'capite', 'you sleep / understand (two or more people)'],
              ['loro', 'dormono', 'capiscono', 'they sleep / understand'],
            ],
            highlight: [0, 1, 2, 5],
          },
          careful: 'sc changes sound with the vowel after it: "sk" before o (capisco, capiscono), "sh" before i and e (capisci, capisce). The spelling is still just -isc- plus the normal ending, so don\'t add an i or an h: capisco (not capiscio), capisce (not capiscie), capisci (not capischi). Don\'t give -isc- to noi or voi (capiamo, not capisciamo), and don\'t give it to the first group (dormo, parto, apro). Voi ends in -ite for both groups: dormite, capite.',
          howItaliansSayIt: {
            it: "Scusi, non capisco. Parlo solo un po' di italiano.",
            en: 'Sorry, I don\'t understand. I only speak a little Italian.',
            note: 'To say "not", put non right before the verb: non capisco, non dormo. Non capisco is worth knowing by heart, with scusa for a friend and scusi for everyone else.',
          },
        },
      ],
      examples: [
        { it: 'La domenica dormo fino a tardi.', en: 'On Sundays I sleep in.', reg: 'neutral' },
        { it: 'Scusi, non capisco.', en: "Sorry, I don't understand.", reg: 'lei' },
        { it: 'Giulia preferisce il tè.', en: 'Giulia prefers tea.', reg: 'neutral' },
        { it: 'Capisci quando la nonna parla in dialetto?', en: 'Do you understand when Grandma speaks dialect?', reg: 'tu' },
        { it: 'A che ora parte il treno?', en: 'What time does the train leave?', reg: 'neutral' },
        { it: 'Apro la finestra?', en: 'Shall I open the window?', reg: 'neutral' },
        { it: 'Signora, preferisce il tè o il caffè?', en: 'Madam, would you prefer tea or coffee?', reg: 'lei' },
        { it: 'Finisco tra dieci minuti.', en: "I'll finish in ten minutes.", reg: 'neutral' },
        { it: 'Il sabato puliamo la casa.', en: 'On Saturdays we clean the house.', reg: 'neutral' },
        { it: 'Ragazzi, dormite?', en: 'Guys, are you asleep?', reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u4-l3-e01', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r3',
          prompt: 'Shh, il bambino ___!', base: '"Shh, the baby\'s sleeping!"', en: "Shh, the baby's sleeping!",
          answers: ['dorme'], options: ['dorme', 'dormi', 'dormisce'],
          mistakes: {
            dormi: 'dormi is "you sleep". The baby: dorme.',
            dormisce: NO_ISC('dormire', 'dorme'),
          },
          why: WHY_IRE,
        },
        {
          id: 'u4-l3-e02', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u4-r3',
          prompt: 'Scusi, non ___.', base: '"Sorry, I don\'t understand." (to a ticket inspector)', en: "Sorry, I don't understand.",
          answers: ['capisco'], options: ['capisco', 'capo', 'capiscio'],
          mistakes: {
            capo: 'capire takes -isc- with io: capisco. (capo means "boss" or "head".)',
            capiscio: SC_NO_I('capisco'),
          },
          why: WHY_ISC,
        },
        {
          id: 'u4-l3-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r3',
          prompt: 'Giulia ___ il tè.', base: '"Giulia prefers tea."', en: 'Giulia prefers tea.',
          answers: ['preferisce'], options: ['preferisce', 'prefere', 'preferiscie'],
          mistakes: {
            prefere: 'preferire takes -isc- with he and she: preferisce.',
            preferiscie: SC_NO_I('preferisce'),
          },
          why: WHY_ISC,
        },
        {
          id: 'u4-l3-e04', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u4-r3',
          prompt: 'Amore, ___?', base: '"Love, are you asleep?"', en: 'Love, are you asleep?',
          answers: ['dormi'], options: ['dormi', 'dorme', 'dormisci'],
          mistakes: {
            dorme: 'dorme is "he/she sleeps" or Lei. To Giulia: dormi.',
            dormisci: NO_ISC('dormire', 'dormi'),
          },
          why: WHY_IRE,
        },
        {
          id: 'u4-l3-e05', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u4-r3',
          prompt: 'Signora, ___ il tè o il caffè?', base: '"Madam, would you prefer tea or coffee?" (to Giulia\'s grandmother)', en: 'Madam, would you prefer tea or coffee?',
          answers: ['preferisce'], options: ['preferisce', 'preferisci', 'preferite'],
          mistakes: {
            preferisci: 'preferisci is the tu form. A signora gets Lei: preferisce.',
            preferite: 'preferite is for two or more people. One signora: preferisce.',
          },
          why: WHY_ISC,
        },
        {
          id: 'u4-l3-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r3',
          prompt: 'A che ora ___ il treno?', base: '"What time does the train leave?"', en: 'What time does the train leave?',
          answers: ['parte'], options: ['parte', 'partisce', 'parta'],
          mistakes: {
            partisce: NO_ISC('partire', 'parte'),
            parta: 'partire is an -ire verb, so "it" ends in -e: parte.',
          },
          why: WHY_IRE,
        },
        {
          id: 'u4-l3-e07', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r3',
          prompt: 'Dopo pranzo ___ la cucina.', base: '"After lunch we clean the kitchen."', en: 'After lunch we clean the kitchen.',
          answers: ['puliamo'], options: ['puliamo', 'pulisciamo', 'puliscono'],
          mistakes: {
            pulisciamo: ISC_NOI_VOI('puliamo'),
            puliscono: 'puliscono is "they clean". "We clean" is puliamo.',
          },
          why: WHY_ISC_NOI_VOI,
        },
        {
          id: 'u4-l3-e08', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r3',
          prompt: 'Ragazzi, ___?', base: '"Guys, do you understand?"', en: 'Guys, do you understand?',
          answers: ['capite'], options: ['capite', 'capiscete', 'capiamo'],
          mistakes: {
            capiscete: 'voi has no -isc-, and -ire verbs end in -ite: capite.',
            capiamo: 'capiamo is "we understand". Asking the group: capite.',
          },
          why: WHY_ISC_NOI_VOI,
        },

        // Rung 2: fill the gap
        {
          id: 'u4-l3-e09', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r3',
          prompt: 'Che caldo! Io ___ la finestra.', base: '(aprire)', en: "It's so hot! I'll open the window.",
          answers: ['apro'],
          mistakes: {
            apre: 'apre is "he/she opens". With io: apro.',
            apri: 'apri is "you open". With io: apro.',
            aprisco: NO_ISC('aprire', 'apro'),
          },
          why: WHY_IRE,
        },
        {
          id: 'u4-l3-e10', type: 'type', reg: 'tu', rung: 2, ruleId: 'u4-r3',
          prompt: 'Amore, ___ bene qui?', base: '(dormire)', en: 'Love, do you sleep well here?',
          answers: ['dormi'],
          mistakes: {
            dorme: 'dorme is "he/she sleeps" or Lei. To Giulia: dormi.',
            dormisci: NO_ISC('dormire', 'dormi'),
          },
          why: WHY_IRE,
        },
        {
          id: 'u4-l3-e11', type: 'type', reg: 'lei', rung: 2, ruleId: 'u4-r3',
          prompt: 'Signora, ___ freddo?', base: '(sentire: "do you feel")', en: 'Madam, do you feel cold?',
          answers: ['sente', 'ha'],
          mistakes: {
            senti: 'senti is the tu form. A signora gets Lei: sente.',
            sentisce: NO_ISC('sentire', 'sente'),
          },
          why: WHY_IRE + ' Sente freddo? and Ha freddo? (Unit 3) both mean "Are you cold?".',
        },
        {
          id: 'u4-l3-e12', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r3',
          prompt: 'Il film ___ tardi.', base: '(finire)', en: 'The film finishes late.',
          answers: ['finisce'],
          mistakes: {
            fine: 'finire takes -isc- with "it": finisce. (fine is the noun "end".)',
            finiscie: SC_NO_I('finisce'),
            finische: SC_NO_H('finisce'),
            finiscono: 'finiscono is "they finish". One film: finisce.',
          },
          why: WHY_ISC + ' ' + WHY_SC,
        },
        {
          id: 'u4-l3-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r3',
          prompt: 'Noi ___ domani mattina.', base: '(partire)', en: "We're leaving tomorrow morning.",
          answers: ['partiamo'],
          mistakes: {
            partamo: IAMO('partiamo'),
            partite: 'partite is "you leave" (plural). "We leave" is partiamo.',
            partono: 'partono is "they leave". "We leave" is partiamo.',
          },
          why: 'With noi, every regular verb ends in -iamo: partiamo. The present also covers plans: domani partiamo.',
        },
        {
          id: 'u4-l3-e14', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r3',
          prompt: 'Voi ___ il vino rosso o bianco?', base: '(preferire)', en: 'Do you (two) prefer red or white wine?',
          answers: ['preferite'],
          mistakes: {
            preferiscete: ISC_NOI_VOI('preferite'),
            preferete: IRE_ITE('preferire', 'preferite'),
            preferiamo: 'preferiamo is "we prefer". Asking them: preferite.',
          },
          why: WHY_ISC_NOI_VOI,
        },
        {
          id: 'u4-l3-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r3',
          prompt: "I nonni non ___ l'inglese.", base: '(capire)', en: "The grandparents don't understand English.",
          answers: ['capiscono'],
          mistakes: {
            capiscano: ERE_ONO('capire', 'capiscono'),
            capisciono: SC_NO_I('capiscono'),
            capono: 'capire keeps -isc- with loro: capiscono.',
            capisce: 'capisce is for one person. The grandparents: capiscono.',
          },
          why: WHY_ISC,
        },
        {
          id: 'u4-l3-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r3',
          prompt: 'Marco ___ sempre il caffè.', base: '(offrire: "pays for", "treats us to")', en: 'Marco always pays for the coffee.',
          answers: ['offre'],
          mistakes: {
            offri: 'offri is "you offer". Marco: offre.',
            offrisce: NO_ISC('offrire', 'offre'),
            offra: 'offrire is an -ire verb, so "he" ends in -e: offre.',
          },
          why: WHY_IRE + ' Offrire il caffè is the Italian way to "get" a round.',
        },

        // Rung 3: transform
        {
          id: 'u4-l3-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r3',
          prompt: 'Capisco tutto.', base: 'Now say "we" (noi).', en: 'We understand everything.',
          answers: ['Capiamo tutto.', 'Noi capiamo tutto.'],
          mistakes: {
            'Capisciamo tutto.': ISC_NOI_VOI('capiamo'),
            'Noi capisciamo tutto.': ISC_NOI_VOI('capiamo'),
            'Capiscono tutto.': 'capiscono is "they understand". "We understand" is capiamo.',
          },
          why: WHY_ISC_NOI_VOI,
        },
        {
          id: 'u4-l3-e18', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r3',
          prompt: 'Giulia dorme fino a tardi.', base: 'Now say it about Giulia and Marco.', en: 'Giulia and Marco sleep late.',
          answers: ['Giulia e Marco dormono fino a tardi.', 'Marco e Giulia dormono fino a tardi.'],
          mistakes: {
            'Giulia e Marco dorme fino a tardi.': 'Two people: dormono.',
            'Marco e Giulia dorme fino a tardi.': 'Two people: dormono.',
            'Giulia e Marco dormano fino a tardi.': ERE_ONO('dormire', 'dormono'),
            'Marco e Giulia dormano fino a tardi.': ERE_ONO('dormire', 'dormono'),
            'Giulia e Marco dormiscono fino a tardi.': NO_ISC('dormire', 'dormono'),
          },
          why: WHY_IRE_LORO,
        },
        {
          id: 'u4-l3-e19', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r3',
          prompt: 'Pulisco la cucina.', base: 'Now say it about Giulia.', en: 'Giulia is cleaning the kitchen.',
          answers: ['Giulia pulisce la cucina.'],
          mistakes: {
            'Giulia pulisci la cucina.': 'pulisci is "you clean". Giulia: pulisce.',
            'Giulia pule la cucina.': 'pulire takes -isc- with "she": pulisce.',
            'Giulia pulise la cucina.': 'Keep the c of -isc-: pulisce.',
          },
          why: WHY_ISC,
        },
        {
          id: 'u4-l3-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r3',
          prompt: 'Parti domani?', base: 'You asked Giulia. Now ask Giulia and Marco together (voi).', en: 'Are you (two) leaving tomorrow?',
          answers: ['Partite domani?', 'Voi partite domani?'],
          mistakes: {
            'Partete domani?': IRE_ITE('partire', 'partite'),
            'Voi partete domani?': IRE_ITE('partire', 'partite'),
            'Partono domani?': 'partono is "they leave". Speaking to them: partite.',
            'Parti domani?': 'parti is for one person. Two people: partite.',
          },
          why: WHY_IRE_VOI,
        },
        {
          id: 'u4-l3-e21', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r3',
          prompt: "Finisco tra un'ora.", base: 'Now say "they" (loro).', en: "They'll finish in an hour.",
          answers: ["Finiscono tra un'ora.", "Loro finiscono tra un'ora.", "Finiscono fra un'ora.", "Loro finiscono fra un'ora."],
          mistakes: {
            "Finiscano tra un'ora.": ERE_ONO('finire', 'finiscono'),
            "Finisciono tra un'ora.": SC_NO_I('finiscono'),
            "Finono tra un'ora.": 'finire keeps -isc- with loro: finiscono.',
            "Finisce tra un'ora.": 'finisce is for one person. "They" is finiscono.',
            'Finiscono tra un ora.': "ora is feminine, so una shortens to un': un'ora.",
          },
          why: WHY_ISC,
        },

        // Rung 3: switch register
        {
          id: 'u4-l3-e22', type: 'register', reg: 'lei', rung: 3, ruleId: 'u4-r3',
          prompt: 'Preferisci il vino rosso o bianco?', base: "You asked Marco. Now ask Giulia's grandfather (formal).", en: 'Do you prefer red or white wine?',
          answers: ['Preferisce il vino rosso o bianco?', 'Lei preferisce il vino rosso o bianco?'],
          mistakes: {
            'Preferisci il vino rosso o bianco?': 'That is still the tu form. With Lei: preferisce.',
            'Lei preferisci il vino rosso o bianco?': 'Lei takes the "she" form: preferisce.',
            'Preferiscie il vino rosso o bianco?': SC_NO_I('preferisce'),
            'Prefere il vino rosso o bianco?': 'preferire takes -isc- with Lei: preferisce.',
          },
          why: 'tu preferisci → Lei preferisce.',
        },
        {
          id: 'u4-l3-e23', type: 'register', reg: 'tu', rung: 3, ruleId: 'u4-r3',
          prompt: 'Dorme bene, signora?', base: "You asked Giulia's grandmother. Now ask Giulia (informal).", en: 'Do you sleep well?',
          answers: ['Dormi bene, Giulia?', 'Giulia, dormi bene?', 'Dormi bene?', 'Tu dormi bene?'],
          mistakes: {
            'Dorme bene, Giulia?': 'That is the Lei form. To Giulia: dormi.',
            'Giulia, dorme bene?': 'That is the Lei form. To Giulia: dormi.',
            'Dorme bene?': 'That is the Lei form. To Giulia: dormi.',
          },
          why: 'Lei dorme → tu dormi.',
        },
        {
          id: 'u4-l3-e24', type: 'register', reg: 'lei', rung: 3, ruleId: 'u4-r3',
          prompt: 'Scusa, a che ora parti?', base: 'You asked a guy at the hostel. Now ask an older lady at the hotel breakfast (formal).', en: 'Excuse me, what time are you leaving?',
          answers: ['Scusi, a che ora parte?', 'Mi scusi, a che ora parte?', 'Scusi, Lei a che ora parte?', 'Scusi, signora, a che ora parte?'],
          mistakes: {
            'Scusi, a che ora parti?': 'scusi is right, but parti is tu. With Lei: parte.',
            'Scusa, a che ora parte?': 'parte is right, but scusa is for tu. With Lei: scusi.',
            'Scusa, a che ora parti?': 'That is still all tu. With Lei: Scusi, a che ora parte?',
          },
          why: 'tu parti → Lei parte, and scusa → scusi.',
        },
        {
          id: 'u4-l3-e25', type: 'register', reg: 'tu', rung: 3, ruleId: 'u4-r3',
          prompt: 'Sente freddo, signora?', base: "You asked Giulia's grandmother. Now ask Giulia (informal).", en: 'Are you cold?',
          answers: [
            'Senti freddo, Giulia?', 'Giulia, senti freddo?', 'Senti freddo?', 'Tu senti freddo?',
            'Hai freddo, Giulia?', 'Giulia, hai freddo?', 'Hai freddo?',
          ],
          mistakes: {
            'Sente freddo, Giulia?': 'That is the Lei form. To Giulia: senti.',
            'Giulia, sente freddo?': 'That is the Lei form. To Giulia: senti.',
            'Sente freddo?': 'That is the Lei form. To Giulia: senti.',
            'Ai freddo, Giulia?': 'ai means "to the". "You have" is hai.',
            'Giulia, ai freddo?': 'ai means "to the". "You have" is hai.',
            'Ai freddo?': 'ai means "to the". "You have" is hai.',
          },
          why: 'Lei sente → tu senti. (Hai freddo? works too.)',
        },
        {
          id: 'u4-l3-e26', type: 'register', reg: 'lei', rung: 3, ruleId: 'u4-r3',
          prompt: "Capisci l'inglese?", base: "You asked Marco. Now ask Giulia's grandfather (formal).", en: 'Do you understand English?',
          answers: ["Capisce l'inglese?", "Lei capisce l'inglese?"],
          mistakes: {
            "Capisci l'inglese?": 'That is still the tu form. With Lei: capisce.',
            "Lei capisci l'inglese?": 'Lei takes the "she" form: capisce.',
            "Capiscie l'inglese?": SC_NO_I('capisce'),
            "Lei capiscie l'inglese?": SC_NO_I('capisce'),
            "Cape l'inglese?": 'capire takes -isc- with Lei: capisce.',
          },
          why: 'tu capisci → Lei capisce.',
        },

        // Rung 4: build from English
        {
          id: 'u4-l3-e27', type: 'build', reg: 'lei', rung: 4, ruleId: 'u4-r3',
          prompt: 'Translate: "Sorry, I don\'t understand."', base: '(to a ticket inspector who speaks very fast)', en: "Sorry, I don't understand.",
          answers: ['Scusi, non capisco.', 'Mi scusi, non capisco.', 'Non capisco, scusi.', 'Scusi, io non capisco.'],
          mistakes: {
            'Scusa, non capisco.': 'scusa is for tu. To a stranger: scusi.',
            'Scusi, non capiscio.': SC_NO_I('capisco'),
            'Scusi, non capo.': 'capire takes -isc- with io: capisco.',
            'Scusi, no capisco.': 'Before a verb, "not" is non: non capisco. (no means "no".)',
            'Scusi, capisco non.': 'non goes before the verb: non capisco.',
          },
          why: WHY_ISC + ' "Not" is non, right before the verb.',
        },
        {
          id: 'u4-l3-e28', type: 'build', reg: 'tu', rung: 4, ruleId: 'u4-r3',
          prompt: 'Translate: "Do you prefer tea or coffee?"', base: '(to Giulia)', en: 'Do you prefer tea or coffee?',
          answers: ['Preferisci il tè o il caffè?', 'Preferisci tè o caffè?', 'Tu preferisci il tè o il caffè?'],
          mistakes: {
            'Preferisce il tè o il caffè?': 'That is the Lei form. To Giulia: preferisci.',
            'Preferischi il tè o il caffè?': SC_NO_H('preferisci'),
            'Preferischi tè o caffè?': SC_NO_H('preferisci'),
            'Preferi il tè o il caffè?': 'preferire takes -isc- with tu: preferisci.',
          },
          why: WHY_ISC,
        },
        {
          id: 'u4-l3-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r3',
          prompt: 'Translate: "The train is leaving!"', base: '(running onto the platform with Giulia)', en: 'The train is leaving!',
          answers: ['Il treno parte!', 'Parte il treno!', 'Il treno sta partendo!'],
          mistakes: {
            'Il treno partisce!': NO_ISC('partire', 'parte'),
            'Il treno è parte!': 'No è: "is leaving" is just parte.',
            'Il treno parta!': 'partire is an -ire verb, so "it" ends in -e: parte.',
          },
          why: WHY_IRE + ' "Is leaving" is just parte: no "is" needed.',
        },
        {
          id: 'u4-l3-e30', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r3',
          prompt: 'Translate: "We\'re cleaning the kitchen."', base: '(Marco phones and asks what you\'re up to)', en: "We're cleaning the kitchen.",
          answers: ['Puliamo la cucina.', 'Noi puliamo la cucina.', 'Stiamo pulendo la cucina.'],
          mistakes: {
            'Pulisciamo la cucina.': ISC_NOI_VOI('puliamo'),
            'Noi pulisciamo la cucina.': ISC_NOI_VOI('puliamo'),
            'Puliscono la cucina.': 'puliscono is "they clean". "We clean" is puliamo.',
          },
          why: WHY_ISC_NOI_VOI,
        },
        {
          id: 'u4-l3-e31', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r3',
          prompt: 'Translate: "Do you understand English?"', base: "(to Giulia's grandparents together)", en: 'Do you (two) understand English?',
          answers: ["Capite l'inglese?", "Voi capite l'inglese?"],
          mistakes: {
            "Capiscete l'inglese?": ISC_NOI_VOI('capite'),
            "Capiscono l'inglese?": 'capiscono is "they understand". Speaking to them: capite.',
            "Capisce l'inglese?": 'capisce is for one person. Two people, formal or not: capite.',
            "Capete l'inglese?": IRE_ITE('capire', 'capite'),
          },
          why: WHY_ISC_NOI_VOI + ' For two or more people, voi is right even with grandparents.',
        },
        {
          id: 'u4-l3-e32', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r3',
          prompt: 'Translate: "I\'ll open the window."', base: "(it's hot in the kitchen)", en: "I'll open the window.",
          answers: ['Apro la finestra.', 'Apro io la finestra.', 'Io apro la finestra.'],
          mistakes: {
            'Aprisco la finestra.': NO_ISC('aprire', 'apro'),
            'Apre la finestra.': 'apre is "he/she opens". For yourself: apro.',
            'Apri la finestra.': 'apri is "you open". For yourself: apro.',
          },
          why: WHY_IRE + ' The present also covers "I\'ll …" for something you are about to do.',
        },
        {
          id: 'u4-l3-e33', type: 'build', reg: 'tu', rung: 4, ruleId: 'u4-r3',
          prompt: 'Translate: "Are you asleep?"', base: '(whispering to Giulia at 7 a.m.)', en: 'Are you asleep?',
          answers: ['Dormi?', 'Tu dormi?', 'Stai dormendo?', 'Amore, dormi?', 'Dormi, amore?'],
          mistakes: {
            'Dorme?': 'That is the Lei form. To Giulia: dormi?',
            'Sei dormi?': 'No sei: "are you asleep?" is just dormi?',
            'Dormisci?': NO_ISC('dormire', 'dormi'),
          },
          why: WHY_IRE + ' "Are you asleep?" is simply Dormi?',
        },

        // Rung 5: listen & type
        {
          id: 'u4-l3-e34', type: 'listen', reg: 'lei', rung: 5, ruleId: 'u4-r3',
          prompt: 'Scusi, non capisco.', base: '', en: "Sorry, I don't understand.",
          answers: ['Scusi, non capisco.'],
          mistakes: {
            'Scusi, non capiscio.': 'You heard "sk": capisco, with no i.',
            'Scusa, non capisco.': 'You heard scusi, the Lei form.',
          },
          why: WHY_SC,
        },
        {
          id: 'u4-l3-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u4-r3',
          prompt: 'Giulia preferisce il tè.', base: '', en: 'Giulia prefers tea.',
          answers: ['Giulia preferisce il tè.'],
          mistakes: {
            'Giulia preferiscie il tè.': 'You heard "sh": sce already sounds "sheh", no i.',
            'Giulia preferisci il tè.': 'You heard preferisce, ending in -e: Giulia.',
          },
          why: WHY_SC,
        },
        {
          id: 'u4-l3-e36', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u4-r3',
          prompt: 'I nonni capiscono il dialetto.', base: '', en: 'The grandparents understand the dialect.',
          answers: ['I nonni capiscono il dialetto.'],
          mistakes: {
            'I nonni capisciono il dialetto.': 'You heard "sk": capiscono, with no i.',
            'I nonni capiscano il dialetto.': 'You heard -ono: capire takes -ono for loro.',
          },
          why: WHY_SC,
        },
        {
          id: 'u4-l3-e37', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u4-r3',
          prompt: 'Ragazzi, dormite?', base: '', en: 'Guys, are you asleep?',
          answers: ['Ragazzi, dormite?'],
          mistakes: {
            'Ragazzi, dormete?': 'You heard -ite: dormire is an -ire verb.',
            'Ragazzi, dormiamo?': 'You heard dormite, "you sleep". dormiamo would be "we sleep".',
          },
          why: WHY_IRE_VOI,
        },
      ],
    },

    // ------------------------------------------------------------ spelling verbs & subject drop
    {
      id: 'u4-l4',
      title: 'Spelling verbs, and dropping io',
      rules: [
        {
          id: 'u4-r4',
          title: 'cerchi · paghi · mangi · Pago io!',
          sentence: 'Cosa cerchi? · Pago io! · Mangi con noi?',
          marks: [
            { word: 'cerchi', kind: 'circle', color: 'pink' },
            { word: 'io', kind: 'underline', color: 'ultra' },
            { word: 'Mangi', kind: 'circle', color: 'pink' },
          ],
          why: 'A few -are verbs change their spelling to keep their sound. Verbs in -care and -gare have a hard c or g ("k", and g as in "go"), so they add h before an ending that starts with i: cerco, cerchi, cerchiamo; pago, paghi, paghiamo. Most verbs in -ciare and -giare (mangiare, cominciare) have an i only to make c or g soft, and that i isn\'t repeated before an ending that starts with i: mangio, mangi, mangiamo; comincio, cominci, cominciamo. And since the ending already says who, Italians leave out io, tu and noi unless they want to stress or contrast the person: Pago io! = I\'ll pay (me, not you).',
          table: {
            head: ['verb', 'cercare (look for)', 'pagare (pay)', 'mangiare (eat)'],
            rows: [
              ['io', 'cerco', 'pago', 'mangio'],
              ['tu', 'cerchi', 'paghi', 'mangi'],
              ['lui / lei / Lei', 'cerca', 'paga', 'mangia'],
              ['noi', 'cerchiamo', 'paghiamo', 'mangiamo'],
              ['voi', 'cercate', 'pagate', 'mangiate'],
              ['loro', 'cercano', 'pagano', 'mangiano'],
            ],
            highlight: [1, 3],
          },
          careful: 'In the present, only tu and noi change, because only their endings start with i. Everywhere else the spelling is regular: cerco, cerca, cercate, cercano (no h before o or a). Most other -iare verbs work like mangiare: studio, studi; cambio, cambi. A few stress that i in the io form, so it is a full vowel: invio (in-VEE-o, I send), scio (SHEE-o, I ski). These keep both i\'s with tu: invii, scii. As for pronouns, Io mangio alle otto is not wrong, but it sounds like "I (unlike you) eat at eight". Keep the pronoun only to contrast or stress: Io lavoro e tu dormi!',
          howItaliansSayIt: {
            it: 'Domani parto presto, ma stasera pago io!',
            en: "I'm leaving early tomorrow, but tonight I'm paying!",
            note: 'Italians use the present for plans, where English says "I\'m leaving" or "I\'ll …": a time word such as domani, stasera or sabato does the work. And io after the verb (pago io) puts the stress on the person.',
          },
        },
      ],
      examples: [
        { it: 'Cosa cerchi?', en: 'What are you looking for?', reg: 'tu' },
        { it: 'Scusi, cerchiamo la stazione.', en: "Excuse me, we're looking for the station.", reg: 'lei' },
        { it: 'Pago io!', en: "I'll pay!", reg: 'neutral' },
        { it: 'Paga con la carta o in contanti?', en: 'Are you paying by card or cash?', reg: 'lei' },
        { it: 'Marco, mangi con noi stasera?', en: 'Marco, are you eating with us tonight?', reg: 'tu' },
        { it: 'Signora, mangia con noi?', en: 'Will you eat with us, madam?', reg: 'lei' },
        { it: 'A che ora cominciamo?', en: 'What time do we start?', reg: 'neutral' },
        { it: 'Studi o lavori?', en: 'Do you study or work?', reg: 'tu' },
        { it: 'Io lavoro e tu dormi!', en: "I'm working and you're sleeping!", reg: 'tu' },
        { it: 'Domani parto presto.', en: "I'm leaving early tomorrow.", reg: 'neutral' },
      ],
      exercises: [
        // Rung 1: recognise
        {
          id: 'u4-l4-e01', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u4-r4',
          prompt: 'Amore, cosa ___?', base: '"Love, what are you looking for?"', en: 'Love, what are you looking for?',
          answers: ['cerchi'], options: ['cerchi', 'cerci', 'cerca'],
          mistakes: {
            cerci: CH('cerchi'),
            cerca: 'cerca is "he/she looks for" or Lei. To Giulia: cerchi.',
          },
          why: WHY_CH,
        },
        {
          id: 'u4-l4-e02', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r4',
          prompt: '___ io!', base: '"I\'ll pay!" (at the bar, reaching for your wallet)', en: "I'll pay!",
          answers: ['Pago'], options: ['Pago', 'Paghi', 'Paga'],
          mistakes: {
            Paghi: 'paghi is "you pay". "I pay" is pago.',
            Paga: 'paga is "he/she pays" or Lei. "I pay" is pago.',
          },
          why: WHY_STRESS,
        },
        {
          id: 'u4-l4-e03', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r4',
          prompt: 'Noi ___ la stazione.', base: '"We\'re looking for the station."', en: "We're looking for the station.",
          answers: ['cerchiamo'], options: ['cerchiamo', 'cerciamo', 'cercate'],
          mistakes: {
            cerciamo: CH('cerchiamo'),
            cercate: 'cercate is "you look for" (plural). "We look for" is cerchiamo.',
          },
          why: WHY_CH,
        },
        {
          id: 'u4-l4-e04', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u4-r4',
          prompt: 'Marco, ___ con noi stasera?', base: '"Marco, are you eating with us tonight?"', en: 'Marco, are you eating with us tonight?',
          answers: ['mangi'], options: ['mangi', 'mangii', 'mangia'],
          mistakes: {
            mangii: ONE_I('mangi'),
            mangia: 'mangia is "he/she eats" or Lei. To Marco: mangi.',
          },
          why: WHY_CIA,
        },
        {
          id: 'u4-l4-e05', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u4-r4',
          prompt: 'Signora, ___ con noi?', base: '"Will you eat with us, madam?" (to Giulia\'s grandmother)', en: 'Will you eat with us, madam?',
          answers: ['mangia'], options: ['mangia', 'mangi'],
          mistakes: { mangi: 'mangi is the tu form. A signora gets Lei: mangia.' },
          why: 'Lei takes the "she" form: mangia. ' + WHY_CIA,
        },
        {
          id: 'u4-l4-e06', type: 'recognise', reg: 'neutral', rung: 1, ruleId: 'u4-r4',
          prompt: 'A che ora ___?', base: '"What time do we start?"', en: 'What time do we start?',
          answers: ['cominciamo'], options: ['cominciamo', 'cominciiamo', 'cominciate'],
          mistakes: {
            cominciiamo: ONE_I('cominciamo'),
            cominciate: 'cominciate is "you start" (plural). "We start" is cominciamo.',
          },
          why: WHY_CIA,
        },
        {
          id: 'u4-l4-e07', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u4-r4',
          prompt: '___ o lavori?', base: '"Do you study or work?" (to a guy your age at a party)', en: 'Do you study or work?',
          answers: ['Studi'], options: ['Studi', 'Studii', 'Studia'],
          mistakes: {
            Studii: ONE_I('studi'),
            Studia: 'studia is "he/she studies" or Lei. With lavori (tu): studi.',
          },
          why: WHY_STUDI,
        },
        {
          id: 'u4-l4-e08', type: 'recognise', reg: 'lei', rung: 1, ruleId: 'u4-r4',
          prompt: 'Signora, ___ con la carta o in contanti?', base: '"Madam, are you paying by card or cash?" (the cashier to a customer)', en: 'Madam, are you paying by card or cash?',
          answers: ['paga'], options: ['paga', 'paghi', 'pago'],
          mistakes: {
            paghi: 'paghi is the tu form. A signora gets Lei: paga.',
            pago: 'pago is "I pay". Asking her: paga.',
          },
          why: 'Lei takes the "she" form: paga. Before a, the g of pagare is hard without any h.',
        },

        // Rung 2: fill the gap
        {
          id: 'u4-l4-e09', type: 'type', reg: 'tu', rung: 2, ruleId: 'u4-r4',
          prompt: 'Scusa, ___ qualcosa?', base: '(cercare: to a friend rummaging in your bag)', en: 'Sorry, are you looking for something?',
          answers: ['cerchi'],
          mistakes: {
            cerci: CH('cerchi'),
            cerca: 'cerca is "he/she looks for" or Lei. With scusa (tu): cerchi.',
          },
          why: WHY_CH,
        },
        {
          id: 'u4-l4-e10', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r4',
          prompt: 'Oggi ___ noi!', base: '(pagare: "we\'re paying today")', en: "We're paying today!",
          answers: ['paghiamo'],
          mistakes: {
            pagiamo: GH('paghiamo'),
            paghamo: IAMO('paghiamo'),
            pagate: 'pagate is "you pay" (plural). "We pay" is paghiamo.',
          },
          why: WHY_GH + ' noi after the verb stresses it: "WE are paying".',
        },
        {
          id: 'u4-l4-e11', type: 'type', reg: 'tu', rung: 2, ruleId: 'u4-r4',
          prompt: 'Tu ___ la carne?', base: '(mangiare)', en: 'Do you eat meat?',
          answers: ['mangi'],
          mistakes: {
            mangii: ONE_I('mangi'),
            mangia: 'mangia is "he/she eats" or Lei. With tu: mangi.',
          },
          why: WHY_CIA,
        },
        {
          id: 'u4-l4-e12', type: 'type', reg: 'lei', rung: 2, ruleId: 'u4-r4',
          prompt: 'Signora, ___ qualcosa?', base: '(cercare)', en: 'Madam, are you looking for something?',
          answers: ['cerca'],
          mistakes: {
            cerchi: 'cerchi is the tu form. A signora gets Lei: cerca.',
            cercha: H_ONLY_I('cerca'),
          },
          why: 'Lei takes the "she" form: cerca. Before a, the c of cercare is hard without any h.',
        },
        {
          id: 'u4-l4-e13', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r4',
          prompt: 'Noi ___ domani.', base: '(cominciare)', en: 'We start tomorrow.',
          answers: ['cominciamo'],
          mistakes: {
            cominciiamo: ONE_I('cominciamo'),
            cominciate: 'cominciate is "you start" (plural). "We start" is cominciamo.',
          },
          why: WHY_CIA,
        },
        {
          id: 'u4-l4-e14', type: 'type', reg: 'tu', rung: 2, ruleId: 'u4-r4',
          prompt: 'Marco, tu ___ sempre!', base: '(pagare)', en: 'Marco, you always pay!',
          answers: ['paghi'],
          mistakes: {
            pagi: GH('paghi'),
            paga: 'paga is "he/she pays" or Lei. With tu: paghi.',
          },
          why: WHY_GH,
        },
        {
          id: 'u4-l4-e15', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r4',
          prompt: 'Sara ___ medicina a Bologna.', base: '(studiare)', en: 'Sara studies medicine in Bologna.',
          answers: ['studia'],
          mistakes: {
            studi: 'studi is "you study". Sara: studia.',
          },
          why: WHY_STUDI,
        },
        {
          id: 'u4-l4-e16', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r4',
          prompt: 'Ragazzi, cosa ___?', base: '(cercare)', en: 'Guys, what are you looking for?',
          answers: ['cercate'],
          mistakes: {
            cerchate: H_ONLY_I('cercate'),
            cerchiate: 'Only tu and noi add the h: cercate.',
            cerchiamo: 'cerchiamo is "we look for". Asking the group: cercate.',
          },
          why: WHY_CH + ' voi is regular: cercate.',
        },

        // Rung 3: transform
        {
          id: 'u4-l4-e17', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r4',
          prompt: 'Cerco un bancomat.', base: 'Now say "we" (noi).', en: "We're looking for a cash machine.",
          answers: ['Cerchiamo un bancomat.', 'Noi cerchiamo un bancomat.'],
          mistakes: {
            'Cerciamo un bancomat.': CH('cerchiamo'),
            'Noi cerciamo un bancomat.': CH('cerchiamo'),
            'Cerchamo un bancomat.': IAMO('cerchiamo'),
            'Cercate un bancomat.': 'cercate is "you look for" (plural). "We look for" is cerchiamo.',
          },
          why: WHY_CH,
        },
        {
          id: 'u4-l4-e18', type: 'transform', reg: 'tu', rung: 3, ruleId: 'u4-r4',
          prompt: 'Pago io.', base: 'Now ask Marco: "Are YOU paying?"', en: 'Are you paying?',
          answers: ['Paghi tu?', 'Marco, paghi tu?', 'Paghi tu, Marco?', 'Tu paghi?', 'Paghi?', 'Marco, paghi?', 'Paghi, Marco?'],
          mistakes: {
            'Pagi tu?': GH('paghi'),
            'Marco, pagi tu?': GH('paghi'),
            'Pagi tu, Marco?': GH('paghi'),
            'Paga tu?': 'paga is "he/she pays" or Lei. With tu: paghi.',
          },
          why: WHY_GH + ' Paghi? alone is correct; tu after the verb adds the stress ("are YOU paying?"), like io in Pago io.',
        },
        {
          id: 'u4-l4-e19', type: 'transform', reg: 'tu', rung: 3, ruleId: 'u4-r4',
          prompt: 'Mangio a casa.', base: 'Now ask Giulia if she is eating at home (tu).', en: 'Are you eating at home?',
          answers: ['Mangi a casa?', 'Giulia, mangi a casa?', 'Mangi a casa, Giulia?', 'Tu mangi a casa?'],
          mistakes: {
            'Mangii a casa?': ONE_I('mangi'),
            'Giulia, mangii a casa?': ONE_I('mangi'),
            'Mangia a casa?': 'mangia is "he/she eats" or Lei. To Giulia: mangi.',
            'Giulia, mangia a casa?': 'mangia is "he/she eats" or Lei. To Giulia: mangi.',
          },
          why: WHY_CIA,
        },
        {
          id: 'u4-l4-e20', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r4',
          prompt: 'Pago con la carta.', base: 'Now say "we" (noi).', en: "We're paying by card.",
          answers: ['Paghiamo con la carta.', 'Noi paghiamo con la carta.'],
          mistakes: {
            'Pagate con la carta.': 'pagate is "you pay" (plural). "We pay" is paghiamo.',
            'Pagano con la carta.': 'pagano is "they pay". "We pay" is paghiamo.',
          },
          why: WHY_GH + ' noi is optional: the -iamo ending already says "we", so Italians usually leave it out.',
        },
        {
          id: 'u4-l4-e21', type: 'transform', reg: 'tu', rung: 3, ruleId: 'u4-r4',
          prompt: 'Lavoro. Dormi.', base: 'Giulia is still in bed. Join the two with e to complain: "I\'M working and YOU\'RE sleeping!"', en: "I'm working and you're sleeping!",
          answers: ['Io lavoro e tu dormi!', 'Io lavoro, tu dormi!', 'Lavoro e tu dormi!', 'Io lavoro e dormi!', 'Lavoro e dormi!'],
          mistakes: {
            'Io lavoro e tu dorme!': 'dorme is "he/she sleeps". With tu: dormi.',
            'Io lavoro e tu dormo!': 'dormo is "I sleep". With tu: dormi.',
          },
          why: WHY_DROP + ' Here the contrast is the point, so Italians would say both pronouns: Io lavoro e tu dormi! Without them the sentence is still correct, just flatter.',
        },
        {
          id: 'u4-l4-e22', type: 'transform', reg: 'tu', rung: 3, ruleId: 'u4-r4',
          prompt: "Studio l'italiano.", base: "Now ask Sara if she studies English (l'inglese).", en: 'Do you study English?',
          answers: ["Studi l'inglese?", "Tu studi l'inglese?", "Sara, studi l'inglese?", "Studi l'inglese, Sara?"],
          mistakes: {
            "Studii l'inglese?": ONE_I('studi'),
            "Sara, studii l'inglese?": ONE_I('studi'),
            "Studia l'inglese?": 'studia is "he/she studies" or Lei. To Sara: studi.',
            "Sara, studia l'inglese?": 'studia is "he/she studies" or Lei. To Sara: studi.',
          },
          why: WHY_STUDI,
        },

        // Rung 3: switch register
        {
          id: 'u4-l4-e23', type: 'register', reg: 'lei', rung: 3, ruleId: 'u4-r4',
          prompt: 'Cosa cerchi?', base: 'You asked Giulia. Now ask an older lady who looks lost (formal).', en: 'What are you looking for?',
          answers: ['Cosa cerca?', 'Che cosa cerca?', 'Lei cosa cerca?', 'Signora, cosa cerca?', 'Scusi, cosa cerca?', 'Cosa cerca, signora?'],
          mistakes: {
            'Cosa cerchi?': 'That is still the tu form. With Lei: cerca.',
            'Signora, cosa cerchi?': 'With signora you use Lei: cerca.',
            'Cosa cerchi, signora?': 'With signora you use Lei: cerca.',
            'Cosa cercha?': H_ONLY_I('cerca'),
            'Signora, cosa cercha?': H_ONLY_I('cerca'),
          },
          why: 'tu cerchi → Lei cerca, and the h goes: it is only needed before i.',
        },
        {
          id: 'u4-l4-e24', type: 'register', reg: 'lei', rung: 3, ruleId: 'u4-r4',
          prompt: 'Mangi con noi?', base: "You asked Luca. Now ask Giulia's grandmother (formal).", en: 'Will you eat with us?',
          answers: ['Mangia con noi?', 'Lei mangia con noi?', 'Signora, mangia con noi?', 'Mangia con noi, signora?'],
          mistakes: {
            'Mangi con noi?': 'That is still the tu form. With Lei: mangia.',
            'Lei mangi con noi?': 'Lei takes the "she" form: mangia.',
            'Signora, mangi con noi?': 'With signora you use Lei: mangia.',
          },
          why: 'tu mangi → Lei mangia.',
        },
        {
          id: 'u4-l4-e25', type: 'register', reg: 'tu', rung: 3, ruleId: 'u4-r4',
          prompt: 'Paga con la carta?', base: 'The cashier asked a customer. Now ask Giulia (informal).', en: 'Are you paying by card?',
          answers: ['Paghi con la carta?', 'Tu paghi con la carta?', 'Giulia, paghi con la carta?', 'Paghi con la carta, Giulia?'],
          mistakes: {
            'Pagi con la carta?': GH('paghi'),
            'Tu pagi con la carta?': GH('paghi'),
            'Giulia, pagi con la carta?': GH('paghi'),
            'Paga con la carta?': 'That is the Lei form. To Giulia: paghi.',
            'Giulia, paga con la carta?': 'That is the Lei form. To Giulia: paghi.',
          },
          why: 'Lei paga → tu paghi: the tu ending starts with i, so pagare adds an h.',
        },
        {
          id: 'u4-l4-e26', type: 'register', reg: 'lei', rung: 3, ruleId: 'u4-r4',
          prompt: 'Studi o lavori?', base: 'You asked a guy at a party. Now ask a stranger on the train (formal).', en: 'Do you study or work?',
          answers: ['Studia o lavora?', 'Lei studia o lavora?', 'Scusi, studia o lavora?'],
          mistakes: {
            'Studi o lavori?': 'That is still the tu form. With Lei: studia o lavora?',
            'Studia o lavori?': 'Both verbs switch to Lei: studia o lavora?',
            'Studi o lavora?': 'Both verbs switch to Lei: studia o lavora?',
            'Lei studi o lavori?': 'Lei takes the "she" form: studia o lavora?',
          },
          why: 'tu studi → Lei studia, tu lavori → Lei lavora.',
        },

        // Rung 4: build from English
        {
          id: 'u4-l4-e27', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r4',
          prompt: 'Translate: "I\'ll pay!"', base: '(at the bar with Marco, reaching for your wallet)', en: "I'll pay!",
          answers: ['Pago io!', 'No, pago io!', 'Offro io!', 'Io pago!', 'Pago!'],
          mistakes: {
            'Paga io!': 'paga is "he/she pays". With io: pago.',
          },
          why: WHY_STRESS + ' Io pago! and Pago! are correct too, but reaching for the bill, Italians say Pago io! (or No, pago io!).',
        },
        {
          id: 'u4-l4-e28', type: 'build', reg: 'lei', rung: 4, ruleId: 'u4-r4',
          prompt: 'Translate: "Excuse me, we\'re looking for the station."', base: '(to a passer-by)', en: "Excuse me, we're looking for the station.",
          answers: ['Scusi, cerchiamo la stazione.', 'Mi scusi, cerchiamo la stazione.', 'Scusi, noi cerchiamo la stazione.'],
          mistakes: {
            'Scusi, cerciamo la stazione.': CH('cerchiamo'),
            'Mi scusi, cerciamo la stazione.': CH('cerchiamo'),
            'Scusi, cerchiamo per la stazione.': 'cercare already means "look for": no per.',
            'Scusa, cerchiamo la stazione.': 'scusa is for tu. To a passer-by: scusi.',
          },
          why: WHY_CH + ' cercare already includes "for".',
        },
        {
          id: 'u4-l4-e29', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r4',
          prompt: 'Translate: "What time do we start?"', base: '(to Giulia, before a cooking class)', en: 'What time do we start?',
          answers: ['A che ora cominciamo?', 'A che ora iniziamo?'],
          mistakes: {
            'A che ora cominciiamo?': ONE_I('cominciamo'),
            'A che ora cominciate?': 'cominciate is "you start" (plural). "We start" is cominciamo.',
          },
          why: WHY_CIA,
        },
        {
          id: 'u4-l4-e30', type: 'build', reg: 'lei', rung: 4, ruleId: 'u4-r4',
          prompt: 'Translate: "Will you eat with us?"', base: "(to Giulia's grandmother)", en: 'Will you eat with us?',
          answers: ['Mangia con noi?', 'Lei mangia con noi?', 'Signora, mangia con noi?', 'Mangia con noi, signora?'],
          mistakes: {
            'Mangi con noi?': "Giulia's grandmother gets Lei: mangia.",
            'Mangii con noi?': ONE_I('mangi') + ' But with Lei it is mangia.',
            'Signora, mangi con noi?': 'With signora you use Lei: mangia.',
          },
          why: 'Lei takes the "she" form: mangia. The present also works as an invitation.',
        },
        {
          id: 'u4-l4-e31', type: 'build', reg: 'tu', rung: 4, ruleId: 'u4-r4',
          prompt: 'Translate: "Do you study or work?"', base: "(to Sara's cousin, at a party)", en: 'Do you study or work?',
          answers: ['Studi o lavori?', 'Tu studi o lavori?'],
          mistakes: {
            'Studii o lavori?': ONE_I('studi'),
            'Tu studii o lavori?': ONE_I('studi'),
            'Studia o lavora?': 'That is the Lei form. At a party, people your age get tu: studi o lavori?',
          },
          why: WHY_STUDI,
        },
        {
          id: 'u4-l4-e32', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r4',
          prompt: 'Translate: "I\'m leaving tomorrow."', base: "(telling Giulia's grandmother your plans)", en: "I'm leaving tomorrow.",
          answers: ['Domani parto.', 'Parto domani.', 'Io parto domani.', 'Domani io parto.', 'Partirò domani.', 'Domani partirò.'],
          mistakes: {
            'Domani parte.': 'parte is "he/she leaves". "I leave" is parto.',
            'Parte domani.': 'parte is "he/she leaves". "I leave" is parto.',
            'Sono partendo domani.': 'Italian has no "am leaving" with essere: just parto.',
          },
          why: WHY_PLAN,
        },
        {
          id: 'u4-l4-e33', type: 'build', reg: 'lei', rung: 4, ruleId: 'u4-r4',
          prompt: 'Translate: "Are you looking for something, madam?"', base: '(to an older lady peering at a map)', en: 'Are you looking for something, madam?',
          answers: ['Cerca qualcosa, signora?', 'Signora, cerca qualcosa?', 'Scusi, signora, cerca qualcosa?'],
          mistakes: {
            'Cerchi qualcosa, signora?': 'cerchi is tu. A signora gets Lei: cerca.',
            'Signora, cerchi qualcosa?': 'cerchi is tu. A signora gets Lei: cerca.',
            'Cercha qualcosa, signora?': H_ONLY_I('cerca'),
            'Signora, cercha qualcosa?': H_ONLY_I('cerca'),
          },
          why: 'Lei takes the "she" form: cerca, with no h before a.',
        },

        // Rung 5: listen & type
        {
          id: 'u4-l4-e34', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u4-r4',
          prompt: 'Cosa cerchi?', base: '', en: 'What are you looking for?',
          answers: ['Cosa cerchi?'],
          mistakes: {
            'Cosa cerci?': 'You heard a hard "k": cerchi, with an h.',
            'Cosa cerca?': 'You heard cerchi, the tu form. cerca would be Lei.',
          },
          why: WHY_CH,
        },
        {
          id: 'u4-l4-e35', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u4-r4',
          prompt: 'Paghiamo noi!', base: '', en: "We'll pay!",
          answers: ['Paghiamo noi!'],
          mistakes: {
            'Pagiamo noi!': 'You heard a hard g, as in "go": paghiamo, with an h.',
            'Pagate voi!': 'You heard paghiamo noi, "we\'ll pay".',
          },
          why: WHY_GH,
        },
        {
          id: 'u4-l4-e36', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u4-r4',
          prompt: 'Marco, mangi con noi?', base: '', en: 'Marco, are you eating with us?',
          answers: ['Marco, mangi con noi?'],
          mistakes: {
            'Marco, mangii con noi?': 'One i: mangi. The stem already ends in i.',
            'Marco, mangia con noi?': 'You heard mangi, the tu form.',
          },
          why: WHY_CIA,
        },
        {
          id: 'u4-l4-e37', type: 'listen', reg: 'neutral', rung: 5, ruleId: 'u4-r4',
          prompt: 'Domani parto presto.', base: '', en: "I'm leaving early tomorrow.",
          answers: ['Domani parto presto.'],
          mistakes: {
            'Domani parte presto.': 'You heard parto, "I leave". parte would be "he/she leaves".',
          },
          why: WHY_PLAN,
        },
      ],
    },
  ],
  scene: {
    title: 'A Sunday morning at home',
    setting: "Sunday morning in Giulia's flat in Bologna. You and Giulia make breakfast and plan the day. Then her grandmother phones. Giulia's parents are on tu terms with you now. The grandmother uses tu with you, as older people often do with someone young, but you still use Lei with her until she invites you to switch.",
    lines: [
      { speaker: 'Giulia', it: 'Buongiorno! Dormi ancora?', en: 'Morning! Are you still asleep?', reg: 'tu' },
      { speaker: 'You', it: 'Sì! La domenica dormo fino a tardi.', en: 'Yes! On Sundays I sleep in.', reg: 'neutral' },
      { speaker: 'Giulia', it: 'Io preparo la colazione. Prendi un caffè o preferisci un tè?', en: "I'll make breakfast. Will you have a coffee, or would you rather have tea?", reg: 'tu' },
      { speaker: 'You', it: 'Un caffè, grazie! Intanto leggo il giornale.', en: "A coffee, thanks! I'll read the paper in the meantime.", reg: 'neutral' },
      { speaker: 'Giulia', it: 'E dopo puliamo la cucina, va bene?', en: 'And afterwards we clean the kitchen, OK?', reg: 'neutral' },
      { speaker: 'You', it: 'Va bene. Io lavo i piatti e tu pulisci il tavolo.', en: "OK. I'll wash the dishes and you clean the table.", reg: 'tu' },
      { speaker: 'Giulia', it: 'Oh, il telefono! È la nonna. Rispondi tu? Ho le mani bagnate.', en: "Oh, the phone! It's Grandma. Can you get it? My hands are wet.", reg: 'tu' },
      { speaker: 'You', it: 'Pronto? Buongiorno, signora! Come sta?', en: 'Hello? Good morning! How are you?', reg: 'lei' },
      { speaker: 'Nonna', it: "Bene, grazie! Ma parli già bene l'italiano!", en: 'Fine, thank you! But you already speak good Italian!', reg: 'tu' },
      { speaker: 'You', it: 'Grazie! Ma quando parlate in dialetto, non capisco niente.', en: "Thank you! But when you all speak dialect, I don't understand a thing.", reg: 'neutral' },
      { speaker: 'Nonna', it: 'Piano piano! Allora, oggi pranzate da me? Preparo le tagliatelle.', en: "Little by little! So, are you two having lunch at mine today? I'm making tagliatelle.", reg: 'neutral' },
      { speaker: 'You', it: 'Volentieri, grazie! Portiamo noi il dolce.', en: "We'd love to, thank you! We'll bring dessert.", reg: 'neutral' },
      { speaker: 'Nonna', it: "Benissimo. Allora vi aspetto all'una!", en: "Lovely. I'll expect you at one, then!", reg: 'neutral' },
    ],
    exercises: [
      {
        id: 'u4-s-e01', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u4-r3',
        prompt: 'Prendi un caffè o ___ un tè?', base: '"Will you have a coffee, or would you rather have tea?"', en: 'Will you have a coffee, or would you rather have tea?',
        answers: ['preferisci'], options: ['preferisci', 'preferisce', 'preferi'],
        mistakes: {
          preferisce: 'preferisce is "he/she prefers" or Lei. Giulia is asking you: preferisci.',
          preferi: 'preferire takes -isc- with tu: preferisci.',
        },
        why: WHY_ISC,
      },
      {
        id: 'u4-s-e02', type: 'recognise', reg: 'tu', rung: 1, ruleId: 'u4-r1',
        prompt: "Ma ___ già bene l'italiano!", base: '"But you already speak good Italian!" (the grandmother to you)', en: 'But you already speak good Italian!',
        answers: ['parli'], options: ['parli', 'parla', 'parlo'],
        mistakes: {
          parla: 'parla is the Lei form. The grandmother uses tu with you: parli.',
          parlo: 'parlo is "I speak". She is talking to you: parli.',
        },
        why: WHY_ARE_TU + ' Older people often use tu with someone young, who still answers with Lei (Come sta?) until invited to switch.',
      },
      {
        id: 'u4-s-e03', type: 'type', reg: 'neutral', rung: 2, ruleId: 'u4-r2',
        prompt: 'Un caffè, grazie! Intanto ___ il giornale.', base: '(leggere: I)', en: "A coffee, thanks! I'll read the paper in the meantime.",
        answers: ['leggo'],
        mistakes: {
          legge: 'legge is "he/she reads". For yourself: leggo.',
          leggi: 'leggi is "you read". For yourself: leggo.',
          leggio: GG_HARD('leggo') + ' (un leggio is a music stand.)',
          lego: GG_DOUBLE('leggo'),
        },
        why: WHY_ERE_IO + ' ' + WHY_LEGGERE,
      },
      {
        id: 'u4-s-e04', type: 'type', reg: 'tu', rung: 2, ruleId: 'u4-r3',
        prompt: 'Io lavo i piatti e tu ___ il tavolo.', base: '(pulire)', en: "I'll wash the dishes and you clean the table.",
        answers: ['pulisci'],
        mistakes: {
          pulischi: SC_NO_H('pulisci'),
          pulisce: 'pulisce is "he/she cleans" or Lei. With tu: pulisci.',
          puli: 'pulire takes -isc- with tu: pulisci.',
        },
        why: WHY_ISC + ' ' + WHY_SC,
      },
      {
        id: 'u4-s-e05', type: 'register', reg: 'lei', rung: 3, ruleId: 'u4-r2',
        prompt: 'Prendi un caffè o preferisci un tè?', base: 'Giulia asked you. Now ask her grandmother when she visits (formal).', en: 'Will you have a coffee, or would you rather have tea?',
        answers: [
          'Prende un caffè o preferisce un tè?', 'Lei prende un caffè o preferisce un tè?',
          'Signora, prende un caffè o preferisce un tè?',
        ],
        mistakes: {
          'Prendi un caffè o preferisci un tè?': 'That is still the tu form. With Lei: prende … preferisce.',
          'Prende un caffè o preferisci un tè?': 'Both verbs switch to Lei: prende … preferisce.',
          'Prendi un caffè o preferisce un tè?': 'Both verbs switch to Lei: prende … preferisce.',
          'Prende un caffè o preferiscie un tè?': SC_NO_I('preferisce'),
          'Prenda un caffè o preferisce un tè?': 'prendere is an -ere verb, so the Lei form ends in -e: prende.',
        },
        why: 'tu prendi → Lei prende, tu preferisci → Lei preferisce.',
      },
      {
        id: 'u4-s-e06', type: 'transform', reg: 'neutral', rung: 3, ruleId: 'u4-r3',
        prompt: 'Io lavo i piatti e tu pulisci il tavolo.', base: 'Now say that "we" do both (noi).', en: 'We wash the dishes and clean the table.',
        answers: ['Laviamo i piatti e puliamo il tavolo.', 'Noi laviamo i piatti e puliamo il tavolo.'],
        mistakes: {
          'Laviamo i piatti e pulisciamo il tavolo.': ISC_NOI_VOI('puliamo'),
          'Lavamo i piatti e puliamo il tavolo.': IAMO('laviamo'),
          'Laviamo i piatti e puliscono il tavolo.': 'puliscono is "they clean". "We clean" is puliamo.',
          'Laviamo i piatti e pulite il tavolo.': 'pulite is "you clean" (plural). "We clean" is puliamo.',
        },
        why: WHY_ISC_NOI_VOI + ' Both verbs take -iamo.',
      },
      {
        id: 'u4-s-e07', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r4',
        prompt: 'Translate: "We\'ll bring dessert."', base: "(accepting the grandmother's lunch invitation)", en: "We'll bring dessert.",
        answers: ['Portiamo noi il dolce.', 'Portiamo il dolce.', 'Noi portiamo il dolce.', 'Il dolce lo portiamo noi.'],
        mistakes: {
          'Portate il dolce.': 'portate is "you bring" (plural). "We bring" is portiamo.',
          'Portamo noi il dolce.': IAMO('portiamo'),
          'Portamo il dolce.': IAMO('portiamo'),
          'Portiamo noi la dolce.': 'dolce, "dessert", is masculine: il dolce.',
        },
        why: WHY_PLAN + ' noi after the verb stresses it: "WE\'ll bring it".',
      },
      {
        id: 'u4-s-e08', type: 'build', reg: 'neutral', rung: 4, ruleId: 'u4-r3',
        prompt: 'Translate: "I don\'t understand the dialect."', base: "(telling Giulia's grandmother)", en: "I don't understand the dialect.",
        answers: ['Non capisco il dialetto.', 'Io non capisco il dialetto.', 'Il dialetto non lo capisco.'],
        mistakes: {
          'Non capiscio il dialetto.': SC_NO_I('capisco'),
          'No capisco il dialetto.': 'Before a verb, "not" is non: non capisco. (no means "no".)',
          'Non capo il dialetto.': 'capire takes -isc- with io: capisco.',
          'Non capisce il dialetto.': 'capisce is "he/she understands". For yourself: capisco.',
        },
        why: WHY_ISC + ' "Not" is non, right before the verb.',
      },
      {
        id: 'u4-s-e09', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u4-r1',
        prompt: "Ma parli già bene l'italiano!", base: '', en: 'But you already speak good Italian!',
        answers: ["Ma parli già bene l'italiano!"],
        mistakes: {
          "Ma parla già bene l'italiano!": 'You heard parli: the grandmother uses tu with you.',
        },
        why: WHY_ARE_TU + ' Older people often use tu with someone young, who still answers with Lei (Come sta?) until invited to switch.',
      },
      {
        id: 'u4-s-e10', type: 'listen', reg: 'tu', rung: 5, ruleId: 'u4-r2',
        prompt: 'Rispondi tu? Ho le mani bagnate.', base: '', en: 'Can you get it? My hands are wet.',
        answers: ['Rispondi tu? Ho le mani bagnate.'],
        mistakes: {
          'Risponde tu? Ho le mani bagnate.': 'You heard rispondi: with tu the ending is -i.',
          'Rispondi tu? O le mani bagnate.': 'You heard ho, "I have": the h is silent, but it is always written.',
        },
        why: WHY_ERE_TU + ' Rispondi tu? = will YOU answer (the phone)?',
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
