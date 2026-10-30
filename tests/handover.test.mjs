import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
const readme = read('audit/README.md');
const findings = read('audit/FINDINGS.md');
const runs = JSON.parse(read('audit/runs/runs.json'));
const runDirs = readdirSync(join(root, 'audit/runs'), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort();

test('the handover is portable: no path of one machine, no Chinese text, no instruction that only one agent tool can follow', () => {
  for (const [name, text] of [['README', readme], ['FINDINGS', findings]]) {
    assert.doesNotMatch(text, /\/tmp\/|\/home\/user|\/root\//, `${name} names a path of one machine`);
    assert.doesNotMatch(text, /\p{Script=Han}/u, name);
  }
  assert.match(readme, /Codex, Claude Code, inne/);
  assert.match(readme, /Prompt dla nowego agenta/);
  assert.match(readme, /Przeczytaj AGENTS\.md/);
});

test('every script and file the handover names exists, and every command it gives is one the tools offer', () => {
  for (const [, script] of readme.matchAll(/tools\/pl\/([\w-]+\.mjs)/g)) assert.ok(existsSync(join(root, 'tools/pl', script)), script);
  for (const [, path] of readme.matchAll(/\]\(([^)#]+)\)/g)) if (!/^https?:/.test(path)) assert.ok(existsSync(join(root, 'audit', path)), `link ${path}`);
  for (const sub of ['prepare', 'adopt', 'status', 'retry']) assert.match(readme, new RegExp(`audit\\.mjs ${sub} `), sub);
  assert.match(readme, /fetch\.mjs --published/);
  assert.match(readme, /digest\.mjs/);
  for (const role of ['pl-source-verifier', 'pl-claim-adversary', 'pl-language-editor']) assert.ok(existsSync(join(root, '.claude/agents', `${role}.md`)), role);
  assert.ok(existsSync(join(root, 'tools/pl/workflows/audit-items.js')));
});

test('the runs the handover names are the runs on disk, each with its commit, checks and digest', () => {
  assert.deepEqual(Object.keys(runs).sort(), runDirs);
  for (const name of runDirs) {
    assert.match(runs[name].bookCommit, /^[0-9a-f]{7,40}$/, name);
    assert.ok(existsSync(join(root, 'audit/runs', name, 'checks.txt')) && existsSync(join(root, 'audit/runs', name, 'digest.md')), name);
    assert.ok(readme.includes(name) || name === 'run1-first-drafts', `${name} is explained in the README`);
  }
  for (const [name] of readme.matchAll(/run\d-[\w.-]*\w/g)) assert.ok(runDirs.includes(name) || name.startsWith('run7'), `README names a run that does not exist: ${name}`);
});

test('every saved report is valid JSON naming its own item, and the source manifest is one JSON record per line', () => {
  let reports = 0;
  for (const name of runDirs) {
    for (const item of readdirSync(join(root, 'audit/runs', name), { withFileTypes: true }).filter(d => d.isDirectory())) {
      for (const file of readdirSync(join(root, 'audit/runs', name, item.name)).filter(f => /^(verifier|adversary|editor)-[a-z0-9]+\.json$/.test(f))) {
        const report = JSON.parse(read(`audit/runs/${name}/${item.name}/${file}`));
        assert.equal(report.item, item.name, `${name}/${item.name}/${file}`);
        reports++;
      }
    }
  }
  assert.ok(reports >= 70, `expected the audit reports to be kept, found ${reports}`);
  const records = read('audit/sources-manifest-2026-10-29.jsonl').split('\n').filter(Boolean).map(l => JSON.parse(l));
  assert.ok(records.length >= 80 && records.every(r => r.input && r.access && r.format === 2));
  assert.ok(records.every(r => !r.text), 'the manifest holds no third-party text');
});

test('the decisions left to the owner are written down where a new session finds them', () => {
  for (const heading of ['## A. Poprawki w opublikowanych poradach', '## B.', '## C.', '## D.', '## E. Czego brakuje do dalszej pracy']) assert.ok(findings.includes(heading), heading);
  for (const item of ['03.4', '04.4', '14.2', '14.7']) assert.match(findings, new RegExp(`\\| ${item.replace('.', '\\.')} \\|`), item);
  assert.match(read('AGENTS.md'), /Stan przeglądu opublikowanych porad \(wznowionego 2026-10-30[^)]*\), .* audit\/README\.md oraz audit\/FINDINGS\.md\. Nowe przebiegi przeglądu i zmiany tekstu rozpoczynaj tylko na polecenie właściciela/, 'AGENTS.md points to the review state and says new runs and text changes need the owner, as the owner approved on 2026-10-30');
  assert.match(read('.claude/hooks/session-start.sh'), /audit\/README\.md/);
  assert.match(read('.claude/hooks/session-start.sh'), /Nowe przebiegi i zmiany tekstu tylko na polecenie właściciela/);
  assert.doesNotMatch(read('.claude/hooks/session-start.sh') + read('AGENTS.md'), /Wstrzymany przegląd|wstrzymanego przeglądu/, 'the review is no longer described as paused');
  assert.match(read('tools/README.md'), /audit\.mjs/);
  assert.match(read('tools/README.md'), /check-reports\.mjs/);
});
