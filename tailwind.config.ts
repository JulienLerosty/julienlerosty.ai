import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0a0a0a",
          raised: "#111111",
          sunken: "#050505",
        },
        fg: {
          DEFAULT: "#e6e6e6",
          muted: "#888888",
          subtle: "#555555",
        },
        accent: {
          green: "#00ff88",
          cyan: "#00d4ff",
          warn: "#ffaa00",
          err: "#ff5577",
        },
        glass: {
          fill: "rgba(255,255,255,0.04)",
          fillStrong: "rgba(255,255,255,0.07)",
          border: "rgba(255,255,255,0.12)",
          borderSubtle: "rgba(255,255,255,0.06)",
        },
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        glass: "20px",
      },
      animation: {
        "cursor-blink": "blink 1.1s steps(2, end) infinite",
        "grid-drift": "drift 80s linear infinite",
      },
      keyframes: {
        blink: { "50%": { opacity: "0" } },
        drift: { from: { backgroundPosition: "0 0" }, to: { backgroundPosition: "40px 40px" } },
      },
    },
  },
  plugins: [],
};
export default config;
