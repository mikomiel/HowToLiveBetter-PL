// Mechanical check of a source verifier's report against the stored snapshots.
// It finds quotes that are not in the source or numbers that are not in their quote. It cannot judge whether a quote supports a claim.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMain } from './lint.mjs';

export const normalise = s => String(s).normalize('NFC').replace(/[  ]/g, ' ').replace(/\s+/g, ' ').trim();
const digits = s => normalise(s).replace(/(\d) (?=\d{3}\b)/g, '$1').replace(',', '.');
const NEEDS_QUOTE = new Set(['supported', 'partly', 'contradicted']);
const MAX_WORDS = 40;

function loadSnapshot(cacheDir, name) {
  if (!/^[\w.-]+\.txt$/.test(name) || name.includes('..')) return null;
  const file = resolve(cacheDir, name);
  if (!existsSync(file)) return null;
  const lines = readFileSync(file, 'utf8').split('\n');
  const begin = lines.findIndex(l => l.startsWith('<<<SNAPSHOT-TEXT-BEGIN'));
  const end = lines.findIndex(l => l.startsWith('<<<SNAPSHOT-TEXT-END'));
  return { lines, begin, end };
}

// report: the JSON of pl-source-verifier. Returns { ok, checked, failures }.
export function checkReport(report, cacheDir) {
  const failures = [];
  const fail = (claim, problem) => failures.push({ claim: String(claim?.claim ?? '').slice(0, 80), problem });
  const snapshots = new Map();
  let checked = 0;
  for (const claim of report?.claims ?? []) {
    const quotes = claim.quotes ?? [];
    if (NEEDS_QUOTE.has(claim.verdict) && quotes.length === 0) fail(claim, `verdict "${claim.verdict}" has no quote`);
    for (const q of quotes) {
      checked++;
      if (!snapshots.has(q.snapshot)) snapshots.set(q.snapshot, loadSnapshot(cacheDir, String(q.snapshot ?? '')));
      const snap = snapshots.get(q.snapshot);
      if (!snap) { fail(claim, `snapshot "${q.snapshot}" does not exist in the cache`); continue; }
      const index = Number(q.line) - 1;
      if (!Number.isInteger(index) || index <= snap.begin || index >= snap.end) { fail(claim, `line ${q.line} is outside the source text of ${q.snapshot}`); continue; }
      if (!normalise(q.text ?? '')) { fail(claim, 'empty quote'); continue; }
      if (normalise(q.text).split(' ').length > MAX_WORDS) fail(claim, `quote is longer than ${MAX_WORDS} words`);
      if (!normalise(snap.lines[index]).includes(normalise(q.text))) fail(claim, `quote is not on line ${q.line} of ${q.snapshot}`);
    }
    const quoted = digits(quotes.map(q => q.text ?? '').join(' '));
    for (const n of claim.numbers ?? []) {
      if (n.editorial_calculation) continue;
      if (n.in_quote === false) fail(claim, `number ${n.value} is neither in a quote nor marked as an editorial calculation`);
      else if (!new RegExp(`(?<![\\d.])${digits(n.value).replace('.', '\\.')}(?![\\d])(?!\\.\\d)`).test(quoted)) fail(claim, `number ${n.value} claimed in a quote does not appear in the quotes`);
    }
  }
  return { ok: failures.length === 0, checked, failures };
}

if (isMain(import.meta.url)) {
  const [file, dir] = process.argv.slice(2);
  if (!file) { console.error('Usage: node tools/pl/quotes.mjs <verifier-report.json> [cache dir]'); process.exit(2); }
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const result = checkReport(JSON.parse(readFileSync(file, 'utf8')), resolve(dir ?? resolve(root, '.cache/sources')));
  console.log(JSON.stringify(result, null, 1));
  process.exitCode = result.ok ? 0 : 1;
}
