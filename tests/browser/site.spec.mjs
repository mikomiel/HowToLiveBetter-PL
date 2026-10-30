import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, normalize, sep } from 'node:path';
import { CHAPTERS, parseChapter, published } from '../../reader.mjs';
import { buildSite } from '../../tools/pl/build-site.mjs';

// The folder GitHub Pages publishes, served the way a project page is served: under /<repository>/, nothing at the host root.
const PREFIX = '/HowToLiveBetter-PL/';
const TYPES = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.md': 'text/markdown; charset=utf-8' };
const count = CHAPTERS.flatMap(c => published(parseChapter(readFileSync(new URL('../../' + c.path, import.meta.url), 'utf8'), c.id).entries)).length;

let tmp, server, origin;

test.beforeAll(async () => {
  tmp = mkdtempSync(join(tmpdir(), 'site-browser-'));
  const site = join(tmp, PREFIX.slice(1, -1));
  buildSite(site);
  server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = normalize(join(tmp, path));
    let body = null;
    try {
      if (path.startsWith(PREFIX) && file.startsWith(tmp + sep)) {
        const target = statSync(file).isDirectory() ? join(file, 'index.html') : file;
        body = readFileSync(target);
        res.setHeader('content-type', TYPES[extname(target)] ?? 'text/plain; charset=utf-8');
      }
    } catch { body = null; }
    res.statusCode = body ? 200 : 404;
    res.end(body ?? 'not found');
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  origin = `http://127.0.0.1:${server.address().port}`;
});

test.afterAll(async () => {
  await new Promise(done => server.close(done));
  rmSync(tmp, { recursive: true, force: true });
});

test('the built site loads every verified advice under the project path, with no failed and no external request', async ({ page }) => {
  const external = [], failed = [], errors = [];
  page.on('request', request => { if (!request.url().startsWith(origin + PREFIX)) external.push(request.url()); });
  page.on('response', response => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin + PREFIX);
  await expect(page.locator('#status')).toContainText(`z ${count} zweryfikowanych`);
  await expect(page.locator('article:visible')).toHaveCount(count);
  await expect(page.getByRole('link', { name: 'MIT', exact: true })).toHaveAttribute('href', 'LICENSE-CODE');
  expect(external).toEqual([]);
  expect(failed).toEqual([]);
  expect(errors).toEqual([]);
  for (const path of ['LICENSE', 'LICENSE-CODE']) expect((await page.request.get(origin + PREFIX + path)).status(), path).toBe(200);
});

test('nothing outside the reader, the chapters and the licences is reachable on the built site', async ({ page }) => {
  for (const path of ['ads/mcyyy.webp', 'ads/wechat-reward.png', 'selfcheck.html', 'docs/README.md', 'audit/README.md', 'tools/pl/fetch.mjs', 'README.md', 'book/README.md', 'book/03-不要浪费精力.md', 'og.png', 'updates.json', 'robots.txt', '.git/config']) {
    expect((await page.request.get(origin + PREFIX + path)).status(), path).toBe(404);
  }
  expect((await page.request.get(origin + '/')).status(), 'the host root').toBe(404);
});
