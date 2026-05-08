#!/usr/bin/env node
/**
 * S03 — Facebook Marketplace Scanner
 * Directly searches FB Marketplace > Homes For Sale in WA
 * 20 sub-agents: 10 search terms × 2 county filters
 */
const fs   = require("fs");
const path = require("path");
const targets = require("../../config/targets.json");

const RAW_DIR = path.join(__dirname, "../../data/raw");
fs.mkdirSync(RAW_DIR, { recursive: true });

const searches = targets.marketplace_searches;
const req      = targets.afh_hard_requirements;
const today    = new Date().toISOString().slice(0, 10);
const countyPairs = [
  ["King", "Snohomish"],
  ["Pierce", "Thurston"],
];

const prompts = searches.map((s, i) => ({
  agent_id: `s03-agent-${String(i + 1).padStart(2, "0")}`,
  term: s.term,
  counties: countyPairs[i % countyPairs.length],
  prompt: `
You are AFHP Marketplace Sub-Agent S03.
Search term: "${s.term}"
County filter: ${countyPairs[i % countyPairs.length].join(" or ")} county, Washington State

TASK:
1. Use computer use → open Facebook → Marketplace → Homes for Sale.
2. Set location to Washington State, radius 50 miles from Seattle.
3. Search for: "${s.term}"
4. Filter: Price max $600,000, property type = house.
5. Scan all results on first 2 pages.
6. For each listing, extract:
   - Address / city / neighborhood
   - Price (exact if shown)
   - Beds, baths, sqft
   - Home style (single story? rambler? basement?)
   - Accessibility features (wide doors, no-step, accessible bath)
   - Any AFH or care home mention
   - Listing URL, date posted, agent/seller contact
7. Apply AFHP hard filter: ${req.min_beds}+ bed, ${req.min_baths}+ bath, ${req.min_sqft.toLocaleString()}+ sqft, under $${req.max_price.toLocaleString()}.
8. Assign category and score per AGENTS.md.
9. Return JSON array or [].
READ ONLY — no contact, no save, no share.
`.trim(),
}));

// Add 10 more agents for real estate groups
const reGroups = targets.facebook_groups.session_03_real_estate || [];
reGroups.slice(0, 10).forEach((g, i) => {
  prompts.push({
    agent_id: `s03-agent-${String(i + 11).padStart(2, "0")}`,
    group: g.name,
    prompt: `
You are AFHP Property Scout Sub-Agent S03 (real estate group scan).
FB Group: "${g.name}" | County: ${g.county}
Scan last 48h for rambler or single-story home listings meeting AFH criteria.
Requirements: ${req.min_beds}+ bed, ${req.min_baths}+ bath, ${req.min_sqft.toLocaleString()}+ sqft, under $${req.max_price.toLocaleString()}.
Extract, classify, score per AGENTS.md. Return JSON array or []. READ ONLY.
`.trim(),
  });
});

const out = path.join(RAW_DIR, `s03-prompts-${today}.json`);
fs.writeFileSync(out, JSON.stringify(prompts, null, 2));
console.log(`[S03] ${prompts.length} marketplace/RE group prompts → ${out}`);
