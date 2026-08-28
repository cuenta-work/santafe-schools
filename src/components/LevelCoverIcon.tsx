import type { CSSProperties, ElementType } from "react";
import { Backpack, School, BookOpen, Landmark } from "lucide-react";
import { sortLevels, type Level } from "@/lib/types";

interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

// No hay un ícono de "osito de peluche" en lucide-react, así que lo
// dibujamos a mano respetando su mismo lenguaje visual (trazo, sin relleno,
// puntas redondeadas). Las orejas se superponen a la cabeza y el hocico es
// un círculo propio más abajo -- así se lee como un osito y no como una
// mancha con puntos.
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
      <circle cx="7.2" cy="6.6" r="2.6" />
      <circle cx="16.8" cy="6.6" r="2.6" />
      <path d="M15.6 5.6 l1.8 1.8 M17.4 5.6 l-1.8 1.8" strokeWidth={strokeWidth * 0.85} />
      <circle cx="12" cy="13.2" r="7" />
      <circle cx="12" cy="15.7" r="2.5" />
      <circle cx="9.1" cy="11.7" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="14.9" cy="11.7" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.7" r="0.5" fill="currentColor" stroke="none" />
      <path d="M12 15.2 v0.7 M10.9 16.7 q1.1 0.75 2.2 0" strokeWidth={strokeWidth * 0.85} />
    </svg>
  );
}

// Un ícono por nivel para las portadas de card -- comparte estilo (mismo
// outline) con los íconos de "Explorá por nivel" para que el sitio se
// sienta parejo.
const LEVEL_COVER_ICON: Record<Level, ElementType<IconProps>> = {
  jardin: TeddyBearIcon,
  primaria: Backpack,
  secundaria: School,
  terciario: BookOpen,
  universidad: Landmark,
};

// Cuantos más niveles tiene una institución, más chico entra cada ícono --
// siempre en orden pedagógico (jardín -> universidad) de izquierda a
// derecha, así de un vistazo se ve el recorrido completo que ofrece.
function sizeForCount(base: number, count: number): number {
  if (count <= 1) return base;
  if (count === 2) return Math.round(base * 0.72);
  if (count === 3) return Math.round(base * 0.58);
  return Math.round(base * 0.48);
}

export default function LevelCoverIcon({
  levels,
  size = 44,
  strokeWidth = 1.25,
  className = "",
  style,
}: { levels: Level[] } & IconProps) {
  const ordered = sortLevels(levels);
  const shown = ordered.length > 0 ? ordered : (["jardin"] as Level[]);
  const iconSize = sizeForCount(size, shown.length);

  return (
    <div className={`flex items-end gap-1 ${className}`} style={style}>
      {shown.map((level) => {
        const Icon = LEVEL_COVER_ICON[level];
        return <Icon key={level} size={iconSize} strokeWidth={strokeWidth} />;
      })}
    </div>
  );
}
