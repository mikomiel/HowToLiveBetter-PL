import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadAll } from '../tools/pl/lint.mjs';
import { citedInputs, doiFromInput, leadInputs, normaliseItem } from '../tools/pl/sources.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const entries = loadAll(root).flatMap(c => c.entries);
const entry = number => entries.find(e => e.number === number);
const fake = source => ({ number: '99.1', fields: { 'Źródła': source } });

test('item numbers have one canonical form and bad ones say how to write them', () => {
  assert.equal(normaliseItem('3.26'), '03.26');
  assert.equal(normaliseItem('03.26'), '03.26');
  assert.equal(normaliseItem(' 14.2 '), '14.2');
  assert.equal(normaliseItem('14.02'), '14.2');
  for (const bad of ['', 'x', '14', '14.', '1.2.3', '014.2', '14,2']) assert.throws(() => normaliseItem(bad), /not an item number/, bad);
});

test('DOIs are recognised in every spelling the book uses', () => {
  assert.equal(doiFromInput('https://doi.org/10.1145/3308558.3313481'), '10.1145/3308558.3313481');
  assert.equal(doiFromInput('http://dx.doi.org/10.1145/ABC.1'), '10.1145/abc.1');
  assert.equal(doiFromInput('https://www.doi.org/10.1145/abc'), '10.1145/abc');
  assert.equal(doiFromInput('doi: 10.1016/S0140-6736(20)30183-5'), '10.1016/s0140-6736(20)30183-5');
  assert.equal(doiFromInput('https://doi.org/10.1016/S1364-6613%2803%2900028-7'), '10.1016/s1364-6613(03)00028-7');
  assert.equal(doiFromInput('10.1000/a(b))'), '10.1000/a(b)');
  assert.equal(doiFromInput('https://doi.org/10.1000/abc?utm_source=x#frag'), '10.1000/abc');
  assert.equal(doiFromInput('https://rf.gov.pl/10.1000/abc'), null);
  assert.equal(doiFromInput('10.12/short'), null);
});

test('cited sources come from every link form and plain DOIs, once each', () => {
  assert.deepEqual(citedInputs(fake('[A](https://rf.gov.pl/a/); [B](https://eli.gov.pl/api/acts/DU/2025/611/text/U/D20250611Lj.pdf)')), ['https://rf.gov.pl/a/', 'https://eli.gov.pl/api/acts/DU/2025/611/text/U/D20250611Lj.pdf']);
  assert.deepEqual(citedInputs(fake('[RODO](https://pl.wikipedia.org/wiki/RODO_(rozporządzenie)) i dalej.')), ['https://pl.wikipedia.org/wiki/RODO_(rozporządzenie)']);
  assert.deepEqual(citedInputs(fake('Zobacz https://rf.gov.pl/x/y. Oraz (https://nhs.uk/a).')), ['https://rf.gov.pl/x/y', 'https://nhs.uk/a']);
  assert.deepEqual(citedInputs(fake('Potrzebne: doi:10.1001/jamapediatrics.2016.2341 oraz 10.1037/xhp0000100.')), ['10.1001/jamapediatrics.2016.2341', '10.1037/xhp0000100']);
  assert.deepEqual(citedInputs(fake('[a](https://doi.org/10.1000/ABC) oraz 10.1000/abc oraz [b](https://www.doi.org/10.1000/abc)')), ['10.1000/abc'], 'one DOI, three spellings');
  assert.deepEqual(citedInputs(fake('[x](http://insecure.example/a) [y](javascript:alert(1)) [z](#porada-14-1)')), []);
  assert.deepEqual(citedInputs(fake('')), []);
  assert.deepEqual(citedInputs({ number: '99.1', fields: {} }), []);
});

test('every real record is covered, and only the three records with no cited source have nothing to fetch', () => {
  const empty = entries.filter(e => citedInputs(e).length === 0).map(e => e.number);
  assert.deepEqual(empty, ['03.19', '03.25', '14.11']);
  assert.equal(entries.reduce((n, e) => n + citedInputs(e).length, 0), 74);
  assert.deepEqual(citedInputs(entry('14.1')), ['https://wiedza.cert.pl/dobre-praktyki/hasla/', 'https://wiedza.cert.pl/odpornosc-infrastruktury/bezpieczenstwo-webowe/mfa/']);
  assert.deepEqual(citedInputs(entry('03.9')), ['10.1001/jamapediatrics.2016.2341']);
});

test('upstream leads are the DOIs only the Chinese original names, never a cited one', () => {
  const leads = leadInputs(entry('03.26'), root);
  assert.ok(leads.includes('10.7326/m15-2175'));
  assert.ok(leads.every(d => /^10\.\d{4,9}\//.test(d)));
  assert.equal(new Set(leads).size, leads.length);
  const cited = new Set(citedInputs(entry('03.26')));
  assert.ok(leads.every(d => !cited.has(d)));
  for (const e of entries.filter(e => e.fields.Status === 'verified')) assert.ok(Array.isArray(leadInputs(e, root)), e.number);
});
