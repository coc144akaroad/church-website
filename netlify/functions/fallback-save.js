const fs = require('fs');
const path = require('path');
const { writeLocalFile } = require('./file-storage');
const { spawnSync } = require('child_process');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let payload;
  try { payload = JSON.parse(event.body || '{}'); } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { path: filePath, content, isBase64, title } = payload;
  if (!filePath || typeof content !== 'string') return { statusCode: 400, body: JSON.stringify({ error: 'Missing path or content' }) };

  try {
    const repoRoot = path.resolve(__dirname, '..', '..');
    const { targetPath } = writeLocalFile(filePath, content, Boolean(isBase64), repoRoot);

    if (typeof filePath === 'string' && filePath.startsWith('img/gallery/')) {
      const metadataPath = path.join(repoRoot, 'img', 'gallery', 'metadata.json');
      let metadata = {};
      if (fs.existsSync(metadataPath)) {
        try { metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8')); } catch (error) { /* ignore */ }
      }
      const baseName = path.basename(filePath, path.extname(filePath));
      const nextTitle = typeof title === 'string' ? title.trim() : '';
      if (nextTitle) metadata[baseName] = nextTitle; else delete metadata[baseName];
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      const scriptPath = path.join(repoRoot, 'scripts', 'generate-gallery.js');
      spawnSync(process.execPath, [scriptPath], { cwd: repoRoot, encoding: 'utf8' });
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, path: filePath, targetPath }) };
  } catch (error) {
    console.error('fallback-save error', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Fallback save failed', detail: String(error) }) };
  }
};
