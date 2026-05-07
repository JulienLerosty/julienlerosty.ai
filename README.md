# julienlerosty.ai

Agent-first AI Engineer portfolio. Built with Next.js 14, TypeScript, Tailwind CSS, and a Claude-powered chat hero.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Security

This repo is **public**. The following security controls are in place:

### Pre-commit hook

A pre-commit hook runs `npm run secscan` before every commit. It:
1. Runs `gitleaks` if installed (checks against `.gitleaks.toml`)
2. Runs the custom denylist scanner (`scripts/denylist-check.ts`)

**Required local setup:**
```bash
brew install gitleaks
```

The hook is automatically installed via the symlink at `.git/hooks/pre-commit → ../../scripts/pre-commit.sh`.

### Denylist scanner

`npm run denylist` — scans all source files for patterns that must never be committed:
- Tastytrade account numbers
- Known VPS IPs
- Anthropic API keys
- Server paths
- Employer name references (case-by-case review)

### CI (GitHub Actions)

`.github/workflows/security.yml` runs gitleaks + denylist on every push and PR. CI is strict — gitleaks must be installed and pass.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run unit tests (vitest) |
| `npm run denylist` | Run denylist scanner |
| `npm run secscan` | Run gitleaks + denylist |
