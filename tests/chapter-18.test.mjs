import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CHAPTERS, FIELDS, parseChapter, published } from '../reader.mjs';
import { searchAdvice } from '../tools/pl/search.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const chapters = CHAPTERS.map(c => ({ ...c, ...parseChapter(read(c.path), c.id) }));
const chapter = chapters.find(c => c.id === '18');
const text = read(chapter.path);
const f = n => chapter.entries[n - 1].fields;

test('chapter 18 preserves all seven identifiers and exact pinned upstream spans', () => {
  assert.deepEqual(chapter.entries.map(e => e.number), [1, 2, 3, 4, 5, 6, 7].map(n => `18.${n}`));
  const original = readFileSync(new URL('../book/18-养孩子划不划算.md', import.meta.url));
  assert.equal(createHash('sha256').update(original).digest('hex'), '04fb9acbadf2f4368f4063295229c0fe63136e2c5f35999df3ff7f248b615af5');
  for (let n = 1; n <= 7; n++) {
    assert.match(f(n).Oryginał, /\/e2605d3e2242bd6216c9255192b8a8957a08c55a\//);
    assert.match(f(n).Oryginał, new RegExp(`#L${7 + 9 * (n - 1)}-L${n === 7 ? 68 : 15 + 9 * (n - 1)}\\)`));
  }
  assert.doesNotMatch(text, /\p{Script=Han}|96110|12356|12315|12333|12378|\+86/u);
});

test('published scopes have full fields and disclose every changed grade', () => {
  assert.equal(published(chapter.entries).length, 7);
  const original = 'AAACCCA', adapted = 'CCCCCCB';
  chapter.entries.forEach((e, i) => {
    for (const field of FIELDS) assert.ok(e.fields[field]?.trim(), e.number + ': ' + field);
    assert.match(e.fields.Weryfikacja, /^2026-11-02; /);
    assert.equal(e.fields['Ocena dowodów'][0], adapted[i], e.number);
    if (original[i] !== adapted[i]) assert.ok(e.fields['Zmiany w adaptacji'].includes(`Oryginalne ${original[i]} zastąpiono ${adapted[i]}`), e.number);
  });
});

test('Polish benefit, tax and labour scopes preserve material distinctions and exceptions', () => {
  assert.match(f(1)['W praktyce'], /odliczeniem od podatku/);
  assert.match(f(1)['Korzyść i dowody'], /dodatkowy zwrot, ale ograniczony/);
  assert.match(f(2)['W praktyce'], /41 tygodni.*łącznie/);
  assert.match(f(2)['W praktyce'], /nieprzenoszalne 9 tygodni/);
  assert.match(f(2)['W praktyce'], /urlop pracowniczy nie jest tym samym/);
  assert.match(f(3)['Korzyść i dowody'], /upadłości lub likwidacji/);
  assert.match(f(3)['Korzyść i dowody'], /krótszym niż 4 godziny/);
  assert.match(f(3)['Źródła'], /DU\/2026\/1245/);
});

test('opinions are not presented as efficacy research or a universal parenthood calculation', () => {
  for (const n of [4, 5, 6]) {
    assert.match(f(n)['Ocena dowodów'], /^C — osąd/);
    assert.match(f(n)['Źródła'], /źródło opinii, nie badanie skuteczności/);
    assert.match(f(n).Weryfikacja, /nie (zweryfikowano|wyliczono|stawia się)/);
  }
  assert.match(f(4)['W praktyce'], /Nie przeliczaj automatycznie czasu/);
  assert.match(f(5)['W praktyce'], /18-rodzicielstwo-decyzje-koszty-i-wsparcie\.md#porada-18-1/);
  assert.match(f(6)['W praktyce'], /bez wymuszania zgody/);
  assert.match(f(6)['W praktyce'], /nie musisz uzasadniać wyboru wyłącznie pieniędzmi/i);
  assert.match(f(7)['Korzyść i dowody'], /dodatni test ciążowy, nie urodzenie/);
  assert.match(f(7)['Korzyść i dowody'], /na przeniesiony zarodek/);
  assert.match(f(7).Ograniczenia, /dane o urodzeniach w 2024 r\. są wstępne/);
  assert.match(f(7).Ograniczenia, /nie porównujemy wprost tych procentów z danymi z 2022/);
});

test('seven published scopes are searchable and withdrawal never publishes a pending entry', () => {
  for (const [query, n] of [['PIT', 1], ['zasiłek', 2], ['karmienie', 3], ['zadania', 4], ['budżet', 5], ['presji', 6], ['HFEA', 7]]) {
    assert.ok(searchAdvice(chapters, query, { limit: 1000 }).some(r => r.entry.number === `18.${n}`), query);
  }
  const withdrawn = parseChapter(text.replace('- Status: verified', '- Status: needs_verification'), '18');
  assert.equal(published(withdrawn.entries).length, 6);
  assert.ok(published(withdrawn.entries).every(e => e.number !== '18.1'));
  assert.throws(() => parseChapter(text.replace('- Status: verified', '- Status: ready'), '18'), /Nieprawidłowy stan/);
  assert.throws(() => parseChapter(text.replace(/- W praktyce: [^\n]+\n/, ''), '18'), /W praktyce/);
});

test('chapter boundaries and published totals do not claim specialist approval or deployment', () => {
  for (const wording of ['nie jest oficjalne wydanie autora', 'nie jest lekarzem', 'nie jest adwokatem ani radcą prawnym', 'nie porada prawna']) assert.ok(text.includes(wording));
  assert.match(read('README.md'), /\| \[18\. .*\| 7 \| 7 \|/);
  assert.match(text, /nie zatwierdzenie przez prawnika, lekarza/);
});
