import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const DENYLIST: { pattern: RegExp; label: string }[] = [
  { pattern: /\b5WU\d{5}\b/i, label: "tastytrade account number" },
  { pattern: /\b178\.156\.231\.86\b/, label: "VPS IP" },
  { pattern: /\bsk-ant-(api|admin)\d{2}-[\w-]{20,}/i, label: "Anthropic key" },
  { pattern: /\bapple\b/i, label: "employer reference (case-by-case review)" },
  { pattern: /\/root\/vcp-scanner\b/, label: "production server path" },
  { pattern: /tastytrade.*client[_-]secret/i, label: "Tastytrade secret name" },
];

const SCAN_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".md", ".mdx", ".json", ".yml", ".yaml"];
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "out", "specs", "plans", "tests"]);
// tests/ intentionally contains violation strings as test fixtures — exclude from production scan
// scripts/denylist-check.ts itself is excluded via SKIP_FILES
const SKIP_FILES = new Set(["denylist-check.ts"]);

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    if (SKIP_FILES.has(entry)) continue;
    const full = join(dir, entry);
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
