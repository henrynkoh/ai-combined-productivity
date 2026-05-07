#!/usr/bin/env node
/**
 * Session S09 — Dedup + Aggregator
 * Merges all session outputs, deduplicates, cross-references, writes master leads file
 * 20 sub-agents handle dedup in parallel by county/category shard
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const LEADS_DIR = path.join(__dirname, "../../data/leads");
const today = new Date().toISOString().slice(0, 10);

function loadAllLeads() {
  if (!fs.existsSync(LEADS_DIR)) return [];
  return fs.readdirSync(LEADS_DIR)
    .filter(f => f.endsWith(".json") && !f.includes("prompts") && !f.includes("master"))
    .flatMap(f => {
      try {
        const d = JSON.parse(fs.readFileSync(path.join(LEADS_DIR, f), "utf8"));
        return Array.isArray(d) ? d : [];
      } catch { return []; }
    });
}

function contentHash(lead) {
  const key = `${lead.poster_name}|${(lead.post_text || "").slice(0, 100)}|${lead.source_group}`;
  return crypto.createHash("md5").update(key).digest("hex");
}

// Deduplicate locally first
const allLeads = loadAllLeads();
const seen = new Set();
const deduped = allLeads.filter(l => {
  const h = contentHash(l);
  if (seen.has(h)) return false;
  seen.add(h);
  return true;
});

console.log(`[S09] Raw: ${allLeads.length} → Deduped: ${deduped.length} leads`);

// Shard by category for 20 agents
const categories = [...new Set(deduped.map(l => l.category || "OTHER"))];
const shards = categories.map(cat => ({
  category: cat,
  leads: deduped.filter(l => l.category === cat),
}));

const NUM_AGENTS = 20;
// Distribute shards round-robin across agents
const agentBuckets = Array.from({ length: NUM_AGENTS }, () => []);
shards.forEach((shard, i) => agentBuckets[i % NUM_AGENTS].push(...shard.leads));

const prompts = agentBuckets
  .filter(b => b.length > 0)
  .map((bucket, i) => ({
    agent_id: `s09-agent-${String(i + 1).padStart(2, "0")}`,
    prompt: `
You are AFH Aggregator Sub-Agent (shard ${i + 1}).

INPUT: ${JSON.stringify(bucket)}

TASK:
1. Within this shard, identify any remaining duplicates (same poster, similar text).
   Keep the one with the higher final_score. Remove the duplicate.
2. For SEEKING_PROVIDER + PROPERTY_LICENSED in the same county on the same day:
   Add field "cross_ref": "Potential match — provider seeking placement + licensed property available in [county]"
3. For BECOME_PROVIDER leads: check if any PROPERTY_* lead is in the same county.
   Add "cross_ref" noting the synergy.
4. Ensure all leads have: source_group, county, post_date, category, final_score, urgency, contact_info, action_recommended
5. Fill missing fields with null — do not drop leads.
6. Return cleaned, deduplicated JSON array sorted by final_score descending.
`.trim(),
  }));

// Write master deduped file
const masterFile = path.join(LEADS_DIR, `master-${today}.json`);
fs.writeFileSync(masterFile, JSON.stringify(deduped, null, 2));
console.log(`[S09] Master leads file: ${masterFile} (${deduped.length} leads)`);

const promptFile = path.join(LEADS_DIR, `s09-aggregator-prompts-${today}.json`);
fs.writeFileSync(promptFile, JSON.stringify(prompts, null, 2));
console.log(`[S09] ${prompts.length} aggregator agent prompts written.`);
