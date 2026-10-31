// Editorial regression guards and consumer checks, not medical certification.
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
const chapter = chapters.find(c => c.id === '02');
const entry = n => {
  const found = chapter.entries.find(e => e.number === `02.${n}`);
  assert.ok(found, `missing decision 02.${n}`);
  return found;
};
const f = n => entry(n).fields;
const ready = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 21, 22, 23, 24, 27, 28, 30, 32, 41, 43, 45, 46, 47];
const verify = [13, 14, 15, 25, 26, 31, 33, 34, 35, 36, 37, 38, 44];
const localize = [29, 39, 40, 42];

test('chapter 02 preserves all 47 decisions, their states and the final substantive source paragraph', () => {
  assert.deepEqual(chapter.entries.map(e => Number(e.number.split('.')[1])), Array.from({ length: 47 }, (_, i) => i + 1));
  assert.deepEqual(published(chapter.entries).map(e => Number(e.number.split('.')[1])), ready);
  for (const [state, list] of [['needs_verification', verify], ['needs_localization', localize]]) {
    assert.deepEqual(chapter.entries.filter(e => e.fields.Status === state).map(e => Number(e.number.split('.')[1])), list);
    for (const n of list) {
      assert.ok(entry(n).title.startsWith('Rekord redakcyjny:'));
      assert.equal(f(n)['W praktyce'], undefined);
    }
  }
  assert.match(f(1).Oryginał, /#L23-L31\)/);
  assert.match(f(47).Oryginał, /#L437-L444\)/);
  const finalLine = readFileSync(new URL('../book/02-不要慢慢死.md', import.meta.url), 'utf8').trimEnd().split('\n').at(-1);
  assert.ok(upstreamSpanOf(entry(47), root).trimEnd().endsWith(finalLine));
});

test('new advice is searchable while all withheld chapter-02 records stay outside search', () => {
  for (const [query, number] of [['cytyzynę', '02.3'], ['cytyzyne', '02.3'], ['hiperkaliemii', '02.9'], ['międzyzębowe', '02.10'], ['Moje Zdrowie', '02.12'], ['przedcukrzycowy', '02.45']]) {
    assert.ok(searchAdvice(chapters, query, { limit: 100 }).some(r => r.entry.number === number), query);
  }
  const withheld = new Set([...verify, ...localize].map(n => `02.${n}`));
  for (const n of [...verify, ...localize]) {
    const query = entry(n).title.replace('Rekord redakcyjny: ', '');
    assert.ok(searchAdvice(chapters, query, { limit: 200 }).every(r => !withheld.has(r.entry.number)), query);
  }
});

test('gradual quitting retains the actual comparison, uncertainty and goal of complete abstinence', () => {
  assert.match(f(4)['Korzyść i dowody'], /51 prób.*22 509/);
  assert.match(f(4)['Korzyść i dowody'], /22 badania.*9219.*RR.*1,01.*0,87–1,17/);
  assert.match(f(4)['Korzyść i dowody'], /co najmniej 6 miesiącach/);
  assert.match(f(4).Ograniczenia, /Brak wykazanej przewagi nie jest dowodem identyczności/);
  assert.match(f(4).Ograniczenia, /ciężarnych.*2018/);
  assert.match(f(4)['W praktyce'], /bezterminowe zmniejszanie.*nie jest tym samym co rzucenie/);
  assert.equal(citedInputs(entry(4))[0], 'https://www.cochrane.org/evidence/CD013183_kunnen-mensen-stoppen-met-roken-door-eerst-minder-te-gaan-roken');
});

test('nicotine treatment is professional help, not an imported dose or a reason for non-smokers to start vaping', () => {
  assert.match(f(3)['W praktyce'], /lekarza lub farmaceutę/);
  assert.match(f(3)['W praktyce'], /nie łącz samodzielnie preparatów/);
  assert.match(f(3).Ograniczenia, /Nie potwierdzamy dostępności każdej/);
  assert.doesNotMatch(f(3)['W praktyce'], /\d+\s*(?:mg|tygodn|plastr)|2\+1\+1/);
  assert.match(f(6)['W praktyce'], /Jeśli nie palisz, nie zaczynaj wapowania/);
  assert.match(f(6).Ograniczenia, /nie.*porównani|Nie przeprowadzono.*oceny skuteczności/);
});

test('potassium salt keeps kidney, medication, pregnancy and child exclusions visible in the action', () => {
  assert.match(f(9)['W praktyce'], /lekarzem lub farmaceutą.*nerkami i lekami/);
  assert.match(f(9)['W praktyce'], /Nie zamieniaj automatycznie soli całej rodzinie/);
  assert.match(f(9)['W praktyce'], /nie obejmuje dzieci ani ciężarnych/);
  assert.match(f(9)['W praktyce'], /wyklucza osoby z zaburzonym wydalaniem potasu/);
  assert.match(f(9)['Korzyść i dowody'], /warunkowo.*26 prób.*niską/);
  assert.match(f(9).Ograniczenia, /hiperkaliemii.*ograniczone/);
  assert.match(f(9).Ograniczenia, /Brak danych.*nie jest dowodem bezpieczeństwa/);
});

test('movement guidance does not prescribe a universal step target, a strength ceiling or cancellation of sitting risk', () => {
  assert.match(f(11)['W praktyce'], /150–300 minut/);
  assert.match(f(11)['W praktyce'], /zaczynaj od małej ilości/);
  assert.doesNotMatch(f(11)['W praktyce'], /7000|8000|10 000/);
  assert.match(f(16)['W praktyce'], /co najmniej 2 dni/);
  assert.match(f(16).Ograniczenia, /nie dowodzi, że dłuższy trening szkodzi/);
  assert.match(f(17)['W praktyce'], /Jeśli nie możesz wstać/);
  assert.match(f(17).Ograniczenia, /Nie twierdzimy.*całkowicie kasuje/);
  assert.equal(f(14).Status, 'needs_verification');
  assert.equal(f(15).Status, 'needs_verification');
});

test('Polish programme eligibility and financing intervals never replace lipid-treatment monitoring', () => {
  assert.match(f(12)['Korzyść i dowody'], /Moje Zdrowie.*NFZ.*co 5 lat.*20–49.*50 lat co 3 lata/);
  assert.match(f(12)['Korzyść i dowody'], /rocznikowo.*Profilaktyce 40 PLUS.*rok/);
  assert.match(f(12)['W praktyce'], /nie zastępuj jej terminami programu/);
  assert.match(f(12).Ograniczenia, /nie jest odstępem kontroli dla osoby leczonej/);
  assert.match(f(12).Ograniczenia, /Nie przenosimy na samo pobranie krwi efektów leków/);
  assert.ok(citedInputs(entry(12)).some(input => input === 'https://pacjent.gov.pl/program-moje-zdrowie'));
});

test('alcohol reduction advice visibly accounts for withdrawal and distinguishes a brief intervention from detoxification', () => {
  for (const n of [19, 21]) {
    assert.match(f(n)['W praktyce'], /odstawienia/);
    assert.match(f(n)['W praktyce'], /\[02\.20\]\(#porada-2-20\)/);
  }
  assert.match(f(20)['W praktyce'], /nie planuj gwałtownego odstawienia bez pomocy medycznej/);
  assert.match(f(20)['W praktyce'], /drgawek.*zaburzeń świadomości.*112/);
  assert.match(f(20)['W praktyce'], /Nie dobieraj samodzielnie leków/);
  assert.doesNotMatch(f(20)['W praktyce'], /999|111|\d+\s*mg|zmniejszaj.*(?:ml|kieliszk)/);
  assert.match(f(21)['Korzyść i dowody'], /69 badań.*33 642.*34 badań.*15 197/);
  assert.match(f(21)['Korzyść i dowody'], /po roku średnio 20 g czystego alkoholu tygodniowo mniej.*12–28 g mniej/);
  assert.match(f(21)['Korzyść i dowody'], /nie dodatkowe lata życia/);
  assert.match(f(21).Ograniczenia, /nie pełnego leczenia zależności fizycznej/);
});

test('food choices are conditional substitutions, not proof that a single product causes longer life', () => {
  assert.match(f(7)['W praktyce'], /sam słodzik powoduje większą śmiertelność/);
  assert.match(f(7).Ograniczenia, /nie rozstrzygają, czy.*przyczyną/);
  assert.match(f(22)['W praktyce'], /Przy alergii nie stosuj/);
  assert.match(f(23)['W praktyce'], /zamianę.*nie.*dołożenie/);
  assert.match(f(27)['W praktyce'], /Dla dorosłych.*co najmniej 400 g.*połowy talerza/);
  assert.match(f(28)['W praktyce'], /Nie odrzucaj mrożonych warzyw czy puszki strączków/);
  assert.match(f(30)['Korzyść i dowody'], /300 osób.*571.*ilorazem szans/);
  assert.match(f(30).Ograniczenia, /Iloraz szans nie jest osobistym prawdopodobieństwem/);
  assert.doesNotMatch(f(30)['W praktyce'], /65°C|co najmniej [24] minuty/);
});

test('fat-reduction cardiovascular events stay distinct from all-cause deaths and one specific oil', () => {
  assert.match(f(41)['Korzyść i dowody'], /15 prób.*56 675/);
  assert.match(f(41)['Korzyść i dowody'], /zdarzeń sercowo-naczyniowych.*12 prób.*53 758.*0,83.*0,70–0,98/);
  assert.match(f(41)['Korzyść i dowody'], /zgonów z dowolnej przyczyny.*11 prób.*55 858.*RR 0,96.*0,90–1,03.*bez wyraźnego/);
  assert.match(f(41).Ograniczenia, /nie każda liczba dotyczy konkretnego oleju/);
  assert.match(f(41).Ograniczenia, /danych.*jednonienasycone było niewiele/);
  assert.match(f(41)['W praktyce'], /oleje palmowy i kokosowy/);
});

test('weight and prediabetes need individual care rather than a universal BMI or personal DPP percentage', () => {
  assert.match(f(32)['W praktyce'], /Cel leczenia ustal indywidualnie/);
  assert.doesNotMatch(f(32)['W praktyce'], /20–25|18,5–25|\d+\s*kcal/);
  assert.match(f(45)['W praktyce'], /Jeśli lekarz rozpoznał/);
  assert.match(f(45)['W praktyce'], /jeśli jest potrzebny.*indywidualnie/);
  assert.match(f(45)['Korzyść i dowody'], /3234.*podwyższoną glukozą.*BMI 34.*2,8 roku.*58%.*48–66%/);
  assert.match(f(45)['Korzyść i dowody'], /redukcja względna.*nie osobiste.*punktów procentowych/);
  assert.match(f(45).Ograniczenia, /intensywne wsparcie/);
  assert.match(f(45).Ograniczenia, /Nie zalecamy redukcji masy każdemu/);
});

test('menopause treatment, oral hygiene and food safety do not inherit unsupported mortality or self-treatment claims', () => {
  assert.match(f(43)['W praktyce'], /Nie kupuj samodzielnie hormonów/);
  assert.match(f(43)['Korzyść i dowody'], /nie jest zakazem leczenia uciążliwych objawów/);
  assert.match(f(43).Ograniczenia, /nie obejmuje menopauzy przedwczesnej ani wywołanej zabiegiem/);
  assert.match(f(10)['Korzyść i dowody'], /nie przypisujemy szczotkowaniu efektu na całkowitą śmiertelność/);
  assert.match(f(46)['W praktyce'], /nie próbuj ich smaku/);
  assert.match(f(46)['W praktyce'], /nie zakładaj, że usunięcie widocznego nalotu/i);
  assert.match(f(47)['W praktyce'], /Nie stosuj samodzielnie.*leków przeciwpasożytniczych/);
  assert.match(f(47).Ograniczenia, /Nie zalecamy każdemu jednego testu kału/);
  assert.doesNotMatch(f(47)['W praktyce'], /prazykwantel|75\s*mg|dwa dni|100%/);
});
