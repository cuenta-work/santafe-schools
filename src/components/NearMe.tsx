"use client";

import { useState } from "react";
import { LocateFixed, MapPin, Loader2 } from "lucide-react";
import { useFilters } from "@/context/FiltersContext";

// El ÚNICO lugar donde vive el control completo de ubicación (botón +
// radio) es el bloque "Cerca tuyo" de FilterControls, visible en el
// sidebar/drawer -- acá solo está la invitación: un botón que fija tu
// ubicación y te lleva derecho al buscador con el mapa y las instituciones
// más cerca ya ordenadas, igual que en santafe-gourmet.
export default function NearMe() {
  const { filters, setFilters } = useFilters();
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFilters({
          ...filters,
          origin: { lat: pos.coords.latitude, lon: pos.coords.longitude },
        });
        setLocating(false);
        document.getElementById("buscador")?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      () => {
        setError('No pudimos acceder a tu ubicación. Probá desde "Localidad o zona" en el buscador.');
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <section id="cercademi" className="scroll-mt-[57px] bg-card py-12">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          A un paso de donde estás
        </p>
        <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          ¿Dónde estás?
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
          Contanos dónde estás parado y te llevamos directo al buscador con el mapa y las
          instituciones más cerca ya ordenadas -- ahí lo podés combinar con nivel, gestión o
          cualquier otro filtro.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition active:scale-95 hover:bg-primary-dark disabled:opacity-60"
          >
            {locating ? <Loader2 size={15} className="animate-spin" /> : <LocateFixed size={15} />}
            Usar mi ubicación
          </button>
          <a href="#buscador" className="text-xs font-medium text-primary-dark hover:underline">
            o elegí tu localidad o zona en el buscador →
          </a>
        </div>

        {error && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-accent-dark">
            <MapPin size={13} className="shrink-0" /> {error}
          </p>
        )}
      </div>
    </section>
  );
}
