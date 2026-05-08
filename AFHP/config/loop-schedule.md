# AFHP Loop & Schedule — 24/7/365 Operation

## Quick Start (iPhone Safari)

1. Open `claude.ai/code` → select AFHP project
2. Type: `/loop 60m node src/orchestrator.js`
3. Close the tab — runs every hour in the cloud, 24/7

## Cron (Server — most reliable for 24/7/365)

```cron
# Run AFHP property scan every hour, every day of the year
0 * * * * cd /home/user/ai-combined-productivity/AFHP && node src/orchestrator.js >> data/logs/cron.log 2>&1
```

## tmux (VPS + iPhone SSH via Termius)

```bash
# Start once on your server:
tmux new-session -d -s afhp \
  "while true; do node /home/user/ai-combined-productivity/AFHP/src/orchestrator.js; sleep 3600; done"

# Reattach from iPhone anytime:
tmux attach -t afhp
```

## What Runs Each Hour (200 Agents)

```
:00  Orchestrator starts
:00  Phase 1 launches (parallel):
       S01 — 20 agents scan AFH/senior FB groups (King/Snohomish)
       S02 — 20 agents scan FB groups (Pierce/Clark/Spokane)
       S03 — 20 agents scan FB Marketplace + real estate groups
       S04 — 20 agents do keyword deep-search across all of Facebook
:20  Phase 2 launches (parallel):
       S05 — 20 agents apply hard filter (3bd/2ba/2000sqft/<$600k)
       S06 — 20 agents classify: WABO/INSPECTION READY/POTENTIAL
       S07 — 20 agents score accessibility signals (DSHS criteria)
       S08 — 20 agents verify price & county
:40  Phase 3:
       S09 — 20 agents dedup, merge, build master property file
:50  Phase 4:
       S10 — 20 agents publish hourly markdown table
:55  Table written to data/reports/hourly/YYYY-MM-DD-HH.md
     Pushover/Slack alert fired if any WABO READY property found
```

## Daily Output Volume

- 24 hourly tables per day → `data/reports/hourly/`
- 1 daily summary per day → `data/reports/daily/`
- Running property database → `data/properties/master-*.json`

## Mobile Check-In (2 min from iPhone)

```
Open AFHP session in Safari

"Show me the latest table"
→ node scripts/show-table.js --latest

"How many WABO ready properties today?"
→ node scripts/check-leads.js --wabo

"Show me only King county Inspection Ready, score 8+"
→ (Claude filters master JSON and renders filtered table)
```

## Environment Variables for Alerts

```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/..."   # Slack channel alerts
export PUSHOVER_TOKEN="your_token"                       # Pushover mobile push
export PUSHOVER_USER="your_user_key"                     # Pushover user key
```

Set these in your server's `.bashrc` or `.env` file.
WABO READY properties (score ≥ 9) trigger immediate mobile push.
