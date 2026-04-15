"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CurriculumDay } from "@/types/curriculum";
import { githubRepoUrl } from "@/config/site";
import { GitHubFAB } from "./GitHubFAB";

type NavItem = { id: string; label: string; children?: { id: string; label: string }[] };

const NAV: NavItem[] = [
  { id: "intro", label: "Introduction" },
  { id: "workflow", label: "Workflow loop" },
  { id: "pillars", label: "Three pillars" },
  { id: "features", label: "Features" },
  {
    id: "week",
    label: "Week program",
    children: [], // filled with week data
  },
  { id: "resources", label: "Resource library" },
  { id: "stack", label: "Obsidian stack" },
  { id: "docs", label: "Documentation" },
];

const FEATURES = [
  {
    title: "Single-page overview",
    desc: "Scan the whole cohort story—hero, loop, week, and links—without losing context.",
    accent: "from-violet-500/20 to-fuchsia-500/10",
    icon: "◈",
  },
  {
    title: "100 curated links",
    desc: "Filter by Claude Code, MCP, Obsidian, Graphify, or Next.js—exportable mental model.",
    accent: "from-sky-500/20 to-cyan-500/10",
    icon: "◇",
  },
  {
    title: "Day-by-day execution",
    desc: "Outcomes, terminal-friendly steps, and exit checklists—not vague inspiration.",
    accent: "from-amber-500/20 to-orange-500/10",
    icon: "◆",
  },
  {
    title: "Agent-ready repo",
    desc: "CLAUDE.md and AGENTS.md keep Claude Code aligned with your Next.js version.",
    accent: "from-emerald-500/20 to-teal-500/10",
    icon: "○",
  },
  {
    title: "Graphify touchpoint",
    desc: "Document where to refresh the knowledge graph after meaningful merges.",
    accent: "from-rose-500/20 to-pink-500/10",
    icon: "◎",
  },
  {
    title: "Obsidian profile",
    desc: "Tiered plugin rollout so your vault stays fast during deep work blocks.",
    accent: "from-indigo-500/20 to-violet-500/10",
    icon: "□",
  },
];

type Props = { week: CurriculumDay[] };

