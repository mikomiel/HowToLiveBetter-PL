import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTENT_PATH, FIELDS, parseChapter, published, fold } from '../reader.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(resolve(root, path), 'utf8');
const content = read(CONTENT_PATH);
const entries = parseChapter(content);
const pilot = published(entries);
const expectedNumbers = [1, 2, 3, 4, 5, 7, 9, 12, 17, 18];
const baseline = 'e2605d3e2242bd6216c9255192b8a8957a08c55a';

test('published count and original item identities match the actual chapter', () => {
  assert.deepEqual(pilot.map(entry => entry.number), expectedNumbers.map(n => `04.${n}`));
  assert.equal(entries.length, 10);
  assert.match(read('README.md'), new RegExp(`Stan pilotażu: ${pilot.length} zweryfikowanych polskich porad`));
  const exclusions = [...content.matchAll(/^\| 04\.(\d+) \|/gm)].map(match => Number(match[1]));
  assert.equal(exclusions.length, 8);
  assert.deepEqual([...exclusions, ...expectedNumbers].sort((a, b) => a - b), Array.from({ length: 18 }, (_, i) => i + 1));
});

test('each published item has a state, evidence meaning, date, sources and bounded provenance', () => {
  for (const entry of pilot) {
    for (const field of FIELDS) assert.ok(entry.fields[field], `${entry.number}: ${field}`);
    assert.equal(entry.fields.Status, 'verified');
    assert.match(entry.fields['Ocena dowodów'], /^[ABC] — .+/);
    assert.match(entry.fields.Weryfikacja, /^\d{4}-\d{2}-\d{2}; .+/);
    const date = entry.fields.Weryfikacja.slice(0, 10);
    assert.equal(new Date(date).toISOString().slice(0, 10), date);
    assert.match(entry.fields['Źródła'], /https:\/\/(doi\.org|onlinelibrary\.wiley\.com)\//);
    assert.ok(entry.fields['Oryginał'].includes(`[${entry.number}]`));
    assert.ok(entry.fields['Oryginał'].includes(`https://github.com/eternity4719/HowToLiveBetter/blob/${baseline}/book/`));
    assert.match(entry.fields['Oryginał'], /#L\d+-L\d+\)/);
    assert.ok(content.includes(`<a id="${entry.id}"></a>`));
  }
});

test('only verified items publish; unknown and missing states fail closed', () => {
  for (const state of ['needs_verification', 'needs_localization', 'not_applicable']) {
    assert.equal(published(parseChapter(content.replace('- Status: verified', `- Status: ${state}`))).length, 9);
  }
  assert.throws(() => parseChapter(content.replace('- Status: verified', '- Status: ready')), /stan/);
  assert.throws(() => parseChapter(content.replace('- Status: verified\n', '')), /stan/);
  assert.throws(() => parseChapter(content.replace('- Weryfikacja: 2026-10-27;', '- Weryfikacja: wczoraj;')), /weryfikacji/);
  assert.throws(() => parseChapter(content.replace('- Status: verified', '- Status: verified\n- Status: verified')), /powtórzone/);
  assert.throws(() => parseChapter(content + '\n# 4. Duplikat\n### 1. Duplikat\n- Status: needs_verification\n'), /Powtórzony/);
});

test('UTF-8 text and accent-insensitive search preserve Polish content', () => {
  assert.doesNotMatch(content, /[\u0000\ufffd\p{Script=Han}]/u);
  assert.equal(fold('ŻÓŁĆ, Łódź i źródła'), 'zolc, lodz i zrodla');
  assert.ok(pilot.some(entry => fold(entry.title).includes('skrotow')));
  assert.ok(pilot.some(entry => fold(Object.values(entry.fields).join(' ')).includes('39')));
});

test('Markdown local files and explicit anchors resolve', () => {
  for (const path of ['README.md', 'AGENTS.md', 'CLAUDE.md', CONTENT_PATH, 'book/README.md', 'docs/README.md', 'tools/README.md']) {
    const text = read(path);
    assert.doesNotMatch(text, /[\u0000\ufffd]/);
    for (const [, href] of text.matchAll(/\[[^\]]+\]\(([^()\s]+)\)/g)) {
      if (/^https:\/\//.test(href)) continue;
      const [file, anchor] = href.split('#');
      const target = resolve(root, dirname(path), file || '.');
      const targetFile = file ? target : resolve(root, path);
      assert.ok(existsSync(targetFile), `${path} -> ${href}`);
      if (anchor) assert.ok(readFileSync(targetFile, 'utf8').includes(`id="${anchor}"`), `${path} -> ${href}`);
    }
  }
});

test('reader has no upstream corpus, advertising, analytics or runtime dependencies', () => {
  const html = read('index.html');
  assert.match(html, /<html lang="pl">/);
  assert.doesNotMatch(html, /googletagmanager|google-analytics|ads\/|og\.png|selfcheck\.html|eternity4719\.github\.io|\p{Script=Han}/u);
  assert.match(html, /https:\/\/github\.com\/mikomiel\/HowToLiveBetter-PL\/issues\/new/);
  assert.match(html, /CC BY 4\.0/);
  assert.match(html, /LICENSE-CODE/);
  assert.equal(JSON.parse(read('package.json')).dependencies, undefined);
  assert.ok(read('LICENSE').startsWith('Attribution 4.0 International'));
  assert.match(read('LICENSE-CODE'), /Copyright \(c\) 2026 eternity4719/);
});

test('all Actions workflows are validation-only and least privilege', () => {
  const workflows = readdirSync(resolve(root, '.github/workflows'));
  assert.deepEqual(workflows, ['book.yml']);
  const workflow = read('.github/workflows/book.yml');
  assert.match(workflow, /on:\n  pull_request:\n    branches: \[main\]/);
  assert.match(workflow, /  push:\n    branches: \[main\]/);
  assert.match(workflow, /permissions:\n  contents: read\n/);
  assert.match(workflow, /persist-credentials: false/);
  assert.match(workflow, /runs-on: ubuntu-24\.04/);
  assert.match(workflow, /run: npm test/);
  assert.match(workflow, /run: npm run test:browser/);
  assert.doesNotMatch(workflow, /contents: write|pull_request_target|gh release|git push|git tag|deploy|pages|upload-artifact|tools\/(epub|pdf|anki|offline)/i);
  assert.ok(!existsSync(resolve(root, '.github/FUNDING.yml')));
});
