// Editorial regression guards for chapter 15 (renting and buying a flat); not legal or financial advice.
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
const chapter = chapters.find(c => c.id === '15');
const entry = n => {
  const found = chapter.entries.find(e => e.number === `15.${n}`);
  assert.ok(found, `missing decision 15.${n}`);
  return found;
};
const f = n => entry(n).fields;

test('chapter 15 covers all 18 original items, all verified, with first and final spans', () => {
  assert.deepEqual(chapter.entries.map(e => Number(e.number.split('.')[1])), Array.from({ length: 18 }, (_, i) => i + 1));
  assert.deepEqual(published(chapter.entries).map(e => Number(e.number.split('.')[1])), Array.from({ length: 18 }, (_, i) => i + 1));
  assert.ok(chapter.entries.every(e => e.fields.Status === 'verified'));
  const text = readFileSync(new URL('../' + chapter.path, import.meta.url), 'utf8');
  assert.doesNotMatch(text, /\p{Script=Han}/u);
  assert.match(f(1).Oryginał, /#L7-L15\)/);
  assert.match(f(18).Oryginał, /#L160-L167\)/);
  const finalLine = readFileSync(new URL('../book/15-租房与买房.md', import.meta.url), 'utf8').trimEnd().split('\n').at(-1);
  assert.ok(upstreamSpanOf(entry(18), root).trimEnd().endsWith(finalLine));
});

test('search discovers chapter 15 advice by plain Polish terms', () => {
  for (const [query, number] of [['kaucji', '15.1'], ['odcina', '15.2'], ['prowizję', '15.3'], ['instytucjonalny', '15.4'], ['kupno', '15.5'], ['wieczyst', '15.6'], ['escrow', '15.7'], ['przegród', '15.8'], ['KOWR', '15.9'], ['prospekt', '15.10'], ['zadatek', '15.11'], ['powierzchni', '15.12'], ['wezwanie', '15.13'], ['ostrzeżenia', '15.14'], ['WIRON', '15.15'], ['RRSO', '15.16'], ['zarządca', '15.17'], ['protokół', '15.18']]) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === number), query);
  }
});

test('Polish housing law replaces the original one; grades match the original', () => {
  assert.match(f(1)['Korzyść i dowody'], /[Uu]\.o\.p\.l\./);
  assert.match(f(5)['Korzyść i dowody'], /KC art\. 690/);
  assert.match(f(11)['Korzyść i dowody'], /KC art\. 394/);
  assert.match(f(13)['Korzyść i dowody'], /KC art\. 483/);
  assert.match(f(14)['Korzyść i dowody'], /art\. 10/);
  const grades = chapter.entries.map(e => e.fields['Ocena dowodów'][0]);
  assert.deepEqual(grades, Array.from({ length: 18 }, () => 'A'));
  const plFields = JSON.stringify(chapter.entries.map(e => [e.fields['W praktyce'], e.fields['Korzyść i dowody'], e.fields.Ograniczenia].join('\n')));
  assert.doesNotMatch(plFields, /110|96110|12356|12315|12333|12378|\+86/);
  assert.ok(citedInputs(entry(11)).some(u => u.includes('lexlege')));
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

test('no legal/financial-advice framing: procedural descriptions with limits; AI is not a lawyer', () => {
  const text = readFileSync(new URL('../' + chapter.path, import.meta.url), 'utf8');
  assert.match(text, /nie jest oficjalne wydanie autora/);
  assert.match(text, /nie jest adwokatem ani radcą prawnym/);
  assert.match(text, /nie porada prawna/);
  assert.doesNotMatch(JSON.stringify(chapter.entries.map(e => Object.values(e.fields).join('\n'))), /gwarantujemy|na pewno odzyskasz|zarobisz na pewno/);
});
