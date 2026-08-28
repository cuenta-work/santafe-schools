"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  onDismiss: () => void;
  disabled?: boolean;
}

const DISMISS_THRESHOLD = 110;

// Arrastrar hacia abajo para cerrar, como cualquier bottom sheet nativo de
// Android/iOS. Se engancha en dos zonas:
// 1. `handleRef` (la barrita + cabecera de arriba): arrastrar siempre cierra,
//    sin condiciones.
// 2. `contentRef` (el cuerpo scrolleable): solo cierra cuando el contenido
//    ya está en el tope (scrollTop === 0) y el usuario sigue arrastrando
//    hacia abajo -- el mismo gesto de "pull to dismiss" nativo, que no se
//    puede confundir con "quiero scrollear" porque ya no hay nada más
//    arriba para ver. Mientras haya contenido para scrollear normalmente
//    (scrollTop > 0), este listener no interviene y deja el scroll nativo
//    intacto.
export function useSwipeToDismiss({ onDismiss, disabled }: Options) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const content = contentRef.current;
    if (!content || disabled) return;

    let startY = 0;
    let dragging = false;
    let pulling = false;

    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      dragging = true;
      pulling = false;
    };

    const onMove = (e: TouchEvent) => {
      if (!dragging) return;
      const y = e.touches[0].clientY;

      if (!pulling) {
        if (content.scrollTop <= 0 && y - startY > 0) {
          // El contenido ya está en el tope y el dedo sigue bajando:
          // arrancamos el gesto de cierre justo desde acá, sin salto.
          pulling = true;
          startY = y;
        } else {
          // Todavía hay contenido para scrollear normalmente -- vamos
          // corriendo la base para que, si más tarde llega al tope, el
          // arrastre de cierre arranque en 0 y no con un salto acumulado.
          startY = y;
          return;
        }
      }

      const delta = y - startY;
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
      pulling = false;
      setIsDragging(false);
      setDragY((current) => {
        if (current > DISMISS_THRESHOLD) onDismiss();
        return 0;
      });
    };

    content.addEventListener("touchstart", onStart, { passive: true });
    content.addEventListener("touchmove", onMove, { passive: false });
    content.addEventListener("touchend", onEnd);
    content.addEventListener("touchcancel", onEnd);

    return () => {
      content.removeEventListener("touchstart", onStart);
      content.removeEventListener("touchmove", onMove);
      content.removeEventListener("touchend", onEnd);
      content.removeEventListener("touchcancel", onEnd);
    };
  }, [onDismiss, disabled]);

  return { sheetRef, handleRef, contentRef, dragY, isDragging };
}
