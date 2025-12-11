import express from 'express';
import * as proposalController from '../controllers/proposalController.js';

const router = express.Router();

// IMPORTANT: Specific routes MUST come before generic /:id route
// Compare proposals for an RFP
router.get('/rfp/:rfpId/compare', proposalController.compareProposals);

// Get all proposals for an RFP
router.get('/rfp/:rfpId', proposalController.getProposalsByRfp);

// Get single proposal by ID (must be last)
router.get('/:id', proposalController.getProposalById);

export default router;