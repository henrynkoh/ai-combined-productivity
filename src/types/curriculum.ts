export type ResourceCategory =
  | "claude-code"
  | "mcp"
  | "obsidian"
  | "graphify"
  | "nextjs"
  | "workflow";

export type Resource = {
  id: number;
  title: string;
  url: string;
  category: ResourceCategory;
  note: string;
};

export type CurriculumStep = {
  title: string;
  detail: string;
  command?: string;
};

export type CurriculumDay = {
  slug: string;
  label: string;
  title: string;
  summary: string;
  outcomes: string[];
  steps: CurriculumStep[];
  checklist: string[];
};
