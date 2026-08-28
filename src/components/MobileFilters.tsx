"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { LEVEL_LABELS, LEVEL_EMOJI, type Level } from "@/lib/types";
import { emptyFilters, hasActiveFilters, countActiveFilters } from "@/lib/filters";
import { useFilters } from "@/context/FiltersContext";
import { useSwipeToDismiss } from "@/hooks/useSwipeToDismiss";
import FilterControls from "./FilterControls";

const LEVEL_ORDER: Level[] = ["jardin", "primaria", "secundaria", "terciario", "universidad"];

export function QuickLevelChips() {
  const { filters, setFilters, levelCounts } = useFilters();

  const toggle = (level: Level) => {
    const next = new Set(filters.levels);
    if (next.has(level)) next.delete(level);
    else next.add(level);
    setFilters({ ...filters, levels: next });
  };

  return (
    <div className="scrollbar-thin -mx-4 flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
      {LEVEL_ORDER.map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => toggle(level)}
          data-active={filters.levels.has(level)}
          className="pill shrink-0 py-2.5"
        >
          {LEVEL_EMOJI[level]} {LEVEL_LABELS[level]}
          <span className="opacity-60">({levelCounts[level]})</span>
        </button>
      ))}
    </div>
  );
}

export default function MobileFilters() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters, filtered } = useFilters();
  const activeCount = countActiveFilters(filters);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  const { sheetRef, handleRef, dragY, isDragging } = useSwipeToDismiss({
    onDismiss: () => setOpen(false),
    disabled: !open,
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-4 z-[1800] flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition active:scale-95 lg:hidden"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <SlidersHorizontal size={17} />
        Filtros
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-primary-dark">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[1900] flex flex-col justify-end lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div
            ref={sheetRef}
            className="relative flex max-h-[85vh] flex-col rounded-t-3xl border-t border-border bg-card shadow-2xl"
            style={{
              transform: dragY ? `translateY(${dragY}px)` : undefined,
              transition: isDragging ? "none" : "transform 0.25s ease",
            }}
          >
            <div ref={handleRef}>
              <div className="flex items-center justify-center pt-3">
                <div className="h-1.5 w-10 rounded-full bg-border" />
              </div>

              <div className="flex items-center justify-between px-5 pb-2 pt-3">
                <h2 className="font-display text-lg font-semibold">Filtros</h2>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="rounded-full p-1.5 text-muted hover:bg-background"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-3">
              <FilterControls />
            </div>

            <div
              className="flex gap-3 border-t border-border px-5 py-4"
              style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
            >
              <button
                onClick={() => setFilters(emptyFilters())}
                disabled={!hasActiveFilters(filters)}
                className="h-12 flex-1 rounded-full border border-border text-sm font-semibold text-foreground transition active:scale-95 disabled:opacity-40"
              >
                Limpiar
              </button>
              <button
                onClick={() => setOpen(false)}
                className="h-12 flex-[2] rounded-full bg-primary text-sm font-semibold text-white shadow-md shadow-primary/20 transition active:scale-95"
              >
                Ver {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
