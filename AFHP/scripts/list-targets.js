#!/usr/bin/env node
const t = require("../config/targets.json");
const groups = Object.values(t.facebook_groups).flat();
console.log(`FB Groups targeted   : ${groups.length}`);
console.log(`Marketplace searches : ${t.marketplace_searches.length}`);
console.log(`Keyword searches     : ${t.keyword_searches.length}`);
console.log(`Hard requirements    : ${t.afh_hard_requirements.min_beds}+ bed, ${t.afh_hard_requirements.min_baths}+ bath, ${t.afh_hard_requirements.min_sqft.toLocaleString()}+ sqft, under $${t.afh_hard_requirements.max_price.toLocaleString()}`);
console.log("Top groups:");
groups.sort((a,b)=>b.priority-a.priority).slice(0,5)
  .forEach(g=>console.log(`  [P${g.priority}] ${g.name} (${g.county})`));
