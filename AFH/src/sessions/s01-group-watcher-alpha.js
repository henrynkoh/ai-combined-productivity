#!/usr/bin/env node
/**
 * Session S01 — Group Watcher Alpha
 * King & Snohomish county Facebook groups
 * Spawns 20 sub-agents, one per group/keyword combo
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const targets = require("../../config/targets.json");
const RAW_DIR = path.join(__dirname, "../../data/raw");
fs.mkdirSync(RAW_DIR, { recursive: true });

const groups = targets.facebook_groups.session_01_king_snohomish;
const today = new Date().toISOString().slice(0, 10);

// Each sub-agent prompt: search one FB group via computer use
function buildAgentPrompt(group) {
  return `
You are AFH Intel Sub-Agent for group: "${group.name}" (${group.county} county).

TASK:
1. Use computer use to open a browser and navigate to Facebook.
2. Search for the group "${group.name}" and open it.
3. Scan the last 72 hours of posts. Look for:
   - Posts seeking AFH providers or placements
   - Posts from people wanting to start/buy/lease an AFH
   - Properties listed with AFH license, WABO, or AFH potential
   - AFH businesses for sale or lease
4. For each relevant post, extract:
   {
     "source_group": "${group.name}",
     "county": "${group.county}",
     "post_date": "YYYY-MM-DD",
     "poster_name": "...",
     "post_text": "full text",
     "contact_info": "phone/email if visible",
     "url": "post URL if available",
     "category": "one of the AGENTS.md categories",
     "score": 1-10,
     "action_recommended": "..."
   }
5. Return a JSON array of found leads. Return [] if nothing relevant.

DO NOT post, comment, like, or interact with any posts — read only.
Follow the scoring rubric in AGENTS.md exactly.
`.trim();
}

async function runSession() {
  console.log(`[S01] Starting Group Watcher Alpha — ${groups.length} agents`);
  const allResults = [];

  // In a real Claude Code session, these would be Agent() calls with run_in_background=true
  // This script generates the prompt set for the orchestrator to dispatch
  const prompts = groups.map((g, i) => ({
    agent_id: `s01-agent-${String(i + 1).padStart(2, "0")}`,
    group: g.name,
    county: g.county,
    priority: g.priority,
    prompt: buildAgentPrompt(g),
  }));

  const outFile = path.join(RAW_DIR, `s01-prompts-${today}.json`);
  fs.writeFileSync(outFile, JSON.stringify(prompts, null, 2));
  console.log(`[S01] Agent prompts written: ${outFile}`);
  console.log(`[S01] Dispatch ${prompts.length} agents via master orchestrator.`);
}

runSession().catch(console.error);
