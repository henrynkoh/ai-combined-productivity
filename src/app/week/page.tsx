import Link from "next/link";
import type { Metadata } from "next";
import { week } from "@/data/week";

export const metadata: Metadata = {
  title: "Week plan",
};

export default function WeekIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
          Seven-day arc
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Practical steps for a Seattle startup cohort
        </h1>
        <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          Each day mixes live instruction, solo build time, and a short retro. Adjust the depth to your team’s starting point, but
          keep the loop: Obsidian captures intent, Graphify validates structure, Claude Code executes with review.
        </p>
      </header>

      <div className="mt-10 space-y-6">
        {week.map((day) => (
          <article
            key={day.slug}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  {day.label}
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{day.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{day.summary}</p>
              </div>
              <Link
                href={`/week/${day.slug}`}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
              >
                Open day
              </Link>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Outcomes</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                  {day.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Exit checklist</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                  {day.checklist.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
