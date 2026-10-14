// País de esta landing. La de USA será otra landing con su propio archivo (market/us.ts).

import { MX_MARKET } from "./mx";
import type { DiagnosticoMarket, MarketId } from "./types";

export const MARKET: DiagnosticoMarket = MX_MARKET;

/** Todos los países, para el filtro del admin. */
export const MARKETS: DiagnosticoMarket[] = [MX_MARKET];

/** Los leads de antes de existir el campo market son de México. */
export const DEFAULT_MARKET_ID: MarketId = "mx";

export function getMarket(id: string | undefined): DiagnosticoMarket | undefined {
  return MARKETS.find((market) => market.id === (id ?? DEFAULT_MARKET_ID));
}

export function getMarketLabel(id: string | undefined): string {
  return getMarket(id)?.label ?? id ?? "";
}

export type * from "./types";
