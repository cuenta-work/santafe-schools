import type { CSSProperties, ElementType } from "react";
import { Backpack, School, BookOpen, Landmark } from "lucide-react";
import type { Level } from "@/lib/types";

interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

// No hay un ícono de "osito de peluche" en lucide-react, así que lo
// dibujamos a mano respetando su mismo lenguaje visual (trazo, sin relleno,
// puntas redondeadas) para que quede parejo con el resto de los íconos de
// portada.
function TeddyBearIcon({ size = 24, strokeWidth = 1.25, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <circle cx="6.5" cy="5.8" r="2.3" />
      <circle cx="17.5" cy="5.8" r="2.3" />
      <circle cx="12" cy="13" r="7.3" />
      <ellipse cx="12" cy="15.3" rx="3.1" ry="2.3" />
      <circle cx="12" cy="14.1" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="9.3" cy="11.4" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="14.7" cy="11.4" r="0.55" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Un ícono por nivel para las portadas de card -- antes siempre era el
// mismo birrete de graduación para todos los niveles, sin distinguir jardín
// de universidad. Comparte estilo (mismo outline, mismo tamaño) con los
// íconos de "Explorá por nivel" para que el sitio se sienta parejo.
const LEVEL_COVER_ICON: Record<Level, ElementType<IconProps>> = {
  jardin: TeddyBearIcon,
  primaria: Backpack,
  secundaria: School,
  terciario: BookOpen,
  universidad: Landmark,
};

export default function LevelCoverIcon({
  level,
  size = 44,
  strokeWidth = 1.25,
  className = "",
  style,
}: { level: Level } & IconProps) {
  const Icon = LEVEL_COVER_ICON[level];
  return <Icon size={size} strokeWidth={strokeWidth} className={className} style={style} />;
}
