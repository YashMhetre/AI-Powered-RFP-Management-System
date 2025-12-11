export const parseNaturalLanguage = (text) => {
  if (!text) return {};

  // Extract budget ($Number)
  const budgetMatch = text.match(/\$([\d,\.]+)/);
  const budget = budgetMatch ? parseFloat(budgetMatch[1].replace(/,/g, "")) : null;

  // Extract deadline ("within 30 days")
  const daysMatch = text.match(/within\s+(\d+)\s+days/i);
  const deadline_days = daysMatch ? parseInt(daysMatch[1]) : null;

  // Extract payment terms (e.g., "net 30")
  const paymentMatch = text.match(/net\s*\d+/i);
  const payment_terms = paymentMatch ? paymentMatch[0] : null;

  // Extract warranty (e.g., "1 year warranty")
  const warrantyMatch = text.match(/(\d+)\s+year(?:s)?\s+warranty/i);
  const warranty = warrantyMatch ? warrantyMatch[0] : null;

  // Auto-generated title
  const tempTitle = text.split(" ").slice(0, 6).join(" ") + "...";

  return {
    auto_title: tempTitle,
    description: text,
    budget,
    deadline_days,
    payment_terms,
    warranty
  };
};
