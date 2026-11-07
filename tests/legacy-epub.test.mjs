import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readBook } from '../tools/lib/book.mjs';
import { siteFiles } from '../tools/pl/build-site.mjs';
import { attackChapter, attackDescription, buildLegacyEpub } from './helpers/legacy-epub.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('the real legacy EPUB exporter escapes raw-block text in body and navigation', () => {
  const files = buildLegacyEpub({ chapter: attackChapter });
  for (const name of ['OEBPS/ch01.xhtml', 'OEBPS/nav.xhtml', 'OEBPS/toc.ncx']) {
    const text = files.get(name);
    assert.ok(text, name);
    assert.doesNotMatch(text, /<img\b|<script\b|<pre\b/i, name);
    assert.match(text, /&lt;img/, `${name} must preserve the malformed tag as text`);
    assert.doesNotMatch(text, /&amp;amp;|&amp;lt; C/, `${name} must not double-escape normal entities`);
  }
});

test('split README tags do not become HTML in the EPUB front matter or navigation', () => {
  const files = buildLegacyEpub({ description: attackDescription });
  for (const name of ['OEBPS/front.xhtml', 'OEBPS/nav.xhtml', 'OEBPS/toc.ncx', 'OEBPS/content.opf']) {
    const text = files.get(name);
    assert.ok(text, name);
    assert.doesNotMatch(text, /<img\b|<script\b|<pre\b/i, name);
  }
  assert.match(files.get('OEBPS/content.opf'), /# &lt;scr\nipt&gt;/, 'metadata retains the line boundary and escapes it instead of reconstructing a tag');
});

test('legacy headings keep formatting and links but XML navigation contains only escaped text', () => {
  const files = buildLegacyEpub({ chapter: '# A &amp; B &lt; C &#x1F642;\n\n## **Bold** [link](../README.md) and `<code>`\n\n## `&lt;literal&gt;`\n' });
  const body = files.get('OEBPS/ch01.xhtml');
  assert.match(body, /<strong>Bold<\/strong> <a href="front.xhtml">link<\/a> and <code>&lt;code&gt;<\/code>/);
  for (const name of ['OEBPS/nav.xhtml', 'OEBPS/toc.ncx']) {
    const text = files.get(name);
    assert.doesNotMatch(text, /<strong>|<code>|<a href="front.xhtml">link/, name);
    assert.match(text, /A &amp; B &lt; C 🙂/, name);
    assert.match(text, /Bold link and &lt;code&gt;/, name);
    assert.match(text, /&amp;lt;literal&amp;gt;/, `${name} preserves literal entities inside code`);
  }
});

test('the legacy repair neither adapts the Polish README nor adds exports to Pages', () => {
  assert.throws(() => readBook(), /README/, 'the upstream format guard remains in force');
  assert.ok(siteFiles().every(path => !/^tools\/|selfcheck|\.epub$/.test(path)));
  const rootPackage = JSON.parse(read('package.json'));
  const legacyPackage = JSON.parse(read('tools/epub/package.json'));
  assert.equal(rootPackage.devDependencies.marked, legacyPackage.dependencies.marked, 'regressions use the exporter parser version');
  assert.equal(rootPackage.dependencies, undefined, 'no reader runtime dependency');
  for (const name of ['book', 'pages', 'dependency-review']) {
    assert.doesNotMatch(read(`.github/workflows/${name}.yml`), /tools\/(?:epub|anki|pdf)\/build/);
  }
});
