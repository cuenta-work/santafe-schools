"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import type { Carrera } from "@/lib/types";

export function CarrerasList({
  carreras,
  bordered = true,
  scroll = true,
  bg = "bg-card",
  highlightCareer = null,
}: {
  carreras: Carrera[];
  bordered?: boolean;
  // false en la página de detalle (SEO/deep-link): ahí se muestra la
  // currícula completa sin recortar, a diferencia del modal, donde el
  // espacio es limitado y conviene un scroll interno.
  scroll?: boolean;
  bg?: string;
  // Nombre de la carrera puntual que se clickeó para llegar acá -- se
  // resalta y se scrollea a la vista apenas se monta la lista.
  highlightCareer?: string | null;
}) {
  const highlightRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!highlightCareer) return;
    const id = requestAnimationFrame(() => {
      highlightRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => cancelAnimationFrame(id);
  }, [highlightCareer]);

  return (
    <ul
      className={`flex flex-col divide-y divide-border overflow-hidden ${bg} ${
        bordered ? "rounded-xl border border-border" : ""
      } ${scroll ? `scrollbar-thin overflow-y-auto ${carreras.length > 6 ? "max-h-72" : ""}` : ""}`}
    >
      {carreras.map((c) => {
        const isHighlighted = highlightCareer === c.nombre;
        return (
          <li
            key={c.nombre}
            ref={isHighlighted ? highlightRef : undefined}
            className={`flex items-start justify-between gap-3 px-3.5 py-2.5 text-sm ${
              isHighlighted ? "bg-primary/10 ring-1 ring-inset ring-primary/40" : ""
            }`}
          >
            <div className="flex min-w-0 items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <div className="min-w-0">
                <p className={isHighlighted ? "font-semibold text-primary-dark" : "text-foreground"}>
                  {c.nombre}
                </p>
                {c.titulo && <p className="text-xs text-muted">{c.titulo}</p>}
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent-dark">
              <Clock size={11} /> {c.duracionLabel}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function FacultadesAccordion({
  groups,
  scroll = true,
  bg = "bg-card",
  highlightCareer = null,
}: {
  groups: [string, Carrera[]][];
  scroll?: boolean;
  bg?: string;
  // Nombre de la carrera puntual que se clickeó para llegar acá -- si cae
  // dentro de una facultad, esa es la que arranca abierta (y no siempre la
  // primera de la lista).
  highlightCareer?: string | null;
}) {
  const facultadWithCareer = highlightCareer
    ? groups.find(([, carreras]) => carreras.some((c) => c.nombre === highlightCareer))?.[0]
    : undefined;
  const [open, setOpen] = useState<string | null>(facultadWithCareer ?? groups[0]?.[0] ?? null);

  return (
    <div className="flex flex-col gap-2">
      {groups.map(([facultad, carreras]) => {
        const isOpen = open === facultad;
        return (
          <div key={facultad} className={`overflow-hidden rounded-xl border border-border ${bg}`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : facultad)}
              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium text-foreground transition hover:bg-background"
            >
              <GraduationCap size={14} className="shrink-0 text-primary" />
              <span className="flex-1">{facultad}</span>
              <span className="shrink-0 text-xs text-muted">{carreras.length}</span>
              {isOpen ? (
                <ChevronUp size={14} className="shrink-0 text-muted" />
              ) : (
                <ChevronDown size={14} className="shrink-0 text-muted" />
              )}
            </button>
            {isOpen && (
              <div className="border-t border-border">
                <CarrerasList
                  carreras={carreras}
                  bordered={false}
                  scroll={scroll}
                  bg={bg}
                  highlightCareer={highlightCareer}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
