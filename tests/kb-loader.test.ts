import { describe, it, expect } from "vitest";
import { loadKnowledgeBase } from "@/lib/kb-loader";

describe("kb-loader", () => {
  it("loads all 8 case studies", () => {
    const kb = loadKnowledgeBase();
    expect(kb.caseStudies.length).toBe(8);
    expect(kb.caseStudies.map((c) => c.id).sort()).toEqual([
      "agent-workforce",
      "content-pipeline",
      "mcp-toolkit",
      "meta-portfolio",
      "motionlab",
      "petit-francais",
      "skills-library",
      "trading-fleet",
    ]);
  });

  it("each case study has frontmatter fields populated", () => {
    const kb = loadKnowledgeBase();
    for (const cs of kb.caseStudies) {
      expect(cs.id).toBeTruthy();
      expect(cs.title).toBeTruthy();
      expect(cs.hook).toBeTruthy();
      expect(Array.isArray(cs.domains)).toBe(true);
      expect(cs.domains.length).toBeGreaterThan(0);
      expect(cs.body).toBeTruthy();
      expect(cs.body).toContain("##"); // body has section headings
    }
  });

  it("loads system prompt", () => {
    const kb = loadKnowledgeBase();
    expect(kb.systemPrompt).toContain("julienlerosty.ai chat agent");
    expect(kb.systemPrompt).toContain("MUST refuse");
  });

  it("loads skills.json with 13 ranked skills", () => {
    const kb = loadKnowledgeBase();
    expect(kb.skills.skills.length).toBe(13);
    const ranks = kb.skills.skills.map((s) => s.rank);
    expect(ranks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    for (const s of kb.skills.skills) {
      expect(s.name).toBeTruthy();
      expect(s.evidence).toBeTruthy();
    }
  });

  it("loads live-stats with all required fields", () => {
    const kb = loadKnowledgeBase();
    const stats = kb.liveStats.stats as Record<string, number>;
    expect(stats.agentsActive).toBeGreaterThan(0);
    expect(stats.skillsCount).toBeGreaterThan(0);
    expect(typeof stats.tradingBotUptimePct).toBe("number");
  });
});
