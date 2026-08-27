"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-full border border-border bg-card py-2.5 pl-4 pr-3 text-left text-sm text-foreground transition hover:border-primary focus:border-primary focus:outline-none"
      >
        <span className={`truncate ${value ? "" : "text-muted"}`}>{value || placeholder}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="scrollbar-thin absolute mt-1.5 max-h-64 w-full min-w-[12rem] overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-xl"
          style={{ zIndex: 2000 }}
        >
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-muted transition hover:bg-background"
          >
            {placeholder}
            {!value && <Check size={14} className="text-primary" />}
          </button>
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-foreground transition hover:bg-background"
            >
              {o}
              {value === o && <Check size={14} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
