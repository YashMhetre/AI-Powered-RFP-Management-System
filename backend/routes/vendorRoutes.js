import express from 'express';
import * as vendorController from '../controllers/vendorController.js';

const router = express.Router();

router.post('/', vendorController.createVendor);
router.get('/', vendorController.getAllVendors);
// FIXED: /active MUST come before /:id
router.get('/active', vendorController.getActiveVendors);
router.get('/:id', vendorController.getVendorById);
router.put('/:id', vendorController.updateVendor);
router.delete('/:id', vendorController.deleteVendor);

export default router;