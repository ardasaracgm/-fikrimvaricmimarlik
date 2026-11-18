import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { allProjectSlugsQuery } from "@/sanity/lib/queries";
import { locales } from "@/lib/i18n";

const SITE_URL = "https://fikrimvaricmimarlik.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/projects", "/fitout-management", "/contact"];
  const projectSlugs: string[] = await client.fetch(allProjectSlugsQuery);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.7
      });
    }
    for (const slug of projectSlugs) {
      entries.push({
        url: `${SITE_URL}/${locale}/projects/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6
      });
    }
  }

  return entries;
}
