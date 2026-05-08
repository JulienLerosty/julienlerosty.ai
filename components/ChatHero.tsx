"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Glass } from "@/components/ui/Glass";
import { Button } from "@/components/ui/Button";

type Message = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Tell me about your trading bots",
  "Show me your agent infrastructure",
  "What would you do at our company?",
  "What's your strongest AI engineering skill?",
];

export function ChatHero() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    streamRef.current?.scrollTo({ top: streamRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(content: string) {
    const trimmed = content.trim();
    if (!trimmed || streaming) return;
    setError(null);

    const userMsg: Message = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);

    let assistant = "";
    setMessages([...next, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(String(errBody.error || `HTTP ${res.status}`));
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("no_stream_body");
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE events are separated by \n\n. Process each complete event in buffer.
        let idx;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          const event = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          if (!event.startsWith("data: ")) continue;
          const payload = event.slice(6);
          if (payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload);
            if (parsed.delta) {
              assistant += parsed.delta;
              setMessages([...next, { role: "assistant", content: assistant }]);
            } else if (parsed.error) {
              throw new Error(String(parsed.error));
            }
          } catch (e) {
            // Malformed JSON in a single event — log but don't kill the stream
            console.warn("chat parse warn", e);
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setMessages([
        ...next,
        { role: "assistant", content: "The agent isn't responding right now. Try again in a moment." },
      ]);
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  return (
    <Glass className="p-6 max-w-3xl mx-auto w-full">
      <div className="text-xs text-fg-muted mb-3 terminal-prompt">
        ask me about my trading bots, agent infrastructure, or how I&apos;d build at your company...
      </div>

      <div ref={streamRef} className="min-h-[200px] max-h-[420px] overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="text-fg-muted text-sm">
            <span className="text-accent-green">julien.lerosty</span> is online.
            <span className="motion-cursor inline-block w-2 h-4 bg-accent-green ml-1 align-middle" />
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i}>
            <div className="text-xs text-fg-muted mb-1">
              {m.role === "user" ? "you" : "julien.lerosty"}
            </div>
            {m.role === "assistant" ? (
              <div className="markdown-body text-sm">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
            )}
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {STARTERS.map((s) => (
            <Button
              key={s}
              variant="ghost"
              onClick={() => send(s)}
              disabled={streaming}
              type="button"
            >
              {s}
            </Button>
          ))}
        </div>
      )}

      {error && (
        <div className="text-xs text-accent-err mb-3">error: {error}</div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 items-center"
      >
        <span className="text-accent-green text-sm">&gt;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={streaming ? "..." : "type a question"}
          disabled={streaming}
          className="flex-1 bg-transparent border-b border-glass-border focus:border-accent-green outline-none px-1 py-2 text-sm font-mono disabled:opacity-50"
          aria-label="chat input"
        />
        <Button type="submit" disabled={streaming || !input.trim()}>
          send
        </Button>
      </form>

      <div className="mt-4 pt-3 border-t border-glass-borderSubtle text-xs text-fg-muted">
        <span className="terminal-prompt">working on something hard? </span>
        <a href="/work" className="text-accent-green hover:text-accent-cyan transition-colors">
          book a 30-min call →
        </a>
      </div>
    </Glass>
  );
}
