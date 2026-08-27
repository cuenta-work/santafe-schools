"use client";

import { useMemo, useState } from "react";
import { Search, GraduationCap, MapPin, Clock } from "lucide-react";
import { getAllCarreras, getAllOrientaciones } from "@/lib/data";
import { useFilters } from "@/context/FiltersContext";

type DurationBucket = "corta" | "media" | "larga";

const BUCKETS: { key: DurationBucket; label: string; test: (years: number) => boolean }[] = [
  { key: "corta", label: "Cortas (hasta 2 años)", test: (y) => y <= 2 },
  { key: "media", label: "Medias (3-4 años)", test: (y) => y >= 3 && y <= 4 },
  { key: "larga", label: "Largas (5 años o más)", test: (y) => y >= 5 },
];

export default function CareerFinder() {
  const { institutions, setSelected } = useFilters();
  const [query, setQuery] = useState("");
  const [bucket, setBucket] = useState<DurationBucket | null>(null);

  const carreras = useMemo(() => getAllCarreras(), []);
  const orientaciones = useMemo(() => getAllOrientaciones(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return carreras
      .filter((c) => !q || c.nombre.toLowerCase().includes(q))
      .filter((c) => {
        if (!bucket) return true;
        const b = BUCKETS.find((b) => b.key === bucket);
        return b ? b.test(c.duracionAnios) : true;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }, [carreras, query, bucket]);

  const orientationMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return orientaciones.filter((o) => o.toLowerCase().includes(q));
  }, [orientaciones, query]);

  const openInstitution = (id: string) => {
    const inst = institutions.find((i) => i.id === id);
    if (inst) setSelected(inst);
  };

  return (
    <section id="carreras" className="scroll-mt-[57px] bg-card py-10">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-dark">
          <GraduationCap size={13} /> Buscador de carreras y orientaciones
        </p>
        <h2 className="mb-1 font-display text-2xl font-semibold text-foreground sm:text-3xl">
          ¿Qué querés estudiar?
        </h2>
        <p className="mb-5 max-w-2xl text-sm text-muted">
          Buscá una carrera, tecnicatura, profesorado u orientación secundaria y mirá en qué
          institutos y universidades de Santa Fe capital y su zona se dicta.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: Medicina, Ingeniería en Sistemas, Enfermería, Ciencias Naturales..."
              className="w-full rounded-full border border-border bg-background py-3 pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BUCKETS.map((b) => (
              <button
                key={b.key}
                type="button"
                className="pill pill-accent"
                data-active={bucket === b.key}
                onClick={() => setBucket(bucket === b.key ? null : b.key)}
              >
                <Clock size={13} /> {b.label}
              </button>
            ))}
          </div>
        </div>

        {orientationMatches.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted">Orientaciones secundarias que coinciden:</span>
            {orientationMatches.map((o) => (
              <span
                key={o}
                className="rounded-full bg-background px-2.5 py-1 text-xs text-foreground/80"
              >
                {o}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.slice(0, 24).map((c, idx) => (
            <button
              key={`${c.institutionId}-${c.nombre}-${idx}`}
              onClick={() => openInstitution(c.institutionId)}
              className="card-glow flex flex-col gap-1 rounded-xl border border-border bg-background p-4 text-left transition hover:-translate-y-0.5"
            >
              <p className="font-display text-sm font-semibold text-foreground">{c.nombre}</p>
              <p className="text-xs text-muted">{c.titulo ?? "Título"}</p>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-accent-dark">
                <Clock size={11} /> {c.duracionLabel}
              </div>
              <div className="mt-2 flex items-center gap-1.5 border-t border-border pt-2 text-xs text-muted">
                <MapPin size={11} className="shrink-0" />
                <span className="truncate">
                  {c.institutionName} · {c.localidad}
                </span>
              </div>
            </button>
          ))}
        </div>

        {results.length === 0 && (
          <p className="mt-6 text-center text-sm text-muted">
            No encontramos carreras con ese nombre. Probá con otra palabra.
          </p>
        )}
      </div>
    </section>
  );
}
