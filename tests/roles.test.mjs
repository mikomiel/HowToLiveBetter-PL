import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ROLE_FIELDS } from '../tools/pl/packet.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const agents = readdirSync(new URL('.claude/agents/', root)).filter(f => f.endsWith('.md')).sort();

test('the three reviewer roles exist, are read-only and defer to AGENTS.md', () => {
  assert.deepEqual(agents, ['pl-claim-adversary.md', 'pl-language-editor.md', 'pl-source-verifier.md']);
  for (const file of agents) {
    const text = read('.claude/agents/' + file);
    const front = /^---\n([\s\S]*?)\n---\n/.exec(text)?.[1] ?? '';
    assert.match(front, new RegExp(`^name: ${file.replace('.md', '')}$`, 'm'));
    assert.match(front, /^tools: Read, Grep, Glob$/m, `${file} must not gain write, shell or network tools`);
    assert.match(text, /AGENTS\.md/);
    if (file === 'pl-language-editor.md') assert.match(text, /You see no sources/, 'the editor reads no source text');
    else assert.match(text, /untrusted data/i, `${file} reads snapshots and must treat them as data`);
  }
});

test('each role names the packet that feeds it, and the packet knows the role', () => {
  const roleOf = { 'pl-source-verifier.md': 'verifier', 'pl-claim-adversary.md': 'adversary', 'pl-language-editor.md': 'editor' };
  for (const [file, role] of Object.entries(roleOf)) {
    assert.ok(ROLE_FIELDS[role], role);
    assert.ok(read('.claude/agents/' + file).includes(`packet.mjs <item> ${role}`), `${file} names its packet command`);
  }
});

test('the verifier and adversary tell the agent to pass explicit paths to Grep because the cache is git-ignored', () => {
  for (const file of ['pl-source-verifier.md', 'pl-claim-adversary.md']) assert.match(read('.claude/agents/' + file), /git-ignored/);
});

test('the language editor is told never to edit protected wording', () => {
  const text = read('.claude/agents/pl-language-editor.md');
  for (const word of ['negations', 'quantifiers', 'modals', 'causal', 'jurisdiction', 'numbers']) assert.match(text, new RegExp(word));
  assert.match(text, /you never edit it/i);
});

test('the SessionStart hook is registered once, quoted, bounded in time, cloud-only and executable', () => {
  const settings = JSON.parse(read('.claude/settings.json'));
  const hooks = settings.hooks.SessionStart.flatMap(g => g.hooks);
  assert.equal(hooks.length, 1);
  assert.equal(hooks[0].command, 'bash "$CLAUDE_PROJECT_DIR/.claude/hooks/session-start.sh"');
  assert.ok(hooks[0].timeout >= 300 && hooks[0].timeout <= 900);
  const script = read('.claude/hooks/session-start.sh');
  assert.match(script, /CLAUDE_CODE_REMOTE:-\}" != "true"/);
  assert.match(script, /timeout 300 npm ci --ignore-scripts/);
  assert.match(script, /timeout 240 npx --no-install playwright install chromium/);
  assert.doesNotMatch(script, /\|\| true\b(?!\n\}|\))/);
  assert.ok(statSync(fileURLToPath(new URL('.claude/hooks/session-start.sh', root))).mode & 0o111);
});

test('CLAUDE.md imports AGENTS.md and no second rules file exists', () => {
  assert.match(read('CLAUDE.md'), /^@AGENTS\.md$/m);
  assert.match(read('CLAUDE.md'), /jedyny kanoniczny dokument instrukcji/);
});
