import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkDirectory, formatRows } from '../tools/pl/check-reports.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const cache = join(root, '.cache/sources');
function audit(files) {
  const dir = mkdtempSync(join(tmpdir(), 'check-reports-'));
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(join(dir, path.split('/')[0]), { recursive: true });
    writeFileSync(join(dir, path), typeof body === 'string' ? body : JSON.stringify(body));
  }
  return dir;
}

test('each report is checked by the script for its role, and a bad one is named with its first failure', () => {
  const dir = audit({
    '14.2/verifier-a.json': { item: '14.2', status: 'PASS', claims: [] },
    '14.2/adversary-a.json': '{ not json',
    '14.2/editor-a.json': { item: '14.2', edits: [] },
  });
  const rows = checkDirectory(dir, { root, cache });
  assert.deepEqual(rows.map(r => [r.role, r.outcome]), [['verifier', 'rejected'], ['adversary', 'unreadable'], ['editor', 'accepted']]);
  assert.match(rows[0].first, /non-empty array/);
  assert.equal(rows[1].failures, 0);
  assert.match(formatRows(rows), /14\.2\/verifier-a: rejected, 1 failure\(s\) \(report claims must be a non-empty array/);
});

test('an editor report for another item is rejected, and a directory of an unknown item has no packet to check against', () => {
  const dir = audit({ '14.2/editor-a.json': { item: '14.3', edits: [] }, '99.9/verifier-a.json': { item: '99.9', claims: [] } });
  const rows = checkDirectory(dir, { root, cache });
  assert.deepEqual(rows.map(r => [r.item, r.outcome]), [['14.2', 'rejected'], ['99.9', 'no packet']]);
});

test('items are visited in numeric order, and files that are not reports are ignored', () => {
  const dir = audit({ '14.10/editor-a.json': { item: '14.10', edits: [] }, '14.2/editor-b.json': { item: '14.2', edits: [] }, '14.2/notes.json': {}, '03.4/editor-a.json': { item: '03.4', edits: [] } });
  assert.deepEqual(checkDirectory(dir, { root, cache }).map(r => `${r.item}/${r.file}`), ['03.4/editor-a.json', '14.2/editor-b.json', '14.10/editor-a.json']);
});

test('the command exits 1 when a report is rejected, 0 when all are accepted, and 2 without a directory', () => {
  const run = (...args) => spawnSync(process.execPath, [join(root, 'tools/pl/check-reports.mjs'), ...args], { cwd: root, encoding: 'utf8' });
  const good = audit({ '14.2/editor-a.json': { item: '14.2', edits: [] } });
  const bad = audit({ '14.2/verifier-a.json': { item: '14.2', claims: [] } });
  assert.equal(run(good).status, 0);
  assert.match(run(good).stderr, /1 of 1 reports accepted/);
  assert.equal(run(bad).status, 1);
  assert.equal(JSON.parse(run(bad, '--json').stdout)[0].outcome, 'rejected');
  assert.equal(run().status, 2);
  assert.equal(run(join(tmpdir(), 'does-not-exist-xyz')).status, 2);
  assert.equal(run(audit({ 'x/notes.txt': 'hello' })).status, 2);
});
