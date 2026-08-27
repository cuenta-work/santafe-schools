import type { Level } from "./types";

export interface LevelTip {
  emoji: string;
  text: string;
  linkLabel?: string;
  linkUrl?: string;
}

// Datos prácticos reales, uno por nivel -- pensados para lo que a alguien
// realmente le sirve saber en el momento de buscar en ese nivel puntual
// (no genéricos de "elegí bien"). Verificados contra fuentes oficiales.
export const LEVEL_TIPS: Record<Level, LevelTip> = {
  jardin: {
    emoji: "👶",
    text: "En Argentina la sala de 4 y la sala de 5 son obligatorias por ley. Los cupos de jardín y maternal suelen agotarse rápido -- conviene averiguar fechas de inscripción con varios meses de anticipación.",
  },
  primaria: {
    emoji: "🏫",
    text: "En las escuelas públicas, la vacante suele priorizarse por \"radio escolar\" (la zona/domicilio más cercano a la escuela). Si te interesa una escuela pública puntual, preguntá si tu dirección entra en su radio antes de anotarte.",
  },
  secundaria: {
    emoji: "🎓",
    text: "La orientación que elijas al empezar el Ciclo Orientado (desde 3er año) queda en el título secundario. Antes de anotarte, comparás las orientaciones de las escuelas cercanas -- no todas ofrecen las mismas.",
  },
  terciario: {
    emoji: "🚌",
    text: "Los alumnos regulares de nivel terciario pueden tramitar el Boleto Educativo Gratuito de la provincia (2 viajes diarios sin cargo) desde la web o la app Mi Santa Fe.",
    linkLabel: "Boleto Educativo Gratuito",
    linkUrl: "https://www.santafe.gov.ar/boletoeducativo/informacion",
  },
  universidad: {
    emoji: "🚌",
    text: "Además del Boleto Educativo Gratuito provincial, la Beca Progresar (nacional) da un apoyo económico mensual a estudiantes de carreras universitarias y terciarias -- vale la pena chequear si cumplís los requisitos.",
    linkLabel: "Becas Progresar",
    linkUrl: "https://www.argentina.gob.ar/becasprogresar",
  },
};
