"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  onDismiss: () => void;
  disabled?: boolean;
}

const DISMISS_THRESHOLD = 110;

// Arrastrar hacia abajo para cerrar, como cualquier bottom sheet nativo de
// Android/iOS -- pero el gesto se engancha SOLO en `handleRef` (la
// barrita + cabecera de arriba), nunca en el contenido scrolleable de
// abajo. Antes escuchábamos en toda la hoja y tratábamos de adivinar,
// mirando el scrollTop del contenido, si el usuario quería scrollear o
// cerrar -- pero scrollear hacia arriba (que técnicamente es arrastrar el
// dedo hacia abajo) se confundía con el gesto de cierre apenas el
// contenido llegaba al tope. Separando la zona de arrastre de la zona de
// scroll, la ambigüedad desaparece: agarrás la cabecera para cerrar,
// scrolleás el contenido para scrollear, sin que se pisen nunca.
export function useSwipeToDismiss({ onDismiss, disabled }: Options) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle || disabled) return;

    let startY = 0;
    let dragging = false;

    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      dragging = true;
    };

    const onMove = (e: TouchEvent) => {
      if (!dragging) return;
      const delta = e.touches[0].clientY - startY;
      if (delta > 4) {
        setIsDragging(true);
        setDragY(delta);
        if (e.cancelable) e.preventDefault();
      } else if (delta <= 0) {
        setDragY(0);
      }
    };

    const onEnd = () => {
      dragging = false;
      setIsDragging(false);
      setDragY((current) => {
        if (current > DISMISS_THRESHOLD) onDismiss();
        return 0;
      });
    };

    handle.addEventListener("touchstart", onStart, { passive: true });
    handle.addEventListener("touchmove", onMove, { passive: false });
    handle.addEventListener("touchend", onEnd);
    handle.addEventListener("touchcancel", onEnd);

    return () => {
      handle.removeEventListener("touchstart", onStart);
      handle.removeEventListener("touchmove", onMove);
      handle.removeEventListener("touchend", onEnd);
      handle.removeEventListener("touchcancel", onEnd);
    };
  }, [onDismiss, disabled]);

  return { sheetRef, handleRef, dragY, isDragging };
}
