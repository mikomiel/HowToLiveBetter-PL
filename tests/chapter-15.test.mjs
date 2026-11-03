// Content contracts, not a legal opinion or a factual verification of statutes.
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
const entry = n => chapter.entries[n - 1];

test('all 18 original housing identifiers and pinned source spans survive reassessment', () => {
  assert.deepEqual(chapter.entries.map(e => e.number), Array.from({ length: 18 }, (_, i) => `15.${i + 1}`));
  assert.match(entry(1).fields.Oryginał, /#L7-L15\)/);
  assert.match(entry(18).fields.Oryginał, /#L160-L167\)/);
  const source = readFileSync(new URL('../book/15-租房与买房.md', import.meta.url));
  assert.equal(createHash('sha256').update(source).digest('hex'), 'cee53cc83031b6571094b9308d947c30f3d4a1c0c687aa871a1d7e5e523d161e');
});

test('each restored scope has instructions, current read scope, limitations and a traced C grade', () => {
  assert.equal(published(chapter.entries).length, 18);
  for (const e of chapter.entries) {
    assert.equal(e.fields.Status, 'verified', e.number);
    assert.doesNotMatch(e.title, /^Rekord redakcyjny:/);
    for (const key of ['W praktyce', 'Korzyść i dowody', 'Ocena dowodów', 'Ocena redakcyjna', 'Koszt', 'Ograniczenia', 'Źródła']) assert.ok(e.fields[key]?.trim(), `${e.number}: ${key}`);
    assert.match(e.fields['Ocena dowodów'], /^C — /);
    assert.match(e.fields['Zmiany w adaptacji'], /Oryginalne A zastąpiono C\./);
    assert.match(e.fields.Weryfikacja, /^2026-11-02; przeczytano /);
    assert.match(e.fields['Źródła'], /https:\/\/(?:api\.sejm\.gov\.pl|eli\.gov\.pl|www\.(?:gov\.pl|bgk\.pl|knf\.gov\.pl))/);
    assert.doesNotMatch(e.fields.Weryfikacja, /wyłącznie wyszukiwanie|pełne teksty nie odczytane/);
  }
});

test('housing actions are discoverable without renumbering or dropping decisions', () => {
  const queries = ['kaucji', 'zamków', 'pośrednika', 'instytucjonalnym', 'Sprzedaż', 'księgę wieczystą', 'depozyt', 'wady', 'KOWR', 'prospekt', 'zadatkiem', 'pomiaru', 'opóźnieniu', 'roszczenia', 'refinansowanie', 'BGK', 'mediów', 'rękojmię'];
  for (const [i, query] of queries.entries()) {
    assert.ok(searchAdvice(chapters, query, { limit: 1000 }).some(r => r.entry.number === `15.${i + 1}`), query);
  }
});

test('withdrawing a restored card hides it and a status-only recertification cannot replace missing instructions', () => {
  const start = text.indexOf('<a id="porada-15-1"></a>');
  const end = text.indexOf('<a id="porada-15-2"></a>');
  const original = text.slice(start, end);
  const pending = original.replace('- Status: verified', '- Status: needs_verification').replace(/^- W praktyce:.*\n/m, '');
  const changed = text.slice(0, start) + pending + text.slice(end);
  const parsed = parseChapter(changed, '15');
  assert.equal(published(parsed.entries).length, 17);
  assert.ok(published(parsed.entries).every(e => e.number !== '15.1'));
  const recertified = text.slice(0, start) + pending.replace('- Status: needs_verification', '- Status: verified') + text.slice(end);
  assert.throws(() => parseChapter(recertified, '15'), /Brak|pola|W praktyce/);
});

test('the correction retains material legal distinctions instead of the withdrawn blanket instructions', () => {
  assert.match(entry(1).fields['W praktyce'], /dwunastokrotności/);
  assert.match(entry(1).fields['W praktyce'], /sześciokrotność/);
  assert.match(entry(2).fields.Ograniczenia, /Art\. 343/);
  for (const n of [2, 17]) assert.match(entry(n).fields['Źródła'], /DU\/2026\/1342\/text\.pdf#page=46/);
  assert.match(entry(3).fields['Korzyść i dowody'], /art\. 95–99/i);
  assert.match(entry(5).fields['Korzyść i dowody'], /art\. 678/i);
  assert.match(entry(5).fields['Korzyść i dowody'], /art\. 692/i);
  assert.match(entry(7).fields.Ograniczenia, /nie ustanawia obowiązkowego depozytu/);
  assert.match(entry(11).fields['Korzyść i dowody'], /negatywną oceną zdolności kredytowej/);
  assert.match(entry(12).fields.Ograniczenia, /Nie potwierdzono.*jednego ustawowego progu/);
  assert.match(entry(13).fields['Korzyść i dowody'], /120 dni/);
  assert.match(entry(14).fields['Korzyść i dowody'], /Art\. 16/);
  assert.match(entry(14).fields['Korzyść i dowody'], /art\. 17/i);
  assert.match(entry(15).fields['Korzyść i dowody'], /POLSTR/);
  assert.match(entry(16).fields['W praktyce'], /Rodzinny kredyt mieszkaniowy/);
  assert.match(entry(17).fields.Ograniczenia, /Nie stwierdzamy, że każda przerwa/);
  assert.match(entry(18).fields['Korzyść i dowody'], /pięciu lat od wydania/);
  assert.match(entry(18).fields.Ograniczenia, /Gwarancja nie powstaje automatycznie/);
  assert.doesNotMatch(text, /\p{Script=Han}/u);
});

test('README and the independent-adaptation notice distinguish reassessment from specialist approval', () => {
  const row = read('README.md').split('\n').find(line => line.startsWith('| [15.'));
  assert.match(row, /\| 18 \| 18 \| — \|$/);
  assert.match(text, /Ponowna ocena: 2026-11-02/);
  assert.match(text, /nie porada prawna/);
  assert.match(text, /nie jest adwokatem ani radcą prawnym/);
  assert.match(text, /Nie przeprowadzono niezależnej recenzji prawnika/);
  assert.match(text, /nie przywrócenie dawnego tekstu/);
  assert.match(text, /CC BY 4\.0/);
});
