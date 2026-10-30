import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { adopt, expectedReports, itemChangedSince, prepare, retryPrompt, rolePrompt, selectItems, status } from '../tools/pl/audit.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const cache = join(root, '.cache/sources');
const fresh = () => mkdtempSync(join(tmpdir(), 'audit-'));
const run = (...args) => spawnSync(process.execPath, [join(root, 'tools/pl/audit.mjs'), ...args], { cwd: root, encoding: 'utf8' });

test('a high-stakes item needs two verifier runs, an adversary and an editor; a low-stakes one needs one verifier run', () => {
  assert.deepEqual(expectedReports(true), ['verifier-a', 'verifier-b', 'adversary-a', 'editor-a']);
  assert.deepEqual(expectedReports(false), ['verifier-a', 'adversary-a', 'editor-a']);
  assert.deepEqual(expectedReports(true, ['verifier']), ['verifier-a', 'verifier-b']);
  assert.deepEqual(expectedReports(false, ['editor']), ['editor-a']);
});

test('preparing writes a packet per role, a prompt per expected report and a plan, and never touches a report that exists', () => {
  const dir = fresh();
  const plan = prepare(dir, ['14.2', '04.4'], { root, cache });
  assert.deepEqual(plan.items.map(p => [p.item, p.high]), [['04.4', false], ['14.2', true]]);
  for (const name of ['packet-verifier.json', 'packet-adversary.json', 'packet-editor.json', 'prompt-verifier-a.md', 'prompt-verifier-b.md', 'prompt-adversary-a.md', 'prompt-editor-a.md']) assert.ok(existsSync(join(dir, '14.2', name)), name);
  assert.equal(existsSync(join(dir, '04.4', 'prompt-verifier-b.md')), false, 'a low-stakes item has no second verifier run');
  assert.equal(JSON.parse(readFileSync(join(dir, '14.2', 'packet-verifier.json'), 'utf8')).item, '14.2');
  writeFileSync(join(dir, '14.2', 'verifier-a.json'), '{"keep":"me"}');
  prepare(dir, ['14.2'], { root, cache });
  assert.equal(readFileSync(join(dir, '14.2', 'verifier-a.json'), 'utf8'), '{"keep":"me"}');
  assert.equal(JSON.parse(readFileSync(join(dir, 'plan.json'), 'utf8')).items.length, 2, 'preparing one item again keeps the others');
  assert.throws(() => prepare(dir, ['99.9'], { root, cache }), /No published item 99\.9/);
});

test('a prompt names the role file, the packet, the report path and the rules of a blind run, relative to the repository when it can be', () => {
  const inside = rolePrompt({ role: 'verifier', tag: 'b', item: '14.2', dir: join(root, 'audit/runs/x'), root });
  assert.match(inside, /Read \.claude\/agents\/pl-source-verifier\.md now, from disk/);
  assert.match(inside, /packet at audit\/runs\/x\/14\.2\/packet-verifier\.json/);
  assert.match(inside, /to audit\/runs\/x\/14\.2\/verifier-b\.json/);
  assert.doesNotMatch(inside, new RegExp(root.replace(/[/\\]/g, '.')), 'no absolute path of this machine');
  assert.match(inside, /fresh session/);
  assert.match(inside, /No network, no shell, no scripts/);
  const outside = rolePrompt({ role: 'editor', tag: 'a', item: '14.2', dir: '/tmp/somewhere', root });
  assert.match(outside, /\/tmp\/somewhere\/14\.2\/packet-editor\.json/);
  assert.doesNotMatch(outside, /snapshot files/i, 'the editor sees no sources');
  assert.match(rolePrompt({ role: 'adversary', tag: 'a', item: '14.2', dir: '/tmp/x', root }), /Jak czytać dowody/);
});

