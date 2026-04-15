import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Obsidian plugin profile",
};

const tiers = [
  {
    name: "Intelligence & automation",
    items: [
      "Smart Connections (embeddings for similar notes)",
      "Text Generator (external model prompts)",
      "Copilot (local LLM bridge)",
      "Omnisearch (fast full-text search)",
    ],
  },
  {
    name: "Data & query",
    items: ["Dataview", "Metadata Menu", "DB Folder", "Projects"],
  },
  {
    name: "Visual thinking",
    items: ["Excalidraw", "Canvas (core)", "Graph view filters", "Iconize"],
  },
  {
    name: "Developer utilities",
    items: ["Obsidian Git", "Templater", "Commander", "Advanced URI", "QuickAdd", "Style Settings"],
  },
];

export default function ObsidianStackPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
          Profile-based manifest
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          A “top 100” mindset without melting your laptop
        </h1>
        <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          Loading 100 plugins at once is not realistic for most teams. Instead, group plugins by job-to-be-done, store the profile in
          Git, and enable heavy visualizers only during architecture blocks. This page summarizes the tiered stack referenced in
          Friday’s plan; the manifest lives in{" "}
          <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800">obsidian/plugin-manifest-profile.json</code>.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8"
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{tier.name}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
              {tier.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <section className="mt-14 rounded-3xl border border-emerald-200/60 bg-emerald-50/50 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/30 sm:p-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">How to apply the manifest</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <li>Back up your existing <code className="font-mono text-xs">.obsidian</code> directory.</li>
          <li>
            Merge <code className="font-mono text-xs">community-plugins.json</code> enabled IDs carefully—Obsidian expects a JSON
            array of plugin IDs, not a custom profile object.
          </li>
          <li>
            Install plugins from Obsidian’s community browser, then enable the subset listed in{" "}
            <code className="font-mono text-xs">obsidian/README.md</code>.
          </li>
          <li>
            Pair with Graphify outputs tagged <code className="font-mono text-xs">#graphify</code> so graph filters stay meaningful.
          </li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/resources"
            className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
          >
            View plugin GitHub links in Resources
          </Link>
          <Link
            href="/week/fri"
            className="inline-flex rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-emerald-400 dark:border-zinc-600 dark:text-zinc-50"
          >
            Jump to Friday’s plugin lab
          </Link>
        </div>
      </section>
    </div>
  );
}
