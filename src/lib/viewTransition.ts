// Cambiar de tema toca varias custom properties de CSS a la vez; la View
// Transitions API congela un screenshot del estado viejo y nuevo y hace un
// crossfade parejo de la página entera. Se degrada solo (cambio instantáneo)
// en navegadores sin soporte, y respeta "reducir movimiento".
let pending: ViewTransition | null = null;

export function withThemeTransition(applyChange: () => void) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const supportsViewTransition =
    typeof document !== "undefined" && "startViewTransition" in document;

  if (!supportsViewTransition || prefersReducedMotion) {
    applyChange();
    return;
  }

  try {
    pending?.skipTransition();
    pending = document.startViewTransition(applyChange);
    pending.finished.catch(() => {}).finally(() => {
      pending = null;
    });
  } catch {
    applyChange();
  }
}
