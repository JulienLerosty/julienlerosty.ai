---
id: content-pipeline
title: GitHub Trend → Social — Automated Content Pipeline
hook: Tracking what the open-source world is paying attention to, then turning it into content while I sleep.
domains: [automation, llm, content]
---

# GitHub Trend → Social — Automated Content Pipeline

## Hook
Every week, certain GitHub repos break out — not because someone wrote a blog post, but because engineers started starring them at an unusual rate. I built a pipeline that detects that signal, hands it to an LLM with a brand-consistent voice guide, and ships a ready-to-publish Reel by the time I wake up.

## Problem
Open-source discovery is real-time but content creation isn't. By the time a human spots a rising repo, writes a script, records, edits, and captions a video, the moment is already ambient. The only way to be first and consistent is to automate the whole chain — not just the data fetch, but the creative work too.

## Architecture (shape)
- **Python fetch layer**: queries the GitHub API for repos above a star threshold, snapshots results to JSON, and diffs week-over-week to compute genuine growth — not just current popularity
- **LLM generation layer**: feeds each rising repo through Claude with a brand guide as system context, producing a Reels script in markdown and a weekly summary — the guide keeps tone consistent run-to-run without manual editing
- **Video generation layer**: programmatic overlay pipeline (`generate-social-video.ts`, `generate_videos.py`) attaches synced captions to rendered frames; the brand outro is injected at the clip level, so updating the brand means one config change, not a re-render queue
- **Scheduler**: `run_weekly.py` + cron orchestrates fetch → generate → render in sequence every Friday evening, logging each stage to `logs/weekly_run.log` with 3-month retention
- **Outputs**: Reels scripts in `data/reels_scripts/`, a `weekly_summary.md`, and render-ready video files in `data/videos_final/`

## Outcomes
- End-to-end latency from Friday 6 PM cron to ready-to-publish video: measured in minutes, not hours
- LLM-generated scripts that stay on-brand without any per-run prompting — the brand guide does the work once
- Weekly run log is the paper trail; every stage pass/fail is on disk before the next run starts
- The `star_baseline.json` snapshot means the pipeline's "what's rising" sense improves automatically as baselines compound

## Lessons
1. **A diff against a baseline beats a "trending" RSS feed.** Trending lists reflect current popularity; week-over-week delta reveals *momentum* — repos that are actually accelerating, not just big.
2. **A brand guide as system context pays compound interest.** Every LLM call is shaped by the same voice constraints, so the 50th script sounds as deliberate as the first. Without it, you're re-prompting forever.
3. **Programmatic video > template video.** When the brand changes, the overlay config changes once and the next run reflects it everywhere. Template-driven workflows mean reopening editors.
4. **Optimize for the right viewer, not total impressions.** One engineer who DMed because the repo write-up was technically precise is worth more than a thousand passive scrollers. The brand guide is calibrated for that outcome.
