import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { CONTENT_PATH, parseChapter, published } from '../../reader.mjs';

const markdown = readFileSync(new URL('../../' + CONTENT_PATH, import.meta.url), 'utf8');
const entries = published(parseChapter(markdown));
const count = entries.length;
const contentRoute = '**/' + CONTENT_PATH;
const visibleCards = page => page.locator('article:visible');

async function ready(page, suffix = '/') {
  await page.goto(suffix);
  await expect(page.locator('#status')).toContainText(`z ${count} zweryfikowanych`);
}

test('renders the actual Markdown, provenance, Polish text and no external requests', async ({ page, baseURL }) => {
  const external = [];
  const requests = [];
  const errors = [];
  page.on('request', request => {
    requests.push(request.url());
    if (!request.url().startsWith(baseURL + '/')) external.push(request.url());
  });
  page.on('pageerror', error => errors.push(error.message));
  await ready(page);
  await expect(page.getByRole('heading', { name: 'Jak żyć lepiej', exact: true })).toBeVisible();
  await expect(visibleCards(page)).toHaveCount(count);
  await expect(page.getByRole('heading', { name: 'Zweryfikowane porady', level: 2 })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
  expect(requests.some(url => url.endsWith(CONTENT_PATH))).toBe(true);
  expect(requests.some(url => /book\/\d|updates\.json|selfcheck/.test(url))).toBe(false);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
  for (const entry of entries) {
    const card = page.locator('#' + entry.id);
    await expect(card.getByRole('heading')).toHaveText(entry.title);
    await card.locator('summary').click();
    await expect(card).toContainText(entry.fields.Weryfikacja);
    await expect(card).toContainText(entry.fields['Zmiany w adaptacji']);
    const original = card.getByRole('link', { name: entry.number, exact: true });
    await expect(original).toHaveAttribute('href', /eternity4719\/HowToLiveBetter\/blob\/e2605d3e2242bd6216c9255192b8a8957a08c55a\//);
    expect(await card.locator('a[href^="https://doi.org/"]').count()).toBeGreaterThan(0);
  }
  expect(await page.locator('main').innerText()).not.toMatch(/\p{Script=Han}/u);
  await expect(page.getByRole('link', { name: 'CC BY 4.0', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'MIT', exact: true })).toHaveAttribute('href', 'LICENSE-CODE');
});

test('search and evidence filter operate on actual content and can reset', async ({ page }) => {
  await ready(page);
  await page.getByLabel('Szukaj w polskich poradach').fill('skrotow');
  await expect(visibleCards(page)).toHaveCount(1);
  await expect(visibleCards(page)).toHaveAttribute('id', 'porada-4-17');
  await page.getByLabel('Ocena dowodów', { exact: true }).selectOption('A');
  await expect(visibleCards(page)).toHaveCount(0);
  await expect(page.locator('#status')).toContainText('Brak wyników');
  await page.getByRole('button', { name: 'Wyczyść filtry' }).click();
  await expect(visibleCards(page)).toHaveCount(count);
  await page.getByLabel('Ocena dowodów', { exact: true }).selectOption('A');
  await expect(visibleCards(page)).toHaveCount(entries.filter(e => e.fields['Ocena dowodów'].startsWith('A')).length);
  await page.getByRole('button', { name: 'Wyczyść filtry' }).click();
  await page.getByLabel('Szukaj w polskich poradach').fill('ekstrapolacją');
  await expect(visibleCards(page)).toHaveCount(1);
  await expect(visibleCards(page)).toHaveAttribute('id', 'porada-4-12');
});

test('keyboard, navigation and cross-references reach filtered advice', async ({ page }) => {
  await ready(page);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Przejdź do porad' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const summary = page.locator('#porada-4-1 summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#porada-4-1 details')).toHaveAttribute('open', '');
  await page.getByLabel('Szukaj w polskich poradach').fill('691');
  await expect(visibleCards(page)).toHaveCount(1);
  await page.locator('#porada-4-9').getByRole('link', { name: 'plan „jeśli–to” z porady 04.1' }).click();
  await expect(page).toHaveURL(/#porada-4-1$/);
  await expect(visibleCards(page)).toHaveCount(count);
  await expect(page.locator('#porada-4-1 h3')).toBeFocused();
  const nav = page.locator('#nav-list');
  if (await nav.getAttribute('open') === null) await nav.locator('summary').click();
  await page.getByRole('navigation', { name: 'Spis polskich porad' }).getByRole('link').last().click();
  await expect(page).toHaveURL(/#porada-4-18$/);
  await expect(page.locator('#porada-4-18 h3')).toBeFocused();
  await page.reload();
  await expect(page.locator('#porada-4-18 h3')).toBeFocused();
});

test('all declared unpublished states stay out of the rendered collection', async ({ page }) => {
  for (const state of ['needs_verification', 'needs_localization', 'not_applicable']) {
    await page.route(contentRoute, route => route.fulfill({
      contentType: 'text/plain; charset=utf-8',
      body: markdown.replace('- Status: verified', `- Status: ${state}`),
    }));
    await page.goto('/');
    await expect(page.locator('#status')).toContainText(`z ${count - 1} zweryfikowanych`);
    await expect(page.locator('article')).toHaveCount(count - 1);
    await expect(page.locator('#porada-4-1')).toHaveCount(0);
    await page.unroute(contentRoute);
  }
});

test('missing state and network error fail closed; retry loads the real chapter', async ({ page }) => {
  await page.route(contentRoute, route => route.fulfill({ status: 404, body: 'brak' }));
  await page.goto('/');
  await expect(page.locator('#status')).toContainText('Nie wczytano porad.');
  await expect(page.locator('article')).toHaveCount(0);
  await page.unroute(contentRoute);
  await page.getByRole('button', { name: 'Spróbuj wczytać ponownie' }).click();
  await expect(visibleCards(page)).toHaveCount(count);
  await page.route(contentRoute, route => route.abort('failed'));
  await page.reload();
  await expect(page.locator('#status')).toContainText('Nie można połączyć się z lokalnym serwerem.');
  await expect(page.locator('article')).toHaveCount(0);
  await page.unroute(contentRoute);
  await page.route(contentRoute, route => route.fulfill({ body: markdown.replace('- Status: verified\n', '') }));
  await page.reload();
  await expect(page.locator('#status')).toContainText('Nieprawidłowy stan');
  await expect(page.locator('article')).toHaveCount(0);
});

test('raw HTML and unsafe links in Markdown are inert', async ({ page }) => {
  const injected = markdown.replace('Zamiast „zajmę się tekstem”', '<img src=x onerror=alert(1)> [klik](javascript:alert%281%29) Zamiast „zajmę się tekstem”');
  const dialogs = [];
  page.on('dialog', dialog => { dialogs.push(dialog.message()); dialog.dismiss(); });
  await page.route(contentRoute, route => route.fulfill({ body: injected }));
  await ready(page);
  await expect(page.locator('article img')).toHaveCount(0);
  await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
  await expect(page.locator('#porada-4-1 .practical')).toContainText('<img');
  expect(dialogs).toEqual([]);
});

test('module failure and file URLs retain an actionable static fallback', async ({ page }) => {
  await page.route('**/reader.mjs', route => route.abort('failed'));
  await page.goto('/');
  await expect(page.locator('#status')).toContainText('Nie uruchomiono czytnika. Użyj lokalnego serwera HTTP');
  await expect(page.locator('article')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'O wydaniu i metodzie' })).toBeVisible();
  await page.goto(new URL('../../index.html', import.meta.url).href);
  await expect(page.locator('#status')).toContainText('Nie uruchomiono czytnika.');
  await expect(page.locator('article')).toHaveCount(0);
});

test('layout has no horizontal overflow at small widths', async ({ page }) => {
  await ready(page);
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 812 });
    await page.locator('#porada-4-4 summary').click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
    await expect(page.getByLabel('Szukaj w polskich poradach')).toBeVisible();
  }
});
