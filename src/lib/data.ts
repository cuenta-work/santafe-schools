import raw from "@/data/institutions.json";
import type { Institution, Level, Sector, Carrera } from "./types";
import { getLocalityNames } from "./localities";

export const institutions: Institution[] = raw as Institution[];

export function getLocalidades(): string[] {
  const set = new Set<string>();
  institutions.forEach((i) => set.add(i.localidad));
  getLocalityNames().forEach((n) => set.add(n));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}

export function getFeatured(): Institution[] {
  return institutions.filter((i) => i.featured);
}

export function getLevelCounts(): Record<Level, number> {
  const counts: Record<Level, number> = {
    jardin: 0,
    primaria: 0,
    secundaria: 0,
    terciario: 0,
    universidad: 0,
  };
  institutions.forEach((i) => i.levels.forEach((l) => (counts[l] += 1)));
  return counts;
}

export function getSectorCounts(): Record<Sector, number> {
  const counts: Record<Sector, number> = { publico: 0, privado: 0 };
  institutions.forEach((i) => (counts[i.sector] += 1));
  return counts;
}

export interface CarreraEntry extends Carrera {
  institutionId: string;
  institutionName: string;
  localidad: string;
}

// Índice plano de todas las carreras/tecnicatuas/profesorados de terciarios
// y universidades, para el buscador de carreras -- cada fila sabe a qué
// institución pertenece sin tener que recorrer institutions de nuevo.
export function getAllCarreras(): CarreraEntry[] {
  const rows: CarreraEntry[] = [];
  institutions.forEach((i) => {
    i.carreras.forEach((c) => {
      rows.push({ ...c, institutionId: i.id, institutionName: i.name, localidad: i.localidad });
    });
  });
  return rows;
}

export function getAllOrientaciones(): string[] {
  const set = new Set<string>();
  institutions.forEach((i) => i.orientaciones.forEach((o) => set.add(o)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}
