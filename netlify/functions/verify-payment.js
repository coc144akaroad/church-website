const https = require('https');
const { buildVerificationResponse } = require('./payment-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { reference } = body;
  if (!reference) return { statusCode: 400, body: JSON.stringify({ error: 'Missing reference' }) };

  const secret = process.env.PAYSTACK_SECRET;
  if (!secret) return { statusCode: 500, body: JSON.stringify({ error: 'PAYSTACK_SECRET not configured on server' }) };

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.paystack.co',
      path: `/transaction/verify/${encodeURIComponent(reference)}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const responseBody = buildVerificationResponse(parsed, reference);
          resolve({ statusCode: 200, body: JSON.stringify(responseBody) });
        } catch (err) {
          resolve({ statusCode: 502, body: JSON.stringify({ error: 'Invalid response from Paystack', raw: data }) });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ statusCode: 502, body: JSON.stringify({ error: err.message }) });
    });
    req.end();
  });
};
