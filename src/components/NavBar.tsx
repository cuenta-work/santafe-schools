import { Star, LayoutGrid, GraduationCap, Compass, PlusCircle } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "#destacados", label: "Destacadas", icon: Star },
  { href: "#niveles", label: "Niveles", icon: LayoutGrid },
  { href: "#carreras", label: "Carreras", icon: GraduationCap },
  { href: "#buscador", label: "Buscador", icon: Compass },
  { href: "#contacto", label: "Sumá tu institución", icon: PlusCircle },
];

export default function NavBar() {
  return (
    <div className="sticky top-0 z-[1500] border-b border-border bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-3 lg:px-8 xl:gap-10">
        <a href="#top" className="shrink-0">
          <Logo size={32} />
        </a>
        <nav className="hidden items-center gap-4 xl:flex xl:gap-6">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-foreground/75 transition hover:text-primary-dark"
            >
              <l.icon size={14} strokeWidth={2} className="shrink-0 opacity-70" />
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <ThemeToggle />
          <a
            href="#buscador"
            className="shine hidden shrink-0 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark sm:inline-flex"
          >
            Buscar instituciones
          </a>
        </div>
      </div>
    </div>
  );
}
