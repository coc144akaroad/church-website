const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { writeLocalFile } = require('./file-storage');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let payload;
  try { payload = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { path: filePath, content, message, isBase64, title, action } = payload;
  if (!filePath || typeof content !== 'string') return { statusCode: 400, body: JSON.stringify({ error: 'Missing path or content' }) };

  try {
    const repoRoot = path.resolve(__dirname, '..', '..');

    if (action === 'delete') {
      const resolvedPath = path.resolve(repoRoot, filePath);
      if (fs.existsSync(resolvedPath)) fs.unlinkSync(resolvedPath);
      const baseName = path.basename(filePath, path.extname(filePath));
      const metadataPath = path.join(repoRoot, 'img', 'gallery', 'metadata.json');
      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
          delete metadata[baseName];
          fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        } catch (error) {
          console.warn('Unable to update gallery metadata on delete', error);
        }
      }
      const scriptPath = path.join(repoRoot, 'scripts', 'generate-gallery.js');
      spawnSync(process.execPath, [scriptPath], { cwd: repoRoot, encoding: 'utf8' });
      return { statusCode: 200, body: JSON.stringify({ ok: true, deleted: true, path: filePath }) };
    }

    const { targetPath } = writeLocalFile(filePath, content, Boolean(isBase64));

    if (typeof filePath === 'string' && filePath.startsWith('img/gallery/')) {
      const repoRoot = path.resolve(__dirname, '..', '..');
      const metadataPath = path.join(repoRoot, 'img', 'gallery', 'metadata.json');
      let metadata = {};
      if (fs.existsSync(metadataPath)) {
        try {
          metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        } catch (error) {
          console.warn('Unable to parse gallery metadata', error);
        }
      }
      const baseName = path.basename(filePath, path.extname(filePath));
      const nextTitle = typeof title === 'string' ? title.trim() : '';
      if (nextTitle) {
        metadata[baseName] = nextTitle;
      } else {
        delete metadata[baseName];
      }
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

      const scriptPath = path.join(repoRoot, 'scripts', 'generate-gallery.js');
      const buildResult = spawnSync(process.execPath, [scriptPath], { cwd: repoRoot, encoding: 'utf8' });
      if (buildResult.status !== 0) {
        console.error('gallery build failed', buildResult.stdout, buildResult.stderr);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        path: filePath,
        targetPath,
        message: message || `Saved ${filePath}`
      })
    };
  } catch (error) {
    console.error('save-file error', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to save file', detail: String(error) }) };
  }
};
