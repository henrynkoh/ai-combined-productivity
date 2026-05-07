#!/usr/bin/env node
/**
 * Session S03 — Keyword Scanner A
 * Searches Facebook (public posts + Marketplace) for provider-related keywords
 * 20 sub-agents, 2 per keyword (morning + evening pass)
 */
const fs = require("fs");
const path = require("path");

const targets = require("../../config/targets.json");
const RAW_DIR = path.join(__dirname, "../../data/raw");
fs.mkdirSync(RAW_DIR, { recursive: true });

const keywords = targets.search_keywords.session_03_provider_terms;
const today = new Date().toISOString().slice(0, 10);
const counties = targets.counties_priority_order;

// 10 keywords × 2 agents each (AM + PM pass) = 20 agents
const prompts = keywords.flatMap((kw, i) =>
  ["AM", "PM"].map((pass, j) => ({
    agent_id: `s03-agent-${String(i * 2 + j + 1).padStart(2, "0")}`,
    keyword: kw,
    pass,
    prompt: `
You are AFH Intel Sub-Agent (Keyword Scanner — ${pass} pass).
Keyword: "${kw}"
Counties of interest: ${counties.slice(0, 6).join(", ")}

TASK:
1. Use computer use to open Facebook.
2. Use the main search bar to search for: "${kw}"
3. Filter results to: Posts → Washington State → Last 24 hours (${pass === "AM" ? "first 12h" : "last 12h"})
4. Also check Facebook Marketplace with the same term.
5. For each relevant result, extract a JSON lead object per AGENTS.md spec.
6. Return JSON array or [].

READ ONLY — no posting, commenting, or reacting.
`.trim(),
  }))
);

const outFile = path.join(RAW_DIR, `s03-prompts-${today}.json`);
fs.writeFileSync(outFile, JSON.stringify(prompts, null, 2));
console.log(`[S03] ${prompts.length} keyword scanner prompts written.`);
