# AFH Loop & Schedule Configuration

## How to Run from Claude Code Session (Mobile or Desktop)

### Option A — One-shot run (any time)
Open a Claude Code session in the AFH directory and prompt:
```
Run the AFH orchestrator: node src/orchestrator.js
Then show me the lead summary.
```

### Option B — Loop (runs every N minutes in-session)
In a Claude Code session:
```
/loop 120m node /home/user/ai-combined-productivity/AFH/src/orchestrator.js
```
This runs the full 10-session pipeline every 2 hours while the tab is open.
Close the tab — the cloud session keeps looping.

### Option C — Scheduled runs via cron (on a VPS/server)
```cron
# Run AFH intel pipeline 3x daily: 6am, 12pm, 6pm Pacific
0 6,12,18 * * * cd /home/user/ai-combined-productivity/AFH && node src/orchestrator.js >> data/logs/cron.log 2>&1
```

### Option D — Background loop via tmux (iPhone SSH workflow)
```bash
# From Termius on iPhone, SSH into server:
tmux new-session -d -s afh "cd /home/user/ai-combined-productivity/AFH && watch -n 7200 node src/orchestrator.js"
# Detach. Reattach anytime: tmux attach -t afh
```

## Recommended Mobile Workflow (iPhone)

### Morning (5 min)
1. Open Safari → claude.ai/code → AFH project
2. Prompt: `Run check-leads.js and show me today's hot leads`
3. Review the top 5 leads. Assign follow-ups.
4. Start loop: `/loop 120m node src/orchestrator.js`
5. Close tab — pipeline runs all day in background.

### Midday Check (2 min)
1. Reopen AFH session tab
2. Prompt: `Show me any new leads since this morning with score >= 7`
3. Steer if needed: `Focus S04 agents on Snohomish county today`

### Evening (5 min)
1. Prompt: `Generate today's final report and show me the executive summary`
2. Check critical alerts log: `cat data/logs/critical-alerts.txt`
3. Close session — Stop hook auto-generates daily digest.

## Loop Interval Recommendations

| Frequency | Use Case |
|-----------|----------|
| `/loop 30m`  | Hot market — checking during a fast-moving buying window |
| `/loop 120m` | Standard daily monitoring (recommended) |
| `/loop 360m` | Light background monitoring, low-activity periods |
| Cron 3×/day | Server-side, no session needed |

## Sub-agent Parallelism Details

```
Phase 1 (scraping):    4 sessions × 20 agents = 80 agents  (parallel)
Phase 2 (classify):    3 sessions × 20 agents = 60 agents  (parallel)
Phase 3 (score+dedup): 2 sessions × 20 agents = 40 agents  (sequential)
Phase 4 (report):      1 session  × 20 agents = 20 agents  (parallel)
─────────────────────────────────────────────────────────
TOTAL:                10 sessions × 20 agents = 200 agents per run
```

## Scaling Up / Down

To run fewer agents (lighter load):
- Edit each session file: change `NUM_AGENTS = 20` to desired number
- Remove low-priority groups from `config/targets.json`

To add more counties or groups:
- Add entries to `config/targets.json` under the appropriate session key
- Add a new session file following the S01 template
- Register the new session in `src/orchestrator.js` Phase 1
