// Editorial regression guards for chapter 07 (money and social security); not legal/financial advice.
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
const chapter = chapters.find(c => c.id === '07');
const entry = n => {
  const found = chapter.entries.find(e => e.number === `07.${n}`);
  assert.ok(found, `missing decision 07.${n}`);
  return found;
};
const f = n => entry(n).fields;

test('chapter 07 covers all 23 original items, all verified, with first and final spans', () => {
  assert.deepEqual(chapter.entries.map(e => Number(e.number.split('.')[1])), Array.from({ length: 23 }, (_, i) => i + 1));
  assert.deepEqual(published(chapter.entries).map(e => Number(e.number.split('.')[1])), Array.from({ length: 23 }, (_, i) => i + 1));
  const text = readFileSync(new URL('../' + chapter.path, import.meta.url), 'utf8');
  assert.doesNotMatch(text, /\p{Script=Han}/u);
  assert.match(f(1).Oryginał, /#L21-L29\)/);
  assert.match(f(23).Oryginał, /#L219-L226\)/);
  const finalLine = readFileSync(new URL('../book/07-没钱的时候怎么活.md', import.meta.url), 'utf8').trimEnd().split('\n').at(-1);
  assert.ok(upstreamSpanOf(entry(23), root).trimEnd().endsWith(finalLine));
});

test('search discovers chapter 07 advice by plain Polish terms', () => {
  for (const [query, number] of [['zasiłek dla bezrobotnych', '07.1'], ['skarga PIP wynagrodzenie', '07.2'], ['nieodpłatna pomoc prawna', '07.3'], ['noclegownia schronisko', '07.4'], ['KFS szkolenie', '07.13'], ['upadłość konsumencka', '07.19'], ['restrukturyzacja zadłużenia BIK', '07.23'], ['dowód osobisty zgubiłem', '07.11']]) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === number), query);
  }
});

test('Polish institutions replace the Chinese ones; grades match the original', () => {
  assert.match(f(1)['W praktyce'], /PUP/);
  assert.match(f(1)['W praktyce'], /art\. 71/);
  assert.match(f(1)['Korzyść i dowody'], /1200 zł/);
  assert.match(f(2)['W praktyce'], /PIP/);
  assert.match(f(2)['Koszt'], /art\. 96/);
  assert.match(f(3)['Korzyść i dowody'], /nieodpłatnej pomocy prawnej/i);
  assert.match(f(4)['W praktyce'], /MOPS/);
  assert.match(f(7)['W praktyce'], /zasiłek stały/);
  assert.match(f(9)['Korzyść i dowody'], /art\. 68/);
  assert.match(f(9).Ograniczenia, /30 dniach/);
  assert.match(f(10)['Korzyść i dowody'], /182/);
  assert.match(f(16)['W praktyce'], /uchwal[a-zł]* rady gminy|lokal socjalny/i);
  assert.match(f(18)['Korzyść i dowody'], /art\. 5–6|okresy składkowe/i);
  assert.match(f(19)['Korzyść i dowody'], /art\. 106/);
  assert.match(f(22)['Korzyść i dowody'], /647¹/);
  assert.match(f(23)['Korzyść i dowody'], /75c/);
  const grades = chapter.entries.map(e => e.fields['Ocena dowodów'][0]);
  assert.deepEqual(grades, ['A','A','A','A','A','B','A','A','A','A','A','B','A','A','A','B','B','A','A','B','B','A','B']);
  const plFields = JSON.stringify(chapter.entries.map(e => [e.fields['W praktyce'], e.fields['Korzyść i dowody'], e.fields.Ograniczenia].join('\n')));
  assert.doesNotMatch(plFields, /12333|12348|12378|社会保险法|劳动合同法|医保|低保|救助站|SAMR|NMPA/);
  assert.equal(citedInputs(entry(9))[0], 'https://www.nfz.gov.pl/dla-pacjenta/ubezpieczenia-w-nfz/jak-sie-ubezpieczyc-dobrowolnie/');
  assert.ok(citedInputs(entry(23)).some(u => u.includes('bik.pl')));
});

test('safety: emergency numbers only from the allowlist, no CN numbers leak', () => {
  const text = JSON.stringify(chapter.entries.map(e => e.fields));
  assert.doesNotMatch(text, /12333|12348|12378|12315|\+86/);
  assert.match(f(10)['W praktyce'], /112/);
  assert.match(f(4).Ograniczenia, /112/);
  assert.match(f(15)['W praktyce'], /997/);
  assert.match(f(19)['W praktyce'], /116 123/);
  assert.match(f(21)['Koszt'], /116 123/);
  const allow = new Set(['112', '997', '998', '999', '116 123', '116 111', '992', '800 702 222', '22 621 02 56']);
  for (const e of chapter.entries) {
    const stripped = JSON.stringify(e.fields).replace(/https?:\/\/[^\s)\"]+/g, ' ').replace(/10\.\d{4,9}\/[^\s)\"]+/g, ' ');
    const nums = [...stripped.matchAll(/\b\d{3}[\s-]?\d{3}[\s-]?\d{3}\b/g)].map(m => m[0].replace(/\s+/g, ' '));
    for (const num of nums) assert.ok(allow.has(num), `${e.number}: ${num}`);
  }
});

test('cross-references point only to published porady of adapted chapters', () => {
  const publishedIds = new Set(published(chapters.flatMap(c => c.entries)).map(e => e.id));
  for (const e of chapter.entries) {
    for (const value of Object.values(e.fields)) {
      for (const [, href] of String(value).matchAll(/\[[^\]]+\]\(([^()\s]+)\)/g)) {
        if (href.startsWith('#')) assert.ok(publishedIds.has(href.slice(1)), `${e.number}: ${href}`);
        else {
          const m = /^([^/#]+\.md)(#porada-(\d+)-(\d+))$/.exec(href);
          if (m) assert.ok(publishedIds.has(`porada-${m[3]}-${m[4]}`), `${e.number}: ${href}`);
        }
      }
    }
  }
});

test('no legal/financial advice framing: procedural descriptions with limits, not guarantees', () => {
  const text = JSON.stringify(chapter.entries.map(e => Object.values(e.fields).join('\n')));
  assert.doesNotMatch(text, /gwarantujemy|na pewno dostaniesz|zwrot z urzędu skarbowego/);
  assert.match(f(2)['Korzyść i dowody'], /nie zawsze oznacza pieniądze|bezskuteczna/i);
  assert.match(f(19).Ograniczenia, /nie wszystkie długi/i);
  assert.match(f(20)['W praktyce'], /OWU/i);
  assert.match(f(23).Ograniczenia, /nie jest przestępstwem/i);
});
