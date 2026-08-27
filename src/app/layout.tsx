import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const SITE_URL = "https://santafe-schools.vercel.app";
const TITLE = "Santa Fe Schools — Guía de instituciones educativas de Santa Fe";
const DESCRIPTION =
  "Buscador de jardines, escuelas primarias y secundarias, institutos terciarios y universidades de la provincia de Santa Fe (Argentina): gestión, orientación, carreras y contacto de cada institución.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Santa Fe Schools",
  },
  description: DESCRIPTION,
  keywords: [
    "escuelas Santa Fe",
    "colegios Santa Fe",
    "jardines de infantes Santa Fe",
    "escuelas primarias Santa Fe",
    "escuelas secundarias Santa Fe",
    "institutos terciarios Santa Fe",
    "universidades Santa Fe",
    "UNL",
    "UTN Santa Fe",
    "UNR",
    "colegios privados Rosario",
    "educación Santa Fe Argentina",
  ],
  authors: [{ name: "Santa Fe Schools" }],
  creator: "Santa Fe Schools",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "Santa Fe Schools",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Santa Fe Schools",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#1e4fa3",
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var theme = saved === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
