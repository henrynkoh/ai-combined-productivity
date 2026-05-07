#!/usr/bin/env node
/**
 * Session S06 — Property Analyzer
 * Deep-dives on any lead tagged PROPERTY_* for AFH suitability scoring
 * 20 sub-agents, each evaluates a property lead in detail
 */
const fs = require("fs");
const path = require("path");

const PROCESSED_DIR = path.join(__dirname, "../../data/processed");
const today = new Date().toISOString().slice(0, 10);

function loadProcessedLeads() {
  if (!fs.existsSync(PROCESSED_DIR)) return [];
  return fs.readdirSync(PROCESSED_DIR)
    .filter(f => f.endsWith(".json"))
    .flatMap(f => {
      try {
        const d = JSON.parse(fs.readFileSync(path.join(PROCESSED_DIR, f), "utf8"));
        return Array.isArray(d) ? d : [];
      } catch { return []; }
    });
}

const propertyCategories = ["PROPERTY_LICENSED", "PROPERTY_WABO", "PROPERTY_POTENTIAL", "AFH_FOR_SALE", "AFH_FOR_LEASE"];
const propertyLeads = loadProcessedLeads().filter(l => propertyCategories.includes(l.category));

const NUM_AGENTS = 20;
const batchSize = Math.ceil(propertyLeads.length / NUM_AGENTS) || 1;

const prompts = Array.from({ length: Math.min(NUM_AGENTS, propertyLeads.length) }, (_, i) => {
  const batch = propertyLeads.slice(i * batchSize, (i + 1) * batchSize);
  return {
    agent_id: `s06-agent-${String(i + 1).padStart(2, "0")}`,
    prompt: `
You are AFH Property Analysis Sub-Agent (batch ${i + 1}).

INPUT PROPERTIES: ${JSON.stringify(batch)}

For each property, perform deep AFH suitability analysis:

1. ZONING CHECK: Is the address in a residential zone (R1/R2/RS) likely permitting AFH?
2. SIZE: Does the post mention sqft or bedrooms? ≥2500 sqft or ≥4 bedrooms = suitable
3. ACCESSIBILITY: Any mention of: single story, rambler, ADA, wide doors, roll-in shower,
   no-step entry, accessible bathroom, grab bars, ramp = major positive signals
4. LICENSE STATUS: Active AFH license > lapsed license > no mention
5. PROXIMITY: Near hospital, clinic, pharmacy, or public transit = positive
6. PRICE FIT: For WA state, AFH properties $600K-$1.5M are typical. Flag outliers.
7. CONVERSION COST ESTIMATE: If not licensed, estimate low/medium/high conversion effort
8. FINAL RECOMMENDATION: BUY / LEASE / MONITOR / PASS with 1-paragraph rationale

Add fields: "afh_suitability_score" (1-10), "conversion_effort" (low/medium/high/na),
"property_analysis": { zoning, size_assessment, accessibility_signals, price_assessment, recommendation }

Return enhanced JSON array.
`.trim(),
  };
}).filter(p => p);

const outFile = path.join(PROCESSED_DIR, `s06-property-analysis-prompts-${today}.json`);
fs.writeFileSync(outFile, JSON.stringify(prompts, null, 2));
console.log(`[S06] ${prompts.length} property analysis agents for ${propertyLeads.length} properties.`);
