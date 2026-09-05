function doPost(e) {
  const SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";
  const NOTIFY_EMAIL = "dgneryoffice611@gmail.com";

  const TIMEFRAME_SHEETS = {
    "0-3 months": "0-3 months",
    "3-6 months": "3-6 months",
    "6-12 months": "6-12 months",
    "12+ months": "12+ months",
    "Just curious": "Just curious"
  };

  const ss = SpreadsheetApp.openById(SHEET_ID);
  const data = (e && e.parameter) ? e.parameter : {};
  const ts = new Date();

  const firstName = (data.first_name || data.firstName || "").toString().trim();
  const lastName  = (data.last_name  || data.lastName  || "").toString().trim();
  const email     = (data.email || "").toString().trim();
  const phone     = (data.phone || "").toString().trim();
  const address   = (data.property_address || data.address || "").toString().trim();
  const timeframe = (data.selling_timeframe || data.timeframe || "").toString().trim();
  const condition = (data.home_condition || data.condition || "").toString().trim();
  const formNotes = (data.anything_else || data.notes || "").toString().trim();

  const saleType    = (data.sale_type || "").toString().trim();
  const cmaPurchase = (data.cma_purchase || "").toString().trim();
  const evalReason  = (data.valuation_reason || "").toString().trim();

  const targetName = TIMEFRAME_SHEETS[timeframe] || "0-3 months";
  let sheet = ss.getSheetByName(targetName);
  if (!sheet) sheet = ss.insertSheet(targetName);

  const headers = [
    "Timestamp","First Name","Last Name","Email","Phone","Property Address",
    "Selling Timeframe","Home Condition","Type of Sale","Purchase CMA?","Reason for Evaluation",
    "Form Notes","Contacted","Not Contacted","Agent Notes"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1,1,1,headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  } else {
    const existing = sheet.getRange(1,1,1,headers.length).getValues()[0];
    if (existing.filter(String).length === 0) {
      sheet.getRange(1,1,1,headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
  }

  sheet.appendRow([
    ts, firstName, lastName, email, phone, address,
    timeframe, condition, saleType, cmaPurchase, evalReason,
    formNotes, false, false, ""
  ]);

  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 13, 1, 2).insertCheckboxes();

  const agentSubject = "NEW SELLER LEAD (Home Evaluation Request)";
  const agentBody =
`New Seller Lead:

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Address: ${address}

Timeframe: ${timeframe}
Home Condition: ${condition}

Type of Sale: ${saleType}
Purchase CMA?: ${cmaPurchase}
Reason for Evaluation: ${evalReason}

Notes: ${formNotes}

Timestamp: ${ts}`;

  MailApp.sendEmail(NOTIFY_EMAIL, agentSubject, agentBody);

  const clientSubject = "We received your home eevaluation request";
  const clientBody =
`Hi ${firstName || "there"},

Thank you for requesting your free home evaluation.
Denerys will contact you shortly to discuss next steps.

DG Nery Realty Ltd`;

  if (email && email.toLowerCase() !== NOTIFY_EMAIL.toLowerCase()) {
    MailApp.sendEmail(email, clientSubject, clientBody);
  }

  return ContentService.createTextOutput("OK");
}
