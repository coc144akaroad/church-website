(function (global) {
  function normalizeSermonBody(body) {
    return String(body || '')
      .replace(/\r\n?/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  const api = { normalizeSermonBody };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  global.SermonUtils = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
