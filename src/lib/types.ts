export type Level = "jardin" | "primaria" | "secundaria" | "terciario" | "universidad";

export type Sector = "publico" | "privado";

export type Modalidad = "jornada simple" | "jornada completa" | "doble escolaridad" | null;

export type Genero = "mixto" | "solo mujeres" | "solo varones";

export type CostTier = "$" | "$$" | "$$$" | null;

export interface Carrera {
  nombre: string;
  titulo?: string | null;
  duracionAnios: number;
  duracionLabel: string;
  modalidad?: string | null;
}

export interface Institution {
  id: string;
  name: string;
  levels: Level[];
  sector: Sector;
  localidad: string;
  region: string;
  barrio: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  description: string;
  modalidad: Modalidad;
  genero: Genero;
  bilingue: string | null;
  religioso: string | null;
  costTier: CostTier;
  orientaciones: string[];
  carreras: Carrera[];
  featured?: boolean;
  verified?: boolean;
  foundedYear?: number | null;
  lat?: number | null;
  lon?: number | null;
  logoDomain?: string | null;
  source?: string | null;
}

export type LocalityKind = "ciudad" | "pueblo" | "comuna" | "barrio";

export interface LocalityLink {
  label: string;
  url: string;
}

export interface Locality {
  slug: string;
  name: string;
  region: string;
  kind: LocalityKind;
  description: string;
  links: LocalityLink[];
}

export const LEVEL_LABELS: Record<Level, string> = {
  jardin: "Jardines de infantes",
  primaria: "Escuelas primarias",
  secundaria: "Escuelas secundarias",
  terciario: "Institutos terciarios",
  universidad: "Universidades",
};

export const LEVEL_SHORT: Record<Level, string> = {
  jardin: "Jardín",
  primaria: "Primaria",
  secundaria: "Secundaria",
  terciario: "Terciario",
  universidad: "Universidad",
};

export const LEVEL_BLURB: Record<Level, string> = {
  jardin: "Sala de 2 a 5 años, los primeros pasos",
  primaria: "De 1° a 6°/7° grado",
  secundaria: "De 1° a 5°/6° año, con orientación",
  terciario: "Profesorados, tecnicaturas y carreras cortas",
  universidad: "Grado, pregrado y posgrado",
};

export const SECTOR_LABELS: Record<Sector, string> = {
  publico: "Gestión pública",
  privado: "Gestión privada",
};

export const SECTOR_SHORT: Record<Sector, string> = {
  publico: "Pública",
  privado: "Privada",
};

export const LOCALITY_KIND_LABELS: Record<LocalityKind, string> = {
  ciudad: "Ciudad",
  pueblo: "Localidad",
  comuna: "Comuna",
  barrio: "Barrio",
};
