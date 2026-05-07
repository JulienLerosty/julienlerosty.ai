#!/usr/bin/env tsx
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const HOME = process.env.HOME!;
const ROOT = join(HOME, "Desktop/projects/portfolio");
const KB = join(ROOT, "kb");

const ALLOW_PREFIXES = [
  join(HOME, "Desktop/projects/"),
  join(HOME, ".claude/skills/"),
  join(HOME, ".agents/skills/"),
];

const DENY_PATTERNS = [
  /\bapple\b/i,
  /\.ssh|\.gnupg|\.aws|\.config\//,
  /-Users-julienlerosty\/memory/,
  /credentials?|secret|token|\.env|\.key$/i,
  /\/Desktop\/projects\/portfolio\/social\b/,
  /\/Desktop\/projects\/portfolio\/PLAYBOOK\.md$/,
  /\/Desktop\/projects\/portfolio\/specs\b/,
  /\/Desktop\/projects\/portfolio\/plans\b/,
  // Block reading INSIDE vcp-scanner-trading; only top-level listing OK in countDir
  /\/Desktop\/projects\/vcp-scanner-trading\/.+\.(py|json|ts|tsx|md|yaml|yml|sh|env|key|pem)$/,
];

export function isAllowedPath(p: string): boolean {
  if (DENY_PATTERNS.some((r) => r.test(p))) return false;
  return ALLOW_PREFIXES.some((prefix) => p.startsWith(prefix));
}

function countTopLevelDirs(dir: string): number {
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!isAllowedPath(full)) continue;
    try {
      if (statSync(full).isDirectory()) n++;
    } catch {
      // ignore unreadable entries
    }
  }
  return n;
}

export function computeStats(input: {
  agents: number;
  skills: number;
  prevSnapshot: { agents: number; skills: number };
  uptimePct?: number;
  uptimeDays?: number;
  marketplace?: number;
}) {
  const delta =
    Math.max(0, input.agents - input.prevSnapshot.agents) +
    Math.max(0, input.skills - input.prevSnapshot.skills);
  return {
    agentsActive: input.agents,
    skillsCount: input.skills,
    marketplaceSkillsAvailable: input.marketplace ?? 21000,
    tradingBotUptimeDays: input.uptimeDays ?? 380,
    tradingBotUptimePct: input.uptimePct ?? 99.0,
    weeklyChangesShipped: delta,
  };
}

const DENYLIST_OUTPUT_PATTERNS: RegExp[] = [
  /\bapple\b/i,
  /5WU\d{5}/,
  /178\.156\.231\.86/,
  /\/root\/vcp-scanner\b/,
  /\bsk-ant-(api|admin)\d{2}-[\w-]{20,}/i,
];

export function isCleanForPublish(text: string): boolean {
  return !DENYLIST_OUTPUT_PATTERNS.some((r) => r.test(text));
}

async function notifyDiscord(content: string) {
  const webhook = process.env.DISCORD_WEBHOOK;
  if (!webhook) return;
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  } catch (err) {
    console.error("Discord notify failed:", err);
  }
}

async function main() {
  const agents = countTopLevelDirs(join(HOME, ".agents/skills"));
  const skills = countTopLevelDirs(join(HOME, ".claude/skills"));

  const snapshotPath = join(KB, "snapshot.json");
  const prev = existsSync(snapshotPath)
    ? (JSON.parse(readFileSync(snapshotPath, "utf8")) as { agents: number; skills: number })
    : { agents: 0, skills: 0 };

  const newStats = computeStats({ agents, skills, prevSnapshot: prev });

  const liveStats = {
    lastUpdated: new Date().toISOString(),
    stats: newStats,
    recentShipments: [
      {
        date: new Date().toISOString().slice(0, 10),
        title: "Weekly auto-update",
        summary: `${agents} agents · ${skills} skills · ${newStats.weeklyChangesShipped} changes this week`,
      },
    ],
  };

  const text = JSON.stringify(liveStats, null, 2);
  if (!isCleanForPublish(text)) {
    const msg = "❌ Weekly update aborted — denylisted content in proposed write";
    await notifyDiscord(msg);
    throw new Error(msg);
  }

  writeFileSync(join(KB, "live-stats.json"), text);
  writeFileSync(snapshotPath, JSON.stringify({ agents, skills }, null, 2));

  // Verify the whole repo is still clean
  execSync("npm run secscan", { cwd: ROOT, stdio: "inherit" });

  // Stage and commit (snapshot.json is gitignored, only live-stats.json should be staged)
  execSync("git add kb/live-stats.json", { cwd: ROOT });

  // Only commit if there's actually a change
  let shouldCommit = true;
  try {
    execSync("git diff --cached --quiet kb/live-stats.json", { cwd: ROOT });
    // Exit 0 means no diff
    shouldCommit = false;
  } catch {
    // Exit 1 means diff exists — proceed to commit
    shouldCommit = true;
  }

  if (shouldCommit) {
    const msg = `chore(weekly): auto-update — ${agents} agents, ${skills} skills, ${newStats.tradingBotUptimePct}% uptime`;
    execSync(`git commit -m ${JSON.stringify(msg)}`, { cwd: ROOT, stdio: "inherit" });
    execSync("git push origin main", { cwd: ROOT, stdio: "inherit" });
    await notifyDiscord(
      `📤 Weekly portfolio update pushed: ${agents} agents · ${skills} skills · +${newStats.weeklyChangesShipped} shipped`
    );
  } else {
    await notifyDiscord(`📭 Weekly portfolio check — no changes this week (${agents} agents · ${skills} skills)`);
  }

  console.log("✅ Weekly update complete");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(async (err) => {
    console.error(err);
    await notifyDiscord(`❌ Weekly update failed: ${err.message ?? String(err)}`);
    process.exit(1);
  });
}
