import db from '../config/database.js';
import logger from '../utils/logger.js';
import { scoreProposal, generateProposalComparison } from './aiService.js';
import { getRfpById } from './rfpService.js';   // <-- REQUIRED FIX

// Format proposal record
function formatProposal(proposal) {
  return {
    id: proposal.id,
    rfpId: proposal.rfp_id,
    vendorId: proposal.vendor_id,
    vendorName: proposal.vendor_name,
    vendorEmail: proposal.vendor_email,
    rfpTitle: proposal.rfp_title,
    totalPrice: proposal.total_price ? parseFloat(proposal.total_price) : null,
    deliveryDays: proposal.delivery_days,
    paymentTerms: proposal.payment_terms,
    warranty: proposal.warranty,
    rawEmailBody: proposal.raw_email_body,
    aiScore: proposal.ai_score ? parseFloat(proposal.ai_score) : null,
    aiSummary: proposal.ai_summary,
    aiRecommendation: proposal.ai_recommendation,
    receivedAt: proposal.received_at,
    createdAt: proposal.created_at,
    items: proposal.items || []
  };
}

// Format each proposal item
function formatProposalItem(item) {
  return {
    id: item.id,
    proposalId: item.proposal_id,
    itemName: item.item_name,
    quantity: item.quantity,
    unitPrice: item.unit_price ? parseFloat(item.unit_price) : null,
    totalPrice: item.total_price ? parseFloat(item.total_price) : null,
    specifications: item.specifications
  };
}

// Fetch proposals for a specific RFP
export async function getProposalsByRfpId(rfpId) {
  try {
    logger.info(`Fetching proposals for RFP ID: ${rfpId}`);

    const [proposals] = await db.query(`
      SELECT 
        p.*,
        v.name as vendor_name,
        v.email as vendor_email,
        r.title as rfp_title
      FROM proposals p
      INNER JOIN vendors v ON p.vendor_id = v.id
      INNER JOIN rfps r ON p.rfp_id = r.id
      WHERE p.rfp_id = ?
      ORDER BY p.received_at DESC
    `, [rfpId]);

    logger.info(`Found ${proposals.length} proposals for RFP ${rfpId}`);

    const formattedProposals = [];

    for (const proposal of proposals) {
      const [items] = await db.query(
        'SELECT * FROM proposal_items WHERE proposal_id = ?',
        [proposal.id]
      );
      proposal.items = items.map(formatProposalItem);
      formattedProposals.push(formatProposal(proposal));
    }

    return formattedProposals;
  } catch (error) {
    logger.error('Error getting proposals by RFP ID:', error.message);
    throw error;
  }
}

// Fetch single proposal
export async function getProposalById(id) {
  try {
    logger.info(`Fetching proposal ID: ${id}`);

    const [proposals] = await db.query(`
      SELECT 
        p.*,
        v.name as vendor_name,
        v.email as vendor_email,
        r.title as rfp_title
      FROM proposals p
      INNER JOIN vendors v ON p.vendor_id = v.id
      INNER JOIN rfps r ON p.rfp_id = r.id
      WHERE p.id = ?
    `, [id]);

    if (proposals.length === 0) {
      logger.warn(`Proposal not found: ${id}`);
      return null;
    }

    const proposal = proposals[0];

    const [items] = await db.query(
      'SELECT * FROM proposal_items WHERE proposal_id = ?',
      [id]
    );
    proposal.items = items.map(formatProposalItem);

    return formatProposal(proposal);
  } catch (error) {
    logger.error('Error getting proposal by ID:', error.message);
    throw error;
  }
}

export async function compareProposals(rfpId) {
  try {
    const proposals = await getProposalsByRfpId(rfpId);
    const rfp = await getRfpById(rfpId);  // <-- CRITICAL FIX

    if (!rfp) throw new Error("RFP not found");

    if (!proposals.length) {
      return {
        comparison: {
          totalProposals: 0,
          priceRange: { min: 0, max: 0 },
          avgScore: 0
        },
        proposals: [],
        aiRecommendation: "No proposals submitted yet.",
        recommendedProposal: null
      };
    }

    // Ensure each proposal gets AI score
    for (const p of proposals) {
      const ai = await scoreProposal(p, rfp.description || rfp.title);
      p.aiScore = ai.score;
      p.aiSummary = ai.reasoning;
      p.aiRecommendation = ai.reasoning;
    }

    const prices = proposals.map(p => p.totalPrice || 0);
    const scores = proposals.map(p => p.aiScore || 0);

    const comparison = {
      totalProposals: proposals.length,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      avgScore: scores.reduce((a, b) => a + b, 0) / scores.length
    };

    const aiRecommendation = await generateProposalComparison(
      proposals,
      rfp.description || rfp.title
    );

    const recommendedProposal = proposals.reduce((best, p) =>
      !best || (p.aiScore || 0) > (best.aiScore || 0) ? p : best,
      null
    );

    return {
      comparison,
      proposals,
      aiRecommendation,
      recommendedProposal
    };

  } catch (err) {
    logger.error("Error comparing proposals:", err);
    throw err;
  }
}

export default {
  getProposalsByRfpId,
  getProposalById,
  compareProposals
};
