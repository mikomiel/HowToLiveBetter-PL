// Mechanical check of a language editor's report: an edit that changes protected wording must be marked for re-verification,
// whatever the editor says. It compares numbers, links and the stems of words that carry meaning in evidence-based text.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fold } from '../../reader.mjs';
import { isMain } from './lint.mjs';
import { buildPacket } from './packet.mjs';
import { foldText, numberTokens } from './text.mjs';

// Stems and words, compared after the reader's own fold (lower case, diacritics removed), so "dorosłym" meets `dorosl`.
const PROTECTED = [
  'nie', 'bez', 'brak', 'zaden', 'zadn', 'nigdy', 'ani',
  'wszys', 'wszed', 'niekt', 'wiekszos', 'czesto', 'zwykle', 'zawsze', 'rzadko', 'kazd', 'kilk', 'wiele', 'mniej', 'wiecej', 'najwiecej', 'najmniej',
  'moze', 'mozn', 'musi', 'trzeba', 'powinn', 'warto', 'nalezy', 'wolno', 'mozliw',
  'powoduj', 'wiaze', 'wplyw', 'zwieksz', 'zmniejsz', 'zapobieg', 'prowadz', 'skraca', 'wydluz', 'poprawi', 'pogarsz', 'ogranicz', 'zwiazek', 'zwiazan',
  'wykaz', 'sugeruj', 'zalec', 'stwierdz', 'wedlug', 'wskaz', 'potwierdz', 'opisuj', 'badani', 'metaanaliz', 'przeglad',
  'tylko', 'jesli', 'o ile', 'chyba', 'dorosl', 'dzieci', 'niemowl', 'ciaz', 'polsc', 'unii', 'prawo', 'prawa', 'obowiaz', 'zakaz', 'dawk', 'godzin', 'minut', 'dni', 'tygodn', 'miesi', 'zdrow', 'choro', 'lek', 'ryzyk',
];
const EXACT = new Set(['lat', 'lata', 'rok', 'roku', 'ile']);
const stems = text => fold(text).replace(/\[[^\]]*\]\([^)]*\)/g, ' ').split(/[^\p{L}\p{N}]+/u).filter(Boolean)
  .map(w => (EXACT.has(w) ? w : PROTECTED.find(stem => w.startsWith(stem)))).filter(Boolean);
const tokens = text => ({
  numbers: numberTokens(String(text).replace(/\[[^\]]*\]\([^)]*\)/g, ' ')).map(t => t.raw.replace(/[ \u00a0\u202f]/g, '').replace(',', '.')).sort(),
  links: [...String(text).matchAll(/\]\(([^)]*)\)/g)].map(m => m[1]).sort(),
  stems: stems(text).sort(),
});
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// What differs between the original and the replacement, in the classes that must not change silently.
export function protectedChanges(original, replacement) {
  const a = tokens(original);
  const b = tokens(replacement);
  return ['numbers', 'links', 'stems'].filter(k => !same(a[k], b[k]));
}

// report: the JSON of pl-language-editor; packet: buildPacket(root, item, 'editor').
export function checkEdits(report, packet) {
  const failures = [];
  const forced = [];
  if (!report || report.item !== packet.item) failures.push(`the report is for item "${report?.item}", the packet is for ${packet.item}`);
  const text = new Map(Object.entries(packet.fields).concat([['title', packet.title]]));
  for (const [n, edit] of (Array.isArray(report?.edits) ? report.edits : []).entries()) {
    const where = `edit ${n + 1} (${edit?.field})`;
    const field = text.get(edit?.field);
    if (field === undefined) { failures.push(`${where}: unknown field`); continue; }
    if (!foldText(field).includes(foldText(edit.original ?? ''))) { failures.push(`${where}: "original" is not in that field`); continue; }
    const changed = protectedChanges(edit.original, edit.replacement ?? '');
    if (changed.length) {
      forced.push({ edit: n + 1, changed });
      if (edit.requires_reverification !== true) failures.push(`${where}: changes protected wording (${changed.join(', ')}) but is not marked requires_reverification`);
    }
  }
  return { ok: failures.length === 0, forced, failures };
}

if (isMain(import.meta.url)) {
  const [file] = process.argv.slice(2);
  const root = fileURLToPath(new URL('../../', import.meta.url));
  try {
    if (!file) throw new Error('Usage: node tools/pl/edits.mjs <editor-report.json>');
    const report = JSON.parse(readFileSync(resolve(file), 'utf8'));
    const result = checkEdits(report, buildPacket(root, report.item, 'editor'));
    console.log(JSON.stringify(result, null, 1));
    process.exitCode = result.ok ? 0 : 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
