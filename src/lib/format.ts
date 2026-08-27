import type { Institution } from "./types";

// Los teléfonos en institutions.json están escritos como los carga cada
// fuente (con espacios, guiones, +54, códigos de área locales, etc.) --
// tel: necesita solo dígitos y el "+" inicial si es un número con código
// de país.
export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function formatTag(tag: string): string {
  return tag
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function instagramHandle(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/([^/?#]+)/i);
  if (match) return `@${match[1]}`;
  if (url.startsWith("@")) return url;
  return url;
}

export function instagramUsername(url: string | null): string | null {
  const handle = instagramHandle(url);
  return handle ? handle.replace(/^@/, "") : null;
}

export function instagramUrl(value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  const handle = value.replace(/^@/, "");
  return `https://instagram.com/${handle}`;
}

// Línea de ubicación para las cards: "dirección · localidad", salvo que la
// localidad ya esté mencionada dentro del texto de la dirección.
export function locationLine(inst: Pick<Institution, "address" | "localidad">): string | null {
  const { address, localidad } = inst;
  if (!address && !localidad) return null;
  if (!address) return localidad;
  if (!localidad || address.toLowerCase().includes(localidad.toLowerCase())) {
    return address;
  }
  return `${address} · ${localidad}`;
}

export function googleMapsUrl(name: string, address: string | null, localidad: string): string {
  const query = [name, address, localidad, "Santa Fe, Argentina"]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function websiteHostname(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
