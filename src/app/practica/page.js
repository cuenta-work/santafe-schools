import Link from "next/link";
import Footer from "@/components/Footer";
import Practica from "@/components/Practica";

export const metadata = {
  title: "Practicá para el ingreso · Santa Fe Schools",
  description: "Simulacros de práctica no oficiales de matemática, química, biología y física para prepararte para el ingreso a la universidad. Con explicaciones y qué temas repasar.",
  alternates: { canonical: "/practica" },
};
export default function Page() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-8">
        <Link href="/" className="text-sm font-medium text-muted">← Volver a la guía</Link>
        <h1 className="font-display text-3xl font-semibold text-foreground">Practicá para el ingreso</h1>
        <p className="text-muted">Simulacros cortos para entrenar los temas que suelen pedir los cursos de ingreso: matemática, química, biología y física. Respondés, ves cuántas acertaste y por qué.</p>
        <Practica />
      </main>
      <Footer />
    </div>
  );
}
