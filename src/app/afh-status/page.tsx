import type { Metadata } from "next";
import { readFileSync, readdirSync, existsSync } from "fs";
import path from "path";

export const metadata: Metadata = { title: "AFH Status" };

// Runs server-side at request time — reads live data from disk
export const dynamic = "force-dynamic";

const BASE   = path.join(process.cwd());
const TODAY  = new Date().toISOString().slice(0, 10);

function countFiles(dir: string, ext = ".json") {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => f.endsWith(ext)).length;
}

function loadProperties(dir: string) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.includes("prompts"))
    .flatMap((f) => {
      try {
        const d = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
        return (Array.isArray(d) ? d : [d]).filter(
          (p: any) => p.category && p.category !== "DOES_NOT_QUALIFY"
        );
      } catch { return []; }
    });
}

function loadLeads(dir: string) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.includes("prompts") && !f.includes("scorer"))
    .flatMap((f) => {
      try {
        const d = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
        return Array.isArray(d) ? d : [];
      } catch { return []; }
    });
}

function latestReport(dir: string) {
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => f.endsWith(".md")).sort().reverse();
  if (!files[0]) return null;
  try { return readFileSync(path.join(dir, files[0]), "utf8"); } catch { return null; }
}

function fmt(n: number | null) {
  return n ? `$${Number(n).toLocaleString()}` : "N/A";
}

function categoryBadge(cat: string) {
  const map: Record<string, string> = {
    AFH_WABO_READY:       "bg-yellow-100 text-yellow-800 border-yellow-300",
    AFH_INSPECTION_READY: "bg-green-100  text-green-800  border-green-300",
    AFH_POTENTIAL:        "bg-blue-100   text-blue-800   border-blue-300",
  };
  const labels: Record<string, string> = {
    AFH_WABO_READY: "🏆 WABO", AFH_INSPECTION_READY: "✅ INSP", AFH_POTENTIAL: "🔵 POT",
  };
  return { cls: map[cat] || "bg-zinc-100 text-zinc-700 border-zinc-300", label: labels[cat] || cat };
}

export default function AFHStatusPage() {
  const props    = loadProperties(path.join(BASE, "AFHP/data/properties"));
  const leads    = loadLeads(path.join(BASE, "AFH/data/leads"));
  const wabo     = props.filter((p: any) => p.category === "AFH_WABO_READY");
  const insp     = props.filter((p: any) => p.category === "AFH_INSPECTION_READY");
  const pot      = props.filter((p: any) => p.category === "AFH_POTENTIAL");
  const hotLeads = leads.filter((l: any) => (l.score || 0) >= 7);
  const report   = latestReport(path.join(BASE, "AFHP/data/reports/hourly"));
  const hourlyToday = existsSync(path.join(BASE, "AFHP/data/reports/hourly"))
    ? readdirSync(path.join(BASE, "AFHP/data/reports/hourly")).filter((f) => f.startsWith(TODAY)).length
    : 0;

  const topProps = [...wabo, ...insp, ...pot]
    .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
    .slice(0, 30);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        AFH Project Suite — Live Status
      </h1>
      <p className="mt-1 text-sm text-zinc-500">{TODAY} · refreshes on each page load</p>

      {/* Stats row */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {[
          { label: "Hourly Scans Today", value: `${hourlyToday}/24`, color: "emerald" },
          { label: "Total Properties",   value: props.length,         color: "zinc"    },
          { label: "🏆 WABO Ready",      value: wabo.length,          color: "yellow"  },
          { label: "✅ Insp Ready",      value: insp.length,          color: "green"   },
          { label: "🔵 Potential",       value: pot.length,           color: "blue"    },
          { label: "AFH Leads",          value: leads.length,         color: "zinc"    },
          { label: "Hot Leads (≥7)",     value: hotLeads.length,      color: "red"     },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Property table */}
      <h2 className="mt-8 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Top Properties — All Categories
      </h2>
      <p className="text-xs text-zinc-500">3+ bed · 2+ bath · 2,000+ sqft · ≤$600k · WA State · Rambler preferred</p>

      {topProps.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
          No properties collected yet. Start the AFHP orchestrator:
          <br /><code className="mt-2 block text-xs">/loop 60m node AFHP/src/orchestrator.js</code>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                {["#","Location","Price","Bed","Bath","Sqft","Style","County","Category","Score","Days","Contact","Source","Posted"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {topProps.map((p: any, i: number) => {
                const { cls, label } = categoryBadge(p.category);
                return (
                  <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-3 py-2 font-mono text-xs text-zinc-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium text-zinc-800 dark:text-zinc-200">
                      {(p.city || p.address || "?").slice(0, 26)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-semibold text-emerald-700 dark:text-emerald-400">
                      {fmt(p.price)}
                    </td>
                    <td className="px-3 py-2 text-center">{p.beds ?? "?"}</td>
                    <td className="px-3 py-2 text-center">{p.baths ?? "?"}</td>
                    <td className="px-3 py-2 text-right">{p.sqft ? Number(p.sqft).toLocaleString() : "?"}</td>
                    <td className="px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400">
                      {(p.style || "?").replace("rambler-basement","R+Bsmt").replace("rambler-bonus","R+Bonus").replace("rambler","Rambler")}
                    </td>
                    <td className="px-3 py-2 text-xs">{p.county ?? "?"}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>
                        {label}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center font-bold text-zinc-900 dark:text-zinc-50">
                      {(p.score || 0).toFixed(1)}
                    </td>
                    <td className="px-3 py-2 text-center text-xs text-zinc-400">{p.days_listed ?? 0}d</td>
                    <td className="px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400">
                      {(p.contact_info || "—").slice(0, 18)}
                    </td>
                    <td className="px-3 py-2 text-xs text-zinc-500">
                      {(p.source_group || "?").slice(0, 20)}
                    </td>
                    <td className="px-3 py-2 text-xs text-zinc-400">{p.post_date ?? "?"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* AFH Intel hot leads */}
      {hotLeads.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            👥 AFH Intel — Hot Leads (score ≥ 7)
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {hotLeads
              .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
              .slice(0, 9)
              .map((l: any, i: number) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-500">{l.category}</span>
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      Score {l.score}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-800 dark:text-zinc-200 line-clamp-3">
                    {(l.post_text || "").slice(0, 160)}
                  </p>
                  <p className="mt-2 text-xs text-zinc-400">
                    {l.county} · {l.source_group} · {l.post_date}
                  </p>
                  {l.contact_info && (
                    <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      {l.contact_info}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </>
      )}

      {/* Loop commands */}
      <div className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Start / Monitor</h2>
        <div className="mt-3 space-y-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
          <p># Start both projects (runs forever):</p>
          <p className="text-emerald-700 dark:text-emerald-400">node launch-all.js</p>
          <p className="mt-2"># Or in Claude Code sessions:</p>
          <p className="text-emerald-700 dark:text-emerald-400">/loop 60m node AFHP/src/orchestrator.js</p>
          <p className="text-emerald-700 dark:text-emerald-400">/loop 120m node AFH/src/orchestrator.js</p>
          <p className="mt-2"># Status dashboard:</p>
          <p className="text-emerald-700 dark:text-emerald-400">node status.js</p>
        </div>
      </div>
    </div>
  );
}
