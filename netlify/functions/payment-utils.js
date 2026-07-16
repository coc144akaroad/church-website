function buildVerificationResponse(payload, reference) {
  const data = payload && payload.data ? payload.data : {};

  return {
    verified: Boolean(payload && payload.status),
    reference: reference || data.reference || '',
    status: data.status || '',
    amount: data.amount || 0,
    currency: data.currency || '',
    customerEmail: data.customer && data.customer.email ? data.customer.email : '',
    message: payload && payload.message ? payload.message : ''
  };
}

module.exports = { buildVerificationResponse };
