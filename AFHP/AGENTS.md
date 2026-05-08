# AFHP Agent Conventions

## Property Scoring Rubric (1–10)

### Base score by category
- AFH_WABO_READY      → base 9
- AFH_INSPECTION_READY → base 7
- AFH_POTENTIAL        → base 5
- DOES_NOT_QUALIFY     → 0 (exclude)

### Bonus points (add to base, max total = 10)
+1.0  Active AFH license confirmed
+0.5  Price ≤ $500,000
+0.5  Price $500,001–$550,000
+0.0  Price $550,001–$600,000
+1.0  Rambler (single story, no stairs)
+0.5  Rambler + basement (main floor is rambler)
+0.3  Rambler + bonus room / small upper space
+0.5  4+ bedrooms (vs minimum 3)
+0.3  3+ bathrooms (vs minimum 2)
+0.5  2,500+ sqft
+0.3  Accessible bathroom explicitly mentioned
+0.3  No-step / zero-step entry or ramp
+0.3  Wide doorways (32"+ or "wheelchair accessible" mentioned)
+0.2  Large lot (0.2+ acres mentioned)
+0.2  Near hospital, clinic, or public transit
+0.1  Corner lot (easier ambulance/van access)
+0.5  King or Snohomish county (highest demand)
+0.3  Pierce or Thurston county
+0.1  Posted within last 24 hours

## Property Output Schema
Each property must be a JSON object with ALL these fields:
```json
{
  "id": "unique hash",
  "address": "street address or intersection or city + neighborhood",
  "price": 000000,
  "price_display": "$000,000",
  "beds": 0,
  "baths": 0,
  "sqft": 0000,
  "style": "rambler|rambler-basement|rambler-bonus|two-story|other",
  "county": "King|Snohomish|Pierce|...",
  "city": "...",
  "category": "AFH_WABO_READY|AFH_INSPECTION_READY|AFH_POTENTIAL",
  "score": 0.0,
  "accessibility_signals": ["list", "of", "signals"],
  "license_status": "active|lapsed|none|unknown",
  "days_listed": 0,
  "contact_info": "phone or name or FB profile",
  "source_group": "FB group name",
  "post_url": "URL if available",
  "post_date": "YYYY-MM-DD",
  "post_text_excerpt": "first 200 chars of post",
  "notes": "any relevant detail not captured above",
  "collected_at": "ISO timestamp"
}
```

## Table Row Format
Each property renders to this markdown table row:
| {#} | {city} – {address} | {price_display} | {beds} | {baths} | {sqft} | {style} | {county} | {category} | {score} | {days_listed}d | {contact_info} | {source_group} | {post_date} |

## Style Definitions
- **rambler**: single-story home, all living on one floor, no stairs required
- **rambler-basement**: main floor is single-story + unfinished or finished basement below
- **rambler-bonus**: main floor is single-story + small bonus room / upper loft (1-2 rooms)
- **two-story**: NOT preferred for AFH — only include if main floor has 3+ beds and 2+ baths

## Sub-agent Output Contract
Return valid JSON array only. Empty array [] if no qualifying properties found.
Never truncate JSON mid-object. Validate all required fields present before returning.
