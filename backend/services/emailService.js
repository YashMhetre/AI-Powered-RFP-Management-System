import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

// Create transporter with proper TLS configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // false for port 587, true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  requireTLS: true,
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 15000,
  debug: process.env.NODE_ENV === 'development', // Enable debug in dev
  logger: process.env.NODE_ENV === 'development' // Enable logger in dev
});

// Verify transporter with better error handling
transporter.verify((error, success) => {
  if (error) {
    // Convert error to string properly
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error('❌ SMTP configuration error:', errorMsg);
    
    // Log additional details if available
    if (error.code) logger.error('Error code:', error.code);
    if (error.command) logger.error('Failed command:', error.command);
  } else {
    logger.info('✅ SMTP server ready to send emails');
  }
});

/**
 * Send RFP to vendor via email
 */
export async function sendRfpToVendor(rfp, vendor) {
  try {
    const emailBody = buildRfpEmailBody(rfp, vendor);
    
    const mailOptions = {
      from: `"RFP Manager" <${process.env.SMTP_USER}>`,
      to: vendor.email,
      subject: `RFP: ${rfp.title}`,
      html: emailBody
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`✅ RFP sent to ${vendor.name} (${vendor.email})`);
    return info;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to send RFP to ${vendor.email}:`, errorMsg);
    throw error;
  }
}

/**
 * Generic send email function
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    const mailOptions = {
      from: `"RFP Manager" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || text
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`✅ Email sent to ${to}`);
    return info;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to send email to ${to}:`, errorMsg);
    throw error;
  }
}

/**
 * Build HTML email body for RFP
 */
function buildRfpEmailBody(rfp, vendor) {
  const requirements = rfp.requirements ? JSON.parse(rfp.requirements) : {};
  const itemsList = requirements.items?.map(item => 
    `<li>${item.quantity}x ${item.itemName} - ${item.specifications}</li>`
  ).join('') || '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .details { background-color: #f4f4f4; padding: 15px; margin: 20px 0; border-left: 4px solid #4CAF50; }
        .footer { background-color: #f4f4f4; padding: 15px; text-align: center; margin-top: 20px; }
        ul { list-style-type: none; padding-left: 0; }
        li { padding: 5px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Request for Proposal</h1>
      </div>
      
      <div class="content">
        <p>Dear ${vendor.contactPerson || vendor.name},</p>
        
        <p>We are pleased to invite you to submit a proposal for the following project:</p>
        
        <div class="details">
          <h2>${rfp.title}</h2>
          <p><strong>Description:</strong> ${rfp.description || 'N/A'}</p>
          <p><strong>Budget:</strong> $${rfp.budget || 'TBD'}</p>
          <p><strong>Deadline:</strong> ${rfp.deadline || 'TBD'}</p>
        </div>
        
        <h3>Requirements:</h3>
        <div class="details">
          <ul>${itemsList}</ul>
          ${requirements.paymentTerms ? `<p><strong>Payment Terms:</strong> ${requirements.paymentTerms}</p>` : ''}
          ${requirements.warranty ? `<p><strong>Warranty:</strong> ${requirements.warranty}</p>` : ''}
        </div>
        
        <h3>Submission Instructions:</h3>
        <p>Please reply to this email with your proposal including:</p>
        <ul>
          <li>✓ Detailed pricing for each item</li>
          <li>✓ Delivery timeline</li>
          <li>✓ Payment terms</li>
          <li>✓ Warranty information</li>
          <li>✓ Any additional terms and conditions</li>
        </ul>
        
        <p><strong>Please submit your proposal by replying directly to this email.</strong></p>
      </div>
      
      <div class="footer">
        <p>Thank you for your consideration. We look forward to reviewing your proposal.</p>
        <p><em>This is an automated email from RFP Management System</em></p>
      </div>
    </body>
    </html>
  `;
}

export default {
  sendRfpToVendor,
  sendEmail
};