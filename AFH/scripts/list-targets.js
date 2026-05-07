#!/usr/bin/env node
const targets = require("../config/targets.json");
const groups = Object.values(targets.facebook_groups).flat();
const keywords = Object.values(targets.search_keywords).flat();
console.log(`Groups targeted : ${groups.length}`);
console.log(`Search keywords : ${keywords.length}`);
console.log("Top groups by priority:");
groups.sort((a, b) => b.priority - a.priority).slice(0, 5)
  .forEach(g => console.log(`  [P${g.priority}] ${g.name} (${g.county})`));
