---
id: skills-library
title: Skills Library Architecture
hook: How to build a skill ecosystem that doesn't bloat the context window.
domains: [claude, infra, design]
---

# Skills Library Architecture

## Hook
Most "skill" systems are just prompt-stuffed grab bags. I designed a tiered library where the right skill loads at the right time and stays out of the way otherwise.

## Problem
Once you have hundreds of skills, you've got a different problem: every skill loaded is context burned. Generic libraries blow the window before the model has read your actual question.

## Architecture (shape)
- **Tier 1** — 89 essential skills, always loaded at startup
- **Tier 2** — 21K+ available on demand via `ToolSearch`
- **Progressive disclosure** — skill frontmatter ~100 tokens, body kept under 500 lines, heavy content extracted to `references/`
- **Auto-install pipeline** — gap detected → search official sources → install with compliance checks
- **Audit pipeline** — duplicate detector (>70% similarity), orphan finder, context-bloat scanner
- **Custom skill creator** — when nothing exists, generate one from a triggering pattern

## Outcomes
- Skill triggering accuracy: high (specific frontmatter beats generic descriptions)
- Context overhead per session: down meaningfully
- Self-healing: stale or duplicate skills get flagged and culled automatically

## Lessons
1. **A small number of well-built skills with specific triggers beats a huge library.** Quality of frontmatter > quantity of skills.
2. **Progressive disclosure is the architecture pattern, not just a UX flourish.** Apply it to skills, agents, memory, everywhere.
3. **The skill manager is a skill.** Lifecycle (install, audit, dedupe, retire) deserves first-class tooling.
