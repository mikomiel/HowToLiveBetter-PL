// Editorial regression guards and consumer checks, not financial/legal/tax advice.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CHAPTERS, parseChapter, published } from '../reader.mjs';
import { upstreamSpanOf } from '../tools/pl/lint.mjs';
import { searchAdvice } from '../tools/pl/search.mjs';
import { citedInputs } from '../tools/pl/sources.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const chapters = CHAPTERS.map(c => ({ ...c, ...parseChapter(readFileSync(new URL('../' + c.path, import.meta.url), 'utf8'), c.id) }));
const chapter = chapters.find(c => c.id === '05');
const entry = n => {
  const found = chapter.entries.find(e => e.number === `05.${n}`);
  assert.ok(found, `missing decision 05.${n}`);
  return found;
};
const f = n => entry(n).fields;
const ready = [1, 2, 5, 6, 7, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 32, 36, 37, 39, 40, 41, 42, 44, 45, 47, 48, 51];
const verify = [8, 10];
const localize = [3, 4, 22, 29, 30, 31, 33, 34, 35, 38, 43, 46, 49, 50];

test('chapter 05 covers all 51 original items with explicit decisions and final span', () => {
  assert.deepEqual(chapter.entries.map(e => Number(e.number.split('.')[1])), Array.from({ length: 51 }, (_, i) => i + 1));
  assert.deepEqual(published(chapter.entries).map(e => Number(e.number.split('.')[1])), ready);
  for (const [state, list] of [['needs_verification', verify], ['needs_localization', localize]]) {
    assert.deepEqual(chapter.entries.filter(e => e.fields.Status === state).map(e => Number(e.number.split('.')[1])), list);
    for (const n of list) {
      assert.ok(entry(n).title.startsWith('Rekord redakcyjny:'));
      assert.equal(f(n)['W praktyce'], undefined);
    }
  }
  assert.match(f(1).Oryginał, /#L23-L31\)/);
  assert.match(f(51).Oryginał, /#L473-L481\)/);
  const finalLine = readFileSync(new URL('../book/05-不要浪费钱.md', import.meta.url), 'utf8').trimEnd().split('\n').at(-1);
  assert.ok(upstreamSpanOf(entry(51), root).trimEnd().endsWith(finalLine));
});

test('search discovers new money advice and excludes withheld records', () => {
  for (const [query, number] of [['odstąpienie', '05.23'], ['IKZE', '05.20'], ['CEPiK', '05.48'], ['BFG', '05.42'], ['RRSO', '05.7'], ['rękojmia', '05.11']]) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === number), query);
  }
  const withheld = new Set([...verify, ...localize].map(n => `05.${n}`));
  for (const n of [...verify, ...localize]) {
    const query = entry(n).title.replace('Rekord redakcyjny: ', '');
    assert.ok(searchAdvice(chapters, query, { limit: 200 }).every(r => !withheld.has(r.entry.number)), query);
  }
});

test('consumer-law anchors keep their Polish basis: 14-day withdrawal, rękojmia, BFG, art. 812', () => {
  assert.match(f(23)['W praktyce'], /14 dni od otrzymania towaru/);
  assert.match(f(23)['W praktyce'], /12 miesięcy/);
  assert.match(f(23)['Korzyść i dowody'], /Ustawa o prawach konsumenta/);
  assert.match(f(11)['Korzyść i dowody'], /2 lata/);
  assert.match(f(42)['Korzyść i dowody'], /100 000 euro/);
  assert.match(f(42)['Korzyść i dowody'], /7 dni roboczych/);
  assert.match(f(41)['Korzyść i dowody'], /Art\. 812/);
  assert.match(f(41)['Korzyść i dowody'], /30 dni/);
  assert.match(f(41).Ograniczenia, /6 miesięcy/);
  assert.equal(citedInputs(entry(23))[0], 'https://konsument.gov.pl/zakupy-przez-internet-odstapienie-od-umowy');
  assert.equal(citedInputs(entry(42))[0], 'https://bfg.pl/');
  assert.ok(citedInputs(entry(41)).some(u => u === 'https://sip.lex.pl/akty-prawne/dzu-dziennik-ustaw/kodeks-cywilny-16785996/art-812'));
});

