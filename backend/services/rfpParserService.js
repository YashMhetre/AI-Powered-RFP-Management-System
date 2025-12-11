// Simple NL → Structured RFP parser (no AI required)

export async function parseRfpText(text) {
  const clean = text.trim();

  // ------ TITLE --------
  let title = clean.split('.')[0].trim();
  if (title.length > 60) {
    title = title.slice(0, 60) + "...";
  }

  // ------ BUDGET --------
  const budgetMatch = clean.match(/\$?\s?([0-9,.]+)\s?(usd|dollars)?/i);
  const budget = budgetMatch ? parseFloat(budgetMatch[1].replace(/,/g, "")) : null;

  // ------ DEADLINE (days) -------
  const deadlineDaysMatch = clean.match(/(\d+)\s+days?/i);
  const deadlineDays = deadlineDaysMatch ? parseInt(deadlineDaysMatch[1]) : null;

  const deadline = null; // You can calculate later if needed

  // ------ WARRANTY -------
  const warrantyMatch = clean.match(/(\d+)\s+year/i);
  const warranty = warrantyMatch ? `${warrantyMatch[1]} year warranty` : null;

  // ------ PAYMENT TERMS -------
  const paymentMatch = clean.match(/net\s*\d+/i);
  const paymentTerms = paymentMatch ? paymentMatch[0] : null;

  // ------ REQUIREMENTS -------
  const requirements = [];

  const itemMatches = clean.match(/(\d+)\s+[\w- ]+/g);
  if (itemMatches) {
    itemMatches.forEach((line) => {
      const qtyMatch = line.match(/(\d+)/);
      if (qtyMatch) {
        const qty = parseInt(qtyMatch[1]);
        const name = line.replace(qtyMatch[1], "").trim();
        if (name.length > 2) {
          requirements.push({
            item: name,
            quantity: qty
          });
        }
      }
    });
  }

  return {
    title,
    description: clean,
    budget,
    deadline,
    deadlineDays,
    paymentTerms,
    warranty,
    requirements
  };
}
