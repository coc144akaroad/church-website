# Site State Machines

This inventory documents the current state owners and user-visible transitions. Most flows are implemented with DOM classes, page-local variables, timers, or browser storage rather than a shared state framework. Keep status text aligned with the actual transition: a local or attempted action is not the same as a completed remote action.

## Shared Navigation

- **Owner:** `js/script.js`, `initNavigation`.
- **States:** closed; open.
- **Transitions:** hamburger toggles; outside click, link selection, and Escape close. Escape returns focus to the hamburger. The active class and `aria-expanded` are updated together.
- **Notes:** scrolling separately changes navbar styling and back-to-top visibility. In-page links update active navigation styling.

## Contact And Newsletter

- **Contact owner:** inline handler in `contact.html`.
- **Contact states:** editing; validation errors; valid message prepared in a `mailto:` link. The visitor still has to open their email app and send the message. There is no server submission or delivery confirmation.
- **Newsletter owner:** `js/script.js`, `initNewsletter`.
- **Newsletter states:** invalid email; local success display and form reset. No newsletter form is currently present in the HTML and no subscription endpoint is called. If the form is added, the success text must not imply a remote subscription until one exists.

## Giving

- **Owner:** inline controller in `give.html`; verification endpoint in `netlify/functions/verify-payment.js`.
- **Selection state:** fund, amount, and payment method (bank transfer or Paystack).
- **Bank transitions:** selection to transfer instructions; clipboard copy to copied or manual-copy failure. These transitions do not confirm a bank transfer.
- **Paystack transitions:** input/configuration checks; opening; callback and server verification; confirmed, reported status, or verification failure; checkout closed.
- **Notes:** `give.html` overrides the shared provider config and currently contains a test public key. The server verification response is not checked against the selected amount/currency. Do not treat the callback alone as verified payment.

## Gallery And Lightbox

- **Owners:** `gallery.html`, `js/gallery-utils.js`, `admin/app.js`.
- **Gallery load states:** manifest; JSON fallback; merged local browser entries; placeholders when no usable images are available. Local entries depend on this browser's storage and are not necessarily published to other visitors.
- **Lightbox states:** closed; open at an image index; previous/next navigation; close by button, backdrop, or Escape. Scroll locking is restored on close.
- **Refresh inputs:** local storage, same-page gallery refresh events, and cross-tab storage events. Broken image loading has no explicit user-facing recovery state.

## Admin

- **Owners:** `admin/index.html`, `admin/app.js`, `netlify/functions/*`.
- **Access UI states:** locked; unlocked for the current tab via `sessionStorage`.
- **Upload states:** queued; uploading; uploaded; failed; removed. A failed endpoint may fall back to browser-local storage, and the upload flow can report success even though the image was not published. Storage write errors are swallowed, so even local persistence is not guaranteed. Failed queue items may be cleared after processing, limiting retries.
- **Sermon editor states:** list; loading; editor; saved or error feedback.
- **Important boundary:** the client-side access gate is not authorization. The write endpoints must independently authenticate and constrain requested paths; the current UI lock does not provide either guarantee. Admin deletion currently removes local entries, not manifest-backed images.

## Events

- **Current page owner:** inline renderer in `events.html`.
- **States:** next occurrence countdown; event ongoing; next occurrence after an event. Countdown text refreshes every minute using the visitor's local clock.
- **Notes:** the separate fetch-based renderer in `js/events.js` is not wired to the current events page; its errors only reach the console. There is no RSVP state.

## Sermons

- **Owner:** inline controller in `sermons.html`.
- **States:** loading sermon data; featured sermon/list; filtered list from search and series selection; selected sermon; notes modal; PDF export/download or missing-library alert.
- **Notes:** JSON failure or an empty list can leave featured rendering without a sermon. Some sermon IDs without matching notes can fall back to sermon 1's notes. Search/filter state is page-local.

## Livestream And Radio

- **Livestream owners:** `livestream.html`, `js/script.js`, `initLivestreamEmbed`.
- **States:** embed attempt; timeout fallback; iframe load or error. These browser events do not prove that a live broadcast is available. A late iframe load may not hide already-shown fallback links; iframe errors do not consistently expose them.
- **Radio:** `radio.html` is static schedule and “live” labeling, with no audio-player or availability state. The visible live claim is not checked against a stream.

## Background Content And Motion

- **Verse owner:** `js/verse-of-the-day.js`.
- **States:** local verse; cached or fetched verse; local fallback on request failure. Cache is keyed by date. Clipboard fallback may announce success without confirming that legacy copy succeeded.
- **Motion owners:** `js/animations.js`, `js/script.js`.
- **States:** scroll-reveal visibility, parallax position, rotating hero copy, brief CTA pulse, and reduced-motion/mobile hero-video hiding. These are presentation states, not content-delivery states. The shared loader remover has no corresponding page state found.

## Highest-Priority Follow-Up

1. Enforce server-side authorization and path containment for admin write endpoints before relying on the admin UI for protection.
2. Make upload success distinguish published, browser-local, and failed persistence; retain failed items for retry.
3. Configure live donation credentials and verify the returned amount/currency against the expected donation before showing confirmation.
4. Add explicit loading, empty, and error states to data-driven pages, and prevent featured-sermon rendering when data is absent.
5. Make media availability labels describe only what the page can actually verify.

This document records current behavior; it is not a claim that the listed follow-up risks have been fixed.