test('money chapter never becomes investment/tax/legal advice and keeps disclaimers', () => {
  const intro = readFileSync(new URL('../book/pl/05-nie-marnuj-pieniedzy.md', import.meta.url), 'utf8');
  assert.match(intro, /nie jest poradą inwestycyjną, podatkową, prawną ani ubezpieczeniową/);
  for (const n of [15, 16, 17, 18, 19, 27, 28, 37, 45]) {
    assert.match(f(n).Ograniczenia, /nie jest porad(a|ą)/i, `05.${n}`);
  }
  assert.match(f(2).Ograniczenia, /porada podatkowa/i);
  assert.match(f(5).Ograniczenia, /porada podatkowa/i);
  assert.match(f(44).Ograniczenia, /porada prawna/i);
  assert.match(f(25).Ograniczenia, /porada ubezpieczeniowa/i);
  assert.match(f(39).Ograniczenia, /porada ubezpieczeniowa/i);
  assert.match(f(40).Ograniczenia, /porada ubezpieczeniowa/i);
  assert.doesNotMatch(f(17)['W praktyce'] + f(19)['W praktyce'], /kup tylko|kup.*akcje jednej/i);
  assert.match(f(45)['W praktyce'], /Nie przeznaczaj oszczędności na kryptowaluty/);
  assert.match(f(17)['W praktyce'], /fundusz indeksowy/);
  assert.match(f(5)['W praktyce'], /traktuj każdy zakup losu jako zapłaconą rozrywkę/);
});

test('no new phone numbers and no Chinese service numbers leak into published fields', () => {
  const text = JSON.stringify(chapter.entries.filter(e => e.fields.Status === 'verified').map(e => e.fields));
  assert.doesNotMatch(text, /12300|12315|12378|12345/);
  assert.doesNotMatch(text, /\+86|wechat|支付宝|微信/);
  for (const n of ready) {
    const numbers = [...JSON.stringify(f(n)).matchAll(/\b\d{3}[\s-]?\d{3}[\s-]?\d{3}\b/g)].map(m => m[0]);
    for (const num of numbers) assert.ok(['112'].includes(num.replace(/\s/g, '')), `05.${n}: ${num}`);
  }
});

test('tax, pension and insurance localization keeps PL institutions, not CN ones', () => {
  assert.match(f(2)['W praktyce'], /Twój e-PIT/);
  assert.doesNotMatch(f(2)['W praktyce'], /12万|400元|个人所得税/);
  assert.match(f(20)['W praktyce'], /IKZE/);
  assert.match(f(13)['W praktyce'], /NFZ/);
  assert.doesNotMatch(f(13)['W praktyce'], /医保|共济/);
  assert.match(f(26)['W praktyce'], /OC/);
  assert.match(f(48)['W praktyce'], /CEPiK/);
  assert.match(f(36)['Korzyść i dowody'], /1169\/2011/);
  assert.match(f(32)['W praktyce'], /CE/);
  assert.doesNotMatch(f(32)['W praktyce'], /3C|CCC/);
});

test('studies keep populations, periods and non-advice framing', () => {
  assert.match(f(15)['Korzyść i dowody'], /11,4%.*17,9%/);
  assert.match(f(15)['Korzyść i dowody'], /1991–1996|1991-1996/);
  assert.match(f(21)['Korzyść i dowody'], /7752|4,3/);
  assert.match(f(37)['Korzyść i dowody'], /PGR 0,148.*PLR 0,098/s);
  assert.match(f(37)['Korzyść i dowody'], /3,4 p\.p\./);
  assert.match(f(19)['Korzyść i dowody'], /Markowitz 1952/);
  assert.match(f(24)['Korzyść i dowody'], /Kahneman|Tversky/);
});
