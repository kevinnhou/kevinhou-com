/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";

import Providers from "@/components/providers";
import { metadata } from "@/config/metadata";
import { site } from "@/config/site";

import "./globals.css";

export { metadata };

const jetbrainsMono = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <head>
        <Script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["ProfilePage"],
              "creator": {
                "@type": "Person",
                "name": site.name.short,
                "url": site.links.website,
              },
              "dateCreated": "2025-01-01T00:00:00+11:00",
              "dateModified": new Date(),
              "description": site.description,
              "inLanguage": "en-AU",
              "keywords": site.keywords,
              "mainEntity": {
                "@type": "Person",
                "alternateName": "kevinnhou",
                "name": "Kevin Hou",
              },
              "name": site.name.default,
              "url": site.links.website,
            }),
          }}
          id="json-ld"
          type="application/ld+json"
        />
      </head>
      <body className={jetbrainsMono.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
