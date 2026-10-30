import test, { mock, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FORMAT, MARKER_BEGIN, MARKER_END, fetchSource, settings } from '../tools/pl/fetch.mjs';
import { buildPacket, propositions, ROLE_FIELDS, sourceRows } from '../tools/pl/packet.mjs';
import { checkAdversaryReport, checkReport, deriveStatus } from '../tools/pl/quotes.mjs';
import { loadAll } from '../tools/pl/lint.mjs';
import { citedInputs } from '../tools/pl/sources.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
let dir;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'pl-packet-')); settings.dnsCheck = false; });
afterEach(() => { mock.restoreAll(); rmSync(dir, { recursive: true, force: true }); settings.dnsCheck = true; });

// A snapshot written the way fetch.mjs writes it. The body starts on line 7 of the file.
function snapshot(name, lines, { format = FORMAT, markers = true } = {}) {
  const body = lines.join('\n');
  const head = ['# SNAPSHOT of a third-party source.', `Format: ${format}`, 'Input: x', 'Via: x', 'Access: page'];
  writeFileSync(join(dir, name), (markers ? [...head, MARKER_BEGIN, body, MARKER_END, ''] : [...head, body, '']).join('\n'));
  return createHash('sha256').update(body).digest('hex');
}
const row = (name, sha256, origin = 'cited') => ({ origin, input: 'https://x.example/' + name, access: 'page', snapshot: name, sha256 });
const synthetic = (props, sources) => ({ item: '99.1', propositions: props.map((text, i) => ({ id: `W praktyce#${i + 1}`, field: 'W praktyce', index: i + 1, text })), sources, warnings: [] });
const claim = (n, text, extra = {}) => ({ id: `W praktyce#${n}`, kind: 'source_claim', claim: text, verdict: 'supported', ...extra });
const problems = result => result.failures.map(f => f.problem).join(' | ');

const LINES = ['Pierwsza linia o czymś innym.', 'Kody SMS i z aplikacji można wyłudzić na fałszywej stronie.', 'Badanie objęło 1 234 osoby; poprawa wyniosła 0,65 punktu.', 'self\u2010report, „cytat” i 4\u20138 sesji'];
function one(extra = {}) {
  const sha = snapshot('aaaa.txt', LINES);
  const packet = synthetic(['Kody SMS można wyłudzić.', 'Poprawa wyniosła 0,65 punktu.'], [row('aaaa.txt', sha)]);
  const report = { item: '99.1', status: 'PASS', claims: [
    claim(1, 'Kody SMS można wyłudzić.', { quotes: [{ snapshot: 'aaaa.txt', line: 8, text: 'Kody SMS i z aplikacji można wyłudzić' }] }),
    claim(2, 'Poprawa wyniosła 0,65 punktu.', { quotes: [{ snapshot: 'aaaa.txt', line: 9, text: 'poprawa wyniosła 0,65 punktu' }] }),
  ], ...extra };
  return { packet, report };
}
const run = (report, packet) => checkReport(report, packet, dir);

