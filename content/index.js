// Unit list + metadata. Unit content lives in content/units/unit-NN-*.js and is
// loaded on demand; `load` is null for units not written yet.

export const UNITS = [
  { id: 0, slug: 'sounds', title: 'Sounds', teaser: 'c, g, gli, gn, double letters',
    load: () => import('./units/unit-00-sounds.js').then((m) => m.default) },
  { id: 1, slug: 'nouns', title: 'Nouns', teaser: 'gender & plurals',
    load: () => import('./units/unit-01-nouns.js').then((m) => m.default) },
  { id: 2, slug: 'articles', title: 'Articles', teaser: "il · lo · la · l'",
    load: () => import('./units/unit-02-articles.js').then((m) => m.default) },
  { id: 3, slug: 'essere-avere', title: 'Essere & avere', teaser: 'to be, to have', load: null },
  { id: 4, slug: 'present-tense', title: 'Present tense', teaser: '-are · -ere · -ire', load: null },
  { id: 5, slug: 'irregular-verbs', title: 'Irregular verbs', teaser: 'vado, faccio, sto', load: null },
  { id: 6, slug: 'questions', title: 'Questions', teaser: 'who · what · where', load: null },
  { id: 7, slug: 'can-want-must', title: 'Can, want, must', teaser: 'voglio, posso, devo', load: null },
  { id: 8, slug: 'adjectives', title: 'Adjectives', teaser: 'mio, tua, la nostra', load: null },
  { id: 9, slug: 'prepositions', title: 'Prepositions', teaser: 'al · del · nella', load: null },
  { id: 10, slug: 'i-like', title: 'I like…', teaser: 'mi piace, ci sono', load: null },
  { id: 11, slug: 'reflexive-verbs', title: 'Reflexive verbs', teaser: 'mi chiamo, ci vediamo', load: null },
  { id: 12, slug: 'past-tense-i', title: 'Past tense I', teaser: 'ho mangiato, ho visto', load: null },
  { id: 13, slug: 'past-tense-ii', title: 'Past tense II', teaser: 'sono andato, sono uscita', load: null },
  { id: 14, slug: 'pronouns', title: 'Pronouns', teaser: 'lo, la, gli, ne', load: null },
  { id: 15, slug: 'imperfect', title: 'Imperfect', teaser: 'ero, avevo, facevo', load: null },
  { id: 16, slug: 'future', title: 'Future', teaser: 'farò, andremo', load: null },
  { id: 17, slug: 'imperative', title: 'Imperative', teaser: 'senta, scusi, dimmi', load: null },
  { id: 18, slug: 'polite-conditional', title: 'Polite conditional', teaser: 'vorrei, potrebbe', load: null },
];

/** The unit's content, or null if the unit is unknown or not written yet. */
export async function loadUnit(id) {
  const entry = UNITS.find((u) => u.id === Number(id));
  return entry?.load ? entry.load() : null;
}

/** exercise id → { exercise, unitId, lessonId, ruleId }. Scene exercises have lessonId null. */
export function exerciseIndex(units) {
  const index = new Map();
  for (const unit of units || []) {
    if (!unit) continue;
    for (const lesson of unit.lessons || []) {
      for (const exercise of lesson.exercises || []) {
        index.set(exercise.id, { exercise, unitId: unit.id, lessonId: lesson.id, ruleId: exercise.ruleId });
      }
    }
    for (const exercise of unit.scene?.exercises || []) {
      index.set(exercise.id, { exercise, unitId: unit.id, lessonId: null, ruleId: exercise.ruleId });
    }
  }
  return index;
}