test('status lists what is missing, then what is rejected, and a finished report counts once it is accepted', () => {
  const dir = fresh();
  prepare(dir, ['14.2'], { root, cache });
  const empty = status(dir, { root, cache });
  assert.equal(empty.done, false);
  assert.equal(empty.next.length, 4);
  assert.ok(empty.next.every(n => /in a fresh session/.test(n)));
  writeFileSync(join(dir, '14.2', 'editor-a.json'), JSON.stringify({ item: '14.2', edits: [] }));
  writeFileSync(join(dir, '14.2', 'verifier-a.json'), JSON.stringify({ item: '14.2', status: 'PASS', claims: [] }));
  const partial = status(dir, { root, cache });
  assert.deepEqual(partial.items[0].states.map(s => [s.name, s.state]), [['verifier-a', 'rejected'], ['verifier-b', 'missing'], ['adversary-a', 'missing'], ['editor-a', 'accepted']]);
  assert.ok(partial.next.some(n => /audit\.mjs retry .* 14\.2 verifier-a/.test(n) && /rejected/.test(n)));
  assert.equal(partial.next.length, 3);
});

test('the retry prompt carries the failure list of the rejected report, and refuses an accepted or a missing one', () => {
  const dir = fresh();
  prepare(dir, ['14.2'], { root, cache });
  writeFileSync(join(dir, '14.2', 'verifier-a.json'), JSON.stringify({ item: '14.2', status: 'PASS', claims: [] }));
  writeFileSync(join(dir, '14.2', 'editor-a.json'), JSON.stringify({ item: '14.2', edits: [] }));
  const prompt = retryPrompt(dir, '14.2', 'verifier-a', { root, cache });
  assert.match(prompt, /A script rejected your previous report at that path/);
  assert.match(prompt, /- report claims must be a non-empty array/);
  assert.match(prompt, /Final message/);
  assert.throws(() => retryPrompt(dir, '14.2', 'editor-a', { root, cache }), /nothing to retry/);
  assert.throws(() => retryPrompt(dir, '14.2', 'adversary-a', { root, cache }), /No report .*use prompt-adversary-a\.md instead/);
  assert.throws(() => retryPrompt(dir, '14.2', 'drafter-a', { root, cache }), /not a report name/);
});

test('items are chosen by chapter, by number or all at once, and an unknown number is refused', () => {
  const chapter = selectItems(root, { chapter: 14 });
  assert.ok(chapter.length >= 2 && chapter.every(n => n.startsWith('14.')));
  assert.equal(selectItems(root, { chapter: '3' }).every(n => n.startsWith('03.')), true);
  assert.deepEqual(selectItems(root, { items: ['4.4', '14.2'] }), ['04.4', '14.2']);
  assert.ok(selectItems(root, { all: true }).length >= 32);
});

// A throwaway repository holding the three Polish chapters, so that "the text changed" can be tried without touching the real book.
function scratchRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'audit-repo-'));
  mkdirSync(join(dir, 'book/pl'), { recursive: true });
  cpSync(join(root, 'book/pl'), join(dir, 'book/pl'), { recursive: true });
  const git = (...args) => spawnSync('git', ['-c', 'user.email=t@example.com', '-c', 'user.name=t', ...args], { cwd: dir, encoding: 'utf8' });
  git('init', '-q');
  git('add', '.');
  git('commit', '-q', '-m', 'text');
  const chapter = join(dir, 'book/pl/14-bezpieczenstwo-kont-i-danych.md');
  const edit = (from, to) => writeFileSync(chapter, readFileSync(chapter, 'utf8').replace(from, to));
  return { dir, edit };
}

test('a change to the text of one item is told apart from a change to another item of the same chapter', () => {
  const { dir, edit } = scratchRepo();
  assert.equal(itemChangedSince(dir, 'HEAD', '14.2'), false);
  edit('Zacznij od poczty, przez którą resetujesz inne konta.', 'Zacznij od poczty.');
  assert.equal(itemChangedSince(dir, 'HEAD', '14.2'), true);
  assert.equal(itemChangedSince(dir, 'HEAD', '14.7'), false, 'the neighbouring item is untouched');
  assert.equal(itemChangedSince(dir, 'no-such-commit-0000', '14.2'), null);
  assert.equal(itemChangedSince(dir, null, '14.2'), null);
  assert.equal(itemChangedSince(dir, 'HEAD', '99.9'), null);
});

