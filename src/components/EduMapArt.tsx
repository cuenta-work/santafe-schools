import type { CSSProperties } from "react";

// Inspirado en el SantaFeMapArt de santafe-gourmet (el mapa de líneas con
// el "río" animado) -- acá, en vez de un río, son rutas punteadas que
// conectan instituciones de distintos niveles a lo largo de la provincia,
// como el "mapa educativo" del que habla el título.
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

      <path
        className="edu-route"
        style={{ animationDuration: "18s" }}
        d="M-100 180C60 210 140 130 300 160C440 187 500 260 660 230C770 209 850 250 1000 220"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        className="edu-route"
        style={{ animationDuration: "23s", animationDirection: "reverse" }}
        d="M-100 380C80 350 170 430 330 400C480 372 540 300 710 330C820 350 890 300 1040 340"
        stroke="var(--gold)"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.38"
      />
      <path
        className="edu-route"
        style={{ animationDuration: "27s" }}
        d="M-100 550C100 515 200 590 370 560C530 533 590 460 760 490C870 508 940 460 1080 495"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.32"
      />

      {/* Jardín */}
      <circle cx="300" cy="160" r="5" fill="var(--accent)" />
      {/* Primaria */}
      <circle cx="500" cy="260" r="5" fill="var(--sage)" />
      {/* Secundaria */}
      <circle cx="710" cy="330" r="5" fill="var(--gold)" />
      {/* Universidad -- destacado, con halo */}
      <circle cx="640" cy="220" r="6" fill="var(--primary)" />
      <circle cx="640" cy="220" r="15" stroke="var(--primary)" strokeWidth="2" opacity="0.35" />
    </svg>
  );
}
