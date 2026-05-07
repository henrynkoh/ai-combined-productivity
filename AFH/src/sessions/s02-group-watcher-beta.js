#!/usr/bin/env node
/**
 * Session S02 — Group Watcher Beta
 * Pierce, Thurston, Clark, Kitsap, Spokane county Facebook groups
 * Spawns 20 sub-agents
 */
const fs = require("fs");
const path = require("path");

const targets = require("../../config/targets.json");
const RAW_DIR = path.join(__dirname, "../../data/raw");
fs.mkdirSync(RAW_DIR, { recursive: true });

const groups = targets.facebook_groups.session_02_pierce_thurston_clark;
const today = new Date().toISOString().slice(0, 10);

function buildAgentPrompt(group) {
  return `
You are AFH Intel Sub-Agent for group: "${group.name}" (${group.county} county).
Follow the same instructions as S01 agents (see AGENTS.md + CLAUDE.md).
Target group: "${group.name}"
County focus: ${group.county}
Scan last 72 hours. Return JSON array of leads or [].
DO NOT interact — read only.
`.trim();
}

const prompts = groups.map((g, i) => ({
  agent_id: `s02-agent-${String(i + 1).padStart(2, "0")}`,
  group: g.name,
  county: g.county,
  priority: g.priority,
  prompt: buildAgentPrompt(g),
}));

const outFile = path.join(RAW_DIR, `s02-prompts-${today}.json`);
fs.writeFileSync(outFile, JSON.stringify(prompts, null, 2));
console.log(`[S02] ${prompts.length} agent prompts written: ${outFile}`);
