import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from "fs";

describe("denylist scanner", () => {
  it("blocks tastytrade account number", () => {
    if (!existsSync("kb")) mkdirSync("kb");
    writeFileSync("kb/__test_violation.md", "Account 5WU36040 here");
    expect(() => execSync("npx tsx scripts/denylist-check.ts", { stdio: "pipe" })).toThrow();
    unlinkSync("kb/__test_violation.md");
  });

  it("blocks VPS IP", () => {
    if (!existsSync("kb")) mkdirSync("kb");
    writeFileSync("kb/__test_violation.md", "Server: 178.156.231.86");
    expect(() => execSync("npx tsx scripts/denylist-check.ts", { stdio: "pipe" })).toThrow();
    unlinkSync("kb/__test_violation.md");
  });

  it("passes clean files", () => {
    if (!existsSync("kb")) mkdirSync("kb");
    writeFileSync("kb/__test_clean.md", "A multi-bot fleet on a remote VPS");
    expect(() => execSync("npx tsx scripts/denylist-check.ts", { stdio: "pipe" })).not.toThrow();
    unlinkSync("kb/__test_clean.md");
  });
});
