// Editorial regression guards for chapter 08 (legal and property safety); not legal advice.
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
const chapter = chapters.find(c => c.id === '08');
const entry = n => {
  const found = chapter.entries.find(e => e.number === `08.${n}`);
  assert.ok(found, `missing decision 08.${n}`);
  return found;
};
const f = n => entry(n).fields;

test('chapter 08 covers all 46 original items, all verified, with first and final spans', () => {
  assert.deepEqual(chapter.entries.map(e => Number(e.number.split('.')[1])), Array.from({ length: 46 }, (_, i) => i + 1));
  assert.deepEqual(published(chapter.entries).map(e => Number(e.number.split('.')[1])), Array.from({ length: 46 }, (_, i) => i + 1));
  assert.ok(chapter.entries.every(e => e.fields.Status === 'verified'));
  const text = readFileSync(new URL('../' + chapter.path, import.meta.url), 'utf8');
  assert.doesNotMatch(text, /\p{Script=Han}/u);
  assert.match(f(1).Oryginał, /#L25-L33\)/);
  assert.match(f(46).Oryginał, /#L430-L437\)/);
  const finalLine = readFileSync(new URL('../book/08-别把自己搭进去.md', import.meta.url), 'utf8').trimEnd().split('\n').at(-1);
  assert.ok(upstreamSpanOf(entry(46), root).trimEnd().endsWith(finalLine));
});

test('search discovers chapter 08 advice by plain Polish terms', () => {
  for (const [query, number] of [['wypadek drogowy', '08.1'], ['obrona konieczna', '08.11'], ['przedawnienie', '08.19'], ['przemoc domowa', '08.43'], ['szantaż', '08.32'], ['pies smycz', '08.30'], ['hulajnoga alkohol', '08.7'], ['łapówka', '08.40'], ['nagrywanie rozmowy', '08.41'], ['raport BIK', '08.9'], ['zgwałcenie zgoda', '08.31']]) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === number), query);
  }
});

test('Polish law replaces the Chinese one; grades match the original', () => {
  assert.match(f(1)['Korzyść i dowody'], /KK art\. 162/);
  assert.match(f(1)['Korzyść i dowody'], /art\. 177/);
  assert.match(f(7)['Korzyść i dowody'], /art\. 178a/);
  assert.match(f(11)['Korzyść i dowody'], /art\. 25/);
  assert.match(f(19)['Korzyść i dowody'], /sześć lat/);
  assert.match(f(19)['Korzyść i dowody'], /art\. 118/);
  assert.match(f(30)['Korzyść i dowody'], /art\. 431/);
  assert.match(f(31)['Korzyść i dowody'], /art\. 197/);
  assert.match(f(32)['Korzyść i dowody'], /art\. 190/);
  assert.match(f(40)['Korzyść i dowody'], /art\. 229/);
  assert.match(f(41)['Korzyść i dowody'], /art\. 267/);
  assert.match(f(43)['Korzyść i dowody'], /art\. 11a/);
  const grades = chapter.entries.map(e => e.fields['Ocena dowodów'][0]);
  assert.deepEqual(grades, ['A','A','B','B','A','A','A','A','A','A','A','A','A','B','A','A','A','A','A','A','A','A','A','A','A','A','B','B','B','A','B','A','A','A','A','B','A','A','A','A','A','C','A','B','B','B']);
  const plFields = JSON.stringify(chapter.entries.map(e => [e.fields['W praktyce'], e.fields['Korzyść i dowody'], e.fields.Ograniczenia].join('\n')));
  assert.doesNotMatch(plFields, /110|96110|12356|12315|12333|\+86/);
  assert.ok(citedInputs(entry(2)).some(u => u.includes('gov.pl')));
  assert.ok(citedInputs(entry(9)).some(u => u.includes('bik.pl')));
  assert.ok(citedInputs(entry(14)).some(u => /^10\.\d{4,9}\//i.test(u)), '08.14 cites DOI sources');
});

test('safety: emergency numbers only from the allowlist, no CN numbers leak', () => {
  const text = JSON.stringify(chapter.entries.map(e => e.fields));
  assert.doesNotMatch(text, /96110|12356|12315|12333|12378|\+86/);
  assert.match(f(1)['W praktyce'], /112/);
  assert.match(f(2)['W praktyce'], /997/);
  assert.match(f(14)['W praktyce'], /116 123/);
  assert.match(f(15)['W praktyce'], /997/);
  const allow = new Set(['112', '997', '998', '999', '116 123', '116 111', '992', '800 702 222', '22 621 02 56']);
  for (const e of chapter.entries) {
    const stripped = JSON.stringify(e.fields).replace(/https?:\/\/[^\s)"]+/g, ' ').replace(/10\.\d{4,9}\/[^\s)"]+/g, ' ');
    const nums = [...stripped.matchAll(/\b\d{3}[\s-]?\d{3}[\s-]?\d{3}\b/g)].map(m => m[0].replace(/\s+/g, ' '));
    for (const num of nums) assert.ok(allow.has(num), `${e.number}: ${num}`);
  }
});

test('cross-references point only to published porady of adapted chapters', () => {
  const publishedIds = new Set(published(chapters.flatMap(c => c.entries)).map(e => e.id));
  for (const e of chapter.entries) {
    for (const value of Object.values(e.fields)) {
      for (const [, href] of String(value).matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)) {
        if (href.startsWith('#')) assert.ok(publishedIds.has(href.slice(1)), `${e.number}: ${href}`);
        else {
          const m = /^([^/#]+\.md)(#porada-(\d+)-(\d+))$/.exec(href);
          if (m) assert.ok(publishedIds.has(`porada-${m[3]}-${m[4]}`), `${e.number}: ${href}`);
        }
      }
    }
  }
});

test('no legal-advice framing: procedural descriptions with limits, not guarantees; AI is not a lawyer', () => {
  const text = readFileSync(new URL('../' + chapter.path, import.meta.url), 'utf8');
  assert.match(text, /nie jest oficjalne wydanie autora/);
  assert.match(text, /nie jest adwokatem ani radcą prawnym/);
  assert.match(text, /nie orzeka się kary śmierci/);
  assert.match(f(5).Ograniczenia, /nie jest porada/);
  assert.match(f(20)['Korzyść i dowody'], /art\. 300/);
  assert.match(f(35)['Korzyść i dowody'], /art\. 552/);
  assert.match(f(38)['Korzyść i dowody'], /art\. 298/);
  assert.doesNotMatch(JSON.stringify(chapter.entries.map(e => Object.values(e.fields).join('\n'))), /gwarantujemy|na pewno wygrasz|dostaniesz odszkodowanie w wysokości/);
});
