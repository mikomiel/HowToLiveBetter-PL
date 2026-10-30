// Text helpers shared by the Polish tools: folding for comparison, number tokens and sentence splitting.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.

// Fold typography that a reader and a model cannot tell apart: space variants, dashes, quotes, ellipsis, case.
export const foldText = s => String(s).normalize('NFC')
  .replace(/[\u00a0\u202f\u2002-\u200a]/g, ' ')
  .replace(/[\u2010-\u2015\u2212]/g, '-')
  .replace(/[‘’‚‛′]/g, "'")
  .replace(/[“”„‟″«»]/g, '"')
  .replace(/\u2026/g, '...')
  .replace(/\s+/g, ' ').trim().toLowerCase();

// A figure as written: 14:00, 1 234,5, 10,189, 0,65, 30.7. Letters or digits glued to it make it part of a word (2FA, NG202).
export const NUMBER = /(?<![\p{L}\d])(?:\d{1,2}:\d{2}|\d+(?:[ \u00a0\u202f]\d{3})*(?:[.,]\d+)*)(?![\p{L}\d])/gu;

export const numberTokens = text => [...String(text).matchAll(NUMBER)].map(m => ({ raw: m[0], index: m.index }));

// Every way a written figure can be read. "10,189" is 10189 or 10.189; "92 128" is 92128 or the two cells 92 and 128.
export function numberForms(raw) {
  const t = String(raw).trim();
  if (/^\d{1,2}:\d{2}$/.test(t)) return new Set([t]);
  const forms = new Set();
  const add = s => {
    if (/^\d{1,3}(,\d{3})+$/.test(s)) { forms.add(s.replaceAll(',', '')); forms.add(s.replaceAll(',', '.')); }
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) { forms.add(s.replaceAll('.', '')); forms.add(s); }
    else forms.add(s.replace(',', '.'));
  };
  const groups = t.split(/[ \u00a0\u202f]+/);
  add(groups.join(''));
  if (groups.length > 1) groups.forEach(add);
  return forms;
}
export const sameNumber = (a, b) => [...numberForms(a)].some(f => numberForms(b).has(f));

// Sentences of one field, so a reviewer can answer for each of them. Abbreviations and decimals do not end a sentence.
const ABBREVIATION = /(?:^|[\s(])(?:np|tj|tzn|nr|ok|godz|ul|art|ust|pkt|poz|tel|tys|mln|mld|zł|itd|itp|prof|dr|mgr|inż|m\.in|zob|por|tzw|ww|wg|ew|św|ks|min|sek|proc|szt|wyd|red|tab|rys|al|pl)\.$|\d\s?r\.$/iu;
export function splitSentences(text) {
  const out = [];
  let start = 0;
  for (const m of String(text).matchAll(/([.!?\u2026]+)(["”)\]]*)\s+(?=[\p{Lu}\d„"(\[])/gu)) {
    const stop = m.index + m[1].length;
    if (m[1] === '.' && ABBREVIATION.test(text.slice(start, stop))) continue;
    out.push(text.slice(start, stop + m[2].length).trim());
    start = m.index + m[0].length;
  }
  const rest = String(text).slice(start).trim();
  if (rest) out.push(rest);
  return out;
}
