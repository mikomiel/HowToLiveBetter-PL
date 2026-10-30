import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { CHAPTERS, parseChapter, published, fold } from '../../reader.mjs';

const chapters = CHAPTERS.map(c => {
  const markdown = readFileSync(new URL('../../' + c.path, import.meta.url), 'utf8');
  return { ...c, markdown, ...parseChapter(markdown, c.id) };
});
const entries = chapters.flatMap(c => published(c.entries));
const count = entries.length;
const time = chapters.find(c => c.id === '04');
const routeFor = c => '**/' + c.path;
const visibleCards = page => page.locator('article:visible');
const matches = (entry, query) => fold([chapters.find(c => c.id === entry.chapterId).title, entry.number, entry.title, ...Object.values(entry.fields)].join('\n')).includes(fold(query));

async function ready(page, suffix = '/') {
  await page.goto(suffix);
  await expect(page.locator('#status')).toContainText(`z ${count} zweryfikowanych`);
}

test('renders actual chapters, all verified provenance and no external requests', async ({ page, baseURL }) => {
  const external = [], requests = [], errors = [];
  page.on('request', request => {
    requests.push(request.url());
    if (!request.url().startsWith(baseURL + '/')) external.push(request.url());
  });
  page.on('pageerror', error => errors.push(error.message));
  await ready(page);
  await expect(page.getByRole('heading', { name: 'Jak żyć lepiej', exact: true })).toBeVisible();
  await expect(visibleCards(page)).toHaveCount(count);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
  for (const c of chapters) {
    expect(requests.some(url => url.endsWith(c.path))).toBe(true);
    await expect(page.locator(`#rozdzial-${Number(c.id)} h2`)).toHaveText(`${Number(c.id)}. ${c.title}`);
  }
  expect(requests.some(url => /book\/\d|updates\.json|selfcheck/.test(url))).toBe(false);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
  expect(await page.locator('article').evaluateAll(nodes => nodes.map(n => n.id))).toEqual(entries.map(e => e.id));
  for (const e of entries) {
    const card = page.locator('#' + e.id);
    await expect(card.getByRole('heading')).toHaveText(e.title);
    if (e.number === '14.1') {
      await expect(card.locator('.practical')).toContainText('włącz dostępną weryfikację dwuskładnikową (2FA)');
      await expect(card.locator('.practical')).toContainText('Kody SMS i z aplikacji nadal można wyłudzić');
    }
    await card.locator('summary').click();
    await expect(card).toContainText(e.fields.Weryfikacja);
    await expect(card).toContainText(e.fields['Zmiany w adaptacji']);
    const original = card.getByRole('link', { name: e.number, exact: true });
    await expect(original).toHaveAttribute('href', /eternity4719\/HowToLiveBetter\/blob\/e2605d3e2242bd6216c9255192b8a8957a08c55a\//);
    expect(await card.locator('a[href^="https://"]').count()).toBeGreaterThan(1);
  }
  expect(await page.locator('main').innerText()).not.toMatch(/\p{Script=Han}|Rekord redakcyjny/u);
  await expect(page.getByRole('link', { name: 'CC BY 4.0', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'MIT', exact: true })).toHaveAttribute('href', 'LICENSE-CODE');
});

test('search spans chapters and combines with chapter and evidence filters', async ({ page }) => {
  await ready(page);
  const query = 'redakcyjn';
  const found = entries.filter(e => matches(e, query));
  expect(new Set(found.map(e => e.chapterId)).size).toBeGreaterThan(1);
  await page.getByLabel('Szukaj w polskich poradach').fill(query);
  await expect(visibleCards(page)).toHaveCount(found.length);
  await page.getByLabel('Rozdział', { exact: true }).selectOption('03');
  await expect(visibleCards(page)).toHaveCount(found.filter(e => e.chapterId === '03').length);
  await page.getByLabel('Ocena dowodów', { exact: true }).selectOption('A');
  await expect(visibleCards(page)).toHaveCount(found.filter(e => e.chapterId === '03' && e.fields['Ocena dowodów'].startsWith('A')).length);
  await page.getByRole('button', { name: 'Wyczyść filtry' }).click();
  await expect(visibleCards(page)).toHaveCount(count);
  await expect(page.getByLabel('Szukaj w polskich poradach')).toBeFocused();
  await page.getByLabel('Szukaj w polskich poradach').fill('skrotow');
  await expect(visibleCards(page)).toHaveCount(1);
  await expect(visibleCards(page)).toHaveAttribute('id', 'porada-4-17');
  await page.getByLabel('Rozdział', { exact: true }).selectOption('14');
  await expect(visibleCards(page)).toHaveCount(0);
  await expect(page.locator('#status')).toContainText('Brak wyników');
});

test('chapter navigation and chapter deep links use actual titles and counts', async ({ page }) => {
  await ready(page);
  const c = chapters.find(c => c.id === '14');
  const nav = page.getByRole('navigation', { name: 'Rozdziały', exact: true });
  await expect(nav.getByRole('link')).toHaveCount(chapters.length);
  await nav.getByRole('link', { name: new RegExp('^14\\.') }).click();
  await expect(page).toHaveURL(/#rozdzial-14$/);
  await expect(page.getByLabel('Rozdział', { exact: true })).toHaveValue('14');
  await expect(visibleCards(page)).toHaveCount(published(c.entries).length);
  await expect(page.locator('#rozdzial-14 h2')).toBeFocused();
  await expect(page.locator('#rozdzial-14 h2')).toBeInViewport();
  await page.reload();
  await expect(page.locator('#rozdzial-14 h2')).toBeFocused();
  await expect(visibleCards(page)).toHaveCount(published(c.entries).length);
});

test('old chapter-04 deep links and cross-chapter references survive filters', async ({ page }) => {
  await ready(page, '/#porada-4-18');
  await expect(page.locator('#porada-4-18 h3')).toBeFocused();
  await page.getByLabel('Rozdział', { exact: true }).selectOption('03');
  await page.getByLabel('Szukaj w polskich poradach').fill('Kushlev');
  await expect(visibleCards(page)).toHaveCount(1);
  await page.locator('#porada-3-5').getByRole('link', { name: 'porada 04.5', exact: true }).click();
  await expect(page).toHaveURL(/#porada-4-5$/);
  await expect(visibleCards(page)).toHaveCount(count);
  await expect(page.locator('#porada-4-5 h3')).toBeFocused();
  await expect(page.locator('#porada-4-5 h3')).toBeInViewport();
  await page.getByLabel('Szukaj w polskich poradach').fill('691');
  await expect(visibleCards(page)).toHaveCount(1);
  await page.locator('#porada-4-9').getByRole('link', { name: 'plan „jeśli–to” z porady 04.1' }).click();
  await expect(page.locator('#porada-4-1 h3')).toBeFocused();
  await page.reload();
  await expect(page.locator('#porada-4-1 h3')).toBeFocused();
});

test('keyboard and mobile navigation reach advice and source details', async ({ page }) => {
  await ready(page);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Przejdź do porad' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.locator('#porada-3-1 summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#porada-3-1 details')).toHaveAttribute('open', '');
  const nav = page.locator('#nav-list');
  if (await nav.getAttribute('open') === null) {
    await nav.locator('summary').focus();
    await page.keyboard.press('Enter');
  }
  await page.getByRole('navigation', { name: 'Spis polskich porad' }).getByRole('link').last().click();
  await expect(page).toHaveURL(new RegExp('#' + entries.at(-1).id + '$'));
  await expect(page.locator('#' + entries.at(-1).id + ' h3')).toBeFocused();
});

test('all unpublished states stay outside the collection and dynamic counts change', async ({ page }) => {
  for (const state of ['needs_verification', 'needs_localization', 'not_applicable']) {
    await page.route(routeFor(time), route => route.fulfill({
      contentType: 'text/plain; charset=utf-8',
      body: time.markdown.replace('- Status: verified', `- Status: ${state}`),
    }));
    await page.goto('/');
    await expect(page.locator('#status')).toContainText(`z ${count - 1} zweryfikowanych`);
    await expect(page.locator('article')).toHaveCount(count - 1);
    await expect(page.locator('#porada-4-1')).toHaveCount(0);
    await page.unroute(routeFor(time));
  }
});

test('one delayed failed chapter never exposes a partial collection; retry reloads all', async ({ page }) => {
  const c = chapters.at(-1);
  let finish;
  await page.route(routeFor(c), route => { finish = () => route.fulfill({ status: 404, body: 'brak' }); });
  await page.goto('/');
  await expect.poll(() => Boolean(finish)).toBe(true);
  await expect(page.locator('#status')).toContainText('Wczytywanie wszystkich');
  await expect(page.locator('article')).toHaveCount(0);
  await expect(page.getByLabel('Szukaj w polskich poradach')).toBeDisabled();
  await finish();
  await expect(page.locator('#status')).toContainText('Nie wczytano kompletnego zbioru. Nie pokazano żadnej jego części.');
  await expect(page.locator('#status')).toContainText('Rozdział ' + c.id);
  await expect(page.locator('article')).toHaveCount(0);
  await expect(page.getByLabel('Rozdział', { exact: true })).toBeDisabled();
  await page.unroute(routeFor(c));
  await page.getByRole('button', { name: 'Spróbuj wczytać ponownie' }).click();
  await expect(visibleCards(page)).toHaveCount(count);
  await expect(page.getByLabel('Rozdział', { exact: true })).toBeEnabled();
  await expect(page.locator('#chapters a')).toHaveCount(chapters.length);
});

test('network, empty file, wrong chapter and missing state fail the entire load', async ({ page }) => {
  const failures = [
    [route => route.abort('failed'), 'Nie można pobrać rozdziału.'],
    [route => route.fulfill({ body: '' }), 'Brak rozdziału'],
    [route => route.fulfill({ body: chapters[0].markdown }), 'Niezgodny numer rozdziału'],
    [route => route.fulfill({ body: time.markdown.replace('- Status: verified\n', '') }), 'Nieprawidłowy stan'],
  ];
  for (const [handler, message] of failures) {
    await page.route(routeFor(time), handler);
    await page.goto('/');
    await expect(page.locator('#status')).toContainText(message);
    await expect(page.locator('#status')).toContainText('Nie wczytano kompletnego zbioru');
    await expect(page.locator('article')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Wyczyść filtry' })).toBeDisabled();
    await page.unroute(routeFor(time));
  }
});

test('raw HTML and unsafe Markdown URLs are inert in the actual reader', async ({ page }) => {
  const injected = time.markdown.replace('Zamiast „zajmę się tekstem”', '<img src=x onerror=alert(1)> [klik](javascript:alert%281%29) [konto](https://u:p@example.org) Zamiast „zajmę się tekstem”');
  const dialogs = [];
  page.on('dialog', dialog => { dialogs.push(dialog.message()); dialog.dismiss(); });
  await page.route(routeFor(time), route => route.fulfill({ body: injected }));
  await ready(page);
  await expect(page.locator('article img')).toHaveCount(0);
  await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
  await expect(page.locator('a[href*="u:p@"]')).toHaveCount(0);
  await expect(page.locator('#porada-4-1 .practical')).toContainText('<img');
  expect(dialogs).toEqual([]);
});

test('module and file URL failures keep actionable HTTP guidance and disabled controls', async ({ page }) => {
  await page.route('**/reader.mjs', route => route.abort('failed'));
  await page.goto('/');
  await expect(page.locator('#status')).toContainText('Nie uruchomiono czytnika.');
  await expect(page.locator('#status')).toContainText('Użyj lokalnego serwera HTTP');
  await expect(page.locator('article')).toHaveCount(0);
  await expect(page.getByLabel('Szukaj w polskich poradach')).toBeDisabled();
  await expect(page.getByRole('link', { name: 'O wydaniu i metodzie' })).toBeVisible();
  await page.addInitScript(() => {
    globalThis.__readerModuleLoadFailed = false;
    window.addEventListener('error', event => {
      if (event.target instanceof HTMLScriptElement && event.target.type === 'module') {
        globalThis.__readerModuleLoadFailed = true;
      }
    }, true);
  });
  await page.goto(new URL('../../index.html', import.meta.url).href);
  // Wait for a real module failure or the reader's terminal fetch error, not initial HTML.
  await expect.poll(() => page.evaluate(() =>
    globalThis.__readerModuleLoadFailed ||
    document.querySelector('#status').textContent.startsWith('Nie wczytano kompletnego zbioru.')
  ), { timeout: 12000 }).toBe(true);
  await expect(page.locator('#status')).toContainText('Użyj lokalnego serwera HTTP');
  await expect(page.locator('article')).toHaveCount(0);
  await expect(page.getByLabel('Szukaj w polskich poradach')).toBeDisabled();
  await expect(page.getByLabel('Rozdział', { exact: true })).toBeDisabled();
  await expect(page.getByLabel('Ocena dowodów')).toBeDisabled();
});

test('small screens keep controls, long evidence and navigation within the viewport', async ({ page }) => {
  await ready(page);
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 812 });
    if (await page.locator('#porada-14-8 details').getAttribute('open') === null) await page.locator('#porada-14-8 summary').click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    await expect(page.getByLabel('Szukaj w polskich poradach')).toBeVisible();
    await expect(page.getByLabel('Rozdział', { exact: true })).toBeVisible();
  }
});
