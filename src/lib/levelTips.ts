import type { Level, Sector } from "./types";

export interface LevelTip {
  emoji: string;
  text: string;
  linkLabel?: string;
  linkUrl?: string;
}

// Datos prácticos reales, pensados para lo que a alguien realmente le
// sirve saber en el momento de buscar en ese nivel puntual (no genéricos
// de "elegí bien"). Verificados contra fuentes oficiales.
//
// Algunos varían según la gestión -- el "radio escolar" de primaria, por
// ejemplo, solo aplica a escuelas públicas -- así que hay una versión base
// por nivel y, cuando corresponde, una versión más específica por
// nivel+gestión que la reemplaza si el usuario tiene un único sector
// filtrado.
export const LEVEL_TIPS: Record<Level, LevelTip> = {
  jardin: {
    emoji: "👶",
    text: "En Argentina la sala de 4 y la sala de 5 son obligatorias por ley. Los cupos de jardín y maternal suelen agotarse rápido -- conviene averiguar fechas de inscripción con varios meses de anticipación, sea pública o privada.",
  },
  primaria: {
    emoji: "🏫",
    text: "En las escuelas públicas la vacante suele priorizarse por \"radio escolar\" (la zona más cercana a tu domicilio); en las privadas depende de la disponibilidad de cada colegio y suele convenir anotarse en más de una opción con tiempo.",
  },
  secundaria: {
    emoji: "🎓",
    text: "La orientación que elijas al empezar el Ciclo Orientado (desde 3er año) queda en el título secundario. Antes de anotarte, comparás las orientaciones de las escuelas cercanas -- no todas ofrecen las mismas.",
  },
  terciario: {
    emoji: "🚌",
    text: "Los alumnos regulares de nivel terciario -- de instituciones públicas o privadas por igual -- pueden tramitar el Boleto Educativo Gratuito de la provincia (2 viajes diarios sin cargo) desde la web o la app Mi Santa Fe.",
    linkLabel: "Boleto Educativo Gratuito",
    linkUrl: "https://www.santafe.gov.ar/boletoeducativo/informacion",
  },
  universidad: {
    emoji: "🚌",
    text: "Además del Boleto Educativo Gratuito provincial, la Beca Progresar (nacional) da un apoyo económico mensual a estudiantes de carreras universitarias y terciarias, sin importar si la institución es pública o privada.",
    linkLabel: "Becas Progresar",
    linkUrl: "https://www.argentina.gob.ar/becasprogresar",
  },
};

type LevelSectorKey = `${Level}:${Sector}`;

export const LEVEL_SECTOR_TIPS: Partial<Record<LevelSectorKey, LevelTip>> = {
  "jardin:publico": {
    emoji: "👶",
    text: "Sala de 4 y sala de 5 son obligatorias por ley. En los jardines públicos la inscripción suele ser en un período fijo a mitad de año para el ciclo lectivo siguiente -- averiguá la fecha exacta en cada uno, no es la misma en todos.",
    linkLabel: "Mesa de Orientación y Servicios (Ministerio)",
    linkUrl: "https://educacion.santafe.gob.ar/moys/",
  },
  "jardin:privado": {
    emoji: "👶",
    text: "Sala de 4 y sala de 5 son obligatorias por ley. En los jardines privados los cupos suelen agotarse muy rápido y varios piden entrevista previa -- conviene anotarse con varios meses de anticipación en más de una opción.",
  },
  "primaria:publico": {
    emoji: "🏫",
    text: "En las escuelas públicas la vacante suele priorizarse por \"radio escolar\": la zona o domicilio más cercano a la escuela. Antes de anotarte, preguntá en la escuela si tu dirección entra dentro de su radio.",
    linkLabel: "Mesa de Orientación y Servicios (Ministerio)",
    linkUrl: "https://educacion.santafe.gob.ar/moys/",
  },
  "primaria:privado": {
    emoji: "🏫",
    text: "En las escuelas privadas la vacante depende de la disponibilidad de cada colegio, no de tu domicilio -- no hay \"radio\" que priorice. Conviene anotarse en lista de espera de más de una opción con tiempo.",
  },
  "secundaria:privado": {
    emoji: "🎓",
    text: "En las secundarias privadas la orientación elegida también queda en el título, y varias piden reservar la vacante (con seña o matrícula) bastante antes de marzo -- consultá los plazos apenas te interese una.",
  },
};

export function getLevelTip(level: Level, sectors: Set<Sector>): LevelTip {
  if (sectors.size === 1) {
    const [sector] = sectors;
    const specific = LEVEL_SECTOR_TIPS[`${level}:${sector}`];
    if (specific) return specific;
  }
  return LEVEL_TIPS[level];
}
