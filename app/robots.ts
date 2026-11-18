import type { MetadataRoute } from "next";

const SITE_URL = "https://fikrimvaricmimarlik.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/studio"]
    },
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
