import type { Metadata } from "next";
import type { ReactNode } from "react";
import LandingFooter from "@/components/diagnostico/LandingFooter";
import { DiagnosticoProvider } from "./DiagnosticoProvider";

// Páginas de anuncios: ninguna se indexa.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DiagnosticoLayout({ children }: { children: ReactNode }) {
  return (
    <DiagnosticoProvider>
      <div className="flex min-h-screen flex-col bg-muted text-foreground">
        {children}
        <LandingFooter />
      </div>
    </DiagnosticoProvider>
  );
}
