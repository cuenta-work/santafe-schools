import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Santa Fe Schools",
    short_name: "Santa Fe Schools",
    description:
      "Buscador de jardines, escuelas, terciarios y universidades de la provincia de Santa Fe.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7fb",
    theme_color: "#1e4fa3",
    lang: "es-AR",
    // como Team Joy: PNG redondeados para compu (Windows, Linux, Mac), uno cuadrado «maskable» para Android y el SVG de respaldo
    screenshots: [
      { src: "/capturas/app-wide.webp", sizes: "1280x720", type: "image/webp", form_factor: "wide", label: "El mapa educativo de Santa Fe" },
      { src: "/capturas/app-narrow.webp", sizes: "390x844", type: "image/webp", form_factor: "narrow", label: "Buscá escuelas, institutos y carreras" },
    ],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
