import type { CSSProperties } from "react";
import { Baby, Backpack, School, BookOpen, Landmark } from "lucide-react";

// Inspirado en el SantaFeMapArt de santafe-gourmet (el mapa de líneas con
// el "río" animado) -- acá, en vez de un río, es el recorrido educativo:
// las mismas rutas punteadas animadas, pero conectando los mismos 5
// íconos que usa el resto del sitio para cada nivel (ver LEVEL_ICON en
// LevelShowcase.tsx), de jardín a universidad, como una línea de tiempo
// escolar dibujada en el mapa.
const STOPS: { Icon: typeof Baby; x: number; y: number; color: string; big?: boolean }[] = [
  { Icon: Baby, x: 190, y: 150, color: "var(--accent)" },
  { Icon: Backpack, x: 360, y: 230, color: "var(--sage)" },
  { Icon: School, x: 540, y: 175, color: "var(--gold)" },
  { Icon: BookOpen, x: 700, y: 260, color: "var(--primary)" },
  { Icon: Landmark, x: 640, y: 400, color: "var(--primary)", big: true },
];

export default function EduMapArt({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const gridLines = [];
  for (let i = 0; i <= 8; i++) {
    const pos = i * 90;
    gridLines.push(
      <line key={`h${i}`} x1="0" y1={pos} x2="800" y2={pos} stroke="var(--border)" strokeWidth="1.5" />
    );
  }
  for (let i = 0; i <= 8; i++) {
    const pos = i * 100;
    gridLines.push(
      <line key={`v${i}`} x1={pos} y1="0" x2={pos} y2="720" stroke="var(--border)" strokeWidth="1.5" />
    );
  }

  return (
    <svg
      viewBox="0 0 800 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={style}
    >
      <defs>
        <radialGradient id="eduWash" cx="72%" cy="30%" r="60%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="800" height="720" fill="url(#eduWash)" />
      <g opacity="0.5">{gridLines}</g>

      {/* El recorrido: jardín -> primaria -> secundaria -> terciario -> universidad */}
      <path
        className="edu-route"
        style={{ animationDuration: "20s" }}
        d="M190 150C260 200 300 235 360 230C430 224 480 178 540 175C610 171 650 225 700 260C670 320 655 360 640 400"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        className="edu-route"
        style={{ animationDuration: "26s", animationDirection: "reverse" }}
        d="M-100 550C100 515 200 590 370 560C530 533 590 460 760 490C870 508 940 460 1080 495"
        stroke="var(--gold)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.3"
      />

      {STOPS.map(({ Icon, x, y, color, big }, i) => (
        <g key={i}>
          {big && <circle cx={x} cy={y} r={26} stroke={color} strokeWidth="2" opacity="0.35" />}
          <circle cx={x} cy={y} r={big ? 20 : 16} fill="var(--card)" stroke={color} strokeWidth="2" />
          <Icon
            x={x - (big ? 11 : 9)}
            y={y - (big ? 11 : 9)}
            width={big ? 22 : 18}
            height={big ? 22 : 18}
            color={color}
            strokeWidth={2}
          />
        </g>
      ))}
    </svg>
  );
}