test('each role receives only its own fields, and only the verifier and adversary get sentences and sources', () => {
  const verifier = buildPacket(root, '14.2', 'verifier', dir);
  const adversary = buildPacket(root, '3.1', 'adversary', dir);
  const editor = buildPacket(root, '14.2', 'editor', dir);
  for (const field of ['Weryfikacja', 'Oryginał', 'Zmiany w adaptacji', 'Źródła', 'Status']) assert.equal(field in verifier.fields, false, `verifier must not see ${field}`);
  assert.ok('W praktyce' in verifier.fields && 'Ograniczenia' in verifier.fields);
  assert.ok('Zmiany w adaptacji' in adversary.fields && 'Źródła' in adversary.fields);
  assert.equal('Weryfikacja' in adversary.fields, false);
  assert.equal(adversary.item, '03.1', 'item numbers are normalised');
  assert.equal(adversary.upstream.lines[0].n, 1);
  assert.match(adversary.upstream.lines[0].text, /^### 1\. /);
  assert.ok(['A', 'B', 'C'].includes(adversary.upstream.grade));
  assert.equal(editor.sources, undefined);
  assert.equal(editor.propositions, undefined);
  assert.equal(editor.upstream, undefined);
  assert.equal(verifier.upstream, undefined);
  assert.equal(verifier.snapshotDir, '.cache/sources');
  assert.throws(() => buildPacket(root, '14.2', 'drafter'), /unknown role/);
  assert.throws(() => buildPacket(root, '14.2', 'constructor'), /unknown role/);
  assert.throws(() => buildPacket(root, '99.9', 'verifier', dir), /unknown item/);
  assert.throws(() => buildPacket(root, 'x', 'verifier', dir), /not an item number/);
  assert.deepEqual(Object.keys(ROLE_FIELDS), ['verifier', 'adversary', 'editor']);
});

test('the title and every sentence of the reader fields get an id the reviewer must answer for', () => {
  const entry = loadAll(root).flatMap(c => c.entries).find(e => e.number === '14.2');
  const props = propositions(entry);
  assert.equal(props[0].id, 'title#1');
  assert.equal(props[0].text, entry.title);
  assert.equal(new Set(props.map(p => p.id)).size, props.length);
  assert.ok(props.some(p => p.id === 'W praktyce#3'));
  assert.ok(props.every(p => p.text.trim() && !/^\s|\s$/.test(p.text)));
  for (const field of ['Koszt', 'W praktyce', 'Korzyść i dowody', 'Ocena dowodów', 'Ocena redakcyjna', 'Ograniczenia']) {
    assert.equal(props.filter(p => p.field === field).map(p => p.text).join(' ').replace(/\s+/g, ' '), entry.fields[field].replace(/\s+/g, ' '), `${field} is fully covered, in order`);
  }
});

test('every cited source is listed, a missing one as missing, and a cache in the old format is reported loudly', () => {
  const entry = loadAll(root).flatMap(c => c.entries).find(e => e.number === '14.1');
  const inputs = citedInputs(entry);
  assert.equal(inputs.length, 2);
  let { rows, warnings } = sourceRows(dir, entry);
  assert.deepEqual(rows.map(r => [r.origin, r.access, r.snapshot]), inputs.map(() => ['cited', 'missing', null]));
  assert.deepEqual(warnings, []);
  appendFileSync(join(dir, 'manifest.jsonl'), JSON.stringify({ input: inputs[0], access: 'page', file: 'old.txt', chars: 10 }) + '\n');
  ({ rows, warnings } = sourceRows(dir, entry));
  assert.equal(rows[0].access, 'missing');
  assert.match(rows[0].accessWords, /stary format/);
  assert.match(warnings[0], /Legacy cache record.*re-fetch/);
  appendFileSync(join(dir, 'manifest.jsonl'), JSON.stringify({ format: FORMAT, item: '14.1', origin: 'cited', input: inputs[1], access: 'page', accessWords: 'treść strony', file: 'gone.txt', chars: 10, sha256: 'x' }) + '\n');
  ({ rows, warnings } = sourceRows(dir, entry));
  assert.match(warnings.at(-1), /gone\.txt.*missing from the cache/);
  assert.equal(rows[1].snapshot, null);
  writeFileSync(join(dir, 'manifest.jsonl'), 'not json\n');
  assert.equal(sourceRows(dir, entry).rows.length, 2, 'a damaged manifest never breaks the packet');
  const none = sourceRows(dir, { number: '99.1', fields: { 'Źródła': 'brak' } });
  assert.match(none.warnings[0], /cites no fetchable source/);
});

test('an upstream lead fetched for the item is listed as a lead, never as a cited source', async () => {
  const json = body => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
  mock.method(globalThis, 'fetch', async url => (String(url).includes('europepmc') ? json({ resultList: { result: [{ doi: '10.7326/m15-2175', title: 'Lead', abstractText: 'abstrakt' }] } }) : json({})));
  await fetchSource('10.7326/m15-2175', dir, { item: '03.26', origin: 'upstream-lead' });
  const packet = buildPacket(root, '03.26', 'verifier', dir);
  const lead = packet.sources.find(r => r.origin === 'lead');
  assert.equal(lead.input, '10.7326/m15-2175');
  assert.equal(lead.access, 'abstract');
  assert.ok(packet.sources.filter(r => r.origin === 'cited').length >= 3);
  assert.ok(packet.sources.filter(r => r.origin === 'cited').every(r => r.access === 'missing'));
});

test('a stale cited record of the item is not a lead, and only upstream-lead records are', () => {
  const entry = loadAll(root).flatMap(c => c.entries).find(e => e.number === '14.1');
  const record = (input, origin) => JSON.stringify({ format: FORMAT, item: '14.1', origin, input, access: 'abstract', accessWords: 'abstrakt', file: null, chars: 0 }) + '\n';
  appendFileSync(join(dir, 'manifest.jsonl'), record('https://stale.example/old-source', 'cited') + record('10.1000/lead', 'upstream-lead'));
  const { rows } = sourceRows(dir, entry);
  assert.deepEqual(rows.filter(r => r.origin === 'lead').map(r => r.input), ['10.1000/lead']);
  assert.ok(!rows.some(r => r.input === 'https://stale.example/old-source'));
});

test('the whole path works end to end: fetch, packet, report, check', async () => {
  const entry = loadAll(root).flatMap(c => c.entries).find(e => e.number === '14.2');
  const props = propositions(entry);
  const page = `<html><head><title>CERT</title></head><body><main>${props.map(p => `<p>${p.text.replaceAll('&', '&amp;')}</p>`).join('')}${'<p>Dodatkowy akapit tła.</p>'.repeat(20)}</main></body></html>`;
  mock.method(globalThis, 'fetch', async () => new Response(page, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } }));
  for (const input of citedInputs(entry)) await fetchSource(input, dir, { item: '14.2' });
  const packet = buildPacket(root, '14.2', 'verifier', dir);
  assert.deepEqual(packet.warnings, []);
  assert.equal(packet.sources.length, 1);
  const [source] = packet.sources;
  assert.equal(source.access, 'page');
  assert.match(source.snapshot, /^[0-9a-f]{16}\.txt$/);
  const lines = readFileSync(join(dir, source.snapshot), 'utf8').split('\n');
  const claims = props.map(p => {
    const words = p.text.split(' ');
    const quote = words.slice(0, 12).join(' ');
    const line = lines.findIndex((l, i) => i > 5 && l.includes(quote)) + 1;
    return { id: p.id, kind: 'source_claim', claim: p.text, verdict: 'supported', quotes: [{ snapshot: source.snapshot, line, text: quote }] };
  });
  const result = run({ item: '14.2', status: 'PASS', claims }, packet);
  assert.deepEqual(result.failures, []);
  assert.equal(result.ok, true);
  assert.equal(result.status, 'PASS');
  assert.equal(result.verdicts.supported, props.length);
  assert.equal(result.quotesChecked, props.length);
  // The same report fails the moment the item is not what the report answered for.
  assert.equal(run({ item: '14.2', status: 'PASS', claims: claims.slice(1) }, packet).ok, false);
  assert.equal(run({ item: '14.3', status: 'PASS', claims }, packet).ok, false);
});

