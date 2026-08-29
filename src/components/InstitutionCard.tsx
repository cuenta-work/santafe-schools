"use client";

import { MapPin, Star, Heart, Languages, Cog } from "lucide-react";
import type { Institution } from "@/lib/types";
import { LEVEL_SHORT, LEVEL_EMOJI, SECTOR_SHORT, SECTOR_EMOJI, sortLevels } from "@/lib/types";
import { locationLine } from "@/lib/format";
import { institutionTint } from "@/lib/institutionColor";
import { useFilters } from "@/context/FiltersContext";
import InstitutionLogo from "./InstitutionLogo";
import LevelCoverIcon from "./LevelCoverIcon";
import TruncatedTooltip from "./TruncatedTooltip";

export default function InstitutionCard({
  institution,
  onOpen,
  distanceLabel,
}: {
  institution: Institution;
  onOpen: (i: Institution) => void;
  distanceLabel?: string;
}) {
  const tint = institutionTint(institution.id);
  const { isFavorite, toggleFavorite } = useFilters();
  const favorite = isFavorite(institution.id);
  const sortedLevels = sortLevels(institution.levels);
  const manyLevels = sortedLevels.length > 3;
  // En web, a partir de 3 niveles el dato de gestión ya no entra prolijo
  // en el mismo renglón que todos los niveles -- así que ahí arriba se
  // muestran solo los primeros 2 niveles junto con el dato de gestión a
  // la derecha, y el resto de los niveles baja a un segundo renglón.
  const splitLevels = sortedLevels.length >= 3;
  const firstRowLevels = splitLevels ? sortedLevels.slice(0, 2) : sortedLevels;
  const secondRowLevels = splitLevels ? sortedLevels.slice(2) : [];
  const sectorBadge = (
    <span className="ml-auto shrink-0 text-[11px] font-semibold text-muted">
      {SECTOR_EMOJI[institution.sector]} {SECTOR_SHORT[institution.sector]}
    </span>
  );
  const levelPill = (l: (typeof sortedLevels)[number]) => (
    <span key={l} className="rounded-full bg-background px-2 py-0.5 text-[10px] text-foreground/70">
      {LEVEL_EMOJI[l]} {LEVEL_SHORT[l]}
    </span>
  );

  return (
    <button
      onClick={() => onOpen(institution)}
      className="card-glow shine group relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm"
    >
      <div
        className="relative flex h-20 items-center justify-end px-4"
        style={
          institution.coverImage
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.35)), url(${institution.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { background: tint.bg }
        }
      >
        {!institution.coverImage && (
          <LevelCoverIcon
            levels={institution.levels}
            size={60}
            strokeWidth={1.25}
            style={{ color: tint.icon }}
            className="-mr-2 -mt-2 opacity-70 transition group-hover:scale-110 group-hover:opacity-90"
          />
        )}
        <div className="absolute left-3 top-3 flex max-w-[calc(100%-2.5rem)] flex-row flex-wrap items-start gap-1">
          {institution.featured && (
            <span className="flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-[10px] font-semibold text-gold shadow-sm">
              <Star size={11} fill="currentColor" /> Destacada
            </span>
          )}
          {institution.tipoSecundaria === "tecnica" && (
            <span className="flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-[10px] font-semibold text-accent-dark shadow-sm">
              <Cog size={11} /> Técnica
            </span>
          )}
          {institution.bilingue && (
            <span className="flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-[10px] font-semibold text-primary-dark shadow-sm">
              <Languages size={11} /> Bilingüe
            </span>
          )}
        </div>
        <span className="absolute left-4 z-10 rounded-xl ring-4 ring-card" style={{ bottom: -26 }}>
          <InstitutionLogo
            id={institution.id}
            name={institution.name}
            domain={institution.logoDomain}
            size={52}
          />
        </span>
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col p-5 pt-8">
        {/* Va como primera línea del cuerpo, no superpuesta al header --
            ahí arriba ya hay hasta 3 badges (Destacada/Técnica/Bilingüe)
            más el logo pisando la esquina, así que sumar esta acá evita
            que se corten o se encimen entre sí, tanto en mobile como en
            desktop. */}
        {institution.fungirakPick && (
          <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-sage/10 px-2.5 py-1 text-[10px] font-semibold text-sage">
            <Heart size={11} className="fill-sage" /> Favorito de FUNGIRAK
          </span>
        )}
        {/* Mobile: con 4 o 5 niveles la fila se llena y el dato de gestión
            termina "cayendo" a una línea propia -- para esos casos lo
            sacamos a una posición fija en la esquina. Con 3 o menos entra
            bien en el mismo renglón. */}
        <div className="sm:hidden">
          {manyLevels && (
            <span className="absolute right-5 top-5 shrink-0 text-[11px] font-semibold text-muted">
              {SECTOR_EMOJI[institution.sector]} {SECTOR_SHORT[institution.sector]}
            </span>
          )}
          <div
            className={`flex flex-wrap items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted ${manyLevels ? "pr-16" : ""}`}
          >
            {sortedLevels.map(levelPill)}
            {!manyLevels && sectorBadge}
          </div>
        </div>

        {/* Desktop: a partir de 3 niveles, el primer renglón muestra solo
            los primeros 2 niveles junto con el dato de gestión a la
            derecha, y el resto de los niveles bajan a un segundo renglón,
            debajo. Con 1 o 2 niveles va todo junto, como siempre. */}
        <div className="hidden flex-col gap-1.5 text-xs font-medium uppercase tracking-wide text-muted sm:flex">
          <div className="flex flex-wrap items-center gap-1.5">
            {firstRowLevels.map(levelPill)}
            {sectorBadge}
          </div>
          {secondRowLevels.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {secondRowLevels.map(levelPill)}
            </div>
          )}
        </div>

        {distanceLabel && (
          <span className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary-dark">
            <MapPin size={10} /> {distanceLabel}
          </span>
        )}

        <div className="mt-1.5 flex items-start justify-between gap-2">
          <TruncatedTooltip
            heading
            text={institution.name}
            className="line-clamp-2 min-w-0 font-display text-lg font-semibold leading-snug text-foreground group-hover:text-primary-dark"
          />
          <span
            role="button"
            tabIndex={0}
            aria-pressed={favorite}
            aria-label={favorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(institution.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(institution.id);
              }
            }}
            className="mt-0.5 shrink-0 p-0.5 transition hover:scale-110 active:scale-95"
          >
            <Heart size={18} className={favorite ? "fill-accent text-accent" : "text-muted"} />
          </span>
        </div>

        {(institution.address || institution.localidad) && (
          <p className="mt-2 flex items-start gap-1 text-xs text-muted">
            <MapPin size={12} className="mt-0.5 shrink-0" />
            <span className="line-clamp-1 min-w-0">{locationLine(institution)}</span>
          </p>
        )}

        <p className="mt-3 line-clamp-2 flex-1 text-sm text-foreground/80">
          {institution.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {institution.orientaciones.slice(0, 2).map((o) => (
            <span
              key={o}
              className="rounded-full bg-background px-2 py-0.5 text-[11px] text-muted"
            >
              {o}
            </span>
          ))}
          {institution.carreras.slice(0, 2).map((c) => (
            <span
              key={c.nombre}
              className="rounded-full bg-background px-2 py-0.5 text-[11px] text-muted"
            >
              {c.nombre}
            </span>
          ))}
        </div>

        {institution.costTier && (
          <div className="mt-4 flex items-center gap-3 border-t border-border pt-3 text-xs text-muted">
            <span className="font-medium">🪙 {institution.costTier} arancel</span>
          </div>
        )}
      </div>
    </button>
  );
}
