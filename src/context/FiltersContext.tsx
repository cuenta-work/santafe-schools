"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Institution, Level, Sector } from "@/lib/types";
import { emptyFilters, type FiltersState, type Religion } from "@/lib/filters";
import { getLocalityNames } from "@/lib/localities";
import { distanceKm } from "@/lib/geo";
import { isCapital } from "@/lib/localityPriority";

interface FiltersContextValue {
  institutions: Institution[];
  filters: FiltersState;
  setFilters: (f: FiltersState) => void;
  filtered: Institution[];
  // Distancia (en km) al origen elegido en "¿Dónde estás?", solo para las
  // instituciones que quedaron en `filtered` cuando filters.origin está
  // activo.
  distances: Map<string, number>;
  localidades: string[];
  levelCounts: Record<Level, number>;
  sectorCounts: Record<Sector, number>;
  posgradoCount: number;
  becasCount: number;
  religiosoCount: number;
  religionCounts: Record<Religion, number>;
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

  const posgradoCount = useMemo(
    () => institutions.filter((i) => i.posgrados && i.posgrados.length > 0).length,
    [institutions]
  );

  const becasCount = useMemo(
    () => institutions.filter((i) => i.becas && i.becas.length > 0).length,
    [institutions]
  );

  const religiosoCount = useMemo(
    () => institutions.filter((i) => i.religioso).length,
    [institutions]
  );

  const religionCounts = useMemo(() => {
    const counts: Record<Religion, number> = { religiosa: 0, laica: 0 };
    institutions.forEach((i) => (counts[i.religioso ? "religiosa" : "laica"] += 1));
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

  const { filtered, distances } = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const distances = new Map<string, number>();
    const list = institutions.filter((i) => {
      if (filters.levels.size > 0) {
        const matches = filters.levelsMatchAll
          ? Array.from(filters.levels).every((l) => i.levels.includes(l))
          : i.levels.some((l) => filters.levels.has(l));
        if (!matches) return false;
      }
      if (filters.sectors.size > 0 && !filters.sectors.has(i.sector)) return false;
      if (filters.religion.size > 0 && !filters.religion.has(i.religioso ? "religiosa" : "laica"))
        return false;
      if (filters.localidad && i.localidad !== filters.localidad) return false;
      if (filters.modalidad && i.modalidad !== filters.modalidad) return false;
      if (filters.genero && i.genero !== filters.genero) return false;
      if (filters.tipoSecundaria && i.tipoSecundaria !== filters.tipoSecundaria) return false;
      if (filters.bilingueOnly && !i.bilingue) return false;
      if (filters.religiosoOnly && !i.religioso) return false;
      if (filters.featuredOnly && !i.featured) return false;
      if (filters.posgradoOnly && !(i.posgrados && i.posgrados.length > 0)) return false;
      if (filters.becasOnly && !(i.becas && i.becas.length > 0)) return false;
      if (filters.origin) {
        if (i.lat == null || i.lon == null) return false;
        const km = distanceKm(filters.origin, { lat: i.lat, lon: i.lon });
        if (km > filters.radiusKm) return false;
        distances.set(i.id, km);
      }
      if (search && !searchIndex.get(i.id)?.includes(search)) return false;
      return true;
    });
    if (filters.origin) {
      list.sort((a, b) => (distances.get(a.id) ?? Infinity) - (distances.get(b.id) ?? Infinity));
    } else if (!filters.localidad) {
      // Sin zona ni ubicación elegida, el surtido por defecto encabeza con
      // Santa Fe capital -- el resto de la provincia sigue ahí abajo,
      // totalmente buscable con los demás filtros.
      list.sort((a, b) => Number(isCapital(b.localidad)) - Number(isCapital(a.localidad)));
    }
    return { filtered: list, distances };
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
        distances,
        localidades,
        levelCounts,
        sectorCounts,
        posgradoCount,
        becasCount,
        religiosoCount,
        religionCounts,
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
