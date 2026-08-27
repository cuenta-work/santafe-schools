import raw from "@/data/localities.json";
import type { Locality } from "./types";

export const localities: Locality[] = raw as Locality[];

export function getLocalityBySlug(slug: string | null | undefined): Locality | undefined {
  if (!slug) return undefined;
  return localities.find((l) => l.slug === slug);
}

export function getLocalityNames(): string[] {
  return localities.map((l) => l.name);
}

export function getRegions(): string[] {
  const set = new Set<string>();
  localities.forEach((l) => set.add(l.region));
  return Array.from(set);
}
