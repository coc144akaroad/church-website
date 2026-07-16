const fetchImpl = globalThis.fetch || (() => {
  try {
    return require('node-fetch');
  } catch (error) {
    return null;
  }
})();

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const netlifyToken = process.env.NETLIFY_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!netlifyToken || !siteId) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        skipped: true,
        message: 'Build trigger skipped because Netlify credentials are not configured in this environment.'
      })
    };
  }

  if (!fetchImpl) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        skipped: true,
        message: 'Build trigger skipped because no fetch implementation is available.'
      })
    };
  }

  try {
    const res = await fetchImpl(`https://api.netlify.com/api/v1/sites/${siteId}/builds`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ trigger_branch: branch })
    });

    const text = await res.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = { raw: text };
    }

    return { statusCode: res.status, body: JSON.stringify(data) };
  } catch (err) {
    console.error('trigger-build error', err);
    return { statusCode: 200, body: JSON.stringify({ ok: true, skipped: true, message: 'Build trigger skipped due to an error.', detail: String(err) }) };
  }
};
