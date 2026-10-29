import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPacket, latestSources, ROLE_FIELDS } from '../tools/pl/packet.mjs';
import { checkReport, normalise } from '../tools/pl/quotes.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

function withCache(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'pl-packet-'));
  try { return fn(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
}
const snapshot = lines => ['# SNAPSHOT of a third-party source.', 'Input: x', 'Via: x', 'Access: page', '<<<SNAPSHOT-TEXT-BEGIN>>>', ...lines, '<<<SNAPSHOT-TEXT-END>>>', ''].join('\n');

test('each role receives only its own fields', () => {
  const verifier = buildPacket(root, '14.2', 'verifier');
  const adversary = buildPacket(root, '14.2', 'adversary');
  const editor = buildPacket(root, '14.2', 'editor');
  for (const field of ['Weryfikacja', 'Oryginał', 'Zmiany w adaptacji', 'Źródła', 'Status']) assert.equal(field in verifier.fields, false, `verifier must not see ${field}`);
  assert.deepEqual(Object.keys(verifier.fields), ROLE_FIELDS.verifier.filter(f => f in verifier.fields));
  assert.ok('W praktyce' in verifier.fields && 'Ograniczenia' in verifier.fields);
  assert.ok('Zmiany w adaptacji' in adversary.fields && 'Źródła' in adversary.fields);
  assert.equal('Weryfikacja' in adversary.fields, false);
  assert.match(adversary.upstream.span, /^### 2\. /);
  assert.equal(adversary.upstream.grade, 'C');
  assert.equal(editor.sources, undefined);
  assert.equal(editor.upstream, undefined);
  assert.equal(verifier.upstream, undefined);
  assert.ok(Array.isArray(verifier.sources));
  assert.throws(() => buildPacket(root, '14.2', 'drafter'), /unknown role/);
  assert.throws(() => buildPacket(root, '99.9', 'verifier'), /unknown item/);
});

test('the source list shows the latest record per input, with blocked fetches visible and without a file', () => withCache(dir => {
  const rows = [
    { input: 'https://a.example/x', item: '14.2', access: 'error', accessWords: 'błąd pobrania', file: null },
    { input: 'https://a.example/x', item: '14.2', access: 'page', accessWords: 'treść strony', via: 'https://a.example/x', chars: 900, file: 'aaaa.txt' },
    { input: 'https://b.example/y', item: '14.2', access: 'blocked', accessWords: 'dostęp zablokowany przez serwis', file: null },
    { input: 'https://c.example/z', item: '03.1', access: 'page', file: 'cccc.txt' },
  ];
  writeFileSync(join(dir, 'manifest.jsonl'), rows.map(r => JSON.stringify(r)).join('\n') + '\nnot json\n');
  const sources = latestSources(dir, '14.2');
  assert.equal(sources.length, 2);
  assert.equal(sources.find(s => s.input.includes('a.example')).access, 'page');
  assert.equal(sources.find(s => s.input.includes('b.example')).snapshot, null);
  assert.deepEqual(latestSources(join(dir, 'missing'), '14.2'), []);
  assert.equal(buildPacket(root, '14.2', 'verifier', dir).sources.length, 2);
}));

const SOURCE = ['Pierwsza linia o czymś innym.', 'Kody SMS i z aplikacji można wyłudzić na fałszywej stronie.', 'Badanie objęło 1 234 osoby; poprawa wyniosła 0,65.'];
const claim = (extra = {}) => ({ claim: 'Kody SMS można wyłudzić.', verdict: 'supported', quotes: [{ snapshot: 'aaaa.txt', line: 7, text: 'Kody SMS i z aplikacji można wyłudzić na fałszywej stronie.' }], numbers: [], ...extra });
const check = (claims, lines = SOURCE) => withCache(dir => { writeFileSync(join(dir, 'aaaa.txt'), snapshot(lines)); return checkReport({ claims }, dir); });

test('a quote that is on the cited line of the stored snapshot passes, whatever the spacing and Unicode form', () => {
  assert.equal(check([claim()]).ok, true);
  assert.equal(check([claim({ quotes: [{ snapshot: 'aaaa.txt', line: 7, text: 'Kody  SMS i z aplikacji można wyłudzić' }] })]).ok, true);
  assert.equal(check([claim({ quotes: [{ snapshot: 'aaaa.txt', line: 7, text: 'Kody SMS i z aplikacji można wyłudzić'.normalize('NFD') }] })]).ok, true);
  assert.equal(normalise('a  b\n c'), 'a b c');
});

test('an invented, shifted or out-of-range quote is rejected', () => {
  const quote = (text, line = 7, snapshot = 'aaaa.txt') => claim({ quotes: [{ snapshot, line, text }] });
  const problem = c => check([c]).failures.map(f => f.problem).join(' | ');
  assert.match(problem(quote('Kody SMS są całkowicie bezpieczne.')), /not on line 7/);
  assert.match(problem(quote('Kody SMS i z aplikacji można wyłudzić na fałszywej stronie.', 8)), /not on line 8/);
  assert.match(problem(quote('Input: x', 2)), /outside the source text/);
  assert.match(problem(quote('SNAPSHOT-TEXT-BEGIN', 5)), /outside the source text/);
  assert.match(problem(quote('x', 99)), /outside the source text/);
  assert.match(problem(quote('Kody', 7, 'missing.txt')), /does not exist/);
  assert.match(problem(quote('Kody', 7, '../aaaa.txt')), /does not exist/);
  assert.match(problem(quote('Kody', 7, '/etc/passwd')), /does not exist/);
  assert.match(problem(quote('', 7)), /empty quote/);
  assert.match(problem(claim({ quotes: [] })), /has no quote/);
  assert.match(problem(claim({ quotes: [{ snapshot: 'aaaa.txt', line: 7, text: Array(45).fill('Kody').join(' ') }] })), /longer than 40 words/);
  assert.equal(check([claim({ verdict: 'unsupported', quotes: [] })]).ok, true, 'an unsupported claim needs no quote');
});

test('numbers must be in the quotes or be declared an editorial calculation', () => {
  const text = 'Badanie objęło 1 234 osoby; poprawa wyniosła 0,65.';
  // The snapshot body starts on line 6 of the file, so ['a', text] puts the quoted line at 7.
  const run = numbers => check([claim({ quotes: [{ snapshot: 'aaaa.txt', line: 7, text }], numbers })], ['a', text]);
  assert.equal(run([{ value: '0,65', in_quote: true }, { value: '1 234', in_quote: true }]).ok, true);
  assert.equal(run([{ value: '1234', in_quote: true }]).ok, true, 'thousands spacing does not matter');
  assert.equal(run([{ value: '65', in_quote: true }]).ok, false, '65 is only part of 0,65');
  assert.equal(run([{ value: '30,7', in_quote: true }]).ok, false, 'claimed in the quote but absent from it');
  assert.equal(run([{ value: '30,7', in_quote: false }]).ok, false, 'neither quoted nor declared');
  assert.equal(run([{ value: '30,7', in_quote: false, editorial_calculation: true }]).ok, true);
});
