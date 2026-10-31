// Editorial regression guards and consumer checks, not medical certification.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CHAPTERS, parseChapter, published } from '../reader.mjs';
import { lintEntry, phoneNumbers, upstreamSpanOf } from '../tools/pl/lint.mjs';
import { searchAdvice } from '../tools/pl/search.mjs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const chapters = CHAPTERS.map(c => ({ ...c, ...parseChapter(readFileSync(new URL('../' + c.path, import.meta.url), 'utf8'), c.id) }));
const chapter = chapters.find(c => c.id === '01');
const entry = n => {
  const found = chapter.entries.find(e => e.number === `01.${n}`);
  assert.ok(found, `missing decision 01.${n}`);
  return found;
};
const f = n => entry(n).fields;

// These are the reviewed decisions of this chapter, not a floor for the size of a growing corpus.
const ready = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 25, 27, 28, 29, 30, 31, 36, 38, 41, 42, 43, 46];
const verify = [26, 32, 33, 34];
const localize = [8, 23, 24, 35, 37, 39, 40, 44, 45, 47, 48];

test('chapter 01 covers every original item with its explicit publication decision', () => {
  assert.deepEqual(chapter.entries.map(e => Number(e.number.split('.')[1])), Array.from({ length: 48 }, (_, i) => i + 1));
  assert.deepEqual(published(chapter.entries).map(e => Number(e.number.split('.')[1])), ready);
  for (const [state, list] of [['needs_verification', verify], ['needs_localization', localize]]) {
    assert.deepEqual(chapter.entries.filter(e => e.fields.Status === state).map(e => Number(e.number.split('.')[1])), list);
    for (const n of list) {
      assert.ok(entry(n).title.startsWith('Rekord redakcyjny:'));
      assert.equal(f(n)['W praktyce'], undefined);
    }
  }
  // Do not omit the final source paragraph; a trailing empty line is not part of that paragraph.
  assert.ok(upstreamSpanOf(entry(48), root).trimEnd().endsWith(readFileSync(new URL('../book/01-不要早死.md', import.meta.url), 'utf8').trimEnd().split('\n').at(-1)));
});

test('search discovers new Polish advice and excludes the withheld decisions', () => {
  for (const [query, number] of [['półpasiec', '01.21'], ['polpasiec', '01.21'], ['krwiomocz', '01.27'], ['PrEP', '01.38'], ['osłoną', '01.42']]) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === number), query);
  }
  const withheld = new Set([...verify, ...localize].map(n => `01.${n}`));
  for (const query of ['Helicobacter', 'osteoporozy', 'gastroskopia', 'Rekord redakcyjny', 'HCV']) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).every(r => !withheld.has(r.entry.number)), query);
  }
});

test('motorcycle odds, treatment effects and fall denominators retain their actual scope', () => {
  assert.match(f(2)['Korzyść i dowody'], /61 badań obserwacyjnych/);
  assert.match(f(2)['Korzyść i dowody'], /OR 0,58.*0,50–0,68/);
  assert.match(f(2).Ograniczenia, /Nie przypisujemy ich rowerom elektrycznym/);
  assert.doesNotMatch(f(2)['W praktyce'], /42%|69%/);
  assert.match(f(7)['Korzyść i dowody'], /123 badań.*613 815/);
  assert.match(f(7)['Korzyść i dowody'], /Nie jest to efekt samego użycia ciśnieniomierza/);
  assert.match(f(7)['W praktyce'], /Nie dobieraj ani nie zwiększaj samodzielnie leków/);
  assert.match(f(13)['Korzyść i dowody'], /59 badaniach \(12 981 osób\)/);
  assert.match(f(13)['Korzyść i dowody'], /RaR 0,77/);
  assert.match(f(13)['Korzyść i dowody'], /Osobna analiza 63 badań/);
  assert.match(f(13).Ograniczenia, /nie o śmiertelności/);
});

test('screening eligibility is Polish, conditional and never a reason to delay diagnosis of symptoms', () => {
  assert.match(f(17)['W praktyce'], /45–74/);
  assert.match(f(17)['W praktyce'], /nie czekaj na termin przesiewu/);
  assert.match(f(17).Ograniczenia, /nie oznacza.*przed 45/);
  assert.match(f(18)['W praktyce'], /25–64/);
  assert.match(f(18)['W praktyce'], /dalsze postępowanie zależy od wyniku i historii/);
  assert.match(f(18)['W praktyce'], /nie uznawaj dodatniego HPV za rozpoznanie raka/);
  assert.match(f(18)['Korzyść i dowody'], /52 grup wsi.*131 746/);
  assert.match(f(18)['Korzyść i dowody'], /34 zgony.*64.*HR 0,52/);
  assert.match(f(19)['W praktyce'], /bez objawów w wieku 50–65.*40–49/);
  assert.match(f(19)['Korzyść i dowody'], /42,0%/);
  assert.match(f(19)['Korzyść i dowody'], /0,98%.*1,20%/);
  assert.match(f(19)['Korzyść i dowody'], /0,28%.*0,31%.*bez wyraźnej/);
  assert.match(f(19).Ograniczenia, /efekt zaproszenia/);
  assert.match(f(19).Ograniczenia, /testem gwajakolowym.*nie są automatycznie.*FIT/);
});

