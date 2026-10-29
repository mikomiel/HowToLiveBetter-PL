// Offline checks for the Polish chapters. They find drift and known defect classes; they cannot confirm that a claim is true.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHAPTERS, parseChapter } from '../../reader.mjs';

// Fields a reader sees as advice. Provenance fields (Źródła, Oryginał, Weryfikacja, Zmiany w adaptacji) may describe upstream.
export const READER_FIELDS = ['Koszt', 'W praktyce', 'Korzyść i dowody', 'Ocena dowodów', 'Ocena redakcyjna', 'Ograniczenia'];
// A Chinese rule here is an instruction to the reader; in the other fields it may legitimately state the population or limits of a source.
const ACTION_FIELDS = new Set(['Koszt', 'W praktyce']);

const CHINA = /chi[nń]sk|chi[nń]czy(?:k|c)|\bChin(?:y|ach|ami|om)?\b|Pekin|Szanghaj|WeChat|Alipay|Taobao|Weixin|Weibo|Douyin|Baidu|Alibaba|Tencent|Hongkong|Tajwan|\bjuan|\byuan|\bRMB\b|\bCNY\b/iu;
const SECONDARY_HOSTS = ['lexlege.pl', 'standardyprawa.pl', 'arslege.pl', 'poradnikprzedsiebiorcy.pl', 'infor.pl', 'gazetaprawna.pl', 'wikipedia.org', 'wikiwand.com'];

// Emergency and crisis numbers that were individually checked for Poland. Add one only with its source.
export const PHONE_ALLOWLIST = new Set(['112', '997', '998', '999', '116 123', '116 111']);
const PHONE_DIGITS = new Set([...PHONE_ALLOWLIST].map(n => n.replace(/\s/g, '')));
const PHONE_WORD = /telefon\w*|\btel\b\.?|numer\w*|infolini\w*|\blini[aię]\b|zadzwo\w*|dzwo\w*|połącz\w*/giu;
const PHONE_TOKEN = /(?<![\p{L}\d])(?:\d{3}(?:[   .-]\d{2,3}){1,2}|\d{3,6})(?![\p{L}\d])/gu;
const NOT_A_NUMBER_PLATE = /^\s*(?:zł|zl|pln|eur|euro|usd|gb|mb|kb|kg|mg|ml|cm|mm|km|%|proc|osób|osoby|razy|lat|dni|minut|min\b|godz|sekund|stopni|°|punkt|tys|mln|mld)/iu;
const BEFORE = 30;
const AFTER = 60;

export function phoneNumbers(text) {
  const words = [...text.matchAll(PHONE_WORD)].map(m => [m.index, m.index + m[0].length]);
  const found = new Set();
  for (const m of text.matchAll(PHONE_TOKEN)) {
    const digits = m[0].replace(/[^\d]/g, '');
    if (/^(?:19|20)\d{2}$/.test(digits) || NOT_A_NUMBER_PLATE.test(text.slice(m.index + m[0].length, m.index + m[0].length + 12))) continue;
    const near = words.some(([from, to]) => {
      const lo = m.index < from ? m.index : to;
      const hi = m.index < from ? from : m.index;
      const gap = hi - lo;
      if (m.index < from ? gap > BEFORE : gap > AFTER) return false;
      return !/[.!?]\s/.test(text.slice(lo, hi).replace(/\btel\./gi, 'tel'));
    });
    if (near) found.add(m[0].replace(/[   .-]+/g, ' '));
  }
  return [...found];
}
const isAllowedPhone = n => PHONE_DIGITS.has(n.replace(/[^\d]/g, ''));

// A statement of what part of the source was read; a presence heuristic only.
const READ_SCOPE = /(?<![\p{L}])(?:pełn|abstrakt|streszcz|fragment|wyciąg|ekstrakt|tekst|art\.|stron|poradnik|instrukcj|dokument|wytyczn|rozdzia|część)/iu;
// "Bez pełnego tekstu" says what was not read; it only counts together with a positive statement of what was.
const READ_SCOPE_NEGATED = /(?<![\p{L}])(?:nie|bez)\s+(?:\p{L}+\s+){0,3}(?:pełn|abstrakt|tekst)\p{L}*(?:\s+\p{L}+)?/giu;