test('a good report passes, whatever dashes, quote marks, spaces or case the snapshot and the quote use', () => {
  const { packet, report } = one();
  assert.deepEqual(run(report, packet).failures, []);
  const alt = one().report;
  alt.claims[0].quotes[0].text = 'KODY  SMS i z\u00a0aplikacji można wyłudzić';
  assert.equal(run(alt, packet).ok, true);
  const dashed = { ...one(), report: null };
  const sha = snapshot('aaaa.txt', LINES);
  const p2 = synthetic(['Metoda self-report objęła 4-8 sesji.'], [row('aaaa.txt', sha)]);
  const r2 = { item: '99.1', status: 'PASS', claims: [claim(1, 'Metoda self-report objęła 4-8 sesji.', { quotes: [{ snapshot: 'aaaa.txt', line: 10, text: 'self-report, "cytat" i 4-8 sesji' }] })] };
  assert.deepEqual(run(r2, p2).failures, [], 'curly quotes and non-breaking hyphens in the source match their plain forms');
  assert.ok(dashed);
});

test('a report that checks nothing, answers for another item or is not a report is rejected', () => {
  const { packet } = one();
  assert.match(problems(run(null, packet)), /not a JSON object/);
  assert.match(problems(run([], packet)), /not a JSON object/);
  assert.match(problems(run({ item: '99.1', status: 'PASS', claims: [] }, packet)), /non-empty array/);
  assert.match(problems(run({ item: '99.1', status: 'PASS' }, packet)), /non-empty array/);
  assert.match(problems(run({ item: '14.2', status: 'PASS', claims: [] }, packet)), /report is for item "14.2"/);
  assert.match(problems(run({ item: '99.1', status: 'GREAT', claims: [claim(1, 'Kody SMS można wyłudzić.')] }, packet)), /status must be one of/);
});

test('every sentence must be answered, and every figure of a sentence must be in a claim', () => {
  const { packet, report } = one();
  const missing = { ...report, claims: report.claims.slice(0, 1) };
  const gap = run(missing, packet);
  assert.deepEqual(gap.failures.map(f => [f.where, f.problem]), [['W praktyce#2', 'no claim answers for this sentence']]);
  const noFigure = { ...report, claims: [report.claims[0], claim(2, 'Poprawa wyniosła punktu.', { quotes: report.claims[1].quotes })] };
  assert.match(problems(run(noFigure, packet)), /the figure 0,65 of this sentence is in no claim/);
  const split = { ...report, claims: [report.claims[0], claim(2, 'Poprawa wyniosła', { id: 'W praktyce#2.1', quotes: report.claims[1].quotes }), claim(2, '0,65 punktu', { id: 'W praktyce#2.2', quotes: report.claims[1].quotes })] };
  assert.equal(run(split, packet).ok, true, 'a sentence may be answered in several numbered rows');
  const unnumbered = { ...report, claims: [report.claims[0], claim(2, 'Poprawa wyniosła', { quotes: report.claims[1].quotes }), claim(2, '0,65 punktu', { quotes: report.claims[1].quotes })] };
  assert.match(problems(run(unnumbered, packet)), /answered in 2 rows: every row of it needs a numbered id such as "W praktyce#2\.1"/);
  const twice = { ...report, claims: [report.claims[0], claim(2, 'Poprawa wyniosła', { id: 'W praktyce#2.1', quotes: report.claims[1].quotes }), claim(2, '0,65 punktu', { id: 'W praktyce#2.1', quotes: report.claims[1].quotes })] };
  assert.match(problems(run(twice, packet)), /two rows have this id/);
  assert.match(problems(run({ ...report, claims: [report.claims[0], claim(2, 'Poprawa wyniosła 0,65 punktu.', { id: 'W praktyce#2.x', quotes: report.claims[1].quotes })] }, packet)), /not a sentence of the item/);
});

test('a claim must be words of the sentence it names, with a valid kind and verdict', () => {
  const { packet, report } = one();
  const edit = (i, patch) => ({ ...report, claims: report.claims.map((c, n) => (n === i ? { ...c, ...patch } : c)) });
  assert.match(problems(run(edit(0, { id: 'W praktyce#9' }), packet)), /not a sentence of the item/);
  assert.match(problems(run(edit(0, { claim: 'Coś zupełnie innego.' }), packet)), /not part of that sentence/);
  assert.match(problems(run(edit(0, { claim: '  ' }), packet)), /claim text is empty/);
  assert.match(problems(run(edit(0, { kind: 'opinion' }), packet)), /kind must be one of/);
  assert.match(problems(run(edit(0, { verdict: 'probably' }), packet)), /verdict must be one of/);
  assert.match(problems(run(edit(0, { verdict: 'supported', quotes: [] }), packet)), /needs at least one quote/);
  assert.match(problems(run(edit(0, { kind: 'editorial_estimate' }), packet)), /must have verdict not_applicable/);
  assert.match(problems(run(edit(0, { verdict: 'not_applicable' }), packet)), /source_claim cannot have verdict not_applicable/);
  assert.equal(run(edit(0, { kind: 'editorial_estimate', verdict: 'not_applicable', quotes: [] }), packet).ok, true);
});

