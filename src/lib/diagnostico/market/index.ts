// Países de la landing: México en /diagnostico/ y USA en /diagnostico/usa/.

import { MX_MARKET } from "./mx";
import { US_MARKET } from "./us";
import type { DiagnosticoMarket, HolidayCalendar, MarketId } from "./types";

/** Todos los países, para el filtro del admin. */
export const MARKETS: DiagnosticoMarket[] = [MX_MARKET, US_MARKET];

/** Los leads de antes de existir el campo market son de México. */
export const DEFAULT_MARKET_ID: MarketId = "mx";

export const DEFAULT_MARKET: DiagnosticoMarket = MX_MARKET;

/** Festivos de todos los países juntos, para las funciones de holidays.ts llamadas sin país. */
export const ALL_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  ...new Set(MARKETS.flatMap((market) => market.holidayCalendars)),
];

export function getMarket(id: string | undefined): DiagnosticoMarket | undefined {
  return MARKETS.find((market) => market.id === (id ?? DEFAULT_MARKET_ID));
}

export function getMarketLabel(id: string | undefined): string {
  return getMarket(id)?.label ?? id ?? "";
}

export type * from "./types";
