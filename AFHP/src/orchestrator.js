#!/usr/bin/env node
/**
 * AFHP Master Orchestrator — runs every 60 minutes via /loop or cron
 *
 * Pipeline (10 sessions, 200 sub-agents):
 *   Phase 1 [parallel]    : S01, S02, S03, S04 — FB scraping (80 agents)
 *   Phase 2 [parallel]    : S05, S06, S07, S08  — filter+classify+score (80 agents)
 *   Phase 3 [sequential]  : S09                 — dedup + master file (20 agents)
 *   Phase 4 [sequential]  : S10                 — hourly table publish (20 agents)
 *
 * Run: node src/orchestrator.js
 * Loop: /loop 60m node src/orchestrator.js
 * Cron: 0 * * * * cd /home/user/ai-combined-productivity/AFHP && node src/orchestrator.js
 */
const { spawn } = require("child_process");
const path = require("path");
const fs   = require("fs");

const SESSIONS = path.join(__dirname, "sessions");
const LOG_DIR  = path.join(__dirname, "../data/logs");
fs.mkdirSync(LOG_DIR, { recursive: true });

const now     = new Date();
const dateStr = now.toISOString().slice(0, 10);
const hourStr = String(now.getHours()).padStart(2, "0");
const LOG     = path.join(LOG_DIR, `orchestrator-${dateStr}.log`);

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + "\n");
}

function run(name, script) {
  return new Promise((resolve) => {
    log(`→ ${name}`);
    const proc = spawn("node", [path.join(SESSIONS, script)], { stdio: ["ignore","pipe","pipe"] });
    proc.stdout.on("data", d => process.stdout.write(d));
    proc.stderr.on("data", d => process.stderr.write(d));
    proc.on("close", code => {
      log(`${code === 0 ? "✓" : "✗"} ${name} (exit ${code})`);
      resolve(); // always continue pipeline even on error
    });
  });
}

async function phase(label, sessions) {
  log(`\n══════ ${label} ══════`);
  await Promise.all(sessions.map(([name, script]) => run(name, script)));
  log(`══════ ${label} complete ══════\n`);
}

async function main() {
  const start = Date.now();
  log(`\n${"═".repeat(52)}`);
  log(`AFHP Orchestrator — ${dateStr} ${hourStr}:00 run`);
  log(`${"═".repeat(52)}`);

  // Phase 1: Scraping (parallel — 80 agents)
  await phase("Phase 1 — Scraping [S01-S04, 80 agents, parallel]", [
    ["S01 FB Group Alpha (King/Snohomish)",   "s01-fb-group-alpha.js"],
    ["S02 FB Group Beta (Pierce/Clark/etc)",  "s02-fb-group-beta.js"],
    ["S03 Facebook Marketplace Scanner",      "s03-fb-marketplace.js"],
    ["S04 Keyword Deep Scanner",              "s04-keyword-scanner.js"],
  ]);

  // Phase 2: Filter + Classify + Score (parallel — 80 agents)
  await phase("Phase 2 — Process [S05-S08, 80 agents, parallel]", [
    ["S05 Hard-Filter Validator",             "s05-hard-filter.js"],
    ["S06 AFH Category Classifier",           "s06-afh-classifier.js"],
    ["S07 Accessibility Signal Scorer",       "s07-accessibility-scorer.js"],
    ["S08 Price & Location Verifier",         "s08-price-location.js"],
  ]);

  // Phase 3: Dedup + Master file (20 agents)
  await phase("Phase 3 — Dedup [S09, 20 agents]", [
    ["S09 Dedup + Table Compiler", "s09-dedup-compiler.js"],
  ]);

  // Phase 4: Publish hourly report (20 agents)
  await phase("Phase 4 — Publish [S10, 20 agents]", [
    ["S10 Hourly Report Publisher", "s10-hourly-publisher.js"],
  ]);

  const elapsed = Math.round((Date.now() - start) / 1000);
  log(`\nRun complete in ${elapsed}s — Report: data/reports/hourly/${dateStr}-${hourStr}.md`);

  // Print table to console
  try {
    require("child_process").execSync(
      `node ${path.join(__dirname, "../scripts/show-table.js")} --latest`,
      { stdio: "inherit" }
    );
  } catch {}
}

main().catch(err => { log(`FATAL: ${err.message}`); process.exit(1); });
