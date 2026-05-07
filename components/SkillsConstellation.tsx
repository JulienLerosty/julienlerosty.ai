import { loadKnowledgeBase } from "@/lib/kb-loader";
import { Glass } from "@/components/ui/Glass";

export function SkillsConstellation() {
  const { skills } = loadKnowledgeBase();
  return (
    <section className="max-w-5xl mx-auto mt-16">
      <div className="text-xs text-fg-muted mb-4 terminal-prompt">stack</div>
      <h2 className="text-2xl font-bold mb-6">Top AI engineering skills</h2>
      <Glass className="p-6">
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 list-none">
          {skills.skills.map((s) => (
            <li key={s.rank} className="flex gap-3 items-start">
              <span className="text-accent-green font-bold text-sm w-6 flex-shrink-0">
                {String(s.rank).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{s.name}</div>
                <div className="text-xs text-fg-muted mt-0.5">{s.evidence}</div>
                {s.domains?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {s.domains.slice(0, 3).map((d) => (
                      <span
                        key={d}
                        className="text-[10px] uppercase tracking-wider text-accent-cyan/70"
                      >
                        #{d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Glass>
    </section>
  );
}
