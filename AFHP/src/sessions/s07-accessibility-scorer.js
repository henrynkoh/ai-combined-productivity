#!/usr/bin/env node
/**
 * S07 — Accessibility Signal Scorer
 * Deep-reads each property's post text for DSHS AFH inspection signals
 * Adds detailed accessibility_signals[] and adjusts score
 * 20 sub-agents
 */
const fs   = require("fs");
const path = require("path");

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

const props = loadProps();
const batchSize = Math.max(1, Math.ceil(props.length / NUM));

const DSHS_SIGNALS = [
  "rambler", "single story", "one level", "no stairs", "step-free", "no-step entry",
  "wheelchair accessible", "ADA", "wide doorway", "36 inch door", "32 inch door",
  "roll-in shower", "walk-in shower", "accessible bathroom", "grab bars", "handrails",
  "open floor plan", "wide hallway", "large bathroom", "sprinkler", "fire suppression",
  "smoke detector", "emergency egress", "backup generator", "in-law suite",
  "main floor master", "main floor bedroom", "level yard", "paved driveway",
  "covered entry", "ramp", "lift", "elevator"
];

const prompts = Array.from({ length: Math.min(NUM, Math.max(1, props.length)) }, (_, i) => {
  const batch = props.slice(i * batchSize, (i + 1) * batchSize);
  return {
    agent_id: `s07-agent-${String(i + 1).padStart(2, "0")}`,
    prompt: `
You are AFHP Accessibility Scorer Sub-Agent S07 (batch ${i + 1}).

DSHS AFH Inspection Signal Keywords:
${DSHS_SIGNALS.join(", ")}

INPUT: ${JSON.stringify(batch)}

TASK:
1. Scan each property's post_text_excerpt and notes for the signal keywords above.
2. Build "accessibility_signals": array of matched signals from the property text.
3. Apply score bonuses per AGENTS.md rubric (see bonus points section).
4. Recalculate final "score" incorporating all bonuses. Cap at 10.
5. Add "conversion_estimate":
   - "low"    : WABO READY or strong accessibility — minimal work to open
   - "medium" : Inspection Ready — some renovation (1-2 bathrooms, wider doors)
   - "high"   : Potential — significant modification needed (estimated $30k-$80k)
   - "na"     : Already licensed
6. Add "dshs_readiness_pct": rough % of DSHS inspection criteria likely met (0-100).
Return full JSON array.
`.trim(),
  };
}).filter(Boolean);

const out = path.join(PROPS_DIR, `s07-accessibility-prompts-${today}.json`);
fs.writeFileSync(out, JSON.stringify(prompts, null, 2));
console.log(`[S07] ${prompts.length} accessibility scorer agents for ${props.length} properties.`);
