"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, GraduationCap, MapPin, Clock, ArrowRight, Landmark, ChevronDown } from "lucide-react";
import { SECTOR_SHORT } from "@/lib/types";
import { getAllCarreras, getAllOrientaciones } from "@/lib/data";
import { isCapital } from "@/lib/localityPriority";
import { useFilters } from "@/context/FiltersContext";
import InstitutionLogo from "./InstitutionLogo";
import TruncatedTooltip from "./TruncatedTooltip";

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
  const [visibleCount, setVisibleCount] = useState(12);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const suggestRef = useRef<HTMLDivElement>(null);

  const carreras = useMemo(() => getAllCarreras(), []);
  const orientaciones = useMemo(() => getAllOrientaciones(), []);

  // Nombres únicos de carreras para el autocompletado nativo del buscador --
  // así el padre/madre puede ver toda la oferta disponible sin tener que
  // adivinar cómo se llama exactamente cada carrera.
  const uniqueCareerNames = useMemo(() => {
    const set = new Set<string>();
    carreras.forEach((c) => set.add(c.nombre));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [carreras]);

  // Lista propia debajo del input, en vez del <datalist> nativo del
  // navegador -- así respeta el tema claro/oscuro del sitio y el ancho del
  // campo, en lugar del combo gris que arma el navegador por su cuenta.
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = q
      ? uniqueCareerNames.filter((name) => name.toLowerCase().includes(q))
      : uniqueCareerNames;
    return source.slice(0, 8);
  }, [uniqueCareerNames, query]);

  useEffect(() => {
    if (!suggestOpen) return;
    const onClick = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setSuggestOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSuggestOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [suggestOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return carreras
      .filter((c) => !q || c.nombre.toLowerCase().includes(q))
      .filter((c) => {
        if (!bucket) return true;
        const b = BUCKETS.find((b) => b.key === bucket);
        return b ? b.test(c.duracionAnios) : true;
      })
      .sort((a, b) => {
        // Sin ninguna zona elegida, el surtido por defecto encabeza con
        // Santa Fe capital -- el resto de la provincia sigue ahí abajo,
        // totalmente buscable, solo que no es lo primero que se ve.
        const capitalDiff = Number(isCapital(b.localidad)) - Number(isCapital(a.localidad));
        if (capitalDiff !== 0) return capitalDiff;
        return a.nombre.localeCompare(b.nombre, "es");
      });
  }, [carreras, query, bucket]);

  const orientationMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return orientaciones.filter((o) => o.toLowerCase().includes(q));
  }, [orientaciones, query]);

  const institutionCount = useMemo(
    () => new Set(results.map((r) => r.institutionId)).size,
    [results]
  );

  const openInstitution = (id: string, careerName: string) => {
    const inst = institutions.find((i) => i.id === id);
    if (inst) setSelected(inst, careerName);
  };

  const updateQuery = (v: string) => {
    setQuery(v);
    setVisibleCount(12);
  };

  const updateBucket = (b: DurationBucket | null) => {
    setBucket(b);
    setVisibleCount(12);
  };

  return (
    <section id="carreras" className="scroll-mt-[57px] bg-card py-10">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-dark">
          <GraduationCap size={13} /> Buscador de carreras y orientaciones
        </p>
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
          ¿Qué querés estudiar?
        </h2>
        <p className="mb-5 max-w-2xl text-sm text-muted">
          Para cuando ya se viene el terciario o la universidad: buscá la carrera, tecnicatura o
          profesorado y mirá en qué institutos y universidades de la provincia se dicta, con su
          duración.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div ref={suggestRef} className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(e) => {
                updateQuery(e.target.value);
                setSuggestOpen(true);
              }}
              onFocus={() => setSuggestOpen(true)}
              placeholder="Escribí o elegí de la lista: Medicina, Enfermería, Ciencias Naturales..."
              className="w-full rounded-full border border-border bg-card py-3 pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
              autoComplete="off"
            />
            {suggestOpen && suggestions.length > 0 && (
              <div
                className="scrollbar-thin absolute left-0 right-0 mt-1.5 max-h-64 overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-xl"
                style={{ zIndex: 2000 }}
              >
                {suggestions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      updateQuery(name);
                      setSuggestOpen(false);
                    }}
                    className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-foreground transition hover:bg-background"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BUCKETS.map((b) => (
              <button
                key={b.key}
                type="button"
                className="pill pill-accent"
                data-active={bucket === b.key}
                onClick={() => updateBucket(bucket === b.key ? null : b.key)}
              >
                <Clock size={13} /> {b.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-[11px] text-muted">
          💡 Tocá la lupa del campo o empezá a escribir para ver sugerencias con toda la oferta
          cargada -- dejalo vacío para navegar la lista completa.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-xs text-muted">
            <strong className="font-semibold text-foreground/80">{results.length}</strong>{" "}
            {results.length === 1 ? "carrera" : "carreras"} en{" "}
            <strong className="font-semibold text-foreground/80">{institutionCount}</strong>{" "}
            {institutionCount === 1 ? "institución" : "instituciones"}
          </p>
          {orientationMatches.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted">Orientaciones secundarias:</span>
              {orientationMatches.map((o) => (
                <span
                  key={o}
                  className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-dark"
                >
                  {o}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.slice(0, visibleCount).map((c, idx) => (
            <button
              key={`${c.institutionId}-${c.nombre}-${idx}`}
              onClick={() => openInstitution(c.institutionId, c.nombre)}
              className="card-glow shine group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-left transition"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {c.levels.includes("universidad") ? (
                    <Landmark size={11} />
                  ) : (
                    <GraduationCap size={11} />
                  )}
                  {c.levels.includes("universidad") ? "Universidad" : "Terciario"}
                </span>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent-dark">
                  <Clock size={11} /> {c.duracionLabel}
                </span>
              </div>

              <div>
                <p className="font-display text-base font-semibold leading-snug text-foreground group-hover:text-primary-dark">
                  {c.nombre}
                </p>
                <p className="text-xs text-muted">{c.titulo ?? "Título a definir"}</p>
              </div>

              <div className="mt-auto flex items-center gap-2 border-t border-border pt-3">
                <InstitutionLogo
                  id={c.institutionId}
                  name={c.institutionName}
                  domain={c.logoDomain}
                  size={28}
                />
                <div className="min-w-0 flex-1">
                  <TruncatedTooltip
                    text={c.institutionName}
                    className="min-w-0 truncate text-xs font-medium text-foreground/80"
                  />
                  <p className="flex items-center gap-1 truncate text-[11px] text-muted">
                    <MapPin size={10} className="shrink-0" />
                    {c.localidad} · {SECTOR_SHORT[c.sector]}
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary-dark"
                />
              </div>
            </button>
          ))}
        </div>

        {visibleCount < results.length && (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((v) => v + 12)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary-dark"
            >
              Ver más carreras ({results.length - visibleCount} más) <ChevronDown size={15} />
            </button>
          </div>
        )}

        {results.length === 0 && (
          <p className="mt-6 text-center text-sm text-muted">
            No encontramos carreras con ese nombre. Probá con otra palabra.
          </p>
        )}
      </div>
    </section>
  );
}
