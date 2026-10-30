// A reading aid for an audit: collects the verifier, adversary and editor reports of a directory into one list of what a person has to decide.
// It adds no judgement of its own. Statuses are derived from the verdicts, never taken from what a report says about itself.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { isMain } from './lint.mjs';
import { compareReports } from './compare.mjs';
import { deriveStatus } from './quotes.mjs';

const OPEN_VERDICTS = new Set(['partly', 'unsupported', 'contradicted', 'not_checkable', 'source_unavailable']);
const SEVERITY_ORDER = { blocker: 0, major: 1, minor: 2 };
const cut = (text, n = 240) => { const t = String(text ?? '').replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n - 1)}…` : t; };
const itemKey = name => name.split('.').map(Number);
const byItem = (a, b) => { const [x, y] = [itemKey(a), itemKey(b)]; return x[0] - y[0] || x[1] - y[1]; };

const load = file => { try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return null; } };

// Rows a person still has to look at in one verifier report: every verdict short of settled, and a recommendation backed only in part.
export function openRows(report) {
  return (report?.claims ?? [])
    .filter(c => OPEN_VERDICTS.has(c.verdict))
    .map(c => ({ id: c.id, kind: c.kind, verdict: c.verdict, claim: cut(c.claim, 140), reason: cut(c.reason) }));
}

// One item: { item, verifiers: [{ run, status, open }], compare, adversary, editor }. A report that is missing or unreadable is null.
export function digestItem(item, dir) {
  const read = name => (existsSync(join(dir, `${name}.json`)) ? load(join(dir, `${name}.json`)) : null);
  const reports = { a: read('verifier-a'), b: read('verifier-b') };
  const verifiers = Object.entries(reports).filter(([, r]) => r).map(([run, r]) => ({ run, status: deriveStatus(r.claims ?? []), open: openRows(r), scopeGaps: (r.scope_gaps ?? []).length }));
  const adversary = read('adversary-a');
  const editor = read('editor-a');
  return {
    item,
    verifiers,
    compare: reports.a && reports.b ? compareReports(reports.a, reports.b) : null,
    adversary: adversary ? {
      attacksNotAssessable: (adversary.attacks_not_assessable ?? []).map(n => n.attack),
      findings: [...(adversary.findings ?? [])].sort((x, y) => (SEVERITY_ORDER[x.severity] ?? 3) - (SEVERITY_ORDER[y.severity] ?? 3))
        .map(f => ({ severity: f.severity, attack: f.attack, id: f.id, text: cut(f.text, 120), why: cut(f.why, 320), fix: cut(f.fix_direction, 200) })),
    } : null,
    editor: editor ? {
      verdict: editor.verdict,
      edits: (editor.edits ?? []).map(e => ({ field: e.field, reason: e.reason, original: cut(e.original, 100), replacement: cut(e.replacement, 140), reverify: e.requires_reverification === true })),
      protectedFindings: (editor.protected_findings ?? []).length,
    } : null,
  };
}

export function digestDir(dir) {
  const items = readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory() && /^\d\d\.\d+$/.test(d.name)).map(d => d.name).sort(byItem);
  return items.map(item => digestItem(item, join(dir, item)));
}

// Markdown for a person: the table first, then what is open, item by item, the most serious first.
export function toMarkdown(digest) {
  const out = ['# Audit digest', '', '| Item | Verifier A | Verifier B | Runs agree | Adversary (blocker/major/minor) | Editor |', '|---|---|---|---|---|---|'];
  const count = (d, severity) => (d.adversary?.findings ?? []).filter(f => f.severity === severity).length;
  for (const d of digest) {
    const status = run => d.verifiers.find(v => v.run === run)?.status ?? '-';
    const agree = d.compare ? (d.compare.agree ? 'yes' : `no (${d.compare.disagreements.length})`) : '-';
    const adversary = d.adversary ? `${count(d, 'blocker')}/${count(d, 'major')}/${count(d, 'minor')}` : '-';
    out.push(`| ${d.item} | ${status('a')} | ${status('b')} | ${agree} | ${adversary} | ${d.editor ? `${d.editor.verdict}, ${d.editor.edits.length} edits` : '-'} |`);
  }
  for (const d of digest) {
    out.push('', `## ${d.item}`);
    for (const v of d.verifiers) {
      out.push('', `Verifier ${v.run.toUpperCase()}: ${v.status}${v.open.length ? `, ${v.open.length} open row(s)` : ''}`);
      for (const r of v.open) out.push(`- ${r.id} (${r.kind}, ${r.verdict}): ${r.claim}`, `  - ${r.reason}`);
    }
    if (d.compare && !d.compare.agree) {
      out.push('', 'The two runs differ; a person decides:');
      for (const x of d.compare.disagreements) out.push(`- ${x.id} (${x.type}): A ${x.a.map(c => `${c.kind} ${c.verdict}`).join(', ')}; B ${x.b.map(c => `${c.kind} ${c.verdict}`).join(', ')}`);
    }
    if (d.adversary) {
      const serious = d.adversary.findings.filter(f => f.severity !== 'minor');
      out.push('', `Adversary: ${serious.length} blocker/major, ${d.adversary.findings.length - serious.length} minor${d.adversary.attacksNotAssessable.length ? `; not assessable: ${d.adversary.attacksNotAssessable.join(', ')}` : ''}`);
      for (const f of serious) out.push(`- ${f.severity.toUpperCase()} ${f.attack} (${f.id}): ${f.text}`, `  - ${f.why}`, `  - Direction: ${f.fix}`);
    }
    if (d.editor?.edits.length) {
      out.push('', `Editor (${d.editor.verdict}, ${d.editor.protectedFindings} protected findings):`);
      for (const e of d.editor.edits) out.push(`- ${e.field} (${e.reason}${e.reverify ? ', needs re-verification' : ''}): "${e.original}" → "${e.replacement}"`);
    }
  }
  return `${out.join('\n')}\n`;
}

if (isMain(import.meta.url)) {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const dir = args.find(a => !a.startsWith('--'));
  try {
    if (!dir) throw new Error('Usage: node tools/pl/digest.mjs <audit-directory> [--json]');
    const digest = digestDir(resolve(dir));
    if (!digest.length) throw new Error(`No item directories (like 14.2) in ${dir}`);
    console.log(json ? JSON.stringify(digest, null, 1) : toMarkdown(digest));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
