# DG Nery Realty — Lead Funnel

Landing page and lead-capture funnel for Denerys Goenaga, a licensed New York
real estate broker specialising in divorce, estate, bankruptcy and foreclosure
sales across NYC and Westchester.

**Live:** https://dgnery.netlify.app

---

## How it works

1. A visitor submits the form on `index.html`.
2. `js/main.js` POSTs the fields to a Google Apps Script web app.
3. The script appends a row to the **Leads** sheet, emails Denerys an alert,
   and emails the visitor a confirmation.
4. The visitor is redirected to `thankyou.html`.

The browser only redirects to the thank-you page after reading
`{"result":"success"}` back from the script. A failure keeps the visitor on the
form and shows an error — see "Gotchas" below for why that matters.

## Files

| Path | Purpose |
|---|---|
| `index.html` | The whole landing page. Styles are inline; no external CSS. |
| `thankyou.html` | Post-submission page. |
| `js/main.js` | Validation, submit handling, success/failure detection. |
| `assets/` | Logo and headshot. |
| `backend/google-apps-script.gs` | Reference copy of the Apps Script. **Not deployed from here.** |

## Deploying

Drag this folder onto Netlify. That's the whole process.

The Apps Script is deployed separately from the Apps Script editor and is
**not** updated by deploying this folder.

## Editing the Apps Script

1. Open the Apps Script project (owned by dgneryoffice611@gmail.com).
2. Paste the new code over `Code.gs`.
3. **Deploy → Manage deployments → pencil → Version: New version → Deploy.**
   Editing the existing deployment keeps the same URL. Creating a *new*
   deployment issues a different URL and silently breaks the form.
4. Copy the final code back into `backend/google-apps-script.gs` and commit it.

## Gotchas — all of these have bitten this project

- **A broken form used to look identical to a working one.** The old code used
  `fetch(..., { mode: "no-cors" })`, which makes the response unreadable, then
  redirected to the thank-you page regardless. A 403 outage went unnoticed for
  days. The current code reads the response and reports real failures. Don't
  reintroduce `no-cors`.
- **Deployment access resets.** If the web app's "Who has access" isn't
  **Anyone**, every submission gets a 403 before the script runs — no sheet
  row, no emails, no execution log. The Google account must also be verified.
- **Field names are a contract.** The `name` attributes in `index.html` must
  match what `doPost` reads. Rename one and that column silently goes blank.
- **Selling-timeframe values must match exactly** (`0-3 months`, `3-6 months`,
  `6-12 months`, `12+ months`, `Just curious`).
- **A filter on the Leads sheet hides new rows.** If a lead seems missing,
  check the filter before assuming the script failed.

## Brand

- Black `#1A1819` — sampled from the logo, not guessed
- Gold `#C8A951`
- Display: Bodoni Moda · Body: Jost
- Sparkle clusters are generated in JS, mirroring her business card

## Verifying which version is deployed

View source on the live site and search for `script.google.com`. The Apps
Script deployment ID identifies the build:

- `AKfycbzwANRC…` → current
