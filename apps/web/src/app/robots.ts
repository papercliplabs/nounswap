import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/explore", "/convert", "/stats"],
      disallow: ["/api/*"],
    },
    sitemap: ["https://www.nounswap.wtf/sitemap.xml"],
  };
}
