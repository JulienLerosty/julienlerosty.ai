import { loadKnowledgeBase } from "@/lib/kb-loader";
import { Glass } from "@/components/ui/Glass";

export function LiveStatsStrip() {
  const { liveStats } = loadKnowledgeBase();
  const stats = liveStats.stats;
  const lastUpdated = String(liveStats.lastUpdated).slice(0, 10);

  const items: { label: string; value: string | number }[] = [
    { label: "agents", value: stats.agentsActive },
    { label: "skills", value: stats.skillsCount },
    { label: "bot uptime", value: `${stats.tradingBotUptimePct}%` },
    { label: "shipped this wk", value: stats.weeklyChangesShipped },
  ];

  return (
    <section className="max-w-5xl mx-auto mt-24 md:mt-32">
      <div className="text-xs text-fg-muted mb-4 terminal-prompt">live (auto-updated weekly)</div>
      <Glass className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.label}>
            <div className="text-3xl md:text-4xl font-bold text-accent-green">{it.value}</div>
            <div className="text-xs text-fg-muted mt-1 uppercase tracking-wider">{it.label}</div>
          </div>
        ))}
      </Glass>
      <div className="text-xs text-fg-subtle mt-2 text-right">last updated {lastUpdated}</div>
    </section>
  );
}
