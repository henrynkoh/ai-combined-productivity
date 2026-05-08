#!/usr/bin/env node
/**
 * S02 — FB Group Scanner Beta
 * Pierce, Thurston, Clark, Kitsap, Spokane + WA real estate groups
 * 20 sub-agents: 10 groups × 2 passes
 */
const fs   = require("fs");
const path = require("path");
const targets = require("../../config/targets.json");

const RAW_DIR = path.join(__dirname, "../../data/raw");
fs.mkdirSync(RAW_DIR, { recursive: true });

const groups = targets.facebook_groups.session_02_beta;
const req    = targets.afh_hard_requirements;
const today  = new Date().toISOString().slice(0, 10);

const prompts = groups.flatMap((g, i) =>
  ["recent", "search"].map((pass, j) => ({
    agent_id: `s02-agent-${String(i * 2 + j + 1).padStart(2, "0")}`,
    group: g.name,
    county: g.county,
    pass,
    prompt: `
You are AFHP Property Scout Sub-Agent S02 (${pass} pass).
Target FB group: "${g.name}" | County: ${g.county}
Requirements: ${req.min_beds}+ bed, ${req.min_baths}+ bath, ${req.min_sqft.toLocaleString()}+ sqft,
under $${req.max_price.toLocaleString()}, WA State, rambler preferred.

${pass === "recent"
  ? `Scan last 48h of posts in "${g.name}" for property listings.`
  : `Search within "${g.name}" for: "for sale", "rambler", "home", "property", "AFH". Last 7 days.`}

Extract all matching properties per AGENTS.md schema. Apply hard filter. Score and categorize.
Return JSON array or []. READ ONLY.
`.trim(),
  }))
);

const out = path.join(RAW_DIR, `s02-prompts-${today}.json`);
fs.writeFileSync(out, JSON.stringify(prompts, null, 2));
console.log(`[S02] ${prompts.length} agent prompts → ${out}`);
