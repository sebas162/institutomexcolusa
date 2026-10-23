// Solo servidor. Carga los festivos de holidays.ts como días bloqueados (override 00:00–00:00)
// en el horario de Cal.com de cada país, para que su página de reservar y reprogramar los salte
// igual que la landing: el de México con festivos de México y el de USA con los de USA. Agrega lo
// que falte y nunca borra overrides existentes.

import {
  getCalScheduleId,
  getCalScheduleOverrides,
  setCalScheduleOverrides,
  type CalScheduleOverride,
} from "@/lib/calcom";
import { getHolidays } from "@/lib/diagnostico/holidays";
import { MARKETS, type DiagnosticoMarket, type MarketId } from "@/lib/diagnostico/market";
import { AGENDA_TIME_ZONE, toDayKey } from "@/lib/diagnostico/slots";

const BLOCKED_DAY = { startTime: "00:00", endTime: "00:00" };

export interface ScheduleHolidaySync {
  market: MarketId;
  scheduleId: number;
  added: string[];
  total: number;
}

export interface HolidaySyncResult {
  years: number[];
  schedules: ScheduleHolidaySync[];
}

/** Festivos del país, del año actual y el siguiente (desde hoy), que todavía no están en su horario. */
async function syncMarketHolidays(
  market: DiagnosticoMarket,
  todayKey: string,
  years: number[]
): Promise<ScheduleHolidaySync> {
  const scheduleId = getCalScheduleId(market);
  const holidayDates = [
    ...new Set(
      years.flatMap((y) => getHolidays(y, market.holidayCalendars).map((holiday) => holiday.date))
    ),
  ]
    .filter((date) => date >= todayKey)
    .sort();

  const current = await getCalScheduleOverrides(scheduleId);
  // Un día que ya tiene override (festivo o un horario especial) se respeta tal cual.
  const existingDates = new Set(current.map((override) => override.date));
  const added = holidayDates.filter((date) => !existingDates.has(date));

  if (added.length === 0) {
    return { market: market.id, scheduleId, added, total: current.length };
  }

  const merged: CalScheduleOverride[] = [
    ...current,
    ...added.map((date) => ({ date, ...BLOCKED_DAY })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const saved = await setCalScheduleOverrides(merged, scheduleId);
  return { market: market.id, scheduleId, added, total: saved.length };
}

export async function syncHolidaysToCalcom(now = new Date()): Promise<HolidaySyncResult> {
  const todayKey = toDayKey(now, AGENDA_TIME_ZONE);
  const year = Number(todayKey.slice(0, 4));
  const years = [year, year + 1];

  const schedules: ScheduleHolidaySync[] = [];
  for (const market of MARKETS) {
    schedules.push(await syncMarketHolidays(market, todayKey, years));
  }

  return { years, schedules };
}
