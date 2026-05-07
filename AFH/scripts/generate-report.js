#!/usr/bin/env node
// generate-report.js — builds daily digest JSON + markdown. Called at Stop hook.
const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "..");
const LEADS_DIR = path.join(BASE, "data/leads");
const REPORTS_DIR = path.join(BASE, "data/reports");
const today = new Date().toISOString().slice(0, 10);

fs.mkdirSync(REPORTS_DIR, { recursive: true });

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

const allLeads = loadLeads();
const todayLeads = allLeads.filter((l) => (l.post_date || "").startsWith(today));
todayLeads.sort((a, b) => (b.score || 0) - (a.score || 0));

const hot = todayLeads.filter((l) => l.score >= 7);
const byCategory = todayLeads.reduce((acc, l) => {
  acc[l.category] = (acc[l.category] || 0) + 1;
  return acc;
}, {});

// --- JSON report ---
const report = {
  date: today,
  generated_at: new Date().toISOString(),
  total_today: todayLeads.length,
  hot_leads: hot.length,
  by_category: byCategory,
  top_leads: hot.slice(0, 20),
};
const jsonPath = path.join(REPORTS_DIR, `${today}.json`);
fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

// --- Markdown report ---
const lines = [
  `# AFH Daily Intel Report — ${today}`,
  "",
  `**Total new leads:** ${todayLeads.length}  `,
  `**Hot leads (≥7):** ${hot.length}`,
  "",
  "## Breakdown by Category",
  ...Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, n]) => `- **${cat}**: ${n}`),
  "",
  "## Top Leads Today",
];

hot.slice(0, 20).forEach((l, i) => {
  lines.push(
    "",
    `### ${i + 1}. [Score ${l.score}] ${l.category} — ${l.county || "Unknown"} County`,
    `**Source:** ${l.source_group || "?"}  `,
    `**Date:** ${l.post_date || "?"}  `,
    `**Contact:** ${l.contact_info || "Not provided"}`,
    "",
    `> ${(l.post_text || "").slice(0, 300)}`,
    "",
    `**Recommended action:** ${l.action_recommended || "Review manually"}`,
    "",
    "---"
  );
});

const mdPath = path.join(REPORTS_DIR, `${today}.md`);
fs.writeFileSync(mdPath, lines.join("\n"));

console.log(`\nReport saved:\n  ${jsonPath}\n  ${mdPath}`);
console.log(`Hot leads today: ${hot.length} / ${todayLeads.length} total`);

// Alert if any score 9-10
const critical = todayLeads.filter((l) => l.score >= 9);
if (critical.length > 0) {
  console.log(`\n!!! ALERT: ${critical.length} critical lead(s) (score 9-10) !!!`);
  critical.forEach((l) =>
    console.log(`  → ${l.category} | ${l.county} | ${l.contact_info || "no contact"}`)
  );
  // Trigger notify script
  try {
    require("child_process").execSync(
      `bash ${path.join(BASE, "scripts/notify.sh")} "${critical.length} critical AFH leads found"`,
      { stdio: "inherit" }
    );
  } catch {}
}
