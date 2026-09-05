/* ============================================================
   CLIENT CONFIRMATION EMAIL — replacement block
   Paste this over the existing client-email section at the
   bottom of doPost(), just above:  return ContentService...
   ============================================================ */

  // Escape anything the lead typed, so a stray < or & can't break the HTML
  const esc = (s) => String(s || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const FIRST = esc(firstName) || "there";

  const clientSubject = "Thank you — Your Free Home Evaluation Request";

  // Plain-text fallback. NOTE: no hard line breaks inside a paragraph —
  // that is what caused the ragged wrapping on mobile.
  const clientPlain =
    "Hi " + (firstName || "there") + ",\n\n" +
    "Thank you for requesting a free home evaluation with Denerys Goenaga at DGNery Realty. Denerys will contact you shortly to discuss next steps.\n\n" +
    "Need to sell fast? Call or text Denerys at (347) 707-9937.\n\n" +
    "Talk soon,\n" +
    "Denerys Goenaga\n" +
    "Licensed Real Estate Broker | NY Lic. #10401205315\n" +
    "DGNery Realty | 2560 Matthews Ave., Ste. 1, Bronx, NY 10467\n" +
    "(347) 707-9937 | dgneryoffice611@gmail.com";

  const clientHtml =
  '<div style="margin:0;padding:0;background:#f5f5f5;">' +
    '<div style="max-width:600px;margin:0 auto;background:#ffffff;padding:28px 24px;' +
                'font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Arial,sans-serif;' +
                'font-size:16px;line-height:1.6;color:#16232a;">' +

      '<p style="margin:0 0 16px;">Hi ' + FIRST + ',</p>' +

      '<p style="margin:0 0 16px;">Thank you for requesting a free home evaluation with ' +
        '<strong>Denerys Goenaga</strong> at DGNery Realty. Denerys will contact you shortly ' +
        'to discuss next steps.</p>' +

      '<p style="margin:0 0 24px;">Need to sell fast? Call or text ' +
        '<a href="tel:+13477079937" style="color:#a98c3f;font-weight:bold;text-decoration:none;">' +
        '(347)&nbsp;707-9937</a>.</p>' +

      '<div style="border-top:1px solid #e5e7eb;padding-top:16px;font-size:14px;color:#6b7280;">' +
        '<p style="margin:0 0 4px;color:#16232a;font-weight:bold;">Denerys Goenaga</p>' +
        '<p style="margin:0 0 4px;">Licensed Real Estate Broker &middot; NY Lic. #10401205315</p>' +
        '<p style="margin:0 0 4px;">DGNery Realty &middot; 2560 Matthews Ave., Ste. 1, Bronx, NY 10467</p>' +
        '<p style="margin:0;">' +
          '<a href="tel:+13477079937" style="color:#a98c3f;text-decoration:none;">(347)&nbsp;707-9937</a>' +
          ' &middot; ' +
          '<a href="mailto:dgneryoffice611@gmail.com" style="color:#a98c3f;text-decoration:none;">dgneryoffice611@gmail.com</a>' +
        '</p>' +
      '</div>' +

    '</div>' +
  '</div>';

  if (email && email.toLowerCase() !== NOTIFY_EMAIL.toLowerCase()) {
    MailApp.sendEmail({
      to: email,
      subject: clientSubject,
      body: clientPlain,
      htmlBody: clientHtml,
      name: "Denerys Goenaga — DGNery Realty",
      replyTo: NOTIFY_EMAIL
    });
  }
