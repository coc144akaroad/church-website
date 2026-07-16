const fs = require('fs');
const path = require('path');

function normalizeContent(content, isBase64) {
  if (isBase64) {
    return String(content || '').replace(/\r?\n/g, '');
  }
  return Buffer.from(String(content || ''), 'utf8').toString('base64');
}

function writeLocalFile(relativePath, content, isBase64, cwd = process.cwd()) {
  const safePath = String(relativePath || '').replace(/\\/g, '/').replace(/^\/+/, '');
  const targetPath = path.join(cwd, ...safePath.split('/'));
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  const buffer = isBase64
    ? Buffer.from(String(content || ''), 'base64')
    : Buffer.from(String(content || ''), 'utf8');

  fs.writeFileSync(targetPath, buffer);
  return { targetPath };
}

module.exports = {
  normalizeContent,
  writeLocalFile
};
