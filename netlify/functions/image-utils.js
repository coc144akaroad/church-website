const path = require('path');

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml'
]);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'svg']);

function validateImageFile(file) {
  const name = String(file?.name || '');
  const size = Number(file?.size || 0);
  const mime = String(file?.type || '').toLowerCase();
  const extension = path.extname(name).toLowerCase().replace('.', '');
  const isAllowedType = ALLOWED_MIME_TYPES.has(mime) || ALLOWED_EXTENSIONS.has(extension);

  if (!isAllowedType) {
    throw new Error('Unsupported image type. Please choose JPG, JPEG, PNG, WEBP, or SVG.');
  }

  if (size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Image exceeds the 5MB limit. Please choose a smaller file.');
  }

  if (mime.startsWith('application/') || mime.includes('javascript')) {
    throw new Error('Unsupported image type. Please choose JPG, JPEG, PNG, WEBP, or SVG.');
  }

  return true;
}

function sanitizeFilename(input) {
  const rawName = String(input || '').trim();
  const extension = path.extname(rawName).toLowerCase();
  const baseName = path.basename(rawName, extension)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  const safeBase = baseName || 'image';
  return `${safeBase}${extension}`;
}

function generateUniqueFilename(input, existingPaths = []) {
  const safeName = sanitizeFilename(input);
  const extension = path.extname(safeName);
  const baseName = path.basename(safeName, extension);
  const usedNames = new Set(
    (existingPaths || []).map((entry) => String(entry || '').replace(/\\/g, '/').split('/').pop().toLowerCase())
  );

  const noCollision = safeName.toLowerCase();
  if (!usedNames.has(noCollision)) {
    return safeName;
  }

  let counter = 1;
  while (counter < 1000) {
    const candidate = `${baseName}-${counter}${extension}`;
    if (!usedNames.has(candidate.toLowerCase())) {
      return candidate;
    }
    counter += 1;
  }

  return `${baseName}-${Date.now()}${extension}`;
}

function buildImageStoragePath(fileName, targetPath) {
  const sanitizedName = sanitizeFilename(fileName || 'image');
  const cleanTarget = String(targetPath || '').replace(/\\/g, '/').trim();
  if (cleanTarget && cleanTarget.startsWith('img/gallery/')) {
    return cleanTarget;
  }
  return `img/gallery/${sanitizedName}`;
}

module.exports = {
  MAX_FILE_SIZE_BYTES,
  validateImageFile,
  sanitizeFilename,
  generateUniqueFilename,
  buildImageStoragePath
};
