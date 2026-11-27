import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        cream: "rgb(var(--cream) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        brass: "rgb(var(--brass) / <alpha-value>)",
        "brass-soft": "rgb(var(--brass-soft) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      maxWidth: {
        prose: "68ch",
        page: "72rem",
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        rake: {
          from: { transform: "translate3d(-10%, 0, 0) rotate(-18deg)" },
          to: { transform: "translate3d(12%, 0, 0) rotate(-18deg)" },
        },
        "boardroom-drift": {
          from: { transform: "scale(1.04) translate3d(0, 0, 0)" },
          to: { transform: "scale(1.1) translate3d(-1.6%, -1%, 0)" },
        },
      },
      animation: {
        "rise-1": "rise 0.95s cubic-bezier(0.16, 1, 0.3, 1) both",
        "rise-2": "rise 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both",
        "rise-3": "rise 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both",
        "rise-4": "rise 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both",
        "rise-5": "rise 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.32s both",
        rake: "rake 18s ease-in-out infinite alternate",
        "boardroom-drift": "boardroom-drift 26s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
