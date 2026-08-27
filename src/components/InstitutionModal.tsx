"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  AtSign,
  Globe,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Heart,
  Share2,
  Check,
  Clock,
  Languages,
  Church,
  Users,
  Wallet,
  GraduationCap,
  BookOpen,
  Sparkles,
  Library,
  LogIn,
  Users2,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Monitor,
} from "lucide-react";
import type { Institution } from "@/lib/types";
import { LEVEL_LABELS, LEVEL_EMOJI, SECTOR_LABELS, sortLevels } from "@/lib/types";
import { instagramUrl, instagramUsername, googleMapsUrl, locationLine, phoneHref } from "@/lib/format";
import { useSwipeToDismiss } from "@/hooks/useSwipeToDismiss";
import { useFilters } from "@/context/FiltersContext";
import { copyToClipboard } from "@/lib/share";
import { AUTHOR } from "@/lib/author";
import InstitutionLogo from "./InstitutionLogo";
import SafeIframe from "./SafeIframe";

export default function InstitutionModal({
  institution,
  onClose,
}: {
  institution: Institution;
  onClose: () => void;
}) {
  const { isFavorite, toggleFavorite } = useFilters();
  const favorite = isFavorite(institution.id);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showPreview) {
      // Se renderiza más abajo del botón que lo despliega -- sin este
      // scroll manual quedaba fuera de vista hasta que el usuario
      // scrolleaba el modal a mano para encontrarlo.
      const id = requestAnimationFrame(() => {
        previewRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [showPreview]);

  const shareInstitution = async () => {
    const url = `${window.location.origin}/institucion/${institution.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: institution.name, url });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    try {
      await copyToClipboard(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { sheetRef, dragY, isDragging } = useSwipeToDismiss({
    onDismiss: onClose,
    scrollRef: scrollAreaRef,
  });

  const hasCurricula = institution.orientaciones.length > 0 || institution.carreras.length > 0;
  const hasContact =
    institution.phone || institution.email || institution.website || institution.instagram;
  const highlights = institution.highlights ?? [];
  const resourceLinks = institution.resourceLinks ?? [];

  const RESOURCE_ICON: Record<string, typeof Library> = {
    biblioteca: Library,
    ingreso: LogIn,
    carreras: GraduationCap,
    campus: Globe,
    centro_estudiantes: Users2,
    otro: LinkIcon,
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-2xl lg:max-h-[90vh] lg:max-w-4xl"
        style={{
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? "none" : "transform 0.25s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-2 sm:hidden" aria-hidden="true">
          <span className="h-1.5 w-10 rounded-full bg-border" />
        </div>
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div className="flex items-start gap-3">
            <InstitutionLogo
              id={institution.id}
              name={institution.name}
              domain={institution.logoDomain}
              size={48}
            />
            <div>
              <p className="flex flex-wrap items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                {sortLevels(institution.levels)
                  .map((l) => `${LEVEL_EMOJI[l]} ${LEVEL_LABELS[l]}`)
                  .join(" · ")}
                <span className="text-muted"> · {SECTOR_LABELS[institution.sector]}</span>
              </p>
              <h3 className="font-display text-2xl font-semibold leading-tight text-foreground">
                {institution.name}
              </h3>
              <p className="mt-0.5 text-xs text-muted">
                {institution.localidad}
                {institution.foundedYear && ` · fundada en ${institution.foundedYear}`}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {institution.phone && (
              <a
                href={phoneHref(institution.phone)}
                aria-label={`Llamar a ${institution.name}`}
                className="rounded-full p-1.5 text-muted hover:bg-background hover:text-primary-dark"
              >
                <Phone size={18} />
              </a>
            )}
            <button
              onClick={() => toggleFavorite(institution.id)}
              aria-pressed={favorite}
              aria-label={favorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              className="rounded-full p-1.5 text-muted hover:bg-background hover:text-primary-dark"
            >
              <Heart size={19} className={favorite ? "fill-accent text-accent" : ""} />
            </button>
            <div className="relative">
              <button
                onClick={shareInstitution}
                aria-label={copied ? "Link copiado" : "Compartir esta institución"}
                className="rounded-full p-1.5 text-muted hover:bg-background hover:text-primary-dark"
              >
                {copied ? <Check size={18} className="text-sage" /> : <Share2 size={18} />}
              </button>
              {copied && (
                <span className="pointer-events-none absolute right-0 top-full mt-1 whitespace-nowrap rounded-full bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">
                  Link copiado
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="rounded-full p-1.5 text-muted hover:bg-background hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 px-6 py-5">
            <p className="text-sm leading-relaxed text-foreground/85">{institution.description}</p>

            {highlights.length > 0 && (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {highlights.map((h) => (
                  <div
                    key={h.label}
                    className="rounded-xl border border-border bg-background p-3.5"
                  >
                    <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary-dark">
                      <Sparkles size={11} /> {h.label}
                    </p>
                    <p className="text-xs leading-relaxed text-foreground/80">{h.text}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {institution.modalidad && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80">
                  <Clock size={13} /> {institution.modalidad}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80">
                <Users size={13} /> {institution.genero}
              </span>
              {institution.bilingue && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-dark">
                  <Languages size={13} /> Bilingüe · {institution.bilingue}
                </span>
              )}
              {institution.religioso && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80">
                  <Church size={13} /> {institution.religioso}
                </span>
              )}
              {institution.costTier && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-foreground/90">
                  <Wallet size={13} /> Arancel {institution.costTier}
                </span>
              )}
            </div>

            {(institution.address || institution.localidad) && (
              <a
                href={googleMapsUrl(institution.name, institution.address, institution.localidad)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition hover:border-primary"
              >
                <MapPin size={16} className="shrink-0 text-primary" />
                <span className="flex-1">{locationLine(institution)}</span>
                <span className="shrink-0 text-xs font-semibold text-primary-dark">
                  Cómo llegar
                </span>
              </a>
            )}

            {hasContact && (
              <div className="flex flex-wrap gap-2">
                {institution.phone && (
                  <a href={phoneHref(institution.phone)} className="pill">
                    <Phone size={15} /> {institution.phone}
                  </a>
                )}
                {institution.email && (
                  <a href={`mailto:${institution.email}`} className="pill">
                    <Mail size={15} /> {institution.email}
                  </a>
                )}
                {institution.instagram && (
                  <a
                    href={instagramUrl(institution.instagram) ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill"
                  >
                    <AtSign size={15} /> {instagramUsername(institution.instagram)}
                  </a>
                )}
                {institution.website && (
                  <a
                    href={institution.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill"
                  >
                    <Globe size={15} /> Sitio web <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}

            {hasCurricula && (
              <div>
                <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                  <BookOpen size={13} /> Currícula
                </p>

                {institution.orientaciones.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {institution.orientaciones.map((o) => (
                      <span
                        key={o}
                        className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary-dark"
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                )}

                {institution.carreras.length > 0 && (
                  <ul
                    className={`scrollbar-thin flex flex-col divide-y divide-border overflow-hidden overflow-y-auto rounded-xl border border-border bg-background ${
                      institution.carreras.length > 6 ? "max-h-72" : ""
                    }`}
                  >
                    {institution.carreras.map((c) => (
                      <li
                        key={c.nombre}
                        className="flex items-start justify-between gap-3 px-3.5 py-2.5 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="text-foreground">{c.nombre}</p>
                          {c.titulo && <p className="text-xs text-muted">{c.titulo}</p>}
                        </div>
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent-dark">
                          <Clock size={11} /> {c.duracionLabel}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {!hasCurricula && (
              <p className="flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-muted">
                <GraduationCap size={15} className="shrink-0" />
                Todavía no tenemos el detalle de orientación u oferta académica de esta
                institución.
              </p>
            )}

            {institution.posgrados && institution.posgrados.length > 0 && (
              <div>
                <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                  <GraduationCap size={13} /> Posgrado
                </p>
                <ul className="flex flex-col gap-1.5">
                  {institution.posgrados.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 rounded-xl border border-gold/25 bg-gold/5 px-3.5 py-2.5 text-xs text-foreground/85"
                    >
                      <Sparkles size={13} className="mt-0.5 shrink-0 text-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resourceLinks.length > 0 && (
              <div>
                <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                  <Library size={13} /> Recursos y links útiles
                </p>
                <div className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                  {resourceLinks.map((link) => {
                    const Icon = RESOURCE_ICON[link.kind] ?? LinkIcon;
                    return (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-glow flex shrink-0 items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground/85 transition hover:border-primary hover:text-primary-dark"
                      >
                        <Icon size={14} className="shrink-0 text-primary" />
                        {link.label}
                        <ExternalLink size={11} className="shrink-0 opacity-60" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {institution.website && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowPreview((v) => !v)}
                  className="flex w-full items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm text-foreground transition hover:border-primary"
                >
                  <Monitor size={16} className="shrink-0 text-primary" />
                  <span className="flex-1">Vista previa del sitio oficial</span>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary-dark">
                    {showPreview ? "Ocultar" : "Mostrar"}
                    {showPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                </button>
                {showPreview && (
                  <div ref={previewRef} className="mt-2 scroll-mt-4">
                    <SafeIframe
                      src={institution.website}
                      title={`Sitio de ${institution.name}`}
                      className="h-[50vh] w-full lg:h-[55vh]"
                    />
                  </div>
                )}
              </div>
            )}

            <p className="text-[11px] text-muted">
              {institution.source
                ? `Fuente: ${institution.source}.`
                : "Dato cargado a partir de fuentes públicas."}{" "}
              Si sos parte de esta institución y algo no es exacto, escribinos a{" "}
              <a href={`mailto:${AUTHOR.email}`} className="underline hover:text-primary-dark">
                {AUTHOR.email}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
