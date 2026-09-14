import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ganpatibappa.online";
  const lastModified = new Date();

  return [
    { url: base, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${base}/#card-creator`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/#mandals-section`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/#aarti-section`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];
}
