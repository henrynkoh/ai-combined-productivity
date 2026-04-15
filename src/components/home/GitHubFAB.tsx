"use client";

import { githubRepoUrl } from "@/config/site";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.195-22.229-5.378-22.229-24.054 0-5.378 1.94-9.697 5.014-13.1-.485-1.195-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.843.485 13.038 3.155 3.422 5.015 7.822 5.015 13.1 0 18.676-11.404 22.859-22.309 24.069 1.754 1.561 3.316 4.547 3.316 9.247 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      />
    </svg>
  );
}

export function GitHubFAB() {
  return (
    <a
      href={githubRepoUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="View on GitHub"
      className="group fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-zinc-900 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition hover:scale-105 hover:bg-zinc-800 hover:shadow-[0_12px_40px_rgba(16,185,129,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:ring-emerald-500/30"
    >
      <GitHubIcon className="h-7 w-7 transition group-hover:text-emerald-400" />
      <span className="sr-only">Open repository on GitHub</span>
    </a>
  );
}
