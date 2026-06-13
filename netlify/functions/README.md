Netlify functions for Paystack integration

Environment variables (set these in Netlify site settings -> Build & deploy -> Environment):

- `PAYSTACK_SECRET` - Your Paystack secret key (sk_test_...); used by `verify-payment` to call Paystack verify API.
- `PAYSTACK_WEBHOOK_SECRET` - (Optional) the webhook secret for verifying Paystack webhook signatures; set if you enable webhooks.

Endpoints:

- `/.netlify/functions/verify-payment` (POST) - Accepts JSON { "reference": "<paystack_reference>" } and returns Paystack's verify response.
- `/.netlify/functions/webhook` (POST) - Receives Paystack webhook events. Configure this URL in your Paystack dashboard when adding a webhook.

Notes:

- Do NOT commit or expose `PAYSTACK_SECRET` in client-side code. Keep it secret and only on server-side (Netlify env).
- The `verify-payment` function simply proxies Paystack's verify endpoint. Extend it to persist payments to a database if needed.
- The webhook handler currently logs events. Extend it to update records or notify admins.