const warsawToday = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Warsaw' });
const urls = text => [...text.matchAll(/https?:\/\/[^\s<>\])"']+/g)].map(m => m[0]);
const hostOf = url => { try { return new URL(url).hostname.toLowerCase().replace(/\.$/, '').replace(/^www\./, ''); } catch { return ''; } };

export function lintEntry(entry, { today = warsawToday() } = {}) {
  const out = [];
  const add = (rule, severity, field, message) => out.push({ id: entry.number, rule, severity, field, message });
  if (entry.fields.Status !== 'verified') return out;

  const leak = (field, text, severity) => {
    if (CHINA.test(text.normalize('NFC'))) add('cn-leak', severity, field, 'Reader-facing text mentions China or a Chinese rule. Describe a dropped upstream element in "Zmiany w adaptacji" instead.');
  };
  leak('title', entry.title ?? '', 'error');
  for (const field of READER_FIELDS) {
    const text = entry.fields[field] ?? '';
    leak(field, text, ACTION_FIELDS.has(field) ? 'error' : 'warning');
    for (const number of phoneNumbers(text)) {
      if (!isAllowedPhone(number)) add('phone-number', 'error', field, `Number "${number}" stands near a phone word and is not on the checked allowlist.`);
    }
  }
  const verification = entry.fields.Weryfikacja ?? '';
  if (!READ_SCOPE.test(verification.replace(READ_SCOPE_NEGATED, ' '))) add('read-scope', 'warning', 'Weryfikacja', 'Weryfikacja does not state what part of the source was read (full text, abstract, extract, page).');
  const date = /^(\d{4}-\d{2}-\d{2});/.exec(verification)?.[1];
  if (date && date > today) add('future-date', 'error', 'Weryfikacja', `Verification date ${date} is in the future.`);
  for (const url of urls(entry.fields['Źródła'] ?? '')) {
    const host = hostOf(url);
    if (SECONDARY_HOSTS.some(s => host === s || host.endsWith('.' + s))) add('secondary-source', 'error', 'Źródła', `${host} is secondary commentary, not an original study or official document.`);
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

const NUMBER = /(?<![\p{L}\d])(?:\d{1,2}:\d{2}|\d{1,3}(?:[   ]\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?)(?![\p{L}\d])/gu;

// The upstream span without its own heading, URLs and DOIs, with thousands separators removed.
export function cleanUpstream(span) {
  return span.split(/\r?\n/).slice(1).join('\n')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/(\d),(?=\d{3}(?!\d))/g, '$1')
    .replace(/(\d)[   ](?=\d{3}(?!\d))/g, '$1');
}

// Numbers in reader-facing fields, with whether the pinned Chinese original contains the same figure.
// A figure carried over from upstream is a lead, not evidence: a verifier must find it in a source passage.
// Chinese numerals are not matched.
export function numberInventory(entry, upstreamSpan) {
  const found = new Map();
  for (const field of READER_FIELDS) {
    const text = (entry.fields[field] ?? '').replace(/\[[^\]]*\]\([^)]*\)/g, ' ');
    for (const [token] of text.matchAll(NUMBER)) {
      const value = token.includes(':') ? token : token.replace(/[   ]/g, '').replace(',', '.');
      const record = found.get(value) ?? { value: token, fields: new Set() };
      record.fields.add(field);
      found.set(value, record);
    }
  }
  const upstream = cleanUpstream(upstreamSpan);
  return [...found.entries()].map(([value, r]) => ({
    id: entry.number, value: r.value, fields: [...r.fields],
    inUpstream: new RegExp(`(?<!\\d)(?<!\\d[.,])${value.replace('.', '[.,]')}(?!\\d)(?![.,]\\d)`).test(upstream),
  }));
}

// Reads only the pinned lines of an upstream file under book/. Anything else is an error, never an empty answer.
export function upstreamSpanOf(entry, root) {
  const href = /\]\(([^)]+)\)/.exec(entry.fields['Oryginał'] ?? '')?.[1];
  if (!href) throw new Error(`${entry.number}: no Oryginał link`);
  const url = new URL(href);
  const match = /^\/eternity4719\/HowToLiveBetter\/blob\/[0-9a-f]{40}\/(book\/[^/]+\.md)$/.exec(decodeURIComponent(url.pathname));
  if (url.hostname !== 'github.com' || !match) throw new Error(`${entry.number}: Oryginał must be a pinned github.com blob link to a file in book/`);
  const [, start, end] = /^#L(\d+)-L(\d+)$/.exec(url.hash) ?? [];
  if (!start || Number(end) < Number(start)) throw new Error(`${entry.number}: Oryginał has no valid #Lstart-Lend range`);
  const span = readFileSync(resolve(root, match[1]), 'utf8').split(/\r?\n/).slice(Number(start) - 1, Number(end)).join('\n');
  if (!span.trim()) throw new Error(`${entry.number}: the pinned range is empty`);
  return span;
}

export function loadAll(root) {
  return CHAPTERS.map(c => ({ ...c, ...parseChapter(readFileSync(resolve(root, c.path), 'utf8'), c.id) }));
}

// True only when this file is the program being run, also through a symlinked path; importing it never throws.
export const isMain = (url, argv1 = process.argv[1]) => {
  try { return Boolean(argv1) && realpathSync(argv1) === fileURLToPath(url); } catch { return false; }
};

if (isMain(import.meta.url)) {
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
