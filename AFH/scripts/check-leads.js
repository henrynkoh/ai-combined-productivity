#!/usr/bin/env node
// check-leads.js — print scored lead summary. Called at SessionStart.
const fs = require("fs");
const path = require("path");

const LEADS_DIR = path.join(__dirname, "../data/leads");
const args = process.argv.slice(2);
const summaryMode = args.includes("--summary");

function loadLeads() {
  if (!fs.existsSync(LEADS_DIR)) return [];
  return fs
    .readdirSync(LEADS_DIR)
    .filter((f) => f.endsWith(".json"))
    .flatMap((f) => {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(LEADS_DIR, f), "utf8"));
        return Array.isArray(raw) ? raw : [raw];
      } catch {
        return [];
      }
    });
}

const leads = loadLeads();

if (leads.length === 0) {
  console.log("No scored leads yet.");
  process.exit(0);
}

// Sort by score desc
leads.sort((a, b) => (b.score || 0) - (a.score || 0));

const byCategory = leads.reduce((acc, l) => {
  acc[l.category] = (acc[l.category] || 0) + 1;
  return acc;
}, {});

const hot = leads.filter((l) => l.score >= 7);
const today = new Date().toISOString().slice(0, 10);
const todayLeads = leads.filter((l) => (l.post_date || "").startsWith(today));

console.log("\n========= AFH Lead Summary =========");
console.log(`Total leads     : ${leads.length}`);
console.log(`Hot (score ≥7)  : ${hot.length}`);
console.log(`New today       : ${todayLeads.length}`);
console.log("\n--- By Category ---");
Object.entries(byCategory)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => console.log(`  ${cat.padEnd(22)} ${count}`));

if (!summaryMode && hot.length > 0) {
  console.log("\n--- Top 10 Hot Leads ---");
  hot.slice(0, 10).forEach((l, i) => {
    console.log(
      `\n[${i + 1}] Score:${l.score} | ${l.category} | ${l.county || "?"} county`
    );
    console.log(`    ${(l.post_text || "").slice(0, 120)}...`);
    console.log(`    Contact: ${l.contact_info || "N/A"} | Source: ${l.source_group || "?"}`);
  });
}
console.log("=====================================\n");
