"use client";

import { useMemo, useState } from "react";
import { Sparkles, MapPin, Heart, GraduationCap } from "lucide-react";
import { LEVEL_LABELS, LEVEL_SHORT, type Level } from "@/lib/types";
import { institutionTint } from "@/lib/institutionColor";
import { useFilters } from "@/context/FiltersContext";
import InstitutionLogo from "./InstitutionLogo";

export default function Featured() {
  const { institutions, setSelected, isFavorite, toggleFavorite } = useFilters();
  const [level, setLevel] = useState<Level | null>(null);
  const featured = useMemo(
    () => institutions.filter((i) => i.featured && (!level || i.levels.includes(level))),
    [institutions, level]
  );
  const featuredLevels = useMemo(
    () =>
      Array.from(
        new Set(institutions.filter((i) => i.featured).flatMap((i) => i.levels))
      ),
    [institutions]
  );

  if (institutions.filter((i) => i.featured).length === 0) return null;

  return (
    <section id="destacados" className="scroll-mt-[57px] bg-card py-10">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-dark">
              <Sparkles size={13} /> Selección curada
            </p>
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              Instituciones destacadas
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="pill" data-active={level === null} onClick={() => setLevel(null)}>
              Todas
            </button>
            {featuredLevels.map((l) => (
              <button
                key={l}
                className="pill"
                data-active={level === l}
                onClick={() => setLevel(level === l ? null : l)}
              >
                {LEVEL_LABELS[l]}
              </button>
            ))}
          </div>
        </div>

        <div className="scrollbar-thin -mx-4 flex gap-4 overflow-x-auto px-4 pb-3 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0">
          {featured.map((i) => {
            const tint = institutionTint(i.id);
            const favorite = isFavorite(i.id);
            return (
              <button
                key={i.id}
                onClick={() => setSelected(i)}
                className="card-glow shine flex w-[15.5rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-background text-left transition-transform active:scale-[0.98] hover:-translate-y-0.5 lg:w-auto"
              >
                <div
                  className="relative flex h-16 items-center justify-end px-4"
                  style={{ background: tint.bg }}
                >
                  <GraduationCap
                    size={44}
                    strokeWidth={1.25}
                    style={{ color: tint.icon }}
                    className="-mr-2 -mt-2 opacity-70"
                  />
                  <span
                    className="absolute left-4 z-10 rounded-xl ring-4 ring-background"
                    style={{ bottom: -24 }}
                  >
                    <InstitutionLogo id={i.id} name={i.name} domain={i.logoDomain} size={48} />
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-4 pt-7">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {i.levels.map((l) => LEVEL_SHORT[l]).join(" · ")}
                    </p>
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 font-display text-base font-semibold text-foreground">
                        {i.name}
                      </p>
                      <span
                        role="button"
                        tabIndex={0}
                        aria-pressed={favorite}
                        aria-label={favorite ? "Quitar de favoritos" : "Guardar en favoritos"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(i.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(i.id);
                          }
                        }}
                        className="mt-0.5 shrink-0 p-0.5 transition hover:scale-110 active:scale-95"
                      >
                        <Heart
                          size={15}
                          className={favorite ? "fill-accent text-accent" : "text-muted"}
                        />
                      </span>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted">{i.description}</p>
                  {(i.address || i.localidad) && (
                    <p className="flex items-center gap-1 text-[11px] text-muted">
                      <MapPin size={11} /> {i.localidad}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
