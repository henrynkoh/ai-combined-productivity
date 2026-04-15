# Tutorial: Your first hour with the stack

This walkthrough assumes you are a **cohort member** or **facilitator** running the Seattle Agentic Lab curriculum. It connects the **web app**, **Obsidian**, and **Claude Code** without skipping safety checks.

## Part A — Run the curriculum site (10 minutes)

1. Clone or copy the `seattle-agentic-curriculum` project.
2. Run `npm install` then `npm run dev`.
3. In the browser, go through:
   - Home → confirm the three pillars (Obsidian, Graphify, Claude Code).
   - `/week/mon` → read Day 1 outcomes and steps.
4. Open `/resources` and filter by **Claude Code**; bookmark the official docs link you will use during install.

## Part B — Treat the repo as a vault (15 minutes)

1. Install [Obsidian](https://obsidian.md/) if needed.
2. **File → Open folder as vault** → select the **project root** (same folder as `package.json`).
3. Create `Notes/Cohort-Charter.md` with:
   - Team name and roles
   - One sentence “definition of done” for Friday
   - Link to `src/app/page.tsx` using a wikilink or path note
4. Enable **core** plugins only first (Daily notes optional). Defer community plugins until you read `obsidian/README.md`.

## Part C — Claude Code smoke test (15 minutes)

1. Install Claude Code per [Anthropic’s documentation](https://docs.anthropic.com/en/docs/claude-code/overview).
2. Run `claude auth login` and confirm success.
3. From the repo root, run a **small, bounded** task, for example:  
   “Add a `Notes/README.md` that links to `/week` and `/resources`.”
4. Review the diff in Git before committing.

## Part D — Graphify touchpoint (15 minutes)

1. Follow the current install path on [graphify.net](https://graphify.net/) or the [Graphify GitHub repo](https://github.com/safishamsi/graphify) (commands change by release).
2. Run analysis from the **repository root** once dependencies are installed.
3. In Obsidian, create a note tagged `#graphify` summarizing what stood out in the graph (central files, surprises).

## Part E — Close the loop (5 minutes)

1. In Obsidian, link your charter note to the Graphify summary note.
2. Open a PR or commit with message: `docs: charter + graphify notes`.
3. Skim [MANUAL.md](./MANUAL.md) § Daily rhythm so tomorrow matches the cohort cadence.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `npm run dev` fails | Node version, delete `node_modules` and reinstall |
| Obsidian feels slow | Fewer plugins; exclude `node_modules` from indexing if needed |
| Claude Code cannot see files | Run from repo root; confirm `CLAUDE.md` exists |
| Graphify command not found | Use the install method in the official README for your OS |

## Next

- [QUICKSTART.md](./QUICKSTART.md) for the shortest path
- [MANUAL.md](./MANUAL.md) for roles, files, and policies
