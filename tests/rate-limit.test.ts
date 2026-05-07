import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("rate-limit", () => {
  // Note: BUCKETS is module-level state. Use unique IPs per test to avoid bleed.
  it("allows first request", () => {
    const r = checkRateLimit("test-1.1.1.1");
    expect(r.ok).toBe(true);
    expect(r.remaining).toBe(9);
  });

  it("counts up to LIMIT", () => {
    for (let i = 0; i < 10; i++) {
      const r = checkRateLimit("test-2.2.2.2");
      expect(r.ok).toBe(true);
    }
    const blocked = checkRateLimit("test-2.2.2.2");
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("isolates per-IP", () => {
    // Saturate one IP
    for (let i = 0; i < 10; i++) checkRateLimit("test-3.3.3.3");
    const blockedA = checkRateLimit("test-3.3.3.3");
    expect(blockedA.ok).toBe(false);
    // Different IP still works
    const allowedB = checkRateLimit("test-4.4.4.4");
    expect(allowedB.ok).toBe(true);
  });
});
