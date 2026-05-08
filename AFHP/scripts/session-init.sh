#!/usr/bin/env bash
set -euo pipefail

BASE="/home/user/ai-combined-productivity/AFHP"
TODAY=$(date +%Y-%m-%d)
HOUR=$(date +%H)

mkdir -p "$BASE/data/raw" "$BASE/data/processed" \
         "$BASE/data/properties" "$BASE/data/reports/hourly" \
         "$BASE/data/reports/daily" "$BASE/data/logs"

LOG="$BASE/data/logs/session-$TODAY.log"

echo "============================================" | tee -a "$LOG"
echo "AFHP Session Start: $(date)"                 | tee -a "$LOG"
echo "============================================" | tee -a "$LOG"

# Rotate raw files older than 3 days
find "$BASE/data/raw" -name "*.json" -mtime +3 -delete 2>/dev/null || true

echo ""
echo "--- Property Database Counts ---"
TOTAL=$(find "$BASE/data/properties" -name "*.json" 2>/dev/null | wc -l)
echo "Properties collected : $TOTAL files"
echo "Hourly reports       : $(find "$BASE/data/reports/hourly" -name "*.md" 2>/dev/null | wc -l)"
echo "Daily reports        : $(find "$BASE/data/reports/daily"  -name "*.md" 2>/dev/null | wc -l)"

echo ""
echo "--- Target Summary ---"
node "$BASE/scripts/list-targets.js" 2>/dev/null || echo "(run list-targets.js to see targets)"

echo ""
echo "Next hourly report due: $(date -d '+1 hour' '+%H:%M') local time"
echo "Loop command: /loop 60m node src/orchestrator.js"
echo ""
echo "AFHP session ready."
