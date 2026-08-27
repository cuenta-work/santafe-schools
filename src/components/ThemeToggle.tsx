"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { withThemeTransition } from "@/lib/viewTransition";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("theme");
    } catch {}
    const value = saved === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", value);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(value);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    withThemeTransition(() => {
      setTheme(next);
      document.documentElement.setAttribute("data-theme", next);
    });
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar tema"
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-primary active:scale-95 ${className}`}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
