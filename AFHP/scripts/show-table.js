#!/usr/bin/env node
// show-table.js — prints the most recent or specified hourly report table
const fs   = require("fs");
const path = require("path");

const HOURLY_DIR = path.join(__dirname, "../data/reports/hourly");
const args = process.argv.slice(2);
const latest = args.includes("--latest");

function getLatestReport() {
  if (!fs.existsSync(HOURLY_DIR)) return null;
  const files = fs.readdirSync(HOURLY_DIR)
    .filter(f => f.endsWith(".md"))
    .sort()
    .reverse();
  return files[0] ? path.join(HOURLY_DIR, files[0]) : null;
}

const reportPath = latest ? getLatestReport() : (args[0] || getLatestReport());

if (!reportPath || !fs.existsSync(reportPath)) {
  console.log("No hourly report found yet. Run the orchestrator first.");
  process.exit(0);
}

console.log(`\n=== ${path.basename(reportPath)} ===\n`);
console.log(fs.readFileSync(reportPath, "utf8"));
