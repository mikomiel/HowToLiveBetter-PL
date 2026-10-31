import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintEntry, lintRecords, numberInventory, upstreamSpanOf, loadAll, phoneNumbers, PHONE_ALLOWLIST, READER_FIELDS } from '../tools/pl/lint.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const entries = loadAll(root).flatMap(c => c.entries);
const verified = entries.filter(e => e.fields.Status === 'verified');
const base = verified.find(e => e.number === '14.2');
const withField = (field, value) => ({ ...base, fields: { ...base.fields, [field]: value } });
const found = (entry, options) => lintEntry(entry, options).map(f => `${f.rule}:${f.severity}:${f.field}`);
const has = (entry, rule, severity, field) => lintEntry(entry, { today: TODAY }).some(f => f.rule === rule && (!severity || f.severity === severity) && (!field || f.field === field));
const TODAY = '2026-10-29';

test('the published records have no lint errors, judged against the real date', () => {
  assert.deepEqual(verified.flatMap(e => lintEntry(e)).filter(f => f.severity === 'error'), []);
});

test('a Chinese rule in the action text is an error, in other reader fields a warning, in provenance fields allowed', () => {
  const old = 'Zapytaj także o inną metodę. Nie zakładaj jednak, że chiński przepis o obowiązkowej alternatywie działa w Polsce.';
  assert.ok(has(withField('W praktyce', old), 'cn-leak', 'error', 'W praktyce'));
  assert.ok(has(withField('Koszt', 'Opłata w juanach.'), 'cn-leak', 'error', 'Koszt'));
  assert.ok(has(withField('Ograniczenia', 'Badanie dotyczy populacji z Chin.'), 'cn-leak', 'warning', 'Ograniczenia'));
  assert.ok(has({ ...base, title: 'Zapłać przez Alipay' }, 'cn-leak', 'error', 'title'));
  assert.ok(!has(withField('Zmiany w adaptacji', 'Usunięto chińskie nakazy i progi.'), 'cn-leak'));
});

test('each Chinese term is recognised and look-alike Polish words are not', () => {
  for (const hit of ['chiński', 'Chińczycy', 'Chińczyków', 'z Chin', 'w Chinach', 'Pekin', 'WeChat', 'yuan', 'juan', 'RMB', 'CNY', 'Weibo', 'Tencent', 'Hongkong', 'CHIŃSKI', 'Chiński']) {
    assert.ok(has(withField('W praktyce', `Użyj ${hit} teraz.`), 'cn-leak'), hit);
  }
  for (const miss of ['chinina', 'marijuana', 'chinchilla', 'Chinook']) assert.ok(!has(withField('W praktyce', `Substancja ${miss} jest opisana.`), 'cn-leak'), miss);
});

test('phone numbers near a phone word must be allowlisted, in every reader field', () => {
  for (const field of READER_FIELDS) assert.ok(has(withField(field, 'Zadzwoń pod 800 123 456.'), 'phone-number', 'error', field), field);
  assert.deepEqual([...PHONE_ALLOWLIST].sort(), ['112', '116 111', '116 123', '22 194 30', '22 621 02 56', '800 702 222', '992', '997', '998', '999']);
  for (const text of ['Zadzwoń pod 112 lub 116 123.', 'Zadzwoń pod numer 116\u00a0123.', 'numer 116-123', 'Zadzwoń pod 116123.', 'Przy zagrożeniu zadzwoń na numer 112.']) {
    assert.ok(!has(withField('W praktyce', text), 'phone-number'), text);
  }
});

test('Chinese hotlines are caught in natural phrasing, wherever the number stands', () => {
  for (const text of ['Zadzwoń pod 110.', 'Zadzwoń na 120.', 'Zadzwoń pod numer 12345.', 'Skorzystaj z infolinii 12345', 'Numer alarmowy 110', 'Telefon alarmowy: 110', 'Tel. 800 123 456', '800 123 456 to numer infolinii',
    'Zadzwoń na infolinię (tel. 800 190 590)', 'Zadzwoń pod numer 116 123 albo pod numer 800 123 456.', 'Zadzwoń pod 112 lub 110.', 'Dzwoń 12315']) {
    assert.ok(phoneNumbers(text).some(n => !PHONE_ALLOWLIST.has(n.replace(/\s/g, '')) && !PHONE_ALLOWLIST.has(n)), text);
    assert.ok(has(withField('W praktyce', text), 'phone-number', 'error'), text);
  }
});

