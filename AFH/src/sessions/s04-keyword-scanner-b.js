#!/usr/bin/env node
/**
 * Session S04 — Keyword Scanner B
 * Property, license, WABO, and business-for-sale keywords
 * 20 sub-agents (12 property keywords × ~2 agents, adjusted to 20)
 */
const fs = require("fs");
const path = require("path");

const targets = require("../../config/targets.json");
const RAW_DIR = path.join(__dirname, "../../data/raw");
fs.mkdirSync(RAW_DIR, { recursive: true });

const keywords = targets.search_keywords.session_04_property_license_terms;
const today = new Date().toISOString().slice(0, 10);

// Distribute 20 agents across 12 keywords (some high-priority get 2)
const highPriority = keywords.slice(0, 8);   // 8 keywords × 2 agents = 16
const lowPriority  = keywords.slice(8);       // 4 keywords × 1 agent  =  4

const prompts = [
  ...highPriority.flatMap((kw, i) =>
    ["pass-1", "pass-2"].map((pass, j) => ({
      agent_id: `s04-agent-${String(i * 2 + j + 1).padStart(2, "0")}`,
      keyword: kw,
      pass,
      prompt: buildPrompt(kw, pass),
    }))
  ),
  ...lowPriority.map((kw, i) => ({
    agent_id: `s04-agent-${String(17 + i).padStart(2, "0")}`,
    keyword: kw,
    pass: "single",
    prompt: buildPrompt(kw, "single"),
  })),
];

function buildPrompt(kw, pass) {
  return `
You are AFH Intel Sub-Agent (Property/License Scanner — ${pass}).
Keyword: "${kw}"

TASK:
1. Use computer use to search Facebook for "${kw}" filtered to Washington State.
2. Also search Facebook Marketplace > Homes for Sale/Rent with this term.
3. Check both public posts and group posts.
4. For properties: note bedrooms, sqft, accessibility features, asking price, location.
5. Flag any mention of: AFH license, WABO, DSHS, 6 residents, ADA, accessible, wide doors.
6. Score using AGENTS.md rubric. Properties with explicit AFH license = 9+.
7. Return JSON array per AGENTS.md spec, or [].

READ ONLY — no interaction.
`.trim();
}

const outFile = path.join(RAW_DIR, `s04-prompts-${today}.json`);
fs.writeFileSync(outFile, JSON.stringify(prompts, null, 2));
console.log(`[S04] ${prompts.length} property/license scanner prompts written.`);
