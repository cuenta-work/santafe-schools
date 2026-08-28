import type { Level, Sector, TipoSecundaria } from "./types";
import type { LatLon } from "./geo";

export interface FiltersState {
  levels: Set<Level>;
  sectors: Set<Sector>;
  localidad: string | null;
  modalidad: string | null;
  genero: string | null;
  tipoSecundaria: TipoSecundaria | null;
  bilingueOnly: boolean;
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
    sectors: new Set(),
    localidad: null,
    modalidad: null,
    genero: null,
    tipoSecundaria: null,
    bilingueOnly: false,
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
    !!f.localidad ||
    !!f.modalidad ||
    !!f.genero ||
    !!f.tipoSecundaria ||
    f.bilingueOnly ||
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
    (f.localidad ? 1 : 0) +
    (f.modalidad ? 1 : 0) +
    (f.genero ? 1 : 0) +
    (f.tipoSecundaria ? 1 : 0) +
    (f.bilingueOnly ? 1 : 0) +
    (f.featuredOnly ? 1 : 0) +
    (f.posgradoOnly ? 1 : 0) +
    (f.becasOnly ? 1 : 0) +
    (f.search ? 1 : 0) +
    (f.origin ? 1 : 0)
  );
}
