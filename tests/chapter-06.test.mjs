// Editorial regression guards for chapter 06 (czarna lista); not medical/legal/financial advice.
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
const chapter = chapters.find(c => c.id === '06');
const entry = n => {
  const found = chapter.entries.find(e => e.number === `06.${n}`);
  assert.ok(found, `missing decision 06.${n}`);
  return found;
};
const f = n => entry(n).fields;

test('chapter 06 covers all 35 original items, all verified, with first and final spans', () => {
  assert.deepEqual(chapter.entries.map(e => Number(e.number.split('.')[1])), Array.from({ length: 35 }, (_, i) => i + 1));
  assert.deepEqual(published(chapter.entries).map(e => Number(e.number.split('.')[1])), Array.from({ length: 35 }, (_, i) => i + 1));
  const text = readFileSync(new URL('../' + chapter.path, import.meta.url), 'utf8');
  assert.doesNotMatch(text, /\p{Script=Han}/u);
  assert.match(f(1).Oryginał, /#L21-L29\)/);
  assert.match(f(35).Oryginał, /#L328-L335\)/);
  const finalLine = readFileSync(new URL('../book/06-反面清单.md', import.meta.url), 'utf8').trimEnd().split('\n').at(-1);
  assert.ok(upstreamSpanOf(entry(35), root).trimEnd().endsWith(finalLine));
});

test('search discovers chapter 06 advice by plain Polish terms', () => {
  for (const [query, number] of [['glukozamina', '06.5'], ['melatonina', '06.34'], ['krew 450 ml', '06.17'], ['artroskopia kolano', '06.33'], ['witamina D', '06.3'], ['hipoglikemia', '06.26']]) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === number), query);
  }
});

test('evidence numbers keep populations, intervals and uncertainty; grades match the original', () => {
  assert.match(f(1)['Korzyść i dowody'], /14 641/);
  assert.match(f(1)['Korzyść i dowody'], /HR 1,01 \(95% CI 0,91–1,10\)/);
  assert.match(f(2)['Korzyść i dowody'], /25 871/);
  assert.match(f(2)['Korzyść i dowody'], /HR 0,75 \(0,68–0,83\)/);
  assert.match(f(5)['Korzyść i dowody'], /60,1%/);
  assert.match(f(8)['Korzyść i dowody'], /2,4 kg \(1,0–3,7\)/);
  assert.match(f(17)['Korzyść i dowody'], /1 182 495/);
  assert.match(f(17)['Korzyść i dowody'], /HR 0,85 \(0,67–1,08\)/);
  assert.match(f(19)['Korzyść i dowody'], /NNT 24/);
  assert.match(f(25)['Korzyść i dowody'], /d = 0,04 \(95% CI −0,07 do 0,15\)/);
  assert.match(f(33)['Korzyść i dowody'], /4,13\/1000/);
  assert.match(f(34)['Korzyść i dowody'], /7,06 min/);
  assert.equal(f(1)['Ocena dowodów'][0], 'A');
  assert.equal(f(7)['Ocena dowodów'][0], 'A');
  assert.equal(f(8)['Ocena dowodów'][0], 'B');
  assert.equal(f(10)['Ocena dowodów'][0], 'C');
  assert.equal(f(13)['Ocena dowodów'][0], 'C');
  assert.equal(f(14)['Ocena dowodów'][0], 'C');
  assert.equal(f(35)['Ocena dowodów'][0], 'C');
});

test('association stays association; no universal doses, BMI targets or longevity promises', () => {
  assert.match(f(23)['Korzyść i dowody'], /kierunek przyczynowy nie jest ustalony|korelacj/i);
  assert.match(f(26)['Korzyść i dowody'], /skojarzenia z badań obserwacyjnych, nie dowód przyczyny/);
  assert.match(f(24)['Ocena dowodów'], /wynik samooceniany|bez randomizacji/);
  const text = JSON.stringify(chapter.entries.map(e => Object.values(e.fields).join('\n')));
  assert.doesNotMatch(text, /docelowy BMI|cel BMI|dożyjesz|przedłużysz życie o/i);
  assert.doesNotMatch(text, /zawsze bierz|jedz dokładnie|dawka dla każdego/i);
});

test('safety: emergency numbers only from the allowlist, no CN numbers or services leak', () => {
  const text = JSON.stringify(chapter.entries.map(e => e.fields));
  assert.doesNotMatch(text, /12300|12315|12378|12345|12306|\+86|wechat|支付宝|微信|120 alarm/i);
  assert.match(f(16)['W praktyce'], /112/);
  assert.match(f(31)['W praktyce'], /112/);
  assert.match(f(23).Ograniczenia, /116 123/);
  assert.match(f(28)['W praktyce'], /116 123/);
  assert.match(f(15).Ograniczenia, /997/);
  const allow = new Set(['112', '997', '998', '999', '116 123', '116 111', '992', '800 702 222', '22 621 02 56']);
  for (const e of chapter.entries) {
    const stripped = JSON.stringify(e.fields).replace(/https?:\/\/[^\s)"]+/g, ' ').replace(/10\.\d{4,9}\/[^\s)"]+/g, ' ');
    const nums = [...stripped.matchAll(/\b\d{3}[\s-]?\d{3}[\s-]?\d{3}\b/g)].map(m => m[0].replace(/\s+/g, ' '));
    for (const num of nums) assert.ok(allow.has(num), `${e.number}: ${num}`);
  }
});

test('Polish bases, not Chinese institutions: blood rules, supplements, screening programs, GUS', () => {
  assert.match(f(17)['W praktyce'], /450 ml/);
  assert.match(f(17)['W praktyce'], /8 tygodni/);
  assert.match(f(17)['W praktyce'], /publicznej służbie krwi/);
  assert.match(f(10)['Korzyść i dowody'], /substytut zróżnicowanej diety/);
  assert.match(f(18)['W praktyce'], /30 kwietnia 2025/);
  assert.match(f(18)['Korzyść i dowody'], /RR 1,00 \(95% CI 0,97–1,03\)/);
  assert.match(f(32)['W praktyce'], /GUS/);
  assert.match(f(32)['Korzyść i dowody'], /591,5|49,3/);
  assert.match(f(7)['W praktyce'], /01\.17/);
  assert.equal(citedInputs(entry(17))[0], 'https://pacjent.gov.pl/chce-oddac-krew');
  assert.equal(citedInputs(entry(10))[0], 'https://www.gov.pl/web/gis/jakie-informacje-powinny-znajdowac-sie-na-opakowaniu-suplementu-diety');
  assert.ok(citedInputs(entry(32)).some(u => u.includes('stat.gov.pl')));
  const plFields = JSON.stringify(chapter.entries.map(e => [e.fields['W praktyce'], e.fields['Korzyść i dowody'], e.fields.Ograniczenia].join('\n')));
  assert.doesNotMatch(plFields, /医保|SAMR|卫健委|广东|NHC|献血法|12300/);
});

test('cross-references point only to published porady of adapted chapters', () => {
  const publishedIds = new Set(published(chapters.flatMap(c => c.entries)).map(e => e.id));
  for (const e of chapter.entries) {
    for (const value of Object.values(e.fields)) {
      for (const [, href] of String(value).matchAll(/\[[^\]]+\]\(([^()\s]+)\)/g)) {
        if (href.startsWith('#')) assert.ok(publishedIds.has(href.slice(1)), `${e.number}: ${href}`);
      }
    }
  }
});
