import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LLM Wiki reference",
  description:
    "Andrej Karpathy’s LLM Wiki: Raw, Wiki, Schema and Ingest, Query, Lint — quick reference for the Seattle cohort lab.",
};

const sources = [
  {
    label: "Primary spec (gist)",
    href: "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f#file-llm-wiki-md",
    body: "Karpathy’s llm-wiki.md — folder ideas, agent behavior, and the operating loop your vault should implement.",
  },
  {
    label: "Video walkthrough (Obsidian)",
    href: "https://www.youtube.com/watch?v=S6w4g2OQlVQ",
    body: "Full practical setup: Obsidian vault, Terminal plugin, scaffolding with an agent, Raw → Ingest → Graph → Query → Lint, and a real product application.",
  },
];

export default function LlmWikiPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
          Karpathy LLM Wiki
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Structures and commands you are implementing this week
        </h1>
        <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          LLM Wiki is not a single downloadable app: it is a discipline. You keep messy captures in Raw, let an agent curate linked
          articles in Wiki, and write operating rules in Schema. Three verbs drive the loop: Ingest (Raw → Wiki), Query (answer from
          Wiki only), and Lint (garden: orphans, duplicates, drift).
        </p>
      </header>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          {
            name: "Raw",
            desc: "Unstructured inputs: clips, transcripts, meeting bullets, URLs, rough notes. Quantity over polish.",
          },
          {
            name: "Wiki",
            desc: "Consolidated, interlinked pages the agent maintains. Query should trust this layer, not Raw noise.",
          },
          {
            name: "Schema",
            desc: "Policies: naming, deduplication, linking rules, and agent instructions. Rarely edited by hand mid-week.",
          },
        ].map((card) => (
          <div
            key={card.name}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8"
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{card.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{card.desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-3xl border border-emerald-200/60 bg-emerald-50/50 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/30 sm:p-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Commands (habits)</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <li>Ingest — Turn new or updated Raw material into Wiki pages with explicit sources.</li>
          <li>Query — Ask questions that must be answered from Wiki; demand paths or note titles as citations.</li>
          <li>Lint — Reconcile structure: broken links, duplicate claims, clusters that belong in another vault.</li>
        </ul>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Split unrelated domains into separate vaults so Query context stays sharp—especially for small Seattle teams wearing many hats.
        </p>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Sources</h2>
        {sources.map((s) => (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-emerald-400/60 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-emerald-500/40 sm:p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{s.label}</p>
            <p className="mt-2 text-sm font-mono text-zinc-500 dark:text-zinc-500">{s.href}</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{s.body}</p>
          </a>
        ))}
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/week"
          className="inline-flex rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
        >
          Day-by-day lab
        </Link>
        <Link
          href="/resources"
          className="inline-flex rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:border-emerald-400 dark:border-zinc-600 dark:text-zinc-50"
        >
          Resources library
        </Link>
      </div>
    </div>
  );
}
