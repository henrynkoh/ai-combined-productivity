#!/usr/bin/env node
/**
 * S06 — AFH Category Classifier
 * Assigns final AFH_WABO_READY / AFH_INSPECTION_READY / AFH_POTENTIAL
 * based on license signals, accessibility features, and structural details
 * 20 sub-agents
 */
const fs   = require("fs");
const path = require("path");

const PROPS_DIR = path.join(__dirname, "../../data/properties");
const today     = new Date().toISOString().slice(0, 10);
const NUM       = 20;

function loadProps() {
  if (!fs.existsSync(PROPS_DIR)) return [];
  return fs.readdirSync(PROPS_DIR).filter(f => f.endsWith(".json") && !f.includes("prompts"))
    .flatMap(f => {
      try { const d = JSON.parse(fs.readFileSync(path.join(PROPS_DIR, f), "utf8")); return Array.isArray(d) ? d : [d]; }
      catch { return []; }
    }).filter(p => p.category !== "DOES_NOT_QUALIFY");
}

const props = loadProps();
const batchSize = Math.max(1, Math.ceil(props.length / NUM));
const targets = require("../../config/targets.json");

const prompts = Array.from({ length: Math.min(NUM, Math.max(1, props.length)) }, (_, i) => {
  const batch = props.slice(i * batchSize, (i + 1) * batchSize);
  return {
    agent_id: `s06-agent-${String(i + 1).padStart(2, "0")}`,
    prompt: `
You are AFHP AFH Category Classifier Sub-Agent S06 (batch ${i + 1}).

INPUT: ${JSON.stringify(batch)}

CLASSIFICATION RULES:

AFH_WABO_READY — assign if ANY of these are present:
- Text mentions: "AFH license", "DSHS license", "WABO", "licensed care home",
  "adult family home license", "previously licensed", "care home", "assisted living license"
- Seller is an AFH operator or care provider
- Property was previously used as AFH or group home

AFH_INSPECTION_READY — assign if meets hard requirements AND has 3+ of:
- "single story" or "rambler" or "one level" explicitly stated
- "no step" / "zero step" / "step-free" / "wheelchair accessible" entry
- "wide doorways" / "36 inch doors" / "accessible" bathroom
- "roll-in shower" / "walk-in shower" / "grab bars" / "ADA"
- "open floor plan" / "wide hallways"
- "sprinkler system" / "fire suppression"
- Large bedroom count (5+ beds) on main floor
- Large sqft (2,800+)

AFH_POTENTIAL — assign if meets hard requirements but lacks above signals.
Single-story / rambler with 3+ bed, 2+ bath, 2000+ sqft, under $600k.

Do NOT change category from DOES_NOT_QUALIFY.
Add field "classification_rationale": one sentence explaining the category assigned.
Return full JSON array.
`.trim(),
  };
}).filter(Boolean);

const out = path.join(PROPS_DIR, `s06-classifier-prompts-${today}.json`);
fs.writeFileSync(out, JSON.stringify(prompts, null, 2));
console.log(`[S06] ${prompts.length} classifier agents for ${props.length} properties.`);
