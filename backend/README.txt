Backend files for DG Nery Realty Ltd seller lead funnel.

- google-apps-script.gs
  Paste into Google Apps Script (Code.gs) connected to your lead Google Sheet.
  Update:
    - SHEET_ID (required)
    - SHEET_NAME (optional; defaults to 'Seller Leads')
    - NOTIFY_EMAIL (defaults to dgneryoffice611@gmail.com)

After deploying as a Web App:
- Copy the Web App URL
- Paste it into index.html in the form action attribute:
    action="YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"

Front-end pages:
- index.html (landing page + form)
- thankyou.html (thank-you page)

Assets:
- assets/logo.jpg (provided)
- assets/headshot.jpeg (provided)
- assets/background.png (hero background)
