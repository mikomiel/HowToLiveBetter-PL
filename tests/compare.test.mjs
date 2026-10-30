import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareReports, riskOf } from '../tools/pl/compare.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const entry = (title, fields = {}) => ({ title, fields });
const row = (id, kind, verdict, extra = {}) => ({ id, kind, claim: 'x', verdict, ...extra });
const report = claims => ({ item: '99.1', status: 'PASS', claims });

test('what an item is about decides whether it needs two verifier runs', () => {
  const found = e => riskOf(e).domains;
  assert.deepEqual(found(entry('Ogranicz kofeinę przed snem', { 'W praktyce': 'Zapytaj lekarza o dawkę.' })), ['health']);
  assert.deepEqual(found(entry('Korzystaj z praw do danych', { 'Korzyść i dowody': 'RODO, art. 15.' })), ['law']);
  assert.deepEqual(found(entry('Włącz uwierzytelnianie', { 'W praktyce': 'Zabezpiecz konta.' })), ['accounts']);
  assert.deepEqual(found(entry('Złóż wniosek o zasiłek', {})), ['money']);
  assert.deepEqual(found(entry('Zadzwoń pod 112', {})), ['safety']);
  assert.equal(riskOf(entry('Ogranicz przerwania w zadaniach', { 'W praktyce': 'Zapisz plan na kartce.' })).high, false);
});

test('a common verb or a longer word does not make an item high-stakes, a whole word does', () => {
  assert.equal(riskOf(entry('Ustaw blokadę ekranu')).high, false, 'the imperative "ustaw" is not the word "ustawa"');
  assert.equal(riskOf(entry('Porównaj z grupą kontrolną i kontaktami')).high, false, '"kontrolną" is not "konta"');
  assert.equal(riskOf(entry('Zgodnie z planem')).high, false, '"zgodnie" is not "zgoda"');
  assert.equal(riskOf(entry('Czas na lekcje')).high, false, '"lekcje" is not "lek"');
  assert.equal(riskOf(entry('Bez zgody nie przetwarzaj')).high, true);
  assert.equal(riskOf(entry('Zalogowano na koncie')).high, true);
});

test('the matched words are shown, so a person can see why an item is high-stakes', () => {
  const risk = riskOf(entry('Zmień hasło', { 'W praktyce': 'Sprawdź uprawnienia aplikacji.' }));
  assert.deepEqual(risk, { high: true, domains: ['accounts'], matched: { accounts: ['hasl', 'uprawnien'] } });
  assert.equal(Object.keys(riskOf(entry('Spaceruj')).matched).length, 0);
  assert.equal(riskOf(entry('Zmień hasło [14.1](#porada-14-1)')).domains.length, 1, 'a link target is not text');
});

test('two runs that judge every sentence alike agree', () => {
  const a = report([row('W praktyce#1', 'source_claim', 'supported'), row('W praktyce#2', 'recommendation_derived', 'not_applicable', { depends_on: ['W praktyce#1'] })]);
  const result = compareReports(a, JSON.parse(JSON.stringify(a)));
  assert.deepEqual([result.agree, result.statusA, result.statusB, result.disagreements], [true, 'PASS', 'PASS', []]);
});

test('two runs that leave a different amount open are flagged, and so are two that disagree on whether a sentence is checked', () => {
  const a = report([row('W praktyce#1', 'source_claim', 'supported'), row('Ocena dowodów#1', 'meta_statement', 'not_applicable')]);
  const b = report([row('W praktyce#1', 'source_claim', 'partly', { reason: 'only one product' }), row('Ocena dowodów#1', 'source_description', 'supported')]);
  const result = compareReports(a, b);
  assert.equal(result.agree, false);
  assert.deepEqual([result.statusA, result.statusB], ['PASS', 'UNAVAILABLE']);
  assert.deepEqual(result.disagreements.map(d => [d.id, d.type]), [['W praktyce#1', 'strength'], ['Ocena dowodów#1', 'checking']]);
  assert.equal(result.disagreements[0].b[0].reason, 'only one product');
});

test('splitting a sentence differently is not a disagreement when the runs leave the same amount open', () => {
  const a = report([row('W praktyce#1', 'source_claim', 'supported')]);
  const b = report([row('W praktyce#1.1', 'source_claim', 'supported'), row('W praktyce#1.2', 'meta_statement', 'not_applicable')]);
  assert.equal(compareReports(a, b).agree, true);
  const c = report([row('W praktyce#1.1', 'source_claim', 'supported'), row('W praktyce#1.2', 'source_claim', 'unsupported', { reason: 'x' })]);
  assert.deepEqual(compareReports(a, c).disagreements.map(d => d.type), ['strength']);
});

test('a sentence only one run answered counts as a difference', () => {
  const a = report([row('W praktyce#1', 'source_claim', 'supported'), row('W praktyce#2', 'source_claim', 'unsupported', { reason: 'x' })]);
  const b = report([row('W praktyce#1', 'source_claim', 'supported')]);
  assert.equal(compareReports(a, b).agree, false);
});

test('the command line refuses reports of different items, reports that fail the check, and a wrong number of files', () => {
  const dir = mkdtempSync(join(tmpdir(), 'compare-'));
  const file = (name, body) => { const path = join(dir, name); writeFileSync(path, JSON.stringify(body)); return path; };
  const run = (...args) => spawnSync(process.execPath, [join(root, 'tools/pl/compare.mjs'), ...args], { cwd: root, encoding: 'utf8' });
  assert.equal(run().status, 2);
  assert.match(run().stderr, /Usage/);
  assert.equal(run(file('a.json', { item: '14.2', claims: [] }), file('b.json', { item: '14.3', claims: [] })).status, 2);
  assert.match(run(file('c.json', { item: '14.2', claims: [] }), file('d.json', { item: '03.4', claims: [] })).stderr, /different items: 14\.2 and 03\.4/);
  const refused = run(file('e.json', { item: '14.2', status: 'PASS', claims: [] }), file('f.json', { item: '14.2', status: 'PASS', claims: [] }));
  assert.equal(refused.status, 2);
  assert.match(refused.stderr, /does not pass quotes\.mjs/);
});

test('the risk listing covers every published item and names one by number', () => {
  const run = (...args) => spawnSync(process.execPath, [join(root, 'tools/pl/compare.mjs'), '--risk', ...args], { cwd: root, encoding: 'utf8' });
  const all = JSON.parse(run().stdout);
  assert.ok(all.length >= 32 && all.every(r => /^\d\d\.\d+$/.test(r.item) && typeof r.high === 'boolean'));
  assert.match(run().stderr, /of \d+ published items are high-stakes/);
  const one = JSON.parse(run('14.7').stdout);
  assert.equal(one.high, true);
  assert.ok(one.domains.includes('law'));
  assert.equal(JSON.parse(run('4.4').stdout).high, false);
  assert.equal(run('99.9').status, 2);
});
