import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from "fs";
import { randomUUID } from "crypto";
import { sanitize, containsDenied } from "@/lib/sanitize";

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

  it("blocks Tastytrade credential name exposure", () => {
    withFixture("TASTYTRADE_CLIENT_SECRET=placeholder", () => {
      expect(() => execSync("npx tsx scripts/denylist-check.ts", { stdio: "pipe" })).toThrow();
    });
  });
});

describe("sanitize (runtime)", () => {
  it("redacts account numbers", () => {
    expect(sanitize("Account 5WU36040 is open")).toBe("Account [redacted-account] is open");
  });
  it("redacts VPS IP", () => {
    expect(sanitize("Server: 178.156.231.86 is up")).toBe("Server: [redacted-host] is up");
  });
  it("redacts Apple mentions case-insensitively", () => {
    expect(sanitize("I work at Apple in Cupertino")).toBe("I work at [employer] in Cupertino");
    expect(sanitize("apple internal team")).toBe("[employer] internal team");
  });
  it("redacts Anthropic API keys", () => {
    expect(sanitize("key: sk-ant-api03-abcdefghijklmnopqrstuvwxyz0123456789ABCD")).toContain("[redacted-key]");
  });
  it("redacts production server path", () => {
    expect(sanitize("logs at /root/vcp-scanner/logs/")).toContain("[redacted-path]");
  });
  it("flags denied content via containsDenied", () => {
    expect(containsDenied("server 178.156.231.86")).toBe(true);
    expect(containsDenied("Apple is great")).toBe(true);
    expect(containsDenied("a remote VPS")).toBe(false);
  });
  it("passes clean content unchanged", () => {
    const clean = "A multi-bot fleet on a remote VPS";
    expect(sanitize(clean)).toBe(clean);
  });
});