test('a derived recommendation must depend on source rows of the same report, or be marked unsupported', () => {
  const { packet, report } = one();
  const derived = (depends_on, extra = {}) => ({ ...report, claims: [report.claims[0], { id: 'W praktyce#2', kind: 'recommendation_derived', claim: 'Poprawa wyniosła 0,65 punktu.', verdict: 'not_applicable', depends_on, ...extra }] });
  assert.match(problems(run(derived([]), packet)), /must list depends_on/);
  assert.match(problems(run(derived(['W praktyce#7']), packet)), /"W praktyce#7" is not the id of a row of this report/);
  assert.match(problems(run(derived(['W praktyce#2']), packet)), /cannot depend on itself/);
  assert.equal(run(derived(['W praktyce#1']), packet).ok, true);
  // Only a row that carries a source can back advice.
  const editorial = { id: 'Koszt#1', kind: 'editorial_estimate', claim: 'x', verdict: 'not_applicable' };
  const withEditorial = derived(['Koszt#1']);
  withEditorial.claims.push(editorial);
  assert.match(problems(run(withEditorial, { ...packet, propositions: [...packet.propositions, { id: 'Koszt#1', field: 'Koszt', index: 1, text: 'x' }] })), /is a editorial_estimate: only source_claim and source_description rows can back a recommendation/);
  // A sentence that was split cannot be named as a whole: the failure says which parts exist.
  const splitFirst = { ...report, claims: [claim(1, 'Kody SMS', { id: 'W praktyce#1.1', quotes: report.claims[0].quotes }), claim(1, 'można wyłudzić.', { id: 'W praktyce#1.2', quotes: report.claims[0].quotes }), derived(['W praktyce#1']).claims[1]] };
  assert.match(problems(run(splitFirst, packet)), /that sentence is split: use W praktyce#1\.1, W praktyce#1\.2/);
  assert.equal(run({ ...splitFirst, claims: [...splitFirst.claims.slice(0, 2), derived(['W praktyce#1.2']).claims[1]] }, packet).ok, true);
  // A recommendation nothing backs is said so, and it fails the item instead of hiding behind a stretched dependency.
  const ungrounded = (extra, status = 'FAIL') => ({ ...derived([], { verdict: 'unsupported', ...extra }), status });
  assert.match(problems(run(ungrounded({}), packet)), /needs a reason/);
  const result = run(ungrounded({ reason: 'no snapshot row speaks of recovery' }), packet);
  assert.deepEqual([result.ok, result.status], [true, 'FAIL']);
  assert.match(problems(run(ungrounded({ reason: 'x' }, 'PASS'), packet)), /status PASS does not match the verdicts, which give FAIL/);
  assert.match(problems(run(derived(['W praktyce#1'], { verdict: 'supported' }), packet)), /not_applicable \(fully backed\), partly \(backed in part\) or unsupported \(nothing backs it\)/);
  // Backing in part leaves the item unavailable, not failed, and may rest on a source line that gives the same advice.
  const partlyBacked = (extra, status = 'UNAVAILABLE') => ({ ...derived([], { verdict: 'partly', ...extra }), status });
  assert.match(problems(run(partlyBacked({ reason: 'only half is backed' }), packet)), /must list depends_on .* or carry quotes/);
  const viaRow = run(partlyBacked({ depends_on: ['W praktyce#1'], reason: 'the second half has no row' }), packet);
  assert.deepEqual([viaRow.ok, viaRow.status], [true, 'UNAVAILABLE']);
  const viaQuote = run(partlyBacked({ quotes: [{ snapshot: 'aaaa.txt', line: 8, text: 'Kody SMS i z aplikacji można wyłudzić' }], reason: 'the source gives only the first half' }), packet);
  assert.deepEqual([viaQuote.ok, viaQuote.status, viaQuote.quotesChecked], [true, 'UNAVAILABLE', 2]);
  assert.match(problems(run(partlyBacked({ quotes: [{ snapshot: 'aaaa.txt', line: 8, text: 'Kody SMS są całkowicie bezpieczne.' }], reason: 'x' }), packet)), /not on line 8/, 'a quote on a recommendation is held to the same standard');
  assert.match(problems(run(partlyBacked({ depends_on: ['W praktyce#1'] }), packet)), /needs a reason/);
  // A source line that gives the advice itself backs a fully backed recommendation too.
  const direct = run(derived([], { quotes: [{ snapshot: 'aaaa.txt', line: 8, text: 'Kody SMS i z aplikacji można wyłudzić' }] }), packet);
  assert.equal(direct.ok, true);
  // Nothing behind it means nothing behind it.
  assert.match(problems(run({ ...derived(['W praktyce#1'], { verdict: 'unsupported', reason: 'x' }), status: 'FAIL' }, packet)), /unsupported recommendation has nothing behind it/);
});

test('what the item says about its source is checked like a claim from it, and a figure with no source is shown to a person', () => {
  const { packet, report } = one();
  const described = (patch = {}) => ({ ...report, claims: [report.claims[0], { id: 'W praktyce#2', kind: 'source_description', claim: 'Poprawa wyniosła 0,65 punktu.', verdict: 'supported', quotes: report.claims[1].quotes, ...patch }] });
  assert.equal(run(described(), packet).ok, true);
  assert.match(problems(run(described({ quotes: [] }), packet)), /needs at least one quote/);
  assert.match(problems(run(described({ verdict: 'not_applicable' }), packet)), /source_description cannot have verdict not_applicable/);
  assert.match(problems(run(described({ quotes: [{ snapshot: 'aaaa.txt', line: 8, text: 'Kody SMS i z aplikacji można wyłudzić' }] }), packet)), /the number 0,65 is neither in a quote/);
  const refuted = run(described({ verdict: 'contradicted', reason: 'the source says it was a cohort study' }), packet);
  assert.equal(refuted.status, 'FAIL', 'a wrong description of the source fails the item like a wrong claim');
  // A figure in a row that is not checked against a source is allowed, but listed.
  const estimate = { ...report, claims: [report.claims[0], { id: 'W praktyce#2', kind: 'editorial_estimate', claim: 'Poprawa wyniosła 0,65 punktu.', verdict: 'not_applicable' }] };
  const shown = run(estimate, packet);
  assert.equal(shown.ok, true);
  assert.deepEqual(shown.warnings, ['figure 0,65 in W praktyce#2 (editorial_estimate) is checked against no source']);
  const declared = { ...estimate, claims: [report.claims[0], { ...estimate.claims[1], numbers: [{ value: '0,65', editorial_calculation: true, basis: '60,65 minus 60' }] }] };
  assert.deepEqual(run(declared, packet).warnings, []);
});

test('a scope gap names a row or a sentence that exists', () => {
  const { packet, report } = one();
  assert.equal(run({ ...report, scope_gaps: [{ id: 'W praktyce#2', note: 'x' }] }, packet).ok, true);
  assert.match(problems(run({ ...report, scope_gaps: [{ id: 'W praktyce#9', note: 'x' }] }, packet)), /neither a row of this report nor a sentence of the item/);
  assert.match(problems(run({ ...report, scope_gaps: [null] }, packet)), /neither a row of this report/);
});

test('a quote must be on the cited line of a real, cited, unchanged snapshot', () => {
  const { packet, report } = one();
  const quote = patch => ({ ...report, claims: [{ ...report.claims[0], quotes: [{ ...report.claims[0].quotes[0], ...patch }] }, report.claims[1]] });
  assert.match(problems(run(quote({ text: 'Kody SMS są całkowicie bezpieczne.' }), packet)), /not on line 8 .*that line starts: "kody sms i z aplikacji/);
  assert.match(problems(run(quote({ line: 9 }), packet)), /not on line 9/);
  assert.match(problems(run(quote({ line: 3 }), packet)), /outside the source text/);
  assert.match(problems(run(quote({ line: 6 }), packet)), /outside the source text/, 'the marker line is not source text');
  assert.match(problems(run(quote({ line: 99 }), packet)), /outside the source text/);
  assert.match(problems(run(quote({ line: 'x' }), packet)), /outside the source text/);
  assert.match(problems(run(quote({ snapshot: 'missing.txt' }), packet)), /not a fetched source of this item/);
  assert.match(problems(run(quote({ snapshot: '../aaaa.txt' }), packet)), /not a fetched source of this item/);
  assert.match(problems(run(quote({ snapshot: '/etc/passwd' }), packet)), /not a fetched source of this item/);
  assert.match(problems(run(quote({ text: '' }), packet)), /empty quote/);
});

test('quotes are held to a size, a boundary and a minimum, so a fragment cannot pass for a sentence', () => {
  const { packet, report } = one();
  const quote = (text, extra = {}) => ({ ...report, claims: [{ ...report.claims[0], quotes: [{ snapshot: 'aaaa.txt', line: 8, text, ...extra }] }, report.claims[1]] });
  assert.match(problems(run(quote('SMS'), packet)), /shorter than 12 characters/);
  assert.equal(run(quote('SMS', { cell: true }), packet).ok, true, 'a single table cell may be short');
  assert.match(problems(run(quote('ody SMS i z aplikacji'), packet)), /not on line 8/, 'a quote may not start inside a word');
  assert.match(problems(run(quote('Kody SMS i z aplikacji można wyłudzi'), packet)), /not on line 8/, 'nor end inside one');
  assert.match(problems(run(quote('poprawa wyniosła 0'), packet)), /not on line 8/, 'nor inside a decimal');
  const on9 = text => ({ ...report, claims: [report.claims[0], { ...report.claims[1], quotes: [{ snapshot: 'aaaa.txt', line: 9, text }] }] });
  assert.match(problems(run(on9('poprawa wyniosła 0'), packet)), /not on line 9/, 'a quote may not stop inside a decimal');
  assert.match(problems(run(on9('wyniosła 0,65 punktu'), packet)), /^$|the number 0,65 is neither/, 'a whole decimal is a valid quote');
  const withDecimal = snapshot('aaaa.txt', LINES.concat(['wynik 0,65 punktów procentowych w próbie kontrolnej']));
  const decimalPacket = { ...packet, sources: [row('aaaa.txt', withDecimal)] };
  const onEleven = text => ({ ...report, claims: [report.claims[0], { ...report.claims[1], quotes: [{ snapshot: 'aaaa.txt', line: 11, text }] }] });
  assert.match(problems(run(onEleven('wynik 0'), decimalPacket)), /shorter than 12/);
  assert.match(problems(run(onEleven('wynik 0,65 punktów procentowych w próbie'), decimalPacket)), /the number 0,65 is neither|^$/, 'a whole decimal is accepted as a quote');
  assert.match(problems(run(onEleven('65 punktów procentowych w próbie'), decimalPacket)), /not on line 11/, 'the end of a decimal is not a number');
  assert.match(problems(run(onEleven('wynik 0,6'), decimalPacket)), /shorter than 12|not on line 11/);
  const long = Array(45).fill('słowo').join(' ');
  const sha = snapshot('aaaa.txt', LINES.concat([long]));
  const p = { ...packet, sources: [row('aaaa.txt', sha)] };
  assert.match(problems(run({ ...report, claims: [{ ...report.claims[0], quotes: [{ snapshot: 'aaaa.txt', line: 11, text: long }] }, report.claims[1]] }, p)), /longer than 40 words/);
});

test('a snapshot that changed after it was fetched, has no markers, or is in another format is refused with the reason', () => {
  const { packet, report } = one();
  writeFileSync(join(dir, 'aaaa.txt'), readFileSync(join(dir, 'aaaa.txt'), 'utf8').replace('można wyłudzić', 'nie można wyłudzić'));
  assert.match(problems(run(report, packet)), /changed after it was fetched/);
  const sha = snapshot('bbbb.txt', LINES, { markers: false });
  assert.match(problems(run(report, { ...packet, sources: [row('bbbb.txt', sha)] }).failures.length ? run({ ...report, claims: report.claims.map(c => ({ ...c, quotes: c.quotes.map(q => ({ ...q, snapshot: 'bbbb.txt' })) })) }, { ...packet, sources: [row('bbbb.txt', sha)] }) : { failures: [] }), /old format.*re-fetch/);
  const old = snapshot('cccc.txt', LINES, { format: 1 });
  assert.match(problems(run({ ...report, claims: report.claims.map(c => ({ ...c, quotes: c.quotes.map(q => ({ ...q, snapshot: 'cccc.txt' })) })) }, { ...packet, sources: [row('cccc.txt', old)] })), /not format 2/);
  assert.match(problems(run(report, { ...packet, sources: [row('aaaa.txt', 'f'.repeat(64))] })), /changed after it was fetched/);
});

test('a snapshot named by the packet but absent from the cache is a failure, not a crash', () => {
  const { packet, report } = one();
  rmSync(join(dir, 'aaaa.txt'));
  const result = run(report, packet);
  assert.equal(result.ok, false);
  assert.match(problems(result), /does not exist in the cache/);
});

test('a source that only the Chinese original names cannot support a claim', () => {
  const { packet, report } = one();
  const sha = packet.sources[0].sha256;
  const lead = { ...packet, sources: [row('aaaa.txt', sha, 'lead')] };
  assert.match(problems(run(report, lead)), /upstream lead, not a source the item cites/);
});

test('every figure of a source claim must be in a quote of its own or be a declared calculation with its basis', () => {
  const sha = snapshot('aaaa.txt', ['x', 'y', 'z']);
  const text = 'Badanie objęło 1 234 osoby; poprawa wyniosła 0,65 punktu; w tabeli 92 128 oraz 12 i 345.';
  const sha2 = snapshot('aaaa.txt', ['a', text]);
  const make = (sentence, quoteText, numbers) => {
    const packet = synthetic([sentence], [row('aaaa.txt', sha2)]);
    return [{ item: '99.1', status: 'PASS', claims: [claim(1, sentence, { quotes: [{ snapshot: 'aaaa.txt', line: 8, text: quoteText }], numbers })] }, packet];
  };
  assert.ok(sha);
  assert.deepEqual(run(...make('Badanie objęło 1234 osoby.', 'Badanie objęło 1 234 osoby', [])).failures, [], 'thousands spacing does not matter');
  assert.deepEqual(run(...make('Poprawa wyniosła 0.65 punktu.', 'poprawa wyniosła 0,65 punktu', [])).failures, [], 'decimal comma and point are one number');
  assert.match(problems(run(...make('Poprawa wyniosła 30,7 punktu.', 'poprawa wyniosła 0,65 punktu', []))), /the number 30,7 is neither in a quote/);
  assert.match(problems(run(...make('Poprawa wyniosła 65 punktu.', 'poprawa wyniosła 0,65 punktu', []))), /the number 65 is neither/, '65 is only part of 0,65');
  assert.match(problems(run(...make('Poprawa wyniosła 0 punktu.', 'poprawa wyniosła 0,65 punktu', []))), /the number 0 is neither/);
  assert.deepEqual(run(...make('Poprawa wyniosła 30,7 punktu.', 'poprawa wyniosła 0,65 punktu', [{ value: '30,7', editorial_calculation: true, basis: '60,0 minus 29,3' }])).failures, []);
  assert.match(problems(run(...make('Poprawa wyniosła 30,7 punktu.', 'poprawa wyniosła 0,65 punktu', [{ value: '30,7', editorial_calculation: true }]))), /neither in a quote/, 'a calculation needs its basis');
  assert.match(problems(run(...make('Poprawa wyniosła 30,7 punktu.', 'poprawa wyniosła 0,65 punktu', [{ value: '30,7', editorial_calculation: true, basis: 'no arithmetic, only a spelling' }]))), /basis shows the arithmetic \(at least two figures\)/, 'words are not a calculation');
  assert.match(problems(run(...make('Poprawa wyniosła 30,7 punktu.', 'poprawa wyniosła 0,65 punktu', [{ value: '30,7', editorial_calculation: true, basis: '30,7' }]))), /at least two figures/, 'a figure restated is not a calculation');
  assert.match(problems(run(...make('Poprawa wyniosła 0,65 punktu.', 'poprawa wyniosła 0,65 punktu', [{ value: '99', in_quote: true }]))), /declared as quoted but is in no quote/);
  assert.deepEqual(run(...make('W tabeli 128 oraz 12.', 'w tabeli 92 128 oraz 12 i 345', [])).failures, [], 'two cells read as one number still contain 128');
  assert.match(problems(run(...make('W tabeli 12345.', 'w tabeli 92 128 oraz 12 i 345', []))), /the number 12345 is neither/, 'figures of two cells are not fused across a quote');
  assert.deepEqual(run(...make('Zob. [14.1](#porada-14-1) i 12.', 'w tabeli 92 128 oraz 12 i 345', [])).failures, [], 'a cross-reference is not a figure');
});

test('absence, unavailability and derived verdicts have to be earned', () => {
  const sha = snapshot('aaaa.txt', LINES);
  const packet = synthetic(['Nie podano kwoty strat.'], [row('aaaa.txt', sha)]);
  const status = (verdict, extra, report = 'PASS') => run({ item: '99.1', status: report, claims: [claim(1, 'Nie podano kwoty strat.', { verdict, ...extra })] }, packet);
  assert.equal(status('absent_in_source', { searched: ['aaaa.txt'], reason: 'szukano kwoty' }).ok, true);
  assert.match(problems(status('absent_in_source', { searched: [] })), /needs "searched"/);
  assert.match(problems(status('absent_in_source', { searched: ['nope.txt'] })), /needs "searched"/);
  assert.match(problems(status('source_unavailable', {}, 'UNAVAILABLE')), /needs a reason/);
  assert.equal(status('source_unavailable', { reason: 'serwis zablokował pobranie' }, 'UNAVAILABLE').ok, true);
  assert.match(problems(status('source_unavailable', { reason: 'x' }, 'PASS')), /status PASS does not match the verdicts, which give UNAVAILABLE/);
  assert.match(problems(status('unsupported', { reason: 'źródło nie mówi o stratach' }, 'PASS')), /give FAIL/);
  assert.equal(status('unsupported', { reason: 'źródło nie mówi o stratach' }, 'FAIL').ok, true, 'a refuted claim needs no quote, only its reason');
  for (const verdict of ['unsupported', 'partly', 'contradicted', 'not_checkable', 'source_unavailable']) {
    assert.match(problems(status(verdict, { quotes: [{ snapshot: 'aaaa.txt', line: 8, text: 'Pierwsza linia o czymś innym.' }] }, 'FAIL')), /needs a reason/, verdict);
  }
  assert.doesNotMatch(problems(status('supported', { quotes: [{ snapshot: 'aaaa.txt', line: 8, text: 'Pierwsza linia o czymś innym.' }] })), /needs a reason/, 'a supported claim needs no reason');
});

test('the status follows from the verdicts alone', () => {
  const c = (kind, verdict) => ({ kind, verdict });
  assert.equal(deriveStatus([c('source_claim', 'supported'), c('source_claim', 'absent_in_source')]), 'PASS');
  assert.equal(deriveStatus([c('source_claim', 'supported'), c('source_claim', 'partly')]), 'UNAVAILABLE');
  assert.equal(deriveStatus([c('source_claim', 'not_checkable')]), 'UNAVAILABLE');
  assert.equal(deriveStatus([c('source_claim', 'source_unavailable'), c('source_claim', 'unsupported')]), 'FAIL');
  assert.equal(deriveStatus([c('source_claim', 'contradicted')]), 'FAIL');
  assert.equal(deriveStatus([c('editorial_estimate', 'not_applicable'), c('meta_statement', 'not_applicable')]), 'PASS');
  assert.equal(deriveStatus([c('source_description', 'supported'), c('source_description', 'partly')]), 'UNAVAILABLE');
  assert.equal(deriveStatus([c('source_description', 'contradicted')]), 'FAIL');
  assert.equal(deriveStatus([c('source_claim', 'supported'), c('recommendation_derived', 'unsupported')]), 'FAIL', 'advice nothing backs fails the item');
  assert.equal(deriveStatus([c('recommendation_derived', 'not_applicable')]), 'PASS');
  assert.equal(deriveStatus([c('source_claim', 'supported'), c('recommendation_derived', 'partly')]), 'UNAVAILABLE', 'advice backed only in part leaves the item unavailable');
  assert.equal(deriveStatus([c('recommendation_derived', 'partly'), c('recommendation_derived', 'unsupported')]), 'FAIL');
});

test('warnings of the packet travel with the result', () => {
  const { packet, report } = one();
  assert.deepEqual(run(report, { ...packet, warnings: ['Legacy cache record for x'] }).warnings, ['Legacy cache record for x']);
});

const UPSTREAM = ['### 1. Tytuł pozycji', '- 成本：不花钱。每个账号设置一次，两三分钟就设完。', '- 证据等级：C', 'Wynik 30,7 punktu przy ustawieniu domyślnym.'];
function adversary(findings, extra = {}) {
  const sha = snapshot('aaaa.txt', LINES);
  const packet = { ...synthetic(['Kody SMS można wyłudzić.'], [row('aaaa.txt', sha)]), upstream: { grade: 'C', lines: UPSTREAM.map((text, i) => ({ n: i + 1, text })) } };
  const every = ['same-action', 'preservation', 'grade', 'numbers', 'scope-words', 'leak', 'self-containment', 'recency', 'limitations'];
  return [{ item: '99.1', status: 'PASS', attacks_run: every, attacks_not_assessable: [], findings, ...extra }, packet];
}
const finding = (extra = {}) => ({ severity: 'major', attack: 'numbers', id: 'W praktyce#1', text: 'x', why: 'y', evidence: [], ...extra });
const snap = { source: 'snapshot', snapshot: 'aaaa.txt', line: 8, text: 'Kody SMS i z aplikacji można wyłudzić' };
const up = { source: 'upstream', line: 4, text: 'Wynik 30,7 punktu przy ustawieniu' };

test('the adversary report is checked the same way: evidence must be on the cited line, a blocker needs evidence', () => {
  const check = (...args) => checkAdversaryReport(...args, dir);
  assert.equal(check(...adversary([])).ok, true, 'PASS with every attack run and nothing found');
  assert.equal(check(...adversary([finding({ evidence: [snap, up] })], { status: 'PASS' })).ok, true);
  assert.match(problems(check(...adversary([finding({ severity: 'blocker' })], { status: 'FAIL' }))), /blocker needs at least one piece of evidence/);
  assert.equal(check(...adversary([finding({ severity: 'blocker', evidence: [up] })], { status: 'FAIL' })).ok, true);
  assert.match(problems(check(...adversary([finding({ severity: 'blocker', evidence: [up] })], { status: 'PASS' }))), /does not match the findings, which give FAIL/);
  assert.match(problems(check(...adversary([finding({ evidence: [{ ...snap, text: 'Kody SMS są bezpieczne całkowicie' }] })]))), /not on line 8/);
  assert.match(problems(check(...adversary([finding({ evidence: [{ ...up, line: 2 }] })]))), /not on upstream line 2/);
  assert.match(problems(check(...adversary([finding({ evidence: [{ ...up, line: 40 }] })]))), /upstream line 40 does not exist/);
  assert.match(problems(check(...adversary([finding({ evidence: [{ source: 'memory', text: 'z pamięci' }] })]))), /evidence.source must be/);
  assert.match(problems(check(...adversary([finding({ severity: 'huge' })]))), /severity must be one of/);
  assert.match(problems(check(...adversary([finding({ attack: 'vibes' })]))), /attack must be one of/);
  assert.match(problems(check(...adversary([finding({ id: 'W praktyce#9' })]))), /not a sentence of the item/);
  assert.match(problems(check({ ...adversary([])[0], item: '14.2' }, adversary([])[1])), /report is for item "14.2"/);
  assert.match(problems(check({ ...adversary([])[0], status: 'GREAT' }, adversary([])[1])), /status must be one of/);
  assert.match(problems(check({ ...adversary([])[0], findings: 'none' }, adversary([])[1])), /findings must be an array/);
});

test('the adversary may say PASS only when every attack was run or declared not assessable', () => {
  const check = (...args) => checkAdversaryReport(...args, dir);
  const [report, packet] = adversary([]);
  assert.match(problems(check({ ...report, attacks_run: ['grade'] }, packet)), /PASS needs every attack run.*missing: same-action/);
  const partial = { ...report, attacks_run: report.attacks_run.filter(a => a !== 'recency'), attacks_not_assessable: [{ attack: 'recency', reason: 'no second source' }], status: 'UNAVAILABLE' };
  assert.equal(check(partial, packet).ok, true);
  assert.equal(check({ ...partial, status: 'PASS' }, packet).ok, false);
  assert.match(problems(check({ ...report, attacks_run: [...report.attacks_run, 'telepathy'] }, packet)), /unknown attack/);
  assert.equal(check(null, packet).ok, false);
});

test('the commands exit 0 for a good report, 1 for a rejected one and 2 for misuse, and say why in one line', () => {
  const entry = loadAll(root).flatMap(c => c.entries).find(e => e.number === '14.2');
  const props = propositions(entry);
  const text = props.map(p => p.text).join('\n');
  mock.method(globalThis, 'fetch', async () => new Response('x', { status: 500 }));
  const cmd = (script, ...args) => spawnSync(process.execPath, [join(root, 'tools/pl', script), ...args], { cwd: root });
  const bad = cmd('packet.mjs', '14.2', 'drafter');
  assert.equal(bad.status, 2);
  assert.match(bad.stderr.toString(), /^unknown role "drafter"\. Use verifier, adversary or editor\.\n$/);
  assert.equal(cmd('packet.mjs', 'x', 'verifier').status, 2);
  assert.equal(cmd('packet.mjs').status, 2);
  const packet = JSON.parse(cmd('packet.mjs', '3.1', 'verifier', '--cache', dir).stdout.toString());
  assert.equal(packet.item, '03.1');
  assert.ok(packet.warnings.length === 0 && packet.sources.every(s => s.access === 'missing'));
  writeFileSync(join(dir, 'report.json'), JSON.stringify({ item: '14.2', status: 'PASS', claims: [] }));
  const rejected = cmd('quotes.mjs', join(dir, 'report.json'), '--cache', dir);
  assert.equal(rejected.status, 1);
  assert.equal(JSON.parse(rejected.stdout.toString()).ok, false);
  assert.equal(cmd('quotes.mjs').status, 2);
  assert.equal(cmd('quotes.mjs', join(dir, 'missing.json')).status, 2);
  assert.ok(text.length > 0);
});
