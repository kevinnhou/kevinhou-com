import "./globals.css";

import { site } from "@/config/site";

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["ProfilePage"],
              dateCreated: "2025-01-01T00:00:00+11:00",
              dateModified: new Date(),
              name: site.name.default,
              url: site.links.website,
              description: site.description,
              creator: {
                "@type": "Person",
                name: site.name.short,
                url: site.links.website,
              },
              keywords: site.keywords,
              inLanguage: "en-AU",
              mainEntity: {
                "@type": "Person",
                name: "Kevin Hou",
                alternateName: "kevinnhou",
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
