const fs = require('fs');
const path = require('path');

function saveSermonLocally(filePath, content, cwd = process.cwd()) {
  const resolvedPath = path.resolve(cwd, filePath);
  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
  fs.writeFileSync(resolvedPath, content, 'utf8');
  return resolvedPath;
}

module.exports = { saveSermonLocally };