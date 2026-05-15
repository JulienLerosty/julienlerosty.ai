import { loadKnowledgeBase } from "@/lib/kb-loader";
import { CaseStudyCard } from "./CaseStudyCard";

export function CaseStudyGrid() {
  const { caseStudies } = loadKnowledgeBase();
  return (
    <section className="max-w-5xl mx-auto mt-24 md:mt-32">
      <div className="text-xs text-fg-muted mb-4 terminal-prompt">work</div>
      <h2 className="text-2xl font-bold mb-6">Case studies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {caseStudies.map((cs, i) => (
          <CaseStudyCard key={cs.id} cs={cs} featured={i < 2} />
        ))}
      </div>
    </section>
  );
}
