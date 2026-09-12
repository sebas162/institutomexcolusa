import type { Metadata } from "next";
import "./globals.css";
import { translations } from "@/lib/i18n";
import RootLayoutClient from "./RootLayoutClient";

export const metadata: Metadata = {
  title: translations.es.metadata.title,
  description: translations.es.metadata.description,
  other: {
    "facebook-domain-verification": "orqaxf0cb7r52mooa5ghu6svvw4hag",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Instituto Mex-Col-USA",
  url: "https://www.institutomexcolusa.com/",
  logo: "https://www.institutomexcolusa.com/logo.png",
  sameAs: [
    "https://www.facebook.com/profile.php?id=100064823553168",
    "https://www.instagram.com/institutomexcolusa/",
    "https://www.youtube.com/@institutomexcol9788/featured",
    "https://www.tiktok.com/@instituto.mex_col_usa",
  ],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Carrera 16A # 80-16, Consultorio 206, Barrio El Lago Contry",
      addressLocality: "Bogotá",
      addressCountry: "CO",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Av. Insurgentes Sur 546-piso 7, Roma Sur, Cuauhtémoc",
      addressLocality: "Ciudad de México",
      postalCode: "06760",
      addressCountry: "MX",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "2180 Central Florida Parkway, Suite A2",
      addressLocality: "Orlando",
      addressRegion: "FL",
      postalCode: "32837",
      addressCountry: "US",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "1250 West Sam Houston Parkway South",
      addressLocality: "Houston",
      addressRegion: "TX",
      postalCode: "77042",
      addressCountry: "US",
    },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+57 321 627 3790",
      contactType: "customer service",
      email: "gerencia@institutomexcolusa.com",
      areaServed: "CO",
    },
    {
      "@type": "ContactPoint",
      telephone: "+52 55 6630 8602",
      contactType: "customer service",
      email: "gerencia@institutomexcolusa.com",
      areaServed: "MX",
    },
    {
      "@type": "ContactPoint",
      telephone: "55 2593 6885",
      contactType: "customer service",
      email: "gerencia@institutomexcolusa.com",
      areaServed: "MX",
    },
    {
      "@type": "ContactPoint",
      telephone: "+1 (407) 454-0524",
      contactType: "customer service",
      email: "gerencia@institutomexcolusa.com",
      areaServed: "US",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
