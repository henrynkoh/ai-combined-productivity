#!/usr/bin/env node
/**
 * S08 — Price & Location Verifier
 * Cross-checks price ranges, confirms WA county, adds market context
 * 20 sub-agents
 */
const fs   = require("fs");
const path = require("path");
const targets = require("../../config/targets.json");

const PROPS_DIR = path.join(__dirname, "../../data/properties");
const today = new Date().toISOString().slice(0, 10);
const NUM   = 20;

function loadProps() {
  if (!fs.existsSync(PROPS_DIR)) return [];
  return fs.readdirSync(PROPS_DIR).filter(f => f.endsWith(".json") && !f.includes("prompts"))
    .flatMap(f => {
      try { const d = JSON.parse(fs.readFileSync(path.join(PROPS_DIR, f), "utf8")); return Array.isArray(d) ? d : [d]; }
      catch { return []; }
    }).filter(p => p.category !== "DOES_NOT_QUALIFY");
}

const countyPriority = targets.target_counties_priority.reduce((a, c) => { a[c.county] = c.priority; return a; }, {});
const props = loadProps();
const batchSize = Math.max(1, Math.ceil(props.length / NUM));

const prompts = Array.from({ length: Math.min(NUM, Math.max(1, props.length)) }, (_, i) => {
  const batch = props.slice(i * batchSize, (i + 1) * batchSize);
  return {
    agent_id: `s08-agent-${String(i + 1).padStart(2, "0")}`,
    prompt: `
You are AFHP Price & Location Verifier Sub-Agent S08 (batch ${i + 1}).

County priority scores: ${JSON.stringify(countyPriority)}

INPUT: ${JSON.stringify(batch)}

TASK:
1. PRICE VERIFICATION:
   - If price is null/missing: add "price_status": "unlisted" — keep property
   - If price > $600,000: set category = "DOES_NOT_QUALIFY", price_status = "over_budget"
   - If price <= $500,000: add "price_tier": "excellent"
   - If price $500,001–$550,000: "price_tier": "good"
   - If price $550,001–$600,000: "price_tier": "acceptable"
   - If price null: "price_tier": "unknown"

2. LOCATION VERIFICATION:
   - Confirm county is in Washington State
   - If city mentioned but no county: infer county from city name
   - Add "county_priority_score": lookup from county priority table above
   - Add "location_notes": nearest major city, notable proximity (hospital, transit)

3. DAYS LISTED:
   - Calculate from post_date to today (${today})
   - Fresh listings (< 3 days): add +0.1 to score
   - Stale listings (> 30 days): add note "may be under contract or sold"

4. AFH MARKET CONTEXT (add field "market_context"):
   - King county: "Highest AFH demand, waitlists common, premium rents $3,500-$5,000/bed"
   - Snohomish:   "Strong demand, growing market, rents $3,000-$4,500/bed"
   - Pierce:      "Moderate demand, competitive pricing, rents $2,800-$4,000/bed"
   - Others:      "Emerging market, verify DSHS placement rates"

Return updated JSON array.
`.trim(),
  };
}).filter(Boolean);

const out = path.join(PROPS_DIR, `s08-price-location-prompts-${today}.json`);
fs.writeFileSync(out, JSON.stringify(prompts, null, 2));
console.log(`[S08] ${prompts.length} price/location agents for ${props.length} properties.`);
