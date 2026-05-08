import Link from "next/link";

const nav = [
  { href: "/", label: "Overview" },
  { href: "/llm-wiki", label: "LLM Wiki" },
  { href: "/week", label: "Week plan" },
  { href: "/resources", label: "100 resources" },
  { href: "/obsidian-stack", label: "Obsidian stack" },
  { href: "/afh-status", label: "🏠 AFH Status" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Seattle cohort · 2026
          </p>
          <Link href="/" className="mt-1 block text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            LLM Wiki · Seattle lab
          </Link>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Karpathy wiki + Obsidian + Next.js cohort site
          </p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-800 transition hover:border-emerald-500/50 hover:text-emerald-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
