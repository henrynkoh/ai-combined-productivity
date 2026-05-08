#!/usr/bin/env node
// daily-summary.js — rolls up all hourly tables into a single daily report
const fs   = require("fs");
const path = require("path");

const HOURLY_DIR = path.join(__dirname, "../data/reports/hourly");
const DAILY_DIR  = path.join(__dirname, "../data/reports/daily");
const PROPS_DIR  = path.join(__dirname, "../data/properties");
fs.mkdirSync(DAILY_DIR, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const outFile = path.join(DAILY_DIR, `${today}.md`);

// Load all properties
function loadProperties() {
  if (!fs.existsSync(PROPS_DIR)) return [];
  return fs.readdirSync(PROPS_DIR).filter(f => f.endsWith(".json")).flatMap(f => {
    try { const d = JSON.parse(fs.readFileSync(path.join(PROPS_DIR, f), "utf8")); return Array.isArray(d) ? d : [d]; }
    catch { return []; }
  });
}

const props = loadProperties();
const qualified = props.filter(p => p.category !== "DOES_NOT_QUALIFY" && (p.score||0) > 0);
qualified.sort((a,b) => (b.score||0) - (a.score||0));

const wabo = qualified.filter(p => p.category === "AFH_WABO_READY");
const insp = qualified.filter(p => p.category === "AFH_INSPECTION_READY");
const pot  = qualified.filter(p => p.category === "AFH_POTENTIAL");

// Count hourly reports generated today
const hourlyReports = fs.existsSync(HOURLY_DIR)
  ? fs.readdirSync(HOURLY_DIR).filter(f => f.startsWith(today)).length : 0;

// County breakdown
const byCounty = qualified.reduce((a,p) => { a[p.county||"Unknown"] = (a[p.county||"Unknown"]||0)+1; return a; }, {});

const lines = [
  `# AFHP Daily Property Report — ${today}`,
  `_${qualified.length} qualifying properties across ${hourlyReports} hourly scans_`,
  "",
  "## Day Summary",
  "| Metric | Value |",
  "|--------|-------|",
  `| Hourly scans run        | ${hourlyReports} / 24 |`,
  `| Total properties found  | ${props.length} |`,
  `| Qualifying properties   | ${qualified.length} |`,
  `| 🏆 WABO Ready           | ${wabo.length} |`,
  `| ✅ Inspection Ready     | ${insp.length} |`,
  `| 🔵 AFH Potential        | ${pot.length} |`,
  "",
  "## By County",
  "| County | Count |",
  "|--------|-------|",
  ...Object.entries(byCounty).sort((a,b)=>b[1]-a[1]).map(([c,n])=>`| ${c} | ${n} |`),
  "",
  "## Top 20 Properties of the Day",
  "| # | Location | Price | Bed | Bath | Sqft | Style | County | Category | Score |",
  "|---|----------|-------|-----|------|------|-------|--------|----------|-------|",
  ...qualified.slice(0,20).map((p,i) => {
    const cat = p.category.replace("AFH_WABO_READY","🏆 WABO").replace("AFH_INSPECTION_READY","✅ INSP").replace("AFH_POTENTIAL","🔵 POT");
    const sty = (p.style||"?").replace("rambler-basement","R+Bsmt").replace("rambler-bonus","R+Bonus").replace("rambler","Rambler");
    return `| ${i+1} | ${(p.city||p.address||"?").slice(0,25)} | ${p.price?`$${Number(p.price).toLocaleString()}`:"N/A"} | ${p.beds||"?"} | ${p.baths||"?"} | ${p.sqft?p.sqft.toLocaleString():"?"} | ${sty} | ${p.county||"?"} | ${cat} | **${(p.score||0).toFixed(1)}** |`;
  }),
  "",
  "---",
  `_Report generated: ${new Date().toISOString()}_`,
];

fs.writeFileSync(outFile, lines.join("\n"));
console.log(`\nDaily report saved: ${outFile}`);
console.log(`Top property: ${qualified[0] ? `${qualified[0].city} — ${qualified[0].category} score ${qualified[0].score}` : "none yet"}`);
