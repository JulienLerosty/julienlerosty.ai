type Bucket = { count: number; resetAt: number };
const BUCKETS = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const LIMIT = 10;

export function checkRateLimit(ip: string): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const b = BUCKETS.get(ip);
  if (!b || b.resetAt < now) {
    const fresh = { count: 1, resetAt: now + WINDOW_MS };
    BUCKETS.set(ip, fresh);
    return { ok: true, remaining: LIMIT - 1, resetAt: fresh.resetAt };
  }
  if (b.count >= LIMIT) return { ok: false, remaining: 0, resetAt: b.resetAt };
  b.count++;
  return { ok: true, remaining: LIMIT - b.count, resetAt: b.resetAt };
}
