// Builds the exact input one reviewer role may see for one item, so blindness comes from the input, not from a request.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FORMAT } from './fetch.mjs';
import { isMain, loadAll, upstreamSpanOf } from './lint.mjs';
import { citedInputs, normaliseItem } from './sources.mjs';
import { splitSentences } from './text.mjs';

const READER = ['Koszt', 'W praktyce', 'Korzyść i dowody', 'Ocena dowodów', 'Ocena redakcyjna', 'Ograniczenia'];
export const ROLE_FIELDS = {
  verifier: READER,
  adversary: [...READER, 'Źródła', 'Zmiany w adaptacji'],
  editor: READER,
};
const WITH_SOURCES = new Set(['verifier', 'adversary']);
export const PACKET_VERSION = 2;

// The title and every sentence of the reader-facing fields, each with an id the reviewer must answer for.
export function propositions(entry) {
  const out = [{ id: 'title#1', field: 'title', index: 1, text: entry.title }];
  for (const field of READER) splitSentences(entry.fields[field] ?? '').forEach((text, i) => out.push({ id: `${field}#${i + 1}`, field, index: i + 1, text }));
  return out;
}

export function readManifest(cacheDir) {
  const path = resolve(cacheDir, 'manifest.jsonl');
  const records = [];
  if (!existsSync(path)) return records;
  for (const line of readFileSync(path, 'utf8').split('\n').filter(Boolean)) {
    try { records.push(JSON.parse(line)); } catch { /* a damaged line is skipped, never trusted */ }
  }
  return records;
}

// One row per cited source, joined to its latest fetch by input. A cited source that was never fetched is still listed, as missing.
// Upstream leads fetched for this item are listed too, marked as leads: a lead alone is not evidence for a claim.
export function sourceRows(cacheDir, entry) {
  const records = readManifest(cacheDir);
  const latest = new Map();
  for (const r of records) latest.set(r.input, r);
  const warnings = [];
  const toRow = (input, origin, r) => {
    const base = { origin, input };
    if (!r) return { ...base, access: 'missing', accessWords: 'nie pobrano', snapshot: null };
    if (r.format !== FORMAT) {
      warnings.push(`Legacy cache record for ${input}: re-fetch with "node tools/pl/fetch.mjs --item ${entry.number}".`);
      return { ...base, access: 'missing', accessWords: 'nie pobrano (stary format)', snapshot: null };
    }
    if (r.file && !existsSync(resolve(cacheDir, r.file))) {
      warnings.push(`Snapshot ${r.file} for ${input} is missing from the cache: re-fetch it.`);
      return { ...base, access: 'missing', accessWords: 'nie pobrano (brak pliku)', snapshot: null };
    }
    return { ...base, access: r.access, accessWords: r.accessWords, status: r.status ?? null, error: r.error ?? null, via: r.via ?? null, finalUrl: r.finalUrl ?? null,
      redirectedHost: r.redirectedHost ?? false, replacementChars: r.replacementChars ?? false, chars: r.chars ?? 0, sha256: r.sha256 ?? null, snapshot: r.file ?? null, info: r.info ?? null };
  };
  const cited = citedInputs(entry);
  const rows = cited.map(input => toRow(input, 'cited', latest.get(input)));
  const leads = new Map();
  for (const r of records) if (r.item === entry.number && r.origin === 'upstream-lead' && !cited.includes(r.input)) leads.set(r.input, latest.get(r.input));
  for (const [input, r] of leads) rows.push(toRow(input, 'lead', r));
  if (!cited.length) warnings.push(`Item ${entry.number} cites no fetchable source (no https link or DOI in Źródła).`);
  return { rows, warnings };
}

export function buildPacket(root, number, role, cacheDir = resolve(root, '.cache/sources')) {
  if (!Object.hasOwn(ROLE_FIELDS, role)) throw new Error(`unknown role "${role}". Use verifier, adversary or editor.`);
  const id = normaliseItem(number);
  const entry = loadAll(root).flatMap(c => c.entries).find(e => e.number === id);
  if (!entry) throw new Error(`unknown item ${id}`);
  const packet = { version: PACKET_VERSION, item: id, role, title: entry.title, fields: Object.fromEntries(ROLE_FIELDS[role].filter(f => entry.fields[f]).map(f => [f, entry.fields[f]])) };
  if (role !== 'editor') packet.propositions = propositions(entry);
  if (WITH_SOURCES.has(role)) {
    const { rows, warnings } = sourceRows(cacheDir, entry);
    Object.assign(packet, { snapshotDir: '.cache/sources', sources: rows, warnings });
  }
  if (role === 'adversary') {
    const span = upstreamSpanOf(entry, root);
    packet.upstream = { grade: /证据等级：([ABC])/.exec(span)?.[1] ?? null, lines: span.split('\n').map((text, i) => ({ n: i + 1, text })) };
  }
  return packet;
}

if (isMain(import.meta.url)) {
  const args = process.argv.slice(2);
  const i = args.indexOf('--cache');
  const cache = i >= 0 ? args.splice(i, 2)[1] : null;
  const [number, role] = args;
  const root = fileURLToPath(new URL('../../', import.meta.url));
  try {
    if (!number || !role) throw new Error('Usage: node tools/pl/packet.mjs <N.M> <verifier|adversary|editor> [--cache dir]');
    console.log(JSON.stringify(buildPacket(root, number, role, cache ? resolve(cache) : undefined), null, 1));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
