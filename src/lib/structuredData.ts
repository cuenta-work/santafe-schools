import type { Institution } from "./types";

export function buildStructuredData(institutions: Institution[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: institutions.slice(0, 200).map((i, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "EducationalOrganization",
        name: i.name,
        address: i.address
          ? {
              "@type": "PostalAddress",
              streetAddress: i.address,
              addressLocality: i.localidad,
              addressRegion: "Santa Fe",
              addressCountry: "AR",
            }
          : undefined,
        url: i.website ?? undefined,
        telephone: i.phone ?? undefined,
      },
    })),
  };
}
