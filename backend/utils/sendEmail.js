const nodemailer = require('nodemailer');

const transporter =
  process.env.SMTP_HOST &&
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    console.log(`[Email skipped] To: ${to} | ${subject}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'JobPortal <noreply@jobportal.com>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
