import type { Metadata } from "next";

import { site } from "@/config/site";

export const metadata: Metadata = {
  abstract: site.description,
  alternates: {
    canonical: "/",
  },
  applicationName: site.name.default,
  authors: [{ name: site.name.short, url: site.links.github }],
  creator: site.name.short,
  description: site.description,
  keywords: site.keywords,
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(site.links.website),
  openGraph: {
    description: site.description,
    images: [
      {
        height: 630,
        url: "/opengraph-image.png",
        width: 1200,
      },
    ],
    locale: "en-AU",
    siteName: site.name.default,
    title: site.name.default,
    type: "website",
    url: "/opengraph-image.png",
  },
  robots: {
    follow: true,
    index: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  title: site.name.default,
  twitter: {
    card: "summary_large_image",
    creator: site.tag,
    description: site.description,
    images: ["/twitter-image.png"],
    title: site.name.default,
  },
};
