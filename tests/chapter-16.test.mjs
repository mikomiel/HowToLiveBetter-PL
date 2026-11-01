// Editorial guards for chapter 16: evidence scope, clinical limits and provenance.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CHAPTERS, parseChapter, published } from '../reader.mjs';
import { searchAdvice } from '../tools/pl/search.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const chapters = CHAPTERS.map(c => ({ ...c, ...parseChapter(read(c.path), c.id) }));
const chapter = chapters.find(c => c.id === '16');
const text = read(chapter.path);
const fields = n => {
  const e = chapter.entries.find(e => e.number === `16.${n}`);
  assert.ok(e, `16.${n}`);
  return e.fields;
};

test('all 14 chapter 16 decisions keep the pinned original, numbering and complete ranges', () => {
  const ids = Array.from({ length: 14 }, (_, i) => `16.${i + 1}`);
  assert.deepEqual(chapter.entries.map(e => e.number), ids);
  assert.deepEqual(published(chapter.entries).map(e => e.number), ids);
  assert.match(fields(1).Oryginał, /#L7-L15\)/);
  assert.match(fields(14).Oryginał, /#L124-L131\)/);
  const source = readFileSync(new URL('../book/16-得了慢性病之后怎么活.md', import.meta.url));
  assert.equal(createHash('sha256').update(source).digest('hex'), '5ff9b3c7d81ed866df82279b78655d8e25b14ea14ee2883b79cea21be85be703');
  for (const e of chapter.entries) {
    assert.match(e.fields.Oryginał, /e2605d3e2242bd6216c9255192b8a8957a08c55a/);
    assert.ok(text.includes(`<a id="${e.id}"></a>`));
  }
});

test('the publication grade describes the used evidence rather than copying the source label', () => {
  const old = 'AABBAAAAABAABA';
  const expected = 'ACABCCBBBBBABB';
  assert.equal(chapter.entries.map(e => e.fields['Ocena dowodów'][0]).join(''), expected);
  chapter.entries.forEach((e, i) => {
    if (old[i] !== expected[i]) assert.ok(e.fields['Zmiany w adaptacji'].includes(`Oryginalne ${old[i]} zastąpiono ${expected[i]}`), e.number);
  });
  assert.match(fields(1)['Korzyść i dowody'], /placebo/);
  assert.match(fields(3).Ograniczenia, /nie bezpośrednio umieralności/);
  assert.match(fields(13)['Korzyść i dowody'], /nie badanie skuteczności corocznego przesiewu/);
  assert.match(fields(14)['Korzyść i dowody'], /6,4 punktu procentowego/);
  assert.match(fields(14)['Korzyść i dowody'], /18,5% wobec 11,5%/);
});

test('medical advice retains qualification, fluid limits and the boundary against self-prescribing', () => {
  assert.match(fields(8)['W praktyce'], /ograniczenie płynów/);
  assert.match(fields(8)['W praktyce'], /nie zwiększaj ich samodzielnie/);
  assert.match(fields(8)['W praktyce'], /Nie lecz ostrej kolki przymusowym piciem/);
  assert.match(fields(9)['W praktyce'], /Nie jest to wskazanie dla każdej osoby/);
  assert.match(fields(10)['W praktyce'], /nie przeprowadzaj samodzielnie detoksu/);
  assert.match(fields(11)['W praktyce'], /wybranym grupom ryzyka/);
  assert.match(fields(12)['W praktyce'], /Nie zaczynaj samodzielnie intensywnego treningu/);
  assert.match(fields(14)['W praktyce'], /To nie nakaz/);
  assert.doesNotMatch(text, /\b\d+\s*mg\/(?:dzień|dobę|d)\b|gwarantujemy|\p{Script=Han}/u);
});

test('Polish and EU procedures do not silently inherit foreign eligibility or reimbursement', () => {
  assert.match(fields(2)['W praktyce'], /Nie gwarantuje bezpłatności/);
  assert.match(fields(2)['W praktyce'], /nie obejmuje wyjazdu, którego celem jest zaplanowane leczenie/);
  assert.match(fields(5)['W praktyce'], /To limit wydania/);
  assert.match(fields(6)['Źródła'], /gov\.pl\/web\/zdrowie\/podstawowa-opieka-zdrowotna/);
  assert.match(fields(7).Ograniczenia, /nie kompletny polski program/);
  assert.match(fields(11).Weryfikacja, /Nie potwierdzono kryteriów polskiego programu/);
  assert.match(fields(14).Weryfikacja, /abstrakt autorów CHALLENGE/);
  assert.match(text, /nie jest oficjalne wydanie autora/);
  assert.match(text, /AI nie jest lekarzem/);
});

test('all chapter 16 advice is discoverable and all chapter links resolve to published entries', () => {
  const pairs = [['odstawiać', 1], ['EKUZ', 2], ['pomiarów', 3], ['zioła', 4], ['ważność', 5], ['pakiet', 6], ['dna oka', 7], ['kamicy', 8], ['moczanowej', 9], ['puryny', 10], ['HBsAg', 11], ['POChP', 12], ['UACR', 13], ['okrężnicy', 14]];
  for (const [query, n] of pairs) assert.ok(searchAdvice(chapters, query, { limit: 1000 }).some(r => r.entry.number === `16.${n}`), query);
  const ids = new Set(published(chapters.flatMap(c => c.entries)).map(e => e.id));
  for (const e of chapter.entries) for (const value of Object.values(e.fields)) {
    for (const [, href] of value.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)) {
      const match = /#(porada-\d+-\d+)$/.exec(href);
      if (match) assert.ok(ids.has(match[1]), href);
    }
  }
});

test('new chapter 16 does not restore housing records or introduce foreign emergency numbers', () => {
  const housing = chapters.find(c => c.id === '15');
  assert.equal(published(housing.entries).length, 0);
  assert.ok(housing.entries.every(e => e.fields.Status === 'needs_verification'));
  assert.doesNotMatch(text, /96110|12356|12315|12333|12378|\+86/);
  assert.match(read('README.md'), /\| \[16\. .*\| 14 \| 14 \|/);
});
