"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { clsx } from "clsx";
import { Glass } from "@/components/ui/Glass";
import type { CaseStudy } from "@/lib/kb-loader";

export function CaseStudyCard({ cs, featured = false }: { cs: CaseStudy; featured?: boolean }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      {/* Double-bezel outer shell */}
      <div
        className={clsx(
          "bg-white/[0.025] p-1.5 rounded-[20px] ring-1 ring-white/5 cursor-pointer group",
          "transition-transform duration-200 ease-out hover:-translate-y-[2px]",
          featured && "md:col-span-2"
        )}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {/* Inner core — radius math: 20 - 1.5*4 = 14 */}
        <div className="bg-white/[0.04] rounded-[14px] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] group-hover:bg-white/[0.06] transition-colors duration-200 ease-out">
          <div className="flex flex-wrap gap-2 mb-2">
            {cs.domains.slice(0, 3).map((d) => (
              <span
                key={d}
                className="text-[10px] uppercase tracking-wider text-accent-green/70 bg-accent-green/5 px-2 py-0.5 rounded"
              >
                {d}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-bold mb-1 group-hover:text-accent-green transition-colors">
            {cs.title}
          </h3>
          <p className="text-sm text-fg-muted italic">{cs.hook}</p>
          <div className="mt-3 text-xs text-accent-cyan terminal-prompt">read</div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-bg-base/80 backdrop-blur p-4 md:p-12 overflow-y-auto"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={cs.title}
        >
          <Glass
            variant="strong"
            className="max-w-3xl mx-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              onClick={() => setOpen(false)}
              className="text-fg-muted hover:text-accent-green text-sm mb-4 terminal-prompt focus:outline-none focus:text-accent-green min-h-[44px] inline-flex items-center px-2 -ml-2"
              aria-label="close"
            >
              close
            </button>
            <article>
              <h2 className="text-2xl font-bold mb-1">{cs.title}</h2>
              <p className="text-accent-green italic mb-6">{cs.hook}</p>
              <div className="markdown-body">
                <ReactMarkdown>{cs.body}</ReactMarkdown>
              </div>
            </article>
          </Glass>
        </div>
      )}
    </>
  );
}
