import * as vendorService from '../services/vendorService.js';
import logger from '../utils/logger.js';

export async function createVendor(req, res, next) {
  try {
    logger.info('Creating new vendor:', req.body.name);
    const vendor = await vendorService.createVendor(req.body);
    res.status(201).json(vendor);
  } catch (error) {
    logger.error('Error creating vendor:', error.message);
    next(error);
  }
}

export async function getAllVendors(req, res, next) {
  try {
    logger.info('Getting all vendors');
    const vendors = await vendorService.getAllVendors();
    res.json(vendors);
  } catch (error) {
    logger.error('Error getting all vendors:', error.message);
    next(error);
  }
}

export async function getActiveVendors(req, res, next) {
  try {
    logger.info('Getting active vendors');
    const vendors = await vendorService.getActiveVendors();
    res.json(vendors);
  } catch (error) {
    logger.error('Error getting active vendors:', error.message);
    next(error);
  }
}

export async function getVendorById(req, res, next) {
  try {
    logger.info(`Getting vendor: ${req.params.id}`);
    const vendor = await vendorService.getVendorById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    logger.error('Error getting vendor:', error.message);
    next(error);
  }
}

export async function updateVendor(req, res, next) {
  try {
    logger.info(`Updating vendor: ${req.params.id}`);
    const vendor = await vendorService.updateVendor(req.params.id, req.body);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    logger.error('Error updating vendor:', error.message);
    next(error);
  }
}

export async function deleteVendor(req, res, next) {
  try {
    logger.info(`Deleting vendor: ${req.params.id}`);
    await vendorService.deleteVendor(req.params.id);
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting vendor:', error.message);
    next(error);
  }
}