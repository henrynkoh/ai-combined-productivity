# Manual — Seattle LLM Wiki lab (Next.js)

Operator and developer reference for the curriculum repository and web application.

## 1. Purpose

This project serves **two** roles:

1. **Product:** A Next.js site that publishes the **seven-day LLM Wiki** curriculum (Karpathy model), **`/llm-wiki`** reference, **100-link** resource library, and Obsidian plugin strategy.
2. **Workshop kit:** Root files **`CLAUDE.md`**, **`AGENTS.md`**, and **`obsidian/`** support teams using **Obsidian vaults**, **Claude Code**, optional **Graphify** (weekend), and optional **MCP** (weekend)—aligned with **`src/data/week.ts`**.

**Conceptual anchor:** [Andrej Karpathy’s LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f#file-llm-wiki-md) — **Raw / Wiki / Schema** and **Ingest / Query / Lint**. [Video walkthrough](https://www.youtube.com/watch?v=S6w4g2OQlVQ) (Obsidian setup, Terminal plugin, skills).

## 2. Audience

| Role | Primary use |
| --- | --- |
| **Facilitator** | Runs sessions using `/week`; assigns days, Ingest/Query/Lint cadence, and checklists |
| **Engineer** | Ships Next.js changes; keeps agent context accurate |
| **Founder / PM** | Owns domain scope for each vault; reviews Wiki quality before demos |

## 3. Repository layout

| Path | Description |
| --- | --- |
| `src/app/` | App Router: `/`, `/llm-wiki`, `/week`, `/week/[slug]`, `/resources`, `/obsidian-stack` |
| `src/components/home/HomeLanding.tsx` | Landing page (sections, optional GitHub FAB via env) |
| `src/data/week.ts` | Curriculum: days, steps, outcomes, checklists (**LLM Wiki** arc) |
| `src/data/resources.ts` | 100 curated links (generated) |
| `scripts/generate-resources.mjs` | Source array; run to regenerate `resources.ts` |
| `obsidian/` | Plugin profile template and `community-plugins.json` scaffold |
| `docs/` | QUICKSTART, TUTORIAL, MANUAL, **marketing/** |
| `CLAUDE.md` | Project rules for Claude Code |
| `AGENTS.md` | Next.js–specific agent rules |

## 4. Commands

| Command | Use |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `node scripts/generate-resources.mjs` | Regenerate `src/data/resources.ts` |

## 5. Content maintenance

### 5.1 Changing the schedule

Edit **`src/data/week.ts`**. Types: **`src/types/curriculum.ts`**. After edits, run `npm run build` to verify.

### 5.2 Changing the 100 resources

1. Edit **`scripts/generate-resources.mjs`** (`items` array).
2. Keep exactly **100** entries (or update `RESOURCE_COUNT` in `src/data/resources.ts` and any UI copy that says “100”).
3. Run `node scripts/generate-resources.mjs`.
4. Commit both the script and `src/data/resources.ts`.

### 5.3 Styling and navigation

- Global layout: `src/app/layout.tsx`
- Header: `src/components/SiteHeader.tsx`
- Site config: `src/config/site.ts` (e.g. GitHub URL)

### 5.4 Environment

- **`.env.example`** — `NEXT_PUBLIC_GITHUB_REPO_URL` for in-app GitHub links.
- No secrets required for static curriculum content.

## 6. Obsidian, LLM Wiki, and plugins

- **Vault per domain** reduces Query noise (see `/llm-wiki` and Week 1 / Friday content).
- Do **not** commit a full **`.obsidian/`** unless the team explicitly wants shared editor settings.
- Use **`obsidian/README.md`** for backup and rollout order.
- Enable plugins in **waves** (Terminal → Graph essentials → heavier plugins) per **`/obsidian-stack`** and Friday steps.

## 7. Security and privacy

- Never commit API keys, `.env`, or customer data in notes or repo.
- For **MCP** (optional), document scopes in `Notes/Runbook-MCP.md` and keep tokens out of Git.
- Review agent outputs before merging to `main`.

## 8. Deployment (optional)

Standard Next.js deployment (e.g. Vercel): **Root** = this project directory, **Build** `npm run build`, **Output** Next default.

## 9. Suggested cohort rhythm

| Block | Activity |
| --- | --- |
| **Open** | 10 min — retro, today’s outcomes (Raw vs Wiki clarity) |
| **Teach** | 15–20 min — one LLM Wiki idea (Ingest, Query, or Lint) |
| **Build** | 60–90 min — vault work + optional Next.js PR |
| **Close** | 15 min — checklist; schedule **Lint** |

## 10. Support references

- [QUICKSTART.md](./QUICKSTART.md)
- [TUTORIAL.md](./TUTORIAL.md)
- [README.md](../README.md)
- [marketing/README.md](./marketing/README.md)
