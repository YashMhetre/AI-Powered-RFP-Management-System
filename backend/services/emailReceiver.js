import Imap from 'node-imap';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import db from '../config/database.js';
import { parseVendorProposal } from './aiService.js';

dotenv.config();

const processedMessageIds = new Set();

/**
 * Start email polling for vendor responses
 */
export async function startEmailPolling() {
  logger.info('📬 Checking for new proposal emails...');

  return new Promise((resolve) => {
    const imap = new Imap({
      user: process.env.IMAP_USER,
      password: process.env.IMAP_PASS,
      host: process.env.IMAP_HOST,
      port: parseInt(process.env.IMAP_PORT),
      tls: true,
      tlsOptions: { 
        rejectUnauthorized: false,
        servername: process.env.IMAP_HOST
      },
      authTimeout: 10000,
      connTimeout: 10000,
      keepalive: false
    });

    let connectionClosed = false;

    const closeConnection = () => {
      if (!connectionClosed) {
        connectionClosed = true;
        try {
          imap.end();
        } catch (e) {
          // Ignore close errors
        }
      }
    };

    const timeout = setTimeout(() => {
      logger.warn('⏰ IMAP operation timeout - closing connection');
      closeConnection();
      resolve();
    }, 25000);

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          logger.error('Failed to open inbox:', err.message);
          clearTimeout(timeout);
          closeConnection();
          resolve();
          return;
        }

        imap.search(['UNSEEN'], (err, results) => {
          if (err) {
            logger.error('Search failed:', err.message);
            clearTimeout(timeout);
            closeConnection();
            resolve();
            return;
          }

          if (!results || results.length === 0) {
            logger.info('No new emails found');
            clearTimeout(timeout);
            closeConnection();
            resolve();
            return;
          }

          logger.info(`Found ${results.length} unread email(s)`);

          const fetch = imap.fetch(results, { bodies: '' });
          let processedCount = 0;

          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, async (err, parsed) => {
                if (err) {
                  logger.error('Failed to parse email:', err.message);
                  return;
                }

                try {
                  await processProposalEmail(parsed);
                } catch (error) {
                  logger.error('Error processing email:', error.message);
                }
              });
            });

            msg.once('end', () => {
              processedCount++;
            });
          });

          fetch.once('end', () => {
            logger.info(`✅ Finished processing ${processedCount} email(s)`);
            clearTimeout(timeout);
            closeConnection();
            resolve();
          });

          fetch.once('error', (err) => {
            logger.error('Fetch error:', err.message);
            clearTimeout(timeout);
            closeConnection();
            resolve();
          });
        });
      });
    });

    imap.once('error', (err) => {
      if (err.message && !err.message.includes('ECONNRESET')) {
        logger.error('IMAP connection error:', err.message);
      }
      clearTimeout(timeout);
      closeConnection();
      resolve();
    });

    imap.once('end', () => {
      clearTimeout(timeout);
      resolve();
    });

    try {
      imap.connect();
    } catch (err) {
      logger.error('Failed to connect to IMAP:', err.message);
      clearTimeout(timeout);
      resolve();
    }
  });
}

/**
 * Process a proposal email
 */
async function processProposalEmail(parsed) {
  const messageId = parsed.messageId;
  const fromEmail = parsed.from?.value[0]?.address;
  const subject = parsed.subject;
  const body = parsed.text || parsed.html || '';

  if (!fromEmail) {
    logger.warn('Email has no sender address');
    return;
  }

  if (processedMessageIds.has(messageId)) {
    logger.debug(`Message already processed: ${messageId}`);
    return;
  }

  logger.info(`📧 Processing email from: ${fromEmail} - Subject: ${subject}`);

  try {
    // Find vendor by email
    const [vendors] = await db.query(
      'SELECT * FROM vendors WHERE email = ?',
      [fromEmail]
    );

    if (vendors.length === 0) {
      logger.warn(`⚠️ Email from unknown vendor: ${fromEmail}`);
      return;
    }

    const vendor = vendors[0];

    // Find matching RFP (most recent sent RFP that includes this vendor)
    const [rfps] = await db.query(`
      SELECT r.* FROM rfps r
      INNER JOIN rfp_vendors rv ON r.id = rv.rfp_id
      WHERE rv.vendor_id = ? AND r.sent_at IS NOT NULL
      ORDER BY r.sent_at DESC
      LIMIT 1
    `, [vendor.id]);

    if (rfps.length === 0) {
      logger.warn(`⚠️ No matching RFP found for vendor: ${vendor.name}`);
      return;
    }

    const rfp = rfps[0];

    // Check if proposal already exists
    const [existing] = await db.query(
      'SELECT id FROM proposals WHERE rfp_id = ? AND vendor_id = ?',
      [rfp.id, vendor.id]
    );

    if (existing.length > 0) {
      logger.info(`ℹ️ Proposal already exists for RFP ${rfp.id} and vendor ${vendor.id}`);
      processedMessageIds.add(messageId);
      return;
    }

    logger.info(`🤖 Using AI to parse proposal from ${vendor.name}...`);

    // Use AI to parse the proposal
    const parsedData = await parseVendorProposal(body, rfp.requirements || '{}');

    // Create proposal in database - FIXED: using created_at, updated_at, received_at
    const [proposalResult] = await db.query(`
      INSERT INTO proposals 
      (rfp_id, vendor_id, total_price, delivery_days, payment_terms, warranty, raw_email_body, ai_summary, created_at, updated_at, received_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
    `, [
      rfp.id,
      vendor.id,
      parsedData.totalPrice || null,
      parsedData.deliveryDays || null,
      parsedData.paymentTerms || null,
      parsedData.warranty || null,
      body,
      parsedData.summary || null
    ]);

    const proposalId = proposalResult.insertId;

    // Insert proposal items
    if (parsedData.items && parsedData.items.length > 0) {
      const itemValues = parsedData.items.map(item => [
        proposalId,
        item.itemName,
        item.quantity || null,
        item.unitPrice || null,
        item.totalPrice || null,
        item.specifications || null
      ]);

      await db.query(`
        INSERT INTO proposal_items 
        (proposal_id, item_name, quantity, unit_price, total_price, specifications)
        VALUES ?
      `, [itemValues]);
    }

    processedMessageIds.add(messageId);
    logger.info(`✅ Successfully processed proposal from ${vendor.name} (Proposal ID: ${proposalId})`);

  } catch (error) {
    logger.error(`❌ Error processing proposal from ${fromEmail}:`, error.message);
    if (error.stack) {
      logger.debug(error.stack);
    }
  }
}

export default {
  startEmailPolling
};