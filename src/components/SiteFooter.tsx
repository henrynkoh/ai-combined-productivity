export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200/80 bg-zinc-50/80 py-10 text-sm text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:text-zinc-400">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <p>
          Built as a Next.js reference app for a one-week curriculum. Pair it with{" "}
          <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-xs dark:bg-zinc-800">CLAUDE.md</code>,{" "}
          <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-xs dark:bg-zinc-800">AGENTS.md</code>, and your Obsidian vault at the
          repository root.
        </p>
        <p className="mt-3">
          Resources are curated pointers, not endorsements. Verify licenses and security posture before production use.
        </p>
      </div>
    </footer>
  );
}
