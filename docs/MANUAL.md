# Manual — Seattle Agentic Next.js Lab

Operator and developer reference for the curriculum repository and web application.

## 1. Purpose

This project serves **two** roles:

1. **Product:** A Next.js site that publishes the week-long curriculum, resource library, and Obsidian strategy pages.
2. **Workshop kit:** Files at the repo root (`CLAUDE.md`, `AGENTS.md`, `obsidian/`) support teams that use **Obsidian**, **Graphify**, and **Claude Code** alongside the app.

## 2. Audience

| Role | Primary use |
| --- | --- |
| **Facilitator** | Runs sessions using `/week`; assigns days and checklists |
| **Engineer** | Implements features; keeps agent context accurate |
| **Founder / PM** | Reads outcomes and aligns scope with `Notes/` in Obsidian |

## 3. Repository layout

| Path | Description |
| --- | --- |
| `src/app/` | App Router pages: `/`, `/week`, `/resources`, `/obsidian-stack` |
| `src/data/week.ts` | Curriculum: days, steps, outcomes, checklists |
| `src/data/resources.ts` | 100 curated links (generated) |
| `scripts/generate-resources.mjs` | Source array; run to regenerate `resources.ts` |
| `obsidian/` | Plugin profile template and `community-plugins.json` scaffold |
| `CLAUDE.md` | Project rules for Claude Code |
| `AGENTS.md` | Next.js–specific agent rules |

## 4. Commands

| Command | Use |
| --- | --- |
| `npm run dev` | Local development (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `node scripts/generate-resources.mjs` | Regenerate `src/data/resources.ts` |

## 5. Content maintenance

### 5.1 Changing the schedule

Edit **`src/data/week.ts`**. Types live in **`src/types/curriculum.ts`**. After edits, run `npm run build` to verify.

### 5.2 Changing the 100 resources

1. Edit **`scripts/generate-resources.mjs`** (the `items` array).
2. Keep exactly **100** entries or update `RESOURCE_COUNT` usage in the app.
3. Run `node scripts/generate-resources.mjs`.
4. Commit both the script and `src/data/resources.ts`.

### 5.3 Styling and navigation

- Global layout: `src/app/layout.tsx`
- Header links: `src/components/SiteHeader.tsx`
- Tailwind: `src/app/globals.css` and inline classes

## 6. Obsidian and plugins

- Do **not** commit a full `.obsidian/` unless your team explicitly wants shared editor settings.
- Use **`obsidian/README.md`** for backup and rollout order.
- Prefer **enabling plugins in waves** (Git → Templater → Dataview → visuals) to avoid performance issues.

## 7. Security and privacy

- Never commit API keys, `.env`, or customer data.
- For MCP servers, document scopes in a note under `Notes/` and keep tokens out of Git.
- Review Claude Code and Graphify outputs before merging to `main`.

## 8. Deployment (optional)

Standard Next.js deployment (e.g. Vercel): set **Root** to this project directory, **Build** `npm run build`, **Output** Next default. No special env vars are required for the static curriculum content.

## 9. Daily cohort rhythm (suggested)

| Block | Activity |
| --- | --- |
| **Open** | 10 min — previous day retro, today’s outcomes |
| **Teach** | 20 min — one concept (vault, graph, MCP, plugins) |
| **Build** | 60–90 min — pairs implement with PRs |
| **Close** | 15 min — checklist review, update Obsidian |

## 10. Support references

- [QUICKSTART.md](./QUICKSTART.md)
- [TUTORIAL.md](./TUTORIAL.md)
- [README.md](../README.md) (project root)
