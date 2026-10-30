// Builds the folder GitHub Pages publishes: the reader, the Polish chapters it loads and the two licence files, nothing else.
// The chapter list is CHAPTERS in reader.mjs, so there is no second registry. Every file is copied byte for byte and the result is checked.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHAPTERS } from '../../reader.mjs';
import { isMain } from './lint.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const FIXED_FILES = ['index.html', 'reader.mjs', 'LICENSE', 'LICENSE-CODE'];
export const siteFiles = () => [...FIXED_FILES, ...CHAPTERS.map(c => c.path)].sort();

const listFiles = (dir, base = dir) => readdirSync(dir, { withFileTypes: true })
  .flatMap(d => d.isDirectory() ? listFiles(join(dir, d.name), base) : [relative(base, join(dir, d.name)).split('\\').join('/')])
  .sort();

// Problems with an already built folder, as a list of sentences; an empty list means the folder is exactly what may be published.
export function checkSite(out, { root = ROOT } = {}) {
  const problems = [];
  const expected = siteFiles();
  const found = listFiles(out);
  for (const path of expected) if (!found.includes(path)) problems.push(`missing: ${path}`);
  for (const path of found) if (!expected.includes(path)) problems.push(`not allowed on the site: ${path}`);
  for (const path of expected) {
    if (found.includes(path) && !readFileSync(join(out, path)).equals(readFileSync(join(root, path)))) problems.push(`differs from the repository file: ${path}`);
  }
  if (found.includes('index.html')) {
    const html = readFileSync(join(out, 'index.html'), 'utf8');
    for (const [, ref] of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref) || ref.startsWith('#')) continue;
      const target = ref.split(/[?#]/)[0];
      if (!target || target.startsWith('/') || !found.includes(target)) problems.push(`index.html links to a file that is not on the site: ${ref}`);
    }
  }
  if (found.includes('reader.mjs')) {
    const code = readFileSync(join(out, 'reader.mjs'), 'utf8');
    for (const match of code.matchAll(/\b(?:import|export)\b[^'"`;]*?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)|\bimport\s+['"]([^'"]+)['"]/g)) {
      const spec = match[1] ?? match[2] ?? match[3];
      if (spec && !/^(?:node:|https:)/.test(spec)) problems.push(`reader.mjs imports a module that is not on the site: ${spec}`);
    }
  }
  return problems;
}

// Refuses a target that is the repository, one of its parents, or a non-empty folder that is not an earlier build.
function prepareTarget(out, root) {
  const rel = relative(out, root);
  if (rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))) throw new Error(`refusing to build into ${out}: it is the repository or one of its parents`);
  if (existsSync(out)) {
    const present = readdirSync(out);
    if (present.length && !present.includes('index.html')) throw new Error(`refusing to build into ${out}: it is not empty and does not look like an earlier build`);
    rmSync(out, { recursive: true, force: true });
  }
  mkdirSync(out, { recursive: true });
}

export function buildSite(out, { root = ROOT } = {}) {
  const target = resolve(out);
  prepareTarget(target, root);
  for (const path of siteFiles()) {
    mkdirSync(dirname(join(target, path)), { recursive: true });
    copyFileSync(join(root, path), join(target, path));
  }
  const problems = checkSite(target, { root });
  if (problems.length) throw new Error(`the site folder is not what may be published:\n- ${problems.join('\n- ')}`);
  return listFiles(target).map(path => ({ path, bytes: readFileSync(join(target, path)).length }));
}

if (isMain(import.meta.url)) {
  try {
    const out = process.argv[2];
    if (!out) throw new Error('Usage: node tools/pl/build-site.mjs <output folder>');
    const files = buildSite(out);
    for (const { path, bytes } of files) console.log(`${String(bytes).padStart(8)}  ${path}`);
    console.log(`${files.length} files in ${out}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
