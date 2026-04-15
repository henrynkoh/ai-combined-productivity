import type { CurriculumDay } from "@/types/curriculum";

/** One-week lab aligned with Andrej Karpathy’s LLM Wiki (Raw → Wiki → Query; Ingest / Query / Lint) and the Obsidian walkthrough: https://www.youtube.com/watch?v=S6w4g2OQlVQ */
export const week: CurriculumDay[] = [
  {
    slug: "mon",
    label: "Day 1 · Monday",
    title: "LLM Wiki ideas: gardener, vault, Terminal",
    summary:
      "Ground the cohort in Karpathy’s problem (agent context evaporates), the gardener metaphor, and the three structures (Raw, Wiki, Schema) plus three commands (Ingest, Query, Lint). Install Obsidian, create a dedicated vault, add the Terminal community plugin, and lay out editor + terminal panes like the reference video.",
    outcomes: [
      "Everyone can explain why Query should read curated Wiki notes—not noisy Raw dumps—and why Lint is a recurring habit.",
      "Obsidian opens a vault folder; Terminal plugin is enabled and shows the same shell profile you use in Cursor.",
      "Cohort charter note defines one primary domain for the week (e.g. product narrative, GTM, or core tech) to keep Wiki context clean.",
    ],
    steps: [
      {
        title: "Watch the intro and read the primary source",
        detail:
          "Skim the video chapters through the structure/command definitions, then open Karpathy’s llm-wiki.md gist. You are implementing that document—not a black-box app.",
        command:
          "Open https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f#file-llm-wiki-md — keep it beside Obsidian all week.",
      },
      {
        title: "Install Obsidian and create a new vault",
        detail:
          "Create a vault for LLM Wiki work (name it after your startup + domain, e.g. acme-gtm-wiki). Prefer one domain per vault so Query stays focused—the video stresses splitting unrelated topics across vaults.",
      },
      {
        title: "Enable Community plugins and install Terminal",
        detail:
          "Settings → Community plugins → browse “Terminal”, install and enable. Dock the terminal (e.g. right pane) and keep the file tree + note on the left, matching the workflow in the video.",
      },
      {
        title: "Clone or open this Next.js repo in parallel",
        detail:
          "Shipped UI for the cohort lives here; product notes can live under a Notes/ or vault path you choose. Run npm install && npm run dev and confirm localhost:3000.",
        command: "npm install && npm run dev",
      },
      {
        title: "Install Claude Code (or stay in Cursor for the same agent loop)",
        detail:
          "The video uses Codex inside the vault; this cohort standardizes on Claude Code or Cursor with the vault root open. Complete authentication before Tuesday’s scaffolding block.",
        command: "npm install -g @anthropic-ai/claude-code && claude auth login",
      },
    ],
    checklist: [
      "Karpathy gist URL bookmarked; everyone has watched through the Ingest/Query/Lint explanations.",
      "Vault path is writable; .gitignore strategy agreed if the vault overlaps the repo.",
      "Cohort charter captured in markdown with Friday demo criteria.",
    ],
  },
  {
    slug: "tue",
    label: "Day 2 · Tuesday",
    title: "Scaffold Raw, Wiki, and Schema from the gist",
    summary:
      "Use your agent to turn Karpathy’s llm-wiki.md into concrete folders and operator docs inside the vault—mirroring the video’s ‘empty vault → ask the agent to set up LLM Wiki’ segment. Align CLAUDE.md / AGENTS.md in this repo so code and wiki share one mental model.",
    outcomes: [
      "Raw/, Wiki/, and Schema/ (or equivalent) exist with short README stubs explaining what belongs where.",
      "Schema holds agent rules: how links resolve, duplicate handling, and when to move material from Raw to Wiki.",
      "A first commit or export captures the scaffold so the team can diff future gardening.",
    ],
    steps: [
      {
        title: "Prompt from the gist, not from memory",
        detail:
          "In the vault terminal or Cursor, ask: ‘I want to run Karpathy’s LLM Wiki from this gist—what folder layout and agent markdown do I need?’ Accept the agent’s plan only after you cross-check against the gist sections.",
      },
      {
        title: "Create the three-layer layout",
        detail:
          "Raw = unfiltered captures (clips, transcripts, bullet dumps). Wiki = consolidated, linked articles the agent maintains. Schema = policies and prompts the agent must follow. Name files in markdown; keep attachments in a dedicated folder if you use images/PDFs.",
      },
      {
        title: "Mirror conventions in the Next.js repo",
        detail:
          "Update CLAUDE.md and AGENTS.md in this project with UI and routing rules so coding sessions and wiki sessions do not contradict each other.",
      },
      {
        title: "Peer review the scaffold",
        detail:
          "Pair-review: can a new founder read Schema and know how Ingest changes Wiki without erasing history?",
      },
    ],
    checklist: [
      "No secrets in vault or repo notes; use placeholders for API keys.",
      "Wikilinks or paths connect at least one Wiki page to a Next.js route or component you own.",
      "Main branch stays green after any scaffold commit to the app repo.",
    ],
  },
  {
    slug: "wed",
    label: "Day 3 · Wednesday",
    title: "Skill-ify Ingest, Query, and Lint",
    summary:
      "Follow the video’s pattern: turn the three commands into reusable skills (Cursor skills or Claude Code patterns) so the agent does not skip AGENT.md or hallucinate command names. Keep skills vault-local or repo-local so they do not pollute global configs.",
    outcomes: [
      "Three repeatable prompts or skill files exist named clearly for Ingest, Query, and Lint.",
      "AGENT.md (or CLAUDE.md) stays short; detailed steps live in skills.",
      "Team agrees on when to run Lint (e.g. after every Ingest, end of day, or before demos).",
    ],
    steps: [
      {
        title: "Draft the three skills",
        detail:
          "Ingest: ‘Read Raw, propose merges/splits, write Wiki pages with sources.’ Query: ‘Answer only from Wiki; cite paths.’ Lint: ‘Find orphans, duplicates, stale claims, and suggest fixes.’ Align wording with your Schema rules.",
      },
      {
        title: "Register skills locally",
        detail:
          "Per the video, prefer local registration so only this vault/repo loads them. Document the path in Notes/Runbook-Skills.md.",
      },
      {
        title: "Dry run with a tiny Raw sample",
        detail:
          "Add two conflicting bullet lists to Raw, run Ingest once, then Lint. Verify Wiki shows consolidation and Raw is still archived or clearly subordinate per your policy.",
      },
    ],
    checklist: [
      "New teammate could run Ingest → Query → Lint with copy-paste from the runbook.",
      "Skill prompts are under version control or backed up.",
      "Lint frequency is on the calendar (not ‘when we remember’).",
    ],
  },
  {
    slug: "thu",
    label: "Day 4 · Thursday",
    title: "Fill Raw with real startup signal, then Ingest",
    summary:
      "Collect authentic fragments: customer quotes, metrics screenshots, competitor notes, architecture snippets. Store markdown in Raw; put binaries in a static attachments folder. Run Ingest and classify results into entities, concepts, and sources as in the video’s car-industry example—adapted to your startup’s domain.",
    outcomes: [
      "At least five Raw items exist with dates and sources.",
      "One Ingest pass produces Wiki pages with explicit links back to Raw sources.",
      "Team discusses one ‘bad’ fragment the agent flagged—duplicate or low value.",
    ],
    steps: [
      {
        title: "Define your capture templates",
        detail:
          "Use a simple template: title, date, source URL, verbatim excerpt, your takeaway. Paste into Raw as separate files or one daily log—pick one style for the cohort.",
      },
      {
        title: "Run Ingest as a facilitated session",
        detail:
          "Screen-share the agent: watch it propose merges. Founders intervene when domain judgment matters—the video emphasizes human knowledge over tooling.",
      },
      {
        title: "Tag for Graph view later",
        detail:
          "Add consistent YAML or inline tags (#customer, #metric) so Friday’s graph filtering is meaningful.",
      },
    ],
    checklist: [
      "PII and customer identifiers redacted in examples used in shared sessions.",
      "Attachments folder excluded from git if it contains large binaries.",
      "Wiki pages have at least one outbound link to related Wiki or Raw notes.",
    ],
  },
  {
    slug: "fri",
    label: "Day 5 · Friday",
    title: "Graph view, Query-only answers, Lint cadence",
    summary:
      "Use Obsidian Graph to sanity-check structure (orphans vs clusters). Run Query tasks that only draw on Wiki text. Finish with Lint and assign gardening owners—matching the video’s progression from structure review to interactive query to maintenance.",
    outcomes: [
      "Graph view used intentionally: spot unrelated clusters that should split into another vault later.",
      "Query exercises return cited Wiki paths; team verifies one answer against primary sources.",
      "Lint backlog is either empty or ticketed with owners.",
    ],
    steps: [
      {
        title: "Graph walkthrough (15 minutes)",
        detail:
          "Filter by tag or path. Discuss one surprising edge: should it merge, link, or stay isolated?",
      },
      {
        title: "Query drill",
        detail:
          "Ask the agent domain questions you already know the answer to; confirm it stays inside Wiki. Example: ‘List our positioning claims with file paths.’",
      },
      {
        title: "Lint and assign",
        detail:
          "Run Lint; capture follow-ups in your issue tracker or a Dataview task list. Schedule next Lint before the demo.",
      },
      {
        title: "Obsidian plugin hygiene",
        detail:
          "Adopt the profile in obsidian/plugin-manifest-profile.json selectively—enable Graph essentials first; defer heavy plugins to avoid the laptop melt problem.",
      },
    ],
    checklist: [
      "Everyone has run Query and Lint at least once hands-on.",
      "Decision recorded if a second vault is needed for a different domain.",
      "Demo narrative outline links Wiki pages you will show on screen.",
    ],
  },
  {
    slug: "sat",
    label: "Day 6 · Saturday (optional lab)",
    title: "Optional: code graph + product graph",
    summary:
      "Bridge LLM Wiki to engineering reality: run Graphify (or your stack’s equivalent) on this Next.js repo, import a short summary note into the vault, and compare code hot spots with product Wiki clusters. Optional MCP setup for Claude Code stays scoped and documented.",
    outcomes: [
      "One artifact ties a risky module in code to a Wiki decision or ADR.",
      "If MCP is enabled, Runbook-MCP.md lists purpose, paths, and token handling.",
    ],
    steps: [
      {
        title: "Run Graphify on the app repo",
        detail:
          "Follow Resources → Graphify links. Store outputs under docs/graph/ or .graphify/ as agreed; link from a vault note tagged #graphify.",
        command: "graphify .  # use upstream README for exact CLI flags",
      },
      {
        title: "Compare graphs",
        detail:
          "Does the product Wiki cluster match where code complexity lives? If not, schedule an ADR.",
      },
      {
        title: "Optional: one MCP integration",
        detail:
          "Filesystem or GitHub only; least privilege. Skip if Friday’s demo is tomorrow.",
      },
    ],
    checklist: [
      "No secrets in MCP JSON committed to Git.",
      "CI or manual lint runs on the Next.js repo if you changed code.",
    ],
  },
  {
    slug: "sun",
    label: "Day 7 · Sunday (optional)",
    title: "Ship a small product change from Wiki truth",
    summary:
      "Echo the video’s ‘apply to a real surface’ ending: use Query output to improve copy, onboarding, or a UX flow in this Next.js app, then rehearse the five-minute story for mentors or investors.",
    outcomes: [
      "At least one user-visible string or flow in the app reflects Wiki-sourced wording or structure.",
      "Demo tells a story: problem → Raw chaos → Ingest → Query insight → shipped change.",
      "Retrospective captures what each startup will keep: skills, Lint schedule, or vault split.",
    ],
    steps: [
      {
        title: "Query-driven copy or UX tweak",
        detail:
          "Example: rewrite the homepage hero or a checklist page using consolidated Wiki language; cite the Wiki path in the PR description.",
      },
      {
        title: "Rehearse the demo",
        detail:
          "Two minutes vault, two minutes app, one minute learnings. Record for absent cofounders.",
      },
      {
        title: "Fork the curriculum",
        detail:
          "Copy src/data/week.ts ideas into your own repo; adjust domains and day names for your next sprint.",
      },
    ],
    checklist: [
      "PR merged or ready with Wiki reference in description.",
      "Support channel and Lint owner agreed for post-cohort.",
      "Thank-you sent to hosts and peer founders.",
    ],
  },
];

export function getDay(slug: string) {
  return week.find((d) => d.slug === slug);
}
