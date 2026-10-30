import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHAPTERS } from '../reader.mjs';
import { FIXED_FILES, buildSite, checkSite, siteFiles, sourceProblems } from '../tools/pl/build-site.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(resolve(root, path), 'utf8');
const scratch = () => mkdtempSync(join(tmpdir(), 'site-test-'));
const put = (dir, path, text = 'x') => { mkdirSync(dirname(join(dir, path)), { recursive: true }); writeFileSync(join(dir, path), text); };
// A small stand-in for the repository, so a failing guard can never touch the real checkout.
const fakeRoot = dir => {
  for (const path of siteFiles()) { mkdirSync(dirname(join(dir, path)), { recursive: true }); copyFileSync(resolve(root, path), join(dir, path)); }
  return dir;
};
const withScratch = fn => { const tmp = scratch(); try { return fn(tmp); } finally { rmSync(tmp, { recursive: true, force: true }); } };

test('the published folder holds the reader, the chapters of CHAPTERS and the two licences, and nothing else', () => withScratch(tmp => {
  const files = buildSite(join(tmp, 'site'));
  assert.deepEqual(files.map(f => f.path).sort(), [...FIXED_FILES, ...CHAPTERS.map(c => c.path)].sort());
  assert.deepEqual(siteFiles(), files.map(f => f.path));
  assert.deepEqual(FIXED_FILES.slice().sort(), ['LICENSE', 'LICENSE-CODE', 'index.html', 'reader.mjs']);
  for (const { path } of files) assert.ok(readFileSync(join(tmp, 'site', path)).equals(readFileSync(resolve(root, path))), `${path} is byte for byte the repository file`);
  for (const forbidden of [/^ads\//, /^docs\//, /^audit\//, /^tools\//, /^tests\//, /^skills\//, /^\.claude\//, /^\.github\//, /selfcheck/, /og\.png/, /updates\.json/, /robots\.txt/, /sitemap/, /^README\.md$/, /^AGENTS\.md$/, /\p{Script=Han}/u, /^book\/\d\d-/, /^book\/README/]) {
    assert.ok(files.every(f => !forbidden.test(f.path)), `${forbidden} must not be published`);
  }
  assert.deepEqual(sourceProblems(root), [], 'no site file of this repository is a symlink or behind one');
}));

test('the checker names a missing, an extra, a hidden and a changed file', () => withScratch(tmp => {
  const out = join(tmp, 'site');
  buildSite(out);
  assert.deepEqual(checkSite(out), []);
  put(out, 'ads/wechat-reward.png');
  assert.ok(checkSite(out).some(p => /not allowed on the site: ads\/wechat-reward\.png/.test(p)));
  rmSync(join(out, 'ads'), { recursive: true });
  put(out, '.nojekyll', '');
  assert.ok(checkSite(out).some(p => /not allowed on the site: \.nojekyll/.test(p)), 'a dotfile counts too');
  rmSync(join(out, '.nojekyll'));
  rmSync(join(out, CHAPTERS[0].path));
  assert.ok(checkSite(out).some(p => p === `missing: ${CHAPTERS[0].path}`));
  copyFileSync(resolve(root, CHAPTERS[0].path), join(out, CHAPTERS[0].path));
  writeFileSync(join(out, 'LICENSE'), 'changed');
  assert.ok(checkSite(out).some(p => /differs from the repository file: LICENSE$/.test(p)));
  copyFileSync(resolve(root, 'LICENSE'), join(out, 'LICENSE'));
  assert.deepEqual(checkSite(out), []);
}));

test('the checker finds every way index.html can reach outside the site, in any quoting and case', () => withScratch(tmp => {
  const out = join(tmp, 'site');
  buildSite(out);
  const html = read('index.html');
  const check = extra => { writeFileSync(join(out, 'index.html'), html.replace('</body>', `${extra}</body>`)); return checkSite(out); };
  const flagged = (extra, needle) => { const problems = check(extra); assert.ok(problems.some(p => p.includes(needle)), `${extra}\n${problems.join('\n')}`); };

  flagged('<a href="README.md">README</a>', 'README.md');
  flagged("<img src='ads/mcyyy.webp'>", 'ads/mcyyy.webp');
  flagged('<img src=ads/mcyyy.webp>', 'ads/mcyyy.webp');
  flagged('<IMG SRC="ads/mcyyy.webp">', 'ads/mcyyy.webp');
  flagged('<a href = "docs/README.md">x</a>', 'docs/README.md');
  flagged('<img srcset="ads/a.webp 1x, ads/b.webp 2x">', 'ads/a.webp');
  flagged('<video poster="og.png"></video>', 'og.png');
  flagged('<object data="selfcheck.html"></object>', 'selfcheck.html');
  flagged('<img src="/ads/mcyyy.webp">', 'absolute path');
  flagged('<a href="../outside.html">x</a>', '../outside.html');
  flagged('<script src="https://cdn.example.org/a.js"></script>', 'https://cdn.example.org/a.js');
  flagged('<link rel="stylesheet" href="https://fonts.example.org/x.css">', 'https://fonts.example.org/x.css');
  flagged('<img src="https://example.org/pixel.gif">', 'https://example.org/pixel.gif');
  flagged('<form action="https://example.org/post"></form>', 'https://example.org/post');
  flagged('<a href="http://example.org/">x</a>', 'http://example.org/');
  flagged('<a href="javascript:alert(1)">x</a>', 'javascript:alert(1)');
  flagged('<style>body { background: url(ads/mcyyy.webp) }</style>', 'ads/mcyyy.webp');
  flagged("<style>@import 'https://fonts.example.org/x.css';</style>", 'https://fonts.example.org/x.css');
  flagged('<div style="background:url(\'https://example.org/x.png\')"></div>', 'https://example.org/x.png');

  const fine = check('<a href="https://example.org/">ok</a><a href="#porady">ok</a><a href="./LICENSE">ok</a><a HREF=\'LICENSE-CODE\'>ok</a><img src="book/pl/03-nie-marnuj-energii.md" alt="">');
  assert.ok(!fine.some(p => /outside|not on the site|absolute/.test(p)), fine.join('\n'));
}));

test('the checker refuses any module import in reader.mjs, because the site holds no other module', () => withScratch(tmp => {
  const out = join(tmp, 'site');
  buildSite(out);
  const reader = read('reader.mjs');
  for (const code of ["import { x } from './helper.mjs';", "import './side.mjs';", "const y = await import('./late.mjs');", "export * from './more.mjs';", "import cdn from 'https://cdn.example.org/x.js';", "import fs from 'node:fs';"]) {
    writeFileSync(join(out, 'reader.mjs'), `${code}\n${reader}`);
    const spec = code.match(/['"]([^'"]+)['"]/)[1];
    assert.ok(checkSite(out).some(p => p.includes('imports a module') && p.includes(spec)), code);
  }
}));

test('a source file that is a symlink, or behind one, is refused before anything is written', () => withScratch(tmp => {
  const outside = join(tmp, 'outside.txt');
  writeFileSync(outside, 'not for the site');

  const linkedFile = fakeRoot(join(tmp, 'linked-file'));
  rmSync(join(linkedFile, 'LICENSE'));
  symlinkSync(outside, join(linkedFile, 'LICENSE'));
  assert.ok(sourceProblems(linkedFile).some(p => /LICENSE/.test(p)));
  assert.throws(() => buildSite(join(tmp, 'out1'), { root: linkedFile }), /LICENSE/);
  assert.equal(existsSync(join(tmp, 'out1')), false, 'nothing is created when a source is refused');

  const linkedDirectory = fakeRoot(join(tmp, 'linked-directory'));
  mkdirSync(join(tmp, 'elsewhere'));
  for (const chapter of CHAPTERS) copyFileSync(resolve(root, chapter.path), join(tmp, 'elsewhere', chapter.path.split('/').pop()));
  rmSync(join(linkedDirectory, 'book'), { recursive: true });
  mkdirSync(join(linkedDirectory, 'book'));
  symlinkSync(join(tmp, 'elsewhere'), join(linkedDirectory, 'book', 'pl'));
  assert.ok(sourceProblems(linkedDirectory).some(p => /symlink/.test(p) && /book\/pl/.test(p)), sourceProblems(linkedDirectory).join('\n'));
  assert.throws(() => buildSite(join(tmp, 'out2'), { root: linkedDirectory }), /symlink/);

  const missing = fakeRoot(join(tmp, 'missing'));
  rmSync(join(missing, 'reader.mjs'));
  assert.ok(sourceProblems(missing).some(p => /missing in the repository: reader\.mjs/.test(p)));
}));

test('the build refuses the repository, its parents, links to them and folders that hold anything but an earlier build, and leaves them alone', () => withScratch(tmp => {
  const parent = join(tmp, 'parent');
  const repo = fakeRoot(join(parent, 'repo'));
  const guard = /repository or one of its parents/;
  assert.throws(() => buildSite(repo, { root: repo }), guard);
  assert.throws(() => buildSite(parent, { root: repo }), guard);
  assert.throws(() => buildSite(join(repo, 'book', '..'), { root: repo }), guard);
  assert.throws(() => buildSite(tmp, { root: repo }), guard);
  symlinkSync(repo, join(tmp, 'alias-of-repo'));
  assert.throws(() => buildSite(join(tmp, 'alias-of-repo'), { root: repo }), guard, 'a symlink to the repository');
  symlinkSync(parent, join(tmp, 'alias-of-parent'));
  assert.throws(() => buildSite(join(tmp, 'alias-of-parent', 'repo'), { root: repo }), guard, 'a path through a symlinked ancestor');
  assert.throws(() => buildSite(join(tmp, 'alias-of-parent'), { root: repo }), guard, 'a symlink to the parent');
  for (const path of siteFiles()) assert.ok(existsSync(join(repo, path)), `${path} is still there`);

  put(tmp, 'mysite/index.html', '<h1>mine</h1>');
  put(tmp, 'mysite/photos/a.jpg', 'photo');
  put(tmp, 'mysite/.env', 'secret');
  assert.throws(() => buildSite(join(tmp, 'mysite'), { root: repo }), /not part of an earlier build/);
  assert.equal(readFileSync(join(tmp, 'mysite/photos/a.jpg'), 'utf8'), 'photo');
  assert.equal(readFileSync(join(tmp, 'mysite/.env'), 'utf8'), 'secret');

  put(tmp, 'keep/notes.txt', 'mine');
  assert.throws(() => buildSite(join(tmp, 'keep'), { root: repo }), /not part of an earlier build/);
  put(tmp, 'a-file', 'x');
  assert.throws(() => buildSite(join(tmp, 'a-file'), { root: repo }), /not a folder/);
  assert.equal(readFileSync(join(tmp, 'keep/notes.txt'), 'utf8'), 'mine');

  const out = join(tmp, 'again');
  buildSite(out, { root: repo });
  buildSite(out, { root: repo });
  mkdirSync(join(tmp, 'empty'));
  buildSite(join(tmp, 'empty'), { root: repo });
  buildSite(join(repo, '_site'), { root: repo });
  assert.ok(existsSync(join(repo, '_site', 'index.html')), 'a folder inside the repository is fine');
  put(out, 'stale.txt');
  assert.throws(() => buildSite(out, { root: repo }), /not part of an earlier build/, 'an extra file is not an earlier build');
}));

test('the build throws when the folder it made is not what may be published', () => withScratch(tmp => {
  const bad = fakeRoot(join(tmp, 'bad'));
  writeFileSync(join(bad, 'index.html'), read('index.html').replace('</body>', '<a href="README.md">README</a></body>'));
  assert.throws(() => buildSite(join(tmp, 'out'), { root: bad }), /not what may be published[\s\S]*README\.md/);
}));

test('the command line builds, prints the files and fails with a non-zero exit code and a message when it must', () => withScratch(tmp => {
  const script = resolve(root, 'tools/pl/build-site.mjs');
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });

  const ok = run(join(tmp, 'site'));
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, new RegExp(`${siteFiles().length} files in `));
  for (const path of siteFiles()) assert.ok(ok.stdout.includes(path), path);
  assert.ok(existsSync(join(tmp, 'site/index.html')), 'the first argument is the output folder');

  const none = run();
  assert.equal(none.status, 1);
  assert.match(none.stderr, /Usage: node tools\/pl\/build-site\.mjs <output folder>/);

  const refused = run(root);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /repository or one of its parents/);
  assert.ok(existsSync(resolve(root, 'tools/pl/build-site.mjs')), 'the repository is untouched');
}));

