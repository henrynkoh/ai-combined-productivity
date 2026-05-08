# AFHP — AFH Property Scout

## Mission
Search Facebook AFH communities and related real estate groups 24/7/365 to find
properties meeting Washington State Adult Family Home physical requirements.
Produce a comprehensive, ranked property table every 60 minutes.

## AFH Physical Requirements (hard filters — ALL must pass)
| Criteria        | Minimum          | Notes |
|-----------------|------------------|-------|
| Bedrooms        | 3+               | Each bedroom must have egress window |
| Bathrooms       | 2+               | At least 1 must be accessible or adaptable |
| Square footage  | 2,000+ sqft      | Living area only, not lot |
| Style           | Rambler preferred | Rambler / rambler+basement / rambler+bonus room |
| Price           | Under $600,000   | Listed or estimated asking price |
| State           | Washington (WA)  | All counties considered |

## Property Categories (assign exactly one)

### AFH_WABO_READY
Property has at least one of:
- Active or recently lapsed AFH DSHS license
- WABO-certified operator attached
- Previously operated as licensed AFH
- Seller explicitly markets as "AFH ready" or "licensed care home"

### AFH_INSPECTION_READY
Meets hard filters PLUS has documented accessibility signals:
- Wide doorways (32"+ clear width mentioned)
- No-step / zero-step entry OR ramp
- Accessible bathroom: roll-in shower, walk-in shower, or grab bars mentioned
- Open floor plan / wide hallways
- Sprinkler system or fire suppression
Does NOT have an active license but would likely pass DSHS inspection.

### AFH_POTENTIAL
Meets all hard filters but lacks accessibility documentation.
Could be converted to AFH with moderate renovation.
Ramblers, single-story homes, homes with in-law suites.

### DOES_NOT_QUALIFY
Fails one or more hard filters. Do not include in table.

## Output — Hourly Property Table
Every 60 minutes write a full markdown table to:
  data/reports/hourly/YYYY-MM-DD-HH.md

Table columns (in order):
#, Address/Location, Price, Bed, Bath, Sqft, Style, County, Category, Score, Days Listed, Contact, Source Group, Posted Date

## Session Architecture (10 Sessions × 20 Sub-agents = 200 Total)
| Session | Role                        | Sub-agents |
|---------|-----------------------------|-----------|
| S01     | FB Group Scanner Alpha      | 20        |
| S02     | FB Group Scanner Beta       | 20        |
| S03     | FB Marketplace Scanner      | 20        |
| S04     | Keyword Deep Scanner        | 20        |
| S05     | Hard-Filter Validator       | 20        |
| S06     | AFH Category Classifier     | 20        |
| S07     | Accessibility Signal Scorer | 20        |
| S08     | Price & Location Verifier   | 20        |
| S09     | Dedup + Table Compiler      | 20        |
| S10     | Hourly Report Publisher     | 20        |

## Data Flow
FB Groups + Marketplace → S01-S04 (raw) → data/raw/
→ S05-S08 (validate + classify) → data/properties/
→ S09 (dedup + compile) → data/processed/
→ S10 (publish table) → data/reports/hourly/ + data/reports/daily/

## Agent Rules
- READ ONLY — never post, comment, react, or message anyone on Facebook
- Only include WA state properties
- Skip commercial properties, apartment complexes, condos
- Single-family homes only (detached preferred, some attached OK)
- If price not listed: mark as "Price N/A" — still include if other criteria met
- Always flag two-story homes with 0 main-floor bedrooms as DOES_NOT_QUALIFY
