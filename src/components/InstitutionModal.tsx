"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
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
  HeartHandshake,
  Award,
  Star,
} from "lucide-react";
import type { Institution, Highlight } from "@/lib/types";
import { LEVEL_LABELS, LEVEL_EMOJI, SECTOR_LABELS, sortLevels } from "@/lib/types";
import { instagramUrl, instagramUsername, googleMapsUrl, locationLine, phoneHref } from "@/lib/format";
import { useSwipeToDismiss } from "@/hooks/useSwipeToDismiss";
import { useFilters } from "@/context/FiltersContext";
import { copyToClipboard } from "@/lib/share";
import { AUTHOR } from "@/lib/author";
import InstitutionLogo from "./InstitutionLogo";
import SafeIframe from "./SafeIframe";
import { CarrerasList, FacultadesAccordion } from "./CarrerasList";
import { facultadGroupsOf } from "@/lib/carreras";

const CityMap = dynamic(() => import("./CityMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[220px] w-full items-center justify-center rounded-xl border border-border bg-background text-sm text-muted">
      Cargando el mapa...
    </div>
  ),
});

export default function InstitutionModal({
  institution,
  highlightCareer = null,
  onClose,
}: {
  institution: Institution;
  // Carrera puntual clickeada para llegar acá (p. ej. desde el buscador de
  // carreras) -- determina qué facultad abrir por defecto en el acordeón y
  // cuál fila resaltar, en vez de siempre abrir la primera facultad.
  highlightCareer?: string | null;
  onClose: () => void;
}) {
  const { isFavorite, toggleFavorite } = useFilters();
  const favorite = isFavorite(institution.id);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMap, setShowMap] = useState(false);
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
    // Un mensaje propio en vez de compartir la URL pelada -- así lo que
    // llega por WhatsApp/redes se lee como una recomendación, no como un
    // link a secas, y menciona el sitio en el proceso.
    const text = `📚 ${institution.name}${
      institution.localidad ? ` (${institution.localidad})` : ""
    } -- la encontré en Santa Fe Schools, la guía educativa de la provincia:`;
    if (navigator.share) {
      try {
        await navigator.share({ title: institution.name, text, url });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    try {
      await copyToClipboard(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  const { sheetRef, handleRef, contentRef, dragY, isDragging } = useSwipeToDismiss({
    onDismiss: onClose,
  });

  const hasCurricula = institution.orientaciones.length > 0 || institution.carreras.length > 0;
  // Instituciones con más de una facultad/unidad académica (hoy solo la
  // UNL tiene este dato cargado) muestran la currícula agrupada por
  // facultad en vez de una lista plana de decenas de carreras mezcladas.
  const facultadGroups = facultadGroupsOf(institution.carreras);
  const hasFacultades = facultadGroups.length > 1;
  const hasContact =
    institution.phone || institution.email || institution.website || institution.instagram;
  const highlights = institution.highlights ?? [];
  // En mobile, "Distintivo" se queda arriba (donde ya estaba) y el resto
  // de los datos-condimento (Historia, Vida académica, Para tener en
  // cuenta) se mandan al final del todo, después de Vida estudiantil. En
  // desktop no se separan -- van todos juntos como siempre.
  const distintivoHighlight = highlights.find((h) => h.label === "Distintivo");
  const otherHighlights = highlights.filter((h) => h.label !== "Distintivo");
  const resourceLinks = institution.resourceLinks ?? [];
  const becas = institution.becas ?? [];
  // La Beca Progresar y la Beca Manuel Belgrano son programas del Estado
  // nacional, no un beneficio propio de la institución -- solo tiene
  // sentido mencionarlos en terciarios y universidades (público o privado),
  // que es donde de verdad se usan; en jardín/primaria/secundaria no aplica.
  const showsNationalBecasNote =
    institution.levels.includes("universidad") || institution.levels.includes("terciario");

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
        {/* handleRef cubre la barrita + toda la cabecera -- es la única
            zona de la que se puede arrastrar la hoja para cerrarla. El
            contenido scrolleable de más abajo queda totalmente afuera de
            este gesto, así nunca compite con el scroll normal. */}
        <div ref={handleRef}>
        <div className="flex justify-center pt-2 sm:hidden" aria-hidden="true">
          <span className="h-1.5 w-10 rounded-full bg-border" />
        </div>
        <div className="flex flex-col gap-3 border-b border-border px-6 py-4 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex items-start justify-between gap-3 sm:justify-start">
            <InstitutionLogo
              id={institution.id}
              name={institution.name}
              domain={institution.logoDomain}
              size={48}
            />
            {/* En mobile los botones van en esta misma fila, a la altura
                del logo -- así el título de abajo queda libre para usar
                todo el ancho de la hoja en vez de compartir renglón con
                ellos y terminar partido en un montón de líneas. */}
            <div className="flex shrink-0 items-center gap-1 sm:hidden">
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

          <div className="flex min-w-0 flex-1 flex-col">
            {/* En mobile el nombre va primero (order-1) para poder usar
                todo el ancho de la hoja; el renglón de nivel/gestión baja
                a una línea propia debajo. En desktop se mantiene el orden
                de siempre. */}
            <p className="order-2 flex flex-wrap items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary sm:order-1">
              {sortLevels(institution.levels)
                .map((l) => `${LEVEL_EMOJI[l]} ${LEVEL_LABELS[l]}`)
                .join(" · ")}
              <span className="text-muted"> · {SECTOR_LABELS[institution.sector]}</span>
            </p>
            <h3 className="order-1 font-display text-2xl font-semibold leading-tight text-foreground sm:order-2">
              {institution.name}
            </h3>
            <p className="order-3 mt-0.5 text-xs text-muted">
              {institution.localidad}
              {institution.foundedYear && ` · fundada en ${institution.foundedYear}`}
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-1 sm:flex">
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
        </div>

        {/* contentRef: acá el gesto de cerrar solo se activa cuando el
            scroll ya está en el tope y el dedo sigue bajando (como
            "pull to dismiss" nativo) -- mientras haya contenido para
            scrollear, el scroll normal manda. */}
        <div ref={contentRef} className="scrollbar-thin flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 px-6 py-5">
            <p className="text-sm leading-relaxed text-foreground/85">{institution.description}</p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80">
                <Users size={13} /> {institution.genero}
              </span>
              {institution.modalidad && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80">
                  <Clock size={13} /> {institution.modalidad}
                </span>
              )}
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

            {/* Desktop: todos los highlights juntos, como siempre. */}
            {highlights.length > 0 && (
              <div className="hidden gap-2.5 sm:grid sm:grid-cols-2">
                {highlights.map((h) => (
                  <HighlightCard key={h.label} highlight={h} />
                ))}
              </div>
            )}

            {/* Mobile: solo "Distintivo" queda acá arriba -- el resto
                (Historia, Vida académica, Para tener en cuenta) se
                renderiza más abajo de todo, después de Vida estudiantil. */}
            {distintivoHighlight && (
              <div className="grid grid-cols-1 gap-2.5 sm:hidden">
                <HighlightCard highlight={distintivoHighlight} />
              </div>
            )}

            {/* Vista previa y Cómo llegar son la misma familia de
                elemento (accordion angosto, colapsado por defecto) --
                agrupados así quedan pegados entre sí en vez de heredar el
                mismo espaciado grande que separa al resto de las
                secciones más "pesadas" del modal. */}
            <div className="flex flex-col gap-2">
              {institution.website && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowPreview((v) => !v)}
                    className="flex w-full items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-primary-dark transition hover:border-primary"
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

              {(institution.address || institution.localidad) && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowMap((v) => !v)}
                  className="flex w-full items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-primary-dark transition hover:border-primary"
                >
                  <MapPin size={16} className="shrink-0 text-primary" />
                  <span className="flex-1">{locationLine(institution)}</span>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary-dark">
                    Cómo llegar
                    {showMap ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                </button>
                {showMap && (
                  <div className="mt-2 overflow-hidden rounded-xl border border-border">
                    {institution.lat != null && institution.lon != null && (
                      <CityMap
                        institutions={[institution]}
                        onSelect={() => {}}
                        height="220px"
                      />
                    )}
                    <a
                      href={googleMapsUrl(
                        institution.name,
                        institution.address,
                        institution.localidad
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 border-t border-border bg-card px-4 py-2.5 text-xs font-semibold text-primary-dark transition hover:bg-primary/5"
                    >
                      Abrir en Google Maps <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
              )}
            </div>

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

                {institution.carreras.length > 0 &&
                  (hasFacultades ? (
                    <FacultadesAccordion groups={facultadGroups} highlightCareer={highlightCareer} />
                  ) : (
                    <CarrerasList carreras={institution.carreras} highlightCareer={highlightCareer} />
                  ))}
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
                <div className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-2.5">
                  {resourceLinks.map((link) => {
                    const Icon = RESOURCE_ICON[link.kind] ?? LinkIcon;
                    return (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-medium text-primary-dark transition hover:border-primary hover:bg-background"
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

            {(institution.address || institution.localidad) && (
              <div>
                <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-sage">
                  <HeartHandshake size={13} /> Vida estudiantil
                </p>

                {becas.length > 0 && (
                  <div className="mb-2.5 flex flex-wrap gap-1.5">
                    {becas.map((b) => (
                      <span
                        key={b.nombre}
                        title={b.descripcion ?? undefined}
                        className={
                          b.alcance === "institucional"
                            ? "inline-flex items-center gap-1.5 rounded-full border border-sage/30 bg-sage/10 px-3 py-1.5 text-xs font-medium text-sage"
                            : "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/70"
                        }
                      >
                        <Award size={12} className="shrink-0" />
                        {b.nombre}
                        {b.alcance === "nacional" && (
                          <span className="opacity-70">· nacional</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}

                {showsNationalBecasNote && (
                  <p className="mb-2.5 text-[11px] leading-relaxed text-muted">
                    💡 Además de sus propias becas, este tipo de institución suele participar de
                    programas nacionales como la Beca Progresar o la Beca Manuel Belgrano --
                    consultá los requisitos actualizados directamente con la institución.
                  </p>
                )}

                <a
                  href={googleMapsUrl(institution.name, institution.address, institution.localidad)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted underline decoration-muted/40 underline-offset-2 transition hover:text-sage hover:decoration-sage/50"
                >
                  <Star size={11} className="shrink-0" />
                  Ver más reseñas en Google Maps
                  <ExternalLink size={10} className="shrink-0 opacity-60" />
                </a>
              </div>
            )}

            {/* Mobile: el resto de los datos-condimento, mandados al
                final del todo (ver nota más arriba, junto a "Distintivo"). */}
            {otherHighlights.length > 0 && (
              <div className="grid grid-cols-1 gap-2.5 sm:hidden">
                {otherHighlights.map((h) => (
                  <HighlightCard key={h.label} highlight={h} />
                ))}
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

function HighlightCard({ highlight }: { highlight: Highlight }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3.5">
      <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary-dark">
        <Sparkles size={11} /> {highlight.label}
      </p>
      <p className="text-xs leading-relaxed text-foreground/80">{highlight.text}</p>
    </div>
  );
}

