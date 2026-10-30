// Two independent verifier runs on one item: which sentences they judge differently, and which items are high-stakes enough to need two runs.
// A single run is not deterministic on borderline sentences, so where two runs differ a person decides; this script only finds the difference.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fold, published } from '../../reader.mjs';
import { isMain, loadAll, READER_FIELDS } from './lint.mjs';
import { buildPacket } from './packet.mjs';
import { checkReport, deriveStatus, sentenceOf, SOURCE_KINDS } from './quotes.mjs';
import { normaliseItem } from './sources.mjs';

// Word beginnings after the reader's fold (lower case, no diacritics); "=" marks a whole word, for short words that start longer ones.
// A false hit only costs a second run, a miss costs a wrong sentence.
export const HIGH_STAKES = {
  health: ['zdrow', 'lekar', 'lekow', 'dawk', 'choro', 'ciaz', 'objaw', 'bezsenn', 'depres', 'terapi', 'suplement', 'kofein', 'alkohol', 'cisnien', 'szczepi', 'uzalezn', 'leczen', 'diagno', '=lek', '=leki', '=bol'],
  law: ['rodo', 'prawn', 'przepis', 'roszcz', 'odpowiedzialn', 'dane osobow', '=prawo', '=prawa', '=prawu', '=sad', '=sadu', '=ustawa', '=ustawy', '=ustawie', '=ustawe', '=umowa', '=umowy', '=umowe'],
  money: ['podat', 'zasil', 'swiadcz', 'emerytur', 'kredyt', 'pozycz', 'ubezpiecz', 'inwest', '=zus'],
  safety: ['pozar', 'ratown', 'zagrozen', 'przemoc', '=112', '=997', '=998', '=999', '=alarm', '=wypadek', '=wypadku'],
  accounts: ['hasl', 'uwierzytel', 'dwuskladnik', 'odzyskiw', 'phishing', 'wyludz', 'logowan', 'uprawnien', '=2fa', '=konto', '=konta', '=koncie', '=kont', '=kontem', '=kontach', '=zgoda', '=zgode', '=zgody', '=zgodzie'],
};

// What an entry is about, from its title and the fields a reader sees. Returns { high, domains, matched }.
export function riskOf(entry) {
  const text = [entry.title, ...READER_FIELDS.map(field => entry.fields[field] ?? '')].join(' ');
  const folded = fold(text).replace(/\[[^\]]*\]\([^)]*\)/g, ' ');
  const words = folded.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const hit = stem => (stem.startsWith('=') ? words.includes(stem.slice(1)) : stem.includes(' ') ? folded.includes(stem) : words.some(w => w.startsWith(stem)));
  const matched = Object.entries(HIGH_STAKES).map(([domain, stems]) => [domain, stems.filter(hit)]).filter(([, found]) => found.length);
  return { high: matched.length > 0, domains: matched.map(([domain]) => domain), matched: Object.fromEntries(matched) };
}

// How much a verdict leaves open: 0 settled, 1 in part, 2 undecided, 3 refuted.
const OPEN = { supported: 0, absent_in_source: 0, not_applicable: 0, partly: 1, not_checkable: 2, source_unavailable: 2, unsupported: 3, contradicted: 3 };
const brief = c => ({ id: c.id, kind: c.kind, verdict: c.verdict, ...(c.reason ? { reason: String(c.reason).slice(0, 220) } : {}) });

// Both reports must already have passed quotes.mjs. Returns { item, statusA, statusB, agree, disagreements }.
export function compareReports(a, b) {
  const sentences = new Map();
  const add = (side, claims) => {
    for (const c of claims ?? []) {
      const id = sentenceOf(c.id);
      if (!id) continue;
      if (!sentences.has(id)) sentences.set(id, { a: [], b: [] });
      sentences.get(id)[side].push(c);
    }
  };
  add('a', a.claims);
  add('b', b.claims);
  const disagreements = [];
  for (const [id, { a: rowsA, b: rowsB }] of sentences) {
    const worst = rows => Math.max(0, ...rows.map(c => OPEN[c.verdict] ?? 0));
    const checked = rows => rows.some(c => SOURCE_KINDS.includes(c.kind));
    if (checked(rowsA) !== checked(rowsB)) disagreements.push({ id, type: 'checking', note: 'one run checked this sentence against a source and the other did not', a: rowsA.map(brief), b: rowsB.map(brief) });
    else if (worst(rowsA) !== worst(rowsB)) disagreements.push({ id, type: 'strength', note: 'the runs leave a different amount open', a: rowsA.map(brief), b: rowsB.map(brief) });
  }
  const statusA = deriveStatus(a.claims ?? []);
  const statusB = deriveStatus(b.claims ?? []);
  return { item: a.item, statusA, statusB, agree: statusA === statusB && disagreements.length === 0, disagreements };
}

if (isMain(import.meta.url)) {
  const args = process.argv.slice(2);
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const flag = (name, takesValue) => { const i = args.indexOf(name); return i < 0 ? null : takesValue ? args.splice(i, 2)[1] : args.splice(i, 1) && true; };
  try {
    if (flag('--risk', false)) {
      const rows = loadAll(root).flatMap(c => published(c.entries)).map(e => ({ item: e.number, title: e.title, ...riskOf(e) }));
      if (args[0]) { const one = rows.find(r => r.item === normaliseItem(args[0])); if (!one) throw new Error(`No published item ${args[0]}`); console.log(JSON.stringify(one, null, 1)); }
      else { console.log(JSON.stringify(rows, null, 1)); console.error(`${rows.filter(r => r.high).length} of ${rows.length} published items are high-stakes (two verifier runs).`); }
      process.exit(0);
    }
    const cache = resolve(root, flag('--cache', true) ?? '.cache/sources');
    if (args.length !== 2) throw new Error('Usage: node tools/pl/compare.mjs <verifier-report-1.json> <verifier-report-2.json> [--cache dir]\n       node tools/pl/compare.mjs --risk [N.M]');
    const [a, b] = args.map(file => JSON.parse(readFileSync(file, 'utf8')));
    if (a.item !== b.item) throw new Error(`The reports are for different items: ${a.item} and ${b.item}`);
    const packet = buildPacket(root, a.item, 'verifier', cache);
    for (const [name, report] of [[args[0], a], [args[1], b]]) {
      const result = checkReport(report, packet, cache);
      if (!result.ok) throw new Error(`${name} does not pass quotes.mjs (${result.failures.length} failures). Compare only reports that pass.`);
    }
    const result = compareReports(a, b);
    console.log(JSON.stringify(result, null, 1));
    process.exit(result.agree ? 0 : 1);
  } catch (error) {
    console.error(error.message);
    process.exit(2);
  }
}
