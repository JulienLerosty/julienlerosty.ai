---
id: agent-workforce
title: 22-Agent Self-Routing Workforce
hook: Building an org chart for an LLM.
domains: [agents, orchestration, claude]
---

# 22-Agent Self-Routing Workforce

## Hook
A single chat thread is the wrong abstraction for a knowledge worker. I built a custom team of 22 specialized agents that route work to themselves based on the request, with a neural layer that learns from outcomes.

## Problem
Generic LLM chat treats every request the same. But "deploy this to Vercel," "review my resume," "audit my SOX workpapers," and "scan for VCP setups" need wildly different context, tools, and tone. Routing manually breaks the flow.

## Architecture (shape)
- A coordinator agent that parses every prompt and dispatches to one of 22 specialized agents
- Domain agents: trading-ops, ios-dev-hub, frontend-engineer, qa-agent, devops-infra, security-ops, ai-ml-engineer, automation-hub, backend-engineer, prompt-engineer, ux-designer, sox-compliance, and more
- A neural routing layer trained on past dispatches to predict optimal agent + escalation tier
- An anomaly detector that flags when an agent's performance degrades
- A RAG router that picks one of three retrieval strategies (similarity, graph, hierarchical) per query
- A skill library with progressive disclosure (89 always-loaded + 21K available on demand)

## Outcomes
- 1,400+ marketplace skills + 22 custom agents + 135 subagents — all reachable through one entry point
- Routing accuracy on test queries: 90%+
- Context bloat reduced significantly via progressive disclosure
- Self-improvement loop: feedback from outcomes retrains the routing model

## Lessons
1. **Specialization beats generalization at the agent level.** Same trick that works for humans.
2. **Routing is a learned function, not a giant if/else.** The neural layer earns its keep.
3. **Most "AI agent" frameworks bloat context immediately.** Progressive disclosure is the actual unlock.
4. **A coordinator that intercepts every prompt is the right control point** for memory, telemetry, and policy enforcement.
