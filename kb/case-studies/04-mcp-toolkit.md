---
id: mcp-toolkit
title: MCP Server Toolkit
hook: MCPs are the new APIs.
domains: [mcp, integrations, claude]
---

# MCP Server Toolkit

## Hook
The Model Context Protocol turns native macOS apps and external services into first-class tools for an AI agent. I've built MCPs that wire Claude into Keynote, TradingView, and other surfaces I use daily.

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
