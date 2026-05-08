#!/usr/bin/env node
/**
 * build-table.js
 * Reads all collected properties, applies hard filters, sorts by score,
 * and writes the full markdown table to data/reports/hourly/YYYY-MM-DD-HH.md
 */
const fs   = require("fs");
const path = require("path");
const crypto = require("crypto");

const BASE          = path.join(__dirname, "..");
const PROPS_DIR     = path.join(BASE, "data/properties");
const HOURLY_DIR    = path.join(BASE, "data/reports/hourly");
const CRITERIA      = require("../config/targets.json").afh_hard_requirements;

fs.mkdirSync(HOURLY_DIR, { recursive: true });

const now     = new Date();
const dateStr = now.toISOString().slice(0, 10);
const hourStr = String(now.getHours()).padStart(2, "0");
const outFile = path.join(HOURLY_DIR, `${dateStr}-${hourStr}.md`);

// Load all property JSON files
function loadProperties() {
  if (!fs.existsSync(PROPS_DIR)) return [];
  return fs.readdirSync(PROPS_DIR)
    .filter(f => f.endsWith(".json"))
    .flatMap(f => {
      try {
        const d = JSON.parse(fs.readFileSync(path.join(PROPS_DIR, f), "utf8"));
        return Array.isArray(d) ? d : [d];
      } catch { return []; }
    });
}

// Deduplicate by content hash
function dedup(props) {
  const seen = new Set();
  return props.filter(p => {
    const key = `${p.address}|${p.price}|${p.beds}|${p.sqft}`.toLowerCase();
    const h = crypto.createHash("md5").update(key).digest("hex");
    if (seen.has(h)) return false;
    seen.add(h);
    return true;
  });
}

// Hard filter
function passesHardFilter(p) {
  if ((p.beds  || 0) < CRITERIA.min_beds)  return false;
  if ((p.baths || 0) < CRITERIA.min_baths) return false;
  if ((p.sqft  || 0) < CRITERIA.min_sqft)  return false;
  if (p.price && p.price > CRITERIA.max_price) return false;
  if (p.category === "DOES_NOT_QUALIFY") return false;
  return true;
}

function fmt(n) { return n ? `$${Number(n).toLocaleString()}` : "N/A"; }
function cap(s, n=30) { return s ? (s.length > n ? s.slice(0,n)+"…" : s) : "—"; }

const CATEGORY_EMOJI = {
  AFH_WABO_READY:       "🏆 WABO READY",
  AFH_INSPECTION_READY: "✅ INSP READY",
  AFH_POTENTIAL:        "🔵 POTENTIAL",
};

const allProps  = dedup(loadProperties());
const qualified = allProps.filter(passesHardFilter).sort((a,b)=>(b.score||0)-(a.score||0));

const waboReady  = qualified.filter(p => p.category === "AFH_WABO_READY");
const inspReady  = qualified.filter(p => p.category === "AFH_INSPECTION_READY");
const potential  = qualified.filter(p => p.category === "AFH_POTENTIAL");

function buildSection(title, props, startIdx) {
  if (props.length === 0) return `\n### ${title}\n_None found this hour._\n`;
  const header = [
    `\n### ${title} (${props.length})`,
    "",
    "| # | Location | Price | Bed | Bath | Sqft | Style | County | Category | Score | Days | Contact | Source | Posted |",
    "|---|----------|-------|-----|------|------|-------|--------|----------|-------|------|---------|--------|--------|",
  ];
  const rows = props.map((p, i) => {
    const cat   = CATEGORY_EMOJI[p.category] || p.category;
    const style = (p.style || "?").replace("rambler-basement","R+Bsmt").replace("rambler-bonus","R+Bonus").replace("rambler","Rambler").replace("two-story","2-Story");
    return `| ${startIdx + i + 1} | ${cap(p.city || p.address, 25)} | ${fmt(p.price)} | ${p.beds||"?"} | ${p.baths||"?"} | ${p.sqft ? p.sqft.toLocaleString() : "?"} | ${style} | ${p.county||"?"} | ${cat} | **${(p.score||0).toFixed(1)}** | ${p.days_listed ?? "?"}d | ${cap(p.contact_info, 20)} | ${cap(p.source_group, 22)} | ${p.post_date||"?"} |`;
  });
  return [...header, ...rows].join("\n");
}

const lines = [
  `# AFHP Property Table — ${dateStr} ${hourStr}:00`,
  `_Generated: ${now.toISOString()} | ${qualified.length} qualifying properties | ${allProps.length} total collected_`,
  "",
  "## Quick Stats",
  `| Category | Count |`,
  `|----------|-------|`,
  `| 🏆 AFH WABO Ready        | **${waboReady.length}** |`,
  `| ✅ AFH Inspection Ready   | **${inspReady.length}** |`,
  `| 🔵 AFH Potential          | **${potential.length}** |`,
  `| **Total Qualifying**      | **${qualified.length}** |`,
  "",
  "## Hard Filter Requirements",
  `_3+ beds · 2+ baths · 2,000+ sqft · Rambler preferred · Under $600,000 · Washington State_`,
  "",
  buildSection("🏆 AFH WABO Ready", waboReady, 0),
  buildSection("✅ AFH Inspection Ready", inspReady, waboReady.length),
  buildSection("🔵 AFH Potential", potential, waboReady.length + inspReady.length),
  "",
  "---",
  `_Next update: ${new Date(now.getTime() + 3600000).toISOString().slice(11,16)} UTC_`,
];

fs.writeFileSync(outFile, lines.join("\n"));
console.log(`[build-table] Written: ${outFile}`);
console.log(`  WABO Ready: ${waboReady.length} | Inspection Ready: ${inspReady.length} | Potential: ${potential.length}`);
module.exports = { outFile, qualified };
