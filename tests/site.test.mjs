import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHAPTERS } from '../reader.mjs';
import { FIXED_FILES, buildSite, checkSite, siteFiles } from '../tools/pl/build-site.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(resolve(root, path), 'utf8');
const scratch = () => mkdtempSync(join(tmpdir(), 'site-test-'));
const put = (dir, path, text = 'x') => { mkdirSync(dirname(join(dir, path)), { recursive: true }); writeFileSync(join(dir, path), text); };

test('the published folder holds the reader, the chapters of CHAPTERS and the two licences, and nothing else', () => {
  const tmp = scratch();
  try {
    const files = buildSite(join(tmp, 'site'));
    assert.deepEqual(files.map(f => f.path).sort(), [...FIXED_FILES, ...CHAPTERS.map(c => c.path)].sort());
    assert.deepEqual(siteFiles(), files.map(f => f.path));
    assert.deepEqual(FIXED_FILES.slice().sort(), ['LICENSE', 'LICENSE-CODE', 'index.html', 'reader.mjs']);
    for (const { path } of files) assert.ok(readFileSync(join(tmp, 'site', path)).equals(readFileSync(resolve(root, path))), `${path} is byte for byte the repository file`);
    for (const forbidden of [/^ads\//, /^docs\//, /^audit\//, /^tools\//, /^tests\//, /^skills\//, /^\.claude\//, /^\.github\//, /selfcheck/, /og\.png/, /updates\.json/, /robots\.txt/, /sitemap/, /^README\.md$/, /^AGENTS\.md$/, /\p{Script=Han}/u, /^book\/\d\d-/]) {
      assert.ok(files.every(f => !forbidden.test(f.path)), `${forbidden} must not be published`);
    }
    assert.ok(files.every(f => f.path !== 'book/README.md'));
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});

test('the checker names a missing, an extra and a changed file, a broken link and a module the site does not hold', () => {
  const tmp = scratch();
  try {
    const out = join(tmp, 'site');
    buildSite(out);
    assert.deepEqual(checkSite(out), []);

    put(out, 'ads/wechat-reward.png');
    assert.ok(checkSite(out).some(p => /not allowed on the site: ads\/wechat-reward\.png/.test(p)));
    rmSync(join(out, 'ads'), { recursive: true });

    rmSync(join(out, CHAPTERS[0].path));
    assert.ok(checkSite(out).some(p => p === `missing: ${CHAPTERS[0].path}`));
    writeFileSync(join(out, CHAPTERS[0].path), readFileSync(resolve(root, CHAPTERS[0].path)));
    assert.deepEqual(checkSite(out), []);

    writeFileSync(join(out, 'LICENSE'), 'changed');
    assert.ok(checkSite(out).some(p => /differs from the repository file: LICENSE$/.test(p)));
    writeFileSync(join(out, 'LICENSE'), readFileSync(resolve(root, 'LICENSE')));

    const html = readFileSync(resolve(root, 'index.html'), 'utf8');
    writeFileSync(join(out, 'index.html'), html.replace('</body>', '<a href="README.md">README</a></body>'));
    const problems = checkSite(out);
    assert.ok(problems.some(p => /links to a file that is not on the site: README\.md/.test(p)), problems.join('\n'));
    assert.ok(problems.some(p => /differs from the repository file: index\.html/.test(p)));
    writeFileSync(join(out, 'index.html'), html.replace('</body>', '<img src="/ads/mcyyy.webp"><a href="../outside.html">x</a><a href="https://example.org/">ok</a><a href="#porady">ok</a></body>'));
    const absolute = checkSite(out);
    assert.ok(absolute.some(p => p.includes('/ads/mcyyy.webp')));
    assert.ok(absolute.some(p => p.includes('../outside.html')));
    assert.ok(!absolute.some(p => p.includes('example.org') || p.includes('#porady')));
    writeFileSync(join(out, 'index.html'), html);

    const reader = readFileSync(resolve(root, 'reader.mjs'), 'utf8');
    writeFileSync(join(out, 'reader.mjs'), `import { x } from './helper.mjs';\nimport './side.mjs';\nconst y = await import('./late.mjs');\n${reader}`);
    const modules = checkSite(out);
    for (const spec of ['./helper.mjs', './side.mjs', './late.mjs']) assert.ok(modules.some(p => p.includes(spec)), spec + '\n' + modules.join('\n'));
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});

test('the build refuses the repository, its parents and a folder that is not an earlier build, and leaves them alone', () => {
  const tmp = scratch();
  try {
    assert.throws(() => buildSite(root), /repository or one of its parents/);
    assert.throws(() => buildSite(dirname(root.replace(/\/$/, ''))), /repository or one of its parents/);
    assert.throws(() => buildSite(join(root, 'tools', '..')), /repository or one of its parents/);
    put(tmp, 'keep/notes.txt', 'mine');
    assert.throws(() => buildSite(join(tmp, 'keep')), /not empty and does not look like an earlier build/);
    assert.equal(readFileSync(join(tmp, 'keep/notes.txt'), 'utf8'), 'mine');
    const out = join(tmp, 'again');
    buildSite(out);
    put(out, 'stale.txt');
    buildSite(out);
    assert.ok(!existsSync(join(out, 'stale.txt')), 'an earlier build is replaced, not merged');
    assert.ok(readdirSync(root).includes('tools'), 'the repository is untouched');
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});

test('index.html reaches only files that are published, so no page link breaks on the site', () => {
  const html = read('index.html');
  assert.deepEqual([...html.matchAll(/(?:href|src)="([^"#:]+)"/g)].map(m => m[1]).sort(), ['LICENSE', 'LICENSE-CODE', 'reader.mjs']);
  for (const href of ['https://github.com/mikomiel/HowToLiveBetter-PL/blob/main/README.md', 'https://github.com/mikomiel/HowToLiveBetter-PL/tree/main/book/pl']) assert.ok(html.includes(`href="${href}"`), href);
});

test('pages.yml is manual, runs only on main, publishes only the checked folder, and only its deploy job may write Pages', () => {
  const workflow = read('.github/workflows/pages.yml');
  assert.match(workflow, /\non:\n  workflow_dispatch:\n\npermissions:\n  contents: read\n\n/);
  assert.doesNotMatch(workflow, /\n  (push|pull_request|pull_request_target|schedule|workflow_run|release|repository_dispatch):/);
  assert.doesNotMatch(workflow, /secrets\.|gh release|gh pr|git push|git tag|git commit|actions\/cache|--admin|continue-on-error|enablement/);
  assert.deepEqual([...workflow.matchAll(/^\s+([a-z-]+): (?:write|admin)\s*$/gm)].map(m => m[1]).sort(), ['id-token', 'pages']);

  const [header, build, deploy] = workflow.split(/\n  (?:build|deploy):\n/);
  assert.ok(header && build && deploy, 'two jobs: build and deploy');
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
  assert.deepEqual(steps, ['npm ci --ignore-scripts', 'npm test', 'node tools/pl/build-site.mjs _site']);
  assert.match(build, /upload-pages-artifact@[a-f0-9]{40} # v[\d.]+\n        with:\n          path: _site\n/);
  assert.ok(build.indexOf('node tools/pl/build-site.mjs _site') < build.indexOf('upload-pages-artifact'));
  assert.match(read('.gitignore'), /^_site\/$/m);
});
