import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, AtSign, Globe, Phone, Mail, Clock, ArrowLeft, Star } from "lucide-react";
import { institutions } from "@/lib/data";
import { LEVEL_LABELS, SECTOR_LABELS } from "@/lib/types";
import { instagramUrl, instagramUsername, phoneHref, locationLine } from "@/lib/format";
import { institutionTint } from "@/lib/institutionColor";
import InstitutionLogo from "@/components/InstitutionLogo";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

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

  const title = `${institution.name} — ${institution.levels.map((l) => LEVEL_LABELS[l]).join(", ")} en ${institution.localidad}`;
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
                {institution.levels.map((l) => LEVEL_LABELS[l]).join(" · ")}
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
                {institution.carreras.length > 0 && (
                  <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
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
