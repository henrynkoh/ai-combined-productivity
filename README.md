# Seattle LLM Wiki lab (Next.js)

Next.js cohort site for a one-week, hands-on program (Greater Seattle startups) built around **Andrej Karpathy’s LLM Wiki** model: **Raw → Wiki → Query** with **Ingest / Query / Lint**, implemented in Obsidian per the [walkthrough video](https://www.youtube.com/watch?v=S6w4g2OQlVQ) and the [llm-wiki.md gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f#file-llm-wiki-md). This repo is the shared app and agent context; founders’ vaults hold the knowledge loop.

Optional weekend blocks still reference **Graphify** on the codebase and **MCP** for Claude Code—see `src/data/week.ts`.

## Documentation

| Doc | Description |
| --- | --- |
| [**Quickstart**](docs/QUICKSTART.md) | Fast setup and first URLs (~5 min) |
| [**Tutorial**](docs/TUTORIAL.md) | First-hour walkthrough (vault + Claude Code + Graphify touchpoint) |
| [**Manual**](docs/MANUAL.md) | Full operator reference: layout, commands, content updates, cohort rhythm |
| [**Docs index**](docs/README.md) | Navigation hub for all documentation |

## Marketing copy (channel-specific ads)

Ready-to-adapt text for campaigns lives in [**docs/marketing/**](docs/marketing/):

| Channel | File |
| --- | --- |
| Facebook | [facebook.md](docs/marketing/facebook.md) |
| Instagram | [instagram.md](docs/marketing/instagram.md) |
| Threads | [threads.md](docs/marketing/threads.md) |
| Blogger | [blogger.md](docs/marketing/blogger.md) |
| WordPress | [wordpress.md](docs/marketing/wordpress.md) |
| 네이버 블로그 | [naver-blog.md](docs/marketing/naver-blog.md) |
| 티스토리 | [tistory.md](docs/marketing/tistory.md) |
| Newsletter | [newsletter.md](docs/marketing/newsletter.md) |
| Email | [email.md](docs/marketing/email.md) |

Replace placeholders such as `{REGISTRATION_LINK}`, `{DATE}`, `{EMAIL}` before publishing. See [docs/marketing/README.md](docs/marketing/README.md) for a short disclaimer.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The **home page** is a single scrollable landing with a **left sidebar** (desktop) for section navigation, **scroll-spy** highlighting, a **mobile section jumper**, and a **floating GitHub button** (bottom-right). Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GITHUB_REPO_URL` to your repository URL so doc links and the FAB point at the right GitHub project.

## Key paths in the repo

| Path | Purpose |
| --- | --- |
| `src/data/week.ts` | Day-by-day outcomes, steps, and checklists |
| `src/data/resources.ts` | 100 curated links (regenerate via `node scripts/generate-resources.mjs`) |
| `scripts/generate-resources.mjs` | Source list for the resource library |
| `obsidian/` | Plugin profile template + `community-plugins.json` scaffold |
| `CLAUDE.md` / `AGENTS.md` | Agent context for Claude Code |

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```
