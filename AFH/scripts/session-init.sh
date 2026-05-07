#!/usr/bin/env bash
# Runs at SessionStart for every AFH session
set -euo pipefail

BASE="/home/user/ai-combined-productivity/AFH"
TODAY=$(date +%Y-%m-%d)
LOG="$BASE/data/logs/session-$TODAY.log"

# Ensure all data dirs exist
mkdir -p "$BASE/data/raw" "$BASE/data/processed" \
         "$BASE/data/leads" "$BASE/data/reports" "$BASE/data/logs"

echo "========================================" | tee -a "$LOG"
echo "AFH Session Start: $(date)"              | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"

# Rotate raw files older than 7 days
find "$BASE/data/raw" -name "*.json" -mtime +7 -delete 2>/dev/null || true

# Print today's targets from config
echo ""
echo "--- Today's Target Groups ---"
node "$BASE/scripts/list-targets.js" 2>/dev/null || echo "(targets not yet loaded)"

# Print lead counts
echo ""
echo "--- Lead Counts (all time) ---"
echo "Raw collected  : $(find "$BASE/data/raw"       -name '*.json' | wc -l) files"
echo "Processed      : $(find "$BASE/data/processed" -name '*.json' | wc -l) files"
echo "Scored leads   : $(find "$BASE/data/leads"     -name '*.json' | wc -l) files"
echo "Reports        : $(find "$BASE/data/reports"   -name '*.json' | wc -l) files"

echo ""
echo "Session ready. CLAUDE.md loaded. Agents standing by."
