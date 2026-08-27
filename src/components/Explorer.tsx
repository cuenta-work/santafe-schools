"use client";

import { useEffect, useRef } from "react";
import { Compass } from "lucide-react";
import { useFilters } from "@/context/FiltersContext";
import FilterSidebar from "./FilterSidebar";
import InstitutionCard from "./InstitutionCard";
import LevelTipBanner from "./LevelTipBanner";
import MobileFilters, { QuickLevelChips } from "./MobileFilters";

export default function Explorer() {
  const { filtered, filters, setSelected } = useFilters();
  const singleLevel = filters.levels.size === 1 ? Array.from(filters.levels)[0] : null;
  const sectionRef = useRef<HTMLElement>(null);
  const prevFiltered = useRef(filtered);

  useEffect(() => {
    if (prevFiltered.current === filtered) return;
    prevFiltered.current = filtered;
    sectionRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [filtered]);

  return (
    <section
      id="buscador"
      ref={sectionRef}
      className="mx-auto w-full max-w-7xl scroll-mt-[57px] px-4 pb-10 pt-12 lg:px-8"
    >
      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-dark">
        <Compass size={13} /> Buscador de instituciones
      </p>
      <p className="mb-4 text-center font-display text-xl italic text-foreground/70 sm:text-2xl">
        Encontrá la institución justa para tu familia.
      </p>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            A tu medida
          </h2>
          <p className="text-sm text-muted">
            Elegí nivel, gestión, zona y jornada — la lista se acomoda al instante.
          </p>
        </div>
      </div>

      <div className="mb-5">
        <QuickLevelChips />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar />

        <div className="flex-1 pb-20 lg:pb-0">
          {singleLevel && <LevelTipBanner level={singleLevel} />}
          {filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center text-muted">
              <p className="font-display text-lg">No encontramos instituciones así...</p>
              <p className="text-sm">probá aflojando algún filtro o cambiando de zona.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((inst, i) => (
                <div
                  key={inst.id}
                  className="fade-up min-w-0"
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                >
                  <InstitutionCard institution={inst} onOpen={setSelected} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileFilters />
    </section>
  );
}
