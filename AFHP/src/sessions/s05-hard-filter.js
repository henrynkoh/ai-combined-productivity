#!/usr/bin/env node
/**
 * S05 — Hard-Filter Validator
 * Loads all raw collected properties, enforces AFH hard requirements,
 * removes disqualified listings, flags borderline cases
 * 20 sub-agents process batches in parallel
 */
const fs   = require("fs");
const path = require("path");
const targets = require("../../config/targets.json");

const RAW_DIR  = path.join(__dirname, "../../data/raw");
const PROPS_DIR = path.join(__dirname, "../../data/properties");
fs.mkdirSync(PROPS_DIR, { recursive: true });

const req   = targets.afh_hard_requirements;
const today = new Date().toISOString().slice(0, 10);
const NUM   = 20;

function loadRaw() {
  if (!fs.existsSync(RAW_DIR)) return [];
  return fs.readdirSync(RAW_DIR)
    .filter(f => f.endsWith(".json") && !f.includes("prompts"))
    .flatMap(f => {
      try {
        const d = JSON.parse(fs.readFileSync(path.join(RAW_DIR, f), "utf8"));
        return Array.isArray(d) ? d : [];
      } catch { return []; }
    });
}

const raw = loadRaw();
const batchSize = Math.max(1, Math.ceil(raw.length / NUM));

const prompts = Array.from({ length: Math.min(NUM, Math.max(1, raw.length)) }, (_, i) => {
  const batch = raw.slice(i * batchSize, (i + 1) * batchSize);
  return {
    agent_id: `s05-agent-${String(i + 1).padStart(2, "0")}`,
    batch_size: batch.length,
    prompt: `
You are AFHP Hard-Filter Validator Sub-Agent S05 (batch ${i + 1}).

AFH Requirements:
- Min beds: ${req.min_beds}
- Min baths: ${req.min_baths}
- Min sqft: ${req.min_sqft.toLocaleString()}
- Max price: $${req.max_price.toLocaleString()}
- State: Washington (WA) only
- Property type: single-family (no condos, no apartments, no commercial)

INPUT: ${JSON.stringify(batch)}

TASK:
1. For each property, validate ALL hard requirements strictly.
2. If beds/baths/sqft/price is MISSING (not mentioned): mark field as null, keep property
   (missing data ≠ disqualified — it just means unconfirmed).
3. If a field is explicitly stated AND fails: set category = "DOES_NOT_QUALIFY", score = 0.
4. Two-story homes: only keep if main floor has ${req.min_beds}+ beds and ${req.min_baths}+ baths.
5. Condos/townhomes/apartments: set DOES_NOT_QUALIFY.
6. Non-WA state: set DOES_NOT_QUALIFY.
7. Price over $600,000 (confirmed): set DOES_NOT_QUALIFY.
8. Ensure all AGENTS.md schema fields are present (use null for unknowns).
9. Add field "validation_notes": brief explanation of any borderline decisions.
Return full JSON array including DOES_NOT_QUALIFY items (for audit trail).
`.trim(),
  };
}).filter(Boolean);

const out = path.join(RAW_DIR, `s05-filter-prompts-${today}.json`);
fs.writeFileSync(out, JSON.stringify(prompts, null, 2));
console.log(`[S05] ${prompts.length} filter agents for ${raw.length} raw properties.`);
