#!/usr/bin/env bash
# notify.sh — alert channel for critical AFH leads (score 9-10)
# Called automatically by generate-report.js
# Extend with your preferred channel: email, SMS, Slack, Pushover, etc.

MESSAGE="${1:-AFH critical lead alert}"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LOG="/home/user/ai-combined-productivity/AFH/data/logs/alerts.log"

echo "[$TIMESTAMP] ALERT: $MESSAGE" | tee -a "$LOG"

# --- Option 1: macOS notification (if on Mac) ---
# osascript -e "display notification \"$MESSAGE\" with title \"AFH Intel\""

# --- Option 2: Slack webhook (set SLACK_WEBHOOK_URL in environment) ---
if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
  curl -s -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-type: application/json' \
    --data "{\"text\":\"🏠 *AFH Alert* [$TIMESTAMP]: $MESSAGE\"}" \
    && echo "Slack notification sent."
fi

# --- Option 3: Pushover mobile push (set PUSHOVER_TOKEN and PUSHOVER_USER) ---
if [ -n "${PUSHOVER_TOKEN:-}" ] && [ -n "${PUSHOVER_USER:-}" ]; then
  curl -s https://api.pushover.net/1/messages.json \
    -d token="$PUSHOVER_TOKEN" \
    -d user="$PUSHOVER_USER" \
    -d title="AFH Critical Lead" \
    -d message="$MESSAGE" \
    && echo "Pushover notification sent."
fi

# --- Option 4: Write to a watched file (for any external listener) ---
echo "$MESSAGE" >> "/home/user/ai-combined-productivity/AFH/data/logs/critical-alerts.txt"

echo "Notification complete."
