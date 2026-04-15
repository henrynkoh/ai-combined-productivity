@AGENTS.md

# Seattle Agentic Next.js Lab

This repository is the curriculum app plus the agent context files. Keep changes small, reviewable, and aligned with the week plan in `src/data/week.ts`.

## Product rules

- Prefer the App Router and Server Components unless a Client boundary is required.
- Use Tailwind utility classes; keep spacing and typography consistent with existing pages.
- Do not add new dependencies unless necessary for a curriculum feature.
- When referencing Obsidian, remind users to back up `.obsidian` before bulk plugin changes.

## Working style

- Link user-facing copy to `/week`, `/resources`, and `/obsidian-stack` where relevant.
- Keep the 100-resource list in sync with `scripts/generate-resources.mjs` (run `node scripts/generate-resources.mjs` after edits).
