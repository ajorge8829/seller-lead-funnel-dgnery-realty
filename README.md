# Seller Lead Funnel — DGNery Realty

A responsive real estate seller lead generation funnel built for Denerys Goenaga, Licensed Real Estate Broker at DGNery Realty, serving homeowners in New York City and Westchester County looking to sell.

## What it does

- Presents a mobile-friendly landing page with a free home evaluation offer
- Captures seller details (contact info, property address, timeframe, home condition, sale type) through a validated multi-field form
- Submits leads directly to a Google Sheet via a Google Apps Script web app, with automatic sheet creation by selling timeframe
- Sends the agent an instant email notification for every new lead
- Sends the homeowner an automatic confirmation email
- Redirects to a branded thank-you page after submission

## Tech stack

- Frontend: HTML5, CSS3 (custom properties, responsive grid/flex layouts, CSS animations), vanilla JavaScript (form validation, fetch-based submission, no frameworks)
- Backend: Google Apps Script (serverless), writing to Google Sheets and sending email via MailApp
- Hosting: Static hosting (Netlify)

## Setup

1. Copy backend/google-apps-script.gs into a Google Apps Script project bound to your target Google Sheet.
2. Update SHEET_ID and NOTIFY_EMAIL in the script.
3. Deploy the script as a Web App and copy the deployment URL.
4. Paste that URL into the form action attribute in index.html, replacing YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE.
5. Deploy index.html, thankyou.html, css/, js/, and assets/ to your static host of choice.

## Files

- index.html — Landing page with lead capture form
- thankyou.html — Post-submission confirmation page
- css/style.css — Styling for both pages
- js/main.js — Client-side validation and form submission logic
- backend/google-apps-script.gs — Server-side lead handler (Sheets logging + email notifications)
- backend/client-email-replacement.gs — Enhanced HTML confirmation email template
