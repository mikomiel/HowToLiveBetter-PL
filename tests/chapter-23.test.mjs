// Editorial regression contracts, not factual certification or specialist approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CHAPTERS, FIELDS, parseChapter, published } from '../reader.mjs';
import { searchAdvice } from '../tools/pl/search.mjs';
const chapters = CHAPTERS.map(c => ({ ...c, ...parseChapter(readFileSync(new URL('../' + c.path, import.meta.url), 'utf8'), c.id) }));
const chapter = chapters.find(c => c.id === '23');
const markdown = readFileSync(new URL('../book/pl/23-edukacja-kwalifikacje-i-uczenie-sie.md', import.meta.url), 'utf8');
const original = readFileSync(new URL('../book/23-学什么技能划算.md', import.meta.url));
const originalGrades = [...original.toString().matchAll(/- 证据等级：([ABC])/g)].map(m => m[1]);
const entry = n => { assert.ok(chapter, 'chapter23 must be registered'); const e = chapter.entries.find(e => e.number === `23.${n}`); assert.ok(e); return e; };
const f = n => entry(n).fields;

test('education preserves all 25 source positions, bytes, anchors and exact pinned spans', () => {
  assert.ok(chapter, 'the authorized chapter must be registered');
  assert.equal(createHash('sha256').update(original).digest('hex'), '49f8fabc2de6c6de1bb078fe6ba7b7af69b258c7061cfbe7dba6796aa47f4667');
  assert.deepEqual(chapter.entries.map(e => e.number), Array.from({ length:25 }, (_,i) => `23.${i+1}`));
  for(let n=1;n<=25;n++) {
    assert.equal(entry(n).id, `porada-23-${n}`);
    assert.ok(f(n).Oryginał.includes('e2605d3e2242bd6216c9255192b8a8957a08c55a'));
    assert.ok(f(n).Oryginał.endsWith(`#L${19+(n-1)*9}-L${n===25?242:27+(n-1)*9})`));
  }
  assert.doesNotMatch(markdown,/\p{Script=Han}/u);
});

test('education has 24 bounded records, traceable grades and an unpublished title-system record', () => {
  assert.equal(published(chapter.entries).length,24);
  const grades='CACCCCCCCCCCCAABABA_CCCCC';
  for(let n=1;n<=25;n++) {
    if(n===20) continue;
    for(const key of FIELDS) assert.ok(f(n)[key]?.trim(),`23.${n} ${key}`);
    assert.equal(f(n)['Ocena dowodów'][0],grades[n-1]);
    if(originalGrades[n-1]!==grades[n-1]) assert.ok(f(n)['Zmiany w adaptacji'].includes(`Oryginalne ${originalGrades[n-1]} zastąpiono ${grades[n-1]}.`));
  }
  assert.equal(f(20).Status,'needs_localization');
  assert.equal(f(20)['W praktyce'],undefined);
  assert.equal(f(20)['Ocena dowodów'],undefined);
  assert.match(f(16)['Ocena dowodów'],/^B /);
  assert.match(f(18)['Ocena dowodów'],/^B /);
});

test('Polish education scopes retain source disagreements, certificate and support boundaries', () => {
  assert.match(f(1).Ograniczenia,/PIP pojawia się 16 lat/);
  assert.match(f(1).Ograniczenia,/nie zawiera takiego osobnego progu/);
  assert.match(f(3)['Korzyść i dowody'],/13 lat i więcej/);
  assert.match(f(4).Ograniczenia,/nie wszystkich uczniów ani doktorantów/);
  assert.match(f(5)['W praktyce'],/nie zakładaj, że samo zaświadczenie z kursu jest już kwalifikacją/);
  assert.match(f(8).Ograniczenia,/Brak wpisu w ZRK sam nie dowodzi/);
  assert.match(f(9).Ograniczenia,/Nie potwierdzono indywidualnego uprawnienia/);
  assert.match(f(12).Ograniczenia,/nie jest liczbą wolnych etatów/);
  assert.match(f(21)['Korzyść i dowody'],/nie ma postępowania o nowy certyfikat/);
});

test('education never turns mortality, earnings, models or test effects into personal guarantees', () => {
  assert.match(f(2).Ograniczenia,/brak pełnej kontroli czynników zakłócających/);
  assert.ok(f(2).Źródła.includes('PIIS2468-2667%2823%2900306-7'), 'source URL parentheses must use the supported encoded form');
  assert.match(f(6)['Korzyść i dowody'],/nie obliczony dla ciebie efekt przyczynowy/);
  assert.match(f(7)['W praktyce'],/Nie uznawaj zagranicznej średniej/);
  assert.match(f(10).Ograniczenia,/nie jest faktyczną utratą pracy/);
  assert.match(f(14).Weryfikacja,/pełny abstrakt.*Nie przeczytano pełnego artykułu/);
  assert.match(f(17)['Korzyść i dowody'],/dla słów przewagę miało.*ćwiczenie blokami/);
  assert.match(f(18).Ograniczenia,/potrzeb związanych z niepełnosprawnością/);
  assert.match(f(19).Ograniczenia,/nie uprawnia do samodzielnej diagnozy/);
  assert.match(f(25).Ograniczenia,/nie przenosimy podanych tam kwot na 2026 r/);
});

test('education search excludes the pending record and malformed or withdrawn data fail closed', () => {
  for(const [query,n] of [['młodocianego',1],['czynniki',2],['mianownik',3],['zapomogę',4],['OKE',5],['scenariusze',6],['obietnicy',7],['autentyczności',8],['operatora',9],['generatywną AI',10],['PRK',11],['deficytowe',12],['rezultat',13],['Yang',14],['Cepedy',15],['podkreślanie',16],['słów',17],['wzrokowca',18],['transfer',19],['certyfikat księgowy',21],['korepetycje',22],['podwyżki',23],['magisterskimi',24],['doktoratem',25]]) assert.ok(searchAdvice(chapters,query,{limit:100}).some(r=>r.entry.number===`23.${n}`),query);
  assert.ok(searchAdvice(chapters,'systemu tytułów',{limit:100}).every(r=>r.entry.number!=='23.20'));
  const withdrawn=chapter.entries.map(e=>e.number==='23.1'?{...e,fields:{...e.fields,Status:'needs_verification'}}:e);
  assert.equal(published(withdrawn).length,23);
  assert.throws(()=>parseChapter(markdown.replace('- Status: verified','- Status: ready'),'23'),/stan|status|ready/i);
  assert.throws(()=>parseChapter(markdown.replace(/^- W praktyce: .+\n/m,''),'23'),/W praktyce/);
  assert.throws(()=>parseChapter(markdown.replace('- Status: needs_localization','- Status: verified'),'23'),/Koszt|W praktyce/);
});

test('education retains licensing, non-expert and bounded-reading notices', () => {
  for(const text of ['nie jest oficjalne wydanie autora','nie jest lekarzem','nie jest adwokatem ani radcą prawnym','nie porada prawna','CC BY 4.0','eternity4719']) assert.ok(markdown.includes(text));
  assert.doesNotMatch(markdown,/96110|12356|12315|12333|12378|\+86/);
});
