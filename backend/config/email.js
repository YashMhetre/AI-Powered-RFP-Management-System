import Imap from 'node-imap';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';
import db from './config/database.js';
import { parseVendorProposal } from './services/aiService.js';

dotenv.config();

console.log('🔍 Processing ALL emails (read or unread)...\n');

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

imap.once('ready', () => {
  console.log('✅ Connected to IMAP\n');
  
  imap.openBox('INBOX', false, (err, box) => {
    if (err) {
      console.error('❌ Failed to open inbox:', err.message);
      process.exit(1);
    }
    
    // Search for emails from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    console.log(`📅 Searching for emails since ${sevenDaysAgo.toLocaleDateString()}...\n`);
    
    imap.search(['SINCE', sevenDaysAgo], async (err, results) => {
      if (err) {
        console.error('❌ Search failed:', err.message);
        process.exit(1);
      }
      
      if (!results || results.length === 0) {
        console.log('⚠️  No emails found in last 7 days');
        process.exit(0);
      }
      
      console.log(`📧 Found ${results.length} email(s)\n`);
      
      const fetch = imap.fetch(results, { bodies: '' });
      let processedCount = 0;
      
      fetch.on('message', (msg) => {
        msg.on('body', (stream) => {
          simpleParser(stream, async (err, parsed) => {
            if (err) {
              console.error('❌ Failed to parse email:', err.message);
              return;
            }
            
            try {
              await processEmail(parsed);
              processedCount++;
            } catch (error) {
              console.error('❌ Error processing email:', error.message);
            }
          });
        });
      });
      
      fetch.once('end', async () => {
        console.log(`\n✅ Processed ${processedCount} email(s)`);
        
        // Show results
        const [proposals] = await db.query('SELECT COUNT(*) as count FROM proposals');
        console.log(`\n💾 Total proposals in database: ${proposals[0].count}`);
        
        imap.end();
        process.exit(0);
      });
      
      fetch.once('error', (err) => {
        console.error('❌ Fetch error:', err.message);
        process.exit(1);
      });
    });
  });
});

imap.once('error', (err) => {
  console.error('❌ IMAP error:', err.message);
  process.exit(1);
});

async function processEmail(parsed) {
  const fromEmail = parsed.from?.value[0]?.address;
  const subject = parsed.subject;
  const body = parsed.text || parsed.html || '';
  
  if (!fromEmail) {
    console.log('⚠️  Email has no sender address');
    return;
  }
  
  console.log(`📧 From: ${fromEmail}`);
  console.log(`   Subject: ${subject}`);
  
  // Check if it's a reply to an RFP
  if (!subject || (!subject.includes('RFP') && !subject.toLowerCase().includes('re:'))) {
    console.log('   ⏭️  Skipping (not an RFP reply)\n');
    return;
  }
  
  try {
    // Find vendor by email
    const [vendors] = await db.query(
      'SELECT * FROM vendors WHERE email = ?',
      [fromEmail]
    );
    
    if (vendors.length === 0) {
      console.log(`   ⚠️  Unknown vendor: ${fromEmail}\n`);
      return;
    }
    
    const vendor = vendors[0];
    console.log(`   ✅ Vendor found: ${vendor.name}`);
    
    // Find matching RFP
    const [rfps] = await db.query(`
      SELECT r.* FROM rfps r
      INNER JOIN rfp_vendors rv ON r.id = rv.rfp_id
      WHERE rv.vendor_id = ? AND r.sent_at IS NOT NULL
      ORDER BY r.sent_at DESC
      LIMIT 1
    `, [vendor.id]);
    
    if (rfps.length === 0) {
      console.log(`   ⚠️  No matching RFP found\n`);
      return;
    }
    
    const rfp = rfps[0];
    console.log(`   ✅ RFP found: ${rfp.title}`);
    
    // Check if proposal already exists
    const [existing] = await db.query(
      'SELECT id FROM proposals WHERE rfp_id = ? AND vendor_id = ?',
      [rfp.id, vendor.id]
    );
    
    if (existing.length > 0) {
      console.log(`   ℹ️  Proposal already exists (ID: ${existing[0].id})\n`);
      return;
    }
    
    console.log('   🤖 Parsing with AI...');
    
    // Use AI to parse
    const parsedData = await parseVendorProposal(body, rfp.requirements || '{}');
    
    // Create proposal - FIXED: using created_at, updated_at, received_at
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
    
    // Insert items
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
    
    console.log(`   ✅ Created proposal (ID: ${proposalId})`);
    console.log(`   💰 Total: $${parsedData.totalPrice || 'N/A'}`);
    console.log(`   🚚 Delivery: ${parsedData.deliveryDays || 'N/A'} days\n`);
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
  }
}

console.log('🔌 Connecting to IMAP...');
imap.connect();