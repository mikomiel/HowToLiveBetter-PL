// Builds the folder GitHub Pages publishes: the reader, the Polish chapters it loads and the two licence files, nothing else.
// The chapter list is CHAPTERS in reader.mjs, so there is no second registry. Every file is copied byte for byte and the result is checked.
// The static checks cover the listed patterns only; the browser test (tests/browser/site.spec.mjs) is what shows the built page makes no outside request.
// Copyright (c) 2026 eternity4719. MIT; see LICENSE-CODE.
import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHAPTERS } from '../../reader.mjs';
import { isMain } from './lint.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const FIXED_FILES = ['index.html', 'reader.mjs', 'LICENSE', 'LICENSE-CODE'];
const CHAPTER_PATH = /^book\/pl\/\d\d-[a-z0-9-]+\.md$/;
// Plain relative paths only: no `..`, no leading slash, no empty or dot-only part.
const PLAIN_PATH = /^[A-Za-z0-9][A-Za-z0-9._-]*(?:\/[A-Za-z0-9][A-Za-z0-9._-]*)*$/;
export const siteFiles = () => [...FIXED_FILES, ...CHAPTERS.map(c => c.path)].sort();

const toPosix = path => path.split('\\').join('/');
const listEntries = (dir, base = dir) => readdirSync(dir, { withFileTypes: true }).flatMap(d => {
  const path = toPosix(relative(base, join(dir, d.name)));
  return d.isDirectory() ? [{ path, directory: true }, ...listEntries(join(dir, d.name), base)] : [{ path, directory: false }];
});
const listFiles = dir => listEntries(dir).filter(e => !e.directory).map(e => e.path).sort();
// The folders a complete build holds, for example book and book/pl.
const siteFolders = () => new Set(siteFiles().flatMap(path => { const parts = path.split('/'); return parts.slice(0, -1).map((_, i) => parts.slice(0, i + 1).join('/')); }));

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

// Every file the site is built from must be a plain, expected path and a regular file inside the repository, not a symlink and not behind one: a link would publish its target.
export function sourceProblems(root = ROOT) {
  const problems = [];
  const realRoot = realpathSync(root);
  for (const path of siteFiles()) {
    if (!PLAIN_PATH.test(path)) { problems.push(`not a plain relative path: ${path}`); continue; }
    if (!FIXED_FILES.includes(path) && !CHAPTER_PATH.test(path)) { problems.push(`CHAPTERS lists a path that is not a Polish chapter file: ${path}`); continue; }
    const source = join(root, path);
    if (!existsSync(source)) { problems.push(`missing in the repository: ${path}`); continue; }
    const stat = lstatSync(source);
    if (stat.isSymbolicLink()) problems.push(`a symlink in the repository: ${path}`);
    else if (!stat.isFile()) problems.push(`not a regular file in the repository: ${path}`);
    else if (realpathSync(source) !== join(realRoot, path)) problems.push(`reached through a symlink: ${path}`);
  }
  return problems;
}

