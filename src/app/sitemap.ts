import type { MetadataRoute } from "next";

import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.links.website,
      lastModified: new Date(),
    },
  ];
}
