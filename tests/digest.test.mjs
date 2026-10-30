import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { digestDir, digestItem, openRows, toMarkdown } from '../tools/pl/digest.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const row = (id, kind, verdict, extra = {}) => ({ id, kind, claim: 'Zdanie.', verdict, ...extra });
const write = (dir, name, body) => writeFileSync(join(dir, `${name}.json`), typeof body === 'string' ? body : JSON.stringify(body));
function audit(items) {
  const dir = mkdtempSync(join(tmpdir(), 'digest-'));
  for (const [item, files] of Object.entries(items)) {
    mkdirSync(join(dir, item));
    for (const [name, body] of Object.entries(files)) write(join(dir, item), name, body);
  }
  return dir;
}

test('the rows a person still has to look at are every verdict short of settled, with the reason cut to a readable size', () => {
  const rows = openRows({ claims: [row('W praktyce#1', 'source_claim', 'supported'), row('W praktyce#2', 'source_claim', 'partly', { reason: 'x'.repeat(500) }),
    row('W praktyce#3', 'recommendation_derived', 'partly', { reason: 'half is backed' }), row('W praktyce#4', 'meta_statement', 'not_applicable')] });
  assert.deepEqual(rows.map(r => r.id), ['W praktyce#2', 'W praktyce#3']);
  assert.ok(rows[0].reason.length <= 240 && rows[0].reason.endsWith('…'));
});

test('an item digest derives each status from the verdicts, whatever the report says about itself', () => {
  const dir = audit({ '99.1': { 'verifier-a': { item: '99.1', status: 'PASS', claims: [row('W praktyce#1', 'source_claim', 'partly', { reason: 'x' })] } } });
  const digest = digestItem('99.1', join(dir, '99.1'));
  assert.equal(digest.verifiers[0].status, 'UNAVAILABLE', 'the report called itself PASS');
  assert.equal(digest.compare, null);
  assert.equal(digest.adversary, null);
});

test('two verifier runs are compared, and a difference is carried into the digest', () => {
  const a = { item: '99.1', claims: [row('W praktyce#1', 'source_claim', 'supported')] };
  const b = { item: '99.1', claims: [row('W praktyce#1', 'source_claim', 'partly', { reason: 'narrower' })] };
  const dir = audit({ '99.1': { 'verifier-a': a, 'verifier-b': b } });
  const digest = digestItem('99.1', join(dir, '99.1'));
  assert.equal(digest.compare.agree, false);
  assert.deepEqual(digest.verifiers.map(v => v.status), ['PASS', 'UNAVAILABLE']);
  assert.match(toMarkdown([digest]), /The two runs differ; a person decides:\n- W praktyce#1 \(strength\)/);
});

test('adversary findings are listed most serious first and editor edits keep their re-verification flag', () => {
  const dir = audit({ '99.1': {
    'adversary-a': { item: '99.1', attacks_not_assessable: [{ attack: 'recency', reason: 'x' }], findings: [
      { severity: 'minor', attack: 'grade', id: 'Ocena dowodów#1', text: 'B', why: 'drobiazg', fix_direction: 'x' },
      { severity: 'major', attack: 'preservation', id: 'W praktyce#1', text: 'Odrzuć.', why: 'Zgubiono rozwiązanie zastępcze.', fix_direction: 'Przywróć je.' }] },
    'editor-a': { item: '99.1', verdict: 'needs_edits', protected_findings: [{}, {}], edits: [{ field: 'W praktyce', original: 'a', replacement: 'b', reason: 'term', requires_reverification: true }] },
  } });
  const digest = digestItem('99.1', join(dir, '99.1'));
  assert.deepEqual(digest.adversary.findings.map(f => f.severity), ['major', 'minor']);
  assert.deepEqual(digest.adversary.attacksNotAssessable, ['recency']);
  assert.deepEqual([digest.editor.verdict, digest.editor.protectedFindings, digest.editor.edits[0].reverify], ['needs_edits', 2, true]);
  const text = toMarkdown([digest]);
  assert.match(text, /\| 99\.1 \| - \| - \| - \| 0\/1\/1 \| needs_edits, 1 edits \|/);
  assert.match(text, /- MAJOR preservation \(W praktyce#1\): Odrzuć\./);
  assert.match(text, /needs re-verification/);
});

test('items are listed in numeric order, and an unreadable report is skipped instead of crashing the digest', () => {
  const dir = audit({ '14.10': { 'verifier-a': '{ not json' }, '14.2': { 'verifier-a': { item: '14.2', claims: [row('W praktyce#1', 'source_claim', 'supported')] } }, '03.4': {} });
  assert.deepEqual(digestDir(dir).map(d => d.item), ['03.4', '14.2', '14.10']);
  assert.deepEqual(digestDir(dir)[2].verifiers, []);
});

test('the command prints Markdown or JSON and refuses a missing or empty directory', () => {
  const run = (...args) => spawnSync(process.execPath, [join(root, 'tools/pl/digest.mjs'), ...args], { cwd: root, encoding: 'utf8' });
  const dir = audit({ '99.1': { 'verifier-a': { item: '99.1', claims: [row('W praktyce#1', 'source_claim', 'supported')] } } });
  assert.match(run(dir).stdout, /^# Audit digest/);
  assert.equal(JSON.parse(run(dir, '--json').stdout)[0].item, '99.1');
  assert.equal(run().status, 2);
  assert.match(run().stderr, /Usage/);
  assert.equal(run(mkdtempSync(join(tmpdir(), 'empty-'))).status, 2);
});
