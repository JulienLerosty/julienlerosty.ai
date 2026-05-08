import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const DENYLIST: { pattern: RegExp; label: string }[] = [
  { pattern: /\b5WU\d{5}\b/i, label: "tastytrade account number" },
  { pattern: /\b178\.156\.231\.86\b/, label: "VPS IP" },
  // Anthropic API keys: sk-ant-{api,admin}NN-<base62 token, 40+ chars> — see anthropic.com docs
  { pattern: /\bsk-ant-(api|admin)\d{2}-[\w-]{40,}/i, label: "Anthropic key" },
  // "apple" is denied because Julien's current employer is Apple and any reference
  // in public-facing files could violate his contract / IP obligations. Case-insensitive.
  { pattern: /\bapple\b/i, label: "employer reference (case-by-case review)" },
  { pattern: /\/root\/vcp-scanner\b/, label: "production server path" },
  // Catch the literal Tastytrade credential variable name appearing anywhere — name exposure
  // is itself a signal, even when the value is a placeholder.
  { pattern: /tastytrade.*client[_-]?secret/i, label: "Tastytrade credential name exposure" },
  { pattern: /(client[_-]?secret|api[_-]?key|access[_-]?token|auth[_-]?token|bearer[_-]?token)\s*[:=]\s*["']?[a-f0-9]{40}["']?/i, label: "credential value (40-hex secret)" },
];

const SCAN_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".md", ".mdx", ".json", ".yml", ".yaml"];
const SKIP_DIRS = new Set(["node_modules", ".next", ".vercel", ".git", "out", "specs", "plans", "tests", "social"]);
// tests/ intentionally contains violation strings as test fixtures — exclude from production scan
// scripts/ infrastructure files that intentionally embed denylist patterns as regex literals or docs
// social/ and PLAYBOOK.md are gitignored local-only files; their meta-references are not leaks
const SKIP_PATHS = new Set([
  "scripts/denylist-check.ts",
  "scripts/weekly-update.ts",
  "PLAYBOOK.md",
]);

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const rel = relative(root, full);
    if (SKIP_PATHS.has(rel)) continue;
    const s = statSync(full);
    if (s.isDirectory()) yield* walk(full);
    else if (SCAN_EXTENSIONS.some((ext) => full.endsWith(ext))) yield full;
  }
}

const root = process.cwd();
const violations: string[] = [];

for (const file of walk(root)) {
  const content = readFileSync(file, "utf8");
  for (const { pattern, label } of DENYLIST) {
    const match = content.match(pattern);
    if (match) {
      violations.push(`${relative(root, file)}: ${label} — "${match[0]}"`);
    }
  }
}

if (violations.length) {
  console.error("❌ Denylist violations:\n" + violations.join("\n"));
  process.exit(1);
}
console.log("✅ Denylist scan clean");
