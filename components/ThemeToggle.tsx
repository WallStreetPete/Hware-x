"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("hx-theme")) as "dark" | "light" | null;
    const initial = stored || "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("hx-theme", next); } catch {}
  }

  return (
    <button
      onClick={toggle}
      title={`switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 font-mono text-[10px] tracking-[0.2em] text-ink-dim hover:text-accent hover:bg-bg-2 transition-colors"
    >
      {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      {theme.toUpperCase()}
    </button>
  );
}
