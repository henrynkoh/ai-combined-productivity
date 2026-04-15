# Seattle LLM Wiki lab (Next.js)

Next.js cohort site for a **one-week, hands-on** program (**Greater Seattle** startups) built around **Andrej Karpathy’s LLM Wiki** model: **Raw → Wiki → Query** with **Ingest / Query / Lint**, practiced in **Obsidian** using the [walkthrough video](https://www.youtube.com/watch?v=S6w4g2OQlVQ) and the [`llm-wiki.md` gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f#file-llm-wiki-md). This repo is the **shared app** and agent context (`CLAUDE.md`, `AGENTS.md`); each team’s **vault** holds the knowledge loop.

Optional blocks still cover **Graphify** (code graph) and **MCP** for Claude Code—see `src/data/week.ts` (Days 6–7).

---

## Documentation

| Doc | Description |
| --- | --- |
| [**Quickstart / quickstarter**](docs/QUICKSTART.md) | Install, first URLs, env—about **5 minutes** |
| [**Tutorial**](docs/TUTORIAL.md) | First-hour path: site → vault → gist scaffold → Claude smoke test |
| [**Manual**](docs/MANUAL.md) | Operators & maintainers: layout, content updates, cohort rhythm |
| [**Docs index**](docs/README.md) | Navigation hub |

---

## Marketing & outreach copy

Channel-specific **ads and posts** (replace `{REGISTRATION_LINK}`, `{DATE}`, `{EMAIL}`, etc.):

| Channel | File |
| --- | --- |
| Facebook | [docs/marketing/facebook.md](docs/marketing/facebook.md) |
| Instagram | [docs/marketing/instagram.md](docs/marketing/instagram.md) |
| Threads | [docs/marketing/threads.md](docs/marketing/threads.md) |
| Blogger | [docs/marketing/blogger.md](docs/marketing/blogger.md) |
| WordPress | [docs/marketing/wordpress.md](docs/marketing/wordpress.md) |
| 네이버 블로그 | [docs/marketing/naver-blog.md](docs/marketing/naver-blog.md) |
| 티스토리 | [docs/marketing/tistory.md](docs/marketing/tistory.md) |
| Newsletter | [docs/marketing/newsletter.md](docs/marketing/newsletter.md) |
| Email | [docs/marketing/email.md](docs/marketing/email.md) |

Disclaimer and placeholders: [docs/marketing/README.md](docs/marketing/README.md).

---

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The home page is implemented in `src/components/home/HomeLanding.tsx` (scrollable sections; optional GitHub FAB). Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GITHUB_REPO_URL` if you want in-app links to point at your fork.

---

## Key paths

| Path | Purpose |
| --- | --- |
| `src/data/week.ts` | Day-by-day outcomes, steps, checklists |
| `src/app/llm-wiki/page.tsx` | LLM Wiki reference (structures + commands) |
| `src/data/resources.ts` | 100 curated links (`node scripts/generate-resources.mjs` to regenerate) |
| `scripts/generate-resources.mjs` | Source list for the resource library |
| `obsidian/` | Plugin profile template + `community-plugins.json` scaffold |
| `CLAUDE.md` / `AGENTS.md` | Agent context for Claude Code |

---

## Build & lint

```bash
npm run build
npm run lint
```

---

## License

Content and code are for cohort use; verify third-party tool terms (Anthropic, Obsidian, etc.) before public campaigns.
