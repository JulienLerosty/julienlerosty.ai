---
id: meta-portfolio
title: This Page Wrote Itself Last Monday
hook: The portfolio is the proof.
domains: [agents, design, claude]
---

# This Page Wrote Itself Last Monday

## Hook
You're reading a portfolio that updates itself. Every Monday morning, an agent walks my repos, diffs against last week's snapshot, regenerates this page's stats, and pushes a deploy.

## Problem
Static portfolios go stale. Manually-updated ones decay. A portfolio for an *AI engineer* should embody the craft, not just describe it.

## Architecture (shape)
- A scheduled remote agent runs every Monday 8 AM PT
- It walks an allowlisted set of paths (no employer references, no credentials, no servers)
- It diffs against a weekly snapshot to compute "what shipped this week"
- A sanitization filter strips anything denylisted before write
- Updated stats and any regenerated case studies → git commit + push
- Vercel auto-deploys
- Discord webhook fires the changelog

## Outcomes
- Portfolio is always current with zero manual effort
- The "last updated" timestamp is real, not a lie
- The same agent infrastructure that runs this page runs my trading bots

## Lessons
1. **Use the systems you talk about.** If you can't dogfood your own AI engineering claims, the case studies don't land.
2. **Scheduled agents need allowlists, not denylists alone.** Default-deny everything sensitive.
3. **The artifact and the production line are the same thing here.** That's a feature.
