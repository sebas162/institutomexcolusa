"use client";

import { createContext, useContext, type ReactNode } from "react";
import { getMarket, type DiagnosticoMarket, type MarketId } from "@/lib/diagnostico/market";

// País de la landing según la ruta: lo fija el layout de /diagnostico/ (México) o
// /diagnostico/usa/ (USA). Se pasa el id y no el objeto porque el layout es del servidor y el
// país trae funciones (mensaje de WhatsApp).
const MarketContext = createContext<DiagnosticoMarket | undefined>(undefined);

export function MarketProvider({ marketId, children }: { marketId: MarketId; children: ReactNode }) {
  const market = getMarket(marketId);
  if (!market) throw new Error(`Unknown diagnostico market: ${marketId}`);

  return <MarketContext.Provider value={market}>{children}</MarketContext.Provider>;
}

export function useMarket(): DiagnosticoMarket {
  const market = useContext(MarketContext);
  if (!market) {
    throw new Error("useMarket must be used within a MarketProvider");
  }
  return market;
}
