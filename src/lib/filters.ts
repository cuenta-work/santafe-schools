import type { Level, Sector, TipoSecundaria } from "./types";
import type { LatLon } from "./geo";

// Derivado de "religioso" en los datos (no es un campo propio): "religiosa"
// si la institución tiene algo cargado en `religioso`, "laica" si no. Vive
// como pills en el cuadro de Gestión, separado del switch "solo religiosas".
export type Religion = "religiosa" | "laica";

export interface FiltersState {
  levels: Set<Level>;
  // false (default): institución con AL MENOS uno de los niveles marcados.
  // true: institución que tenga TODOS los niveles marcados a la vez -- para
  // buscar, por ejemplo, "que tenga primaria y secundaria" en un mismo
  // colegio, no cualquiera de las dos por separado.
  levelsMatchAll: boolean;
  sectors: Set<Sector>;
  religion: Set<Religion>;
  localidad: string | null;
  modalidad: string | null;
  genero: string | null;
  tipoSecundaria: TipoSecundaria | null;
  bilingueOnly: boolean;
  religiosoOnly: boolean;
  virtualOnly: boolean;
  featuredOnly: boolean;
  posgradoOnly: boolean;
  becasOnly: boolean;
  search: string;
  // Filtro de cercanía ("¿Dónde estás?"): se combina con el resto (AND),
  // no los reemplaza -- se puede buscar "jardines públicos a menos de
  // 3km de mi ubicación" al mismo tiempo.
  origin: LatLon | null;
  radiusKm: number;
}

export function emptyFilters(): FiltersState {
  return {
    levels: new Set(),
    levelsMatchAll: false,
    sectors: new Set(),
    religion: new Set(),
    localidad: null,
    modalidad: null,
    genero: null,
    tipoSecundaria: null,
    bilingueOnly: false,
    religiosoOnly: false,
    virtualOnly: false,
    featuredOnly: false,
    posgradoOnly: false,
    becasOnly: false,
    search: "",
    origin: null,
    radiusKm: 3,
  };
}

export function hasActiveFilters(f: FiltersState): boolean {
  return (
    f.levels.size > 0 ||
    f.sectors.size > 0 ||
    f.religion.size > 0 ||
    !!f.localidad ||
    !!f.modalidad ||
    !!f.genero ||
    !!f.tipoSecundaria ||
    f.bilingueOnly ||
    f.religiosoOnly ||
    f.virtualOnly ||
    f.featuredOnly ||
    f.posgradoOnly ||
    f.becasOnly ||
    f.search.length > 0 ||
    !!f.origin
  );
}

export function countActiveFilters(f: FiltersState): number {
  return (
    f.levels.size +
    f.sectors.size +
    f.religion.size +
    (f.localidad ? 1 : 0) +
    (f.modalidad ? 1 : 0) +
    (f.genero ? 1 : 0) +
    (f.tipoSecundaria ? 1 : 0) +
    (f.bilingueOnly ? 1 : 0) +
    (f.religiosoOnly ? 1 : 0) +
    (f.virtualOnly ? 1 : 0) +
    (f.featuredOnly ? 1 : 0) +
    (f.posgradoOnly ? 1 : 0) +
    (f.becasOnly ? 1 : 0) +
    (f.search ? 1 : 0) +
    (f.origin ? 1 : 0)
  );
}
