# Tutorial: Your first hour with the LLM Wiki lab

This walkthrough is for **cohort members** or **facilitators** running the **Seattle LLM Wiki** week. It connects Karpathy’s **Raw → Wiki → Query** model, the **web app**, **Obsidian**, and **Claude Code**, with safety and domain judgment front and center.

**Primary references**

- [Karpathy `llm-wiki.md` (gist)](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f#file-llm-wiki-md)
- [Practical Obsidian walkthrough (video)](https://www.youtube.com/watch?v=S6w4g2OQlVQ)

---

## Part A — Run the curriculum site (10 minutes)

1. Clone or copy the `seattle-agentic-curriculum` repository.
2. Run `npm install` then `npm run dev`.
3. In the browser:
   - Open **`/`** and scan the week-at-a-glance.
   - Open **`/llm-wiki`** and read the three **structures** (Raw, Wiki, Schema) and three **commands** (Ingest, Query, Lint).
   - Open **`/week/mon`** and read Day 1 outcomes (vault, Terminal plugin, charter).
4. Open **`/resources`**, filter by **Obsidian**, and bookmark the **Karpathy gist** and **video** entries.

---

## Part B — Obsidian vault + Terminal (20 minutes)

1. Install [Obsidian](https://obsidian.md/) if needed.
2. **Create a new vault** for one domain only (e.g. product narrative, GTM, or core architecture)—mixing unrelated topics in one vault hurts Query quality.
3. Enable **Community plugins** → install **Terminal** → dock it (e.g. right pane) so file tree + note + shell match the video workflow.
4. In the vault, create `Notes/Cohort-Charter.md` with: team name, roles, “definition of done” for Friday, and which **single domain** this vault represents.

---

## Part C — Scaffold Raw / Wiki / Schema from the gist (15 minutes)

1. With **Claude Code** or **Cursor** opened on the vault folder (or repo), paste the gist URL and ask how to lay out **Raw**, **Wiki**, and **Schema** per Karpathy.
2. Confirm the agent’s proposal against the gist: Raw = captures; Wiki = curated linked pages; Schema = rules for the agent.
3. Do **not** commit secrets. Use placeholders for API keys.

---

## Part D — Claude Code smoke test on this repo (10 minutes)

1. Install Claude Code per [Anthropic’s docs](https://docs.anthropic.com/en/docs/claude-code/overview); run `claude auth login`.
2. From **this project’s root** (`seattle-agentic-curriculum`), run a **small** task, e.g. add a line to `Notes/README.md` (create `Notes/` if missing) linking to `/week` and `/llm-wiki`.
3. Review the diff before committing.

---

## Part E — Skill-ify Ingest / Query / Lint (10 minutes, preview of Wednesday)

Draft three short reusable prompts (or skill files) named clearly for **Ingest**, **Query**, and **Lint**. Keep them **vault-local** so they do not leak to global config. Details are in **`/week/wed`**.

---

## Part F — Optional: Graphify touchpoint (Saturday lab)

If you are previewing the optional code-graph day: follow current install docs for **Graphify**, run from the **repository root**, and tag a summary note `#graphify`. See **`/week/sat`** and [MANUAL.md](./MANUAL.md) §6.

---

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `npm run dev` fails | Node 20+, delete `node_modules`, reinstall |
| Obsidian slow | Fewer plugins; exclude `node_modules` from heavy indexing |
| Claude Code cannot see files | Run from repo root; `CLAUDE.md` present |
| Query answers feel noisy | Split domains into separate vaults; run **Lint** |

---

## Next

- Short setup: [QUICKSTART.md](./QUICKSTART.md)
- Full reference: [MANUAL.md](./MANUAL.md)
