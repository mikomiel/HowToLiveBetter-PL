// Mechanical check of a source verifier's report. It fails closed: a report that checks nothing, answers for the wrong item,
// skips a sentence, quotes a file that is not a fetched cited source, or declares a status its verdicts do not support is rejected.
// It cannot judge whether a quote supports a claim.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FORMAT, MARKER_BEGIN, MARKER_END } from './fetch.mjs';
import { isMain } from './lint.mjs';
import { buildPacket } from './packet.mjs';
import { foldText, numberTokens, sameNumber } from './text.mjs';

export const VERDICTS = ['supported', 'partly', 'unsupported', 'contradicted', 'not_checkable', 'source_unavailable', 'absent_in_source', 'not_applicable'];
export const KINDS = ['source_claim', 'source_description', 'recommendation_derived', 'editorial_estimate', 'meta_statement'];
export const STATUSES = ['PASS', 'FAIL', 'UNAVAILABLE'];
// What the item says about a source, or takes from it: both need the source's own words.
export const SOURCE_KINDS = ['source_claim', 'source_description'];
const SOURCE_VERDICTS = ['supported', 'partly', 'unsupported', 'contradicted', 'not_checkable', 'source_unavailable', 'absent_in_source'];
const NEEDS_QUOTE = new Set(['supported', 'partly', 'contradicted']);
// A verdict short of "supported" has to say why, or the person reading the report cannot act on it.
const NEEDS_REASON = new Set(['partly', 'unsupported', 'contradicted', 'not_checkable', 'source_unavailable']);
const MAX_WORDS = 40;
const MIN_CHARS = 12;
const WORD = /[\p{L}\p{N}]/u;
const withoutLinks = text => String(text).replace(/\[[^\]]*\]\([^)]*\)/g, ' ');

// The status the verdicts allow: any refuted claim or ungrounded recommendation fails, any claim or recommendation only partly backed
// or that could not be judged leaves the item unavailable.
export function deriveStatus(claims) {
  const judged = claims.filter(c => SOURCE_KINDS.includes(c.kind) || (c.kind === 'recommendation_derived' && ['unsupported', 'partly'].includes(c.verdict)));
  if (judged.some(c => ['unsupported', 'contradicted'].includes(c.verdict))) return 'FAIL';
  if (judged.some(c => ['partly', 'not_checkable', 'source_unavailable'].includes(c.verdict))) return 'UNAVAILABLE';
  return 'PASS';
}

