const test = require('node:test');
const assert = require('node:assert/strict');
const { buildVerificationResponse } = require('../payment-utils');

test('buildVerificationResponse returns only the fields needed by the frontend', () => {
  const payload = {
    status: true,
    message: 'Verification successful',
    data: {
      reference: 'ref_123',
      status: 'success',
      amount: 500000,
      currency: 'NGN',
      customer: { email: 'donor@example.com' }
    }
  };

  const result = buildVerificationResponse(payload, 'ref_123');

  assert.deepEqual(result, {
    verified: true,
    reference: 'ref_123',
    status: 'success',
    amount: 500000,
    currency: 'NGN',
    customerEmail: 'donor@example.com',
    message: 'Verification successful'
  });
});
