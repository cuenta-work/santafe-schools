import Logo from "./Logo";
import { LEVEL_LABELS } from "@/lib/types";
import { AUTHOR } from "@/lib/author";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo size={32} />
          <p className="mt-3 max-w-xs text-sm text-muted">
            Guía independiente de instituciones educativas de la provincia de Santa Fe, para
            ayudar a las familias a elegir con información real.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Niveles</p>
          <ul className="flex flex-col gap-2 text-sm text-foreground/80">
            {Object.entries(LEVEL_LABELS).map(([key, label]) => (
              <li key={key}>
                <a href="#niveles" className="hover:text-primary-dark">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Sobre la guía
          </p>
          <p className="text-sm text-muted">
            Cada ficha combina datos públicos del Ministerio de Educación de Santa Fe y de las
            propias instituciones. Es un punto de partida para investigar — antes de decidir,
            confirmá siempre los datos directamente con cada institución.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Contacto
          </p>
          <a href={`mailto:${AUTHOR.email}`} className="text-sm text-muted hover:text-primary-dark">
            {AUTHOR.email}
          </a>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 border-t border-border px-4 py-5 text-center text-xs text-muted sm:flex-row sm:justify-between sm:gap-4 lg:px-8">
        <span>Santa Fe Schools · guía educativa independiente, hecha en Santa Fe</span>
      </div>
    </footer>
  );
}
