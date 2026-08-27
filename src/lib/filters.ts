import type { Level, Sector } from "./types";

export interface FiltersState {
  levels: Set<Level>;
  sectors: Set<Sector>;
  localidad: string | null;
  modalidad: string | null;
  genero: string | null;
  bilingueOnly: boolean;
  featuredOnly: boolean;
  search: string;
}

export function emptyFilters(): FiltersState {
  return {
    levels: new Set(),
    sectors: new Set(),
    localidad: null,
    modalidad: null,
    genero: null,
    bilingueOnly: false,
    featuredOnly: false,
    search: "",
  };
}

export function hasActiveFilters(f: FiltersState): boolean {
  return (
    f.levels.size > 0 ||
    f.sectors.size > 0 ||
    !!f.localidad ||
    !!f.modalidad ||
    !!f.genero ||
    f.bilingueOnly ||
    f.featuredOnly ||
    f.search.length > 0
  );
}

export function countActiveFilters(f: FiltersState): number {
  return (
    f.levels.size +
    f.sectors.size +
    (f.localidad ? 1 : 0) +
    (f.modalidad ? 1 : 0) +
    (f.genero ? 1 : 0) +
    (f.bilingueOnly ? 1 : 0) +
    (f.featuredOnly ? 1 : 0) +
    (f.search ? 1 : 0)
  );
}
