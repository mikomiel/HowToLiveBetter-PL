// Runs the matching checking script on every report saved in an audit directory (<dir>/<item>/<role>-<run>.json), against the text as it is now.
// Reports were written about the text of one commit and the sources of one day: a report that now fails may have gone stale, not wrong.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkEdits } from './edits.mjs';
import { isMain } from './lint.mjs';
import { buildPacket } from './packet.mjs';
import { checkAdversaryReport, checkReport } from './quotes.mjs';

const REPORT = /^(verifier|adversary|editor)-([a-z0-9]+)\.json$/;
const ROLE_ORDER = ['verifier', 'adversary', 'editor'];
const byItem = (a, b) => { const [x, y] = [a, b].map(n => n.split('.').map(Number)); return x[0] - y[0] || x[1] - y[1]; };

const failureText = failure => (typeof failure === 'string' ? failure : `${failure.where ?? ''} ${failure.problem ?? ''}`.trim());

// One report against the text and sources as they are now. Returns { outcome, status, problems } with every failure as text.
export function checkReportFile(file, item, role, { root, cache }) {
  let report;
  try { report = JSON.parse(readFileSync(file, 'utf8')); } catch (error) { return { outcome: 'unreadable', status: null, problems: [error.message.slice(0, 160)] }; }
  let packet;
  try { packet = buildPacket(root, item, role, cache); } catch (error) { return { outcome: 'no packet', status: null, problems: [error.message.slice(0, 160)] }; }
  const result = role === 'verifier' ? checkReport(report, packet, cache) : role === 'adversary' ? checkAdversaryReport(report, packet, cache) : checkEdits(report, packet);
  return { outcome: result.ok ? 'accepted' : 'rejected', status: result.status ?? null, problems: result.failures.map(failureText) };
}

// Returns one row per report: { item, file, role, outcome: 'accepted' | 'rejected' | 'unreadable' | 'no packet', status, failures, first }.
export function checkDirectory(dir, { root, cache }) {
  const rows = [];
  const items = readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory() && /^\d\d\.\d+$/.test(d.name)).map(d => d.name).sort(byItem);
  for (const item of items) {
    const files = readdirSync(join(dir, item)).map(f => ({ f, m: REPORT.exec(f) })).filter(x => x.m)
      .sort((x, y) => ROLE_ORDER.indexOf(x.m[1]) - ROLE_ORDER.indexOf(y.m[1]) || x.m[2].localeCompare(y.m[2]));
    for (const { f, m } of files) {
      const result = checkReportFile(join(dir, item, f), item, m[1], { root, cache });
      rows.push({ item, file: f, role: m[1], outcome: result.outcome, status: result.status, failures: result.outcome === 'accepted' || result.outcome === 'rejected' ? result.problems.length : 0, first: (result.problems[0] ?? '').slice(0, 160) });
    }
  }
  return rows;
}

export const formatRows = rows => rows.map(r => `${r.item}/${r.file.replace('.json', '')}: ${r.outcome}${r.status ? `, ${r.status}` : ''}${r.failures ? `, ${r.failures} failure(s)` : ''}${r.first && r.outcome !== 'accepted' ? ` (${r.first})` : ''}`).join('\n');

if (isMain(import.meta.url)) {
  const args = process.argv.slice(2);
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const flag = (name, takesValue) => { const i = args.indexOf(name); return i < 0 ? null : takesValue ? args.splice(i, 2)[1] : args.splice(i, 1) && true; };
  try {
    const json = flag('--json', false);
    const cache = resolve(root, flag('--cache', true) ?? '.cache/sources');
    if (args.length !== 1 || !existsSync(args[0])) throw new Error('Usage: node tools/pl/check-reports.mjs <audit-directory> [--cache dir] [--json]');
    const rows = checkDirectory(resolve(args[0]), { root, cache });
    if (!rows.length) throw new Error(`No reports (like 14.2/verifier-a.json) in ${args[0]}`);
    console.log(json ? JSON.stringify(rows, null, 1) : formatRows(rows));
    const rejected = rows.filter(r => r.outcome !== 'accepted').length;
    if (!json) console.error(`${rows.length - rejected} of ${rows.length} reports accepted.`);
    process.exitCode = rejected ? 1 : 0;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
