import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const root = fileURLToPath(new URL('../../', import.meta.url));
export const marker = 'globalThis.__legacyEpubProbe=1';
export const truncatedImage = `<img src="https://example.invalid/probe" onerror="${marker}"`;
export const attackChapter = `# <script><img src=x onerror="${marker}"

## <pre>${truncatedImage}

## <SCRIPT><img src=x onerror="${marker}"

## **Bold** [link](../README.md) and \`<code>\`

## A &amp; B &lt; C &#x1F642;

## \`&lt;literal&gt;\`

Paragraph <script>${truncatedImage}

- List <pre>${truncatedImage}
`;
export const attackDescription = `Description first line.
# <scr
ipt>${truncatedImage}

## <pre
>${truncatedImage}`;

// Run the real legacy entry point with synthetic input, never the Polish README.
// Only the fixture has a node_modules link; no source or dependency file is rewritten.
export function buildLegacyEpub({ description = 'Fixture description.', chapter = '# Fixture chapter\n', front = 'Fixture front matter.' } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'legacy-epub-'));
  try {
    for (const path of ['tools/epub/build.mjs', 'tools/epub/style.css', 'tools/lib/book.mjs', 'tools/lib/zip.mjs', 'tools/lib/split-items.mjs']) {
      mkdirSync(dirname(join(dir, path)), { recursive: true });
      copyFileSync(join(root, path), join(dir, path));
    }
    symlinkSync(join(root, 'node_modules'), join(dir, 'node_modules'), 'junction');
    mkdirSync(join(dir, 'book'));
    writeFileSync(join(dir, 'book/01-fixture.md'), chapter);
    writeFileSync(join(dir, 'README.md'), `# 高性价比人生指南\n\n${description}\n\n[![fixture](badge.png)](https://example.invalid/)\n\n## 这本书想回答的问题\n\n${front}\n\n## 目录\n\n[Fixture chapter](book/01-fixture.md)\n\n## 正文\n`);
    // A one-pixel PNG keeps the fixture independent of the inherited cover image.
    writeFileSync(join(dir, 'og.png'), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jr1cAAAAASUVORK5CYII=', 'base64'));
    const run = spawnSync(process.execPath, [join(dir, 'tools/epub/build.mjs'), 'fixture.epub'], {
      cwd: dir, encoding: 'utf8', timeout: 60000,
    });
    assert.equal(run.error, undefined, String(run.error));
    assert.equal(run.status, 0, run.stdout + run.stderr);
    const archive = readFileSync(join(dir, 'fixture.epub'));
    const files = new Map();
    // Read local entries from this repository's ZIP writer (no data descriptors).
    for (let offset = 0; archive.readUInt32LE(offset) === 0x04034b50;) {
      const method = archive.readUInt16LE(offset + 8);
      const size = archive.readUInt32LE(offset + 18);
      const nameLength = archive.readUInt16LE(offset + 26);
      const extraLength = archive.readUInt16LE(offset + 28);
      const name = archive.subarray(offset + 30, offset + 30 + nameLength).toString();
      const start = offset + 30 + nameLength + extraLength;
      const packed = archive.subarray(start, start + size);
      assert.ok(method === 0 || method === 8, `unexpected ZIP method ${method}`);
      const data = method === 0 ? packed : inflateRawSync(packed);
      assert.equal(data.length, archive.readUInt32LE(offset + 22), name);
      files.set(name, data.toString());
      offset = start + size;
    }
    assert.equal(files.get('mimetype'), 'application/epub+zip');
    return files;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
