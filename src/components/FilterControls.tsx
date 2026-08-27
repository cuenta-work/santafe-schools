"use client";

import { useMemo, useState } from "react";
import { GraduationCap, Star, MapPin, X, LocateFixed, Loader2 } from "lucide-react";
import {
  LEVEL_LABELS,
  LEVEL_EMOJI,
  SECTOR_LABELS,
  SECTOR_EMOJI,
  TIPO_SECUNDARIA_LABELS,
  TIPO_SECUNDARIA_EMOJI,
  type Level,
  type Sector,
  type TipoSecundaria,
} from "@/lib/types";
import { RADII } from "@/lib/geo";
import { capitalFirst } from "@/lib/localityPriority";
import { useFilters } from "@/context/FiltersContext";
import CustomSelect from "./CustomSelect";

const LEVEL_ORDER: Level[] = ["jardin", "primaria", "secundaria", "terciario", "universidad"];
const SECTOR_ORDER: Sector[] = ["publico", "privado"];
const TIPO_SECUNDARIA_ORDER: TipoSecundaria[] = ["tecnica", "orientada"];
const MODALIDADES = ["jornada simple", "jornada completa", "doble escolaridad"];
const GENEROS = ["mixto", "solo mujeres", "solo varones"];

export default function FilterControls() {
  const {
    filters,
    setFilters: applyFilters,
    localidades,
    levelCounts,
    sectorCounts,
  } = useFilters();

  const localidadesOrdenadas = useMemo(
    () => capitalFirst(localidades, (l) => l),
    [localidades]
  );

  const toggleInSet = (set: Set<string>, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  // Este es el ÚNICO lugar de la app donde se elige una ubicación de
  // origen -- vive adentro del sistema de filtros de siempre en vez de
  // tener su propia copia en otro lado, así la cercanía es un filtro más
  // que se combina con el resto sin duplicar nada (igual que en
  // santafe-gourmet).
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationError("Tu navegador no soporta geolocalización.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyFilters({
          ...filters,
          origin: { lat: pos.coords.latitude, lon: pos.coords.longitude },
        });
        setLocating(false);
      },
      () => {
        setLocationError(
          "No pudimos acceder a tu ubicación. Probá eligiendo tu localidad más abajo."
        );
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Cerca tuyo
        </p>
        {filters.origin ? (
          <div className="flex flex-col gap-2 rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-primary-dark">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin size={13} className="shrink-0" />
                Ubicación activa
              </span>
              <button
                type="button"
                onClick={() => applyFilters({ ...filters, origin: null })}
                className="flex shrink-0 items-center gap-1 font-semibold hover:underline"
              >
                <X size={12} /> Quitar
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {RADII.map((r) => (
                <button
                  key={r.km}
                  type="button"
                  className="pill !py-1.5 !text-xs"
                  data-active={filters.radiusKm === r.km}
                  onClick={() => applyFilters({ ...filters, radiusKm: r.km })}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition active:scale-95 hover:bg-primary-dark disabled:opacity-60"
            >
              {locating ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
              Usar mi ubicación
            </button>
            {locationError && <p className="text-xs text-accent-dark">{locationError}</p>}
          </div>
        )}
      </div>

      <div className="relative">
        <GraduationCap
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={filters.search}
          onChange={(e) => applyFilters({ ...filters, search: e.target.value })}
          placeholder="Buscar por nombre, carrera u orientación..."
          className="w-full rounded-full border border-border bg-card py-3 pl-9 pr-3 text-base text-foreground placeholder:text-muted focus:border-primary focus:outline-none sm:py-2 sm:text-sm"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Nivel</p>
        <div className="flex flex-wrap gap-2">
          {LEVEL_ORDER.map((level) => (
            <button
              key={level}
              type="button"
              className="pill"
              data-active={filters.levels.has(level)}
              onClick={() =>
                applyFilters({
                  ...filters,
                  levels: toggleInSet(filters.levels, level) as Set<Level>,
                })
              }
            >
              {LEVEL_EMOJI[level]} {LEVEL_LABELS[level]}
              <span className="opacity-60">({levelCounts[level]})</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Gestión</p>
        <div className="flex flex-wrap gap-2">
          {SECTOR_ORDER.map((sector) => (
            <button
              key={sector}
              type="button"
              className="pill pill-accent"
              data-active={filters.sectors.has(sector)}
              onClick={() =>
                applyFilters({
                  ...filters,
                  sectors: toggleInSet(filters.sectors, sector) as Set<Sector>,
                })
              }
            >
              {SECTOR_EMOJI[sector]} {SECTOR_LABELS[sector]}
              <span className="opacity-60">({sectorCounts[sector]})</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Secundaria: técnica u orientada
        </p>
        <div className="flex flex-wrap gap-2">
          {TIPO_SECUNDARIA_ORDER.map((t) => (
            <button
              key={t}
              type="button"
              className="pill"
              data-active={filters.tipoSecundaria === t}
              onClick={() =>
                applyFilters({
                  ...filters,
                  tipoSecundaria: filters.tipoSecundaria === t ? null : t,
                })
              }
            >
              {TIPO_SECUNDARIA_EMOJI[t]} {TIPO_SECUNDARIA_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Localidad o zona
        </p>
        <CustomSelect
          value={filters.localidad ?? ""}
          onChange={(v) => applyFilters({ ...filters, localidad: v || null })}
          options={localidadesOrdenadas}
          placeholder="Toda la provincia"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Jornada</p>
        <CustomSelect
          value={filters.modalidad ?? ""}
          onChange={(v) => applyFilters({ ...filters, modalidad: v || null })}
          options={MODALIDADES}
          placeholder="Cualquier jornada"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Alumnado</p>
        <CustomSelect
          value={filters.genero ?? ""}
          onChange={(v) => applyFilters({ ...filters, genero: v || null })}
          options={GENEROS}
          placeholder="Cualquiera"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-center justify-between gap-2.5 text-sm text-foreground">
          <span>
            Solo <strong className="font-semibold">bilingües</strong>
          </span>
          <input
            type="checkbox"
            checked={filters.bilingueOnly}
            onChange={(e) => applyFilters({ ...filters, bilingueOnly: e.target.checked })}
            className="switch"
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between gap-2.5 text-sm text-foreground">
          <span className="flex items-center gap-1.5">
            Solo <strong className="font-semibold">destacadas</strong>{" "}
            <Star size={13} className="text-gold" />
          </span>
          <input
            type="checkbox"
            checked={filters.featuredOnly}
            onChange={(e) => applyFilters({ ...filters, featuredOnly: e.target.checked })}
            className="switch"
          />
        </label>
      </div>
    </div>
  );
}
