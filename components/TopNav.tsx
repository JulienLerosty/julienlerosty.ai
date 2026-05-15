import Link from "next/link";
import Image from "next/image";

export function TopNav() {
  return (
    <nav className="border-b border-glass-borderSubtle backdrop-blur-glass bg-bg-base/60 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 md:px-8 h-11 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/avatar.png"
            alt="Julien Lerosty"
            width={28}
            height={28}
            className="rounded-full ring-1 ring-glass-border md:w-9 md:h-9"
            priority
          />
          <span className="text-xs text-fg-muted terminal-prompt font-mono">
            julien.lerosty // ai engineer
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-fg-muted">
          <Link href="/work" className="hover:text-accent-green transition-colors">
            work
          </Link>
          <Link href="/#chat" className="hover:text-accent-green transition-colors">
            agent
          </Link>
          <a
            href="/resume/julien-lerosty-ai-engineer.pdf"
            className="hover:text-accent-green transition-colors"
          >
            resume
          </a>
        </div>
      </div>
    </nav>
  );
}
