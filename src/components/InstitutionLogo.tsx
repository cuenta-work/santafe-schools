"use client";

import { useState } from "react";
import { institutionLogoUrl } from "@/lib/institutionColor";
import Monogram from "./Monogram";

// Muestra el logo real de la institución (el favicon de su sitio oficial,
// que casi siempre es su isotipo) cuando conocemos el dominio -- y cae al
// monograma con iniciales apenas la imagen falla en cargar o no hay
// dominio conocido. Sin necesidad de alojar ni curar un logo a mano por
// cada una de las instituciones.
export default function InstitutionLogo({
  id,
  name,
  domain,
  size = 40,
}: {
  id: string;
  name: string;
  domain?: string | null;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (!domain || failed) {
    return <Monogram id={id} name={name} size={size} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={institutionLogoUrl(domain, Math.max(64, size * 2))}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-xl border border-border bg-card object-contain p-1.5 shadow-sm"
      style={{ width: size, height: size }}
    />
  );
}
