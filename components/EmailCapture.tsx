"use client";
import { useState, useEffect } from "react";
import { Glass } from "@/components/ui/Glass";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "julienlerosty_subscribed";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) {
      setAlreadySubscribed(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
        localStorage.setItem(STORAGE_KEY, "1");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (alreadySubscribed || status === "success") {
    return (
      <Glass className="p-6 max-w-3xl mx-auto w-full mt-24 md:mt-32 mb-16" data-newsletter>
        <div className="text-xs text-fg-muted terminal-prompt mb-1">newsletter</div>
        <div className="text-sm text-accent-green">
          subscribed — see you Monday
        </div>
      </Glass>
    );
  }

  return (
    <Glass className="p-6 max-w-3xl mx-auto w-full mt-24 md:mt-32 mb-16" data-newsletter>
      <div className="text-xs text-fg-muted terminal-prompt mb-1">newsletter</div>
      <div className="mb-1 text-sm font-semibold text-fg">AI for hardware engineers — weekly</div>
      <div className="text-xs text-fg-muted mb-4">
        What I&apos;m building, what&apos;s working, what&apos;s not. Ungated, no spam.
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <span className="text-accent-green text-sm">&gt;</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={status === "loading"}
          required
          className="flex-1 bg-transparent border-b border-glass-border focus:border-accent-green outline-none px-1 py-2 text-sm font-mono disabled:opacity-50"
          aria-label="email address"
        />
        <Button type="submit" disabled={status === "loading" || !email.trim()}>
          {status === "loading" ? "..." : "subscribe"}
        </Button>
      </form>
      {status === "error" && (
        <div className="text-xs text-accent-err mt-2">try again</div>
      )}
      <div className="text-xs text-fg-subtle mt-3">
        I&apos;ll only use your email to send you the newsletter. No tracking, no resale.
      </div>
    </Glass>
  );
}
