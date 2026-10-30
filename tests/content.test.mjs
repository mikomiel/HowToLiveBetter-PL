import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHAPTERS, FIELDS, parseChapter, published, fold, safeHref } from '../reader.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(resolve(root, path), 'utf8');
const chapters = CHAPTERS.map(c => ({ ...c, text: read(c.path), ...parseChapter(read(c.path), c.id) }));
const entries = chapters.flatMap(c => c.entries);
const advice = published(entries);
const time = chapters.find(c => c.id === '04');
// Consent guard: AGENTS.md limits the edition to these chapters. Change this list only with the owner's agreement.
const AGREED_SCOPE = ['03', '04', '14'];
// Upstream file of a chapter, found by its number prefix, so scope changes do not require editing paths here.
const sourcePaths = Object.fromEntries(CHAPTERS.map(({ id }) => {
  const file = readdirSync(resolve(root, 'book')).find(name => name.startsWith(id + '-') && name.endsWith('.md'));
  assert.ok(file, `no upstream file for chapter ${id}`);
  return [id, 'book/' + file];
}));
const baseline = 'e2605d3e2242bd6216c9255192b8a8957a08c55a';
const states = ['verified', 'needs_verification', 'needs_localization', 'not_applicable'];

test('one file registry covers only the authorized chapters', () => {
  assert.deepEqual(CHAPTERS.map(c => c.id), AGREED_SCOPE);
  assert.equal(new Set(CHAPTERS.map(c => c.path)).size, CHAPTERS.length);
  for (const c of CHAPTERS) assert.deepEqual(Object.keys(c).sort(), ['id', 'path']);
});

