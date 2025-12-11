import db from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function testProposals() {
  console.log('🔍 Testing Proposals System...\n');

  try {
    // 1. Check RFPs
    console.log('1️⃣ Checking RFPs...');
    const [rfps] = await db.query('SELECT id, title, status, sent_at FROM rfps ORDER BY id DESC LIMIT 5');
    console.log(`Found ${rfps.length} RFPs:`);
    rfps.forEach(rfp => {
      console.log(`  - RFP #${rfp.id}: ${rfp.title} (${rfp.status})`);
    });
    console.log('');

    // 2. Check Vendors
    console.log('2️⃣ Checking Vendors...');
    const [vendors] = await db.query('SELECT id, name, email FROM vendors');
    console.log(`Found ${vendors.length} vendors:`);
    vendors.forEach(v => {
      console.log(`  - Vendor #${v.id}: ${v.name} (${v.email})`);
    });
    console.log('');

    // 3. Check RFP-Vendor Associations
    console.log('3️⃣ Checking RFP-Vendor Associations...');
    const [associations] = await db.query(`
      SELECT rv.rfp_id, r.title, rv.vendor_id, v.name 
      FROM rfp_vendors rv
      JOIN rfps r ON rv.rfp_id = r.id
      JOIN vendors v ON rv.vendor_id = v.id
      ORDER BY rv.rfp_id DESC
    `);
    console.log(`Found ${associations.length} associations:`);
    associations.forEach(a => {
      console.log(`  - RFP #${a.rfp_id} "${a.title}" → Vendor #${a.vendor_id} "${a.name}"`);
    });
    console.log('');

    // 4. Check Proposals
    console.log('4️⃣ Checking Proposals...');
    const [proposals] = await db.query(`
      SELECT 
        p.id, 
        p.rfp_id, 
        p.vendor_id,
        r.title as rfp_title,
        v.name as vendor_name,
        p.total_price,
        p.received_at
      FROM proposals p
      JOIN rfps r ON p.rfp_id = r.id
      JOIN vendors v ON p.vendor_id = v.id
      ORDER BY p.id DESC
    `);
    console.log(`Found ${proposals.length} proposals:`);
    if (proposals.length === 0) {
      console.log('  ⚠️  NO PROPOSALS FOUND!');
      console.log('  This means emails are not being processed.');
      console.log('  Check:');
      console.log('    - Are emails marked as UNREAD in Gmail?');
      console.log('    - Is emailReceiver.js running?');
      console.log('    - Check logs/combined.log for errors');
    } else {
      proposals.forEach(p => {
        console.log(`  - Proposal #${p.id}: ${p.vendor_name} for "${p.rfp_title}"`);
        console.log(`    Price: ₹${p.total_price}, Received: ${new Date(p.received_at).toLocaleString()}`);
      });
    }
    console.log('');

    // 5. Check Proposal Items
    console.log('5️⃣ Checking Proposal Items...');
    const [items] = await db.query(`
      SELECT 
        pi.id,
        pi.proposal_id,
        pi.item_name,
        pi.quantity,
        pi.total_price,
        p.vendor_id,
        v.name as vendor_name
      FROM proposal_items pi
      JOIN proposals p ON pi.proposal_id = p.id
      JOIN vendors v ON p.vendor_id = v.id
      ORDER BY pi.id DESC
    `);
    console.log(`Found ${items.length} proposal items:`);
    if (items.length === 0 && proposals.length > 0) {
      console.log('  ⚠️  Proposals exist but NO ITEMS!');
      console.log('  Check AI parsing in emailReceiver.js');
    } else {
      items.forEach(item => {
        console.log(`  - Item #${item.id}: ${item.item_name} (Proposal #${item.proposal_id} by ${item.vendor_name})`);
        console.log(`    Qty: ${item.quantity}, Price: ₹${item.total_price}`);
      });
    }
    console.log('');

    // 6. Test specific RFP
    if (rfps.length > 0) {
      const testRfpId = rfps[0].id;
      console.log(`6️⃣ Testing API for RFP #${testRfpId}...`);
      const [testProposals] = await db.query(`
        SELECT 
          p.*,
          v.name as vendor_name,
          v.email as vendor_email,
          r.title as rfp_title
        FROM proposals p
        INNER JOIN vendors v ON p.vendor_id = v.id
        INNER JOIN rfps r ON p.rfp_id = r.id
        WHERE p.rfp_id = ?
      `, [testRfpId]);
      
      console.log(`Found ${testProposals.length} proposals for RFP #${testRfpId}`);
      
      if (testProposals.length === 0) {
        console.log('  ℹ️  This RFP has no proposals yet.');
        console.log('  To test:');
        console.log(`    1. Send RFP #${testRfpId} to vendors`);
        console.log('    2. Have vendors reply to the email');
        console.log('    3. Mark emails as UNREAD in Gmail');
        console.log('    4. Wait for email polling (every 5 minutes)');
      } else {
        console.log('  ✅ API would return:');
        testProposals.forEach(p => {
          console.log(`    - ${p.vendor_name}: ₹${p.total_price}`);
        });
      }
    }
    console.log('');

    console.log('✅ Test complete!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`  RFPs: ${rfps.length}`);
    console.log(`  Vendors: ${vendors.length}`);
    console.log(`  Associations: ${associations.length}`);
    console.log(`  Proposals: ${proposals.length}`);
    console.log(`  Items: ${items.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

testProposals();