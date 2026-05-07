#!/usr/bin/env node
/**
 * AFH Master Orchestrator
 * Launches all 10 sessions in the correct pipeline order.
 * Designed to be called by the /loop skill or a scheduled cron.
 *
 * Pipeline:
 *   Phase 1 (parallel): S01, S02, S03, S04  — scraping
 *   Phase 2 (parallel): S05, S06, S07        — classification & analysis
 *   Phase 3 (sequential): S08, S09           — scoring & dedup
 *   Phase 4 (parallel): S10                  — reporting
 */
const { execSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const SESSIONS_DIR = path.join(__dirname, "sessions");
const LOG_DIR = path.join(__dirname, "../data/logs");
fs.mkdirSync(LOG_DIR, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const RUN_LOG = path.join(LOG_DIR, `orchestrator-${today}.log`);

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  fs.appendFileSync(RUN_LOG, line + "\n");
}

function runSession(name, scriptPath) {
  return new Promise((resolve, reject) => {
    log(`Starting ${name}...`);
    const proc = spawn("node", [scriptPath], { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    proc.stdout.on("data", d => { out += d; process.stdout.write(d); });
    proc.stderr.on("data", d => { process.stderr.write(d); });
    proc.on("close", code => {
      if (code === 0) { log(`✓ ${name} complete`); resolve(out); }
      else { log(`✗ ${name} failed (exit ${code})`); reject(new Error(`${name} exit ${code}`)); }
    });
  });
}

async function runPhase(phaseName, sessions) {
  log(`\n=== ${phaseName} ===`);
  await Promise.all(
    sessions.map(([name, script]) =>
      runSession(name, path.join(SESSIONS_DIR, script)).catch(err => {
        log(`WARNING: ${name} error — ${err.message} — continuing pipeline`);
      })
    )
  );
  log(`=== ${phaseName} done ===\n`);
}

async function main() {
  log("AFH Intel Orchestrator starting — 10 sessions, 200 sub-agents");
  log(`Run log: ${RUN_LOG}`);

  const start = Date.now();

  // Phase 1: Parallel scraping (S01-S04)
  await runPhase("Phase 1 — Scraping (S01-S04, parallel)", [
    ["S01 Group Watcher Alpha",  "s01-group-watcher-alpha.js"],
    ["S02 Group Watcher Beta",   "s02-group-watcher-beta.js"],
    ["S03 Keyword Scanner A",    "s03-keyword-scanner-a.js"],
    ["S04 Keyword Scanner B",    "s04-keyword-scanner-b.js"],
  ]);

  // Phase 2: Parallel classification (S05-S07)
  await runPhase("Phase 2 — Classification (S05-S07, parallel)", [
    ["S05 Ad Classifier",         "s05-classifier.js"],
    ["S06 Property Analyzer",     "s06-property-analyzer.js"],
    ["S07 Provider Tracker",      "s07-provider-tracker.js"],
  ]);

  // Phase 3: Sequential scoring + dedup (S08 then S09)
  await runPhase("Phase 3a — Scoring (S08)", [
    ["S08 Lead Scorer", "s08-lead-scorer.js"],
  ]);
  await runPhase("Phase 3b — Aggregation (S09)", [
    ["S09 Dedup + Aggregator", "s09-aggregator.js"],
  ]);

  // Phase 4: Reporting (S10)
  await runPhase("Phase 4 — Reporting (S10)", [
    ["S10 Report Generator", "s10-reporter.js"],
  ]);

  const elapsed = Math.round((Date.now() - start) / 1000);
  log(`\nAFH Intel run complete in ${elapsed}s`);

  // Print summary
  try {
    execSync(`node ${path.join(__dirname, "../scripts/check-leads.js")} --summary`, { stdio: "inherit" });
  } catch {}
}

main().catch(err => {
  log(`FATAL: ${err.message}`);
  process.exit(1);
});
