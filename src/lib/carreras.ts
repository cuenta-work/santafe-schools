import type { Carrera } from "./types";

// Agrupa las carreras por facultad/unidad académica. Se usa cuando una
// institución tiene carreras cargadas en más de una facultad (hoy, la UNL)
// -- así, en vez de mezclar decenas de carreras en una sola lista, se puede
// abrir cada facultad por separado. Vive fuera de CarrerasList.tsx (que es
// "use client") para poder llamarse también desde server components.
export function facultadGroupsOf(carreras: Carrera[]): [string, Carrera[]][] {
  const groups: [string, Carrera[]][] = [];
  carreras.forEach((c) => {
    if (!c.facultad) return;
    const group = groups.find(([f]) => f === c.facultad);
    if (group) group[1].push(c);
    else groups.push([c.facultad, [c]]);
  });
  return groups;
}
