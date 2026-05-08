#!/usr/bin/env node
/**
 * status.js — Unified dashboard for all AFH projects
 * Run: node status.js
 * Shows: latest property table, lead counts, last run times, hot alerts
 */
const fs   = require("fs");
const path = require("path");

const BASE     = __dirname;
const TODAY    = new Date().toISOString().slice(0, 10);
const NOW_HOUR = String(new Date().getHours()).padStart(2, "0");

function readJSON(fp) {
  try { return JSON.parse(fs.readFileSync(fp, "utf8")); } catch { return null; }
}

function countFiles(dir, ext = ".json") {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter(f => f.endsWith(ext)).length;
}

function latestFile(dir, ext = ".md") {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(ext)).sort().reverse();
  return files[0] ? path.join(dir, files[0]) : null;
}

function loadProperties(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".json") && !f.includes("prompts"))
    .flatMap(f => {
      try { const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); return Array.isArray(d) ? d : [d]; }
      catch { return []; }
    })
    .filter(p => p.category && p.category !== "DOES_NOT_QUALIFY");
}

function loadLeads(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".json") && !f.includes("prompts") && !f.includes("scorer"))
    .flatMap(f => {
      try { const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); return Array.isArray(d) ? d : [d]; }
      catch { return []; }
    });
}

// ── AFHP stats ──────────────────────────────────────────────────────────────
const afhpProps   = loadProperties(path.join(BASE, "AFHP/data/properties"));
const afhpHourly  = path.join(BASE, "AFHP/data/reports/hourly");
const afhpDaily   = path.join(BASE, "AFHP/data/reports/daily");
const hourlyToday = fs.existsSync(afhpHourly)
  ? fs.readdirSync(afhpHourly).filter(f => f.startsWith(TODAY)).length : 0;
const latestReport = latestFile(afhpHourly, ".md");
const wabo   = afhpProps.filter(p => p.category === "AFH_WABO_READY");
const insp   = afhpProps.filter(p => p.category === "AFH_INSPECTION_READY");
const pot    = afhpProps.filter(p => p.category === "AFH_POTENTIAL");

// ── AFH Intel stats ─────────────────────────────────────────────────────────
const afhLeads = loadLeads(path.join(BASE, "AFH/data/leads"));
const hotLeads = afhLeads.filter(l => (l.score || 0) >= 7);
const alerts   = path.join(BASE, "AFH/data/logs/critical-alerts.txt");
const waboAlerts = path.join(BASE, "AFHP/data/logs/wabo-alerts.txt");

// ── Print ────────────────────────────────────────────────────────────────────
const line = "─".repeat(52);
console.log(`\n${"═".repeat(52)}`);
console.log(`  AFH PROJECT SUITE — STATUS   ${TODAY} ${NOW_HOUR}:xx`);
console.log(`${"═".repeat(52)}`);

console.log(`\n🏠 AFHP PROPERTY SCOUT`);
console.log(line);
console.log(`  Hourly scans today   : ${hourlyToday} / 24`);
console.log(`  Total properties     : ${afhpProps.length}`);
console.log(`  🏆 WABO Ready        : ${wabo.length}`);
console.log(`  ✅ Inspection Ready  : ${insp.length}`);
console.log(`  🔵 AFH Potential     : ${pot.length}`);
console.log(`  Latest report        : ${latestReport ? path.basename(latestReport) : "none yet"}`);

if (wabo.length > 0) {
  console.log(`\n  TOP WABO PROPERTIES:`);
  wabo.sort((a,b)=>(b.score||0)-(a.score||0)).slice(0,3).forEach((p,i) => {
    console.log(`    ${i+1}. ${p.city||p.address||"?"} | $${p.price?Number(p.price).toLocaleString():"N/A"} | ${p.beds}bd/${p.baths}ba | Score ${p.score}`);
  });
}

console.log(`\n👥 AFH INTEL (Providers & Placements)`);
console.log(line);
console.log(`  Total leads          : ${afhLeads.length}`);
console.log(`  Hot leads (score ≥7) : ${hotLeads.length}`);

const byCategory = afhLeads.reduce((a, l) => { a[l.category||"?"] = (a[l.category||"?"]||0)+1; return a; }, {});
Object.entries(byCategory).sort((a,b)=>b[1]-a[1]).slice(0,5).forEach(([cat,n]) => {
  console.log(`  ${cat.padEnd(24)} ${n}`);
});

if (fs.existsSync(waboAlerts)) {
  const lines = fs.readFileSync(waboAlerts,"utf8").trim().split("\n").filter(Boolean);
  if (lines.length) {
    console.log(`\n🚨 RECENT WABO ALERTS (${lines.length} total):`);
    lines.slice(-3).forEach(l => console.log(`  ${l}`));
  }
}

if (fs.existsSync(alerts)) {
  const aLines = fs.readFileSync(alerts,"utf8").trim().split("\n").filter(Boolean);
  if (aLines.length) {
    console.log(`\n🚨 RECENT AFH ALERTS (${aLines.length} total):`);
    aLines.slice(-3).forEach(l => console.log(`  ${l}`));
  }
}

console.log(`\n📋 COMMANDS`);
console.log(line);
console.log(`  node launch-all.js          # start both projects (loop)`);
console.log(`  node launch-all.js --once   # run both once`);
console.log(`  node launch-all.js --status # quick status`);
console.log(`  node AFHP/scripts/show-table.js --latest  # latest property table`);
console.log(`  node AFH/scripts/check-leads.js           # AFH lead summary`);
console.log(`\n  /loop 60m node AFHP/src/orchestrator.js   # AFHP in Claude session`);
console.log(`  /loop 120m node AFH/src/orchestrator.js   # AFH in Claude session`);
console.log(`${"═".repeat(52)}\n`);
