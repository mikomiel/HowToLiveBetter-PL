import test from 'node:test';
import assert from 'node:assert/strict';
import { foldText, numberForms, numberTokens, sameNumber, splitSentences } from '../tools/pl/text.mjs';

test('folding ignores typography a reader cannot see, and nothing else', () => {
  assert.equal(foldText('Kody\u00a0SMS  i\u202fz aplikacji'), 'kody sms i z aplikacji');
  assert.equal(foldText('self\u2010report \u2013 4\u20138 \u2212 5'), 'self-report - 4-8 - 5');
  assert.equal(foldText('„Klucz” i ‘klucz’ «x»'), '"klucz" i \'klucz\' "x"');
  assert.equal(foldText('Koniec\u2026'), 'koniec...');
  assert.equal(foldText('Źółw'), 'źółw');
  assert.notEqual(foldText('100 000'), foldText('100000'), 'a changed number is not typography');
  assert.notEqual(foldText('nie można'), foldText('można'));
});

test('figures are tokenised as written and glued letters make a word, not a figure', () => {
  const raws = text => numberTokens(text).map(t => t.raw);
  assert.deepEqual(raws('Próba 1 234,5 osób, 30,7 pp, 14:00, 0,65.'), ['1 234,5', '30,7', '14:00', '0,65']);
  assert.deepEqual(raws('Włącz 2FA i zobacz NG202 oraz H2O.'), []);
  assert.deepEqual(raws('Od 4 do 8 sesji, d = 0,65; 10,189 osób; 1.234.567.'), ['4', '8', '0,65', '10,189', '1.234.567']);
  assert.deepEqual(raws('Rok 2023 i 14.1.'), ['2023', '14.1']);
  assert.deepEqual(raws(''), []);
});

test('a figure can be read more than one way and the readings are compared', () => {
  assert.ok(sameNumber('10,189', '10189'));
  assert.ok(sameNumber('10,189', '10.189'));
  assert.ok(sameNumber('1 234', '1234'));
  assert.ok(sameNumber('30,7', '30.7'));
  assert.ok(sameNumber('92 128', '128'), 'two table cells read as one number still contain 128');
  assert.ok(sameNumber('92 128', '92128'));
  assert.ok(sameNumber('0,65', '0.65'));
  assert.ok(!sameNumber('30,7', '307'));
  assert.ok(!sameNumber('65', '0,65'));
  assert.ok(!sameNumber('14:00', '14.00'));
  assert.ok(!sameNumber('40', '40,5'));
  assert.deepEqual([...numberForms('10,189')].sort(), ['10.189', '10189']);
});

test('sentences split on full stops that end them, not on abbreviations, decimals or links', () => {
  assert.deepEqual(splitSentences('Pierwsze zdanie. Drugie zdanie! Trzecie?'), ['Pierwsze zdanie.', 'Drugie zdanie!', 'Trzecie?']);
  assert.deepEqual(splitSentences('Np. kody SMS. Zob. godz. 14.00 oraz art. 9 ust. 2.'), ['Np. kody SMS.', 'Zob. godz. 14.00 oraz art. 9 ust. 2.']);
  assert.deepEqual(splitSentences('Np. Kody SMS są wyłudzane. Tj. Kod trafia do oszusta.'), ['Np. Kody SMS są wyłudzane.', 'Tj. Kod trafia do oszusta.'], 'an abbreviation before a capital letter does not end a sentence');
  assert.deepEqual(splitSentences('Zob. Rozdział 3. Tam jest opis.'), ['Zob. Rozdział 3.', 'Tam jest opis.']);
  assert.deepEqual(splitSentences('Wynik to 30,7 punktu. Poprawa wyniosła 0,65.'), ['Wynik to 30,7 punktu.', 'Poprawa wyniosła 0,65.']);
  assert.deepEqual(splitSentences('W 2019 r. Google zbadało 350 tys. prób. To dużo.'), ['W 2019 r. Google zbadało 350 tys. prób.', 'To dużo.']);
  assert.deepEqual(splitSentences('Dodaj [metodę z 14.1](#porada-14-1). Nie podajemy długości.'), ['Dodaj [metodę z 14.1](#porada-14-1).', 'Nie podajemy długości.']);
  assert.deepEqual(splitSentences('Brak kropki na końcu'), ['Brak kropki na końcu']);
  assert.deepEqual(splitSentences('Powiedział „nie". Potem wyszedł.'), ['Powiedział „nie".', 'Potem wyszedł.']);
  assert.deepEqual(splitSentences(''), []);
  assert.deepEqual(splitSentences('   '), []);
});
