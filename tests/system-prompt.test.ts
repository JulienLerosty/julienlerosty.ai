import { describe, it, expect } from "vitest";
import { loadKnowledgeBase } from "@/lib/kb-loader";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { containsDenied } from "@/lib/sanitize";

describe("system prompt", () => {
  it("contains all case study titles", () => {
    const prompt = buildSystemPrompt(loadKnowledgeBase());
    expect(prompt).toContain("Multi-Bot Options Trading Fleet");
    expect(prompt).toContain("22-Agent Self-Routing Workforce");
    expect(prompt).toContain("Skills Library Architecture");
    expect(prompt).toContain("MCP Server Toolkit");
    expect(prompt).toContain("This Page Wrote Itself Last Monday");
  });

  it("contains skills block", () => {
    const prompt = buildSystemPrompt(loadKnowledgeBase());
    expect(prompt).toContain("Multi-Agent Orchestration");
    expect(prompt).toContain("MCP Server Development");
  });

  it("contains live stats block", () => {
    const prompt = buildSystemPrompt(loadKnowledgeBase());
    expect(prompt).toContain("agentsActive");
    expect(prompt).toContain("tradingBotUptimePct");
  });

  it("contains no denied content (red-team check)", () => {
    const prompt = buildSystemPrompt(loadKnowledgeBase());
    expect(containsDenied(prompt)).toBe(false);
  });
});
