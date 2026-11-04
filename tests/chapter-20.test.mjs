// Editorial regression guards; these do not establish clinical truth or approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CHAPTERS, FIELDS, parseChapter, published } from '../reader.mjs';
import { searchAdvice } from '../tools/pl/search.mjs';
import { citedInputs } from '../tools/pl/sources.mjs';

const chapters = CHAPTERS.map(c => ({ ...c, ...parseChapter(readFileSync(new URL('../' + c.path, import.meta.url), 'utf8'), c.id) }));
const chapter = chapters.find(c => c.id === '20');
const markdown = readFileSync(new URL('../book/pl/20-opieka-nad-noworodkiem-i-niemowleciem.md', import.meta.url), 'utf8');
const entry = n => {
  const e = chapter.entries.find(e => e.number === `20.${n}`);
  assert.ok(e, `missing decision 20.${n}`);
  return e;
};
const f = n => entry(n).fields;

test('chapter 20 preserves all 17 source decisions, original bytes and pinned spans', () => {
  assert.deepEqual(chapter.entries.map(e => Number(e.number.split('.')[1])), Array.from({ length: 17 }, (_, i) => i + 1));
  const source = readFileSync(new URL('../book/20-刚出生的孩子怎么带.md', import.meta.url));
  assert.equal(createHash('sha256').update(source).digest('hex'), '1caa74ac8c347d9441e6e3be1a2b84402d52bc4bce53ea7b4f2525e70402f71e');
  for (let n = 1; n <= 17; n++) {
    assert.equal(entry(n).id, `porada-20-${n}`);
    assert.match(f(n).Oryginał, /e2605d3e2242bd6216c9255192b8a8957a08c55a/);
    assert.ok(f(n).Oryginał.endsWith(`#L${7 + (n - 1) * 9}-L${n === 17 ? 158 : 15 + (n - 1) * 9})`));
  }
  assert.doesNotMatch(markdown, /\p{Script=Han}/u);
});