test('status warns when the text of an item changed after its reports were prepared', () => {
  const { dir: repo, edit } = scratchRepo();
  const dir = fresh();
  prepare(dir, ['14.2', '14.7'], { root: repo, cache, roles: ['verifier'] });
  assert.deepEqual(status(dir, { root: repo, cache }).stale, []);
  edit('Zacznij od poczty, przez którą resetujesz inne konta.', 'Zacznij od poczty.');
  const after = status(dir, { root: repo, cache });
  assert.deepEqual(after.stale, ['14.2']);
  assert.match(after.next[0], /the text of 14\.2 changed since its reports were prepared: prepare it again/);
});

test('adopting takes over only the accepted reports whose text is still the text of the item', () => {
  const { dir: repo, edit } = scratchRepo();
  const earlier = fresh();
  mkdirSync(join(earlier, '14.2'));
  mkdirSync(join(earlier, '14.7'));
  writeFileSync(join(earlier, '14.2', 'editor-a.json'), JSON.stringify({ item: '14.2', edits: [] }));
  writeFileSync(join(earlier, '14.7', 'editor-a.json'), JSON.stringify({ item: '14.7', edits: [] }));
  writeFileSync(join(earlier, '14.2', 'verifier-a.json'), JSON.stringify({ item: '14.2', claims: [] }));
  const dir = fresh();
  prepare(dir, ['14.2', '14.7'], { root: repo, cache, roles: ['editor', 'verifier'] });
  edit('Zacznij od poczty, przez którą resetujesz inne konta.', 'Zacznij od poczty.');
  const result = adopt(dir, earlier, { root: repo, cache, fromCommit: 'HEAD' });
  assert.deepEqual(result.adopted, ['14.7/editor-a']);
  assert.ok(existsSync(join(dir, '14.7', 'editor-a.json')));
  assert.equal(existsSync(join(dir, '14.2', 'editor-a.json')), false, 'the text of 14.2 changed after that run');
  assert.ok(result.skipped.some(x => /^14\.2\/editor-a: the text it judged is not the text of the item now/.test(x)));
  assert.ok(result.skipped.some(x => /^14\.2\/verifier-a: rejected/.test(x)), 'a rejected report is not adopted');
  assert.deepEqual(adopt(dir, earlier, { root: repo, cache, fromCommit: 'HEAD' }).adopted, [], 'a second adoption has nothing left to take');
  const noCommit = fresh();
  prepare(noCommit, ['14.7'], { root: repo, cache, roles: ['editor'] });
  assert.deepEqual(adopt(noCommit, earlier, { root: repo, cache }).adopted, [], 'without a commit or a plan nothing is guessed');
  mkdirSync(join(repo, 'audit/runs'), { recursive: true });
  writeFileSync(join(repo, 'audit/runs/runs.json'), JSON.stringify({ [basename(earlier)]: { bookCommit: 'HEAD' } }));
  assert.deepEqual(adopt(noCommit, earlier, { root: repo, cache }).adopted, ['14.7/editor-a'], 'a run listed in audit/runs/runs.json is judged against its recorded commit');
});

test('the command shows its usage, refuses a directory with no plan, and prepares only the roles it is asked for', () => {
  assert.equal(run().status, 2);
  assert.match(run().stderr, /Usage:\n  node tools\/pl\/audit\.mjs prepare/);
  const dir = fresh();
  assert.equal(run('status', dir).status, 2);
  assert.match(run('status', dir).stderr, /No plan\.json .*run "node tools\/pl\/audit\.mjs prepare" first/);
  assert.equal(run('prepare', dir, '14.2', '--roles', 'editor').status, 0);
  assert.ok(existsSync(join(dir, '14.2', 'packet-editor.json')));
  assert.equal(existsSync(join(dir, '14.2', 'packet-verifier.json')), false);
  assert.equal(run('prepare', dir, '14.2', '--roles', 'drafter').status, 2);
  const state = run('status', dir);
  assert.equal(state.status, 1);
  assert.match(state.stdout, /14\.2 \(high-stakes\): editor-a missing/);
});
