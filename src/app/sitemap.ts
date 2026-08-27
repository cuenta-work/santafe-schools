import type { MetadataRoute } from "next";
import { institutions } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://santafe-schools.vercel.app";
  const lastModified = new Date();
  return [
    {
      url: base,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...institutions.map((i) => ({
      url: `${base}/institucion/${i.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: i.verified ? 0.7 : 0.4,
    })),
  ];
}
