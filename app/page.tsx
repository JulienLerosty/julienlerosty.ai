import Image from "next/image";
import { ChatHero } from "@/components/ChatHero";
import { CaseStudyGrid } from "@/components/CaseStudyGrid";
import { SkillsConstellation } from "@/components/SkillsConstellation";
import { LiveStatsStrip } from "@/components/LiveStatsStrip";
import { EmailCapture } from "@/components/EmailCapture";
import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";

export default function Home() {
  return (
    <>
      <TopNav />
      <main className="min-h-screen p-4 md:p-8">
        <header className="max-w-3xl mx-auto mb-12 mt-8">
          <Image
            src="/avatar.png"
            alt="Julien Lerosty"
            width={72}
            height={72}
            className="rounded-full ring-1 ring-glass-border mb-4"
            priority
          />
          <div className="text-xs text-fg-muted mb-2 terminal-prompt">julien.lerosty // ai engineer</div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Wireless engineer building <span className="text-accent-green">production AI agents</span>.
          </h1>
          <p className="text-fg-muted mt-3 max-w-xl">
            The portfolio is the proof. Ask the agent below — it knows my work.
          </p>
        </header>

        <div id="chat">
          <ChatHero />
        </div>
        <LiveStatsStrip />
        <CaseStudyGrid />
        <SkillsConstellation />
        <EmailCapture />
        <Footer />
      </main>
    </>
  );
}
