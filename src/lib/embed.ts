// Sitios que suelen bloquear ser embebidos en un iframe (X-Frame-Options /
// CSP frame-ancestors) o que simplemente no tiene sentido mostrar adentro
// de un modal chico -- ahí directamente se abren como ventana aparte.
export const BLOCKED_EMBED_HOSTS = [
  "instagram.com",
  "facebook.com",
  "twitter.com",
  "x.com",
  "linktr.ee",
];

export function isBlockedEmbedHost(src: string | null | undefined): boolean {
  if (!src) return false;
  try {
    const host = new URL(src).hostname.replace(/^www\./, "");
    return BLOCKED_EMBED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export function windowNameForUrl(url: string): string {
  return "institucion-" + url.replace(/[^a-zA-Z0-9]/g, "").slice(0, 40);
}

// Abre un sitio que rechaza ser embebido como una ventana normal en vez de
// un iframe -- así X-Frame-Options no aplica. Un `name` estable por URL
// reutiliza la misma ventana en vez de abrir duplicados.
export function openEmbedWindow(url: string, name: string) {
  if (typeof window === "undefined") return;
  const width = Math.min(480, Math.round(window.innerWidth * 0.92));
  const height = Math.min(640, Math.round(window.innerHeight * 0.85));
  const left = Math.round(window.screenX + (window.innerWidth - width) / 2);
  const top = Math.round(window.screenY + (window.innerHeight - height) / 2 + 40);
  const win = window.open(
    url,
    name,
    `popup=1,width=${width},height=${height},left=${left},top=${top}`
  );
  if (!win) window.open(url, name, "noopener,noreferrer");
}
