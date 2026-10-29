// Builds the exact input one reviewer role may see for one item, so blindness comes from the input, not from a request.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMain, loadAll, upstreamSpanOf } from './lint.mjs';

const READER = ['Koszt', 'W praktyce', 'Korzyść i dowody', 'Ocena dowodów', 'Ocena redakcyjna', 'Ograniczenia'];
export const ROLE_FIELDS = {
  verifier: READER,
  adversary: [...READER, 'Źródła', 'Zmiany w adaptacji'],
  editor: READER,
};
const WITH_SOURCES = new Set(['verifier', 'adversary']);

// Latest manifest record per input for one item. Blocked and failed fetches stay visible, with no file.
export function latestSources(cacheDir, number) {
  const path = resolve(cacheDir, 'manifest.jsonl');
  if (!existsSync(path)) return [];
  const latest = new Map();
  for (const line of readFileSync(path, 'utf8').split('\n').filter(Boolean)) {
    let record;
    try { record = JSON.parse(line); } catch { continue; }
    if (record.item === number) latest.set(record.input, record);
  }
  return [...latest.values()].map(r => ({ input: r.input, access: r.access, accessWords: r.accessWords, via: r.via, chars: r.chars ?? 0, snapshot: r.file ? `.cache/sources/${r.file}` : null }));
}

export function buildPacket(root, number, role, cacheDir = resolve(root, '.cache/sources')) {
  if (!ROLE_FIELDS[role]) throw new Error(`unknown role "${role}" (verifier, adversary, editor)`);
  const entry = loadAll(root).flatMap(c => c.entries).find(e => e.number === number);
  if (!entry) throw new Error(`unknown item ${number}`);
  const packet = { item: number, role, title: entry.title, fields: Object.fromEntries(ROLE_FIELDS[role].filter(f => entry.fields[f]).map(f => [f, entry.fields[f]])) };
  if (WITH_SOURCES.has(role)) packet.sources = latestSources(cacheDir, number);
  if (role === 'adversary') {
    const span = upstreamSpanOf(entry, root);
    packet.upstream = { grade: /证据等级：([ABC])/.exec(span)?.[1] ?? null, span };
  }
  return packet;
}

if (isMain(import.meta.url)) {
  const [number, role] = process.argv.slice(2);
  if (!number || !role) { console.error('Usage: node tools/pl/packet.mjs <N.M> <verifier|adversary|editor>'); process.exit(2); }
  console.log(JSON.stringify(buildPacket(fileURLToPath(new URL('../../', import.meta.url)), number, role), null, 1));
}
