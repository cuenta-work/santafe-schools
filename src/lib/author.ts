export const AUTHOR = {
  studio: "FUNGIRAK",
  email: "gabriel@fungirak.com",
  instagramUrl: "https://instagram.com/fungirak",
  linkedinUrl: null as string | null,
  websiteUrl: "https://fungirak.com",
};

export function isExternalLink(url: string): boolean {
  return !url.startsWith("mailto:");
}
