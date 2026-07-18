const test = require('node:test');
const assert = require('node:assert/strict');
const { validateImageFile, sanitizeFilename, generateUniqueFilename } = require('../image-utils');

test('accepts supported image files within size limits', () => {
  const file = {
    name: 'hero.png',
    size: 1024 * 1024,
    type: 'image/png'
  };

  assert.doesNotThrow(() => validateImageFile(file));
});

test('rejects unsupported or oversized files', () => {
  assert.throws(() => validateImageFile({ name: 'evil.exe', size: 100, type: 'application/x-msdownload' }), /Unsupported/i);
  assert.throws(() => validateImageFile({ name: 'large.jpg', size: 6 * 1024 * 1024, type: 'image/jpeg' }), /5MB/i);
});

test('sanitizes names and avoids collisions', () => {
  const first = generateUniqueFilename('My Image @2026!.png', ['img/gallery/my-image-2026.png']);
  const second = generateUniqueFilename('My Image @2026!.png', ['img/gallery/my-image-2026.png', first]);

  assert.equal(sanitizeFilename('My Image @2026!.png'), 'my-image-2026.png');
  assert.notEqual(first, second);
  assert.match(first, /^my-image-2026-1\.png$/);
  assert.match(second, /^my-image-2026-2\.png$/);
});
