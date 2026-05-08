#!/usr/bin/env node
/**
 * S01 — FB Group Scanner Alpha
 * Scans 10 priority AFH/senior care Facebook groups (King, Snohomish, Statewide)
 * 20 sub-agents: 10 groups × 2 passes (recent posts + search within group)
 */
const fs   = require("fs");
const path = require("path");
const targets = require("../../config/targets.json");

const RAW_DIR = path.join(__dirname, "../../data/raw");
fs.mkdirSync(RAW_DIR, { recursive: true });

const groups  = targets.facebook_groups.session_01_alpha;
const req     = targets.afh_hard_requirements;
const today   = new Date().toISOString().slice(0, 10);

const prompts = groups.flatMap((g, i) =>
  ["recent", "search"].map((pass, j) => ({
    agent_id: `s01-agent-${String(i * 2 + j + 1).padStart(2, "0")}`,
    group: g.name,
    county: g.county,
    pass,
    prompt: `
You are AFHP Property Scout Sub-Agent S01 (${pass} pass).
Target FB group: "${g.name}" | County focus: ${g.county}

AFH Hard Requirements: ${req.min_beds}+ bed, ${req.min_baths}+ bath, ${req.min_sqft.toLocaleString()}+ sqft,
under $${req.max_price.toLocaleString()}, Washington State, single-family home, rambler preferred.

TASK (${pass} pass):
${pass === "recent"
  ? `1. Use computer use to open Facebook and navigate to group "${g.name}".
2. Scroll through the last 48 hours of posts.
3. Look for any property listings, homes for sale, AFH business listings.`
  : `1. Use computer use to open Facebook, navigate to group "${g.name}".
2. Use the group's search bar to search for: "for sale", "rambler", "AFH", "home", "property".
3. Filter to last 7 days.`}
4. For each property post found, extract all details per AGENTS.md schema.
5. Apply hard filter — only include properties meeting ALL AFH requirements.
6. Assign category: AFH_WABO_READY / AFH_INSPECTION_READY / AFH_POTENTIAL.
7. Score per AGENTS.md rubric.
8. Return JSON array or [].
READ ONLY. No posting, commenting, or reacting.
`.trim(),
  }))
);

const out = path.join(RAW_DIR, `s01-prompts-${today}.json`);
fs.writeFileSync(out, JSON.stringify(prompts, null, 2));
console.log(`[S01] ${prompts.length} agent prompts → ${out}`);