test('index.html reaches only files that are published, so no page link breaks on the site', () => {
  const html = read('index.html');
  assert.deepEqual([...html.matchAll(/(?:href|src)="([^"#:]+)"/g)].map(m => m[1]).sort(), ['LICENSE', 'LICENSE-CODE', 'reader.mjs']);
  for (const href of ['https://github.com/mikomiel/HowToLiveBetter-PL/blob/main/README.md', 'https://github.com/mikomiel/HowToLiveBetter-PL/tree/main/book/pl']) assert.ok(html.includes(`href="${href}"`), href);
});

test('pages.yml is manual, runs only on main, checks the built folder in a real browser, and only its deploy job may write Pages', () => {
  const workflow = read('.github/workflows/pages.yml');
  assert.match(workflow, /\non:\n  workflow_dispatch:\n\npermissions:\n  contents: read\n\n/);
  assert.doesNotMatch(workflow, /\n  (push|pull_request|pull_request_target|schedule|workflow_run|release|repository_dispatch):/);
  assert.doesNotMatch(workflow, /secrets\.|gh release|gh pr|git push|git tag|git commit|actions\/cache|--admin|continue-on-error|enablement/);
  assert.deepEqual([...workflow.matchAll(/^\s+([a-z-]+): (?:write|admin)\s*$/gm)].map(m => m[1]).sort(), ['id-token', 'pages']);

  const [header, build, deploy] = workflow.split(/\n  (?:build|deploy):\n/);
  assert.ok(header && build && deploy, 'two jobs: build and deploy');
  assert.match(header, /Deployment branches|github-pages/, 'the header says where the main-only rule really sits');
  assert.doesNotMatch(build, /permissions:|environment:|: write/);
  assert.match(deploy, /\n    permissions:\n      pages: write\n      id-token: write\n/);
  assert.match(deploy, /\n    environment:\n      name: github-pages\n/);
  assert.match(deploy, /\n    needs: build\n/);
  assert.doesNotMatch(deploy, /actions\/checkout|run:|actions\/setup-node/, 'the deploy job runs no repository code');
  for (const job of [build, deploy]) {
    assert.match(job, /\n    if: github\.ref == 'refs\/heads\/main'\n/);
    assert.match(job, /runs-on: ubuntu-24\.04/);
    assert.match(job, /timeout-minutes: \d+/);
  }
  assert.match(build, /persist-credentials: false/);

  const allowed = new Set(['actions/checkout', 'actions/setup-node', 'actions/upload-pages-artifact', 'actions/deploy-pages']);
  const uses = [...workflow.matchAll(/uses: ([^@\s]+)@([^\s#]+)/g)];
  assert.equal(uses.length, 4);
  for (const [, action, sha] of uses) { assert.ok(allowed.has(action), action); assert.match(sha, /^[a-f0-9]{40}$/, action); }

  const steps = [...build.matchAll(/run: (.+)/g)].map(m => m[1]);
  assert.deepEqual(steps, ['npm ci --ignore-scripts', 'npm test', 'node tools/pl/build-site.mjs _site', 'npx playwright install --with-deps chromium', 'SITE_DIR=_site npx playwright test tests/browser/site.spec.mjs --project=desktop']);
  assert.match(build, /upload-pages-artifact@[a-f0-9]{40} # v[\d.]+\n        with:\n          path: _site\n/);
  assert.ok(build.indexOf('SITE_DIR=_site') < build.indexOf('upload-pages-artifact'), 'the folder is checked before it is uploaded');
  assert.match(read('.gitignore'), /^_site\/$/m);
});
