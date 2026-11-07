// Editorial regression contracts, not independent medical or legal verification.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CHAPTERS, FIELDS, parseChapter, published } from '../reader.mjs';
import { searchAdvice } from '../tools/pl/search.mjs';
const chapters = CHAPTERS.map(c => ({ ...c, ...parseChapter(readFileSync(new URL('../' + c.path, import.meta.url), 'utf8'), c.id) }));
const chapter = chapters.find(c => c.id === '22');
const markdown = readFileSync(new URL('../book/pl/22-odpoczynek-rozrywka-i-bezpieczenstwo.md', import.meta.url), 'utf8');
const entry = n => { assert.ok(chapter, 'chapter22 must be registered'); const e = chapter.entries.find(e => e.number === `22.${n}`); assert.ok(e); return e; };
const f = n => entry(n).fields;

test('relaxation preserves all twelve original positions, original bytes and pinned spans', () => {
  assert.ok(chapter, 'the authorized chapter must be registered');
  assert.deepEqual(chapter.entries.map(e => e.number), Array.from({ length: 12 }, (_, i) => `22.${i + 1}`));
  const original = readFileSync(new URL('../book/22-怎么放松.md', import.meta.url));
  assert.equal(createHash('sha256').update(original).digest('hex'), '53b2b3d00a80652db08ee456eeb8cdd22c0540b886e4a48eb4d280faa6de2c83');
  for (let n = 1; n <= 12; n++) {
    assert.equal(entry(n).id, `porada-22-${n}`);
    assert.ok(f(n).Oryginał.includes('e2605d3e2242bd6216c9255192b8a8957a08c55a'));
    assert.ok(f(n).Oryginał.endsWith(`#L${7 + (n - 1) * 9}-L${n === 12 ? 113 : 15 + (n - 1) * 9})`));
  }
  assert.doesNotMatch(markdown, /\p{Script=Han}/u);
});

test('relaxation has complete bounded records and traceable evidence grades', () => {
  assert.equal(published(chapter.entries).length, 12);
  const grades = 'CCCCCABBAABA';
  for (let n = 1; n <= 12; n++) {
    for (const key of FIELDS) assert.ok(f(n)[key]?.trim(), `22.${n} ${key}`);
    assert.equal(f(n)['Ocena dowodów'][0], grades[n - 1]);
    assert.match(f(n).Weryfikacja, /2026-11-05/);
    if (n <= 5) assert.ok(f(n)['Zmiany w adaptacji'].includes('Oryginalne A zastąpiono C.'));
  }
  assert.ok(f(7)['Zmiany w adaptacji'].includes('Oryginalne A zastąpiono B.'));
  assert.match(f(1).Ograniczenia, /Historyczna kontrola/);
  assert.match(f(5).Ograniczenia, /nie stwierdzamy|Nie stwierdzamy/);
});

test('clinical scopes retain low certainty, treatment boundaries and exploratory breathing outcomes', () => {
  assert.match(f(6)['Korzyść i dowody'], /jako niską, a dla pozostałych form jako bardzo niską/);
  assert.match(f(6)['W praktyce'], /Nie zwiększaj intensywności/);
  assert.match(f(6).Weryfikacja, /pełną korektę/);
  assert.match(f(7)['W praktyce'], /Nie zastępuj samodzielnie leków kursem/);
  assert.match(f(7)['Korzyść i dowody'], /208/);
  assert.match(f(7)['Korzyść i dowody'], /nasilenie lęku/);
  assert.match(f(7).Ograniczenia, /nie miały równego nakładu czasu/);
  assert.match(f(8)['Korzyść i dowody'], /Nie stwierdzono przewagi grup oddechowych w zmianie lęku sytuacyjnego/);
  assert.match(f(8).Ograniczenia, /retrospektywnie/);
  assert.match(f(8)['Korzyść i dowody'], /nie jest identyczna z protokołem badania/);
  assert.match(f(8)['W praktyce'], /bez forsowania głębokości/);
});

test('observational and safety scopes do not turn OR, HR or deceased cases into individual guarantees', () => {
  assert.match(f(9)['Korzyść i dowody'], /Iloraz szans nie jest ilorazem prawdopodobieństw/);
  assert.match(f(9).Ograniczenia, /nie dowodzą/);
  assert.match(f(10)['Korzyść i dowody'], /nie obietnicą czterech punktów procentowych/);
  assert.match(f(10).Ograniczenia, /nie badanie liczby wizyt w parku/);
  assert.ok(f(10).Źródła.includes('PIIS2542-5196%2819%2930215-3'), 'parentheses in a source URL must be encoded for the reader inline format');
  assert.match(f(11)['Korzyść i dowody'], /Nie ma w nim porównania ryzyka wśród wszystkich/);
  assert.match(f(11).Ograniczenia, /nie są polskimi statystykami/);
  assert.match(f(12)['Korzyść i dowody'], /brak istotności nie dowodzi zerowego ryzyka/);
  assert.match(f(12)['Zmiany w adaptacji'], /niepoparte tym przeglądem rozszerzenie/);
  assert.match(f(4)['Ocena redakcyjna'], /Za przemoc odpowiada sprawca/);
});

test('search and publication use canonical relaxation records and preserve withdrawal and failure behaviour', () => {
  for (const [query, n] of [['drogi wyjścia', 1], ['serwis', 2], ['nieznanego proszku', 3], ['nadzoru', 4], ['przerwać grę', 5], ['CINeMA', 6], ['MBSR', 7], ['Balban', 8], ['ilorazy szans', 9], ['NDVI', 10], ['nietrzeźwy', 11], ['snowboard', 12]]) assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === `22.${n}`), query);
  const withdrawn = chapter.entries.map(e => e.number === '22.1' ? { ...e, fields: { ...e.fields, Status: 'needs_verification' } } : e);
  assert.equal(published(withdrawn).length, 11);
  assert.throws(() => parseChapter(markdown.replace('- Status: verified', '- Status: ready'), '22'), /stan|status|ready/i);
  assert.throws(() => parseChapter(markdown.replace(/^- W praktyce: .+\n/m, ''), '22'), /W praktyce/);
  assert.equal(published(chapters.flatMap(c => c.entries)).some(e => ['17.1', '19.18', '20.5'].includes(e.number)), false);
});

test('relaxation retains professional, licensing and source-reading boundaries without imported numbers', () => {
  for (const text of ['nie jest oficjalne wydanie autora', 'nie jest lekarzem', 'nie jest adwokatem ani radcą prawnym', 'nie porada prawna', 'CC BY 4.0', 'eternity4719']) assert.ok(markdown.includes(text));
  assert.doesNotMatch(markdown, /96110|12356|12315|12333|12378|\+86/);
  assert.match(f(11).Weryfikacja, /pełny abstrakt.*nie pełny artykuł/);
});
