#!/usr/bin/env node
/**
 * Session S05 — Ad Classifier
 * Reads all raw data from S01-S04, classifies and tags each item
 * 20 sub-agents each process a batch of ~N raw leads
 */
const fs = require("fs");
const path = require("path");

const RAW_DIR       = path.join(__dirname, "../../data/raw");
const PROCESSED_DIR = path.join(__dirname, "../../data/processed");
fs.mkdirSync(PROCESSED_DIR, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const NUM_AGENTS = 20;

// Load all raw leads from today's scraper sessions
function loadRawLeads() {
  const files = fs.readdirSync(RAW_DIR)
    .filter(f => f.includes(today) && !f.includes("prompts"));
  return files.flatMap(f => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(RAW_DIR, f), "utf8"));
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  });
}

const rawLeads = loadRawLeads();
const batchSize = Math.ceil(rawLeads.length / NUM_AGENTS) || 10;

// Split into 20 batches
const batches = Array.from({ length: NUM_AGENTS }, (_, i) =>
  rawLeads.slice(i * batchSize, (i + 1) * batchSize)
).filter(b => b.length > 0);

const prompts = batches.map((batch, i) => ({
  agent_id: `s05-agent-${String(i + 1).padStart(2, "0")}`,
  batch_size: batch.length,
  prompt: `
You are AFH Intel Classifier Sub-Agent (batch ${i + 1}/${batches.length}).

INPUT: ${JSON.stringify(batch)}

TASK:
For each item in the input array:
1. Re-verify the category using AGENTS.md taxonomy. Correct if wrong.
2. Re-score using the AGENTS.md rubric 1-10. Adjust if needed.
3. Extract or confirm contact_info (phone, email, FB profile name).
4. Write action_recommended:
   - Score 9-10: "Call immediately — attach to hot-leads Slack"
   - Score 7-8:  "Follow up within 24h — add to leads tracker"
   - Score 5-6:  "Monitor — check again in 3 days"
   - Score 1-4:  "Archive — low priority"
5. Add field "classified_by": "s05-agent-${i + 1}"
6. Return the corrected JSON array. Same structure, all fields present.
`.trim(),
}));

const outFile = path.join(RAW_DIR, `s05-classifier-prompts-${today}.json`);
fs.writeFileSync(outFile, JSON.stringify(prompts, null, 2));
console.log(`[S05] ${prompts.length} classifier agents dispatched over ${rawLeads.length} raw leads.`);
