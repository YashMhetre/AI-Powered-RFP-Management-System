import * as proposalService from '../services/proposalService.js';
import logger from '../utils/logger.js';

export async function getProposalsByRfp(req, res, next) {
  try {
    logger.info(`Getting proposals for RFP: ${req.params.rfpId}`);
    const proposals = await proposalService.getProposalsByRfpId(req.params.rfpId);
    res.json(proposals);
  } catch (error) {
    logger.error('Error getting proposals by RFP:', error.message);
    next(error);
  }
}

export async function getProposalById(req, res, next) {
  try {
    logger.info(`Getting proposal: ${req.params.id}`);
    const proposal = await proposalService.getProposalById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(proposal);
  } catch (error) {
    logger.error('Error getting proposal:', error.message);
    next(error);
  }
}

export async function compareProposals(req, res, next) {
  try {
    logger.info(`Comparing proposals for RFP: ${req.params.rfpId}`);
    const comparison = await proposalService.compareProposals(req.params.rfpId);
    res.json(comparison);
  } catch (error) {
    logger.error('Error comparing proposals:', error.message);
    next(error);
  }
}
