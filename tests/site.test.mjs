import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
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
// The same, with the build script and its helpers, so the command line can be run against it.
const fakeCheckout = dir => {
  fakeRoot(dir);
  mkdirSync(join(dir, 'tools/pl'), { recursive: true });
  for (const name of readdirSync(resolve(root, 'tools/pl')).filter(f => f.endsWith('.mjs'))) copyFileSync(resolve(root, 'tools/pl', name), join(dir, 'tools/pl', name));
  return dir;
};
const withScratch = fn => { const tmp = scratch(); try { return fn(tmp); } finally { rmSync(tmp, { recursive: true, force: true }); } };

test('the published folder holds the reader, the chapters of CHAPTERS and the two licences, and nothing else', () => withScratch(tmp => {
  const files = buildSite(join(tmp, 'site'));
  assert.deepEqual(files.map(f => f.path).sort(), [...FIXED_FILES, ...CHAPTERS.map(c => c.path)].sort());
  assert.deepEqual(siteFiles(), files.map(f => f.path));
  assert.deepEqual(FIXED_FILES.slice().sort(), ['LICENSE', 'LICENSE-CODE', 'index.html', 'reader.mjs']);
  assert.deepEqual(CHAPTERS.map(c => c.id), ['01', '02', '03', '04', '05', '06', '07', '14'], 'chapters 01, 02, 05, 06 and 07 are within the agreed scope; further additions still need the owner');
  for (const { path } of files) assert.ok(readFileSync(join(tmp, 'site', path)).equals(readFileSync(resolve(root, path))), `${path} is byte for byte the repository file`);
  for (const forbidden of [/^ads\//, /^docs\//, /^audit\//, /^tools\//, /^tests\//, /^skills\//, /^\.claude\//, /^\.github\//, /selfcheck/, /og\.png/, /updates\.json/, /robots\.txt/, /sitemap/, /^README\.md$/, /^AGENTS\.md$/, /\p{Script=Han}/u, /^book\/\d\d-/, /^book\/README/]) {
    assert.ok(files.every(f => !forbidden.test(f.path)), `${forbidden} must not be published`);
  }
  assert.deepEqual(sourceProblems(root), [], 'no site file of this repository is a symlink or behind one');
}));

test('the checker names a missing, an extra, a hidden, a nested, a linked and a changed file', () => withScratch(tmp => {
  const out = join(tmp, 'site');
  buildSite(out);
  assert.deepEqual(checkSite(out), []);
  const problem = pattern => assert.ok(checkSite(out).some(p => pattern.test(p)), `${pattern}\n${checkSite(out).join('\n')}`);

  put(out, 'ads/wechat-reward.png');
  problem(/not allowed on the site: ads\/wechat-reward\.png/);
  rmSync(join(out, 'ads'), { recursive: true });
  put(out, '.nojekyll', '');
  problem(/not allowed on the site: \.nojekyll/);
  rmSync(join(out, '.nojekyll'));
  put(out, 'book/pl/05-extra.md');
  problem(/not allowed on the site: book\/pl\/05-extra\.md/);
  rmSync(join(out, 'book/pl/05-extra.md'));
  mkdirSync(join(tmp, 'outside'));
  put(tmp, 'outside/x');
  symlinkSync(join(tmp, 'outside'), join(out, 'evil'));
  problem(/not allowed on the site: evil/);
  rmSync(join(out, 'evil'));

  rmSync(join(out, CHAPTERS[0].path));
  problem(new RegExp(`^missing: ${CHAPTERS[0].path}`));
  copyFileSync(resolve(root, CHAPTERS[0].path), join(out, CHAPTERS[0].path));
  writeFileSync(join(out, 'LICENSE'), 'changed');
  problem(/differs from the repository file: LICENSE$/);
  writeFileSync(join(out, 'LICENSE'), 'x'.repeat(readFileSync(resolve(root, 'LICENSE')).length));
  problem(/differs from the repository file: LICENSE$/);
  copyFileSync(resolve(root, 'LICENSE'), join(out, 'LICENSE'));
  assert.deepEqual(checkSite(out), []);

  const linked = fakeRoot(join(tmp, 'linked'));
  rmSync(join(linked, 'LICENSE'));
  symlinkSync(resolve(root, 'LICENSE'), join(linked, 'LICENSE'));
  assert.ok(checkSite(out, { root: linked }).some(p => /symlink/.test(p) && /LICENSE/.test(p)), 'checkSite also refuses a linked source, which matters for a folder built elsewhere');
}));

test('the checker finds the ways index.html can reach outside the site that it lists, in any quoting and case', () => withScratch(tmp => {
  const out = join(tmp, 'site');
  buildSite(out);
  const html = read('index.html');
  const check = extra => { writeFileSync(join(out, 'index.html'), html.replace('</body>', () => `${extra}</body>`)); return checkSite(out); };
  const flagged = (extra, needle) => { const problems = check(extra); assert.ok(problems.some(p => p.includes(needle)), `${extra}\n${problems.join('\n')}`); };

  // Files that are not on the site, in every quoting and every attribute that loads or opens something.
  flagged('<a href="README.md">README</a>', 'README.md');
  flagged("<img src='ads/mcyyy.webp'>", 'ads/mcyyy.webp');
  flagged('<img src=ads/mcyyy.webp>', 'ads/mcyyy.webp');
  flagged('<IMG SRC="ads/mcyyy.webp">', 'ads/mcyyy.webp');
  flagged('<a href = "docs/README.md">x</a>', 'docs/README.md');
  flagged('<img srcset="ads/a.webp 1x, ads/b.webp 2x">', 'ads/a.webp');
  flagged('<img srcset="book/pl/03-nie-marnuj-energii.md 1x, ads/b.webp 2x">', 'ads/b.webp');
  flagged('<link rel="preload" imagesrcset="ads/c.webp 1x">', 'ads/c.webp');
  flagged('<video poster="og.png"></video>', 'og.png');
  flagged('<button formaction="ads/d.png">x</button>', 'ads/d.png');
  flagged('<body background="ads/e.png">', 'ads/e.png');
  flagged('<a ping="ads/f.png" href="LICENSE">x</a>', 'ads/f.png');
  flagged('<svg><image xlink:href="ads/g.png"/></svg>', 'ads/g.png');
  flagged('<a href="../outside.html">x</a>', '../outside.html');
  flagged('<img src="/ads/mcyyy.webp">', 'absolute path');
  // Addresses outside the site: only an ordinary https link may stay.
  flagged('<script src="https://cdn.example.org/a.js"></script>', 'https://cdn.example.org/a.js');
  flagged('<link rel="stylesheet" href="https://fonts.example.org/x.css">', 'https://fonts.example.org/x.css');
  flagged('<img src="https://example.org/pixel.gif">', 'https://example.org/pixel.gif');
  flagged('<img alt=">" src="https://evil.example/pixel.gif">', 'https://evil.example/pixel.gif');
  flagged('<img src="&#104;ttps://evil.example/x.png">', 'https://evil.example/x.png');
  flagged('<img src="&#x68;ttps&colon;//evil.example/y.png">', 'https://evil.example/y.png');
  flagged('<form action="https://example.org/post"></form>', 'https://example.org/post');
  flagged('<a href="http://example.org/">x</a>', 'http://example.org/');
  flagged('<a href="//example.org/">x</a>', '//example.org/');
  flagged('<a href="javascript:alert(1)">x</a>', 'javascript:alert(1)');
  flagged('<a ping="https://example.org/ping" href="LICENSE">x</a>', 'https://example.org/ping');
  // Things that load or run something without a plain reference.
  for (const tag of ['base href="LICENSE"', 'iframe src="LICENSE"', 'embed src="LICENSE"', 'object data="LICENSE"', 'frame src="LICENSE"']) flagged(`<${tag}>`, `<${tag.split(' ')[0]}>`);
  flagged('<meta http-equiv="refresh" content="0; url=https://evil.example/">', 'meta http-equiv="refresh"');
  flagged('<META HTTP-EQUIV=Refresh CONTENT="0">', 'meta http-equiv="refresh"');
  flagged("<script>fetch('https://evil.example/')</script>", 'inline script');
  flagged('<SCRIPT>alert(1)</SCRIPT>', 'inline script');
  flagged('<script type="module">\nimport("./x.mjs")\n</script>', 'inline script');
  flagged('<script> </script><script>x</script>', 'inline script');
  flagged('<button onclick="location=\'https://evil.example/\'">x</button>', 'event handler attribute: onclick');
  flagged('<body onload="x()">', 'event handler attribute: onload');
  flagged('<iframe srcdoc="&lt;p&gt;x&lt;/p&gt;"></iframe>', 'srcdoc');
  // CSS, in a style element and in an attribute.
  flagged('<style>body { background: url(ads/mcyyy.webp) }</style>', 'ads/mcyyy.webp');
  flagged('<style>body { background: url("ads/mcyyy.webp") }</style>', 'ads/mcyyy.webp');
  flagged("<style>@import 'https://fonts.example.org/x.css';</style>", 'https://fonts.example.org/x.css');
  flagged('<style>@import "https://fonts.example.org/y.css";</style>', 'https://fonts.example.org/y.css');
  flagged('<style>body { background: image-set("https://example.org/z.png" 1x) }</style>', 'https://example.org/z.png');
  flagged('<div style="background:url(\'https://example.org/x.png\')"></div>', 'https://example.org/x.png');
  flagged('<style>body { background: u\\72l(https://evil.example/q.png) }</style>', 'CSS escape');

  const fine = check('<script src="reader.mjs"></script\t\n >'+'<script src="reader.mjs"> \n </SCRIPT >'+'<a href="https://example.org/">ok</a><a href="#porady">ok</a><a href="./LICENSE">ok</a><a HREF=\'LICENSE-CODE\'>ok</a><img src="book/pl/03-nie-marnuj-energii.md" alt="">');
  assert.deepEqual(fine.filter(p => !/^differs from the repository file: index\.html$/.test(p)), [], 'ordinary https links, anchors and files on the site are fine');
}));

test('the checker refuses import, export-from and workers in reader.mjs, because the site holds no other module', () => withScratch(tmp => {
  const out = join(tmp, 'site');
  buildSite(out);
  const reader = read('reader.mjs');
  for (const code of ["import { x } from './helper.mjs';", "import './side.mjs';", "const y = await import('./late.mjs');", "const z = await import(path);", "export * from './more.mjs';", "import cdn from 'https://cdn.example.org/x.js';", "import fs from 'node:fs';", "import /* it's */ w from './a.mjs';"]) {
    writeFileSync(join(out, 'reader.mjs'), `${code}\n${reader}`);
    assert.ok(checkSite(out).some(p => /import or export-from/.test(p)), code);
  }
  for (const code of ["new Worker('./w.mjs');", "new SharedWorker('./w.mjs');", "importScripts('x.js');", "navigator.serviceWorker.register('sw.js');"]) {
    writeFileSync(join(out, 'reader.mjs'), `${code}\n${reader}`);
    assert.ok(checkSite(out).some(p => /worker/i.test(p)), code);
  }
}));

test('a source file that is a symlink, a directory, missing or a path CHAPTERS should not name is refused before anything is written', () => withScratch(tmp => {
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

  const insideLink = fakeRoot(join(tmp, 'inside-link'));
  renameChapters(insideLink);
  symlinkSync(join(insideLink, 'book', 'real-pl'), join(insideLink, 'book', 'pl'));
  assert.ok(sourceProblems(insideLink).some(p => /symlink/.test(p)), 'a link to another folder of the same repository is a link too');

  const directory = fakeRoot(join(tmp, 'directory'));
  rmSync(join(directory, 'LICENSE'));
  mkdirSync(join(directory, 'LICENSE'));
  assert.ok(sourceProblems(directory).some(p => /not a regular file in the repository: LICENSE/.test(p)));
  assert.throws(() => buildSite(join(tmp, 'out3'), { root: directory }), /not a regular file/);

  const missing = fakeRoot(join(tmp, 'missing'));
  rmSync(join(missing, 'reader.mjs'));
  assert.ok(sourceProblems(missing).some(p => /missing in the repository: reader\.mjs/.test(p)));
}));

function renameChapters(dir) {
  mkdirSync(join(dir, 'book', 'real-pl'));
  for (const chapter of CHAPTERS) copyFileSync(join(dir, chapter.path), join(dir, 'book', 'real-pl', chapter.path.split('/').pop()));
  rmSync(join(dir, 'book', 'pl'), { recursive: true });
}

test('a CHAPTERS entry that is not a Polish chapter file stops the build before a single file is written', () => withScratch(tmp => {
  const fake = fakeRoot(join(tmp, 'fake'));
  put(tmp, 'payload.txt', 'ORIGINAL');
  put(fake, 'ads/mcyyy.webp', 'ad');
  for (const path of ['../payload.txt', 'book/pl/../../ads/mcyyy.webp', 'ads/mcyyy.webp', 'selfcheck.html', '/etc/hostname', 'book/pl/03-nie-marnuj-energii.md/../../../payload.txt', 'book/pl/05-Extra.md']) {
    CHAPTERS.push({ id: '99', path });
    try {
      assert.ok(sourceProblems(fake).some(p => /not a plain relative path|not a Polish chapter file/.test(p) && p.includes(path)), path);
      assert.throws(() => buildSite(join(tmp, 'deep', 'out'), { root: fake }), /not a plain relative path|not a Polish chapter file/, path);
    } finally { CHAPTERS.pop(); }
    assert.equal(existsSync(join(tmp, 'deep')), false, `nothing is written for ${path}`);
    assert.equal(readFileSync(join(tmp, 'payload.txt'), 'utf8'), 'ORIGINAL');
  }
  put(tmp, 'escape.txt', 'ORIGINAL');
  for (const path of ['../escape.txt', '/etc/hostname', 'a//b', './index.html', 'index.html/..']) {
    FIXED_FILES.push(path);
    try {
      assert.ok(sourceProblems(fake).some(p => /not a plain relative path/.test(p) && p.includes(path)), path);
      assert.throws(() => buildSite(join(tmp, 'deep', 'out'), { root: fake }), /not a plain relative path/, path);
    } finally { FIXED_FILES.pop(); }
    assert.equal(existsSync(join(tmp, 'deep')), false, `nothing is written for ${path}`);
  }
  assert.equal(readFileSync(join(tmp, 'escape.txt'), 'utf8'), 'ORIGINAL');
  assert.deepEqual(CHAPTERS.map(c => c.id), ['01', '02', '03', '04', '05', '06', '07', '14']);
  assert.deepEqual(FIXED_FILES, ['index.html', 'reader.mjs', 'LICENSE', 'LICENSE-CODE']);
}));

test('the build refuses the repository, its parents, links to them and folders that are not an empty or complete earlier build, and leaves them alone', () => withScratch(tmp => {
  const parent = join(tmp, 'parent');
  const repo = fakeRoot(join(parent, 'repo'));
  const guard = /repository or one of its parents/;
  assert.throws(() => buildSite(repo, { root: repo }), guard);
  assert.throws(() => buildSite(parent, { root: repo }), guard);
  assert.throws(() => buildSite(join(repo, 'book', '..'), { root: repo }), guard);
  assert.throws(() => buildSite(tmp, { root: repo }), guard);
  symlinkSync(repo, join(tmp, 'alias-of-repo'));
  assert.throws(() => buildSite(join(tmp, 'alias-of-repo'), { root: repo }), guard, 'a symlink to the repository');
  assert.throws(() => buildSite(parent, { root: join(tmp, 'alias-of-repo') }), guard, 'the repository reached through a link, the output being its parent');
  symlinkSync(parent, join(tmp, 'alias-of-parent'));
  assert.throws(() => buildSite(join(tmp, 'alias-of-parent', 'repo'), { root: repo }), guard, 'a path through a symlinked ancestor');
  assert.throws(() => buildSite(join(tmp, 'alias-of-parent'), { root: repo }), guard, 'a symlink to the parent');
  const dotted = fakeRoot(join(tmp, 'dotted', '..repo'));
  assert.throws(() => buildSite(join(tmp, 'dotted'), { root: dotted }), guard, 'a repository folder whose name starts with two dots');
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

  put(tmp, 'lone/index.html', '<h1>my own page</h1>');
  put(tmp, 'lone/LICENSE', 'mine');
  assert.throws(() => buildSite(join(tmp, 'lone'), { root: repo }), /not a complete earlier build/, 'a folder with only some of the site files is not an earlier build');
  assert.equal(readFileSync(join(tmp, 'lone/index.html'), 'utf8'), '<h1>my own page</h1>');
  mkdirSync(join(tmp, 'tree/refs/heads'), { recursive: true });
  mkdirSync(join(tmp, 'tree/refs/tags'));
  assert.throws(() => buildSite(join(tmp, 'tree/refs'), { root: repo }), /not part of an earlier build, for example heads/, 'folders alone are not an earlier build');
  assert.ok(existsSync(join(tmp, 'tree/refs/heads')));
  put(tmp, 'nested/book/pl/deeper/x.md');
  assert.throws(() => buildSite(join(tmp, 'nested'), { root: repo }), /not part of an earlier build/);

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

test('the command line builds, prints the files, and fails with a non-zero exit code and a message when it must, never touching its own checkout', () => withScratch(tmp => {
  const run = (checkout, ...args) => spawnSync(process.execPath, [join(checkout, 'tools/pl/build-site.mjs'), ...args], { encoding: 'utf8', cwd: tmp });
  const checkout = fakeCheckout(join(tmp, 'checkout'));

  const ok = run(checkout, join(tmp, 'site'));
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, new RegExp(`${siteFiles().length} files in `));
  for (const path of siteFiles()) assert.ok(ok.stdout.includes(path), path);
  assert.ok(existsSync(join(tmp, 'site/index.html')), 'the first argument is the output folder');

  const none = run(checkout);
  assert.equal(none.status, 1);
  assert.match(none.stderr, /Usage: node tools\/pl\/build-site\.mjs <output folder>/);

  const refused = run(checkout, checkout);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /repository or one of its parents/);
  const parent = run(checkout, tmp);
  assert.equal(parent.status, 1);
  assert.match(parent.stderr, /repository or one of its parents/);
  for (const path of [...siteFiles(), 'tools/pl/build-site.mjs']) assert.ok(existsSync(join(checkout, path)), `${path} is untouched`);
}));

test('index.html reaches only files that are published, so no page link breaks on the site, and asks search engines not to index it', () => {
  const html = read('index.html');
  assert.match(html, /<meta name="robots" content="noindex">/, 'the owner decided on 2026-10-30 that the site is not indexed');
  assert.ok(html.includes('<p class="intro" id="review-notice">Porady są sprawdzane ze źródłami maszynowo, a przegląd trwa. Nie zatwierdził ich lekarz ani prawnik.</p>'), 'the visible notice approved by the owner on 2026-10-30');
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
  assert.doesNotMatch(build, /\n {6,}(?:- )?if:/, 'no step in the build job may be skipped or forced by a condition of its own');
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
