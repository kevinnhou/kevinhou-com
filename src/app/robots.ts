import { MetadataRoute } from "next";

import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.links.website}/sitemap.xml`,
  };
}
