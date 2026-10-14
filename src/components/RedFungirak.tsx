"use client";
// Franja «Más de FUNGIRAK Studio»: la red de apps, juegos y sitios del Studio.
// El HTML lo genera red-fungirak/sincronizar.mjs (no editar ../lib/red-fungirak a mano).
import { useEffect } from "react";
import { RED_HTML } from "../lib/red-fungirak";

export default function RedFungirak() {
  useEffect(() => {
    const w = window as unknown as { __rfk?: number };
    if (w.__rfk) return;
    w.__rfk = 1;
    // corre el globo de descripción para que no se salga de la pantalla
    const ajustar = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.(".rfk-a");
      const t = a?.querySelector<HTMLElement>(".rfk-tip");
      if (!t) return;
      t.style.setProperty("--dx", "0px");
      const r = t.getBoundingClientRect(), m = 10;
      const d = r.left < m ? m - r.left : r.right > innerWidth - m ? innerWidth - m - r.right : 0;
      t.style.setProperty("--dx", Math.round(d) + "px");
    };
    document.addEventListener("pointerover", ajustar);
    document.addEventListener("focusin", ajustar);
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: RED_HTML }} />;
}
