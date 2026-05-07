import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

export type CaseStudy = {
  id: string;
  title: string;
  hook: string;
  domains: string[];
  body: string;
};

export type Skill = {
  rank: number;
  name: string;
  evidence: string;
  domains: string[];
  icon: string;
};

export type SkillsFile = {
  lastUpdated: string;
  skills: Skill[];
};

export type LiveStats = {
  lastUpdated: string;
  stats: Record<string, number>;
  recentShipments: Array<{ date: string; title: string; summary: string }>;
};

export type KnowledgeBase = {
  systemPrompt: string;
  caseStudies: CaseStudy[];
  skills: SkillsFile;
  liveStats: LiveStats;
};

const KB_ROOT = join(process.cwd(), "kb");

export function loadKnowledgeBase(): KnowledgeBase {
  const systemPrompt = readFileSync(join(KB_ROOT, "_system-prompt.md"), "utf8");
  const csDir = join(KB_ROOT, "case-studies");
  const caseStudies: CaseStudy[] = readdirSync(csDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const raw = readFileSync(join(csDir, f), "utf8");
      const { data, content } = matter(raw);
      return {
        id: String(data.id ?? ""),
        title: String(data.title ?? ""),
        hook: String(data.hook ?? ""),
        domains: Array.isArray(data.domains) ? data.domains.map(String) : [],
        body: content.trim(),
      };
    });
  const skills = JSON.parse(readFileSync(join(KB_ROOT, "skills.json"), "utf8")) as SkillsFile;
  const liveStats = JSON.parse(readFileSync(join(KB_ROOT, "live-stats.json"), "utf8")) as LiveStats;
  return { systemPrompt, caseStudies, skills, liveStats };
}
