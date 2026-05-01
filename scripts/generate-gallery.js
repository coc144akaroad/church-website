const fs = require('fs');
const path = require('path');

const galleryDir = path.join(process.cwd(), 'img', 'gallery');
const outFile = path.join(galleryDir, 'gallery.json');

if (!fs.existsSync(galleryDir)) {
  console.warn('Gallery directory not found:', galleryDir);
  process.exit(0);
}

const allowedExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

const files = fs.readdirSync(galleryDir)
  .filter(f => allowedExt.includes(path.extname(f).toLowerCase()))
  .sort();

const items = files.map(f => {
  const title = path.basename(f, path.extname(f))
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  return {
    src: path.posix.join('img/gallery', f),
    title
  };
});

fs.writeFileSync(outFile, JSON.stringify(items, null, 2), 'utf8');
console.log(`Wrote ${outFile} with ${items.length} items.`);
