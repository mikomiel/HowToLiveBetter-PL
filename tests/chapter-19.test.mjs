import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CHAPTERS, FIELDS, parseChapter, published } from '../reader.mjs';
import { searchAdvice } from '../tools/pl/search.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const chapters = CHAPTERS.map(c => ({ ...c, ...parseChapter(read(c.path), c.id) }));
const chapter = chapters.find(c => c.id === '19');
const text = read(chapter.path);
const f = n => chapter.entries[n - 1].fields;

test('chapter 19 preserves all 24 source decisions, source hash and pinned ranges', () => {
  assert.deepEqual(chapter.entries.map(e => e.number), Array.from({ length: 24 }, (_, i) => `19.${i + 1}`));
  const original = readFileSync(new URL('../book/19-在职离职和工伤.md', import.meta.url));
  assert.equal(createHash('sha256').update(original).digest('hex'), '3908c66940dae220d000456104a07dd13c8d56fe6bf746603e01b321a21d932b');
  for (let n = 1; n <= 24; n++) {
    assert.match(f(n).Oryginał, /\/e2605d3e2242bd6216c9255192b8a8957a08c55a\//);
    assert.match(f(n).Oryginał, new RegExp(`#L${15 + 9 * (n - 1)}-L${n === 24 ? 229 : 23 + 9 * (n - 1)}\\)`));
  }
  assert.doesNotMatch(text, /\p{Script=Han}|96110|12356|12315|12333|12378|\+86/u);
});

test('23 narrowed procedural scopes have grade C and incomplete tax advice stays unpublished', () => {
  assert.equal(published(chapter.entries).length, 23);
  const original = 'AAAAAABBAAAAAAABAAAAAABA';
  chapter.entries.forEach((e, i) => {
    assert.match(e.fields.Weryfikacja, /^2026-11-02; /);
    if (i === 17) return;
    for (const field of FIELDS) assert.ok(e.fields[field]?.trim(), e.number + ': ' + field);
    assert.match(e.fields['Ocena dowodów'], /^C — przepisy/);
    assert.ok(e.fields['Zmiany w adaptacji'].includes(`Oryginalne ${original[i]} zastąpiono C`), e.number);
  });
  assert.equal(f(18).Status, 'needs_verification');
  assert.equal(f(18)['W praktyce'], undefined);
  assert.equal(f(18)['Ocena dowodów'], undefined);
  assert.match(f(18).Ograniczenia, /Wymagane:/);
  assert.match(f(18).Ograniczenia, /issues\/32/);
});

test('pay, leave, dismissal and document claims preserve the Polish distinctions', () => {
  assert.match(f(1)['Korzyść i dowody'], /obok normalnego wynagrodzenia.*50% albo 100%/);
  assert.match(f(2)['W praktyce'], /20 dni.*26 dni/);
  assert.match(f(2)['Korzyść i dowody'], /302¹/);
  assert.match(f(4)['W praktyce'], /co najmniej 20 pracowników/);
  assert.match(f(4)['Korzyść i dowody'], /wyłącznym powodem/);
  assert.match(f(6)['W praktyce'], /21 dni/);
  assert.match(f(7).Ograniczenia, /nie gwarantujemy dnia namysłu/i);
  assert.match(f(8)['W praktyce'], /Nie kopiuj przy okazji kodu/);
  assert.match(f(17)['Korzyść i dowody'], /nie można uzależniać od wcześniejszego rozliczenia/);
  assert.match(f(20)['W praktyce'], /przed dopuszczeniem do pracy/);
  assert.match(f(23).Ograniczenia, /Odmowa i odwołanie do sądu to różne czynności/);
});

test('safety, benefits and agency claims avoid blanket medical or financial guarantees', () => {
  assert.match(f(9).Ograniczenia, /nie twierdzimy, że każde rozwiązanie umowy/i);
  assert.match(f(10)['W praktyce'], /bezpośrednim zagrożeniu/);
  assert.match(f(10)['Korzyść i dowody'], /ratowania życia lub mienia/);
  assert.match(f(12)['W praktyce'], /dzwoń pod 112/);
  assert.match(f(13)['Korzyść i dowody'], /nie jest prostą regułą obejmującą każdego pracownika/);
  assert.match(f(14).Ograniczenia, /nie to samo co każde orzeczenie o niepełnosprawności/i);
  assert.match(f(16).Ograniczenia, /węższe niż odczytany art/);
  assert.match(f(16).Weryfikacja, /nie przeczytano badań zdrowotnych/i);
  assert.match(f(24).Ograniczenia, /nie przenosimy zagranicznej gwarancji solidarnej odpowiedzialności/i);
});

test('published work scopes remain searchable and pending tax advice never becomes a card', () => {
  for (const [query, n] of [['nadgodzin',1],['urlopu',2],['próbny',3],['odprawy',4],['wypowiedzenia',5],['zwolnienie',6],['porozumienia',7],['dokumentację',8],['badania',9],['ochrony',10],['wypadku',11],['obecności',12],['wpłat',13],['uszczerbku',14],['rodziny',15],['nękanie',16],['świadectwo',17],['adresu',19],['potwierdzenia',20],['składek',21],['potrącenie',22],['zmieniającego',23],['agencję',24]]) {
    assert.ok(searchAdvice(chapters, query, { limit: 1000 }).some(r => r.entry.number === `19.${n}`), query);
  }
  assert.ok(searchAdvice(chapters, 'podatek', { limit: 1000 }).every(r => r.entry.number !== '19.18'));
  const withdrawn = parseChapter(text.replace('- Status: verified', '- Status: needs_verification'), '19');
  assert.equal(published(withdrawn.entries).length, 22);
  assert.throws(() => parseChapter(text.replace('- Status: verified', '- Status: ready'), '19'), /Nieprawidłowy stan/);
  assert.throws(() => parseChapter(text.replace(/- W praktyce: [^\n]+\n/, ''), '19'), /W praktyce/);
});

test('issue routing preserves verification gates and does not claim expert approval', () => {
  assert.match(read('AGENTS.md'), /issues w tym repozytorium/);
  assert.match(read('AGENTS.md'), /Samo utworzenie lub zamknięcie issue nie nadaje verified/);
  assert.match(read('README.md'), /https:\/\/github\.com\/mikomiel\/HowToLiveBetter-PL\/issues/);
  assert.match(read('README.md'), /\| \[19\. .*\| 24 \| 23 \|/);
  for (const wording of ['nie jest oficjalne wydanie autora', 'nie jest lekarzem', 'nie jest adwokatem ani radcą prawnym', 'nie porada prawna']) assert.ok(text.includes(wording));
});
