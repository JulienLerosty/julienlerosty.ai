import { describe, it, expect } from "vitest";
import { isAllowedPath, computeStats, isCleanForPublish } from "@/scripts/weekly-update";

const HOME = process.env.HOME ?? "";

describe("weekly-update / isAllowedPath", () => {
  it("denies employer-marked paths", () => {
    expect(isAllowedPath(`${HOME}/Apple/internal`)).toBe(false);
    expect(isAllowedPath(`${HOME}/Desktop/AppleNotes`)).toBe(false);
  });
  it("denies credential paths", () => {
    expect(isAllowedPath(`${HOME}/.ssh/id_rsa`)).toBe(false);
    expect(isAllowedPath(`${HOME}/something/credentials.txt`)).toBe(false);
    expect(isAllowedPath(`${HOME}/foo/.env.local`)).toBe(false);
  });
  it("denies private memory", () => {
    expect(
      isAllowedPath(`${HOME}/.claude/projects/-Users-julienlerosty/memory/foo.md`)
    ).toBe(false);
  });
  it("denies portfolio internal docs", () => {
    expect(isAllowedPath(`${HOME}/Desktop/projects/portfolio/social/01.md`)).toBe(false);
    expect(isAllowedPath(`${HOME}/Desktop/projects/portfolio/PLAYBOOK.md`)).toBe(false);
    expect(isAllowedPath(`${HOME}/Desktop/projects/portfolio/specs/x.md`)).toBe(false);
    expect(isAllowedPath(`${HOME}/Desktop/projects/portfolio/plans/x.md`)).toBe(false);
  });
  it("denies vcp-scanner-trading code", () => {
    expect(
      isAllowedPath(`${HOME}/Desktop/projects/vcp-scanner-trading/momentum_bot.py`)
    ).toBe(false);
    expect(
      isAllowedPath(`${HOME}/Desktop/projects/vcp-scanner-trading/data/positions.json`)
    ).toBe(false);
  });
  it("allows project portfolio scan paths", () => {
    expect(isAllowedPath(`${HOME}/Desktop/projects/portfolio`)).toBe(true);
    expect(isAllowedPath(`${HOME}/.claude/skills/some-skill`)).toBe(true);
    expect(isAllowedPath(`${HOME}/.agents/skills/agent-x`)).toBe(true);
  });
});

describe("weekly-update / computeStats", () => {
  it("counts deltas across both pools", () => {
    const s = computeStats({ agents: 23, skills: 90, prevSnapshot: { agents: 22, skills: 89 } });
    expect(s.agentsActive).toBe(23);
    expect(s.skillsCount).toBe(90);
    expect(s.weeklyChangesShipped).toBe(2);
  });
  it("clamps negative deltas to zero", () => {
    const s = computeStats({ agents: 21, skills: 88, prevSnapshot: { agents: 22, skills: 89 } });
    expect(s.weeklyChangesShipped).toBe(0);
  });
  it("uses provided uptime values when given", () => {
    const s = computeStats({
      agents: 22,
      skills: 89,
      prevSnapshot: { agents: 22, skills: 89 },
      uptimePct: 99.5,
      uptimeDays: 400,
    });
    expect(s.tradingBotUptimePct).toBe(99.5);
    expect(s.tradingBotUptimeDays).toBe(400);
  });
});

describe("weekly-update / isCleanForPublish", () => {
  it("rejects Apple references", () => {
    expect(isCleanForPublish("Apple is great")).toBe(false);
  });
  it("rejects account number", () => {
    expect(isCleanForPublish("account 5WU36040")).toBe(false);
  });
  it("rejects VPS IP", () => {
    expect(isCleanForPublish("server 178.156.231.86")).toBe(false);
  });
  it("accepts clean prose", () => {
    expect(isCleanForPublish("a remote VPS with the team")).toBe(true);
  });
});