test('16 bounded scopes have complete fields and disclose grade changes; formula remains pending', () => {
  assert.deepEqual(published(chapter.entries).map(e => e.number), Array.from({ length: 17 }, (_, i) => i + 1).filter(n => n !== 5).map(n => `20.${n}`));
  const originalGrades = 'AAAAAABABCCABBBBB';
  for (const e of published(chapter.entries)) {
    const n = Number(e.number.split('.')[1]);
    for (const key of FIELDS) assert.ok(e.fields[key]?.trim(), `${e.number} ${key}`);
    const grade = n === 12 ? 'B' : 'C';
    assert.match(e.fields['Ocena dowodów'], new RegExp(`^${grade} [—-] `));
    if (originalGrades[n - 1] !== grade) assert.ok(e.fields['Zmiany w adaptacji'].includes(`Oryginalne ${originalGrades[n - 1]} zastąpiono ${grade}.`));
    assert.match(e.fields.Weryfikacja, /2026-11-03/);
    assert.ok(citedInputs(e).length > 0);
  }
  assert.equal(f(5).Status, 'needs_verification');
  assert.equal(f(5)['W praktyce'], undefined);
  assert.equal(f(5)['Ocena dowodów'], undefined);
  assert.match(f(5).Ograniczenia, /WHO\/FAO.*BfR/);
  assert.match(f(5).Ograniczenia, /issue #36/);
});

test('clinical scopes keep Polish exceptions, trial population and prevention limits explicit', () => {
  assert.match(f(1)['W praktyce'], /na plecach/);
  assert.match(f(1)['W praktyce'], /osobnym łóżeczku/);
  assert.match(f(2)['W praktyce'], /antyHBs > 100 U\/l/);
  assert.match(f(2)['W praktyce'], /w aktualnej ciąży/);
  assert.match(f(3).Ograniczenia, /Nie odtworzono całego kalendarza/);
  assert.match(f(4)['Korzyść i dowody'], /nie są identycznie sformułowane terminy/);
  assert.match(f(6)['W praktyce'], /nie ukończyło roku/);
  assert.match(f(7).Źródła, /2025\/1525\/text\.pdf#page=20/);
  assert.match(f(8)['W praktyce'], /poniżej 3 miesięcy ma temperaturę 38°C lub wyższą/);
  assert.match(f(8)['W praktyce'], /pod 112/);
  assert.match(f(9)['W praktyce'], /Nigdy nie potrząsaj/);
  assert.match(f(12)['Korzyść i dowody'], /640 niemowląt/);
  assert.match(f(12)['Korzyść i dowody'], /13,7%.*1,9%/);
  assert.match(f(12)['W praktyce'], /Nie rób samodzielnie próby prowokacji/);
  assert.match(f(12).Ograniczenia, /nie badał wszystkich niemowląt/);
  assert.match(f(13)['Korzyść i dowody'], /1\.4\.7 odradza leczenie światłem słonecznym/);
  assert.match(f(14)['W praktyce'], /Nie zastępuj mleka dla niemowląt zwykłym napojem roślinnym/);
  assert.match(f(15).Ograniczenia, /Nie twierdzimy, że w Polsce obowiązuje zakaz sprzedaży/);
  assert.match(f(16)['Korzyść i dowody'], /zdrowych dzieci urodzonych o czasie w wieku 0–6 miesięcy podają 400 IU/);
  assert.match(f(16).Ograniczenia, /nie dawkowanie dla wcześniaka/);
  assert.match(f(16).Weryfikacja, /obcięty/);
  assert.match(f(17)['W praktyce'], /nie zostawiaj niemowlęcia samego/);
  assert.match(f(17).Ograniczenia, /Nie podano instrukcji ustawiania temperatury zasobnika/);
});

test('search finds all 16 published infant scopes but never the pending formula record', () => {
  for (const [query, number] of [['plecach', 1], ['antyHBs', 2], ['kalendarz szczepień', 3], ['rozszerzanie', 4], ['miodu', 6], ['witaminą K', 7], ['38°C', 8], ['potrząsaj', 9], ['pieluszki', 10], ['nieznanej historii', 11], ['LEAP', 12], ['bilirubiny', 13], ['kobalaminy', 14], ['chodzika', 15], ['cholekalcyferolu', 16], ['kąpiel', 17]]) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === `20.${number}`), query);
  }
  assert.ok(searchAdvice(chapters, 'przygotowanie mleka', { limit: 100 }).every(r => r.entry.number !== '20.5'));
});

test('withdrawal hides a scope and malformed or status-only recertified infant data fail closed', () => {
  const withdrawn = chapter.entries.map(e => e.number === '20.1' ? { ...e, fields: { ...e.fields, Status: 'needs_verification' } } : e);
  assert.equal(published(withdrawn).length, 15);
  assert.ok(published(withdrawn).every(e => e.number !== '20.1'));
  assert.throws(() => parseChapter(markdown.replace('- Status: verified', '- Status: ready'), '20'), /stan|status|ready/i);
  assert.throws(() => parseChapter(markdown.replace(/^- W praktyce: .+\n/m, ''), '20'), /W praktyce/);
  assert.throws(() => parseChapter(markdown.replace('- Status: needs_verification', '- Status: verified'), '20'), /Koszt|W praktyce/);
});

test('infant chapter preserves attribution, live cross-references and absence of specialist approval', () => {
  assert.match(markdown, /nie jest oficjalne wydanie autora/);
  assert.match(markdown, /nie jest lekarzem/);
  assert.match(markdown, /nie porada prawna/);
  assert.match(markdown, /nie jest adwokatem ani radcą prawnym/);
  assert.match(markdown, /nie uzyskano niezależnego zatwierdzenia lekarza/);
  const ids = new Set(published(chapters.flatMap(c => c.entries)).map(e => e.id));
  for (const e of chapter.entries) {
    for (const value of Object.values(e.fields)) {
      for (const [, id] of String(value).matchAll(/\.md#(porada-\d+-\d+)\)/g)) assert.ok(ids.has(id), `${e.number}: ${id}`);
    }
  }
  assert.doesNotMatch(markdown, /96110|12356|12315|12333|12378|\+86|\b111\b/);
});
