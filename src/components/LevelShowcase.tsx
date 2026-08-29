"use client";

import { Baby, BookOpen, Backpack, School, Landmark, GraduationCap } from "lucide-react";
import { LEVEL_LABELS, LEVEL_BLURB, type Level } from "@/lib/types";
import { emptyFilters } from "@/lib/filters";
import { useFilters } from "@/context/FiltersContext";

const ORDER: Level[] = ["jardin", "primaria", "secundaria", "terciario", "universidad"];

const LEVEL_ICON: Record<Level, typeof Baby> = {
  jardin: Baby,
  primaria: Backpack,
  secundaria: School,
  terciario: BookOpen,
  universidad: Landmark,
};

export default function LevelShowcase() {
  const { levelCounts, posgradoCount, showOnlyLevel, setFilters } = useFilters();

  return (
    <section id="niveles" className="mx-auto w-full max-w-7xl scroll-mt-[57px] px-4 py-10 lg:px-8">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Explorá por nivel
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {ORDER.map((level) => {
          const Icon = LEVEL_ICON[level];
          return (
            <a
              key={level}
              href="#buscador"
              onClick={() => showOnlyLevel(level)}
              className="card-glow shine group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-left transition-transform active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-background text-primary-dark">
                <Icon size={22} />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-foreground">
                  {LEVEL_LABELS[level]}
                </p>
                <p className="mt-0.5 text-xs text-muted">{LEVEL_BLURB[level]}</p>
              </div>
              <p className="mt-auto text-xs font-semibold text-primary-dark">
                {levelCounts[level]} instituciones →
              </p>
            </a>
          );
        })}
        <a
          href="#buscador"
          onClick={() => setFilters({ ...emptyFilters(), posgradoOnly: true })}
          className="card-glow shine group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-left transition-transform active:scale-[0.98]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-background text-primary-dark">
            <GraduationCap size={22} />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-foreground">Posgrado</p>
            <p className="mt-0.5 text-xs text-muted">Especializaciones, maestrías y doctorados</p>
          </div>
          <p className="mt-auto text-xs font-semibold text-primary-dark">
            {posgradoCount} instituciones →
          </p>
        </a>
      </div>
    </section>
  );
}