test('every source item of the new chapters has exactly one decision; chapter 04 stays intact', () => {
  const newChapters = chapters.filter(c => c.id !== '04');
  const sourceTotal = newChapters.reduce((sum, c) => sum + [...read(sourcePaths[c.id]).matchAll(/^### \d+\. /gm)].length, 0);
  assert.equal(newChapters.flatMap(c => c.entries).length, sourceTotal);
  for (const c of newChapters) {
    const sourceNumbers = [...read(sourcePaths[c.id]).matchAll(/^### (\d+)\. /gm)].map(m => `${c.id}.${m[1]}`);
    assert.deepEqual(c.entries.map(e => e.number), sourceNumbers);
    for (const e of c.entries) {
      assert.ok(states.includes(e.fields.Status));
      if (e.fields.Status !== 'verified') {
        for (const f of ['Ograniczenia', 'Źródła', 'Oryginał', 'Weryfikacja']) assert.ok(e.fields[f], `${e.number}: ${f}`);
        assert.ok(e.title.startsWith('Rekord redakcyjny:'));
        assert.equal(e.fields['W praktyce'], undefined);
      }
    }
  }
  const expected = [1, 2, 3, 4, 5, 7, 9, 12, 17, 18];
  assert.deepEqual(published(time.entries).map(e => e.number), expected.map(n => `04.${n}`));
  const exclusions = [...time.text.matchAll(/^\| 04\.(\d+) \|/gm)].map(m => Number(m[1]));
  assert.equal(exclusions.length, 8);
  assert.deepEqual([...exclusions, ...expected].sort((a, b) => a - b), Array.from({ length: 18 }, (_, i) => i + 1));
});

test('README totals and per-chapter coverage match the canonical Markdown', () => {
  const readme = read('README.md');
  assert.match(readme, new RegExp(`Stan treści: ${advice.length} zweryfikowan(?:e|ych) polsk(?:ie|ich) porad`));
  for (const c of chapters) {
    const total = [...read(sourcePaths[c.id]).matchAll(/^### \d+\. /gm)].length;
    const row = readme.split('\n').find(line => line.startsWith(`| [${c.id}.`));
    assert.ok(row?.includes(`| ${total} | ${published(c.entries).length} |`));
  }
  const pending = entries.filter(e => e.fields.Status !== 'verified').length;
  assert.ok(readme.includes(`${pending} rekordów oczekujących`));
});

test('all source identifiers and pinned line ranges resolve to the unchanged original', () => {
  for (const c of chapters) {
    const original = read(sourcePaths[c.id]).split(/\r?\n/);
    for (const e of c.entries) {
      const href = /\]\(([^)]+)\)/.exec(e.fields['Oryginał'])?.[1];
      assert.ok(href?.startsWith(`https://github.com/eternity4719/HowToLiveBetter/blob/${baseline}/`));
      assert.ok(e.fields['Oryginał'].includes(`[${e.number}]`));
      const url = new URL(href);
      assert.equal(decodeURIComponent(url.pathname.split('/book/')[1]), sourcePaths[c.id].slice(5));
      const [, start, end] = /^#L(\d+)-L(\d+)$/.exec(url.hash) ?? [];
      assert.ok(start && end);
      const span = original.slice(Number(start) - 1, Number(end)).join('\n');
      assert.ok(span.startsWith(`### ${e.number.split('.')[1]}. `), e.number);
      assert.equal([...span.matchAll(/^### /gm)].length, 1);
      assert.match(span, /证据等级/);
      assert.ok(c.text.includes(`<a id="${e.id}"></a>`));
      if (e.fields.Status === 'verified') {
        const oldGrade = /证据等级：([ABC])/.exec(span)?.[1];
        if (oldGrade !== e.fields['Ocena dowodów'][0]) {
          assert.match(e.fields['Zmiany w adaptacji'], new RegExp(`(?:Oryginalne ${oldGrade} zastąpiono ${e.fields['Ocena dowodów'][0]}|z ${oldGrade} do ${e.fields['Ocena dowodów'][0]})`));
        }
      }
    }
  }
});

test('published items have all provenance, evidence, limits and calendar-valid dates', () => {
  for (const e of advice) {
    for (const field of FIELDS) assert.ok(e.fields[field], `${e.number}: ${field}`);
    assert.equal(e.fields.Status, 'verified');
    assert.match(e.fields['Ocena dowodów'], /^[ABC] [\u2014-] .+/);
    assert.match(e.fields.Weryfikacja, /^\d{4}-\d{2}-\d{2}; .+/);
    assert.equal(new Date(e.fields.Weryfikacja.slice(0, 10)).toISOString().slice(0, 10), e.fields.Weryfikacja.slice(0, 10));
    assert.match(e.fields['Źródła'], /https:\/\//);
  }
  // Metadata checks do not establish scientific or legal truth.
});

test('all unpublished states are excluded and malformed files fail closed', () => {
  for (const state of states.slice(1)) {
    assert.equal(published(parseChapter(time.text.replace('- Status: verified', `- Status: ${state}`)).entries).length, 9);
  }
  assert.throws(() => parseChapter(time.text.replace('- Status: verified', '- Status: ready')), /stan/);
  assert.throws(() => parseChapter(time.text.replace('- Status: verified\n', '')), /stan/);
  assert.throws(() => parseChapter(time.text.replace('- Status: verified', '- Status: verified\nDalsza część w złym wierszu')), /Nieobsługiwany/);
  assert.throws(() => parseChapter(time.text.replace(/- Weryfikacja: \d{4}-\d{2}-\d{2};/, '- Weryfikacja: 2026-02-31;')), /weryfikacji/);
  assert.throws(() => parseChapter(time.text.replace('- Status: verified', '- Status: verified\n- Status: verified')), /powtórzone/);
  assert.throws(() => parseChapter(time.text + '\n# 4. Duplikat\n'), /jeden rozdział/);
  assert.throws(() => parseChapter(chapters[0].text + '\n### 1. Duplikat\n- Status: needs_verification\n'), /Powtórzony/);
  assert.throws(() => parseChapter(time.text, '03'), /Niezgodny numer/);
  assert.throws(() => parseChapter(''), /Brak/);
  assert.throws(() => parseChapter('# 3. Pusty\n'), /Brak/);
});

test('a grade separator written as a hyphen is accepted and other separators are not', () => {
  const swap = separator => parseChapter(time.text.replace(/(- Ocena dowodów: [ABC]) \u2014 /, `$1${separator}`));
  assert.doesNotThrow(() => swap(' - '));
  assert.throws(() => swap(': '), /oceny dowodów/);
  assert.throws(() => swap(' '), /oceny dowodów/);
});

test('authentication advice keeps the available-2FA fallback and its phishing limit', () => {
  const entry = advice.find(e => e.number === '14.1');
  assert.match(entry.fields['W praktyce'], /Gdy usługa nie obsługuje kluczy dostępu, włącz dostępną weryfikację dwuskładnikową \(2FA\)/);
  assert.match(entry.fields['W praktyce'], /Kody SMS i z aplikacji nadal można wyłudzić/);
  assert.match(entry.fields['Zmiany w adaptacji'], /2FA.*kluczy dostępu/);
  assert.equal(entry.fields['Ocena dowodów'][0], 'C');
});

test('Polish text and accent-insensitive search keep meaningful characters', () => {
  for (const c of chapters) assert.doesNotMatch(c.text, /[\u0000\ufffd\p{Script=Han}]/u);
  assert.equal(fold('ŻÓŁĆ, Łódź i źródła'), 'zolc, lodz i zrodla');
  assert.ok(advice.some(e => fold(e.title).includes('skrotow')));
});

test('Markdown files, local links and published cross-references resolve', () => {
  const paths = ['README.md', 'AGENTS.md', 'CLAUDE.md', ...CHAPTERS.map(c => c.path), 'book/README.md', 'docs/README.md', 'tools/README.md'];
  const publishedIds = new Set(advice.map(e => e.id));
  for (const path of paths) {
    const text = read(path);
    assert.doesNotMatch(text, /[\u0000\ufffd]/);
    for (const [, href] of text.matchAll(/\[[^\]]+\]\(([^()\s]+)\)/g)) {
      if (/^https:\/\//.test(href)) continue;
      const [file, anchor] = href.split('#');
      const targetFile = file ? resolve(root, dirname(path), file) : resolve(root, path);
      assert.ok(existsSync(targetFile), `${path} -> ${href}`);
      if (anchor) assert.ok(readFileSync(targetFile, 'utf8').includes(`id="${anchor}"`), `${path} -> ${href}`);
    }
  }
  for (const e of advice) {
    for (const value of Object.values(e.fields)) for (const [, href] of value.matchAll(/\[[^\]]+\]\(([^()\s]+)\)/g)) {
      const safe = safeHref(href);
      assert.ok(safe, `${e.number}: ${href}`);
      if (safe.startsWith('#')) assert.ok(publishedIds.has(safe.slice(1)), `${e.number}: unpublished target ${safe}`);
    }
  }
});

test('URL guard permits only HTTPS and known chapter cross-references', () => {
  assert.equal(safeHref('https://example.org/path'), 'https://example.org/path');
  assert.equal(safeHref('#porada-4-1'), '#porada-4-1');
  assert.equal(safeHref('04-nie-marnuj-czasu.md#porada-4-5'), '#porada-4-5');
  for (const href of ['javascript:alert(1)', 'data:text/html,x', '//evil.test', 'http://example.org', 'https://', 'https://u:p@example.org', '../reader.mjs', 'unknown.md#porada-4-1', '04-nie-marnuj-czasu.md#porada-14-1']) assert.equal(safeHref(href), null, href);
});

test('active Polish metadata has no upstream site, ads or publication address', () => {
  const html = read('index.html');
  assert.match(html, /<html lang="pl">/);
  assert.doesNotMatch(html, /googletagmanager|google-analytics|ads\/|og\.png|selfcheck\.html|eternity4719\.github\.io|\p{Script=Han}/u);
  assert.match(html, /https:\/\/github\.com\/mikomiel\/HowToLiveBetter-PL\/pulls/);
  assert.match(read('robots.txt'), /Disallow: \/\n/);
  assert.doesNotMatch(read('robots.txt'), /Sitemap:|github\.io/i);
  assert.equal(existsSync(resolve(root, 'sitemap.xml')), false);
  for (const [, href] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) if (!href.startsWith('https:')) assert.ok(existsSync(resolve(root, href)), href);
});

test('licenses and attribution remain present, with no runtime dependencies', () => {
  assert.equal(JSON.parse(read('package.json')).dependencies, undefined);
  assert.ok(read('LICENSE').startsWith('Attribution 4.0 International'));
  assert.match(read('LICENSE-CODE'), /Copyright \(c\) 2026 eternity4719/);
  for (const path of ['README.md', 'index.html', ...CHAPTERS.map(c => c.path)]) {
    assert.match(read(path), /eternity4719/);
    assert.match(read(path), /CC BY 4\.0/);
    assert.match(read(path), /[Aa]daptacj/);
  }
  assert.match(read('reader.mjs'), /Copyright \(c\) 2026 eternity4719/);
});

test('repository workflows stay read-only, validation-only and SHA-pinned', () => {
  const files = readdirSync(resolve(root, '.github/workflows')).sort();
  // pages.yml is the one workflow that publishes; tests/site.test.mjs holds its own, stricter checks.
  assert.deepEqual(files, ['book.yml', 'dependency-review.yml', 'pages.yml']);
  const allowedActions = new Set(['actions/checkout', 'actions/setup-node', 'actions/dependency-review-action']);
  const validate = workflow => {
    assert.match(workflow, /on:\n  pull_request:\n    branches: \[main\]/);
    assert.match(workflow, /permissions:\n  contents: read\n/);
    assert.match(workflow, /persist-credentials: false/);
    assert.match(workflow, /runs-on: ubuntu-24\.04/);
    assert.match(workflow, /timeout-minutes: \d+/);
    assert.doesNotMatch(workflow, /\b[\w-]+: write|pull_request_target|secrets\.|gh release|gh pr merge|git push|git tag|deploy|pages|upload-artifact|tools\/(epub|pdf|anki|offline)/i);
    const actions = [...workflow.matchAll(/uses: ([^@\s]+)@([^\s#]+)/g)];
    assert.ok(actions.length > 0);
    for (const [, action, sha] of actions) {
      assert.ok(allowedActions.has(action), action);
      assert.match(sha, /^[a-f0-9]{40}$/);
    }
  };
  for (const file of files.filter(f => f !== 'pages.yml')) validate(read('.github/workflows/' + file));
  const book = read('.github/workflows/book.yml');
  assert.match(book, /  push:\n    branches: \[main\]/);
  for (const command of ['npm ci --ignore-scripts', 'npm test', 'npx playwright install --with-deps chromium firefox webkit', 'npm run test:browser']) assert.ok(book.includes('run: ' + command));
  // The guard must reject real regressions, not merely discover valid files.
  assert.throws(() => validate(book.replace(/(actions\/checkout@)[a-f0-9]{40}/, '$1v7')));
  assert.throws(() => validate(book.replace('contents: read', 'contents: write')));
  assert.throws(() => validate(book.replace('pull_request:', 'pull_request_target:')));
  const dependencies = read('.github/workflows/dependency-review.yml');
  assert.match(dependencies, /name: Dependency review/);
  assert.match(dependencies, /fail-on-severity: high/);
  assert.match(dependencies, /fail-on-scopes: runtime, development, unknown/);
  assert.match(dependencies, /vulnerability-check: true/);
  assert.match(dependencies, /warn-only: false/);
  assert.match(dependencies, /comment-summary-in-pr: never/);
  assert.equal(existsSync(resolve(root, '.github/FUNDING.yml')), false);
});

test('Dependabot schedules bounded npm and Actions update groups without auto-merge', () => {
  const config = read('.github/dependabot.yml');
  assert.match(config, /^version: 2\n/);
  assert.deepEqual([...config.matchAll(/package-ecosystem: (\S+)/g)].map(m => m[1]).sort(), ['github-actions', 'npm']);
  assert.equal([...config.matchAll(/directory: \/$/gm)].length, 2);
  assert.equal([...config.matchAll(/interval: weekly/g)].length, 2);
  assert.equal([...config.matchAll(/open-pull-requests-limit: 3/g)].length, 2);
  assert.match(config, /dependency-type: development/);
  assert.match(config, /groups:\n      github-actions:/);
  assert.doesNotMatch(config, /auto-merge|registries:|token:|password:/);
});

test('merge instructions keep human approval, exact HEAD and a separate non-admin identity', () => {
  const policy = read('AGENTS.md');
  for (const condition of ['zgodzie operatora na dany PR', 'uprawnionego recenzenta-człowieka dla aktualnego HEAD', 'odrębnej tożsamości agenta', 'bez uprawnień Administration', 'Nie używaj --admin ani bypassu', '--match-head-commit']) assert.ok(policy.includes(condition), condition);
  assert.match(policy, /Sam komentarz AI nie jest zatwierdzeniem/);
  assert.match(policy, /Dopóki osobna tożsamość nie jest skonfigurowana, agent nie wykonuje merge; robi to człowiek/);
  assert.match(policy, /Nie deklaruj wtedy rozdzielenia uprawnień/);
});

test('browser projects cover Chromium desktop and mobile plus Firefox and WebKit', async () => {
  const config = (await import('../playwright.config.mjs')).default;
  assert.deepEqual(config.projects.map(p => p.name), ['desktop', 'mobile', 'firefox', 'webkit']);
  assert.equal(config.use.browserName, 'chromium');
  assert.equal(config.projects.find(p => p.name === 'mobile').use.isMobile, true);
  assert.equal(config.projects.find(p => p.name === 'firefox').use.browserName, 'firefox');
  assert.equal(config.projects.find(p => p.name === 'webkit').use.browserName, 'webkit');
});
