import { KnowledgeBase } from "./kb-loader";

export function buildSystemPrompt(kb: KnowledgeBase): string {
  const caseStudiesBlock = kb.caseStudies
    .map((cs) => `\n## Case study: ${cs.title}\n_Hook: ${cs.hook}_\n\n${cs.body}`)
    .join("\n\n");

  const skillsBlock = kb.skills.skills
    .map((s) => `${s.rank}. **${s.name}** — ${s.evidence}`)
    .join("\n");

  return `${kb.systemPrompt}

## Knowledge base — case studies
${caseStudiesBlock}

## Knowledge base — top skills
${skillsBlock}

## Knowledge base — live stats (last updated ${kb.liveStats.lastUpdated})
${JSON.stringify(kb.liveStats.stats, null, 2)}
`.trim();
}
