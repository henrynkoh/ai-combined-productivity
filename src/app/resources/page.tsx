import type { Metadata } from "next";
import { ResourcesClient } from "@/components/ResourcesClient";
import { RESOURCE_COUNT, resources } from "@/data/resources";

export const metadata: Metadata = {
  title: "100 resources",
  description: `Curated ${RESOURCE_COUNT} links for Claude Code, Obsidian, Graphify, and Next.js workflows.`,
};

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
          Curated library
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          {RESOURCE_COUNT} resources for the combined stack
        </h1>
        <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          Each entry includes a short note about why it matters. Prefer official sources first; community repositories are included
          where they are widely used for Obsidian, Graphify, and Claude Code workflows.
        </p>
      </header>

      <div className="mt-10">
        <ResourcesClient resources={resources} />
      </div>
    </div>
  );
}
