// Editorial regression guards for chapter 10 (relationships and marriage); not legal or life advice.
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
const chapter = chapters.find(c => c.id === '10');
const entry = n => {
  const found = chapter.entries.find(e => e.number === `10.${n}`);
  assert.ok(found, `missing decision 10.${n}`);
  return found;
};
const f = n => entry(n).fields;

test('chapter 10 covers all 23 original items, all verified, with first and final spans', () => {
  assert.deepEqual(chapter.entries.map(e => Number(e.number.split('.')[1])), Array.from({ length: 23 }, (_, i) => i + 1));
  assert.deepEqual(published(chapter.entries).map(e => Number(e.number.split('.')[1])), Array.from({ length: 23 }, (_, i) => i + 1));
  assert.ok(chapter.entries.every(e => e.fields.Status === 'verified'));
  const text = readFileSync(new URL('../' + chapter.path, import.meta.url), 'utf8');
  assert.doesNotMatch(text, /\p{Script=Han}/u);
  assert.match(f(1).Oryginał, /#L21-L29\)/);
  assert.match(f(23).Oryginał, /#L219-L226\)/);
  const finalLine = readFileSync(new URL('../book/10-恋爱和结婚划不划算.md', import.meta.url), 'utf8').trimEnd().split('\n').at(-1);
  assert.ok(upstreamSpanOf(entry(23), root).trimEnd().endsWith(finalLine));
});

test('search discovers chapter 10 advice by plain Polish terms', () => {
  for (const [query, number] of [['speed dating', '10.1'], ['stalking', '10.2'], ['flirt', '10.3'], ['wariancji', '10.4'], ['36 pytań', '10.5'], ['odległość', '10.6'], ['GUS', '10.7'], ['nieodpłatnej', '10.9'], ['intercyzę', '10.10'], ['pożyczka', '10.11'], ['wierzyciela', '10.12'], ['bigamia', '10.13'], ['przedślubne', '10.14'], ['rozwód', '10.15'], ['kolumny', '10.16'], ['wrogość', '10.17'], ['testament', '10.18'], ['orientacji', '10.19'], ['terapię', '10.20'], ['konkubinat', '10.21'], ['darowizn', '10.22'], ['alimenty', '10.23']]) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === number), query);
  }
});

test('Polish law replaces the original one; grades match the original', () => {
  assert.match(f(2)['Korzyść i dowody'], /art\. 190a/);
  assert.match(f(10)['Korzyść i dowody'], /art\. 47/);
  assert.match(f(11)['Korzyść i dowody'], /art\. 527/);
  assert.match(f(12)['Korzyść i dowody'], /art\. 41/);
  assert.match(f(13)['Korzyść i dowody'], /art\. 206/);
  assert.match(f(15)['Korzyść i dowody'], /art\. 56/);
  assert.match(f(18)['Korzyść i dowody'], /art\. 931/);
  assert.match(f(22)['Korzyść i dowody'], /art\. 37/);
  assert.match(f(23)['Korzyść i dowody'], /art\. 135/);
  assert.match(f(23)['Korzyść i dowody'], /art\. 209/);
  const grades = chapter.entries.map(e => e.fields['Ocena dowodów'][0]);
  assert.deepEqual(grades, ['A','A','B','A','B','B','A','A','A','A','A','A','A','B','A','C','B','A','A','A','A','A','A']);
  const plFields = JSON.stringify(chapter.entries.map(e => [e.fields['W praktyce'], e.fields['Korzyść i dowody'], e.fields.Ograniczenia].join('\n')));
  assert.doesNotMatch(plFields, /110|96110|12356|12315|12333|\+86/);
  assert.ok(citedInputs(entry(2)).some(u => u.includes('lexlege')));
  assert.ok(citedInputs(entry(13)).some(u => u.includes('lexlege')));
  assert.ok(citedInputs(entry(1)).some(u => /^10\.\d{4,9}\//i.test(u)));
  assert.ok(citedInputs(entry(8)).some(u => /^10\.\d{4,9}\//i.test(u)));
  assert.ok(citedInputs(entry(20)).some(u => /^10\.\d{4,9}\//i.test(u)));
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
