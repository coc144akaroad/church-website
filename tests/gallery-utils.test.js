const test = require('node:test');
const assert = require('node:assert/strict');
const { mergeGalleryItems, resolveImageSrc } = require('../js/gallery-utils');

test('mergeGalleryItems combines manifest and local entries without duplicates', () => {
  const baseItems = [
    { id: 'base-1', title: 'Original', src: '/img/gallery/original.jpg' },
    { id: 'base-2', title: 'Keep me', src: '/img/gallery/keep.jpg' }
  ];

  const localItems = [
    { id: 'local-1', title: 'Updated title', src: '/img/gallery/original.jpg', path: '/img/gallery/original.jpg', local: true, replaceTarget: 'base-1' },
    { id: 'local-2', title: 'New upload', src: '/img/gallery/new.jpg', path: '/img/gallery/new.jpg', local: true }
  ];

  const result = mergeGalleryItems(baseItems, localItems);

  assert.equal(result.length, 3);
  assert.equal(result[0].title, 'Updated title');
  assert.equal(result[0].src, '/img/gallery/original.jpg');
  assert.equal(result[2].title, 'New upload');
});

test('resolveImageSrc keeps data and remote URLs intact', () => {
  assert.equal(resolveImageSrc('data:image/png;base64,test'), 'data:image/png;base64,test');
  assert.equal(resolveImageSrc('https://example.com/a.jpg'), 'https://example.com/a.jpg');
  assert.equal(resolveImageSrc('/img/gallery/hero.jpg'), '/img/gallery/hero.jpg');
  assert.equal(resolveImageSrc('img/gallery/hero.jpg'), './img/gallery/hero.jpg');
});
