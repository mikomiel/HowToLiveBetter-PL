import { test, expect } from '@playwright/test';
import { attackChapter, attackDescription, buildLegacyEpub } from '../helpers/legacy-epub.mjs';

let files;
test.beforeAll(() => { files = buildLegacyEpub({ chapter: attackChapter, description: attackDescription }); });

test('legacy EPUB output stays inert under HTML parsing and well-formed under XML parsing', async ({ page }) => {
  // No exporter is served or published. The synthetic archive is parsed in a blank,
  // offline browser; any attacker-controlled request is aborted even on a regression.
  await page.context().setOffline(true);
  await page.route('**/*', route => route.abort());
  for (const [name, text] of files) {
    if (!/\.(?:xhtml|ncx|opf)$/.test(name)) continue;
    const parsed = await page.evaluate(text => {
      const xml = new DOMParser().parseFromString(text, 'application/xml');
      return {
        errors: [...xml.querySelectorAll('parsererror')].map(n => n.textContent),
        scripts: xml.getElementsByTagName('script').length,
        eventAttributes: [...xml.querySelectorAll('*')].flatMap(n => [...n.attributes].filter(a => /^on/i.test(a.name)).map(a => a.name)),
      };
    }, text);
    expect(parsed, name).toEqual({ errors: [], scripts: 0, eventAttributes: [] });
    await page.setContent(text);
    await expect(page.locator('script, [onerror], [onload]'), name).toHaveCount(0);
    if (!name.endsWith('cover.xhtml')) await expect(page.locator('img'), name).toHaveCount(0);
    expect(await page.evaluate(() => globalThis.__legacyEpubProbe), name).toBeUndefined();
  }
});

test('EPUB labels preserve nested formatting text, entities and working internal targets', async ({ page }) => {
  await page.context().setOffline(true);
  await page.route('**/*', route => route.abort());
  const labels = ['Bold link and <code>', 'A & B < C 🙂', '&lt;literal&gt;'];
  for (const name of ['OEBPS/nav.xhtml', 'OEBPS/toc.ncx']) {
    const result = await page.evaluate(({ text, isNav }) => {
      const xml = new DOMParser().parseFromString(text, 'application/xml');
      const nodes = [...xml.querySelectorAll(isNav ? 'a' : 'navLabel text')];
      return nodes.map(n => n.textContent);
    }, { text: files.get(name), isNav: name.endsWith('.xhtml') });
    for (const label of labels) expect(result, `${name}: ${label}`).toContain(label);
  }
  const targets = await page.evaluate(text => {
    const xml = new DOMParser().parseFromString(text, 'application/xml');
    return [...xml.querySelectorAll('a[href*="#"]')].map(a => a.getAttribute('href'));
  }, files.get('OEBPS/nav.xhtml'));
  expect(targets.length).toBeGreaterThan(2);
  for (const href of targets) {
    const [name, id] = href.split('#');
    expect(files.has('OEBPS/' + name), href).toBe(true);
    expect(await page.evaluate(({ text, id }) => {
      const xml = new DOMParser().parseFromString(text, 'application/xml');
      return [...xml.querySelectorAll('[id]')].some(n => n.getAttribute('id') === id);
    }, { text: files.get('OEBPS/' + name), id }), href).toBe(true);
  }
});
