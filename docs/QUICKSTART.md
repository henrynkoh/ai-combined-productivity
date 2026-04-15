# Quickstart

Get the cohort site running in **under five minutes**. (This file is the project **quickstarter**—same content as “Quickstart” in the root [README](../README.md).)

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** (comes with Node) or pnpm/yarn
- For the full **LLM Wiki** lab (not required to preview the site): [Obsidian](https://obsidian.md/), [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview), and optionally **Graphify** on Saturday—see [week.ts](../src/data/week.ts) Day 6

## 1. Install and run

```bash
cd seattle-agentic-curriculum
npm install
npm run dev
```

Open **http://localhost:3000**.

## 2. Orient yourself in the app

| URL | What to do |
| --- | --- |
| `/` | Cohort landing (week-at-a-glance) |
| `/llm-wiki` | **Reference:** Raw / Wiki / Schema and Ingest / Query / Lint + links to Karpathy’s gist and the walkthrough video |
| `/week` | Full seven-day plan |
| `/week/mon` | Day 1 — concepts, Obsidian vault, Terminal plugin |
| `/resources` | Search and filter the **100-link** library (includes Karpathy gist + video) |
| `/obsidian-stack` | Tiered Obsidian plugin rollout (Friday lab) |

## 3. Align your repo with the LLM Wiki loop

1. Open the [Karpathy `llm-wiki.md` gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f#file-llm-wiki-md) and skim structures + commands.
2. Create or open an **Obsidian vault** for your domain (one topic per vault keeps Query quality high).
3. Keep **`CLAUDE.md`** and **`AGENTS.md`** at this repo’s root when you use Claude Code on the Next.js app.
4. Optional: open the **repo root** as a second vault or keep `Notes/` inside the repo—your team’s choice.

## 4. Optional: GitHub URL for the site UI

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GITHUB_REPO_URL` so any in-app GitHub controls match your fork.

## 5. Production build (optional)

```bash
npm run build
npm start
```

If the build fails with a missing `.next` manifest, run `rm -rf .next && npm run build` once.

## 6. Regenerate the resource list (only if you edit the generator)

```bash
node scripts/generate-resources.mjs
```

Keep exactly **100** entries in `scripts/generate-resources.mjs` unless you update `RESOURCE_COUNT` in code.

## Next

- First-hour walkthrough: [TUTORIAL.md](./TUTORIAL.md)
- Operators & maintainers: [MANUAL.md](./MANUAL.md)
- Promotional copy: [marketing/](./marketing/)
