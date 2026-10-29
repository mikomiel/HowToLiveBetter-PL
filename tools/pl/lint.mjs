// Offline checks for the Polish chapters. They find drift and known defect classes; they cannot confirm that a claim is true.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHAPTERS, parseChapter } from '../../reader.mjs';

// Fields a reader sees as advice. Provenance fields (Źródła, Oryginał, Weryfikacja, Zmiany w adaptacji) may describe upstream.
export const READER_FIELDS = ['Koszt', 'W praktyce', 'Korzyść i dowody', 'Ocena dowodów', 'Ocena redakcyjna', 'Ograniczenia'];

const CHINA = /chi[nń]sk|chi[nń]czyk|\bChin(?:y|ach|ami|om|\b)|Pekin|Szanghaj|WeChat|Alipay|Taobao|Weixin|juan\w*\b/i;
const SECONDARY_HOSTS = ['lexlege.pl', 'standardyprawa.pl', 'arslege.pl', 'poradnikprzedsiebiorcy.pl', 'infor.pl', 'gazetaprawna.pl', 'wikipedia.org', 'wikiwand.com'];
// Grouped numbers (800 123 456) shortly after a phone word, and a bare 3-digit number right after "numer" or "telefon".
const PHONE_WORD = /telefon\w*|numer\w*|infolini\w*|zadzwo\w*|dzwo\w*|połącz\w*/gi;
const PHONE_GROUPED = /\b\d{3}(?:\s\d{2,3}){1,2}\b/g;
const PHONE_BARE = /(?:numer\w*|telefon\w*)\s+(\d{3})\b(?!\s\d{2,3}\b)/gi;
const PHONE_WINDOW = 60;
const phoneNumbers = text => {
  const words = [...text.matchAll(PHONE_WORD)].map(m => m.index);
  const grouped = [...text.matchAll(PHONE_GROUPED)]
    .filter(m => words.some(w => m.index > w && m.index - w <= PHONE_WINDOW && !text.slice(w, m.index).includes('. ')))
    .map(m => m[0]);
  const bare = [...text.matchAll(PHONE_BARE)].map(m => m[1]);
  return [...new Set([...grouped, ...bare].map(n => n.replace(/\s+/g, ' ')))];
};
// Emergency and crisis numbers that were individually checked for Poland. Add one only with its source.
export const PHONE_ALLOWLIST = new Set(['112', '997', '998', '999', '116 123', '116 111']);
const READ_SCOPE = /pełn|abstrakt|streszcz|fragment|wyciąg|część|ekstrakt/i;

const urls = text => [...text.matchAll(/\]\((https:\/\/[^)\s]+)\)/g)].map(m => m[1]);
const host = url => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } };

export function lintEntry(entry, { today = new Date().toISOString().slice(0, 10) } = {}) {
  const out = [];
  const add = (rule, severity, field, message) => out.push({ id: entry.number, rule, severity, field, message });
  if (entry.fields.Status !== 'verified') return out;

  for (const field of READER_FIELDS) {
    const text = entry.fields[field] ?? '';
    if (CHINA.test(text)) add('cn-leak', 'error', field, 'Reader-facing text mentions China or a Chinese rule. Describe the dropped upstream element in "Zmiany w adaptacji" instead.');
    for (const number of phoneNumbers(text)) {
      if (!PHONE_ALLOWLIST.has(number)) add('phone-number', 'error', field, `Number "${number}" follows a phone word and is not on the checked allowlist.`);
    }
  }
  const verification = entry.fields.Weryfikacja ?? '';
  if (!READ_SCOPE.test(verification)) add('read-scope', 'warning', 'Weryfikacja', 'Weryfikacja does not say what part of the source was read (full text, abstract, extract).');
  const date = /^(\d{4}-\d{2}-\d{2});/.exec(verification)?.[1];
  if (date && date > today) add('future-date', 'error', 'Weryfikacja', `Verification date ${date} is in the future.`);
  for (const url of urls(entry.fields['Źródła'] ?? '')) {
    const h = host(url);
    if (SECONDARY_HOSTS.some(s => h === s || h.endsWith('.' + s))) add('secondary-source', 'error', 'Źródła', `${h} is secondary commentary, not an original study or official document.`);
  }
  return out;
}

// Cross-record rules.
export function lintRecords(entries, { minShared = 3 } = {}) {
  const out = [];
  const groups = new Map();
  for (const e of entries) {
    const key = (e.fields.Weryfikacja ?? '').replace(/^\d{4}-\d{2}-\d{2}; /, '').trim();
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }
  for (const [text, group] of groups) {
    if (group.length < minShared) continue;
    for (const e of group) out.push({ id: e.number, rule: 'boilerplate-verification', severity: 'warning', field: 'Weryfikacja', message: `Same Weryfikacja text as ${group.length - 1} other records: "${text.slice(0, 70)}...". Give the item-specific blocker and what was read.` });
  }
  return out;
}

// Numbers in reader-facing fields, with whether the pinned Chinese original contains the same figure.
// A figure carried over from upstream is a lead, not evidence: a verifier must find it in a source passage.
export function numberInventory(entry, upstreamSpan) {
  const found = new Map();
  for (const field of READER_FIELDS) {
    const text = (entry.fields[field] ?? '').replace(/\[[^\]]*\]\([^)]*\)/g, ' ');
    for (const [token] of text.matchAll(/\d+(?:[.,]\d+)?(?:\s\d{3})*/g)) {
      const value = token.replace(/\s/g, '').replace(',', '.');
      const record = found.get(value) ?? { value: token, fields: new Set() };
      record.fields.add(field);
      found.set(value, record);
    }
  }
  const plain = upstreamSpan.replace(/(\d)\s(?=\d{3}\b)/g, '$1');
  return [...found.entries()].map(([value, r]) => ({
    id: entry.number, value: r.value, fields: [...r.fields],
    inUpstream: new RegExp(`(?<![\\d.])${value.replace('.', '[.,]?')}(?![\\d])`).test(plain),
  }));
}

export function upstreamSpanOf(entry, root) {
  const href = /\]\(([^)]+)\)/.exec(entry.fields['Oryginał'] ?? '')?.[1];
  if (!href) return '';
  const url = new URL(href);
  const [, start, end] = /^#L(\d+)-L(\d+)$/.exec(url.hash) ?? [];
  const file = decodeURIComponent(url.pathname.split('/blob/')[1].split('/').slice(1).join('/'));
  return readFileSync(resolve(root, file), 'utf8').split(/\r?\n/).slice(Number(start) - 1, Number(end)).join('\n');
}

export function loadAll(root) {
  return CHAPTERS.map(c => ({ ...c, ...parseChapter(readFileSync(resolve(root, c.path), 'utf8'), c.id) }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const chapters = loadAll(root);
  const entries = chapters.flatMap(c => c.entries);
  if (process.argv.includes('--numbers')) {
    const rows = entries.filter(e => e.fields.Status === 'verified').flatMap(e => numberInventory(e, upstreamSpanOf(e, root)));
    console.log(JSON.stringify(rows, null, 1));
  } else {
    const findings = [...entries.flatMap(e => lintEntry(e)), ...lintRecords(entries)];
    for (const f of findings) console.log(`${f.severity.toUpperCase().padEnd(7)} ${f.id.padEnd(6)} ${f.rule} (${f.field}): ${f.message}`);
    const errors = findings.filter(f => f.severity === 'error').length;
    console.log(`\n${entries.length} records, ${errors} errors, ${findings.length - errors} warnings. These checks cannot confirm that a claim is true.`);
    process.exitCode = errors ? 1 : 0;
  }
}
