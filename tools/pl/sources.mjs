// Which sources an item cites, which ones only its upstream original names (leads), and how item numbers are written.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { upstreamSpanOf } from './lint.mjs';

export function doiFromInput(input) {
  let s = String(input).trim().replace(/^(?:https?:\/\/(?:dx\.|www\.)?doi\.org\/|doi:\s*)/i, '').replace(/[?#].*$/, '');
  try { s = decodeURIComponent(s); } catch { return null; }
  if (!/^10\.\d{4,9}\/\S+$/.test(s)) return null;
  s = s.replace(/[.,;>]+$/, '');
  const count = ch => s.split(ch).length - 1;
  while (s.endsWith(')') && count('(') < count(')')) s = s.slice(0, -1);
  return s.toLowerCase();
}

// "3.26" and "03.26" are the same item; the canonical form pads the chapter, as the anchors and notices in the book do.
export function normaliseItem(value) {
  const m = /^\s*(\d{1,2})\.(\d{1,3})\s*$/.exec(String(value));
  if (!m) throw new Error(`"${value}" is not an item number. Write it as 14.2 or 03.26.`);
  return `${m[1].padStart(2, '0')}.${Number(m[2])}`;
}

// Markdown link targets, read with balanced parentheses so a link to a page whose name contains one stays whole.
function linkTargets(text) {
  const targets = [];
  const spans = [];
  let from = 0;
  for (let at = text.indexOf('](', from); at !== -1; at = text.indexOf('](', from)) {
    let depth = 1;
    let i = at + 2;
    for (; i < text.length && depth > 0; i++) depth += text[i] === '(' ? 1 : text[i] === ')' ? -1 : 0;
    if (depth === 0) { targets.push(text.slice(at + 2, i - 1).trim()); spans.push([at, i]); }
    from = at + 2;
  }
  let rest = text;
  for (const [a, b] of spans.reverse()) rest = rest.slice(0, a) + ' ' + rest.slice(b);
  return { targets, rest };
}

const trimUrl = u => { let s = u.replace(/[.,;:]+$/, ''); while (s.endsWith(')') && s.split('(').length < s.split(')').length) s = s.slice(0, -1); return s; };

// The inputs fetch.mjs should retrieve for one item: https links in any form and plain DOIs, one entry per source.
export function citedInputs(entry) {
  const text = entry.fields['Źródła'] ?? '';
  const { targets, rest } = linkTargets(text);
  const candidates = [
    ...targets.filter(t => /^https:\/\//i.test(t)),
    ...[...rest.matchAll(/https:\/\/[^\s<>\]"']+/g)].map(m => trimUrl(m[0])),
    ...[...rest.replace(/https:\/\/[^\s<>\]"']+/g, ' ').matchAll(/\b10\.\d{4,9}\/[^\s<>"'\]]+/g)].map(m => m[0]),
  ];
  const seen = new Set();
  const inputs = [];
  for (const c of candidates) {
    const doi = doiFromInput(c);
    const key = doi ? 'doi:' + doi : c;
    if (seen.has(key)) continue;
    seen.add(key);
    inputs.push(doi ?? c);
  }
  return inputs;
}

// DOIs that only the Chinese original names. They are leads to look for sources, not evidence for a Polish claim.
export function leadInputs(entry, root) {
  const cited = new Set(citedInputs(entry));
  const span = upstreamSpanOf(entry, root);
  const leads = [];
  for (const m of span.matchAll(/https?:\/\/(?:dx\.)?doi\.org\/(10\.\d{4,9}\/[\x21-\x7e]+)/gi)) {
    const doi = doiFromInput(m[1].replace(/[>)）]+$/, ''));
    if (doi && !cited.has(doi) && !leads.includes(doi)) leads.push(doi);
  }
  return leads;
}
