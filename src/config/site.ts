/** Public repo URL for the floating GitHub button and CTAs. Override with `.env.local`: NEXT_PUBLIC_GITHUB_REPO_URL */
export const githubRepoUrl =
  process.env.NEXT_PUBLIC_GITHUB_REPO_URL ?? "https://github.com/henrynkoh/ai-combined-productivity";

/**
 * Path from monorepo root to this Next.js app (no leading/trailing slashes).
 * Used for `blob/main/...` links to docs and files on GitHub.
 */
export const githubProjectRoot =
  process.env.NEXT_PUBLIC_GITHUB_PROJECT_ROOT ?? "seattle-agentic-curriculum";

/** Link to a file in this project on GitHub (default branch `main`). */
export function githubBlobUrl(pathFromProjectRoot: string): string {
  const clean = pathFromProjectRoot.replace(/^\/+/, "");
  return `${githubRepoUrl}/blob/main/${githubProjectRoot}/${clean}`;
}
