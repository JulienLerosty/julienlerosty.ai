/*
 * /work — Julien's services page
 *
 * Cal.com handles:
 *   - Strategy Call:   julienlerosty/30min       ← UPDATE to your real Cal.com slug
 *   - Engineering Audit: julienlerosty/audit-call ← UPDATE to your real Cal.com slug
 *
 * Payment gating is configured on the Cal.com side (Stripe integration in your Cal.com dashboard).
 * No Stripe integration is required in this codebase.
 *
 * After setting up Cal.com:
 *   1. Update the two slug constants below (CAL_SLUG_STRATEGY, CAL_SLUG_AUDIT)
 *   2. Publish the event types and enable Stripe payment in Cal.com settings
 */

"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { Glass } from "@/components/ui/Glass";
import { Button } from "@/components/ui/Button";
import { EmailCapture } from "@/components/EmailCapture";
import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";

const CAL_SLUG_STRATEGY = "julienlerosty/30min";
const CAL_SLUG_AUDIT = "julienlerosty/audit-call";

function useCalEmbed() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "portfolio-work" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          dark: { "cal-brand": "#00ff88" },
          light: { "cal-brand": "#00ff88" },
        },
        hideEventTypeDetails: false,
      });
    })();
  }, []);
}

const packages = [
  {
    title: "1-hour Strategy Call",
    price: "$300",
    promise: "Tell me what you're building. I'll tell you what's wrong, what to skip, and what to ship first.",
    bullets: [
      "60 min Zoom",
      "Written follow-up doc within 48h",
      "Slack DM access for 2 weeks",
    ],
    ctaLabel: "Book a call",
    ctaType: "cal" as const,
    calSlug: CAL_SLUG_STRATEGY,
  },
  {
    title: "AI Engineering Audit",
    price: "$1,500",
    promise:
      "I'll audit your existing AI/agent system or your engineering team's AI workflow and write you a 1-week implementation roadmap.",
    bullets: [
      "Deep-dive (~4hr async + 1hr sync)",
      "Redacted architecture diagram of recommended changes",
      "90-min walkthrough of the roadmap",
    ],
    ctaLabel: "Book the audit",
    ctaType: "cal" as const,
    calSlug: CAL_SLUG_AUDIT,
  },
  {
    title: "AI for Hardware Engineers Cohort",
    price: "$1,800",
    badge: "Waitlist",
    promise:
      "4-week cohort. RF/wireless engineers learn to ship production agents. Real projects, weekly office hours, my full skills library shared.",
    bullets: [
      "4 weeks of structured projects, not slides",
      "Weekly office hours with live code review",
      "Full access to my skills library during the cohort",
    ],
    ctaLabel: "Join Waitlist",
    ctaType: "email" as const,
  },
] as const;

export default function WorkPage() {
  useCalEmbed();

  return (
    <>
      <TopNav />
      <main className="min-h-screen p-4 md:p-8">
      <header className="max-w-3xl mx-auto mb-12 mt-8">
        <div className="text-xs text-fg-muted mb-2 terminal-prompt">work with julien</div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Hardware engineer{" "}
          <span className="text-accent-green">× AI agents.</span>
        </h1>
        <p className="text-fg-muted mt-3 max-w-xl">
          I help RF/wireless/hardware engineers ship production AI systems that touch real
          consequences — not demos.
        </p>
      </header>

      <section className="max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Glass
              key={pkg.title}
              variant="strong"
              className="p-6 flex flex-col gap-4"
            >
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-bold text-fg">{pkg.title}</span>
                  {"badge" in pkg && pkg.badge && (
                    <span className="text-xs text-accent-cyan border border-accent-cyan/40 rounded px-1.5 py-0.5">
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-accent-green">{pkg.price}</div>
              </div>

              <p className="text-sm text-fg-muted leading-relaxed">{pkg.promise}</p>

              <ul className="space-y-1.5 flex-1">
                {pkg.bullets.map((b) => (
                  <li key={b} className="text-xs text-fg-muted flex gap-2">
                    <span className="text-accent-green shrink-0">–</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {pkg.ctaType === "cal" ? (
                <Button
                  data-cal-namespace="portfolio-work"
                  data-cal-link={pkg.calSlug}
                  data-cal-config='{"layout":"month_view"}'
                  className="w-full justify-center text-center"
                >
                  {pkg.ctaLabel}
                </Button>
              ) : (
                <EmailCaptureInline label={pkg.ctaLabel} />
              )}
            </Glass>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto mb-16">
        <div className="text-xs text-fg-muted mb-3 terminal-prompt">why work with me</div>
        <Glass className="p-6">
          <p className="text-sm text-fg-muted leading-relaxed">
            I&apos;ve shipped production AI systems that run on real money, real radio, and real
            deadlines — not conference demos. The case studies on this site are the evidence:{" "}
            <a href="/#work" className="text-accent-green hover:underline">
              a multi-bot options trading fleet
            </a>
            ,{" "}
            <a href="/#work" className="text-accent-green hover:underline">
              a 22-agent self-routing workforce
            </a>
            , and{" "}
            <a href="/#work" className="text-accent-green hover:underline">
              a skill library that progressively discloses 21K+ skills
            </a>
            . If you&apos;re a hardware or RF engineer who needs to ship an AI system — not evaluate
            one — that&apos;s the background I bring.
          </p>
        </Glass>
      </section>

      <EmailCapture />
      <Footer />
    </main>
    </>
  );
}

/* Inline waitlist email capture for the cohort card */
function EmailCaptureInline({ label }: { label: string }) {
  return (
    <a
      href="#newsletter"
      onClick={(e) => {
        e.preventDefault();
        // Scroll to the EmailCapture component at the bottom of the page
        document.querySelector("[data-newsletter]")?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <Button className="w-full justify-center text-center">{label}</Button>
    </a>
  );
}
