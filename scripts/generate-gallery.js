const fs = require('fs');
const path = require('path');

const galleryDir = path.join(process.cwd(), 'img', 'gallery');
const outFile = path.join(galleryDir, 'gallery.json');
const dataScriptFile = path.join(galleryDir, 'gallery-data.js');
const metadataFile = path.join(galleryDir, 'metadata.json');

if (!fs.existsSync(galleryDir)) {
  console.warn('Gallery directory not found:', galleryDir);
  process.exit(0);
}

const allowedExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

const sharpAvailable = (() => {
  try {
    require.resolve('sharp');
    return true;
  } catch (e) {
    return false;
  }
})();

const sharp = sharpAvailable ? require('sharp') : null;

const files = fs.readdirSync(galleryDir)
  .filter(f => allowedExt.includes(path.extname(f).toLowerCase()))
  .sort();

let metadata = {};
if (fs.existsSync(metadataFile)) {
  try {
    metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
  } catch (err) {
    console.warn('Could not parse gallery metadata:', err.message || err);
  }
}

async function ensureOptimized() {
  const optimizedDir = path.join(galleryDir, 'optimized');
  if (!fs.existsSync(optimizedDir)) fs.mkdirSync(optimizedDir, { recursive: true });

  const tasks = files.map(async (f) => {
    const ext = path.extname(f).toLowerCase();
    const basename = path.basename(f, ext);
    const inputPath = path.join(galleryDir, f);

    // SVGs: copy as-is to optimized
    if (ext === '.svg') {
      const outSvg = path.join(optimizedDir, basename + '.svg');
      if (!fs.existsSync(outSvg) || fs.statSync(inputPath).mtimeMs > fs.statSync(outSvg).mtimeMs) {
        fs.copyFileSync(inputPath, outSvg);
      }
      return;
    }

    if (!sharpAvailable) return;

    const outJpeg = path.join(optimizedDir, basename + '.jpg');
    const outWebp = path.join(optimizedDir, basename + '.webp');

    const inStat = fs.statSync(inputPath);
    const shouldProcess = !fs.existsSync(outJpeg) || fs.statSync(outJpeg).mtimeMs < inStat.mtimeMs;
    if (!shouldProcess) return;

    try {
      await sharp(inputPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 82 })
        .toFile(outJpeg);

      await sharp(inputPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 76 })
        .toFile(outWebp);

      console.log('Optimized:', f);
    } catch (err) {
      console.warn('Failed to process', f, err.message || err);
    }
  });

  await Promise.all(tasks);
}

async function buildGalleryJson() {
  const optimizedDir = path.join(galleryDir, 'optimized');
  const items = [];

  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    const basename = path.basename(f, ext);
    const title = metadata[basename] || basename.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const optimizedBase = path.posix.join('img/gallery/optimized', basename);
    const item = { title };

    if (ext === '.svg') {
      item.src = path.posix.join('img/gallery', f);
    } else {
      const fileBuffer = fs.readFileSync(path.join(galleryDir, f));
      const mimeType = ext === '.png' ? 'image/png' : ext === '.gif' ? 'image/gif' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      item.src = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
      const outJpeg = path.join(optimizedDir, basename + '.jpg');
      const outWebp = path.join(optimizedDir, basename + '.webp');
      if (fs.existsSync(outJpeg)) item.src = `data:image/jpeg;base64,${fs.readFileSync(outJpeg).toString('base64')}`;
      if (fs.existsSync(outWebp)) item.webp = `data:image/webp;base64,${fs.readFileSync(outWebp).toString('base64')}`;
    }

    items.push(item);
  }

  fs.writeFileSync(outFile, JSON.stringify(items, null, 2), 'utf8');
  fs.writeFileSync(dataScriptFile, `window.galleryData = ${JSON.stringify(items, null, 2)};\n`, 'utf8');
  console.log(`Wrote ${outFile} with ${items.length} items.`);
  console.log(`Wrote ${dataScriptFile} with ${items.length} items.`);
}

(async () => {
  if (sharpAvailable) {
    console.log('sharp available — generating optimized images...');
    await ensureOptimized();
  } else {
    console.log('sharp not installed — skipping image optimization. Install sharp to enable automatic WebP/JPEG generation.');
  }

  await buildGalleryJson();
})();
