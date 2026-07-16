Netlify functions for Paystack integration

Environment variables (set these in Netlify site settings -> Build & deploy -> Environment):

- `PAYSTACK_SECRET` - Your Paystack secret key (sk_test_...); used by both `verify-payment` and the webhook handler.

Endpoints:

- `/.netlify/functions/verify-payment` (POST) - Accepts JSON { "reference": "<paystack_reference>" } and returns a minimal response with the fields the frontend needs.
- `/.netlify/functions/webhook` (POST) - Receives Paystack webhook events. Configure this URL in your Paystack dashboard when adding a webhook.

Notes:

- Do NOT commit or expose `PAYSTACK_SECRET` in client-side code. Keep it secret and only on server-side (Netlify env).
- The webhook handler now prepares a donation record payload for persistence in a database, Google Sheet, Airtable, or similar service.
- The verification function returns only the fields used by the page: `verified`, `reference`, `status`, `amount`, `currency`, `customerEmail`, and `message`.
