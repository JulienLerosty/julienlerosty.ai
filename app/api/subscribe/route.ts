import { NextRequest } from "next/server";
import { writeFileSync, readFileSync, existsSync } from "fs";

export const runtime = "nodejs";

const STORE = "/tmp/portfolio-subscribers.jsonl";

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }
  const entry = JSON.stringify({ email, ts: new Date().toISOString() }) + "\n";
  try {
    // Append to ephemeral file in /tmp (Vercel function). For real persistence, wire to ConvertKit/Beehiiv later.
    const existing = existsSync(STORE) ? readFileSync(STORE, "utf8") : "";
    writeFileSync(STORE, existing + entry);
  } catch {
    // /tmp is per-instance; lossy is fine for v1
  }
  return Response.json({ ok: true });
}
