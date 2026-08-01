(function (global) {
  function normalizeGalleryItem(item, fallbackId = 'gallery-item') {
    if (typeof item === 'string') {
      return {
        id: fallbackId,
        title: item.split('/').pop(),
        src: item,
        path: item,
        local: false,
        source: 'manifest'
      };
    }

    const src = item.src || item.url || '';
    const path = item.path || src || '';
    const title = item.title || item.name || 'Gallery image';

    return {
      id: item.id || `${fallbackId}-${String(src || title || 'item')}`,
      title,
      src,
      path,
      local: Boolean(item.local),
      webp: item.webp || '',
      replaceTarget: item.replaceTarget || null,
      modifiedAt: item.modifiedAt || item.updatedAt || null,
      source: item.source || (item.local ? 'local' : 'manifest')
    };
  }

  function buildGalleryKey(item) {
    return String(item?.src || item?.path || item?.title || '').toLowerCase();
  }

  function mergeGalleryItems(baseItems, localItems) {
    const baseEntries = Array.isArray(baseItems)
      ? baseItems.map((item, index) => normalizeGalleryItem(item, `base-${index}`))
      : [];
    const localEntries = Array.isArray(localItems)
      ? localItems.map((item, index) => normalizeGalleryItem(item, `local-${index}`))
      : [];

    const merged = [];
    const seen = new Set();

    baseEntries.forEach((item, index) => {
      const override = localEntries.find((entry) => {
        const target = entry.replaceTarget || entry.id || entry.path || entry.src || entry.title;
        if (!target) return false;
        return (
          item.id === target ||
          item.path === target ||
          item.src === target ||
          item.title === target ||
          entry.path === item.path
        );
      });

      const resolved = override
        ? {
            ...item,
            ...override,
            id: item.id,
            title: override.title || item.title,
            src: override.src || item.src,
            path: override.path || item.path,
            local: true,
            source: 'local'
          }
        : item;

      const key = buildGalleryKey(resolved);
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(resolved);
      }
    });

    localEntries
      .filter((entry) => !entry.replaceTarget)
      .forEach((entry) => {
        const key = buildGalleryKey(entry);
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(entry);
        }
      });

    return merged;
  }

  function resolveImageSrc(src) {
    if (!src) return '';
    if (/^(data:|blob:|https?:|file:|\/\/)/i.test(src)) {
      return src;
    }
    if (src.startsWith('/')) {
      return src;
    }
    return `./${src.replace(/^\.\//, '')}`;
  }

  const api = {
    normalizeGalleryItem,
    buildGalleryKey,
    mergeGalleryItems,
    resolveImageSrc
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  global.GalleryUtils = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
