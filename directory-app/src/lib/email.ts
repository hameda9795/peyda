import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.privateemail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(email: string, code: string) {
  const html = `
<!DOCTYPE html>
<html dir="ltr" lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Uw inlogcode voor Peyda.nl</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F3F4F6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F3F4F6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 32px 40px; border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700;">Peyda.nl</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 14px;">jouw bedrijf, jouw zichtbaarheid</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 24px 0; color: #1F2937; font-size: 20px; font-weight: 600;">Welkom bij Peyda.nl</h2>
              <p style="margin: 0 0 24px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                Gebruik de onderstaande verificatiecode om in te loggen of je account te verifiëren:
              </p>

              <!-- OTP Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #4F46E5; background: #FFFFFF; padding: 16px 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.1);">
                      ${code}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Expiry Warning -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF3C7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0; color: #92400E; font-size: 14px; font-weight: 500;">
                      ⏱️ Deze code is <strong>10 minuten</strong> geldig. Na 10 minuten moet je een nieuwe code aanvragen.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <p style="margin: 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                <strong>Veiligheidstip:</strong> Deel deze code nooit met anderen. Ons team zal je nooit om deze code vragen.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 24px 40px; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 12px;">
                Dit is een automatisch verzonden e-mail. Reply niet op dit bericht.
              </p>
              <p style="margin: 0; color: #9CA3AF; font-size: 11px;">
                © ${new Date().getFullYear()} Peyda.nl - Alle rechten voorbehouden
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@peyda.nl',
    to: email,
    subject: 'Uw inlogcode voor Peyda.nl',
    html,
  });
}

export async function verifySMTPConnection() {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('SMTP Connection failed:', error);
    return false;
  }
}
