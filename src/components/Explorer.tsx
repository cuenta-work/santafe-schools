"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Compass, ChevronDown } from "lucide-react";
import { useFilters } from "@/context/FiltersContext";
import { formatDistance } from "@/lib/geo";
import FilterSidebar from "./FilterSidebar";
import InstitutionCard from "./InstitutionCard";
import LevelTipBanner from "./LevelTipBanner";
import MobileFilters, { QuickLevelChips } from "./MobileFilters";

const CityMap = dynamic(() => import("./CityMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] w-full items-center justify-center rounded-2xl border border-border bg-background text-sm text-muted">
      Cargando el mapa...
    </div>
  ),
});

// Con miles de instituciones posibles en un mismo filtro (ej. "jardines"
// en toda la provincia), renderizar todo el listado de una sola vez
// trababa el scroll -- se muestra de a tandas y se van pidiendo más.
const PAGE_SIZE = 24;

export default function Explorer() {
  const { filtered, filters, distances, setSelected } = useFilters();
  const singleLevel = filters.levels.size === 1 ? Array.from(filters.levels)[0] : null;
  const sectionRef = useRef<HTMLElement>(null);
  const prevFiltered = useRef(filtered);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (prevFiltered.current === filtered) return;
    prevFiltered.current = filtered;
    setVisibleCount(PAGE_SIZE);
    sectionRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [filtered]);

  const visible = filtered.slice(0, visibleCount);

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
          {singleLevel && <LevelTipBanner level={singleLevel} sectors={filters.sectors} />}

          {/* El mapa solo se ve en desktop, al lado del sidebar de filtros
              -- en mobile ocupaba una pantalla entera antes de llegar a
              ningún resultado, igual que en santafe-gourmet. */}
          <div className="mb-5 hidden lg:block">
            <CityMap
              institutions={filtered}
              origin={filters.origin}
              radiusKm={filters.origin ? filters.radiusKm : undefined}
              onSelect={setSelected}
              height="320px"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center text-muted">
              <p className="font-display text-lg">No encontramos instituciones así...</p>
              <p className="text-sm">probá aflojando algún filtro o cambiando de zona.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((inst, i) => (
                  <div
                    key={inst.id}
                    className="fade-up min-w-0"
                    style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                  >
                    <InstitutionCard
                      institution={inst}
                      onOpen={setSelected}
                      distanceLabel={
                        filters.origin ? formatDistance(distances.get(inst.id) ?? 0) : undefined
                      }
                    />
                  </div>
                ))}
              </div>

              {visibleCount < filtered.length && (
                <div className="mt-6 flex flex-col items-center gap-2">
                  <p className="text-xs text-muted">
                    Mostrando {visible.length} de {filtered.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-6 text-sm font-semibold text-primary-dark transition hover:border-primary hover:bg-primary/5"
                  >
                    Cargar más <ChevronDown size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <MobileFilters />
    </section>
  );
}
