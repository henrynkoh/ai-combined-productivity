# AFH Agent Conventions

## Sub-agent Spawning Pattern
Each session spawns exactly 20 sub-agents. Use run_in_background=true for all.
Collect results via a coordinator that waits for all 20 before proceeding.

## Category Taxonomy (use exactly these tags)
- SEEKING_PROVIDER   : family/caseworker/DSHS seeking placement for client
- PROVIDER_WANTED    : operator seeking caregivers or co-operators
- BECOME_PROVIDER    : individual wanting to start AFH business
- PROPERTY_LICENSED  : property already has AFH license (active or lapsed)
- PROPERTY_WABO      : property with WABO-certified operator attached
- PROPERTY_POTENTIAL : single-family home 2500+ sqft, accessible, zoned R1/R2
- AFH_FOR_SALE       : entire AFH business for sale (license + residents + staff)
- AFH_FOR_LEASE      : AFH space available for licensed operator to lease
- EQUIPMENT_SUPPLY   : AFH-related equipment, furniture, supplies
- TRAINING_CERT      : AFH training, WABO prep, caregiver certification classes
- OTHER              : does not fit above categories

## Scoring Rubric (1–10)
- 10: AFH_FOR_SALE with active license + residents in King/Snohomish county
- 9:  PROPERTY_LICENSED for sale under $1.2M or SEEKING_PROVIDER high-acuity client
- 8:  AFH_FOR_LEASE or PROPERTY_WABO available
- 7:  PROPERTY_POTENTIAL 3000+ sqft, accessible features mentioned
- 6:  BECOME_PROVIDER with capital/timeline specified
- 5:  SEEKING_PROVIDER standard placement request
- 4:  PROVIDER_WANTED with competitive pay
- 3:  PROPERTY_POTENTIAL standard residential listing
- 2:  TRAINING_CERT events
- 1:  EQUIPMENT_SUPPLY, duplicates, noise

## Output Contract
Each sub-agent must return a valid JSON array. Empty array [] if nothing found.
Never return partial JSON. Never truncate.