test('ordinary numbers are not mistaken for phone numbers', () => {
  for (const text of ['Abonament kosztuje 100 000 zł rocznie.', 'Zadzwoń do lekarza, jeśli gorączka przekracza 100 stopni.', 'Nie używaj hasła 12345.', 'W 2023 roku zadzwoń do banku.',
    'Plik ma 128 GB. Zadzwoń jutro.', 'Zadzwoń do lekarza. Kontrola po 120 minutach.', 'Spotkanie trwa 25 minut.']) {
    assert.deepEqual(phoneNumbers(text), [], text);
  }
});

test('secondary commentary sites are rejected as sources, in any link or bare URL form', () => {
  for (const source of ['[Art. 46](https://lexlege.pl/ustawa-o-uslugach-platniczych/art-46/)', '[x](https://www.standardyprawa.pl/akt/289)', '[x](https://pomoc.infor.pl/a)', 'https://lexlege.pl./a', '[x](https://LEXLEGE.PL:443/a)', '[x](https://pl.wikipedia.org/wiki/RODO_(rozporządzenie))']) {
    assert.ok(has(withField('Źródła', source), 'secondary-source', 'error'), source);
  }
  for (const source of ['[RF](https://rf.gov.pl/edukacja/)', '[x](https://notlexlege.pl/a)', '[x](https://lexlege.pl.example.org/a)']) assert.ok(!has(withField('Źródła', source), 'secondary-source'), source);
});

test('the verification date may be today but not tomorrow', () => {
  assert.ok(!found(withField('Weryfikacja', '2026-10-29; pełny tekst poradnika.'), { today: TODAY }).some(f => f.startsWith('future-date')));
  assert.ok(has(withField('Weryfikacja', '2026-10-30; pełny tekst poradnika.'), 'future-date', 'error'));
  assert.ok(has(withField('Weryfikacja', '2099-01-01; pełny tekst poradnika.'), 'future-date', 'error'));
});

test('read scope: a positive statement counts, a bare negation or an unrelated word does not', () => {
  for (const ok of ['pełny tekst poradnika.', 'abstrakt autorów. Bez pełnego tekstu.', 'art. 9 RODO.', 'fragment rozdziału.', 'streszczenie zalecenia.']) assert.ok(!has(withField('Weryfikacja', `2026-10-28; ${ok}`), 'read-scope'), ok);
  for (const bad of ['nie udało się uzyskać pełnego tekstu.', 'wypełniono formularz.', 'bez abstraktu.', 'zalecenia dotyczące bezdechu.']) assert.ok(has(withField('Weryfikacja', `2026-10-28; ${bad}`), 'read-scope', 'warning'), bad);
});

test('unpublished records are not linted as advice', () => {
  const record = entries.find(e => e.fields.Status !== 'verified');
  assert.deepEqual(lintEntry({ ...record, title: 'chiński', fields: { ...record.fields, 'W praktyce': 'chiński przepis' } }), []);
});

test('identical Weryfikacja text is flagged from three records, never for item-specific text', () => {
  const same = n => ({ number: `99.${n}`, fields: { Weryfikacja: '2026-10-28; ocena oryginalnej pozycji i decyzja o niepublikowaniu.' } });
  assert.equal(lintRecords([same(1), same(2)]).length, 0);
  assert.equal(lintRecords([same(1), same(2), same(3)]).length, 3);
  const byNumber = new Map(entries.map(e => [e.number, e]));
  assert.ok(lintRecords(entries).every(f => byNumber.get(f.id).fields.Status !== 'verified'), 'published records have item-specific verification text');
});

