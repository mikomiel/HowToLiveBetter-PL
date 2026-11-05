import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = read('index.html');
const notice = html.match(/<section id="publikacja"[\s\S]*?<\/section>/)?.[0] ?? '';

test('public notice credits the independent maintainer and identifies the public correction channel', () => {
  assert.ok(notice, 'publication notice is present in the shipped HTML');
  for (const text of ['href="https://github.com/mikomiel">mikomiel</a>', 'niezależnej polskiej adaptacji',
    'href="https://github.com/mikomiel/HowToLiveBetter-PL/issues"', 'Zgłoszenia i komentarze są publiczne',
    'dokumentów indywidualnej sprawy', 'generatywnej AI']) assert.ok(notice.includes(text), text);
});

test('privacy notice separates reader behavior, browser caching and GitHub processing', () => {
  for (const text of ['localStorage', 'sessionStorage', 'pamięci podręcznej', 'adresy IP', 'również bez logowania',
    'https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#data-collection',
    'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
    'nie oznacza braku przetwarzania danych przez GitHub']) assert.ok(notice.includes(text), text);
  assert.doesNotMatch(notice, /mailto:|zgodny z RODO|pełną zgodność z RODO/);
});

test('README points to the public notice instead of keeping the resolved publisher placeholder', () => {
  const readme = read('README.md');
  assert.ok(readme.includes('index.html#publikacja'));
  assert.doesNotMatch(readme, /Przed pierwszym publicznym wdrożeniem właściciel powinien ustalić/);
  assert.ok(html.includes('href="#publikacja"'));
});
