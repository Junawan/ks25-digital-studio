import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages: MetadataRoute.Sitemap = [
    {
      url: "https://www.ks25studio.web.id/artikel/ks25-kasir-pos-absensi",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const modulePages = ["pos", "attendance", "packflow", "live-assistant"].map((moduleId) => ({
    url: `https://www.ks25studio.web.id/aplikasi/${moduleId}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...publicPages, ...modulePages];
}