test('number inventory separates carried figures from new ones and ignores noise', () => {
  const entry = fields => ({ number: '99.1', fields });
  const inv = (text, upstream, field = 'W praktyce') => numberInventory(entry({ [field]: text }), '### 1. Tytuł 99\n' + upstream);
  const value = (rows, v) => rows.find(r => r.value === v);
  assert.equal(value(inv('Trwa 30 minut, poprawa to 30,7 punktu.', 'Trwa 30 minut.'), '30').inUpstream, true);
  assert.equal(value(inv('Trwa 30 minut, poprawa to 30,7 punktu.', 'Trwa 30 minut.'), '30,7').inUpstream, false);
  assert.equal(inv('To 30,7.', 'Wynik 307 osób.').length, 1);
  assert.equal(value(inv('To 30,7.', 'Wynik 307 osób.'), '30,7').inUpstream, false);
  assert.equal(value(inv('Próba 10 189 osób.', 'Próba 10,189 osób.'), '10 189').inUpstream, true);
  assert.equal(value(inv('Próba 10 189 osób.', 'Próba 10 189 osób.'), '10 189').inUpstream, true);
  assert.equal(value(inv('Liczba 7.', 'Wynik 30.7 i 17.'), '7').inUpstream, false);
  assert.equal(value(inv('Trwa 30 minut.', 'Wynik 30.7 minut.'), '30').inUpstream, false, '30 is not inside 30.7');
  // The Chinese original never writes decimals with a comma, so a comma between digits is a list or thousands and each part counts as carried.
  // Over-reporting a figure as carried only sends it to a verifier; under-reporting would let an unchecked figure through.
  assert.equal(value(inv('Trwa 30 minut.', 'Wynik 30,7 minut.'), '30').inUpstream, true);
  assert.equal(value(inv('Liczba 99.', 'Zobacz https://doi.org/10.99/abc i nagłówek.'), '99').inUpstream, false);
  assert.equal(value(inv('Liczba 5.', '34% skrócenie'), '5').inUpstream, false);
  assert.deepEqual(inv('Włącz 2FA i zobacz NG202.', 'x').map(r => r.value), []);
  assert.deepEqual(inv('Zob. [14.1](#porada-14-1).', 'x').map(r => r.value), []);
  assert.equal(value(inv('Do 14:00.', 'Nie po 14:00.'), '14:00').inUpstream, true);
  assert.equal(value(inv('Do 14:00.', 'Nie po 14:00.'), '14:00').fields[0], 'W praktyce');
});

