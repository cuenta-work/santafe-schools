import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Pagina404 from "@/components/Pagina404";

// Página de «no existe» animada, con el tono de la guía y un camino de vuelta.
export const metadata: Metadata = { title: "Página no encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <NavBar />
      <main className="mx-auto w-full max-w-7xl px-4">
        <Pagina404 icono="/red-fungirak/schools.webp" color="#2b4fa3" titulo="Esta aula está vacía" texto="La página que buscás no existe o se movió. Volvé al buscador y encontrá la escuela que buscás."
          adornos={["🎒", "📚", "✏️", "🏫"]} acciones={[{ href: "/", t: "Volver al buscador" }]} clase="p404-btn" clase2="p404-btn2" />
      </main>
      <Footer />
    </>
  );
}
