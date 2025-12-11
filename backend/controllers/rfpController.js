import * as rfpService from '../services/rfpService.js';
import logger from '../utils/logger.js';
import { sendRfpToVendor } from '../services/emailService.js';
import db from '../config/database.js';
import { parseRfpText } from '../services/rfpParserService.js';

// CREATE RFP (Option A - Natural language only)
export async function createRfp(req, res, next) {
  try {
    const { naturalLanguageDescription, vendorIds } = req.body;

    if (!naturalLanguageDescription?.trim()) {
      return res.status(400).json({ error: "naturalLanguageDescription is required" });
    }

    const parsed = await parseRfpText(naturalLanguageDescription);

    const {
      title,
      description,
      budget,
      deadline,
      paymentTerms,
      warranty,
      requirements,
      deadlineDays
    } = parsed;

    if (!title?.trim()) {
      return res.status(400).json({ error: "Failed to generate title" });
    }

    const [result] = await db.query(
      `INSERT INTO rfps 
      (title, description, budget, deadline, deadline_days, payment_terms, warranty, requirements, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT')`,
      [
        title,
        description,
        budget || null,
        deadline || null,
        deadlineDays || null,
        paymentTerms || null,
        warranty || null,
        JSON.stringify(requirements || [])
      ]
    );

    const rfpId = result.insertId;

    // Save vendors (if any)
    if (vendorIds?.length) {
      const values = vendorIds.map(vId => [rfpId, vId]);
      await db.query(`INSERT INTO rfp_vendors (rfp_id, vendor_id) VALUES ?`, [values]);
    }

    res.json({ success: true, rfpId, parsedRfp: parsed });

  } catch (error) {
    logger.error("Error creating RFP:", error);
    next(error);
  }
}

// GET ALL
export async function getAllRfps(req, res, next) {
  try {
    const rfps = await rfpService.getAllRfps();
    res.json(rfps);
  } catch (error) {
    next(error);
  }
}

// GET BY ID
export async function getRfpById(req, res, next) {
  try {
    const rfp = await rfpService.getRfpById(req.params.id);
    if (!rfp) return res.status(404).json({ error: "RFP not found" });
    res.json(rfp);
  } catch (error) {
    next(error);
  }
}

// 🚀 UPDATE vendor selection (from modal)
export async function updateRfpVendors(req, res, next) {
  try {
    const rfpId = req.params.id;
    const { vendorIds } = req.body;

    if (!Array.isArray(vendorIds)) {
      return res.status(400).json({ error: "vendorIds must be an array" });
    }

    await db.query(`DELETE FROM rfp_vendors WHERE rfp_id = ?`, [rfpId]);

    if (vendorIds.length > 0) {
      const rows = vendorIds.map(vId => [rfpId, vId]);
      await db.query(`INSERT INTO rfp_vendors (rfp_id, vendor_id) VALUES ?`, [rows]);
    }

    res.json({ success: true, message: "Vendors updated", vendorCount: vendorIds.length });

  } catch (error) {
    next(error);
  }
}

// SEND RFP
export async function sendRfp(req, res, next) {
  try {
    const rfpId = req.params.id;

    const [rfps] = await db.query(`SELECT * FROM rfps WHERE id = ?`, [rfpId]);
    if (!rfps.length) return res.status(404).json({ error: "RFP not found" });
    const rfp = rfps[0];

    const [vendors] = await db.query(`
      SELECT v.* 
      FROM vendors v
      JOIN rfp_vendors rv ON rv.vendor_id = v.id
      WHERE rv.rfp_id = ?
    `, [rfpId]);

    if (!vendors.length) {
      return res.status(400).json({ error: "No vendors associated with this RFP" });
    }

    for (const vendor of vendors) {
      await sendRfpToVendor(rfp, vendor);
    }

    await db.query(`UPDATE rfps SET sent_at = NOW(), status = "SENT" WHERE id = ?`, [rfpId]);

    res.json({ success: true, message: `RFP sent to ${vendors.length} vendors` });

  } catch (error) {
    next(error);
  }
}

// PARSE RFP TEXT (AI)
export async function parseRfp(req, res, next) {
  try {
    const { naturalLanguageDescription } = req.body;
    if (!naturalLanguageDescription) {
      return res.status(400).json({ error: "naturalLanguageDescription is required" });
    }
    const parsed = await parseRfpText(naturalLanguageDescription);
    res.json({ success: true, parsedRfp: parsed });
  } catch (error) {
    next(error);
  }
}
