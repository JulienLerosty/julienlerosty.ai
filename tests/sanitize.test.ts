import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from "fs";
import { randomUUID } from "crypto";

function withFixture(content: string, fn: (path: string) => void) {
  if (!existsSync("kb")) mkdirSync("kb");
  const path = `kb/__test_${randomUUID()}.md`;
  writeFileSync(path, content);
  try {
    fn(path);
  } finally {
    try { unlinkSync(path); } catch {}
  }
}

describe("denylist scanner", () => {
  it("blocks tastytrade account number", () => {
    withFixture("Account 5WU36040 here", () => {
      expect(() => execSync("npx tsx scripts/denylist-check.ts", { stdio: "pipe" })).toThrow();
    });
  });

  it("blocks VPS IP", () => {
    withFixture("Server: 178.156.231.86", () => {
      expect(() => execSync("npx tsx scripts/denylist-check.ts", { stdio: "pipe" })).toThrow();
    });
  });

  it("passes clean files", () => {
    withFixture("A multi-bot fleet on a remote VPS", () => {
      expect(() => execSync("npx tsx scripts/denylist-check.ts", { stdio: "pipe" })).not.toThrow();
    });
  });

  it("blocks Anthropic key", () => {
    withFixture("key: sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", () => {
      expect(() => execSync("npx tsx scripts/denylist-check.ts", { stdio: "pipe" })).toThrow();
    });
  });

  it("blocks Apple reference", () => {
    withFixture("I work at Apple in Cupertino", () => {
      expect(() => execSync("npx tsx scripts/denylist-check.ts", { stdio: "pipe" })).toThrow();
    });
  });

  it("blocks server path", () => {
    withFixture("/root/vcp-scanner is here", () => {
      expect(() => execSync("npx tsx scripts/denylist-check.ts", { stdio: "pipe" })).toThrow();
    });
  });

  it("blocks credential value (40-hex secret)", () => {
    withFixture("client_secret: deadbeefcafebabe0123456789abcdef01234567", () => {
      expect(() => execSync("npx tsx scripts/denylist-check.ts", { stdio: "pipe" })).toThrow();
    });
  });
});
