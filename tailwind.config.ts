import type { Config } from "tailwindcss";

const rgbVar = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: rgbVar("--bg"),
          1: rgbVar("--bg-1"),
          2: rgbVar("--bg-2"),
          3: rgbVar("--bg-3"),
        },
        line: rgbVar("--line"),
        ink: {
          DEFAULT: rgbVar("--ink"),
          dim:  rgbVar("--ink-dim"),
          mute: rgbVar("--ink-mute"),
        },
        accent: {
          DEFAULT: rgbVar("--accent"),
          glow:    rgbVar("--accent-glow"),
          deep:    rgbVar("--accent-deep"),
        },
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
