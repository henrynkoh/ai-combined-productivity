/**
 * Generates src/data/resources.ts with exactly 100 curated links.
 * Run: node scripts/generate-resources.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const items = [
  // Claude Code & Anthropic (1–22)
  ["Claude Code — Anthropic documentation hub", "https://docs.anthropic.com/en/docs/claude-code/overview", "claude-code", "Primary install, auth, and usage."],
  ["Claude Code on GitHub", "https://github.com/anthropics/claude-code", "claude-code", "Issues, releases, and discussion."],
  ["Anthropic API documentation", "https://docs.anthropic.com/en/api/getting-started", "claude-code", "API keys, models, and limits."],
  ["Anthropic Console", "https://console.anthropic.com/", "claude-code", "Keys, usage, and workspace settings."],
  ["npm: @anthropic-ai/claude-code", "https://www.npmjs.com/package/@anthropic-ai/claude-code", "claude-code", "Package version and install notes."],
  ["Claude Code: slash commands & workflows", "https://docs.anthropic.com/en/docs/claude-code/tutorials", "claude-code", "Task patterns and tutorials."],
  ["Claude Code: configuration", "https://docs.anthropic.com/en/docs/claude-code/settings", "claude-code", "Settings.json and environment."],
  ["Claude Code: MCP integration", "https://docs.anthropic.com/en/docs/claude-code/mcp", "claude-code", "Connecting tools to the agent."],
  ["Anthropic: Model Context Protocol overview", "https://docs.anthropic.com/en/docs/mcp", "mcp", "What MCP is and why it matters."],
  ["Anthropic: MCP specification (GitHub)", "https://github.com/modelcontextprotocol/specification", "mcp", "Protocol details for implementers."],
  ["Anthropic: MCP servers directory ideas", "https://github.com/modelcontextprotocol/servers", "mcp", "Reference server implementations."],
  ["Claude Code memory & project context", "https://docs.anthropic.com/en/docs/claude-code/memory", "claude-code", "How context persists across sessions."],
  ["Anthropic: Prompt engineering overview", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", "claude-code", "Clear prompts for agent tasks."],
  ["Anthropic: Tool use guide", "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", "claude-code", "Patterns for tool-calling agents."],
  ["Anthropic: System prompts", "https://docs.anthropic.com/en/docs/build-with-claude/system-prompts", "claude-code", "Structuring system-level guidance."],
  ["Anthropic: Claude 4 model card (family)", "https://www.anthropic.com/news", "claude-code", "Check Anthropic News for latest model posts."],
  ["Claude Code troubleshooting", "https://docs.anthropic.com/en/docs/claude-code/troubleshooting", "claude-code", "Common errors and fixes."],
  ["Anthropic: Security & compliance hub", "https://trust.anthropic.com/", "claude-code", "Policies relevant to enterprise use."],
  ["Anthropic Status page", "https://status.anthropic.com/", "claude-code", "Outages and incident history."],
  ["Anthropic: Pricing", "https://www.anthropic.com/pricing", "claude-code", "Plans that affect API usage."],
  ["Anthropic: Claude Help Center", "https://support.anthropic.com/", "claude-code", "Account and product questions."],

  // MCP & tooling (23–35)
  ["MCP TypeScript SDK", "https://github.com/modelcontextprotocol/typescript-sdk", "mcp", "Build custom MCP servers in TypeScript."],
  ["MCP Python SDK", "https://github.com/modelcontextprotocol/python-sdk", "mcp", "Python MCP server patterns."],
  ["Cursor: Model Context Protocol docs", "https://cursor.com/docs/context/mcp", "mcp", "How editors wire MCP (cross-tool mental model)."],
  ["Filesystem MCP server (reference)", "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem", "mcp", "Safe local file access patterns."],
  ["GitHub MCP server (reference)", "https://github.com/modelcontextprotocol/servers", "mcp", "Example remote integrations."],
  ["OWASP LLM Top 10", "https://owasp.org/www-project-top-10-for-large-language-model-applications/", "workflow", "Threat model for agentic coding."],
  ["NIST AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework", "workflow", "Governance checklist for teams."],
  ["Semantic versioning", "https://semver.org/", "workflow", "Version discipline for shipped Next.js apps."],
  ["Conventional Commits", "https://www.conventionalcommits.org/", "workflow", "Readable history when pairing with Obsidian Git."],
  ["Keep a Changelog", "https://keepachangelog.com/", "workflow", "Ship notes your cohort can follow."],
  ["12 Factor App", "https://12factor.net/", "workflow", "Production habits for startup demos."],

  // Obsidian — core (36–55)
  ["Obsidian Help — Getting started", "https://help.obsidian.md/Get+started", "obsidian", "Vaults, panes, and basics."],
  ["Obsidian Help — Linking notes", "https://help.obsidian.md/Linking+notes+and+content", "obsidian", "[[wikilinks]] for your architecture notes."],
  ["Obsidian Help — Graph view", "https://help.obsidian.md/Plugins/Graph+view", "obsidian", "Local graph and filters."],
  ["Obsidian Help — Canvas", "https://help.obsidian.md/Plugins/Canvas", "obsidian", "Visual maps for app structure."],
  ["Obsidian Help — Core plugins list", "https://help.obsidian.md/Core+plugins", "obsidian", "What ships without community plugins."],
  ["Obsidian Help — Community plugins", "https://help.obsidian.md/Extending+Obsidian/Community+plugins", "obsidian", "Safe installation practices."],
  ["Obsidian Help — CSS snippets", "https://help.obsidian.md/Extending+Obsidian/CSS+snippets", "obsidian", "Theme and readability tweaks."],
  ["Obsidian Help — Sync", "https://help.obsidian.md/Obsidian+Sync", "obsidian", "Optional encrypted sync between machines."],
  ["Obsidian Help — Publish", "https://help.obsidian.md/Obsidian+Publish", "obsidian", "Publishing curriculum excerpts."],
  ["Obsidian Forum", "https://forum.obsidian.md/", "obsidian", "Searchable answers from the community."],
  ["Obsidian Discord (community)", "https://obsidian.md/community", "obsidian", "Live help and plugin announcements."],
  ["Obsidian Hub (wiki)", "https://publish.obsidian.md/hub/", "obsidian", "Curated meta-resources."],
  ["BRAT — Beta Reviewers Auto-update Tester", "https://github.com/TfTHacker/obsidian42-brat", "obsidian", "Install pre-release plugins safely."],
  ["Obsidian Git plugin", "https://github.com/denolehov/obsidian-git", "obsidian", "Version control inside the vault."],
  ["Templater", "https://github.com/SilentVoid13/Templater", "obsidian", "Automate Next.js note scaffolds."],
  ["Dataview", "https://github.com/blacksmithgu/obsidian-dataview", "obsidian", "Query notes like a database."],
  ["Metadata Menu", "https://github.com/mdelobelle/metadatamenu", "obsidian", "Structured fields for ADRs and tasks."],
  ["Obsidian Projects", "https://github.com/marcusolsson/obsidian-projects", "obsidian", "Kanban/calendar for build phases."],
  ["DB Folder", "https://github.com/RafaelGB/obsidian-db-folder", "obsidian", "Notion-like tables over folders."],
  ["Excalidraw for Obsidian", "https://github.com/zsviczian/obsidian-excalidraw-plugin", "obsidian", "Diagrams beside your Next.js repo."],
  ["Style Settings", "https://github.com/mgmeyers/obsidian-style-settings", "obsidian", "Control theme variables."],
  ["Iconize", "https://github.com/FlorianWoelki/obsidian-iconize", "obsidian", "Visual cues for file types."],
  ["Advanced URI", "https://github.com/Vinzent03/obsidian-advanced-uri", "obsidian", "Deep links from scripts and docs."],
  ["QuickAdd", "https://github.com/chhoumann/quickadd", "obsidian", "Macros for repetitive capture."],
  ["Omnisearch", "https://github.com/scambier/obsidian-omnisearch", "obsidian", "Fast full-text vault search."],

  // Graphify & knowledge graphs (56–68)
  ["Graphify — GitHub (safishamsi/graphify)", "https://github.com/safishamsi/graphify", "graphify", "Knowledge graph from folders of code and docs."],
  ["Graphify — project site", "https://graphify.net/", "graphify", "Install paths and workflow overview."],
  ["lucasrosati/claude-code-memory-setup", "https://github.com/lucasrosati/claude-code-memory-setup", "graphify", "Obsidian + Graphify + Claude Code stack."],
  ["PyPI: graphifyy (note spelling)", "https://pypi.org/project/graphifyy/", "graphify", "Python package name for Graphify tooling."],
  ["Neo4j Graph Data Science (context)", "https://neo4j.com/docs/graph-data-science/", "graphify", "Graph metrics mental model (centrality, etc.)."],
  ["RDF primer (W3C)", "https://www.w3.org/TR/rdf11-primer/", "graphify", "When you need strict graph semantics."],
  ["JSON-LD", "https://json-ld.org/", "graphify", "Structured metadata for toolchains."],
  ["Linked Data Patterns", "https://patterns.dataincubator.org/", "graphify", "Book-style patterns for graphs."],
  ["Obsidian Bases (when available in your build)", "https://help.obsidian.md/Obsidian+Bases", "obsidian", "Native database-like views."],
  ["Foam for VS Code (alternative graph notes)", "https://foambubble.github.io/foam/", "workflow", "If a teammate prefers VS Code."],
  ["Zettelkasten method primer", "https://zettelkasten.de/posts/overview/", "workflow", "Discipline for atomic technical notes."],
  ["Building a Second Brain (Tiago Forte)", "https://www.buildingasecondbrain.com/", "workflow", "Capture → organize → distill → express."],
  ["PARA method overview", "https://fortelabs.com/blog/para/", "workflow", "Projects/Areas/Resources/Archive for founders."],

  // Next.js & React (69–90)
  ["Next.js documentation", "https://nextjs.org/docs", "nextjs", "App Router, caching, and deployment."],
  ["Next.js Learn course", "https://nextjs.org/learn", "nextjs", "Hands-on foundations."],
  ["React documentation", "https://react.dev/", "nextjs", "Server Components mental model."],
  ["Vercel: Next.js on Vercel", "https://vercel.com/docs/frameworks/nextjs", "nextjs", "Production deployment defaults."],
  ["Next.js: Routing fundamentals", "https://nextjs.org/docs/app/building-your-application/routing", "nextjs", "Layouts, templates, and URLs."],
  ["Next.js: Data fetching & caching", "https://nextjs.org/docs/app/building-your-application/data-fetching", "nextjs", "fetch, revalidate, tags."],
  ["Next.js: Server Actions", "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations", "nextjs", "Mutations from forms."],
  ["Next.js: Middleware", "https://nextjs.org/docs/app/building-your-application/routing/middleware", "nextjs", "Auth and redirects."],
  ["Next.js: Environment variables", "https://nextjs.org/docs/app/building-your-application/configuring/environment-variables", "nextjs", "Secrets handling."],
  ["Next.js: Metadata & OG images", "https://nextjs.org/docs/app/building-your-application/optimizing/metadata", "nextjs", "SEO for startup landing pages."],
  ["Next.js: Image optimization", "https://nextjs.org/docs/app/building-your-application/optimizing/images", "nextjs", "Performance checklist."],
  ["Next.js: Font optimization", "https://nextjs.org/docs/app/building-your-application/optimizing/fonts", "nextjs", "Readable UI for demos."],
  ["Tailwind CSS docs", "https://tailwindcss.com/docs", "nextjs", "Utility styling used in this app."],
  ["TypeScript handbook", "https://www.typescriptlang.org/docs/", "nextjs", "Shared types across routes."],
  ["ESLint (Next core-web-vitals)", "https://nextjs.org/docs/app/api-reference/config/eslint", "nextjs", "CI-ready lint rules."],
  ["Web.dev: Core Web Vitals", "https://web.dev/vitals/", "nextjs", "What investors feel as “snappy”."],
  ["MDN: HTTP caching", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching", "nextjs", "Reason about CDN behavior."],
  ["OWASP ASVS (overview)", "https://owasp.org/www-project-application-security-verification-standard/", "nextjs", "Security acceptance criteria."],
  ["pnpm workspaces (monorepo context)", "https://pnpm.io/workspaces", "nextjs", "If you split packages later."],
  ["Turborepo docs", "https://turbo.build/repo/docs", "nextjs", "Scaling builds in multi-app startups."],
  ["Playwright testing", "https://playwright.dev/", "nextjs", "E2E for critical flows."],

  // Seattle & founder context (91–100)
  ["Seattle Startup Week (community anchor)", "https://www.seattlestartupweek.com/", "workflow", "Local events and founder network."],
  ["Washington Technology Industry Association", "https://www.washingtontechnology.org/", "workflow", "PNW tech policy and programs."],
  ["Greater Seattle Partners", "https://greater-seattle.com/", "workflow", "Regional economic context."],
  ["University of Washington CoMotion", "https://comotion.uw.edu/", "workflow", "Startup resources and licensing context."],
  ["GeekWire (Seattle tech news)", "https://www.geekwire.com/", "workflow", "Local ecosystem signal."],
  ["Y Combinator Startup Library", "https://www.ycombinator.com/library", "workflow", "Execution discipline for cohorts."],
  ["Andrej Karpathy — LLM Wiki (llm-wiki.md gist)", "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f#file-llm-wiki-md", "obsidian", "Primary spec: Raw/Wiki/Schema and Ingest/Query/Lint."],
  ["Video: LLM Wiki Obsidian walkthrough (Korean)", "https://www.youtube.com/watch?v=S6w4g2OQlVQ", "obsidian", "Practical vault setup, Terminal plugin, scaffolding, skills, and Query/Lint flow."],
  ["Seattle Chamber — business climate", "https://www.seattlechamber.com/", "workflow", "Local operating context."],
];

if (items.length !== 100) {
  console.error(`Expected 100 items, got ${items.length}`);
  process.exit(1);
}

const out = `import type { Resource } from "@/types/curriculum";

export const RESOURCE_COUNT = ${items.length} as const;

export const resources: Resource[] = [
${items
  .map(([title, url, category, note], i) => {
    const safeTitle = String(title).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const safeUrl = String(url).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const safeNote = String(note).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `  {\n    id: ${i + 1},\n    title: "${safeTitle}",\n    url: "${safeUrl}",\n    category: "${category}",\n    note: "${safeNote}",\n  },`;
  })
  .join("\n")}
];
`;

const target = path.join(__dirname, "..", "src", "data", "resources.ts");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, out, "utf8");
console.log("Wrote", target);
