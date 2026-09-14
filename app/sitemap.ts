import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ganpatibappa.online";
  const lastModified = new Date();

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];
}
