// Editorial regression guards for chapter 12 (business red lines); not legal advice.
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
const chapter = chapters.find(c => c.id === '12');
const entry = n => {
  const found = chapter.entries.find(e => e.number === `12.${n}`);
  assert.ok(found, `missing decision 12.${n}`);
  return found;
};
const f = n => entry(n).fields;

test('chapter 12 covers all 28 original items, all verified, with first and final spans', () => {
  assert.deepEqual(chapter.entries.map(e => Number(e.number.split('.')[1])), Array.from({ length: 28 }, (_, i) => i + 1));
  assert.deepEqual(published(chapter.entries).map(e => Number(e.number.split('.')[1])), Array.from({ length: 28 }, (_, i) => i + 1));
  assert.ok(chapter.entries.every(e => e.fields.Status === 'verified'));
  const text = readFileSync(new URL('../' + chapter.path, import.meta.url), 'utf8');
  assert.doesNotMatch(text, /\p{Script=Han}/u);
  assert.match(f(1).Oryginał, /#L23-L31\)/);
  assert.match(f(28).Oryginał, /#L266-L273\)/);
  const finalLine = readFileSync(new URL('../book/12-创业与做生意.md', import.meta.url), 'utf8').trimEnd().split('\n').at(-1);
  assert.ok(upstreamSpanOf(entry(28), root).trimEnd().endsWith(finalLine));
});

test('search discovers chapter 12 advice by plain Polish terms', () => {
  for (const [query, number] of [['przeżyjesz', '12.1'], ['poręczenia', '12.2'], ['kapitałową', '12.3'], ['podstawiaj', '12.4'], ['franczyzodawcę', '12.5'], ['REGON', '12.6'], ['koncesji', '12.7'], ['zatwierdzenia', '12.8'], ['alergenami', '12.9'], ['odchudzania', '12.10'], ['domieszki', '12.11'], ['zerowa', '12.12'], ['fikcyjna', '12.13'], ['zastępcze', '12.14'], ['zadatek', '12.15'], ['dopuszczeniem', '12.16'], ['podwyżki', '12.17'], ['przedsprzedażą', '12.18'], ['certyfikaty', '12.19'], ['podróbek', '12.20'], ['licencjonowane', '12.21'], ['procedurami', '12.22'], ['wykreślenie', '12.23'], ['brushing', '12.24'], ['sprawozdanie', '12.25'], ['zrzutki', '12.26'], ['immisje', '12.27'], ['wspólnika', '12.28']]) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === number), query);
  }
});

test('Polish law replaces the original one; grades match the original', () => {
  assert.match(f(1)['Korzyść i dowody'], /KC art\. 864/);
  assert.match(f(7)['Korzyść i dowody'], /KK art\. 171/);
  assert.match(f(13)['Korzyść i dowody'], /art\. 113/);
  assert.match(f(15)['Korzyść i dowody'], /KC art\. 394/);
  assert.match(f(16)['Korzyść i dowody'], /k\.p\. art\. 29/);
  assert.match(f(20)['Korzyść i dowody'], /p\.w\.p\. art\. 305/);
  assert.match(f(23)['Korzyść i dowody'], /art\. 21/);
  assert.match(f(26)['Korzyść i dowody'], /KK art\. 171/);
  assert.match(f(28)['Korzyść i dowody'], /KC art\. 860/);
  const grades = chapter.entries.map(e => e.fields['Ocena dowodów'][0]);
  assert.deepEqual(grades, ['B','A','A','A','A','A','A','A','A','A','A','A','A','A','A','A','C','B','C','A','A','B','A','B','A','A','A','C']);
  const plFields = JSON.stringify(chapter.entries.map(e => [e.fields['W praktyce'], e.fields['Korzyść i dowody'], e.fields.Ograniczenia].join('\n')));
  assert.doesNotMatch(plFields, /110|96110|12356|12315|12333|12378|\+86/);
  assert.ok(citedInputs(entry(1)).some(u => u.includes('lexlege')));
  assert.ok(citedInputs(entry(7)).some(u => u.includes('lexlege')));
  assert.ok(citedInputs(entry(13)).some(u => u.includes('lexlege')));
  assert.ok(citedInputs(entry(20)).some(u => u.includes('lexlege')));
  assert.ok(citedInputs(entry(23)).some(u => u.includes('lexlege')));
});

test('safety: emergency numbers only from the allowlist, no CN numbers leak', () => {
  const text = JSON.stringify(chapter.entries.map(e => e.fields));
  assert.doesNotMatch(text, /96110|12356|12315|12333|12378|\+86/);
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
  assert.match(text, /nie porada prawna/);
  assert.doesNotMatch(JSON.stringify(chapter.entries.map(e => Object.values(e.fields).join('\n'))), /gwarantujemy|na pewno wygrasz|dostaniesz odszkodowanie w wysokości/);
});
