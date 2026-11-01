// Editorial regression guards for chapter 09 (legal red lines); not legal advice.
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
const chapter = chapters.find(c => c.id === '09');
const entry = n => {
  const found = chapter.entries.find(e => e.number === `09.${n}`);
  assert.ok(found, `missing decision 09.${n}`);
  return found;
};
const f = n => entry(n).fields;

test('chapter 09 covers all 29 original items, all verified, with first and final spans', () => {
  assert.deepEqual(chapter.entries.map(e => Number(e.number.split('.')[1])), Array.from({ length: 29 }, (_, i) => i + 1));
  assert.deepEqual(published(chapter.entries).map(e => Number(e.number.split('.')[1])), Array.from({ length: 29 }, (_, i) => i + 1));
  assert.ok(chapter.entries.every(e => e.fields.Status === 'verified'));
  const text = readFileSync(new URL('../' + chapter.path, import.meta.url), 'utf8');
  assert.doesNotMatch(text, /\p{Script=Han}/u);
  assert.match(f(1).Oryginał, /#L23-L31\)/);
  assert.match(f(29).Oryginał, /#L275-L283\)/);
  const finalLine = readFileSync(new URL('../book/09-普通人容易踩的法律红线.md', import.meta.url), 'utf8').trimEnd().split('\n').at(-1);
  assert.ok(upstreamSpanOf(entry(29), root).trimEnd().endsWith(finalLine));
});

test('search discovers chapter 09 advice by plain Polish terms', () => {
  for (const [query, number] of [['katastrofach', '09.1'], ['hymn', '09.2'], ['strony zagraniczne', '09.3'], ['pornografia', '09.4'], ['pranie pieniędzy', '09.5'], ['wyłudzenie kredytu', '09.6'], ['znalezione rzeczy', '09.7'], ['oszustwo komputerowe', '09.8'], ['balkon', '09.9'], ['broń pneumatyczna', '09.10'], ['dron', '09.11'], ['kamery', '09.12'], ['hazard', '09.13'], ['storczyki', '09.14'], ['dłużnika', '09.15'], ['dowodu osobistego', '09.16'], ['legitymuje', '09.17'], ['15 lat', '09.18'], ['uderzysz', '09.19'], ['adopcja', '09.20'], ['odszkodowanie', '09.21'], ['narządy', '09.22'], ['sutenerstwo', '09.23'], ['prawo autorskie', '09.24'], ['fanfik', '09.25'], ['kastet', '09.26'], ['prądem', '09.27'], ['pożar', '09.28'], ['egzamin', '09.29']]) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === number), query);
  }
});

test('Polish law replaces the Chinese one; grades match the original', () => {
  assert.match(f(1)['Korzyść i dowody'], /art\. 224a/);
  assert.match(f(2)['Korzyść i dowody'], /art\. 137/);
  assert.match(f(5)['Korzyść i dowody'], /art\. 299/);
  assert.match(f(6)['Korzyść i dowody'], /art\. 297/);
  assert.match(f(10)['Korzyść i dowody'], /17 J/);
  assert.match(f(11)['Korzyść i dowody'], /art\. 212/);
  assert.match(f(15)['Korzyść i dowody'], /art\. 189/);
  assert.match(f(18)['Korzyść i dowody'], /art\. 200/);
  assert.match(entry(18).title, /15 lat/);
  assert.match(f(19)['Korzyść i dowody'], /art\. 217/);
  assert.match(f(21)['Korzyść i dowody'], /art\. 298/);
  assert.match(f(26)['Korzyść i dowody'], /art\. 263/);
  assert.match(f(28)['Korzyść i dowody'], /art\. 163/);
  assert.match(f(29)['Korzyść i dowody'], /art\. 272/);
  const grades = chapter.entries.map(e => e.fields['Ocena dowodów'][0]);
  assert.deepEqual(grades, ['A','A','A','A','A','A','A','A','A','A','B','A','B','A','A','A','A','A','A','A','A','B','A','A','B','A','B','A','A']);
  const plFields = JSON.stringify(chapter.entries.map(e => [e.fields['W praktyce'], e.fields['Korzyść i dowody'], e.fields.Ograniczenia].join('\n')));
  assert.doesNotMatch(plFields, /110|96110|12356|12315|12333|\+86/);
  assert.ok(citedInputs(entry(1)).some(u => u.includes('lexlege')));
  assert.ok(citedInputs(entry(13)).some(u => u.includes('lexlege')));
  assert.ok(citedInputs(entry(24)).some(u => u.includes('prawie-autorskim')));
});

test('safety: emergency numbers only from the allowlist, no CN numbers leak', () => {
  const text = JSON.stringify(chapter.entries.map(e => e.fields));
  assert.doesNotMatch(text, /96110|12356|12315|12333|12378|\+86/);
  assert.match(f(28)['W praktyce'], /998/);
  assert.match(f(28)['W praktyce'], /112/);
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
