// Safety regression: withdrawn housing records must not become published advice.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CHAPTERS, parseChapter, published } from '../reader.mjs';
import { searchAdvice } from '../tools/pl/search.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const chapters = CHAPTERS.map(c => ({ ...c, ...parseChapter(read(c.path), c.id) }));
const chapter = chapters.find(c => c.id === '15');
const text = read(chapter.path);

test('all 18 source decisions and their original identifiers survive withdrawal', () => {
  assert.deepEqual(chapter.entries.map(e => e.number), Array.from({ length: 18 }, (_, i) => `15.${i + 1}`));
  assert.match(chapter.entries[0].fields.Oryginał, /#L7-L15\)/);
  assert.match(chapter.entries.at(-1).fields.Oryginał, /#L160-L167\)/);
  const source = readFileSync(new URL('../book/15-租房与买房.md', import.meta.url));
  assert.equal(createHash('sha256').update(source).digest('hex'), 'cee53cc83031b6571094b9308d947c30f3d4a1c0c687aa871a1d7e5e523d161e');
});

test('the complete housing batch remains unpublished pending fresh primary-source checks', () => {
  assert.equal(published(chapter.entries).length, 0);
  for (const e of chapter.entries) {
    assert.equal(e.fields.Status, 'needs_verification', e.number);
    assert.match(e.title, /^Rekord redakcyjny:/);
    for (const key of ['W praktyce', 'Korzyść i dowody', 'Ocena dowodów', 'Ocena redakcyjna', 'Koszt']) assert.equal(e.fields[key], undefined, `${e.number}: ${key}`);
    assert.match(e.fields.Ograniczenia, /Wymagane:/);
    assert.match(e.fields.Weryfikacja, /^2026-11-01; .*Nie ukończono/);
  }
});

test('neither broad nor specific search exposes any withdrawn housing record', () => {
  for (const query of ['kaucja', 'pośrednika', 'księgi', 'kredytu', 'rękojmi']) {
    assert.ok(searchAdvice(chapters, query, { limit: 1000 }).every(r => r.entry.chapterId !== '15'), query);
  }
});

test('a status-only recertification is refused because instructions and evidence are absent', () => {
  for (const n of [1, 3, 5, 14, 18]) {
    const marker = `<a id="porada-15-${n}"></a>`;
    const start = text.indexOf(marker);
    assert.ok(start >= 0);
    const changed = text.slice(0, start) + text.slice(start).replace('- Status: needs_verification', '- Status: verified');
    assert.throws(() => parseChapter(changed, '15'), /Brak|pola|W praktyce/);
  }
});

test('the evidence failure and the limited scope of the comparison are explicit', () => {
  assert.match(text, /art\. 181 u\.g\.n\. dotyczy ubezpieczenia OC/);
  assert.match(text, /art\. 678 KC, nie wskazany poprzednio art\. 690/);
  assert.match(text, /wycofanie nie jest stwierdzeniem, że każdy ich wniosek jest fałszywy/);
  assert.doesNotMatch(text, /- W praktyce:|- Ocena dowodów:|- Status: verified/);
  assert.doesNotMatch(text, /\p{Script=Han}/u);
});

test('README reflects zero published housing advice and the preserved pending batch', () => {
  const row = read('README.md').split('\n').find(line => line.startsWith('| [15.'));
  assert.match(row, /\| 18 \| 0 \| 18 needs_verification \|$/);
  assert.match(text, /nie porada prawna/);
  assert.match(text, /nie jest adwokatem ani radcą prawnym/);
  assert.match(text, /CC BY 4\.0/);
});
