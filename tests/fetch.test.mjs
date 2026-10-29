import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { doiFromInput, isPublicHttps, htmlToText, stripXml, looksBlocked, fetchSource, ACCESS_WORDS } from '../tools/pl/fetch.mjs';

// No test here touches the network.

test('DOIs are recognised in several spellings and keep balanced parentheses', () => {
  assert.equal(doiFromInput('https://doi.org/10.1145/3308558.3313481'), '10.1145/3308558.3313481');
  assert.equal(doiFromInput('doi:10.1016/S0140-6736(20)30183-5'), '10.1016/s0140-6736(20)30183-5');
  assert.equal(doiFromInput('10.1037/0022-3514.46.5.1097.'), '10.1037/0022-3514.46.5.1097');
  assert.equal(doiFromInput('https://rf.gov.pl/edukacja/'), null);
});

test('only public https hosts are fetched', () => {
  assert.equal(isPublicHttps('https://rf.gov.pl/edukacja/'), true);
  for (const bad of ['http://rf.gov.pl/', 'https://127.0.0.1/', 'https://localhost/x', 'https://[::1]/', 'https://u:p@rf.gov.pl/', 'https://intranet/', 'https://wiki.internal/', 'file:///etc/passwd', 'not a url']) {
    assert.equal(isPublicHttps(bad), false, bad);
  }
});

test('HTML becomes readable text without scripts, navigation or markup', () => {
  const html = '<html><head><style>p{}</style><script>alert(1)</script></head><body><nav>Menu</nav><h1>Tytu&#322;</h1><p>Jedno&nbsp;zdanie &amp; drugie.</p><p>Druga <b>linia</b> &#xF3;.</p></body></html>';
  const text = htmlToText(html);
  assert.equal(text, 'Tytuł\n\nJedno zdanie & drugie.\n\nDruga linia ó.');
  assert.doesNotMatch(text, /alert|Menu|<|>/);
  assert.equal(stripXml('<abstract><p>Wynik: <italic>d</italic> = 0,65.</p></abstract>'), 'Wynik: d = 0,65.');
});

test('blocked responses are recognised and never mistaken for content', () => {
  const none = new Headers();
  assert.equal(looksBlocked(403, none), true);
  assert.equal(looksBlocked(429, none), true);
  assert.equal(looksBlocked(202, none), true);
  assert.equal(looksBlocked(200, new Headers({ 'x-amzn-waf-action': 'challenge' })), true);
  assert.equal(looksBlocked(200, none, 'Request unsuccessful. Incapsula incident ID: 123'), true);
  assert.equal(looksBlocked(200, none, 'Zwykła strona. '.repeat(500)), false);
});

test('unsafe inputs are refused before any request and still leave a manifest line', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'pl-fetch-'));
  try {
    for (const input of ['http://example.org/', 'https://127.0.0.1/', 'ftp://example.org/']) {
      const record = await fetchSource(input, dir);
      assert.equal(record.access, 'error');
      assert.equal(record.file, null);
    }
    const lines = readFileSync(join(dir, 'manifest.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
    assert.equal(lines.length, 3);
    assert.ok(lines.every(l => l.accessWords === ACCESS_WORDS.error && l.retrievedAt));
    assert.equal(existsSync(join(dir, 'manifest.jsonl')), true);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('the cache is git-ignored so snapshots of third-party text are never committed', () => {
  assert.match(readFileSync(new URL('../.gitignore', import.meta.url), 'utf8'), /^\.cache\/$/m);
});
