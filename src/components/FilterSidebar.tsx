"use client";

import { RotateCcw } from "lucide-react";
import { emptyFilters, hasActiveFilters } from "@/lib/filters";
import { useFilters } from "@/context/FiltersContext";
import FilterControls from "./FilterControls";

export default function FilterSidebar() {
  const { filters, setFilters, filtered } = useFilters();
  const active = hasActiveFilters(filters);

  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="scrollbar-thin sticky top-20 flex max-h-[calc(100vh-5.5rem)] flex-col gap-6 overflow-y-auto rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Filtros</h2>
          {active && (
            <button
              onClick={() => setFilters(emptyFilters())}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <RotateCcw size={12} /> Limpiar
            </button>
          )}
        </div>

        <FilterControls />

        <p className="text-xs text-muted">
          {filtered.length}{" "}
          {filtered.length === 1 ? "institución encontrada" : "instituciones encontradas"}
        </p>
      </div>
    </aside>
  );
}
