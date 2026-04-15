# Obsidian configuration for this repository

Treat the repository root as your vault so markdown notes sit next to `src/`.

## Files

- `plugin-manifest-profile.json` — Human-readable profile metadata and intent (not consumed directly by Obsidian).
- `community-plugins.json` — **Template** list of plugin IDs. Copy into `.obsidian/community-plugins.json` only after reviewing each plugin.

## Safe rollout

1. Duplicate `.obsidian` before changes.
2. Install plugins manually from Obsidian’s Community plugins browser.
3. Enable a small subset first (Git + Templater + Dataview + Omnisearch).
4. Add visual-heavy plugins (Excalidraw, graph tooling) only during architecture sessions.

## Notes

- Obsidian plugin IDs can change; verify in the UI if an ID fails to resolve.
- Keep build outputs and `node_modules/` out of sync by using Obsidian’s ignore settings or a dedicated `Notes/` folder with attachment rules.
