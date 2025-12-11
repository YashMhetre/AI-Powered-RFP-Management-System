import db from '../config/database.js';
import logger from '../utils/logger.js';

function formatRfp(rfp) {
  let requirements = null;
  if (rfp.requirements) {
    try {
      requirements = typeof rfp.requirements === 'string' 
        ? JSON.parse(rfp.requirements) 
        : rfp.requirements;
    } catch (e) {
      logger.warn('Failed to parse requirements JSON');
    }
  }

  return {
    id: rfp.id,
    title: rfp.title,
    description: rfp.description,
    budget: rfp.budget ? parseFloat(rfp.budget) : null,
    deadline: rfp.deadline,
    deadlineDays: rfp.deadline_days,
    paymentTerms: rfp.payment_terms,
    warranty: rfp.warranty,
    requirements,
    status: rfp.status,
    sentAt: rfp.sent_at,
    createdAt: rfp.created_at,
    proposalCount: rfp.proposal_count || 0,
    vendorCount: rfp.vendor_count || 0
  };
}

export async function getAllRfps() {
  try {
    const [rfps] = await db.query(`
      SELECT 
        r.*,
        COUNT(DISTINCT p.id) as proposal_count
      FROM rfps r
      LEFT JOIN proposals p ON r.id = p.rfp_id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `);
    
    return rfps.map(formatRfp);
  } catch (error) {
    logger.error('Error getting all RFPs:', error.message);
    throw error;
  }
}

export async function getRfpById(id) {
  try {
    const [rfps] = await db.query('SELECT * FROM rfps WHERE id = ?', [id]);
    
    if (rfps.length === 0) {
      return null;
    }
    
    return formatRfp(rfps[0]);
  } catch (error) {
    logger.error('Error getting RFP by ID:', error.message);
    throw error;
  }
}

export async function createRfp(rfpData) {
  try {
    const { title, description, budget, deadline, deadlineDays, paymentTerms, warranty, requirements } = rfpData;
    
    const requirementsJson = requirements ? JSON.stringify(requirements) : null;
    
    const [result] = await db.query(`
      INSERT INTO rfps (title, description, budget, deadline, deadline_days, payment_terms, warranty, requirements, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', NOW())
    `, [title, description, budget || null, deadline || null, deadlineDays || null, paymentTerms || null, warranty || null, requirementsJson]);

    const [rfps] = await db.query('SELECT * FROM rfps WHERE id = ?', [result.insertId]);
    logger.info(`Created RFP: ${title}`);
    return formatRfp(rfps[0]);
  } catch (error) {
    logger.error('Error creating RFP:', error.message);
    throw error;
  }
}

export async function sendRfpToVendors(rfpId, vendorIds) {
  try {
    // Update RFP status
    await db.query(`
      UPDATE rfps 
      SET status = 'SENT', sent_at = NOW() 
      WHERE id = ?
    `, [rfpId]);

    // Save vendor mappings (if rfp_vendors table exists)
    for (const vendorId of vendorIds) {
      try {
        await db.query(`
          INSERT IGNORE INTO rfp_vendors (rfp_id, vendor_id) 
          VALUES (?, ?)
        `, [rfpId, vendorId]);
      } catch (e) {
        logger.warn(`Failed to insert rfp_vendor mapping: ${e.message}`);
      }
    }

    const rfp = await getRfpById(rfpId);
    logger.info(`RFP ${rfpId} sent to ${vendorIds.length} vendors`);
    return rfp;
  } catch (error) {
    logger.error('Error sending RFP:', error.message);
    throw error;
  }
}