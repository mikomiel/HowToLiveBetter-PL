// Editorial regression contracts, not independent legal/medical verification.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CHAPTERS, FIELDS, parseChapter, published } from '../reader.mjs';
import { searchAdvice } from '../tools/pl/search.mjs';
const chapters = CHAPTERS.map(c => ({ ...c, ...parseChapter(readFileSync(new URL('../' + c.path, import.meta.url), 'utf8'), c.id) }));
const chapter = chapters.find(c => c.id === '21');
const markdown = readFileSync(new URL('../book/pl/21-podroz-za-granice-i-bezpieczenstwo.md', import.meta.url), 'utf8');
const entry = n => { const e = chapter.entries.find(e => e.number === `21.${n}`); assert.ok(e); return e; };
const f = n => entry(n).fields;

test('travel preserves all 13 original positions, bytes and exact pinned spans', () => {
  assert.deepEqual(chapter.entries.map(e => e.number), Array.from({ length: 13 }, (_, i) => `21.${i + 1}`));
  const original = readFileSync(new URL('../book/21-出国旅行与境外安全.md', import.meta.url));
  assert.equal(createHash('sha256').update(original).digest('hex'), '912b20c1ffa8f23e496d89ee76aa5141f0ca0d5e98e73320f284ada19d73ca6e');
  for (let n = 1; n <= 13; n++) {
    assert.equal(entry(n).id, `porada-21-${n}`);
    assert.ok(f(n).Oryginał.includes('e2605d3e2242bd6216c9255192b8a8957a08c55a'));
    assert.ok(f(n).Oryginał.endsWith(`#L${7 + (n - 1) * 9}-L${n === 13 ? 122 : 15 + (n - 1) * 9})`));
  }
  assert.doesNotMatch(markdown, /\p{Script=Han}/u);
});

test('12 bounded travel scopes have all fields and disclose A to C changes; agency record stays pending', () => {
  assert.deepEqual(published(chapter.entries).map(e => e.number), Array.from({ length: 13 }, (_, i) => i + 1).filter(n => n !== 9).map(n => `21.${n}`));
  const grades = 'AAACAACAAACAA';
  for (const e of published(chapter.entries)) {
    for (const key of FIELDS) assert.ok(e.fields[key]?.trim(), `${e.number} ${key}`);
    assert.match(e.fields['Ocena dowodów'], /^C [—-] /);
    if (grades[Number(e.number.split('.')[1]) - 1] !== 'C') assert.ok(e.fields['Zmiany w adaptacji'].includes('Oryginalne A zastąpiono C.'));
    assert.match(e.fields.Weryfikacja, /2026-11-05/);
  }
  assert.equal(f(9).Status, 'needs_localization');
  assert.equal(f(9)['W praktyce'], undefined);
  assert.equal(f(9)['Ocena dowodów'], undefined);
});

test('travel source scopes retain advisory, coverage and financial boundaries', () => {
  assert.match(f(1)['Korzyść i dowody'], /rekomendacje/);
  assert.match(f(1).Ograniczenia, /nie należy przedstawiać jako polskiego zakazu/);
  assert.match(f(2)['W praktyce'], /w każdym państwie UE działa numer 112/);
  assert.match(f(3)['Korzyść i dowody'], /zobowiązaniu do zwrotu/);
  assert.match(f(4)['Korzyść i dowody'], /niezbędnego, nieplanowanego/);
  assert.match(f(4)['Korzyść i dowody'], /może oznaczać dopłaty/);
  assert.match(f(6)['W praktyce'], /co najmniej 10 000 euro/);
  assert.match(f(6)['Korzyść i dowody'], /na osobę/);
  assert.match(f(6).Ograniczenia, /nie jest pozwoleniem/);
  assert.match(f(7).Ograniczenia, /Nie twierdzimy, że wszędzie trzeba najpierw/);
  assert.match(f(8).Ograniczenia, /rozróżnia okresy dla dwóch wzorów/);
  assert.match(f(10)['W praktyce'], /Nie traktuj zaproszenia jako wizy ani zezwolenia na pracę/);
  assert.match(f(11).Ograniczenia, /nie jest warunkiem prawnym zgłoszenia zaginięcia/);
  assert.match(f(12)['Korzyść i dowody'], /dokument dotyczy przekroczenia granic RP/);
  assert.match(f(12)['W praktyce'], /nie gwarantują dopuszczalności w innym państwie/);
  assert.match(f(13).Ograniczenia, /odrębne zasady/);
});

test('search finds published travel subjects but not the pending agency record', () => {
  for (const [query, n] of [['ostrzeżenia MSZ', 1], ['zapis dostępny', 2], ['szczególne formy pomocy finansowej', 3], ['wyjątkiem ekonomicznym', 4], ['rekrutera', 5], ['10 000 euro', 6], ['konsul honorowy', 7], ['konwencyjny', 8], ['gwaranta kosztów', 10], ['planowane', 11], ['tranzycie', 12], ['fitosanitarnego', 13]]) assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === `21.${n}`), query);
  assert.ok(searchAdvice(chapters, 'pośrednictwo', { limit: 100 }).every(r => r.entry.number !== '21.9'));
});

test('travel withdrawal, malformed data and status-only recertification fail closed', () => {
  const withdrawn = chapter.entries.map(e => e.number === '21.1' ? { ...e, fields: { ...e.fields, Status: 'needs_verification' } } : e);
  assert.equal(published(withdrawn).length, 11);
  assert.throws(() => parseChapter(markdown.replace('- Status: verified', '- Status: ready'), '21'), /stan|status|ready/i);
  assert.throws(() => parseChapter(markdown.replace(/^- W praktyce: .+\n/m, ''), '21'), /W praktyce/);
  assert.throws(() => parseChapter(markdown.replace('- Status: needs_localization', '- Status: verified'), '21'), /Koszt|W praktyce/);
});

test('travel retains attribution and professional boundaries without imported contact numbers', () => {
  for (const text of ['nie jest oficjalne wydanie autora', 'nie jest lekarzem', 'nie jest adwokatem ani radcą prawnym', 'nie porada prawna', 'CC BY 4.0', 'eternity4719']) assert.ok(markdown.includes(text));
  assert.doesNotMatch(markdown, /12308|96110|12356|12315|12333|12378|\+86/);
});
