import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { published } from '../reader.mjs';
import { loadAll } from '../tools/pl/lint.mjs';
import { coverage, formatResults, queryTokens, searchAdvice } from '../tools/pl/search.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const chapters = loadAll(root);
const entries = chapters.flatMap(c => c.entries);
const numbers = (query, options) => searchAdvice(chapters, query, options).map(r => r.entry.number);

test('a query finds the matching published advice, with or without Polish letters and inflection', () => {
  assert.equal(numbers('klucze dostępu')[0], '14.1');
  assert.equal(numbers('klucze dostepu')[0], '14.1');
  assert.equal(numbers('hasło')[0], '14.2');
  assert.equal(numbers('hasłem')[0], '14.2');
  assert.ok(numbers('sen kofeina').slice(0, 3).includes('03.4'));
  assert.equal(numbers('2FA').includes('14.1'), true, 'short tokens with digits are searchable');
});

test('only verified advice is ever returned, never an editorial record', () => {
  const unpublished = entries.filter(e => e.fields.Status !== 'verified');
  assert.ok(unpublished.length > 0);
  const verified = new Set(published(entries).map(e => e.number));
  for (const e of unpublished) {
    for (const query of [e.title, e.fields['Ograniczenia'], e.fields['Źródła'] ?? '', 'rekord redakcyjny needs_verification needs_localization']) {
      if (!String(query).trim()) continue;
      const found = searchAdvice(chapters, query, { limit: 100 });
      assert.ok(found.every(r => verified.has(r.entry.number)), `${e.number}: ${query.slice(0, 40)}`);
      assert.ok(found.every(r => !r.entry.title.startsWith('Rekord redakcyjny')));
    }
  }
});

test('ranking prefers the title, then the action text, and a limit is honoured', () => {
  const rows = searchAdvice(chapters, 'sen', { limit: 3 });
  assert.equal(rows.length, 3);
  assert.ok(rows[0].score >= rows[1].score && rows[1].score >= rows[2].score);
  assert.ok(rows[0].score >= 3, 'a word in the title scores 3');
  assert.equal(searchAdvice(chapters, 'sen', { limit: 1 }).length, 1);
  assert.deepEqual(searchAdvice(chapters, 'bitcoin kryptowaluty'), []);
});

test('a query without a usable word is an error, not an empty answer', () => {
  for (const bad of ['', '   ', 'ab', '!!', 'a b']) assert.throws(() => queryTokens(bad), /co najmniej jedno słowo/, JSON.stringify(bad));
  assert.deepEqual(queryTokens('Hasło, HASŁA i hasło'), ['haslo', 'hasla']);
});

test('the output states its coverage from the data and shows every field a reader needs', () => {
  const cov = coverage(chapters);
  assert.equal(cov.published, published(entries).length);
  assert.deepEqual(cov.chapters, chapters.map(c => c.id));
  const text = formatResults(chapters, searchAdvice(chapters, 'hasło', { limit: 1 }));
  assert.match(text, new RegExp(`^Zakres: ${cov.published} zweryfikowanych porad z rozdziałów ${cov.chapters.join(', ')}\\.`));
  for (const label of ['Ocena dowodów:', 'Koszt:', 'W praktyce:', 'Korzyść i dowody:', 'Ograniczenia:', 'Ocena redakcyjna:', 'Źródła:', 'Weryfikacja:', 'Odsyłacz: book/pl/14-bezpieczenstwo-kont-i-danych.md#porada-14-2']) assert.ok(text.includes(label), label);
  assert.match(text.split('\n')[0], /Pozostałe rozdziały książki nie są opublikowane\.$/, 'the answer must say the rest of the book is not published');
  assert.match(formatResults(chapters, []), /Brak wyników/);
});

test('the command prints text and JSON, and a bad query exits with an error', () => {
  const run = (...args) => spawnSync(process.execPath, [fileURLToPath(new URL('../tools/pl/search.mjs', import.meta.url)), ...args], { cwd: root });
  const text = run('klucze dostępu', '--limit', '2');
  assert.equal(text.status, 0);
  assert.match(text.stdout.toString(), /\[1\] 14\.1 /);
  const json = JSON.parse(run('hasło', '--json', '--limit', '1').stdout.toString());
  assert.equal(json.results[0].number, '14.2');
  assert.match(json.results[0].link, /#porada-14-2$/);
  assert.equal(json.published, published(entries).length);
  const bad = run('ab');
  assert.equal(bad.status, 2);
  assert.match(bad.stderr.toString(), /co najmniej jedno słowo/);
});
