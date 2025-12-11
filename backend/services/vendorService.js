import db from '../config/database.js';
import logger from '../utils/logger.js';

function formatVendor(vendor) {
  return {
    id: vendor.id,
    name: vendor.name,
    email: vendor.email,
    contactPerson: vendor.contact_person,
    phone: vendor.phone,
    category: vendor.category,
    rating: vendor.rating ? parseFloat(vendor.rating) : null,
    active: vendor.active ? (vendor.active[0] === 1 || vendor.active === 1) : false,
    notes: vendor.notes,
    createdAt: vendor.created_at
  };
}

export async function createVendor(vendorData) {
  try {
    const { name, email, contactPerson, phone, category, rating, active, notes } = vendorData;

    const [existing] = await db.query('SELECT id FROM vendors WHERE email = ?', [email]);
    if (existing.length > 0) {
      throw new Error(`Vendor with email ${email} already exists`);
    }

    const [result] = await db.query(`
      INSERT INTO vendors (name, email, contact_person, phone, category, rating, active, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [name, email, contactPerson || null, phone || null, category || null, rating || null, active !== false ? 1 : 0, notes || null]);

    const [vendors] = await db.query('SELECT * FROM vendors WHERE id = ?', [result.insertId]);
    logger.info(`Created vendor: ${name}`);
    return formatVendor(vendors[0]);
  } catch (error) {
    logger.error('Error creating vendor:', error.message);
    throw error;
  }
}

export async function getAllVendors() {
  try {
    const [vendors] = await db.query('SELECT * FROM vendors ORDER BY name');
    return vendors.map(formatVendor);
  } catch (error) {
    logger.error('Error getting all vendors:', error.message);
    throw error;
  }
}

export async function getActiveVendors() {
  try {
    const [vendors] = await db.query('SELECT * FROM vendors WHERE active = 1 ORDER BY name');
    return vendors.map(formatVendor);
  } catch (error) {
    logger.error('Error getting active vendors:', error.message);
    throw error;
  }
}

export async function getVendorById(id) {
  try {
    const [vendors] = await db.query('SELECT * FROM vendors WHERE id = ?', [id]);
    if (vendors.length === 0) {
      throw new Error(`Vendor not found with id: ${id}`);
    }
    return formatVendor(vendors[0]);
  } catch (error) {
    logger.error('Error getting vendor by ID:', error.message);
    throw error;
  }
}

export async function updateVendor(id, vendorData) {
  try {
    const { name, contactPerson, phone, category, rating, active, notes } = vendorData;

    await db.query(`
      UPDATE vendors 
      SET name = ?, contact_person = ?, phone = ?, category = ?, rating = ?, active = ?, notes = ?
      WHERE id = ?
    `, [name, contactPerson || null, phone || null, category || null, rating || null, active ? 1 : 0, notes || null, id]);

    const [vendors] = await db.query('SELECT * FROM vendors WHERE id = ?', [id]);
    if (vendors.length === 0) {
      throw new Error(`Vendor not found with id: ${id}`);
    }
    logger.info(`Updated vendor: ${name}`);
    return formatVendor(vendors[0]);
  } catch (error) {
    logger.error('Error updating vendor:', error.message);
    throw error;
  }
}

export async function deleteVendor(id) {
  try {
    const [result] = await db.query('DELETE FROM vendors WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      throw new Error(`Vendor not found with id: ${id}`);
    }
    logger.info(`Deleted vendor with id: ${id}`);
    return true;
  } catch (error) {
    logger.error('Error deleting vendor:', error.message);
    throw error;
  }
}