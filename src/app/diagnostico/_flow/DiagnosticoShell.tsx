"use client";

import type { ReactNode } from "react";
import LandingFooter from "@/components/diagnostico/LandingFooter";
import { MarketProvider } from "@/components/diagnostico/MarketContext";
import type { MarketId } from "@/lib/diagnostico/market";
import { DiagnosticoProvider } from "./DiagnosticoProvider";

/** Marco común de las páginas de un país: su configuración, el avance del flujo y el pie. */
export default function DiagnosticoShell({
  marketId,
  children,
}: {
  marketId: MarketId;
  children: ReactNode;
}) {
  return (
    <MarketProvider marketId={marketId}>
      <DiagnosticoProvider>
        <div className="flex min-h-screen flex-col bg-muted text-foreground">
          {children}
          <LandingFooter />
        </div>
      </DiagnosticoProvider>
    </MarketProvider>
  );
}
