"use client";

import { useMemo, useState } from "react";
import type { Resource, ResourceCategory } from "@/types/curriculum";

const labels: Record<ResourceCategory, string> = {
  "claude-code": "Claude Code",
  mcp: "MCP",
  obsidian: "Obsidian",
  graphify: "Graphify",
  nextjs: "Next.js",
  workflow: "Workflow",
};

const allCategories = Object.keys(labels) as ResourceCategory[];

type Props = {
  resources: Resource[];
};

export function ResourcesClient({ resources }: Props) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<ResourceCategory | "all">("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return resources.filter((r) => {
      if (cat !== "all" && r.category !== cat) return false;
      if (!needle) return true;
      return (
        r.title.toLowerCase().includes(needle) ||
        r.note.toLowerCase().includes(needle) ||
        r.url.toLowerCase().includes(needle)
      );
    });
  }, [resources, q, cat]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="flex max-w-md flex-1 flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Search
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by title, URL, or note…"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 shadow-sm outline-none ring-emerald-500/0 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCat("all")}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              cat === "all"
                ? "bg-emerald-600 text-white shadow"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            }`}
          >
            All
          </button>
          {allCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                cat === c
                  ? "bg-emerald-600 text-white shadow"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              }`}
            >
              {labels[c]}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing {filtered.length} of {resources.length} resources
      </p>
      <ul className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/40">
        {filtered.map((r) => (
          <li key={r.id} className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                {labels[r.category]}
              </span>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-base font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
              >
                {r.title}
              </a>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{r.note}</p>
            </div>
            <span className="shrink-0 font-mono text-xs text-zinc-500 dark:text-zinc-500">#{r.id}</span>
          </li>
        ))}
      </ul>
      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">No matches. Try a shorter search or another category.</p>
      ) : null}
    </div>
  );
}
