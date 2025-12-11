// test-email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  requireTLS: true,
  debug: true,
  logger: true
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Server is ready to send emails');
    
    // Send test email
    transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'Test Email',
      text: 'If you receive this, SMTP is working!'
    }, (err, info) => {
      if (err) {
        console.error('❌ Send failed:', err);
      } else {
        console.log('✅ Email sent:', info.messageId);
      }
    });
  }
});