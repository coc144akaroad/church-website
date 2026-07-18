const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function refreshGalleryFiles() {
  const repoRoot = path.resolve(__dirname, '..');
  const scriptPath = path.join(repoRoot, 'scripts', 'generate-gallery.js');
  const result = spawnSync(process.execPath, [scriptPath], { cwd: repoRoot, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'Gallery refresh failed');
  }
  const galleryDataPath = path.join(repoRoot, 'img', 'gallery', 'gallery-data.js');
  const galleryJsonPath = path.join(repoRoot, 'img', 'gallery', 'gallery.json');
  return {
    ok: true,
    galleryDataPath,
    galleryJsonPath,
    output: result.stdout
  };
}

if (require.main === module) {
  try {
    const result = refreshGalleryFiles();
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: String(error.message || error) }));
    process.exit(1);
  }
}

module.exports = { refreshGalleryFiles };
