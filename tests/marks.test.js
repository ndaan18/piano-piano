import test from 'node:test';
import assert from 'node:assert/strict';
import { markRanges, ruleSentenceHTML } from '../js/ui/marks.js';

test('markRanges finds each mark after the previous one, substrings included', () => {
  const marks = [
    { word: 'lo', kind: 'circle', color: 'pink' },
    { word: 'z', kind: 'underline', color: 'ultra' },
  ];
  assert.deepEqual(markRanges('lo zaino · il libro', marks), [
    { start: 0, end: 2, kind: 'circle', color: 'pink' },
    { start: 3, end: 4, kind: 'underline', color: 'ultra' },
  ]);
});

test('markRanges marks a repeated word at its next occurrence', () => {
  const marks = [{ word: 'il', kind: 'circle', color: 'pink' }, { word: 'il', kind: 'circle', color: 'ultra' }];
  assert.deepEqual(markRanges('il treno, il conto', marks).map((r) => r.start), [0, 10]);
});

test('markRanges skips a mark it cannot find and keeps going', () => {
  const marks = [
    { word: 'gli', kind: 'circle', color: 'pink' },
    { word: 'z', kind: 'underline', color: 'ultra' },
    { word: '', kind: 'circle', color: 'pink' },
  ];
  assert.deepEqual(markRanges('lo zaino', marks), [{ start: 3, end: 4, kind: 'underline', color: 'ultra' }]);
  assert.deepEqual(markRanges('lo zaino', undefined), []);
});

test('markRanges ignores unknown kinds and colours', () => {
  assert.deepEqual(markRanges('lo zaino', [{ word: 'lo', kind: 'box', color: 'pink' }]), []);
  assert.deepEqual(markRanges('lo zaino', [{ word: 'lo', kind: 'circle', color: 'red' }]), []);
});

test('ruleSentenceHTML escapes text and wraps marked words', () => {
  const html = ruleSentenceHTML({
    sentence: "l'<b>amico",
    marks: [{ word: "l'", kind: 'circle', color: 'pink' }],
  });
  assert.match(html, /^<span class="mk mk--circle mk--pink">l&#39;<svg/);
  assert.match(html, /&#60;b&#62;amico$/);
  assert.doesNotMatch(html, /<b>/);
});
