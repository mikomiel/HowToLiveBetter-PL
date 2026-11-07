import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CHAPTERS, parseChapter, published } from '../reader.mjs';
import { searchAdvice } from '../tools/pl/search.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const chapters = CHAPTERS.map(c => ({ ...c, ...parseChapter(read(c.path), c.id) }));
const chapter = chapters.find(c => c.id === '17');
const text = read(chapter.path);
const f = n => chapter.entries.find(e => e.number === `17.${n}`).fields;

test('chapter 17 preserves all 13 decisions, pinned source and exact first and final ranges', () => {
  assert.deepEqual(chapter.entries.map(e => e.number), Array.from({ length: 13 }, (_, i) => `17.${i + 1}`));
  const source = readFileSync(new URL('../book/17-家里有老人.md', import.meta.url));
  assert.equal(createHash('sha256').update(source).digest('hex'), 'c3b3d235bec679c2fa86988eb4e4b5c2ea7bbe5192986295e08f7e0b3ac62b63');
  assert.match(f(1).Oryginał, /#L7-L15\)/);
  assert.match(f(13).Oryginał, /#L115-L122\)/);
  assert.doesNotMatch(text, /\p{Script=Han}|96110|12356|12315|12333|12378|\+86/u);
});

test('unconfirmed representation stays outside published advice', () => {
  assert.equal(f(1).Status, 'needs_localization');
  assert.match(chapter.entries[0].title, /^Rekord redakcyjny:/);
  assert.equal(f(1)['W praktyce'], undefined);
  assert.equal(f(1)['Ocena dowodów'], undefined);
  assert.match(f(1).Ograniczenia, /Wymagane:/);
  assert.deepEqual(published(chapter.entries).map(e => e.number), [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(n => `17.${n}`));
});

test('law and operational cautions have grade C with all changed source grades disclosed', () => {
  const expected = [null, 'C', 'C', 'C', 'C', 'C', 'C', 'B', 'B', 'C', 'C', 'C', 'B'];
  const original = 'AABBABABBBABB';
  chapter.entries.forEach((e, i) => {
    assert.equal(e.fields['Ocena dowodów']?.[0] ?? null, expected[i], e.number);
    if (expected[i] && expected[i] !== original[i]) assert.ok(e.fields['Zmiany w adaptacji'].includes(`Oryginalne ${original[i]} zastąpiono ${expected[i]}`), e.number);
  });
  assert.match(f(2)['W praktyce'], /tylko postanowienia niezgodne/);
  assert.match(f(2).Ograniczenia, /Brak daty nie zawsze oznacza nieważność/);
  assert.match(f(7)['W praktyce'], /40 punktów lub mniej/);
  assert.match(f(11)['Źródła'], /pomocy-spolecznej\/art-67/);
});

test('support respects autonomy and does not import blanket financial or medical guarantees', () => {
  assert.match(f(3)['W praktyce'], /powinna rozumieć i akceptować/);
  assert.match(f(5).Ograniczenia, /nie są rozróżniane wyłącznie/);
  assert.match(f(8)['W praktyce'], /z uwzględnieniem stanu chorego/);
  assert.match(f(9)['Korzyść i dowody'], /49% wobec 45%/);
  assert.match(f(9)['Korzyść i dowody'], /Liczba upadków i liczba osób z upadkiem to różne/);
  assert.match(f(10).Ograniczenia, /Nie ustalono najlepszej długości smyczy/);
  assert.match(f(13)['W praktyce'], /Nagła dezorientacja jest inną sytuacją/);
  assert.match(f(13).Ograniczenia, /nie jest automatyczną zgodą na odebranie samodzielności/);
});

test('published senior advice is searchable while pending representation remains excluded', () => {
  for (const [query, n] of [['testamentu', 2], ['wydatków', 3], ['presji', 4], ['opłatę', 5], ['mieszkania', 6], ['Barthel', 7], ['odleżynom', 8], ['zaćma', 9], ['zwierzętach', 10], ['wojewody', 11], ['Z-15', 12], ['pamięć', 13]]) {
    assert.ok(searchAdvice(chapters, query, { limit: 1000 }).some(r => r.entry.number === `17.${n}`), query);
  }
  for (const query of ['reprezentacja', 'opiekuńczego', 'rodzicem']) {
    assert.ok(searchAdvice(chapters, query, { limit: 1000 }).every(r => r.entry.number !== '17.1'), query);
  }
});

test('caregiver leave and insured care allowance have separate conditions, pay and limits', () => {
  const fields = f(12);
  assert.equal(fields.Status, 'verified');
  assert.match(fields['W praktyce'], /5 dni w roku kalendarzowym.*dni pracy.*poważnych względów medycznych/);
  assert.match(fields['W praktyce'], /papierowy lub elektroniczny.*co najmniej 1 dzień.*imię i nazwisko.*przyczynę.*pokrewieństwo/);
  assert.match(fields['W praktyce'], /nie zachowuje ustawowego wynagrodzenia.*nie daje zasiłku opiekuńczego za te same dni/);
  assert.match(fields['W praktyce'], /ubezpieczenie chorobowe.*wspólne gospodarstwo domowe.*innego członka rodziny/);
  assert.match(fields['W praktyce'], /Z-15\b.*e-ZLA.*gdy wypłaca ZUS.*Z-3\b/);
  assert.doesNotMatch(fields['W praktyce'], /\bZ-15[AB]\b/);
  assert.match(fields['Korzyść i dowody'], /14 dni w roku kalendarzowym.*nie oddzielnie dla każdego rodzica lub opiekuna/);
  assert.match(fields['Korzyść i dowody'], /80% podstawy wymiaru zasiłku.*nie gwarancja 80%.*pensji netto/);
  assert.match(fields.Ograniczenia, /art\. 188.*dziecko/);
});

test('caregiver advice cites reread primary provisions and discloses what was not read', () => {
  const fields = f(12);
  assert.equal(fields.Status, 'verified');
  for (const source of ['DU/2026/1245/text/T/D20261245L.pdf', 'DU/2026/854/text/U/D20260854Lj.pdf', 'czy-pracownik-zachowuje-prawo-do-wynagrodzenia', 'prawo-do-zasilku-i-okres-przyslugiwania', 'zasilek-opiekunczy/wysokosc', 'zasilek-opiekunczy/niezbedne-dokumenty', 'od-26-kwietnia-2023-roku']) {
    assert.ok(fields['Źródła'].includes(source), source);
  }
  assert.match(fields.Oryginał, /#L106-L114\)/);
  assert.match(fields.Weryfikacja, /2026-10-24/);
  assert.match(fields.Weryfikacja, /Nie przeczytano.*postanowienia SN.*formularzy PDF/);
});

test('withdrawal hides caregiver advice and a status-only representation promotion fails', () => {
  const withdrawn = { ...chapter, entries: chapter.entries.map(e => e.number === '17.12' ? { ...e, fields: { ...e.fields, Status: 'needs_verification' } } : e) };
  assert.equal(published(withdrawn.entries).length, 11);
  assert.ok(searchAdvice([chapter], 'Z-15', { limit: 100 }).some(r => r.entry.number === '17.12'));
  assert.equal(searchAdvice([withdrawn], 'Z-15', { limit: 100 }).some(r => r.entry.number === '17.12'), false);
  assert.throws(() => parseChapter(text.replace('- Status: needs_localization', '- Status: verified'), '17'), /Koszt|W praktyce|Ocena dowodów/);
});

test('scope and review limitations are explicit and README totals do not count pending advice', () => {
  assert.match(text, /nie jest oficjalne wydanie autora/);
  assert.match(text, /nie jest adwokatem ani radcą prawnym/);
  assert.match(text, /nie porada prawna/);
  assert.match(read('README.md'), /\| \[17\. .*\| 13 \| 12 \|/);
  for (const e of chapter.entries) assert.match(e.fields.Weryfikacja, e.number === '17.12' ? /^2026-11-07; / : /^2026-11-02; /);
});
