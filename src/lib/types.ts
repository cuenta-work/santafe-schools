export type Level = "jardin" | "primaria" | "secundaria" | "terciario" | "universidad";

export type Sector = "publico" | "privado";

export type Modalidad = "jornada simple" | "jornada completa" | "doble escolaridad" | null;

export type Genero = "mixto" | "solo mujeres" | "solo varones";

export type TipoSecundaria = "tecnica" | "orientada";

export type CostTier = "$" | "$$" | "$$$" | null;

export interface Carrera {
  nombre: string;
  titulo?: string | null;
  duracionAnios: number;
  duracionLabel: string;
  modalidad?: string | null;
}

export interface ResourceLink {
  label: string;
  url: string;
  kind: "biblioteca" | "ingreso" | "carreras" | "campus" | "centro_estudiantes" | "otro";
}

export interface Highlight {
  label: string;
  text: string;
}

// "nacional": programas del Estado (Beca Progresar, Beca Manuel Belgrano,
// etc.) que no son un beneficio propio de la institución -- están
// disponibles, con sus propios requisitos, en la mayoría de las
// universidades públicas del país. "institucional": becas que otorga la
// propia institución (por promedio, deportivas, por hermanos, etc.).
export interface Beca {
  nombre: string;
  alcance: "nacional" | "institucional";
  descripcion?: string | null;
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
  tipoSecundaria?: TipoSecundaria | null;
  carreras: Carrera[];
  posgrados?: string[];
  featured?: boolean;
  // Pick personal del equipo (mismo criterio que "fungirakPick" en
  // santafe-gourmet) -- independiente de "featured", que es más bien
  // institucional/curatorial.
  fungirakPick?: boolean;
  verified?: boolean;
  foundedYear?: number | null;
  lat?: number | null;
  lon?: number | null;
  // "direccion": geocodificado desde la calle y altura reales.
  // "localidad": no encontramos la dirección exacta -- es el centro de la
  // ciudad/pueblo, útil para ubicar la zona pero no la puerta exacta.
  geoPrecision?: "direccion" | "localidad" | null;
  turno?: "mañana" | "tarde" | "noche" | "completo" | null;
  logoDomain?: string | null;
  // Imagen de portada tomada del og:image del sitio oficial de la
  // institución -- gratis, sin API key. Si no se encuentra, se usa el
  // color + ícono de siempre.
  coverImage?: string | null;
  source?: string | null;
  highlights?: Highlight[];
  resourceLinks?: ResourceLink[];
  becas?: Beca[];
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

// Orden pedagógico fijo -- maternal/jardín primero, universidad al final --
// para que cualquier lista de niveles se muestre siempre igual sin
// importar el orden en que estén cargados en los datos.
export const LEVEL_ORDER: Level[] = [
  "jardin",
  "primaria",
  "secundaria",
  "terciario",
  "universidad",
];

export function sortLevels(levels: Level[]): Level[] {
  return LEVEL_ORDER.filter((l) => levels.includes(l));
}

export const LEVEL_LABELS: Record<Level, string> = {
  jardin: "Maternales y jardines",
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

export const LEVEL_EMOJI: Record<Level, string> = {
  jardin: "🧸",
  primaria: "🎒",
  secundaria: "✏️",
  terciario: "🎓",
  universidad: "🎓",
};

export const SECTOR_EMOJI: Record<Sector, string> = {
  publico: "🏛️",
  privado: "🏫",
};

export const TIPO_SECUNDARIA_LABELS: Record<TipoSecundaria, string> = {
  tecnica: "Técnica",
  orientada: "Orientada (bachiller)",
};

export const TIPO_SECUNDARIA_EMOJI: Record<TipoSecundaria, string> = {
  tecnica: "⚙️",
  orientada: "📖",
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
