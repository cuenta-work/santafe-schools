"use client";

import { useState } from "react";
import { Search, GraduationCap } from "lucide-react";
import {
  LEVEL_LABELS,
  LEVEL_EMOJI,
  SECTOR_LABELS,
  SECTOR_EMOJI,
  type Level,
  type Sector,
} from "@/lib/types";
import { useFilters } from "@/context/FiltersContext";
import { emptyFilters } from "@/lib/filters";
import CustomSelect from "./CustomSelect";
import SchoolMark from "./SchoolMark";

const LEVEL_ORDER: Level[] = ["jardin", "primaria", "secundaria", "terciario", "universidad"];
const SECTOR_ORDER: Sector[] = ["publico", "privado"];

export default function Hero() {
  const { institutions, filters, setFilters, localidades, levelCounts, sectorCounts } =
    useFilters();
  const [pendingLevels, setPendingLevels] = useState<Set<Level>>(new Set(filters.levels));
  const [pendingSectors, setPendingSectors] = useState<Set<Sector>>(new Set(filters.sectors));
  const [pendingLocalidad, setPendingLocalidad] = useState<string>(filters.localidad ?? "");

  const universities = institutions.filter((i) => i.levels.includes("universidad")).length;

  const toggleLevel = (level: Level) => {
    setPendingLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };

  const toggleSector = (sector: Sector) => {
    setPendingSectors((prev) => {
      const next = new Set(prev);
      if (next.has(sector)) next.delete(sector);
      else next.add(sector);
      return next;
    });
  };

  const applyAndScroll = () => {
    setFilters({
      ...emptyFilters(),
      levels: pendingLevels,
      sectors: pendingSectors,
      localidad: pendingLocalidad || null,
    });
    document.getElementById("buscador")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="top" className="relative scroll-mt-[57px] overflow-hidden bg-card">
      <div
        className="ambient-glow pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 15%, var(--primary) 0, transparent 42%), radial-gradient(circle at 88% 8%, var(--gold) 0, transparent 35%), radial-gradient(circle at 75% 85%, var(--accent) 0, transparent 45%)",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-14 pt-10 lg:px-8 lg:pb-20 lg:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Santa Fe, Argentina — todos los niveles, toda la provincia
        </p>
        <div className="flex items-center gap-4 sm:gap-5">
          <SchoolMark className="h-16 w-16 shrink-0 -rotate-3 sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            El mapa educativo de Santa Fe, para elegir{" "}
            <span className="whitespace-nowrap italic text-primary-dark">con tranquilidad</span>.
          </h1>
        </div>
        <p className="max-w-xl text-base text-muted sm:text-lg">
          Jardines, primarias, secundarias, terciarios y universidades de toda la provincia:
          gestión, orientación, carreras y contacto de cada institución, en un solo lugar.
        </p>

        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
          <a
            href="#buscador"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-[13px] font-semibold text-white shadow-md shadow-primary/20 transition active:scale-95 hover:bg-primary-dark sm:h-12 sm:px-6 sm:text-sm"
          >
            <Search size={15} className="shrink-0" /> Buscar instituciones
          </a>
          <a
            href="#carreras"
            className="shine inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-accent px-4 text-[13px] font-semibold text-white shadow-md shadow-accent/25 transition active:scale-95 hover:bg-accent-dark sm:h-12 sm:px-6 sm:text-sm"
          >
            <GraduationCap size={15} className="shrink-0" /> Buscar carreras
          </a>
        </div>

        {/* Filtro rápido de portada: 3 grupos + un botón de Aplicar que
            recién ahí confirma la selección contra el listado de abajo —
            a propósito no reactivo como el resto de los toggles del sitio,
            porque acá el usuario arma varias elecciones antes de decidir. */}
        <div className="mt-4 rounded-3xl border border-border bg-background/70 p-4 sm:p-6">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            Armá tu búsqueda
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Nivel
              </p>
              <div className="flex flex-wrap gap-1.5">
                {LEVEL_ORDER.map((level) => (
                  <button
                    key={level}
                    type="button"
                    className="pill !py-1.5 !text-xs"
                    data-active={pendingLevels.has(level)}
                    onClick={() => toggleLevel(level)}
                  >
                    {LEVEL_EMOJI[level]} {LEVEL_LABELS[level]}
                    <span className="opacity-60">({levelCounts[level]})</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Gestión
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SECTOR_ORDER.map((sector) => (
                  <button
                    key={sector}
                    type="button"
                    className="pill pill-accent !py-1.5 !text-xs"
                    data-active={pendingSectors.has(sector)}
                    onClick={() => toggleSector(sector)}
                  >
                    {SECTOR_EMOJI[sector]} {SECTOR_LABELS[sector]}
                    <span className="opacity-60">({sectorCounts[sector]})</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Zona
              </p>
              <CustomSelect
                value={pendingLocalidad}
                onChange={setPendingLocalidad}
                options={localidades}
                placeholder="Toda la provincia"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={applyAndScroll}
            className="shine flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-white shadow-md shadow-primary/20 transition active:scale-95 hover:bg-primary-dark sm:w-auto sm:px-8"
          >
            <Search size={15} /> Aplicar filtros
          </button>
          </div>
        </div>

        <dl className="mt-2 grid grid-cols-3 gap-3 sm:max-w-md">
          <div className="rounded-2xl border border-border bg-background/60 px-3 py-3 text-center sm:px-4">
            <dt className="text-[11px] uppercase tracking-wide text-muted">Instituciones</dt>
            <dd className="font-display text-2xl font-semibold text-foreground">
              {institutions.length}
            </dd>
          </div>
          <div className="rounded-2xl border border-border bg-background/60 px-3 py-3 text-center sm:px-4">
            <dt className="text-[11px] uppercase tracking-wide text-muted">Localidades</dt>
            <dd className="font-display text-2xl font-semibold text-foreground">
              {localidades.length}+
            </dd>
          </div>
          <div className="rounded-2xl border border-border bg-background/60 px-3 py-3 text-center sm:px-4">
            <dt className="text-[11px] uppercase tracking-wide text-muted">Univ. y terciarios</dt>
            <dd className="font-display text-2xl font-semibold text-foreground">
              {universities}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
