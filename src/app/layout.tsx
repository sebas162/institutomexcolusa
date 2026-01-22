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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
