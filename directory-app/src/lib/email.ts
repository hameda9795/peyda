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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Uw inlogcode</h1>
      <p>Beste,</p>
      <p>Uw verificatiecode is:</p>
      <div style="background: #F3F4F6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">
        ${code}
      </div>
      <p style="color: #6B7280; font-size: 14px;">
        Deze code is <strong>3 uur</strong> geldig.
      </p>
      <p style="color: #9CA3AF; font-size: 12px;">
        Deel deze code niet met anderen.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'mail@peyda.nl',
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
