"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Institution, Level, Sector } from "@/lib/types";
import { emptyFilters, type FiltersState } from "@/lib/filters";
import { getLocalityNames } from "@/lib/localities";

interface FiltersContextValue {
  institutions: Institution[];
  filters: FiltersState;
  setFilters: (f: FiltersState) => void;
  filtered: Institution[];
  localidades: string[];
  levelCounts: Record<Level, number>;
  sectorCounts: Record<Sector, number>;
  showOnlyLevel: (level: Level) => void;
  selected: Institution | null;
  setSelected: (v: Institution | null) => void;
  favorites: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({
  institutions,
  children,
}: {
  institutions: Institution[];
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useState<FiltersState>(emptyFilters());
  const [selected, setSelected] = useState<Institution | null>(null);

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const saved = localStorage.getItem("favorites");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setFavorites(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem("favorites", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const isFavorite = (id: string) => favorites.has(id);

  const localidades = useMemo(() => {
    const set = new Set<string>();
    institutions.forEach((i) => set.add(i.localidad));
    getLocalityNames().forEach((n) => set.add(n));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [institutions]);

  const levelCounts = useMemo(() => {
    const counts: Record<Level, number> = {
      jardin: 0,
      primaria: 0,
      secundaria: 0,
      terciario: 0,
      universidad: 0,
    };
    institutions.forEach((i) => i.levels.forEach((l) => (counts[l] += 1)));
    return counts;
  }, [institutions]);

  const sectorCounts = useMemo(() => {
    const counts: Record<Sector, number> = { publico: 0, privado: 0 };
    institutions.forEach((i) => (counts[i.sector] += 1));
    return counts;
  }, [institutions]);

  const searchIndex = useMemo(() => {
    const index = new Map<string, string>();
    institutions.forEach((i) => {
      const parts = [
        i.name,
        i.description,
        i.address,
        i.localidad,
        i.region,
        i.barrio,
        ...i.orientaciones,
        ...i.carreras.map((c) => c.nombre),
      ];
      index.set(i.id, parts.filter(Boolean).join(" ").toLowerCase());
    });
    return index;
  }, [institutions]);

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return institutions.filter((i) => {
      if (filters.levels.size > 0 && !i.levels.some((l) => filters.levels.has(l)))
        return false;
      if (filters.sectors.size > 0 && !filters.sectors.has(i.sector)) return false;
      if (filters.localidad && i.localidad !== filters.localidad) return false;
      if (filters.modalidad && i.modalidad !== filters.modalidad) return false;
      if (filters.genero && i.genero !== filters.genero) return false;
      if (filters.bilingueOnly && !i.bilingue) return false;
      if (filters.featuredOnly && !i.featured) return false;
      if (search && !searchIndex.get(i.id)?.includes(search)) return false;
      return true;
    });
  }, [institutions, filters, searchIndex]);

  const showOnlyLevel = (level: Level) => {
    setFilters({ ...emptyFilters(), levels: new Set([level]) });
  };

  return (
    <FiltersContext.Provider
      value={{
        institutions,
        filters,
        setFilters,
        filtered,
        localidades,
        levelCounts,
        sectorCounts,
        showOnlyLevel,
        selected,
        setSelected,
        favorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used within FiltersProvider");
  return ctx;
}
