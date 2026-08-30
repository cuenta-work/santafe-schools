import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  AtSign,
  Globe,
  Phone,
  Mail,
  ArrowLeft,
  Star,
  Sparkles,
  GraduationCap,
  Library,
  LogIn,
  Users2,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { institutions } from "@/lib/data";
import { LEVEL_LABELS, LEVEL_EMOJI, SECTOR_LABELS, sortLevels } from "@/lib/types";
import { instagramUrl, instagramUsername, phoneHref, locationLine } from "@/lib/format";
import { institutionTint } from "@/lib/institutionColor";
import InstitutionLogo from "@/components/InstitutionLogo";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CarrerasList, FacultadesAccordion } from "@/components/CarrerasList";
import { facultadGroupsOf } from "@/lib/carreras";

const SITE_URL = "https://santafe-schools.vercel.app";

export function generateStaticParams() {
  return institutions.map((i) => ({ id: i.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const institution = institutions.find((i) => i.id === id);
  if (!institution) return {};

  const title = `${institution.name} — ${sortLevels(institution.levels).map((l) => LEVEL_LABELS[l]).join(", ")} en ${institution.localidad}`;
  const description =
    institution.description.length > 155
      ? `${institution.description.slice(0, 152)}...`
      : institution.description;

  return {
    title,
    description,
    alternates: { canonical: `/institucion/${institution.id}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/institucion/${institution.id}`,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function InstitutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const institution = institutions.find((i) => i.id === id);
  if (!institution) notFound();

  const tint = institutionTint(institution.id);
  const igUrl = instagramUrl(institution.instagram);
  const hasCurricula = institution.orientaciones.length > 0 || institution.carreras.length > 0;
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
    <div className="flex flex-1 flex-col bg-background">
      <NavBar />
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 lg:px-8">
        <Link
          href="/#buscador"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-primary-dark"
        >
          <ArrowLeft size={15} /> Volver a la guía completa
        </Link>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="relative flex h-28 items-end px-6 pb-4" style={{ background: tint.bg }}>
            {institution.featured && (
              <span className="flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-[10px] font-semibold text-gold shadow-sm">
                <Star size={11} fill="currentColor" /> Destacada
              </span>
            )}
            <span className="absolute left-6 z-10 rounded-2xl ring-4 ring-card" style={{ bottom: -28 }}>
              <InstitutionLogo
                id={institution.id}
                name={institution.name}
                domain={institution.logoDomain}
                size={64}
              />
            </span>
          </div>

          <div className="flex flex-col gap-4 p-6 pt-9">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                {sortLevels(institution.levels)
                  .map((l) => `${LEVEL_EMOJI[l]} ${LEVEL_LABELS[l]}`)
                  .join(" · ")}
                <span className="text-muted"> · {SECTOR_LABELS[institution.sector]}</span>
              </p>
              <h1 className="mt-0.5 font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                {institution.name}
              </h1>
            </div>

            {(institution.address || institution.localidad) && (
              <p className="flex items-start gap-1.5 text-sm text-muted">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>{locationLine(institution)}</span>
              </p>
            )}

            <p className="text-base leading-relaxed text-foreground/90">
              {institution.description}
            </p>

            {highlights.length > 0 && (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {highlights.map((h) => (
                  <div key={h.label} className="rounded-xl border border-border bg-background p-3.5">
                    <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary-dark">
                      <Sparkles size={11} /> {h.label}
                    </p>
                    <p className="text-xs leading-relaxed text-foreground/80">{h.text}</p>
                  </div>
                ))}
              </div>
            )}

            {hasCurricula && (
              <div className="border-t border-border pt-4">
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
                  (facultadGroupsOf(institution.carreras).length > 1 ? (
                    <FacultadesAccordion
                      groups={facultadGroupsOf(institution.carreras)}
                      scroll={false}
                      bg="bg-background"
                    />
                  ) : (
                    <CarrerasList carreras={institution.carreras} scroll={false} bg="bg-background" />
                  ))}
              </div>
            )}

            {institution.posgrados && institution.posgrados.length > 0 && (
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
            )}

            {resourceLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resourceLinks.map((link) => {
                  const Icon = RESOURCE_ICON[link.kind] ?? LinkIcon;
                  return (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:border-primary hover:text-primary-dark"
                    >
                      <Icon size={13} /> {link.label} <ExternalLink size={10} className="opacity-60" />
                    </a>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm">
              {institution.phone && (
                <a
                  href={phoneHref(institution.phone)}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-muted transition hover:border-primary hover:text-primary-dark"
                >
                  <Phone size={14} /> {institution.phone}
                </a>
              )}
              {institution.email && (
                <a
                  href={`mailto:${institution.email}`}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-muted transition hover:border-primary hover:text-primary-dark"
                >
                  <Mail size={14} /> {institution.email}
                </a>
              )}
              {igUrl && (
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-muted transition hover:border-primary hover:text-primary-dark"
                >
                  <AtSign size={14} /> {instagramUsername(institution.instagram)}
                </a>
              )}
              {institution.website && (
                <a
                  href={institution.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 font-semibold text-white transition hover:bg-primary-dark"
                >
                  <Globe size={14} /> Sitio oficial
                </a>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          ¿Sos parte de {institution.name} y hay algo para corregir?{" "}
          <Link href="/#contacto" className="font-medium text-primary-dark hover:underline">
            Escribinos
          </Link>
          .
        </p>
      </div>
      <Footer />
    </div>
  );
}
