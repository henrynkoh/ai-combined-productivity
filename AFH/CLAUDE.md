# AFH Intel System — Claude.md

## Mission
Continuously monitor Facebook AFH communities to surface:
1. Ads from people **seeking current providers** (families/caseworkers looking for placement)
2. Ads from **providers-to-be** (people wanting to enter AFH business)
3. **Properties for sale** with AFH license, WABO certification, or AFH conversion potential
4. **Business opportunities** (licensed AFH operations for sale or lease)

## Scope: Washington State AFH Context
- AFH = Adult Family Home (licensed residential care, max 6 residents, DSHS-regulated)
- WABO = Washington Adult Family Home Board Operator license
- DSHS = Dept of Social and Health Services (licensing authority)
- Target counties: King, Snohomish, Pierce, Thurston, Clark, Kitsap, Spokane

## Session Architecture (10 Sessions × 20 Sub-agents = 200 Total)

| Session | Role | Sub-agents | Focus |
|---------|------|-----------|-------|
| S01 | Group Watcher Alpha | 20 | King/Snohomish county FB groups |
| S02 | Group Watcher Beta | 20 | Pierce/Thurston/Clark county FB groups |
| S03 | Keyword Scanner A | 20 | "AFH provider", "adult family home" terms |
| S04 | Keyword Scanner B | 20 | "WABO", "DSHS license", "AFH for sale" terms |
| S05 | Ad Classifier | 20 | Tag all found content by category |
| S06 | Property Analyzer | 20 | Evaluate AFH suitability of listed properties |
| S07 | Provider Opportunity Tracker | 20 | Track provider-seeking / provider-offering posts |
| S08 | Lead Scorer | 20 | Score and prioritize all leads 1-10 |
| S09 | Dedup + Aggregator | 20 | Merge, deduplicate, cross-reference |
| S10 | Report Generator | 20 | Daily digest + alerts for high-score leads |

## Data Flow
Facebook Groups → Sessions 1-4 (scrape) → data/raw/
→ Sessions 5-8 (process) → data/processed/
→ Session 9 (aggregate) → data/leads/
→ Session 10 (report) → data/reports/

## Output Format Per Lead
Each lead saved as JSON with: source_group, post_date, poster_name, post_text,
category, county, score (1-10), action_recommended, contact_info, url

## Agent Rules
- Never post, comment, or interact with Facebook posts — read only
- Save everything to data/ before analysis
- Deduplicate by poster + content hash
- Flag score >= 7 immediately via report
- Run scripts/notify.sh for any score 9-10 lead
