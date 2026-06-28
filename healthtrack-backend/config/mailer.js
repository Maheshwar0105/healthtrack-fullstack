import nodemailer from 'nodemailer';

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    // Generate test SMTP service account from ethereal.email if no host configured
    let transporter;
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback for development/testing: mock transporter or Ethereal Email
      transporter = nodemailer.createTransport({
        jsonTransport: true // Prints mail JSON details to console and returns it
      });
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || '"HealthTrack Pro" <no-reply@healthtrack.com>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    if (!process.env.SMTP_HOST) {
      console.log('--- Development Email Sent ---');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${text}`);
      console.log('------------------------------');
    }
    return info;
  } catch (error) {
    console.error('Mailer Error:', error);
    throw error;
  }
};
