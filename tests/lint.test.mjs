import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { lintEntry, lintRecords, numberInventory, upstreamSpanOf, loadAll, PHONE_ALLOWLIST } from '../tools/pl/lint.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const chapters = loadAll(root);
const entries = chapters.flatMap(c => c.entries);
const verified = entries.filter(e => e.fields.Status === 'verified');
const base = verified.find(e => e.number === '14.2');
const withField = (field, value, extra = {}) => ({ ...base, fields: { ...base.fields, [field]: value, ...extra } });
const rules = (entry, options) => lintEntry(entry, options).map(f => f.rule);
const TODAY = '2026-10-29';

test('the published records have no lint errors', () => {
  const errors = verified.flatMap(e => lintEntry(e, { today: TODAY })).filter(f => f.severity === 'error');
  assert.deepEqual(errors, []);
});

test('a Chinese rule in reader-facing text is flagged, as in the old 14.9 sentence', () => {
  const old = withField('W praktyce', 'Zapytaj także o inną metodę. Nie zakładaj jednak, że chiński przepis o obowiązkowej alternatywie działa w Polsce.');
  assert.ok(rules(old).includes('cn-leak'));
  // The same words belong in the provenance field and must not be flagged there.
  assert.ok(!rules(withField('Zmiany w adaptacji', 'Usunięto chińskie nakazy i progi.')).includes('cn-leak'));
  // Polish words that merely start with the same letters are not Chinese.
  assert.ok(!rules(withField('W praktyce', 'Chinina jest substancją opisaną w farmakopei.')).includes('cn-leak'));
});

test('phone numbers must be on the checked allowlist, thousands separators are not phone numbers', () => {
  assert.ok(rules(withField('W praktyce', 'Zadzwoń pod numer 800 123 456 i opisz sytuację.')).includes('phone-number'));
  assert.ok(rules(withField('W praktyce', 'Przy zagrożeniu życia zadzwoń pod numer 112.')).every(r => r !== 'phone-number'));
  assert.ok(rules(withField('W praktyce', 'W kryzysie możesz zadzwonić pod numer 116 123.')).every(r => r !== 'phone-number'));
  assert.ok(rules(withField('Koszt', 'Abonament kosztuje 100 000 zł rocznie.')).every(r => r !== 'phone-number'));
  assert.ok(rules(withField('W praktyce', 'Zadzwoń do lekarza, jeśli gorączka przekracza 100 stopni.')).every(r => r !== 'phone-number'));
  assert.ok(rules(withField('W praktyce', 'Zadzwoń pod numer 123 i poczekaj na połączenie.')).includes('phone-number'));
  assert.ok(rules(withField('W praktyce', 'Zadzwoń pod numer 116 123 lub pod 112.')).every(r => r !== 'phone-number'), 'non-breaking space inside an allowlisted number');
  assert.ok(rules(withField('W praktyce', 'Zadzwoń pod numer 116 123 albo pod numer 800 123 456.')).includes('phone-number'), 'one bad number among good ones');
  assert.deepEqual([...PHONE_ALLOWLIST].sort(), ['112', '116 111', '116 123', '997', '998', '999']);
});

test('secondary commentary sites are rejected as sources, official sites are not', () => {
  assert.ok(rules(withField('Źródła', '[Art. 46](https://lexlege.pl/ustawa-o-uslugach-platniczych/art-46/)')).includes('secondary-source'));
  assert.ok(rules(withField('Źródła', '[Art. 46](https://www.standardyprawa.pl/akt/289)')).includes('secondary-source'));
  assert.ok(rules(withField('Źródła', '[RF](https://rf.gov.pl/edukacja/)')).every(r => r !== 'secondary-source'));
});

test('a future verification date is an error and a statement of what was read is expected', () => {
  assert.ok(rules(withField('Weryfikacja', '2099-01-01; pełny tekst zalecenia.'), { today: TODAY }).includes('future-date'));
  assert.ok(rules(withField('Weryfikacja', '2026-10-28; sprawdzono poradnik.'), { today: TODAY }).includes('read-scope'));
  assert.ok(!rules(withField('Weryfikacja', '2026-10-28; pełny tekst poradnika.'), { today: TODAY }).includes('read-scope'));
});

test('unpublished records are not linted as advice', () => {
  const record = entries.find(e => e.fields.Status !== 'verified');
  assert.deepEqual(lintEntry({ ...record, fields: { ...record.fields, 'W praktyce': 'chiński przepis' } }), []);
});

test('identical Weryfikacja text is flagged from three records, never for item-specific text', () => {
  const same = n => ({ number: `99.${n}`, fields: { Weryfikacja: '2026-10-28; ocena oryginalnej pozycji i decyzja o niepublikowaniu.' } });
  assert.equal(lintRecords([same(1), same(2)]).length, 0);
  assert.equal(lintRecords([same(1), same(2), same(3)]).length, 3);
  const flagged = lintRecords(entries);
  assert.ok(flagged.length >= 15, 'the known boilerplate debt in chapter 03 is still visible');
  const byNumber = new Map(entries.map(e => [e.number, e]));
  assert.ok(flagged.every(f => byNumber.get(f.id).fields.Status !== 'verified'), 'published records have item-specific verification text');
});

test('number inventory separates figures carried from upstream from new ones', () => {
  const entry = { number: '99.1', fields: { 'W praktyce': 'Spotkanie trwa 30 minut, a poprawa wynosi 30,7 punktu procentowego.', Koszt: 'Brak.' } };
  const upstream = 'Spotkanie trwa 30 minut. Skrócenie o 34%.';
  const rows = numberInventory(entry, upstream);
  assert.equal(rows.find(r => r.value === '30').inUpstream, true);
  assert.equal(rows.find(r => r.value === '30,7').inUpstream, false);
  assert.ok(!rows.some(r => r.value === '34'), 'figures only in upstream are not reader-facing');
});

test('every published item resolves to a non-empty pinned upstream span for the inventory', () => {
  for (const e of verified) assert.match(upstreamSpanOf(e, root), /^### \d+\. /, e.number);
});
