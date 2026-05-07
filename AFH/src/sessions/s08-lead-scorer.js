#!/usr/bin/env node
/**
 * Session S08 — Lead Scorer & Prioritizer
 * Final scoring pass across all processed leads
 * Applies composite score: base score + enrichment bonus + urgency multiplier
 * 20 sub-agents
 */
const fs = require("fs");
const path = require("path");

const PROCESSED_DIR = path.join(__dirname, "../../data/processed");
const LEADS_DIR     = path.join(__dirname, "../../data/leads");
fs.mkdirSync(LEADS_DIR, { recursive: true });

const today = new Date().toISOString().slice(0, 10);

function loadAllProcessed() {
  if (!fs.existsSync(PROCESSED_DIR)) return [];
  return fs.readdirSync(PROCESSED_DIR)
    .filter(f => f.endsWith(".json") && !f.includes("prompts"))
    .flatMap(f => {
      try {
        const d = JSON.parse(fs.readFileSync(path.join(PROCESSED_DIR, f), "utf8"));
        return Array.isArray(d) ? d : [];
      } catch { return []; }
    });
}

const allLeads = loadAllProcessed();
const NUM_AGENTS = 20;
const batchSize = Math.max(1, Math.ceil(allLeads.length / NUM_AGENTS));

const prompts = Array.from({ length: Math.min(NUM_AGENTS, Math.max(1, allLeads.length)) }, (_, i) => {
  const batch = allLeads.slice(i * batchSize, (i + 1) * batchSize);
  return {
    agent_id: `s08-agent-${String(i + 1).padStart(2, "0")}`,
    prompt: `
You are AFH Lead Scorer Sub-Agent (batch ${i + 1}).

INPUT: ${JSON.stringify(batch)}

TASK — Apply composite scoring:

BASE SCORE: Use score already assigned (from AGENTS.md rubric)

BONUS POINTS (add to base, max total = 10):
+1  Contact info provided (phone or email visible)
+1  Specific county mentioned (not just "Washington")
+1  Post is within last 24 hours
+1  DSHS waiver explicitly mentioned
+1  Active AFH license confirmed
+0.5 Specific dollar amount or timeline mentioned
+0.5 Poster appears active on Facebook (not dormant account)

URGENCY FLAG:
- "urgent" if score >= 8 AND post is < 24h old
- "high"   if score >= 7
- "medium" if score 5-6
- "low"    if score < 5

OUTPUT per lead: add fields
  "final_score": (capped at 10),
  "urgency": "urgent|high|medium|low",
  "score_breakdown": "brief explanation of bonuses applied",
  "ready_to_contact": true/false

Sort the returned array by final_score descending.
Return JSON array.
`.trim(),
  };
});

const outFile = path.join(LEADS_DIR, `s08-scorer-prompts-${today}.json`);
fs.writeFileSync(outFile, JSON.stringify(prompts, null, 2));
console.log(`[S08] ${prompts.length} scorer agents for ${allLeads.length} total leads.`);
