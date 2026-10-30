// Search over the published (verified) Polish advice only. Unpublished records are never searched, counted as advice or shown.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { fileURLToPath } from 'node:url';
import { fold, published } from '../../reader.mjs';
import { isMain, loadAll } from './lint.mjs';

const SHOWN = ['Ocena dowodów', 'Koszt', 'W praktyce', 'Korzyść i dowody', 'Ograniczenia', 'Ocena redakcyjna', 'Źródła', 'Weryfikacja'];

// Crude stemming so that "hasło", "hasła" and "hasłem" meet: Polish inflection changes the ending.
const stem = token => (/\d/.test(token) ? token : token.slice(0, Math.max(3, token.length > 5 ? token.length - 2 : token.length - 1)));

export function queryTokens(query) {
  const tokens = fold(String(query)).split(/[^\p{L}\p{N}]+/u).filter(t => t.length >= 3 || (t.length >= 2 && /\d/.test(t)));
  if (!tokens.length) throw new Error('Podaj co najmniej jedno słowo kluczowe (minimum 3 litery).');
  return [...new Set(tokens)];
}

// Rank published entries: a word in the title counts most, then the action text, then any other field.
export function searchAdvice(chapters, query, { limit = 5 } = {}) {
  const tokens = queryTokens(query).map(stem);
  const rows = [];
  for (const chapter of chapters) {
    for (const entry of published(chapter.entries)) {
      const title = fold(entry.title);
      const action = fold(entry.fields['W praktyce']);
      const rest = fold(Object.entries(entry.fields).filter(([k]) => k !== 'W praktyce').map(([, v]) => v).join('\n'));
      let score = 0;
      const matched = [];
      for (const token of tokens) {
        const s = title.includes(token) ? 3 : action.includes(token) ? 2 : rest.includes(token) ? 1 : 0;
        if (s) { score += s; matched.push(token); }
      }
      if (score) rows.push({ entry, chapter, score, matched });
    }
  }
  rows.sort((a, b) => b.score - a.score || a.entry.number.localeCompare(b.entry.number, 'en', { numeric: true }));
  return rows.slice(0, limit);
}

export function coverage(chapters) {
  const counts = chapters.map(c => ({ id: c.id, published: published(c.entries).length }));
  return { chapters: counts.map(c => c.id), published: counts.reduce((n, c) => n + c.published, 0) };
}

export function formatResults(chapters, rows) {
  const cov = coverage(chapters);
  const out = [`Zakres: ${cov.published} zweryfikowanych porad z rozdziałów ${cov.chapters.join(', ')}. Pozostałe rozdziały książki nie są opublikowane.`];
  if (!rows.length) out.push('Brak wyników: w opublikowanych poradach nie ma pozycji pasującej do tych słów. Spróbuj innych słów kluczowych lub odpowiedz, że książka nie zawiera tego tematu.');
  rows.forEach(({ entry, chapter }, i) => {
    out.push('', `[${i + 1}] ${entry.number} ${entry.title}`, `    Odsyłacz: ${chapter.path}#${entry.id}`);
    for (const field of SHOWN) out.push(`    ${field}: ${entry.fields[field]}`);
  });
  return out.join('\n');
}

if (isMain(import.meta.url)) {
  const args = process.argv.slice(2);
  const flag = name => { const i = args.indexOf(name); if (i < 0) return null; const [, value] = args.splice(i, 2); return value; };
  const limit = Number(flag('--limit') ?? 5);
  const json = args.includes('--json') && args.splice(args.indexOf('--json'), 1);
  const chapters = loadAll(fileURLToPath(new URL('../../', import.meta.url)));
  try {
    const rows = searchAdvice(chapters, args.join(' '), { limit: Number.isInteger(limit) && limit > 0 ? limit : 5 });
    console.log(json
      ? JSON.stringify({ ...coverage(chapters), results: rows.map(r => ({ number: r.entry.number, title: r.entry.title, link: `${r.chapter.path}#${r.entry.id}`, score: r.score, fields: Object.fromEntries(SHOWN.map(f => [f, r.entry.fields[f]])) })) }, null, 1)
      : formatResults(chapters, rows));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
