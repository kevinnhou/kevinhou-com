import type { MetadataRoute } from "next";

import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      lastModified: new Date(),
      url: site.links.website,
    },
  ];
}
