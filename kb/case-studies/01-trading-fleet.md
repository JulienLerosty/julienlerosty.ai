---
id: trading-fleet
title: Multi-Bot Options Trading Fleet
hook: An AI engineer's first deployment is to their own brokerage account.
domains: [agents, infra, automation]
---

# Multi-Bot Options Trading Fleet

## Hook
The most honest test of a system is putting it in front of real consequences. I built a multi-bot options trading system, deployed it to a remote VPS, and let it trade my own capital. It's been running continuously for over a year.

## Problem
Markets move faster than discretionary attention. To run momentum-based options strategies (pullbacks, breakouts, regime-aware entries), I needed an always-on system that could screen, qualify, enter, manage, and exit positions without me staring at a screen.

## Architecture (shape)
- A fleet of independent bots, each implementing a single strategy
- A shared screener layer that produces daily watchlists
- A regime filter that gates all entries based on broad-market state
- A cross-bot position cap that prevents over-concentration
- An auto-scaling layer that adjusts position sizing based on account state
- A live web dashboard for fleet status
- Systemd services with self-healing and orphan-process detection
- A strict "decommission protocol" because killing a bot turns out to be harder than starting one

Implementation details (data sourcing, execution logic, balance management, specific thresholds) are intentionally not published — the edge is in the recipe, not the architecture.

## Outcomes
- Fleet uptime: >99% over the past year
- Successful regime transitions: 3 (bull → caution → bull)
- Bots decommissioned safely: 8 (and the protocol that made it boring)
- Lines of YAML, never of regret

## Lessons
1. **A `systemctl stop` doesn't always stop a Python process.** Orphan-process detectors are not optional in a fleet.
2. **Auto-scaling beats manual tuning.** Sizing relative to account state self-corrects in drawdowns.
3. **The dashboard pays for itself in incidents.** When you're debugging at 6 AM, you'll wish it existed.
4. **Most bots fail by being too clever.** Simple filters chained in sequence > one optimized model.
