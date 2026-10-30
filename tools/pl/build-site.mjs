// Builds the folder GitHub Pages publishes: the reader, the Polish chapters it loads and the two licence files, nothing else.
// The chapter list is CHAPTERS in reader.mjs, so there is no second registry. Every file is copied byte for byte and the result is checked.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHAPTERS } from '../../reader.mjs';
import { isMain } from './lint.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const FIXED_FILES = ['index.html', 'reader.mjs', 'LICENSE', 'LICENSE-CODE'];
export const siteFiles = () => [...FIXED_FILES, ...CHAPTERS.map(c => c.path)].sort();

const listFiles = (dir, base = dir) => readdirSync(dir, { withFileTypes: true })
  .flatMap(d => d.isDirectory() ? listFiles(join(dir, d.name), base) : [relative(base, join(dir, d.name)).split('\\').join('/')])
  .sort();

// Where a path really is, with symlinks resolved, also when its last parts do not exist yet.
function realPathOf(path) {
  const rest = [];
  let current = resolve(path);
  while (!existsSync(current)) {
    const parent = dirname(current);
    if (parent === current) break;
    rest.unshift(basename(current));
    current = parent;
  }
  return join(realpathSync(current), ...rest);
}

// Every file the site is built from must be a regular file inside the repository, not a symlink and not behind one: a link would publish its target.
export function sourceProblems(root = ROOT) {
  const problems = [];
  const realRoot = realpathSync(root);
  for (const path of siteFiles()) {
    const source = join(root, path);
    if (!existsSync(source)) { problems.push(`missing in the repository: ${path}`); continue; }
    if (!lstatSync(source).isFile()) problems.push(`not a regular file in the repository: ${path}`);
    else if (realpathSync(source) !== join(realRoot, path)) problems.push(`reached through a symlink: ${path}`);
  }
  return problems;
}

const ATTRIBUTE = /([a-z][a-z0-9:_-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;
const LOADING_ATTRIBUTES = new Set(['href', 'src', 'srcset', 'poster', 'action', 'data', 'formaction']);
const CSS_REFERENCE = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)|@import\s+(?:"([^"]*)"|'([^']*)')/gi;
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

// Problems with an already built folder, as a list of sentences; an empty list means the folder is exactly what may be published.
export function checkSite(out, { root = ROOT } = {}) {
  const problems = [...sourceProblems(root)];
  const expected = siteFiles();
  const found = listFiles(out);
  for (const path of expected) if (!found.includes(path)) problems.push(`missing: ${path}`);
  for (const path of found) if (!expected.includes(path)) problems.push(`not allowed on the site: ${path}`);
  for (const path of expected) {
    if (found.includes(path) && existsSync(join(root, path)) && !readFileSync(join(out, path)).equals(readFileSync(join(root, path)))) problems.push(`differs from the repository file: ${path}`);
  }
  if (found.includes('index.html')) {
    const html = readFileSync(join(out, 'index.html'), 'utf8');
    const local = (ref, where) => {
      const target = ref.trim().split(/[?#]/)[0].replace(/^\.\//, '');
      if (!ref.trim().startsWith('#') && !found.includes(target)) problems.push(`${where} reaches a file that is not on the site: ${ref}`);
    };
    for (const [, name, attributes] of html.matchAll(/<([a-z][a-z0-9-]*)\b([^>]*)>/gi)) {
      for (const [, attribute, double, single, bare] of attributes.matchAll(ATTRIBUTE)) {
        const key = attribute.toLowerCase();
        if (!LOADING_ATTRIBUTES.has(key)) continue;
        const value = double ?? single ?? bare ?? '';
        const refs = key === 'srcset' ? value.split(',').map(part => part.trim().split(/\s+/)[0]).filter(Boolean) : [value];
        for (const ref of refs) {
          if (!ref) continue;
          if (EXTERNAL.test(ref.trim())) {
            // Only an ordinary link to an https address may leave the site; nothing external is loaded.
            if (!(name.toLowerCase() === 'a' && key === 'href' && /^https:\/\//i.test(ref.trim()))) problems.push(`index.html <${name.toLowerCase()} ${key}> points outside the site: ${ref}`);
          } else if (ref.trim().startsWith('/')) problems.push(`index.html <${name.toLowerCase()} ${key}> uses an absolute path, which breaks under a project path: ${ref}`);
          else local(ref, `index.html <${name.toLowerCase()} ${key}>`);
        }
      }
    }
    for (const [, a, b, c, d, e] of html.matchAll(CSS_REFERENCE)) {
      const ref = (a ?? b ?? c ?? d ?? e ?? '').trim();
      if (!ref) continue;
      if (EXTERNAL.test(ref) || ref.startsWith('/')) problems.push(`index.html CSS points outside the site: ${ref}`);
      else local(ref, 'index.html CSS');
    }
  }
  if (found.includes('reader.mjs')) {
    const code = readFileSync(join(out, 'reader.mjs'), 'utf8');
    for (const match of code.matchAll(/\b(?:import|export)\b[^'"`;]*?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]|\bimport\s+['"]([^'"]+)['"]/g)) {
      problems.push(`reader.mjs imports a module, and the site holds only reader.mjs itself: ${match[1] ?? match[2] ?? match[3]}`);
    }
  }
  return problems;
}

// Refuses a target that is, or contains, the repository (after symlinks are resolved), or an existing folder with anything but files of an earlier build.
function prepareTarget(out, root) {
  const rel = relative(realPathOf(out), realpathSync(root));
  if (rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))) throw new Error(`refusing to build into ${out}: it is the repository or one of its parents`);
  if (existsSync(out)) {
    if (!statSync(out).isDirectory()) throw new Error(`refusing to build into ${out}: it is not a folder`);
    const allowed = new Set(siteFiles());
    const foreign = listFiles(out).filter(path => !allowed.has(path));
    if (foreign.length) throw new Error(`refusing to build into ${out}: it holds files that are not part of an earlier build, for example ${foreign[0]}`);
    rmSync(out, { recursive: true, force: true });
  }
  mkdirSync(out, { recursive: true });
}

export function buildSite(out, { root = ROOT } = {}) {
  const sources = sourceProblems(root);
  if (sources.length) throw new Error(`the repository files are not what may be published:\n- ${sources.join('\n- ')}`);
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
