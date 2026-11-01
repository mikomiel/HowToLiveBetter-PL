// Editorial regression guards for chapter 11 (IT red lines); not legal advice.
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
const chapter = chapters.find(c => c.id === '11');
const entry = n => {
  const found = chapter.entries.find(e => e.number === `11.${n}`);
  assert.ok(found, `missing decision 11.${n}`);
  return found;
};
const f = n => entry(n).fields;

test('chapter 11 covers all 21 original items, all verified, with first and final spans', () => {
  assert.deepEqual(chapter.entries.map(e => Number(e.number.split('.')[1])), Array.from({ length: 21 }, (_, i) => i + 1));
  assert.deepEqual(published(chapter.entries).map(e => Number(e.number.split('.')[1])), Array.from({ length: 21 }, (_, i) => i + 1));
  assert.ok(chapter.entries.every(e => e.fields.Status === 'verified'));
  const text = readFileSync(new URL('../' + chapter.path, import.meta.url), 'utf8');
  assert.doesNotMatch(text, /\p{Script=Han}/u);
  assert.match(f(1).Oryginał, /#L21-L29\)/);
  assert.match(f(21).Oryginał, /#L201-L208\)/);
  const finalLine = readFileSync(new URL('../book/11-程序员和技术人容易踩的红线.md', import.meta.url), 'utf8').trimEnd().split('\n').at(-1);
  assert.ok(upstreamSpanOf(entry(21), root).trimEnd().endsWith(finalLine));
});

test('search discovers chapter 11 advice by plain Polish terms', () => {
  for (const [query, number] of [['obrońcy', '11.1'], ['cheatów', '11.2'], ['żądań', '11.3'], ['scraping', '11.4'], ['hazard', '11.5'], ['repozytoriów', '11.6'], ['tajemnicy', '11.7'], ['kamerach', '11.8'], ['upoważnienia', '11.9'], ['podatności', '11.10'], ['VPN', '11.11'], ['konkurencji', '11.12'], ['pracodawcy', '11.13'], ['GPL', '11.14'], ['prywatności', '11.15'], ['retencji', '11.16'], ['AI Act', '11.17'], ['reklam', '11.18'], ['pośredniej', '11.19'], ['cracków', '11.20'], ['DDoS', '11.21']]) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === number), query);
  }
});

test('Polish law replaces the original one; grades match the original', () => {
  assert.match(f(2)['Korzyść i dowody'], /art\. 269b/);
  assert.match(f(6)['Korzyść i dowody'], /art\. 268a/);
  assert.match(f(9)['Korzyść i dowody'], /art\. 269c/);
  assert.match(f(12)['Korzyść i dowody'], /art\. 101/);
  assert.match(f(15)['Korzyść i dowody'], /RODO/);
  assert.match(f(21)['Korzyść i dowody'], /art\. 269a/);
  const grades = chapter.entries.map(e => e.fields['Ocena dowodów'][0]);
  assert.deepEqual(grades, ['C','A','A','A','A','A','A','A','A','A','B','A','A','B','B','A','B','A','C','A','A']);
  const plFields = JSON.stringify(chapter.entries.map(e => [e.fields['W praktyce'], e.fields['Korzyść i dowody'], e.fields.Ograniczenia].join('\n')));
  assert.doesNotMatch(plFields, /110|96110|12356|12315|12333|\+86/);
  assert.ok(citedInputs(entry(2)).some(u => u.includes('lexlege')));
  assert.ok(citedInputs(entry(9)).some(u => u.includes('lexlege')));
  assert.ok(citedInputs(entry(15)).some(u => u.includes('eur-lex')));
  assert.ok(citedInputs(entry(21)).some(u => u.includes('lexlege')));
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
