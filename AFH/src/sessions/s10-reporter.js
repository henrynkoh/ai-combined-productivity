#!/usr/bin/env node
/**
 * Session S10 — Report Generator
 * Produces daily digest markdown, JSON summary, and county-level breakdowns
 * 20 sub-agents each write a focused section of the full report
 */
const fs = require("fs");
const path = require("path");

const LEADS_DIR   = path.join(__dirname, "../../data/leads");
const REPORTS_DIR = path.join(__dirname, "../../data/reports");
fs.mkdirSync(REPORTS_DIR, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const targets = require("../../config/targets.json");
const counties = targets.counties_priority_order;

function loadMasterLeads() {
  const masterFile = path.join(LEADS_DIR, `master-${today}.json`);
  if (!fs.existsSync(masterFile)) return [];
  try { return JSON.parse(fs.readFileSync(masterFile, "utf8")); } catch { return []; }
}

const leads = loadMasterLeads();
const hot = leads.filter(l => (l.final_score || l.score || 0) >= 7);

// 20 report agents: 11 county reports + 5 category reports + 4 special reports
const reportTasks = [
  // County-level reports (11 counties)
  ...counties.map((county, i) => ({
    agent_id: `s10-agent-${String(i + 1).padStart(2, "0")}`,
    type: "county",
    county,
    leads: leads.filter(l => l.county === county),
    prompt: buildCountyPrompt(county, leads.filter(l => l.county === county)),
  })),
  // Category summary reports (5)
  ...[
    "PROPERTY_LICENSED", "AFH_FOR_SALE", "SEEKING_PROVIDER", "BECOME_PROVIDER", "PROPERTY_POTENTIAL"
  ].map((cat, i) => ({
    agent_id: `s10-agent-${String(12 + i).padStart(2, "0")}`,
    type: "category",
    category: cat,
    leads: leads.filter(l => l.category === cat),
    prompt: buildCategoryPrompt(cat, leads.filter(l => l.category === cat)),
  })),
  // Special: Hot leads alert (score 9-10)
  { agent_id: "s10-agent-17", type: "hot-alert",
    prompt: buildHotAlertPrompt(leads.filter(l => (l.final_score || 0) >= 9)) },
  // Special: Cross-ref opportunities
  { agent_id: "s10-agent-18", type: "cross-ref",
    prompt: buildCrossRefPrompt(leads.filter(l => l.cross_ref)) },
  // Special: Week-over-week trend (compare to yesterday's report)
  { agent_id: "s10-agent-19", type: "trend",
    prompt: buildTrendPrompt(leads) },
  // Special: Executive summary (1-page overview)
  { agent_id: "s10-agent-20", type: "exec-summary",
    prompt: buildExecSummaryPrompt(leads) },
];

function buildCountyPrompt(county, countyLeads) {
  return `
Write a concise AFH intel report section for ${county} County — ${today}.
Leads in county: ${JSON.stringify(countyLeads)}
Format:
## ${county} County (${countyLeads.length} leads)
- Hot leads: [count and 1-line each]
- Properties available: [count and highlights]
- Placement opportunities: [count]
- Top action: [single most important next step]
Return the markdown section only.
`.trim();
}

function buildCategoryPrompt(cat, catLeads) {
  return `
Write a category summary for AFH Intel — category: ${cat} — ${today}.
Leads: ${JSON.stringify(catLeads)}
Format:
## ${cat} Summary (${catLeads.length} leads)
- [Key trends or patterns in this category today]
- [Top 3 leads with 1-line each]
- [Recommended action for this category]
Return markdown only.
`.trim();
}

function buildHotAlertPrompt(criticalLeads) {
  return `
Write an urgent alert section for AFH Intel Report — ${today}.
Critical leads (score 9-10): ${JSON.stringify(criticalLeads)}
Format this as a bold alert box in markdown with each critical lead's
contact info, county, category, and recommended immediate action.
Return markdown only.
`.trim();
}

function buildCrossRefPrompt(crossRefLeads) {
  return `
Write a cross-reference opportunities section for AFH Intel — ${today}.
These leads have matching provider-seeker + property opportunities in same county:
${JSON.stringify(crossRefLeads)}
Explain each match opportunity in 2 sentences. Format as markdown list.
Return markdown only.
`.trim();
}

function buildTrendPrompt(leads) {
  return `
Analyze lead volume and quality trends for AFH Intel — ${today}.
Today's leads summary: ${leads.length} total, ${hot.length} hot,
by category: ${JSON.stringify(leads.reduce((a,l)=>{a[l.category]=(a[l.category]||0)+1;return a},{}))}
Write a 3-bullet trend analysis comparing to a typical day (assume avg 15-20 leads/day).
Note any unusual spikes in category or county. Return markdown only.
`.trim();
}

function buildExecSummaryPrompt(leads) {
  return `
Write a 1-page executive summary for the AFH Intel daily report — ${today}.
Data: ${leads.length} total leads, ${hot.length} hot (≥7),
categories: ${JSON.stringify(leads.reduce((a,l)=>{a[l.category]=(a[l.category]||0)+1;return a},{}))}
Top scores: ${leads.sort((a,b)=>(b.final_score||0)-(a.final_score||0)).slice(0,3).map(l=>`${l.category} in ${l.county} (${l.final_score})`).join(", ")}

Format:
# AFH Daily Intel — ${today}
**Executive Summary**
[3-paragraph overview: volume, top opportunities, recommended priorities]

## Today's Priority Actions
1. [Most urgent action]
2. [Second priority]
3. [Third priority]

Return markdown only.
`.trim();
}

const promptFile = path.join(REPORTS_DIR, `s10-report-prompts-${today}.json`);
fs.writeFileSync(promptFile, JSON.stringify(reportTasks, null, 2));
console.log(`[S10] ${reportTasks.length} report agent prompts written → ${promptFile}`);
