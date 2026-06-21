const fetch = require('node-fetch');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const netlifyToken = process.env.NETLIFY_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!netlifyToken || !siteId) return { statusCode: 500, body: JSON.stringify({ error: 'NETLIFY_TOKEN or NETLIFY_SITE_ID not configured' }) };

  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/builds`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ trigger_branch: branch })
    });

    const data = await res.json();
    return { statusCode: res.status, body: JSON.stringify(data) };
  } catch (err) {
    console.error('trigger-build error', err);
    return { statusCode: 502, body: JSON.stringify({ error: 'Failed to trigger build', detail: String(err) }) };
  }
};