export function HomeLanding({ week }: Props) {
  const [activeId, setActiveId] = useState("intro");
  const navWithWeek = NAV.map((item) =>
    item.id === "week"
      ? {
          ...item,
          children: week.map((d) => ({ id: `day-${d.slug}`, label: d.label.replace(/^Day \d+ · /, "") })),
        }
      : item,
  );

  const sectionIds = useRef<string[]>([]);
  useEffect(() => {
    const ids = ["intro", "workflow", "pillars", "features", "week", ...week.map((d) => `day-${d.slug}`), "resources", "stack", "docs"];
    sectionIds.current = ids;
  }, [week]);

  useEffect(() => {
    const ids = sectionIds.current;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [week]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-emerald-400/25 via-sky-400/15 to-transparent blur-3xl dark:from-emerald-600/20" />
        <div className="absolute -right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-violet-500/20 via-fuchsia-500/10 to-transparent blur-3xl" />
        <div className="landing-grid absolute inset-0 opacity-[0.35] dark:opacity-[0.2]" />
      </div>

      <div className="mx-auto flex max-w-[1600px] gap-0 lg:gap-10 lg:px-6">
        {/* Left sidebar — scrollable */}
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <div className="sticky top-[4.5rem] max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain py-6 pr-2">
            <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
              On this page
            </p>
            <nav className="space-y-0.5 border-l border-zinc-200/80 pl-3 dark:border-zinc-700/80" aria-label="Section navigation">
              {navWithWeek.map((item) => (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(item.id)}
                    className={`mb-0.5 w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                      activeId === item.id || item.children?.some((c) => c.id === activeId)
                        ? "bg-emerald-500/15 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-100"
                        : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                    }`}
                  >
                    {item.label}
                  </button>
                  {item.children && item.children.length > 0 ? (
                    <div className="ml-2 space-y-0.5 border-l border-zinc-200/60 pl-2 dark:border-zinc-700/50">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => scrollTo(child.id)}
                          className={`block w-full rounded-md px-2 py-1.5 text-left text-xs transition ${
                            activeId === child.id
                              ? "font-semibold text-emerald-700 dark:text-emerald-400"
                              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200"
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white/60 px-3 py-2.5 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur transition hover:border-emerald-400/50 hover:text-emerald-800 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-emerald-500/40"
            >
              <span aria-hidden>↗</span> Repository on GitHub
            </a>
          </div>
        </aside>

        {/* Mobile section jumper */}
        <div className="sticky top-[4.5rem] z-40 border-b border-zinc-200/80 bg-zinc-50/90 px-4 py-3 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/90 lg:hidden">
          <label htmlFor="section-jump" className="sr-only">
            Jump to section
          </label>
          <select
            id="section-jump"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            value={activeId}
            onChange={(e) => {
              const v = e.target.value;
              scrollTo(v);
              setActiveId(v);
            }}
          >
            <option value="intro">Introduction</option>
            <option value="workflow">Workflow loop</option>
            <option value="pillars">Three pillars</option>
            <option value="features">Features</option>
            <option value="week">Week program</option>
            {week.map((d) => (
              <option key={d.slug} value={`day-${d.slug}`}>
                {d.label}
              </option>
            ))}
            <option value="resources">Resource library</option>
            <option value="stack">Obsidian stack</option>
            <option value="docs">Documentation</option>
          </select>
        </div>

        {/* Main column */}
        <div className="min-w-0 flex-1 space-y-0 px-4 pb-32 pt-6 sm:px-6 lg:px-0 lg:pt-10">
          <section id="intro" className="scroll-mt-28">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-br from-white/90 via-emerald-50/50 to-sky-50/40 p-8 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/10 dark:border-zinc-800/80 dark:from-zinc-900/90 dark:via-emerald-950/30 dark:to-sky-950/20 dark:shadow-none sm:p-12">
              <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-br from-emerald-400/30 to-transparent blur-2xl" />
              <div className="relative max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-800 dark:text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Greater Seattle · cohort 2026
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
                  Build in public—
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-sky-400">
                    ship with clarity
                  </span>
                </h1>
                <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                  One interactive landing page for the whole curriculum:{" "}
                  <strong className="text-zinc-900 dark:text-white">Obsidian</strong> as your control center,{" "}
                  <strong className="text-zinc-900 dark:text-white">Graphify</strong> for the knowledge graph,{" "}
                  <strong className="text-zinc-900 dark:text-white">Claude Code</strong> in the terminal, and{" "}
                  <strong className="text-zinc-900 dark:text-white">Next.js</strong> as what you ship.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/week"
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-110"
                  >
                    Open full week plan
                  </Link>
                  <Link
                    href="/resources"
                    className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:border-emerald-400/60 dark:border-zinc-600 dark:bg-zinc-900/50 dark:text-white"
                  >
                    Explore 100 resources
                  </Link>
                  <a
                    href={githubRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:border-zinc-700"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 98 96" fill="currentColor" aria-hidden>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.195-22.229-5.378-22.229-24.054 0-5.378 1.94-9.697 5.014-13.1-.485-1.195-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.843.485 13.038 3.155 3.422 5.015 7.822 5.015 13.1 0 18.676-11.404 22.859-22.309 24.069 1.754 1.561 3.316 4.547 3.316 9.247 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                      />
                    </svg>
                    Star on GitHub
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section id="workflow" className="scroll-mt-28 pt-20">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">The integration loop</h2>
            <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
              Four steps you repeat every sprint—documented in Obsidian, verified in Graphify, executed in Claude Code.
            </p>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                { step: "01", title: "Capture intent", body: "Notes and ADRs in Obsidian at the repo root.", color: "from-violet-500 to-purple-600" },
                { step: "02", title: "Map structure", body: "Graphify surfaces dense modules and missing links.", color: "from-sky-500 to-blue-600" },
                { step: "03", title: "Implement", body: "Claude Code applies diffs with CLAUDE.md + AGENTS.md.", color: "from-emerald-500 to-teal-600" },
                { step: "04", title: "Ship & refresh", body: "Merge, then re-run the graph on meaningful milestones.", color: "from-amber-500 to-orange-600" },
              ].map((s) => (
                <li
                  key={s.step}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-lg font-black text-white shadow-lg`}
                  >
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{s.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="pillars" className="scroll-mt-28 pt-20">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">Three pillars</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Control center",
                  body: "Obsidian holds ADRs, customer notes, and sprint scope. Wikilinks tie intent to routes.",
                  gradient: "from-emerald-400/80 to-teal-600",
                },
                {
                  title: "Intelligence layer",
                  body: "Graphify maps code and docs so you spot god nodes before they become incidents.",
                  gradient: "from-violet-400/80 to-indigo-600",
                },
                {
                  title: "Execution engine",
                  body: "Claude Code edits with repo context. MCP grants least-privilege access to tools.",
                  gradient: "from-amber-400/80 to-rose-600",
                },
              ].map((p) => (
                <div
                  key={p.title}
                  className="relative overflow-hidden rounded-2xl border border-white/20 bg-zinc-900 p-[1px] shadow-xl dark:bg-zinc-800"
                >
                  <div className={`h-2 bg-gradient-to-r ${p.gradient}`} />
                  <div className="rounded-2xl bg-white p-6 dark:bg-zinc-950">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="features" className="scroll-mt-28 pt-20">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">Platform features</h2>
            <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
              Hover cards highlight what this site (and repo) gives your cohort out of the box.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className={`group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-gradient-to-br ${f.accent} p-[1px] transition hover:scale-[1.02] hover:shadow-lg dark:border-zinc-700/60`}
                >
                  <div className="h-full rounded-2xl bg-white/90 p-6 dark:bg-zinc-950/90">
                    <span className="text-2xl text-zinc-400 transition group-hover:text-emerald-500" aria-hidden>
                      {f.icon}
                    </span>
                    <h3 className="mt-3 font-semibold text-zinc-900 dark:text-white">{f.title}</h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-20">
            <div id="week" className="scroll-mt-28 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">Week program</h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">Monday–Friday core; weekend optional. Click a day for the full plan.</p>
              </div>
              <Link href="/week" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
                Full schedule →
              </Link>
            </div>
            <div className="mt-10 space-y-4">
              {week.map((day) => (
                <div
                  key={day.slug}
                  id={`day-${day.slug}`}
                  className="scroll-mt-28 rounded-2xl border border-zinc-200/80 bg-white/80 shadow-sm backdrop-blur transition hover:border-emerald-400/40 dark:border-zinc-800 dark:bg-zinc-900/40"
                >
                  <Link
                    href={`/week/${day.slug}`}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{day.label}</p>
                      <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">{day.title}</p>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 sm:max-w-xl sm:text-right">{day.summary}</p>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section id="resources" className="scroll-mt-28 pt-20">
            <div className="rounded-[2rem] border border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-white to-cyan-500/5 p-8 dark:from-sky-950/40 dark:via-zinc-900 dark:to-cyan-950/20 sm:p-10">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Resource library</h2>
              <p className="mt-2 max-w-2xl text-zinc-700 dark:text-zinc-300">
                One hundred links—Claude Code, MCP, Obsidian, Graphify, Next.js, and workflow—with search and category filters.
              </p>
              <Link
                href="/resources"
                className="mt-6 inline-flex rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500"
              >
                Open searchable library
              </Link>
            </div>
          </section>

          <section id="stack" className="scroll-mt-28 pt-20">
            <div className="rounded-[2rem] border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-white to-fuchsia-500/5 p-8 dark:from-violet-950/40 dark:via-zinc-900 dark:to-fuchsia-950/20 sm:p-10">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Obsidian power stack</h2>
              <p className="mt-2 max-w-2xl text-zinc-700 dark:text-zinc-300">
                Tiered plugins, manifest templates, and performance tips—without installing a hundred extensions at once.
              </p>
              <Link
                href="/obsidian-stack"
                className="mt-6 inline-flex rounded-2xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-500"
              >
                View stack strategy
              </Link>
            </div>
          </section>

          <section id="docs" className="scroll-mt-28 pt-20">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">Documentation</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Repo docs for facilitators and engineers. Set <code className="rounded bg-zinc-200/80 px-1 font-mono text-xs dark:bg-zinc-800">NEXT_PUBLIC_GITHUB_REPO_URL</code> so
              these links resolve to your fork.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {(
                [
                  { path: "QUICKSTART.md", label: "Quickstart", desc: "Install and first URLs (~5 min)." },
                  { path: "TUTORIAL.md", label: "Tutorial", desc: "First hour: vault, Claude Code, Graphify." },
                  { path: "MANUAL.md", label: "Manual", desc: "Operations, content updates, cohort rhythm." },
                  { path: "marketing/README.md", label: "Marketing", desc: "Channel copy index (Facebook, email, …)." },
                ] as const
              ).map((doc) => (
                <li
                  key={doc.path}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                  <p className="font-semibold text-zinc-900 dark:text-white">{doc.label}</p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{doc.desc}</p>
                  <a
                    href={`${githubRepoUrl}/blob/main/docs/${doc.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    View on GitHub →
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <GitHubFAB />
    </div>
  );
}
