---
id: mcp-toolkit
title: MCP Server Toolkit
hook: I gave Claude a typed contract with every app I use daily.
domains: [mcp, integrations, claude]
---

# MCP Server Toolkit

## Hook
Most "AI integrations" are screenshots and prayer. The Model Context Protocol gave me a way to hold a typed contract with every app I use daily — Keynote, TradingView, custom internal tools — so Claude can use them like any other tool.

## Problem
Most "AI integrations" are brittle screenshots-and-prayer. MCPs let an agent hold a typed contract with an external system, with capability discovery, structured tool calls, and consistent error semantics.

## Architecture (shape)
- An MCP server per integration target (one for Keynote, one for TradingView data, etc.)
- Each server exposes a small, focused tool surface — capability discovery, structured I/O
- Servers are invoked from Claude Code or any MCP-aware client
- Tools are versioned and documented; every tool call is auditable

## Outcomes
- Native Keynote presentations generated from a single Claude prompt
- Live TradingView screener data piped directly into trading-bot decisions
- Consistent integration pattern reusable across new targets

## Lessons
1. **Typed contracts beat scrape-and-pray.** The discipline pays off the second time you change something.
2. **One MCP per target.** Don't multiplex — boundaries are cheap.
3. **The tool surface should be small.** A few well-named tools > a giant one with flag arguments.