test('vaccine evidence does not change population, product, endpoint or adverse-event category', () => {
  assert.match(f(14)['W praktyce'], /Nie uznawaj samodzielnie niskiego wyniku przeciwciał/);
  assert.match(f(16)['W praktyce'], /dziewczęta i chłopców|dziewczęta i chłopcy/);
  assert.match(f(16)['W praktyce'], /przed 14\. urodzinami/);
  assert.match(f(16).Ograniczenia, /Finansowanie nie jest równoznaczne ze wskazaniem/);
  assert.match(f(20)['Korzyść i dowody'], /2571.*2532/);
  assert.match(f(20)['Korzyść i dowody'], /2,9%.*4,9%/);
  assert.match(f(20).Ograniczenia, /nie wolno przypisać wszystkim zdrowym seniorom/);
  assert.match(f(20).Ograniczenia, /niskiej pewności.*bardzo niskiej/);
  assert.match(f(21)['Korzyść i dowody'], /15 411.*3,2 roku.*6 osób.*210/);
  assert.match(f(21).Ograniczenia, /17,0%.*3,2%.*nie oznacza.*ciężkich zdarzeń/);
  assert.match(f(22)['Korzyść i dowody'], /PCV13.*45,6%.*95,2%/);
  assert.match(f(22).Ograniczenia, /nie przypisujemy PCV20, PCV21/);
});

test('crisis advice routes to help without method comparisons or a personal countdown', () => {
  for (const n of [25, 43]) {
    assert.match(f(n)['W praktyce'], /116 123/);
    assert.match(f(n)['W praktyce'], /800 702 222/);
    assert.match(f(n)['W praktyce'], /112/);
    assert.doesNotMatch(f(n)['W praktyce'], /12356|10 minut|śmiertelno|dawki|przymus/);
  }
  assert.match(f(25).Ograniczenia, /Nie odstawiaj samodzielnie przepisanych leków/);
  assert.match(f(43).Ograniczenia, /Sama odpowiedź „nie” nie wyklucza zagrożenia/);
  assert.equal(f(37).Status, 'needs_localization');
  assert.equal(f(37)['W praktyce'], undefined, 'no instruction to hand over banking credentials');
});

test('HIV prevention separates a test, PrEP and urgent care after exposure, without dosage', () => {
  assert.match(f(31).Ograniczenia, /Ujemny wynik wykonany zbyt wcześnie nie wyklucza/);
  assert.match(f(31).Ograniczenia, /POZ nie są anonimowe jak w PKD/);
  assert.match(f(38)['W praktyce'], /wykluczyć zakażenie/);
  assert.match(f(38).Ograniczenia, /nie zastępuje PEP/);
  assert.match(f(38).Ograniczenia, /nie ustala dawkowania/);
  assert.doesNotMatch(f(38)['W praktyce'], /tablet|2\+1\+1|24 godzin|48 godzin/);
});

test('the checked contacts are accepted, but one-digit mistakes and inherited Chinese numbers still fail', () => {
  const base = entry(25);
  const check = text => lintEntry({ ...base, fields: { ...base.fields, 'W praktyce': text } }, { today: '2026-10-31' });
  for (const number of ['992', '800 702 222', '22 194 30', '22 621 02 56']) {
    assert.deepEqual(phoneNumbers(`Zadzwoń pod ${number}.`), [number]);
    assert.deepEqual(check(`Zadzwoń pod ${number}.`), [], number);
  }
  for (const number of ['991', '800 702 223', '22 194 31', '22 621 02 57', '12356', '110', '120']) {
    assert.ok(check(`Zadzwoń pod ${number}.`).some(finding => finding.rule === 'phone-number' && finding.severity === 'error'), number);
  }
});

test('ice advice does not turn a measured thickness into permission to enter', () => {
  assert.match(f(41)['W praktyce'], /Nie wchodź rekreacyjnie na lód/);
  assert.match(f(41)['W praktyce'], /nie biegnij po lodzie/);
  assert.doesNotMatch(f(41)['W praktyce'], /15 cm|10 cm|wywierć|zmierz/);
  assert.match(f(41).Ograniczenia, /Nie podajemy grubości lodu jako gwarancji/);
});
