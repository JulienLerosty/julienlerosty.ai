"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

export function TopNav() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest < 100) setHidden(false);
    else if (latest > previous + 4) setHidden(true);
    else if (latest < previous - 4) setHidden(false);
  });

  return (
    <motion.nav
      initial={{ opacity: 1, y: 0 }}
      animate={{
        opacity: reduce ? 1 : hidden ? 0 : 1,
        y: reduce ? 0 : hidden ? -24 : 0,
      }}
      transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 inset-x-0 mx-auto max-w-fit z-50 px-4 md:px-5 py-2 rounded-full bg-glass-fill backdrop-blur-glass border border-glass-border"
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px -12px rgba(0,0,0,0.6), 0 0 40px -20px rgba(0,255,136,0.15)",
      }}
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-4 md:gap-5">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/avatar.png"
            alt="Julien Lerosty"
            width={28}
            height={28}
            className="rounded-full ring-1 ring-glass-border transition-transform group-hover:scale-[1.04]"
            priority
          />
          <span className="hidden md:inline text-xs text-fg-muted terminal-prompt font-mono">
            julien.lerosty // ai engineer
          </span>
        </Link>
        <div className="h-4 w-px bg-glass-border" aria-hidden />
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
    </motion.nav>
  );
}
