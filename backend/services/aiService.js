import axios from 'axios';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';

// OpenAI config
const OPENAI_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  url: 'https://api.openai.com/v1/chat/completions'
};

// Anthropic config
const ANTHROPIC_CONFIG = {
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
  url: 'https://api.anthropic.com/v1/messages'
};

/**
 * Sleep helper for retry logic
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generic AI caller with retry logic
 */
async function callAI(prompt, systemPrompt = 'You are a helpful assistant.', retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (AI_PROVIDER === 'openai') {
        return await callOpenAI(prompt, systemPrompt);
      } else if (AI_PROVIDER === 'anthropic') {
        return await callAnthropic(prompt);
      } else {
        throw new Error(`Unknown AI provider: ${AI_PROVIDER}`);
      }
    } catch (error) {
      // Check for rate limit error
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
        
        logger.warn(`Rate limit hit (429). Retrying in ${waitTime/1000}s... (Attempt ${attempt}/${retries})`);
        
        if (attempt < retries) {
          await sleep(waitTime);
          continue;
        }
      }
      
      // If last attempt or non-rate-limit error, throw
      if (attempt === retries) {
        logger.error('AI API call failed after retries:', error.message);
        throw error;
      }
      
      // Exponential backoff for other errors
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
}

/**
 * OpenAI API
 */
async function callOpenAI(prompt, systemPrompt) {
  const response = await axios.post(
    OPENAI_CONFIG.url,
    {
      model: OPENAI_CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content;
}

/**
 * Anthropic API
 */
async function callAnthropic(prompt) {
  const response = await axios.post(
    ANTHROPIC_CONFIG.url,
    {
      model: ANTHROPIC_CONFIG.model,
      max_tokens: 4096,
      messages: [
        { role: 'user', content: prompt }
      ]
    },
    {
      headers: {
        'x-api-key': ANTHROPIC_CONFIG.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.content[0].text;
}

/**
 * Clean AI JSON
 */
function cleanJsonResponse(text) {
  let cleaned = text.trim();

  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);

  return cleaned.trim();
}

/**
 * Convert natural RFP input → structured JSON
 */
export async function structureRfpFromNaturalLanguage(naturalLanguageInput) {
  const prompt = `Convert the following natural language RFP description into a structured JSON format.

Input: ${naturalLanguageInput}

Respond with ONLY a JSON object (no markdown) with this exact structure:
{
  "title": "Brief descriptive title",
  "description": "Detailed description",
  "budget": numeric value or null,
  "deadlineDays": number or null,
  "items": [
    {
      "itemName": "Item name",
      "quantity": number,
      "specifications": "Detailed specs"
    }
  ],
  "paymentTerms": "Payment terms or null",
  "warranty": "Warranty requirements or null"
}`;

  const response = await callAI(prompt, 'You are an expert procurement assistant. Respond ONLY with valid JSON.');
  const cleaned = cleanJsonResponse(response);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    logger.error('Failed to parse structured RFP:', response);
    throw new Error('Invalid JSON returned by AI.');
  }
}

/**
 * Convert natural language → structured JSON → ready-to-save RFP object
 */
export async function createRfpFromNaturalLanguage(naturalLanguageInput) {
  const structured = await structureRfpFromNaturalLanguage(naturalLanguageInput);

  return {
    title: structured.title,
    description: structured.description,
    budget: structured.budget,
    deadlineDays: structured.deadlineDays,
    items: structured.items || [],
    paymentTerms: structured.paymentTerms,
    warranty: structured.warranty
  };
}

/**
 * Parse vendor proposal email
 */
export async function parseVendorProposal(emailBody, rfpContext) {
  const prompt = `Parse the following vendor proposal email and extract structured data.

RFP Context: ${rfpContext}

Vendor Email: ${emailBody}

Respond with ONLY a JSON object with this structure:
{
  "totalPrice": numeric,
  "deliveryDays": number,
  "paymentTerms": "string",
  "warranty": "string",
  "items": [
    {
      "itemName": "string",
      "quantity": number,
      "unitPrice": number,
      "totalPrice": number,
      "specifications": "string"
    }
  ],
  "summary": "string"
}`;

  const response = await callAI(prompt, 'You are an expert in vendor proposal parsing. Respond ONLY with JSON.');
  const cleaned = cleanJsonResponse(response);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    logger.error('Failed to parse vendor proposal:', response);
    throw new Error('Invalid JSON returned by AI.');
  }
}

/**
 * Score proposal with fallback
 */
export async function scoreProposal(proposal, rfpRequirements) {
  try {
    const prompt = `Score this vendor proposal against the RFP on a scale of 0–100.

RFP Requirements: ${rfpRequirements}

Proposal:
Vendor: ${proposal.vendorName}
Price: $${proposal.totalPrice}
Delivery: ${proposal.deliveryDays} days
Payment Terms: ${proposal.paymentTerms}
Warranty: ${proposal.warranty}

Respond ONLY with:
{ "score": number, "reasoning": "string" }`;

    const response = await callAI(prompt);
    const cleaned = cleanJsonResponse(response);

    const result = JSON.parse(cleaned);
    return {
      score: result.score,
      reasoning: result.reasoning
    };
  } catch (error) {
    logger.error('Failed to score proposal, using fallback:', error.message);
    return { 
      score: 50, 
      reasoning: 'Unable to evaluate due to API rate limit. Please try again later.' 
    };
  }
}

/**
 * Compare proposals with fallback
 */
export async function generateProposalComparison(proposals, rfpRequirements) {
  try {
    const proposalSummary = proposals.map(p =>
      `Vendor: ${p.vendorName}
Price: $${p.totalPrice}
Delivery: ${p.deliveryDays} days
Payment Terms: ${p.paymentTerms}
Warranty: ${p.warranty}
Score: ${p.aiScore || 'N/A'}`
    ).join('\n\n');

    const prompt = `Compare these vendor proposals and give a recommendation.

RFP Requirements: ${rfpRequirements}

Proposals:
${proposalSummary}`;

    return await callAI(prompt, 'You are a senior procurement consultant.');
  } catch (error) {
    logger.error('Failed to generate comparison, using fallback:', error.message);
    return 'Unable to generate AI comparison due to API rate limits. Please review proposals manually or try again later.';
  }
}

export default {
  structureRfpFromNaturalLanguage,
  createRfpFromNaturalLanguage,
  parseVendorProposal,
  scoreProposal,
  generateProposalComparison
};