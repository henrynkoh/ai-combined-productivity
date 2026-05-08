#!/usr/bin/env node
/**
 * S04 — Keyword Deep Scanner
 * Searches all of Facebook (posts, groups, Marketplace) by keyword
 * 20 sub-agents: 12 keywords + 8 targeted county+keyword combos
 */
const fs   = require("fs");
const path = require("path");
const targets = require("../../config/targets.json");

const RAW_DIR = path.join(__dirname, "../../data/raw");
fs.mkdirSync(RAW_DIR, { recursive: true });

const keywords = targets.keyword_searches;
const counties = targets.target_counties_priority.slice(0, 4).map(c => c.county);
const req      = targets.afh_hard_requirements;
const today    = new Date().toISOString().slice(0, 10);

// 12 keyword agents
const prompts = keywords.map((kw, i) => ({
  agent_id: `s04-agent-${String(i + 1).padStart(2, "0")}`,
  keyword: kw,
  prompt: `
You are AFHP Keyword Scanner Sub-Agent S04.
Search keyword: "${kw}"

TASK:
1. Use computer use → Facebook main search → type "${kw}".
2. Filter: Posts → Washington State → Past week.
3. Also check: Groups tab and Marketplace tab with same term.
4. Collect ALL property listings found.
5. Hard filter: ${req.min_beds}+ bed · ${req.min_baths}+ bath · ${req.min_sqft.toLocaleString()}+ sqft · under $${req.max_price.toLocaleString()} · WA state.
6. Extra attention to: rambler, single story, no-step entry, accessible, wide doors, AFH, WABO.
7. Classify and score per AGENTS.md. Return JSON array or [].
READ ONLY.
`.trim(),
}));

// 8 county+keyword combo agents
counties.forEach((county, ci) => {
  ["rambler 3 bedroom", "single story home AFH"].forEach((kw, ki) => {
    prompts.push({
      agent_id: `s04-agent-${String(13 + ci * 2 + ki).padStart(2, "0")}`,
      keyword: `${kw} ${county} county`,
      county,
      prompt: `
You are AFHP County+Keyword Sub-Agent S04.
Search: "${kw} ${county} county Washington"
Scan Facebook posts and Marketplace. Apply hard filter and AGENTS.md scoring.
Focus: ${county} county only. Return JSON array or []. READ ONLY.
`.trim(),
    });
  });
});

const out = path.join(RAW_DIR, `s04-prompts-${today}.json`);
fs.writeFileSync(out, JSON.stringify(prompts, null, 2));
console.log(`[S04] ${prompts.length} keyword scanner prompts → ${out}`);
