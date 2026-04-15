# Quickstart

Get the curriculum site running in **under five minutes**.

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** (comes with Node) or pnpm/yarn
- Optional for the full workflow: **Obsidian**, **Claude Code** (`npm i -g @anthropic-ai/claude-code`), **Graphify** (see [Graphify](https://github.com/safishamsi/graphify))

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
| `/` | Read the cohort overview and week-at-a-glance |
| `/week` | Open the full seven-day plan |
| `/week/mon` | Start Day 1 steps |
| `/resources` | Search and filter the 100-link library |
| `/obsidian-stack` | Read the Obsidian plugin rollout strategy |

## 3. Align your repo with the workflow

1. Open the **repository root** as an Obsidian vault (or keep notes in a `Notes/` folder inside the repo).
2. Copy ideas from `obsidian/community-plugins.json` only **after** backing up `.obsidian`.
3. Keep **`CLAUDE.md`** and **`AGENTS.md`** at the repo root so Claude Code picks them up.

## 4. Production build (optional)

```bash
npm run build
npm start
```

## 5. Regenerate the resource list (only if you edit the generator)

```bash
node scripts/generate-resources.mjs
```

## Next

- Full operations: [MANUAL.md](./MANUAL.md)
- First-time walkthrough: [TUTORIAL.md](./TUTORIAL.md)
