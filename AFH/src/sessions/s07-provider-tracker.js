#!/usr/bin/env node
/**
 * Session S07 — Provider Opportunity Tracker
 * Tracks SEEKING_PROVIDER, PROVIDER_WANTED, BECOME_PROVIDER leads
 * Enriches with follow-up strategy and urgency
 * 20 sub-agents
 */
const fs = require("fs");
const path = require("path");

const PROCESSED_DIR = path.join(__dirname, "../../data/processed");
const today = new Date().toISOString().slice(0, 10);

function loadProcessedLeads() {
  if (!fs.existsSync(PROCESSED_DIR)) return [];
  return fs.readdirSync(PROCESSED_DIR)
    .filter(f => f.endsWith(".json"))
    .flatMap(f => {
      try {
        const d = JSON.parse(fs.readFileSync(path.join(PROCESSED_DIR, f), "utf8"));
        return Array.isArray(d) ? d : [];
      } catch { return []; }
    });
}

const providerCategories = ["SEEKING_PROVIDER", "PROVIDER_WANTED", "BECOME_PROVIDER"];
const leads = loadProcessedLeads().filter(l => providerCategories.includes(l.category));

const NUM_AGENTS = 20;
const batchSize = Math.max(1, Math.ceil(leads.length / NUM_AGENTS));

const prompts = Array.from({ length: Math.min(NUM_AGENTS, Math.max(1, leads.length)) }, (_, i) => {
  const batch = leads.slice(i * batchSize, (i + 1) * batchSize);
  return {
    agent_id: `s07-agent-${String(i + 1).padStart(2, "0")}`,
    prompt: `
You are AFH Provider Opportunity Tracker Sub-Agent (batch ${i + 1}).

INPUT: ${JSON.stringify(batch)}

For each lead, determine:

IF category = SEEKING_PROVIDER:
- What care level does the client need? (memory care, ambulatory, high acuity?)
- Is DSHS waiver mentioned? (Medicaid waiver = guaranteed payment)
- Timeline urgency: immediate / within 30 days / flexible
- Add field "client_profile": { care_level, waiver_status, timeline, county }
- Match opportunity: "If you have an open bed in [county], this is a direct placement."

IF category = BECOME_PROVIDER:
- Does person have capital mentioned? Property? Caregiver experience?
- Are they asking about WABO training, DSHS licensing process, or startup costs?
- Add field "prospect_profile": { readiness_level (early/mid/ready), needs, county }
- Recommended resource: DSHS AFH licensing page, WABO training centers, startup guide

IF category = PROVIDER_WANTED:
- What role? (Caregiver, co-operator, manager, overnight)
- Compensation mentioned?
- Add field "job_profile": { role, pay_mentioned, schedule, county }

Add field "follow_up_script": a 2-sentence outreach message appropriate for the lead.
Return enhanced JSON array.
`.trim(),
  };
});

const outFile = path.join(PROCESSED_DIR, `s07-provider-prompts-${today}.json`);
fs.writeFileSync(outFile, JSON.stringify(prompts, null, 2));
console.log(`[S07] ${prompts.length} provider tracker agents for ${leads.length} leads.`);
