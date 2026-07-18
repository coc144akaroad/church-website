const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { writeLocalFile } = require('./file-storage');
const { validateImageFile, sanitizeFilename, generateUniqueFilename, buildImageStoragePath } = require('./image-utils');

function normalizeRelativePath(rawPath) {
  const clean = String(rawPath || '').replace(/\\/g, '/').replace(/^\/+/, '');
  if (!clean) return 'img/gallery/image.jpg';
  if (!clean.startsWith('img/gallery/')) {
    return `img/gallery/${path.basename(clean)}`;
  }
  return clean;
}

function readMetadata(repoRoot) {
  const metadataPath = path.join(repoRoot, 'img', 'gallery', 'metadata.json');
  if (!fs.existsSync(metadataPath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  } catch (error) {
    console.warn('Unable to parse gallery metadata', error);
    return {};
  }
}

function writeMetadata(repoRoot, metadata) {
  const metadataPath = path.join(repoRoot, 'img', 'gallery', 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}

function cleanupFileArtifacts(repoRoot, relativePath) {
  const resolvedPath = path.resolve(repoRoot, relativePath);
  if (fs.existsSync(resolvedPath)) {
    fs.unlinkSync(resolvedPath);
  }

  const ext = path.extname(relativePath);
  const baseName = path.basename(relativePath, ext);
  const optimizedDir = path.join(repoRoot, 'img', 'gallery', 'optimized');
  if (!fs.existsSync(optimizedDir)) {
    return;
  }

  const candidates = [
    path.join(optimizedDir, `${baseName}.jpg`),
    path.join(optimizedDir, `${baseName}.jpeg`),
    path.join(optimizedDir, `${baseName}.png`),
    path.join(optimizedDir, `${baseName}.webp`),
    path.join(optimizedDir, `${baseName}.svg`)
  ];

  candidates.forEach((candidate) => {
    if (fs.existsSync(candidate)) {
      fs.unlinkSync(candidate);
    }
  });
}

function buildImageEntry(repoRoot, filename, metadata) {
  const absolutePath = path.join(repoRoot, 'img', 'gallery', filename);
  const relativePath = `img/gallery/${filename}`;
  const stat = fs.existsSync(absolutePath) ? fs.statSync(absolutePath) : null;
  const title = metadata[path.basename(filename, path.extname(filename))] || path.basename(filename, path.extname(filename));

  return {
    name: filename,
    path: relativePath,
    title,
    size: stat ? stat.size : 0,
    modifiedAt: stat ? stat.mtime.toISOString() : null,
    url: `/${relativePath}`
  };
}

function listGalleryImages(repoRoot) {
  const galleryDir = path.join(repoRoot, 'img', 'gallery');
  if (!fs.existsSync(galleryDir)) {
    return [];
  }

  const metadata = readMetadata(repoRoot);
  const entries = fs.readdirSync(galleryDir)
    .filter((filename) => !filename.startsWith('.') && !['gallery.json', 'gallery-data.js', 'metadata.json'].includes(filename))
    .filter((filename) => {
      const ext = path.extname(filename).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
    })
    .sort((a, b) => a.localeCompare(b));

  return entries.map((filename) => buildImageEntry(repoRoot, filename, metadata));
}

function triggerGalleryBuild(repoRoot) {
  const scriptPath = path.join(repoRoot, 'scripts', 'generate-gallery.js');
  const buildResult = spawnSync(process.execPath, [scriptPath], { cwd: repoRoot, encoding: 'utf8' });
  if (buildResult.status !== 0) {
    console.error('gallery build failed', buildResult.stdout, buildResult.stderr);
  }
}

exports.handler = async function (event) {
  if (event.httpMethod === 'GET') {
    const repoRoot = path.resolve(__dirname, '..', '..');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, images: listGalleryImages(repoRoot) })
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON payload' }) };
  }

  const repoRoot = path.resolve(__dirname, '..', '..');
  const { action, content, isBase64, fileName, currentPath, targetPath, title } = payload;

  try {
    if (action === 'delete') {
      const relativePath = normalizeRelativePath(currentPath || targetPath || '');
      cleanupFileArtifacts(repoRoot, relativePath);
      const metadata = readMetadata(repoRoot);
      const baseName = path.basename(relativePath, path.extname(relativePath));
      delete metadata[baseName];
      writeMetadata(repoRoot, metadata);
      triggerGalleryBuild(repoRoot);
      return { statusCode: 200, body: JSON.stringify({ ok: true, deleted: true, path: relativePath }) };
    }

    if (!content || typeof content !== 'string' || !fileName) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing file content or filename' }) };
    }

    const fileMeta = { name: fileName, size: Buffer.from(content, isBase64 ? 'base64' : 'utf8').length, type: payload.mimeType || 'image/jpeg' };
    validateImageFile(fileMeta);

    const existingPaths = listGalleryImages(repoRoot).map((entry) => entry.path);
    const requestedPath = normalizeRelativePath(targetPath || currentPath || '');
    const sanitizedFileName = sanitizeFilename(fileName);
    const desiredPath = buildImageStoragePath(sanitizedFileName, requestedPath);
    const finalPath = desiredPath.startsWith('img/gallery/') ? desiredPath : `img/gallery/${sanitizedFileName}`;
    const uniquePath = finalPath.includes('/')
      ? `${finalPath.slice(0, finalPath.lastIndexOf('/') + 1)}${generateUniqueFilename(sanitizedFileName, existingPaths)}`
      : `img/gallery/${generateUniqueFilename(sanitizedFileName, existingPaths)}`;

    const storagePath = normalizeRelativePath(currentPath && action === 'replace' ? currentPath : uniquePath);
    const resolvedPath = path.resolve(repoRoot, storagePath);
    const relativePath = storagePath.replace(/\\/g, '/');

    if (action === 'replace' && currentPath && currentPath !== relativePath) {
      cleanupFileArtifacts(repoRoot, normalizeRelativePath(currentPath));
    }

    const writeResult = writeLocalFile(relativePath, content, Boolean(isBase64));

    const metadata = readMetadata(repoRoot);
    const baseName = path.basename(relativePath, path.extname(relativePath));
    const nextTitle = typeof title === 'string' && title.trim() ? title.trim() : path.basename(baseName, path.extname(baseName));
    metadata[baseName] = nextTitle;
    writeMetadata(repoRoot, metadata);

    triggerGalleryBuild(repoRoot);

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        path: relativePath,
        targetPath: writeResult.targetPath,
        resolvedPath,
        title: nextTitle,
        image: buildImageEntry(repoRoot, path.basename(relativePath), metadata)
      })
    };
  } catch (error) {
    console.error('image-management error', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to process image request', detail: String(error) }) };
  }
};
