function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const HUE_BANDS = [212, 198, 168, 152, 262, 28, 340, 44, 190];

export function institutionHue(id: string): number {
  const h = hashString(id);
  return HUE_BANDS[h % HUE_BANDS.length];
}

export function institutionColor(id: string): { bg: string; border: string } {
  const hue = institutionHue(id);
  return {
    bg: `hsl(${hue} 58% 42%)`,
    border: `hsl(${hue} 58% 32%)`,
  };
}

export function institutionTint(id: string): { bg: string; icon: string } {
  const hue = institutionHue(id);
  return {
    bg: `hsl(${hue} 55% 93%)`,
    icon: `hsl(${hue} 42% 40%)`,
  };
}

export function withAlpha(hslColor: string, alpha: number): string {
  return hslColor.replace(/\)$/, ` / ${alpha})`);
}

export function institutionInitials(name: string): string {
  const cleaned = name.replace(/[^\p{L}\p{N} ]/gu, " ").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Favicon del sitio oficial de la institución como logo -- sin necesidad de
// alojar ni curar imágenes a mano. Cuando no hay dominio conocido o la
// imagen falla, el llamador cae al Monogram con las iniciales.
export function institutionLogoUrl(domain: string, size = 128): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}
