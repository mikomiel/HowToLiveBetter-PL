import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
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

test('the verifier answers for every sentence, treats leads and unavailable sources as the packet says, and knows what the script checks', () => {
  const text = read('.claude/agents/pl-source-verifier.md');
  for (const needle of ['packet.propositions', 'source_unavailable', 'absent_in_source', 'depends_on', 'snapshotDir', 'origin: "cited"', 'origin: "lead"', 'editorial_calculation', 'basis', '"cell": true', 'status` is derived from the verdicts']) assert.ok(text.includes(needle), needle);
  assert.match(text, /A script also checks every quote/);
  assert.match(text, /never write a quote you did not copy/);
});

test('the verifier is told how to number split sentences, what each kind and verdict means, and how figures are read', () => {
  const text = read('.claude/agents/pl-source-verifier.md');
  for (const needle of ['`W praktyce#3.1`', 'Every row id is unique', '`source_description`', 'never file one under `meta_statement`', 'Verdict `unsupported`: nothing backs it; `depends_on` and `quotes` stay empty',
    'Never use it to avoid `unsupported`', 'a decimal comma and a decimal point as the same figure', 'at least two figures', 'A `not_applicable` row needs no `reason` and no quotes', 'Your `scope_gaps` and your verdict must agree', 'It is never a statement about the world', 'the fact the advice rests on (not merely the same topic)', 'Verdict `partly`: only a part is backed', 'absence is then absence from that region', 'relative to the repository root', 'The packet you were given']) assert.ok(text.includes(needle), needle);
  assert.doesNotMatch(text, /the item labels as editorial/, 'editorial_estimate is defined by what the words do, not by a label the item never carries');
  assert.match(text, /Only a snapshot that holds the whole text can show absence/);
});

test('the adversary uses the numbered upstream lines and gives structured evidence a script can check', () => {
  const text = read('.claude/agents/pl-claim-adversary.md');
  for (const needle of ['upstream.lines', '"source": "upstream"', '"source": "snapshot"', 'a script checks each one', 'not_assessable', 'with the line number as the Read tool shows it', 'list each attack in exactly one of the two lists', 'an abstract-only source cannot decide a grade attack']) assert.ok(text.includes(needle), needle);
  assert.doesNotMatch(text, /evidence_source/);
});

test('the editor is told a script, not its own flag, decides what needs re-verification', () => {
  const text = read('.claude/agents/pl-language-editor.md');
  assert.match(text, /A script compares each edit with the original/);
  assert.match(text, /swapped technical term/);
});

test('the hook never lets npm ci empty a symlink target, and the tools README documents the whole flow honestly', () => {
  const script = read('.claude/hooks/session-start.sh');
  assert.match(script, /if \[ -L node_modules \]; then\n\s+rm -f node_modules\nfi/);
  assert.ok(script.indexOf('-L node_modules') < script.indexOf('timeout 300 npm ci'), 'the guard runs before the install command');
  const readme = read('tools/README.md');
  for (const needle of ['fetch.mjs', 'packet.mjs', 'quotes.mjs', 'edits.mjs', 'search.mjs', 'lint.mjs', 'compare.mjs', 'digest.mjs', 'check-reports.mjs', 'audit.mjs']) assert.ok(readme.includes(needle), needle);
  assert.match(readme, /Rola nie jest ślepa z natury/);
  assert.match(readme, /dwa razy, niezależnie, a compare\.mjs wskazuje zdania, które rozstrzyga człowiek/);
  assert.doesNotMatch(readme, /wynika, że weryfikator nie widzi/);
});

test('the only skill is the Polish one: no Chinese text, no remote instructions, no foreign emergency numbers', () => {
  const skills = readdirSync(new URL('.claude/skills/', root));
  assert.deepEqual(skills, ['jak-zyc-lepiej']);
  assert.equal(existsSync(fileURLToPath(new URL('.claude/skills/life-decision-guide', root))), false);
  const text = read('.claude/skills/jak-zyc-lepiej/SKILL.md');
  const front = /^---\n([\s\S]*?)\n---\n/.exec(text)?.[1] ?? '';
  assert.match(front, /^name: jak-zyc-lepiej$/m);
  assert.match(front, /^description: .*zweryfikowanych polskich porad/m);
  assert.doesNotMatch(text, /\p{Script=Han}/u);
  assert.doesNotMatch(text, /curl|wget|git clone|raw\.githubusercontent|https?:\/\//i, 'a skill must not fetch or follow instructions from the network');
  assert.match(text, /tools\/pl\/search\.mjs/);
  assert.match(text, /AGENTS\.md/);
  assert.match(text, /\b112\b/);
  assert.match(text, /116 123/);
  for (const foreign of ['120', '119', '110', '12356', '12345']) assert.doesNotMatch(text, new RegExp(`\\b${foreign}\\b`), foreign);
  assert.match(text, /CC BY 4\.0/);
  assert.match(text, /Rekordy redakcyjne i porady niezweryfikowane nie są wynikami i nie wolno ich cytować ani streszczać/);
  assert.match(text, /Nie sugeruj, że odpowiedź "pewnie jest w książce"/);
});

test('nothing under .claude contains Chinese text', () => {
  const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(d => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));
  for (const file of walk(fileURLToPath(new URL('.claude/', root)))) assert.doesNotMatch(readFileSync(file, 'utf8'), /\p{Script=Han}/u, file);
});
