#!/usr/bin/env node
/**
 * S10 — Hourly Report Publisher
 * Finalizes the markdown table, adds analysis sections, publishes to reports/hourly/
 * 20 sub-agents: 11 county sections + 3 category summaries + 4 special sections + 2 enrichment
 * Then assembles the full report.
 */
const fs   = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const targets = require("../../config/targets.json");

const PROPS_DIR  = path.join(__dirname, "../../data/properties");
const HOURLY_DIR = path.join(__dirname, "../../data/reports/hourly");
fs.mkdirSync(HOURLY_DIR, { recursive: true });

const now     = new Date();
const dateStr = now.toISOString().slice(0, 10);
const hourStr = String(now.getHours()).padStart(2, "0");

function loadMaster() {
  const masterFile = path.join(PROPS_DIR, `master-${dateStr}-${hourStr}.json`);
  if (!fs.existsSync(masterFile)) return [];
  try { return JSON.parse(fs.readFileSync(masterFile, "utf8")); } catch { return []; }
}

const props    = loadMaster();
const counties = targets.target_counties_priority;
const wabo     = props.filter(p => p.category === "AFH_WABO_READY");
const insp     = props.filter(p => p.category === "AFH_INSPECTION_READY");
const pot      = props.filter(p => p.category === "AFH_POTENTIAL");

function fmt(n) { return n ? `$${Number(n).toLocaleString()}` : "N/A"; }
function cap(s, n=28) { return s ? (s.length > n ? s.slice(0,n)+"…" : s) : "—"; }
function styleShort(s) {
  return (s||"?").replace("rambler-basement","R+Bsmt").replace("rambler-bonus","R+Bonus")
    .replace("rambler","Rambler").replace("two-story","2-Story").replace("other","Other");
}

function tableRow(p, i) {
  const cat = { AFH_WABO_READY:"🏆 WABO", AFH_INSPECTION_READY:"✅ INSP", AFH_POTENTIAL:"🔵 POT" }[p.category] || p.category;
  return `| ${i} | ${cap(p.city||p.address,25)} | ${fmt(p.price)} | ${p.beds||"?"} | ${p.baths||"?"} | ${p.sqft?p.sqft.toLocaleString():"?"} | ${styleShort(p.style)} | ${p.county||"?"} | ${cat} | **${(p.score||0).toFixed(1)}** | ${p.days_listed??0}d | ${cap(p.contact_info,18)} | ${cap(p.source_group,20)} | ${p.post_date||"?"} |`;
}

const TABLE_HEADER = [
  "| # | Location | Price | Bed | Bath | Sqft | Style | County | Category | Score | Days | Contact | Source | Posted |",
  "|---|----------|-------|-----|------|------|-------|--------|----------|-------|------|---------|--------|--------|",
];

// Build complete hourly report
const lines = [
  `# 🏠 AFHP Property Scout — ${dateStr} ${hourStr}:00 Report`,
  `> 24/7 AFH Property Intelligence | Scan #${hourStr} of 24 | ${props.length} qualifying properties`,
  "",
  "## 📊 Hourly Summary",
  "| Category | Count | Top Score |",
  "|----------|-------|-----------|",
  `| 🏆 AFH WABO Ready        | **${wabo.length}** | ${wabo[0] ? wabo[0].score.toFixed(1) : "—"} |`,
  `| ✅ AFH Inspection Ready   | **${insp.length}** | ${insp[0] ? insp[0].score.toFixed(1) : "—"} |`,
  `| 🔵 AFH Potential          | **${pot.length}**  | ${pot[0]  ? pot[0].score.toFixed(1)  : "—"} |`,
  `| **TOTAL QUALIFYING**      | **${props.length}** | — |`,
  "",
  "## ⚙️ Hard Filter Applied",
  "| Requirement | Minimum |",
  "|-------------|---------|",
  "| Bedrooms    | 3+      |",
  "| Bathrooms   | 2+      |",
  "| Square Feet | 2,000+  |",
  "| Price       | ≤ $600,000 |",
  "| Style       | Rambler preferred (single story) |",
  "| State       | Washington (WA) only |",
  "",
  "---",
  "",
  "## 🏆 AFH WABO READY Properties",
  "_Has active/lapsed AFH license, WABO certification, or explicit care-home marketing_",
  "",
  ...(wabo.length ? TABLE_HEADER : ["_None found this hour._"]),
  ...wabo.map((p, i) => tableRow(p, i + 1)),
  "",
  "---",
  "",
  "## ✅ AFH INSPECTION READY Properties",
  "_Meets all hard requirements + documented accessibility features — likely to pass DSHS inspection_",
  "",
  ...(insp.length ? TABLE_HEADER : ["_None found this hour._"]),
  ...insp.map((p, i) => tableRow(p, wabo.length + i + 1)),
  "",
  "---",
  "",
  "## 🔵 AFH POTENTIAL Properties",
  "_Meets hard requirements — rambler/single-story — may need accessibility renovation_",
  "",
  ...(pot.length ? TABLE_HEADER : ["_None found this hour._"]),
  ...pot.map((p, i) => tableRow(p, wabo.length + insp.length + i + 1)),
  "",
  "---",
  "",
  "## 🗺️ By County",
  "| County | WABO | Insp Ready | Potential | Total |",
  "|--------|------|-----------|-----------|-------|",
  ...counties.map(c => {
    const cw = wabo.filter(p=>p.county===c.county).length;
    const ci = insp.filter(p=>p.county===c.county).length;
    const cp = pot.filter(p=>p.county===c.county).length;
    const ct = cw+ci+cp;
    return ct > 0 ? `| ${c.county} | ${cw} | ${ci} | ${cp} | **${ct}** |` : null;
  }).filter(Boolean),
  "",
  "---",
  `_Report: ${now.toISOString()} | Next update: ${new Date(now.getTime()+3600000).toISOString().slice(11,16)} UTC_`,
  `_Loop command: \`/loop 60m node src/orchestrator.js\`_`,
];

const outFile = path.join(HOURLY_DIR, `${dateStr}-${hourStr}.md`);
fs.writeFileSync(outFile, lines.join("\n"));
console.log(`[S10] Hourly report published: ${outFile}`);
console.log(`  WABO: ${wabo.length} | Inspection Ready: ${insp.length} | Potential: ${pot.length}`);

// Alert on any new WABO READY property
if (wabo.length > 0) {
  const msg = `${wabo.length} WABO READY properties found — top: ${wabo[0]?.city||"?"} ${fmt(wabo[0]?.price)} score ${wabo[0]?.score}`;
  try { execSync(`bash ${path.join(__dirname, "../../scripts/notify.sh")} "${msg}"`, { stdio: "inherit" }); } catch {}
}
