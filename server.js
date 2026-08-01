const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const { handler: saveFileHandler } = require('./netlify/functions/save-file');
const { handler: imageManagementHandler } = require('./netlify/functions/image-management');

const rootDir = __dirname;
const PORT = process.env.PORT || 3000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function getFilePath(requestPath) {
  const cleanPath = decodeURIComponent(requestPath || '/').replace(/^\/+/, '');
  if (!cleanPath) return path.join(rootDir, 'index.html');
  const candidate = path.join(rootDir, cleanPath);
  if (candidate.startsWith(rootDir)) {
    return candidate;
  }
  return path.join(rootDir, 'index.html');
}

function serveStaticFile(res, filePath) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    serveStaticFile(res, path.join(filePath, 'index.html'));
    return;
  }

  res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-store', ...CORS_HEADERS });
  fs.createReadStream(filePath).pipe(res);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function handleNetlifyRoute(req, res, pathname) {
  const method = req.method || 'GET';
  if (method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return true;
  }

  if (pathname === '/api/save-file' || pathname === '/.netlify/functions/save-file') {
    const body = await parseBody(req);
    const event = {
      httpMethod: method,
      headers: req.headers,
      body
    };
    const result = await saveFileHandler(event);
    res.writeHead(result.statusCode || 200, { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS });
    res.end(result.body || JSON.stringify({ ok: true }));
    return true;
  }

  if (pathname === '/api/image-management' || pathname === '/.netlify/functions/image-management') {
    const body = await parseBody(req);
    const event = {
      httpMethod: method,
      headers: req.headers,
      body
    };
    const result = await imageManagementHandler(event);
    res.writeHead(result.statusCode || 200, { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS });
    res.end(result.body || JSON.stringify({ ok: true }));
    return true;
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === '/') {
    pathname = '/index.html';
  }

  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }

  if (pathname.startsWith('/.netlify/functions/') || pathname.startsWith('/api/')) {
    const handled = await handleNetlifyRoute(req, res, pathname);
    if (handled) return;
  }

  const filePath = getFilePath(pathname);
  serveStaticFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Local site server running at http://localhost:${PORT}`);
});
