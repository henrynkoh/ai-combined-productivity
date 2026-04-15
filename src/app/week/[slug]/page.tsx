import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { week, getDay } from "@/data/week";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return week.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const day = getDay(slug);
  if (!day) return { title: "Day" };
  return { title: day.title };
}

export default async function WeekDayPage({ params }: Props) {
  const { slug } = await params;
  const day = getDay(slug);
  if (!day) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <nav className="text-sm text-zinc-600 dark:text-zinc-400">
        <Link href="/week" className="font-medium text-emerald-700 hover:underline dark:text-emerald-400">
          ← Week plan
        </Link>
      </nav>

      <header className="mt-6 max-w-3xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            {day.label}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            {day.title}
          </h1>
        </div>
        <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">{day.summary}</p>
      </header>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Outcomes</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {day.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Exit checklist</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {day.checklist.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Step-by-step</h2>
        <ol className="mt-6 space-y-6">
          {day.steps.map((step, idx) => (
            <li
              key={step.title}
              className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  Step {idx + 1}
                </p>
              </div>
              <h3 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{step.detail}</p>
              {step.command ? (
                <pre className="mt-4 overflow-x-auto rounded-2xl bg-zinc-950 p-4 text-xs text-emerald-100 dark:bg-black">
                  <code>{step.command}</code>
                </pre>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 flex flex-col gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Keep notes in Obsidian synchronized with the PRs you ship the same day.</p>
        <Link
          href="/resources"
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-emerald-400 dark:border-zinc-600 dark:text-zinc-50"
        >
          Open resource list
        </Link>
      </section>
    </div>
  );
}
