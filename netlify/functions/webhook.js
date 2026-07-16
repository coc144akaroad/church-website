const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const secret = process.env.PAYSTACK_SECRET;
  const signature = event.headers['x-paystack-signature'] || event.headers['X-Paystack-Signature'] || '';

  if (secret) {
    const hash = crypto.createHmac('sha512', secret).update(event.body || '').digest('hex');
    if (hash !== signature) {
      console.log('Paystack webhook signature mismatch', { received: signature, computed: hash });
      return { statusCode: 400, body: 'Signature mismatch' };
    }
  } else {
    console.log('No PAYSTACK_SECRET set; skipping signature verification');
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  console.log('Paystack webhook event received:', JSON.stringify(payload));

  const donationRecord = {
    id: payload && payload.data && payload.data.reference ? payload.data.reference : `webhook-${Date.now()}`,
    event: payload && payload.event ? payload.event : 'unknown',
    status: payload && payload.data && payload.data.status ? payload.data.status : 'unknown',
    receivedAt: new Date().toISOString()
  };

  console.log('Donation record ready for persistence:', JSON.stringify(donationRecord));

  return { statusCode: 200, body: JSON.stringify({ received: true, donationId: donationRecord.id }) };
};
