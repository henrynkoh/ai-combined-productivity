#!/usr/bin/env bash
# notify.sh — alert for WABO READY properties (score >= 9)
MESSAGE="${1:-AFHP: New WABO Ready property found}"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LOG="/home/user/ai-combined-productivity/AFHP/data/logs/alerts.log"
echo "[$TIMESTAMP] $MESSAGE" | tee -a "$LOG"

if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
  curl -s -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-type: application/json' \
    --data "{\"text\":\"🏠 *AFHP Alert* [$TIMESTAMP]: $MESSAGE\"}"
fi

if [ -n "${PUSHOVER_TOKEN:-}" ] && [ -n "${PUSHOVER_USER:-}" ]; then
  curl -s https://api.pushover.net/1/messages.json \
    -d token="$PUSHOVER_TOKEN" -d user="$PUSHOVER_USER" \
    -d title="AFHP Property Alert" -d message="$MESSAGE"
fi

echo "$MESSAGE" >> "/home/user/ai-combined-productivity/AFHP/data/logs/wabo-alerts.txt"
