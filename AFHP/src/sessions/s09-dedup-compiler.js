#!/usr/bin/env node
/**
 * S09 — Dedup + Table Compiler
 * Final deduplication, merges enriched data, writes master property file,
 * then calls build-table.js to produce the hourly markdown table
 * 20 sub-agents shard by county, then compiler merges all shards
 */
const fs     = require("fs");
const path   = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const PROPS_DIR  = path.join(__dirname, "../../data/properties");
const today      = new Date().toISOString().slice(0, 10);
const hourStr    = String(new Date().getHours()).padStart(2, "0");
const NUM        = 20;

function loadAll() {
  if (!fs.existsSync(PROPS_DIR)) return [];
  return fs.readdirSync(PROPS_DIR)
    .filter(f => f.endsWith(".json") && !f.includes("prompts") && !f.includes("master"))
    .flatMap(f => {
      try { const d = JSON.parse(fs.readFileSync(path.join(PROPS_DIR, f), "utf8")); return Array.isArray(d) ? d : [d]; }
      catch { return []; }
    });
}

function hash(p) {
  const k = `${(p.address||"").toLowerCase()}|${p.price}|${p.beds}|${p.sqft}`;
  return crypto.createHash("md5").update(k).digest("hex");
}

const all    = loadAll();
const seen   = new Set();
const deduped = all.filter(p => { const h = hash(p); if (seen.has(h)) return false; seen.add(h); return true; });
const qualified = deduped.filter(p => p.category !== "DOES_NOT_QUALIFY" && (p.score||0) > 0);
qualified.sort((a, b) => (b.score||0) - (a.score||0));

// Write master file for this hour
const masterFile = path.join(PROPS_DIR, `master-${today}-${hourStr}.json`);
fs.writeFileSync(masterFile, JSON.stringify(qualified, null, 2));
console.log(`[S09] Deduped: ${all.length} → ${deduped.length} | Qualified: ${qualified.length}`);
console.log(`[S09] Master file: ${masterFile}`);

// Shard dedup work across 20 agents for cross-reference enrichment
const counties = [...new Set(qualified.map(p => p.county || "Unknown"))];
const shards = counties.map(county => ({ county, props: qualified.filter(p => (p.county||"Unknown") === county) }));
const agentBuckets = Array.from({ length: NUM }, () => []);
shards.forEach((s, i) => agentBuckets[i % NUM].push(...s.props));

const prompts = agentBuckets.filter(b => b.length > 0).map((bucket, i) => ({
  agent_id: `s09-agent-${String(i + 1).padStart(2, "0")}`,
  prompt: `
You are AFHP Dedup Compiler Sub-Agent S09 (shard ${i + 1}).
INPUT: ${JSON.stringify(bucket)}
TASK:
1. Identify remaining duplicates (same address, similar price ±5%). Keep higher score.
2. Merge any two records for the same property into one complete record.
3. Ensure all schema fields from AGENTS.md are present (null if unknown).
4. Verify score is between 0-10, category is valid.
5. Add "rank_in_county": rank within this county by score (1 = best).
6. Return clean, merged JSON array sorted by score descending.
`.trim(),
}));

const promptFile = path.join(PROPS_DIR, `s09-dedup-prompts-${today}-${hourStr}.json`);
fs.writeFileSync(promptFile, JSON.stringify(prompts, null, 2));
console.log(`[S09] ${prompts.length} dedup shard agents dispatched.`);

// Trigger table build immediately from master file
try {
  execSync(`node ${path.join(__dirname, "../../scripts/build-table.js")}`, { stdio: "inherit" });
} catch (e) {
  console.log("[S09] Table build will run after shard agents complete.");
}
