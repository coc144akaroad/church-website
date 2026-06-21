const fetch = require('node-fetch');

exports.handler = async function (event) {
  // This function expects a POST with JSON { path: "content/sermons/1.md", content: "...", isBase64: true }
  // It uses the GitHub Contents API to create/update a file on the repository. Configure GITHUB_TOKEN and GITHUB_REPO in Netlify env.
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // e.g. user/repo
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !repo) return { statusCode: 500, body: JSON.stringify({ error: 'GITHUB_TOKEN or GITHUB_REPO not configured' }) };

  let payload;
  try { payload = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { path, content, message, isBase64 } = payload;
  if (!path || typeof content !== 'string') return { statusCode: 400, body: JSON.stringify({ error: 'Missing path or content' }) };

  const apiBase = 'https://api.github.com/repos/' + repo + '/contents/';
  const fileUrl = apiBase + path.split('/').map(encodeURIComponent).join('/');

  // First get the file to retrieve sha if exists
  let sha = null;
  try {
    const getRes = await fetch(fileUrl + '?ref=' + branch, {
      headers: { Authorization: `token ${token}`, 'User-Agent': 'netlify-function' }
    });
    if (getRes.status === 200) {
      const getJson = await getRes.json();
      sha = getJson.sha;
    }
  } catch (e) { console.error('get file error', e); }

  // If caller already provided base64 content (for binary files), use it directly
  let encodedContent;
  if (isBase64) {
    encodedContent = content.replace(/\r?\n/g, '');
  } else {
    encodedContent = Buffer.from(content, 'utf8').toString('base64');
  }

  const putBody = {
    message: message || `CMS update: ${path}`,
    content: encodedContent,
    branch
  };
  if (sha) putBody.sha = sha;

  try {
    const putRes = await fetch(fileUrl, {
      method: 'PUT',
      headers: { Authorization: `token ${token}`, 'User-Agent': 'netlify-function', 'Content-Type': 'application/json' },
      body: JSON.stringify(putBody)
    });
    const putJson = await putRes.json();
    if (putRes.status >= 200 && putRes.status < 300) return { statusCode: 200, body: JSON.stringify(putJson) };
    return { statusCode: putRes.status, body: JSON.stringify(putJson) };
  } catch (e) {
    console.error('put error', e);
    return { statusCode: 502, body: JSON.stringify({ error: 'Failed to save file' }) };
  }
};
