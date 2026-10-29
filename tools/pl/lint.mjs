// Offline checks for the Polish chapters. They find drift and known defect classes; they cannot confirm that a claim is true.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHAPTERS, parseChapter } from '../../reader.mjs';
import { NUMBER } from './text.mjs';

// Fields a reader sees as advice. Provenance fields (Źródła, Oryginał, Weryfikacja, Zmiany w adaptacji) may describe upstream.
export const READER_FIELDS = ['Koszt', 'W praktyce', 'Korzyść i dowody', 'Ocena dowodów', 'Ocena redakcyjna', 'Ograniczenia'];
// A Chinese rule here is an instruction to the reader; in the other fields it may legitimately state the population or limits of a source.
const ACTION_FIELDS = new Set(['Koszt', 'W praktyce']);

const CHINA = /chi[nń]sk|chi[nń]czy(?:k|c)|\bChin(?:y|ach|ami|om)?\b|Pekin|Szanghaj|WeChat|Alipay|Taobao|Weixin|Weibo|Douyin|Baidu|Alibaba|Tencent|Hong ?kong|Tajwan|Makau|Macau|Beijing|Shanghai|Shenzhen|Guangzhou|ChRL|Union ?Pay|renminbi|TikTok|Huawei|ByteDance|Meituan|Pinduoduo|hukou|Xi Jinping|Państw\w* Środka|\bjuan|\byuan|\bRMB\b|\bCNY\b/iu;
const SECONDARY_HOSTS = ['lexlege.pl', 'standardyprawa.pl', 'arslege.pl', 'poradnikprzedsiebiorcy.pl', 'infor.pl', 'gazetaprawna.pl', 'wikipedia.org', 'wikiwand.com'];

// Emergency and crisis numbers that were individually checked for Poland. Add one only with its source.
export const PHONE_ALLOWLIST = new Set(['112', '997', '998', '999', '116 123', '116 111']);
const PHONE_DIGITS = new Set([...PHONE_ALLOWLIST].map(n => n.replace(/\s/g, '')));
const PHONE_WORD = /telefon\w*|(?<![\p{L}])tel\b\.?|numer\w*|infolini\w*|(?<![\p{L}])lini[aięi](?![\p{L}])|zadzwo\w*|dzwo\w*|połącz\w*|kontakt\w*|zgłoś\w*/giu;
const SEP = '[ \\u00a0\\u202f\\u2009.\\u2010-\\u2015-]';
// An optional +48 or 0048, an optional (22) area code, then grouped digits (800 123 456, 22 123-45-67) or a compact run of 3 to 12 digits.
const PHONE_TOKEN = new RegExp(`(?<![\\p{L}\\d.,/])(?:(?:\\+|00)?48${SEP}?)?(?:\\(\\d{2,3}\\)${SEP}?)?(?:\\d{2,3}(?:${SEP}\\d{2,3}){1,3}|\\d{3,12})(?![\\p{L}\\d])(?![.,]\\d)(?!/\\d)`, 'gu');
const UNIT_AFTER = /^\s*(?:(?:zł|zl|pln|eur|euro|usd|gb|mb|kb|kg|mg|ml|cm|mm|km|hz|khz|kcal|mmhg|ng|µg)(?![\p{L}])|%|°|(?:proc|osob|osób|raz|lat|dni|minut|min|godz|sekund|stopni|punkt|tys|mln|mld|krok|uderze|dzieci|sztuk|miesi|tygod)\p{L}*)/iu;
const ABBREVIATION_DOT = /\b(?:np|tj|tzn|nr|ok|godz|ul|tel|art|ust|pkt|poz|tys|mln|mld|zł)\./gi;
const BEFORE = 30;
const AFTER = 60;

export function phoneNumbers(text) {
  const words = [...text.matchAll(PHONE_WORD)].map(m => [m.index, m.index + m[0].length]);
  const found = new Set();
  for (const m of text.matchAll(PHONE_TOKEN)) {
    const digits = m[0].replace(/[^\d]/g, '');
    if (/^(?:19|20)\d{2}$/.test(digits) || UNIT_AFTER.test(text.slice(m.index + m[0].length, m.index + m[0].length + 14))) continue;
    const near = words.some(([from, to]) => {
      const lo = m.index < from ? m.index : to;
      const hi = m.index < from ? from : m.index;
      if (hi - lo > (m.index < from ? BEFORE : AFTER)) return false;
      return !/[.!?]\s/.test(text.slice(lo, hi).replace(ABBREVIATION_DOT, m2 => m2.slice(0, -1)));
    });
    if (near) found.add(m[0].trim().replace(/[ \u00a0\u202f\u2009.\u2010-\u2015-]+/g, ' '));
  }
  return [...found];
}
const isAllowedPhone = n => PHONE_DIGITS.has(n.replace(/[^\d]/g, '').replace(/^(?:00)?48(?=\d{3,})/, ''));

// A statement of what part of the source was read; a presence heuristic only.
const READ_SCOPE = /(?<![\p{L}])(?:pełn|abstrakt|streszcz|fragment|wyciąg|ekstrakt|tekst|art\.|stron|poradnik|instrukcj|dokument|wytyczn|rozdzia|część)/iu;
// "Bez pełnego tekstu" says what was not read; it only counts together with a positive statement of what was.
const READ_SCOPE_NEGATED = /(?<![\p{L}])(?:nie|bez|brak\p{L}*|niedostęp\p{L}*)\s+(?:\p{L}+\s+){0,4}(?:pełn|abstrakt|tekst|dokument|poradnik|stron|artyku)\p{L}*(?:\s+\p{L}+)?/giu;

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


// The upstream span without its own heading, URLs and DOIs. Thousands separators are ambiguous in a list such as "110,120,119",
// so the text is returned three times (as written, with separators removed, and read as a list) and a figure matches in any of them.
export function cleanUpstream(span) {
  const plain = span.split(/\r?\n/).slice(1).join('\n').replace(/https?:\/\/[\x21-\x7e]+/g, ' ');
  const merged = plain
    .replace(/(?<![\d,])\d{1,3}(?:,\d{3})+(?![\d,])/g, m => m.replaceAll(',', ''))
    .replace(/(?<![\d])\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?![\d])/g, m => m.replace(/[ \u00a0\u202f]/g, ''));
  const listed = plain.replace(/(?<=\d),(?=\d)/g, ' ');
  return plain + '\n' + merged + '\n' + listed;
}

// Numbers in reader-facing fields, with whether the pinned Chinese original contains the same figure.
// A figure carried over from upstream is a lead, not evidence: a verifier must find it in a source passage.
// Chinese numerals are not matched.
export function numberInventory(entry, upstreamSpan) {
  const found = new Map();
  for (const field of READER_FIELDS) {
    const text = (entry.fields[field] ?? '').replace(/\[[^\]]*\]\([^)]*\)/g, ' ');
    for (const [token] of text.matchAll(NUMBER)) {
      const value = token.includes(':') ? token : token.replace(/[ \u00a0\u202f]/g, '').replace(',', '.');
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
  const links = [...(entry.fields['Oryginał'] ?? '').matchAll(/\]\(([^)]+)\)/g)];
  if (links.length !== 1) throw new Error(`${entry.number}: Oryginał must hold exactly one link (found ${links.length}) or no Oryginał link`);
  const href = links[0][1];
  let url;
  try { url = new URL(href); } catch { throw new Error(`${entry.number}: Oryginał must be a pinned github.com blob link to a file in book/`); }
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