const codePoint = number => (number > 0x10ffff ? '\ufffd' : String.fromCodePoint(number));
const decodeEntities = text => text
  .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => codePoint(parseInt(hex, 16)))
  .replace(/&#(\d+);?/g, (_, dec) => codePoint(Number(dec)))
  .replace(/&(colon|sol|lt|gt|quot|apos|amp|tab|newline);/gi, (_, name) => ({ colon: ':', sol: '/', lt: '<', gt: '>', quot: '"', apos: "'", amp: '&', tab: '\t', newline: '\n' })[name.toLowerCase()]);
// Tags are read quote-aware, so a `>` inside an attribute value does not end the tag early.
const TAG = /<([a-z][a-z0-9-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;
const ATTRIBUTE = /([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;
const REFERENCE_ATTRIBUTES = new Set(['href', 'src', 'srcset', 'imagesrcset', 'poster', 'action', 'formaction', 'data', 'background', 'longdesc', 'ping', 'xlink:href', 'manifest', 'cite', 'usemap', 'codebase', 'archive', 'profile']);
const FORBIDDEN_TAGS = new Set(['base', 'iframe', 'frame', 'frameset', 'embed', 'object', 'applet']);
const CSS_REFERENCE = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)|@import\s+(?:"([^"]*)"|'([^']*)')|image-set\(\s*(?:"([^"]*)"|'([^']*)')/gi;
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

function pageProblems(html, found) {
  const problems = [];
  const local = (ref, where) => {
    const target = ref.split(/[?#]/)[0].replace(/^\.\//, '');
    if (!ref.startsWith('#') && !found.includes(target)) problems.push(`${where} reaches a file that is not on the site: ${ref}`);
  };
  for (const [, rawName, attributes] of html.matchAll(TAG)) {
    const name = rawName.toLowerCase();
    if (FORBIDDEN_TAGS.has(name)) problems.push(`index.html uses <${name}>, which this site does not need`);
    const attrs = [...attributes.matchAll(ATTRIBUTE)].map(([, attribute, double, single, bare]) => [attribute.toLowerCase(), decodeEntities(double ?? single ?? bare ?? '').trim()]);
    if (name === 'meta' && attrs.some(([key, value]) => key === 'http-equiv' && /refresh/i.test(value))) problems.push('index.html redirects with <meta http-equiv="refresh">');
    for (const [key, value] of attrs) {
      if (/^on/.test(key)) problems.push(`index.html <${name}> has an event handler attribute: ${key}`);
      if (key === 'srcdoc') problems.push(`index.html <${name}> embeds a document with srcdoc`);
      if (!REFERENCE_ATTRIBUTES.has(key)) continue;
      const refs = key === 'srcset' || key === 'imagesrcset' ? value.split(',').map(part => part.trim().split(/\s+/)[0]).filter(Boolean) : [value];
      for (const ref of refs) {
        if (!ref) continue;
        if (EXTERNAL.test(ref)) {
          // Only an ordinary link to an https address may leave the site; nothing external is loaded.
          if (!(name === 'a' && key === 'href' && /^https:\/\//i.test(ref))) problems.push(`index.html <${name} ${key}> points outside the site: ${ref}`);
        } else if (ref.startsWith('/')) problems.push(`index.html <${name} ${key}> uses an absolute path, which breaks under a project path: ${ref}`);
        else local(ref, `index.html <${name} ${key}>`);
      }
    }
  }
  for (const [, body] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)) if (body.trim()) problems.push('index.html has an inline script');
  const css = decodeEntities(html);
  for (const match of css.matchAll(CSS_REFERENCE)) {
    const ref = (match.slice(1).find(part => part !== undefined) ?? '').trim();
    if (!ref) continue;
    if (EXTERNAL.test(ref) || ref.startsWith('/')) problems.push(`index.html CSS points outside the site: ${ref}`);
    else local(ref, 'index.html CSS');
  }
  if (/\\[0-9a-f]/i.test(css.replace(/<script[\s\S]*?<\/script>/gi, ''))) problems.push('index.html has a CSS escape sequence, which this check cannot follow');
  return problems;
}

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
  if (found.includes('index.html')) problems.push(...pageProblems(readFileSync(join(out, 'index.html'), 'utf8'), found));
  if (found.includes('reader.mjs')) {
    const code = readFileSync(join(out, 'reader.mjs'), 'utf8');
    if (/\bimport\b/.test(code) || /\bexport\b[^;'"`]*?\bfrom\b/.test(code)) problems.push('reader.mjs uses import or export-from, and the site holds only reader.mjs itself');
    if (/\b(?:new\s+(?:Shared)?Worker|importScripts|serviceWorker)\b/.test(code)) problems.push('reader.mjs starts a worker or a service worker, which loads code the site does not hold');
  }
  return problems;
}

// Refuses a target that is, or contains, the repository (after symlinks are resolved), and an existing folder that is not empty or a complete earlier build.
function prepareTarget(out, root) {
  const rel = relative(realPathOf(out), realpathSync(root));
  const repositoryIsOutside = rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel);
  if (!repositoryIsOutside) throw new Error(`refusing to build into ${out}: it is the repository or one of its parents`);
  if (existsSync(out)) {
    if (!statSync(out).isDirectory()) throw new Error(`refusing to build into ${out}: it is not a folder`);
    const entries = listEntries(out);
    if (entries.length) {
      const files = siteFiles();
      const folders = siteFolders();
      const foreign = entries.filter(e => e.directory ? !folders.has(e.path) : !files.includes(e.path));
      if (foreign.length) throw new Error(`refusing to build into ${out}: it holds something that is not part of an earlier build, for example ${foreign[0].path}`);
      const absent = files.filter(path => !entries.some(e => !e.directory && e.path === path));
      if (absent.length) throw new Error(`refusing to build into ${out}: it is not empty and is not a complete earlier build (${absent[0]} is missing)`);
    }
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
    const destination = resolve(target, path);
    // Redundant with the path checks in sourceProblems; kept so that no future change can write outside the output folder.
    if (!destination.startsWith(target + sep)) throw new Error(`refusing to write outside the output folder: ${path}`);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(join(root, path), destination);
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
