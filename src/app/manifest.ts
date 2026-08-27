import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Santa Fe Schools — Guía de instituciones educativas",
    short_name: "Santa Fe Schools",
    description:
      "Buscador de jardines, escuelas, terciarios y universidades de la provincia de Santa Fe.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7fb",
    theme_color: "#1e4fa3",
    lang: "es-AR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
