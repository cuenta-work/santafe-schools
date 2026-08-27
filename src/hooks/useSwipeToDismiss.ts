"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  onDismiss: () => void;
  // Si el sheet tiene contenido scrolleable adentro, el arrastre para
  // cerrar solo se activa cuando ese contenido ya está arriba de todo --
  // así no le come el scroll normal al dedo del usuario.
  scrollRef?: React.RefObject<HTMLElement | null>;
  disabled?: boolean;
}

const DISMISS_THRESHOLD = 110;

// Arrastrar hacia abajo para cerrar, como cualquier bottom sheet nativo de
// Android/iOS. Se engancha con listeners nativos (no los sintéticos de
// React) porque necesitamos poder cancelar el scroll de la página mientras
// se arrastra, y React marca los touch handlers como pasivos por defecto.
export function useSwipeToDismiss({ onDismiss, scrollRef, disabled }: Options) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el || disabled) return;

    let startY = 0;
    let dragging = false;

    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      dragging = true;
    };

    const onMove = (e: TouchEvent) => {
      if (!dragging) return;
      const delta = e.touches[0].clientY - startY;
      const scrollEl = scrollRef?.current;
      const atTop = !scrollEl || scrollEl.scrollTop <= 0;
      if (delta > 4 && atTop) {
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

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [onDismiss, scrollRef, disabled]);

  return { sheetRef, dragY, isDragging };
}
