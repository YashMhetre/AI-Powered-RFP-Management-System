import express from 'express';
import * as rfpController from '../controllers/rfpController.js';

const router = express.Router();

// Parse natural language → structured RFP
router.post('/parse', rfpController.parseRfp);

// Create RFP
router.post('/', rfpController.createRfp);

// Get all RFPs
router.get('/', rfpController.getAllRfps);

// Get single RFP
router.get('/:id', rfpController.getRfpById);

// UPDATE vendor list (checkbox-selected vendors)
router.put('/:id/vendors', rfpController.updateRfpVendors);

// Send the RFP to associated vendors
router.post('/:id/send', rfpController.sendRfp);

export default router;