// "W praktyce#3" answers for the whole sentence; a sentence split into parts is answered as "W praktyce#3.1", "W praktyce#3.2".
const ID_FORM = /^(.+#\d+)(?:\.(\d+))?$/;
export const sentenceOf = id => ID_FORM.exec(String(id))?.[1];

function loadSnapshot(cacheDir, row) {
  const file = resolve(cacheDir, row.snapshot);
  if (!existsSync(file)) return { problem: `snapshot ${row.snapshot} does not exist in the cache` };
  const lines = readFileSync(file, 'utf8').split('\n');
  const begin = lines.indexOf(MARKER_BEGIN);
  const end = lines.lastIndexOf(MARKER_END);
  if (begin === -1 || end <= begin) return { problem: `snapshot ${row.snapshot} has no text markers: it is in an old format, re-fetch it with the current fetch.mjs` };
  if (!lines.includes(`Format: ${FORMAT}`)) return { problem: `snapshot ${row.snapshot} is not format ${FORMAT}: re-fetch it with the current fetch.mjs` };
  const body = lines.slice(begin + 1, end).join('\n');
  if (row.sha256 && createHash('sha256').update(body).digest('hex') !== row.sha256) return { problem: `snapshot ${row.snapshot} changed after it was fetched (hash differs from the manifest)` };
  return { lines, begin, end };
}

// Where a folded quote sits in a folded line, only on word boundaries and not inside a longer number.
function findQuote(line, quote) {
  for (let at = line.indexOf(quote); at !== -1; at = line.indexOf(quote, at + 1)) {
    const before = line[at - 1];
    const after = line[at + quote.length];
    const first = quote[0];
    const last = quote.at(-1);
    if (before && WORD.test(before) && WORD.test(first)) continue;
    if (after && WORD.test(after) && WORD.test(last)) continue;
    if (after && /[.,]/.test(after) && /\d/.test(line[at + quote.length + 1] ?? '') && /\d/.test(last)) continue;
    if (before && /[.,]/.test(before) && /\d/.test(line[at - 2] ?? '') && /\d/.test(first)) continue;
    return at;
  }
  return -1;
}

// One verifier of line-addressed evidence for both reviewer reports. Returns a problem string or null.
function quoteChecker(packet, cacheDir) {
  const rows = new Map((packet.sources ?? []).filter(r => r.snapshot).map(r => [r.snapshot, r]));
  const cache = new Map();
  const snapshot = name => { if (!cache.has(name)) cache.set(name, loadSnapshot(cacheDir, rows.get(name))); return cache.get(name); };
  const check = q => {
    const row = rows.get(q?.snapshot);
    if (!row) return `snapshot "${q?.snapshot}" is not a fetched source of this item (use a bare file name from packet.sources)`;
    if (row.origin !== 'cited') return `snapshot ${q.snapshot} is an upstream lead, not a source the item cites`;
    const snap = snapshot(q.snapshot);
    if (snap.problem) return snap.problem;
    const index = Number(q.line) - 1;
    if (!Number.isInteger(index) || index <= snap.begin || index >= snap.end) return `line ${q.line} is outside the source text of ${q.snapshot}`;
    const text = foldText(q.text ?? '');
    if (!text) return 'empty quote';
    if (text.split(' ').length > MAX_WORDS) return `quote is longer than ${MAX_WORDS} words`;
    if (text.length < MIN_CHARS && q.cell !== true) return `quote is shorter than ${MIN_CHARS} characters (mark a single table cell with "cell": true)`;
    const line = foldText(snap.lines[index]);
    if (findQuote(line, text) === -1) return `quote is not on line ${q.line} of ${q.snapshot} (that line starts: "${line.slice(0, 70)}")`;
    return null;
  };
  return { rows, check };
}

// report: the JSON of pl-source-verifier. packet: buildPacket(root, item, 'verifier'). Returns { ok, status, verdicts, quotesChecked, failures, warnings }.
export function checkReport(report, packet, cacheDir) {
  const failures = [];
  const warnings = [...(packet.warnings ?? [])];
  const fail = (where, problem) => failures.push({ where: String(where).slice(0, 90), problem });
  const result = () => ({ ok: failures.length === 0, status: null, verdicts: {}, quotesChecked: 0, failures, warnings });

  if (!report || typeof report !== 'object' || Array.isArray(report)) { fail('report', 'the report is not a JSON object'); return result(); }
  if (report.item !== packet.item) fail('report', `the report is for item "${report.item}", the packet is for ${packet.item}`);
  if (!STATUSES.includes(report.status)) fail('report', `status must be one of ${STATUSES.join(', ')}`);
  if (!Array.isArray(report.claims) || report.claims.length === 0) { fail('report', 'claims must be a non-empty array: a report that answers for nothing checks nothing'); return result(); }

  const { rows, check } = quoteChecker(packet, cacheDir);
  const sentences = new Map((packet.propositions ?? []).map(p => [p.id, p]));
  const claims = report.claims.filter(c => c && typeof c === 'object');
  const byId = new Map();
  const partsOf = new Map();
  for (const c of claims) {
    if (byId.has(c.id) && c.id !== sentenceOf(c.id)) fail(`claim ${c.id}`, 'two rows have this id: give each part of a split sentence its own number');
    byId.set(c.id, c);
    const sentence = sentenceOf(c.id);
    if (sentence) partsOf.set(sentence, [...(partsOf.get(sentence) ?? []), String(c.id)]);
  }
  for (const [sentence, ids] of partsOf) {
    if (ids.length > 1 && ids.includes(sentence)) fail(`claim ${sentence}`, `this sentence is answered in ${ids.length} rows: every row of it needs a numbered id such as "${sentence}.1"`);
  }
  let quotesChecked = 0;

  report.claims.forEach((claim, n) => {
    const where = `claim ${n + 1} (${claim?.id})`;
    if (!claim || typeof claim !== 'object') { fail(where, 'not an object'); return; }
    const proposition = sentences.get(sentenceOf(claim.id));
    if (!proposition) { fail(where, `id is not a sentence of the item. Use an id from packet.propositions, with ".1", ".2" after it for the parts of a split sentence`); return; }
    if (!KINDS.includes(claim.kind)) fail(where, `kind must be one of ${KINDS.join(', ')}`);
    if (!VERDICTS.includes(claim.verdict)) { fail(where, `verdict must be one of ${VERDICTS.join(', ')}`); return; }
    if (typeof claim.claim !== 'string' || !claim.claim.trim()) { fail(where, 'claim text is empty'); return; }
    if (!foldText(proposition.text).includes(foldText(claim.claim))) fail(where, 'claim text is not part of that sentence of the item');
    const isSource = SOURCE_KINDS.includes(claim.kind);
    if (isSource && !SOURCE_VERDICTS.includes(claim.verdict)) fail(where, `a ${claim.kind} cannot have verdict ${claim.verdict}`);
    if (claim.kind === 'recommendation_derived') {
      const deps = Array.isArray(claim.depends_on) ? claim.depends_on : [];
      const direct = Array.isArray(claim.quotes) && claim.quotes.length > 0;
      if (!['not_applicable', 'partly', 'unsupported'].includes(claim.verdict)) fail(where, 'a derived recommendation has verdict not_applicable (fully backed), partly (backed in part) or unsupported (nothing backs it)');
      else if (claim.verdict === 'unsupported' && (deps.length || direct)) fail(where, 'an unsupported recommendation has nothing behind it: drop depends_on and quotes, or use partly');
      else if (claim.verdict !== 'unsupported' && !deps.length && !direct) fail(where, 'a derived recommendation must list depends_on (the source rows whose quotes back it) or carry quotes in which the source gives the same advice. If nothing backs it, its verdict is unsupported');
      for (const d of deps) {
        const target = byId.get(d);
        if (!target) fail(where, `depends_on "${d}" is not the id of a row of this report${partsOf.get(d) ? ` (that sentence is split: use ${partsOf.get(d).join(', ')})` : ''}`);
        else if (target === claim) fail(where, 'a recommendation cannot depend on itself');
        else if (!SOURCE_KINDS.includes(target.kind)) fail(where, `depends_on "${d}" is a ${target.kind}: only source_claim and source_description rows can back a recommendation`);
      }
    } else if (!isSource && claim.verdict !== 'not_applicable') fail(where, `${claim.kind} must have verdict not_applicable`);

    const quotes = Array.isArray(claim.quotes) ? claim.quotes : [];
    if (isSource && NEEDS_QUOTE.has(claim.verdict) && !quotes.length) fail(where, `verdict ${claim.verdict} needs at least one quote`);
    if (NEEDS_REASON.has(claim.verdict) && !String(claim.reason ?? '').trim()) fail(where, `verdict ${claim.verdict} needs a reason: what the snapshot says instead, what was searched, or what would be needed to decide`);
    if (claim.verdict === 'absent_in_source') {
      const searched = Array.isArray(claim.searched) ? claim.searched : [];
      if (!searched.length || !searched.every(s => rows.get(s)?.origin === 'cited')) fail(where, 'absent_in_source needs "searched": the cited snapshots that were searched');
    }

    const quoted = [];
    for (const q of quotes) {
      quotesChecked++;
      const problem = check(q);
      if (problem) fail(where, problem); else quoted.push(q.text);
    }

    const declared = Array.isArray(claim.numbers) ? claim.numbers : [];
    // A calculation shows its arithmetic: a basis with fewer than two figures explains nothing.
    const calculated = token => declared.some(d => d.editorial_calculation === true && numberTokens(String(d.basis ?? '')).length >= 2 && sameNumber(String(d.value), token.raw));
    if (isSource && ['supported', 'partly', 'contradicted'].includes(claim.verdict)) {
      for (const token of numberTokens(withoutLinks(claim.claim))) {
        const inQuote = quoted.some(text => numberTokens(text).some(t => sameNumber(t.raw, token.raw)));
        if (!inQuote && !calculated(token)) fail(where, `the number ${token.raw} is neither in a quote nor declared as an editorial calculation whose basis shows the arithmetic (at least two figures)`);
      }
      for (const d of declared) {
        if (d.in_quote === true && !quoted.some(text => numberTokens(text).some(t => sameNumber(t.raw, String(d.value))))) fail(where, `the number ${d.value} is declared as quoted but is in no quote`);
      }
    } else if (!isSource) {
      // No source row stands behind these figures. They are allowed, but a person must see them.
      for (const token of numberTokens(withoutLinks(claim.claim))) {
        if (!calculated(token)) warnings.push(`figure ${token.raw} in ${claim.id} (${claim.kind}) is checked against no source`);
      }
    }
  });

  for (const g of Array.isArray(report.scope_gaps) ? report.scope_gaps : []) {
    if (!g || (!byId.has(g.id) && !sentences.has(g.id))) fail(`scope_gaps ${g?.id}`, 'id is neither a row of this report nor a sentence of the item');
  }

  // Every sentence of the item, and every figure in it, must be answered for.
  for (const p of sentences.values()) {
    const mine = claims.filter(c => sentenceOf(c.id) === p.id && typeof c.claim === 'string');
    if (!mine.length) { fail(p.id, 'no claim answers for this sentence'); continue; }
    for (const token of numberTokens(withoutLinks(p.text))) {
      if (!mine.some(c => numberTokens(withoutLinks(c.claim)).some(t => sameNumber(t.raw, token.raw)))) fail(p.id, `the figure ${token.raw} of this sentence is in no claim`);
    }
  }

  const valid = report.claims.filter(c => c && KINDS.includes(c.kind) && VERDICTS.includes(c.verdict));
  const derived = deriveStatus(valid);
  if (STATUSES.includes(report.status) && report.status !== derived) fail('report', `status ${report.status} does not match the verdicts, which give ${derived}`);
  const verdicts = valid.reduce((a, c) => (a[c.verdict] = (a[c.verdict] ?? 0) + 1, a), {});
  return { ok: failures.length === 0, status: derived, verdicts, quotesChecked, failures, warnings };
}

const ATTACKS = ['same-action', 'preservation', 'grade', 'numbers', 'scope-words', 'leak', 'self-containment', 'recency', 'limitations'];
const SEVERITIES = ['blocker', 'major', 'minor'];

// report: the JSON of pl-claim-adversary. Every piece of evidence is checked against the stored snapshot line or the numbered upstream line.
export function checkAdversaryReport(report, packet, cacheDir) {
  const failures = [];
  const fail = (where, problem) => failures.push({ where: String(where).slice(0, 90), problem });
  if (!report || typeof report !== 'object' || Array.isArray(report)) return { ok: false, status: null, failures: [{ where: 'report', problem: 'the report is not a JSON object' }], warnings: [] };
  if (report.item !== packet.item) fail('report', `the report is for item "${report.item}", the packet is for ${packet.item}`);
  if (!STATUSES.includes(report.status)) fail('report', `status must be one of ${STATUSES.join(', ')}`);
  if (!Array.isArray(report.findings)) fail('report', 'findings must be an array');
  const { check } = quoteChecker(packet, cacheDir);
  const ids = new Set((packet.propositions ?? []).map(p => p.id));
  const upstream = new Map((packet.upstream?.lines ?? []).map(l => [l.n, foldText(l.text)]));
  const run = new Set(Array.isArray(report.attacks_run) ? report.attacks_run : []);
  const notAssessable = Array.isArray(report.attacks_not_assessable) ? report.attacks_not_assessable : [];
  for (const a of [...run, ...notAssessable.map(n => n?.attack)]) if (!ATTACKS.includes(a)) fail('report', `unknown attack "${a}"`);
  let blockers = 0;
  (Array.isArray(report.findings) ? report.findings : []).forEach((f, n) => {
    const where = `finding ${n + 1} (${f?.attack})`;
    if (!f || !SEVERITIES.includes(f.severity)) { fail(where, `severity must be one of ${SEVERITIES.join(', ')}`); return; }
    if (!ATTACKS.includes(f.attack)) fail(where, `attack must be one of ${ATTACKS.join(', ')}`);
    if (f.id && !ids.has(f.id)) fail(where, 'id is not a sentence of the item');
    const evidence = Array.isArray(f.evidence) ? f.evidence : [];
    let verified = 0;
    for (const e of evidence) {
      if (e?.source === 'snapshot') { const problem = check(e); if (problem) fail(where, problem); else verified++; }
      else if (e?.source === 'upstream') {
        const line = upstream.get(Number(e.line));
        if (line === undefined) fail(where, `upstream line ${e.line} does not exist`);
        else if (foldText(e.text ?? '').length < MIN_CHARS && e.cell !== true) fail(where, `upstream quote is shorter than ${MIN_CHARS} characters`);
        else if (findQuote(line, foldText(e.text ?? '')) === -1) fail(where, `quote is not on upstream line ${e.line}`);
        else verified++;
      } else fail(where, 'evidence.source must be "snapshot" or "upstream"');
    }
    if (f.severity === 'blocker') { blockers++; if (!verified) fail(where, 'a blocker needs at least one piece of evidence that checks out'); }
  });
  const covered = new Set([...run, ...notAssessable.map(n => n?.attack)]);
  const everyAttack = ATTACKS.every(a => covered.has(a));
  const derived = blockers ? 'FAIL' : !everyAttack || notAssessable.length ? 'UNAVAILABLE' : 'PASS';
  if (report.status === 'PASS' && !everyAttack) fail('report', `PASS needs every attack run or listed as not assessable; missing: ${ATTACKS.filter(a => !covered.has(a)).join(', ')}`);
  if (STATUSES.includes(report.status) && report.status !== derived) fail('report', `status ${report.status} does not match the findings, which give ${derived}`);
  return { ok: failures.length === 0, status: derived, failures, warnings: packet.warnings ?? [] };
}

if (isMain(import.meta.url)) {
  const args = process.argv.slice(2);
  const i = args.indexOf('--cache');
  const cache = i >= 0 ? args.splice(i, 2)[1] : null;
  const root = fileURLToPath(new URL('../../', import.meta.url));
  try {
    if (!args[0]) throw new Error('Usage: node tools/pl/quotes.mjs <verifier-or-adversary-report.json> [--cache dir]');
    const report = JSON.parse(readFileSync(args[0], 'utf8'));
    const cacheDir = cache ? resolve(cache) : resolve(root, '.cache/sources');
    const adversary = Array.isArray(report.findings);
    const packet = buildPacket(root, report.item, adversary ? 'adversary' : 'verifier', cacheDir);
    const result = (adversary ? checkAdversaryReport : checkReport)(report, packet, cacheDir);
    console.log(JSON.stringify(result, null, 1));
    process.exitCode = result.ok ? 0 : 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