test('every published item resolves to a pinned upstream span, and a bad link is an error, never an empty span', () => {
  for (const e of verified) assert.match(upstreamSpanOf(e, root), /^### \d+\. /, e.number);
  const link = href => ({ number: '99.1', fields: { Oryginał: `[99.1](${href})` } });
  const good = 'https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/04-%E4%B8%8D%E8%A6%81%E6%B5%AA%E8%B4%B9%E6%97%B6%E9%97%B4.md';
  assert.match(upstreamSpanOf(link(good + '#L7-L14'), root), /^### /);
  for (const bad of [good, good + '#L7', good + '#l7-l14', good + '#L14-L7', good + '#L99999-L100000', good.replace('/blob/', '/tree/') + '#L1-L2', 'https://example.org/x#L1-L2',
    good.replace('book/04-', 'book/../package.json?x=') + '#L1-L2', good.replace('/book/04-', '/book%2F..%2F..%2Fpackage.json%3F') + '#L1-L2', good.replace('book/04-', 'book/%2e%2e%2f04-') + '#L1-L2']) {
    assert.throws(() => upstreamSpanOf(link(bad), root), /Oryginał|empty|pinned/, bad);
  }
  assert.throws(() => upstreamSpanOf({ number: '99.1', fields: {} }, root), /no Oryginał/);
});

test('importing the tool never throws, and the command works through a symlink', () => {
  const lint = fileURLToPath(new URL('../tools/pl/lint.mjs', import.meta.url));
  const imported = spawnSync(process.execPath, ['--input-type=module', '-e', `await import(${JSON.stringify(lint)}); console.log('imported')`, 'not-a-file']);
  assert.equal(imported.status, 0);
  assert.match(imported.stdout.toString(), /imported/);
  const dir = mkdtempSync(join(tmpdir(), 'pl-lint-'));
  try {
    symlinkSync(lint, join(dir, 'link.mjs'));
    const run = spawnSync(process.execPath, [join(dir, 'link.mjs')]);
    assert.equal(run.status, 0);
    assert.match(run.stdout.toString(), new RegExp(`${loadAll(root).flatMap(c => c.entries).length} records, 0 errors`));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('compact and prefixed numbers, abbreviations before the number and every dash are caught as phone numbers', () => {
  for (const text of ['Zadzwoń pod 800123456.', 'Zadzwoń pod +48 800 123 456.', 'Zadzwoń pod 0048 22 123 45 67.', 'Zadzwoń pod (22) 123-45-67.', 'Nr tel. 800 123 456.', 'Np. zadzwoń pod 110.',
    'Zadzwoń na linię 12345.', 'Skorzystaj z linii 12315.', 'Kontakt: 800 123 456.', 'Zgłoś pod 120.', 'Dzwoń: 800\u2013123\u2013456.', 'Dzwoń: 800\u2011123\u2011456.', 'Dzwoń: 800\u2009123\u2009456.', 'Telefon 22.123.45.67.']) {
    assert.ok(phoneNumbers(text).length > 0, text);
    assert.ok(has(withField('W praktyce', text), 'phone-number', 'error'), text);
  }
  for (const text of ['Zadzwoń pod 116\u2013123.', 'Zadzwoń pod 116\u2011123.', 'Zadzwoń pod 116\u2009123.', 'Zadzwoń pod +48 112.', 'Zadzwoń pod 116.123.']) assert.ok(!has(withField('W praktyce', text), 'phone-number'), text);
});

test('ordinary figures near a phone word stay clean: blood pressure, decimals, units, versions and years', () => {
  for (const text of ['Przy ciśnieniu 180/120 zadzwoń do lekarza.', 'Przy 140/90 zadzwoń do lekarza.', 'Zadzwoń, gdy temperatura wynosi 100,4 lub 126,5 mg.', 'Zadzwoń po 5000 kroków lub 3000 uderzeń.',
    'Zadzwoń do lekarza przy 40 ng/ml i 50 Hz.', 'Zadzwoń, jeśli 120 kcal to za dużo.', 'Zadzwoń: wersja 802.11ax i rok 2024.', 'Zadzwoń do banku w ciągu 120 minut.', 'Zadzwoń po 300 osobach.']) {
    assert.deepEqual(phoneNumbers(text), [], text);
  }
});

test('more Chinese spellings are recognised and look-alike words are not', () => {
  for (const hit of ['Beijing', 'Shanghai', 'Shenzhen', 'TikTok', 'Huawei', 'ByteDance', 'hukou', 'Union Pay', 'renminbi', 'Hong Kong', 'Hongkong', 'ChRL', 'Państwo Środka', 'Xi Jinping']) {
    assert.ok(has(withField('W praktyce', `Użyj ${hit} teraz.`), 'cn-leak'), hit);
  }
  for (const miss of ['hukowate', 'środka ciężkości', 'Państwo i obywatel']) assert.ok(!has(withField('W praktyce', `Zobacz ${miss}.`), 'cn-leak'), miss);
});

test('a negative statement is not a statement of what was read', () => {
  for (const bad of ['brak dostępu do pełnego tekstu.', 'niedostępny abstrakt.', 'nie sprawdzono pełnego tekstu poradnika.', 'bez dostępu do dokumentu.']) assert.ok(has(withField('Weryfikacja', `2026-10-28; ${bad}`), 'read-scope', 'warning'), bad);
  assert.ok(!has(withField('Weryfikacja', '2026-10-28; abstrakt autorów; brak pełnego tekstu.'), 'read-scope'), 'a positive statement alongside the negation counts');
});

test('upstream cleaning does not let a link swallow Chinese text or a list of numbers merge into one figure', () => {
  const entry = fields => ({ number: '99.1', fields });
  const found = (reader, span) => numberInventory(entry({ 'W praktyce': reader }), '### 1. T\n' + span)[0].inUpstream;
  assert.equal(found('Wynik 30.', '<https://doi.org/10.1000/abc>的结果是 30 分钟'), true, 'text after a link followed by Chinese characters is kept');
  assert.equal(found('Kody 120.', 'Numery 110,120,119 w Chinach'), true, 'a list of numbers is searched as written');
  assert.equal(found('Próba 10 189.', 'Próba 10,189 osób'), true, 'a thousands comma matches the Polish spacing');
  assert.equal(found('Liczba 119.', 'Numery 110,120,119'), true);
  assert.equal(found('Liczba 130.', 'Numery 110,120,119'), false);
});

test('an Oryginał field must hold exactly one link', () => {
  const good = 'https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e2242bd6216c9255192b8a8957a08c55a/book/04-%E4%B8%8D%E8%A6%81%E6%B5%AA%E8%B4%B9%E6%97%B6%E9%97%B4.md#L7-L14';
  assert.match(upstreamSpanOf({ number: '99.1', fields: { Oryginał: `[99.1](${good})` } }, root), /^### /);
  assert.throws(() => upstreamSpanOf({ number: '99.1', fields: { Oryginał: `[99.1](${good}) [99.2](${good})` } }, root), /exactly one link \(found 2\)/);
  assert.throws(() => upstreamSpanOf({ number: '99.1', fields: { Oryginał: '[brak](x)' } }, root), /pinned github\.com/);
});
