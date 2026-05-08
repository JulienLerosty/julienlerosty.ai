# julienlerosty.ai

The portfolio is the proof. An agent-first AI Engineer portfolio where the hero is a Claude-powered chat that knows my work — and where the page updates itself every Monday morning.

[live site →](https://julienlerosty.ai) (deploys after first push)

## What it is

An AI Engineer portfolio built around a single idea: instead of reading about my work, you talk to it. The chat hero is a streaming Claude Sonnet 4.6 agent grounded in a local knowledge base — 5 case studies covering trading automation, agent workforce design, skills libraries, MCP toolkits, and the portfolio itself. Ask it anything about the projects.

The site also updates itself. Every Monday a scheduled script walks the local project tree, diffs it against a cached snapshot, sanitizes the output through the same redactor that guards the live chat, and commits the result — so the knowledge base stays current without manual upkeep.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Anthropic Claude Sonnet 4.6 (streaming + prompt caching)
- `react-markdown` for knowledge-base rendering
- Vitest for unit tests
- Vercel for hosting

## Architecture

```
Browser
  └── Chat UI (React, streaming SSE)
        └── POST /api/chat
              ├── Rate limiter (per-IP, in-memory)
              ├── Claude Sonnet 4.6 (streaming, prompt cache)
              │     └── System prompt = kb/_system-prompt.md
              │                       + kb/case-studies/*.md
              │                       + kb/skills.json
              │                       + kb/live-stats.json
              └── Output sanitizer (redacts before each delta reaches browser)

Weekly agent (scripts/weekly-update.ts — runs every Monday 8 AM PT)
  └── Walks allowlisted local paths
        └── Diffs against kb/snapshot.json
              └── Sanitizes → commits → pushes → Discord notify
                    └── Vercel auto-deploys on git push
```

## How it stays secure

A public repo for an AI agent demands defense-in-depth. This repo runs:

- **gitleaks** scans on every push and pull request (CI workflow)
- **Custom denylist scanner** in pre-commit hook + CI (catches account numbers, infrastructure IPs, employer names, credential patterns)
- **Output sanitization** on the live chat agent (every Claude delta passes through a redactor before reaching the user)
- **Per-IP rate limiting** on the chat endpoint
- **System prompt refusal rules** that the agent observes for off-KB topics

If a regex slip lets something through, the next layer catches it.

## Local dev

```bash
# 1. Clone
git clone https://github.com/julienlerosty/julienlerosty.ai.git
cd julienlerosty.ai

# 2. Install
npm ci

# 3. Set your API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# 4. Run
npm run dev
# → http://localhost:3000

# 5. Tests
npm test

# 6. Security scan (requires: brew install gitleaks)
npm run secscan
```

## Weekly auto-update

`scripts/weekly-update.ts` runs on a cron every Monday at 8 AM PT. It diffs the local project tree against `kb/snapshot.json`, sanitizes new content through the same redactor used by the live chat, commits the updated knowledge base, and posts a Discord notification. The schedule is configured as a Claude Code trigger (see PLAYBOOK.md — local only).

## License

MIT
