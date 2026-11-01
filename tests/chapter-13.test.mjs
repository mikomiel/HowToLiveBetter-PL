// Editorial regression guards for chapter 13 (emergencies); not medical or legal advice.
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
const chapter = chapters.find(c => c.id === '13');
const entry = n => {
  const found = chapter.entries.find(e => e.number === `13.${n}`);
  assert.ok(found, `missing decision 13.${n}`);
  return found;
};
const f = n => entry(n).fields;

test('chapter 13 covers all 48 original items, all verified, with first and final spans', () => {
  assert.deepEqual(chapter.entries.map(e => Number(e.number.split('.')[1])), Array.from({ length: 48 }, (_, i) => i + 1));
  assert.deepEqual(published(chapter.entries).map(e => Number(e.number.split('.')[1])), Array.from({ length: 48 }, (_, i) => i + 1));
  assert.ok(chapter.entries.every(e => e.fields.Status === 'verified'));
  const text = readFileSync(new URL('../' + chapter.path, import.meta.url), 'utf8');
  assert.doesNotMatch(text, /\p{Script=Han}/u);
  assert.match(f(1).Oryginał, /#L25-L33\)/);
  assert.match(f(48).Oryginał, /#L447-L454\)/);
  const finalLine = readFileSync(new URL('../book/13-紧急情况.md', import.meta.url), 'utf8').trimEnd().split('\n').at(-1);
  assert.ok(upstreamSpanOf(entry(48), root).trimEnd().endsWith(finalLine));
});

test('search discovers chapter 13 advice by plain Polish terms', () => {
  for (const [query, number] of [['AED', '13.1'], ['przykucnij', '13.2'], ['twarz', '13.3'], ['zawroty', '13.4'], ['zasłona', '13.5'], ['jaskry', '13.6'], ['klatce', '13.7'], ['rozdzierający', '13.8'], ['piorunujący', '13.9'], ['krwiak', '13.10'], ['zakrzepicy', '13.11'], ['opaska', '13.12'], ['wścieklizn', '13.13'], ['oparzeniu', '13.14'], ['anafilaksj', '13.15'], ['drgawek', '13.16'], ['hipoglikemia', '13.17'], ['prądem', '13.18'], ['czad', '13.19'], ['wymiotów', '13.20'], ['chemikalia', '13.21'], ['cieplnego', '13.22'], ['nawadnianie', '13.23'], ['pożar', '13.24'], ['tonącego', '13.25'], ['krztusi', '13.26'], ['zgubisz', '13.27'], ['hipotermii', '13.28'], ['żmija', '13.29'], ['trzęsienia', '13.30'], ['niedźwiedziem', '13.31'], ['piorunami', '13.32'], ['wysokościowej', '13.33'], ['kleszcza', '13.34'], ['przegotowaną', '13.35'], ['rozbój', '13.36'], ['bójkę', '13.37'], ['PEP', '13.38'], ['Fundusz', '13.39'], ['wbitych', '13.40'], ['złamania', '13.41'], ['zgwałcenie', '13.42'], ['przedramieniu', '13.43'], ['kciukami', '13.44'], ['baterię', '13.45'], ['alkohol', '13.46'], ['odciętą', '13.47'], ['zęb', '13.48']]) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === number), query);
  }
});

test('Polish law and emergency system replace the original one; grades match the original', () => {
  assert.match(f(1)['Korzyść i dowody'], /KK art\. 162/);
  assert.match(f(36)['Korzyść i dowody'], /KK art\. 280/);
  assert.match(f(42)['Korzyść i dowody'], /KK art\. 197/);
  assert.match(f(37)['Korzyść i dowody'], /KK art\. 158/);
  const grades = chapter.entries.map(e => e.fields['Ocena dowodów'][0]);
  assert.deepEqual(grades, ['A','B','A','B','B','B','B','B','A','B','B','A','A','A','B','B','A','B','B','B','B','B','B','B','C','B','C','B','B','B','B','B','A','B','B','C','B','B','B','B','B','B','B','B','B','B','B','B']);
  const plFields = JSON.stringify(chapter.entries.map(e => [e.fields['W praktyce'], e.fields['Korzyść i dowody'], e.fields.Ograniczenia].join('\n')));
  assert.doesNotMatch(plFields, /110|96110|12356|12315|12333|12378|\+86/);
  assert.ok(citedInputs(entry(1)).some(u => u.includes('lexlege')));
  assert.ok(citedInputs(entry(36)).some(u => u.includes('lex')));
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

test('no medical/legal-advice framing: emergency procedures with limits, AI is neither doctor nor lawyer', () => {
  const text = readFileSync(new URL('../' + chapter.path, import.meta.url), 'utf8');
  assert.match(text, /nie jest oficjalne wydanie autora/);
  assert.match(text, /nie jest lekarzem/);
  assert.match(text, /nie jest adwokatem ani radcą prawnym/);
  assert.doesNotMatch(JSON.stringify(chapter.entries.map(e => Object.values(e.fields).join('\n'))), /gwarantujemy|na pewno przeżyjesz|na pewno wygrasz/);
});
