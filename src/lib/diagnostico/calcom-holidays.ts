// Solo servidor. Carga los festivos de holidays.ts como días bloqueados (override 00:00–00:00)
// en el horario de Cal.com, para que su página de reservar y reprogramar los salte igual que
// la landing. Agrega lo que falte y nunca borra overrides existentes. Como México y USA
// comparten el horario, se cargan los festivos de los dos países.

import { getCalScheduleOverrides, setCalScheduleOverrides, type CalScheduleOverride } from "@/lib/calcom";
import { getHolidays } from "@/lib/diagnostico/holidays";
import { AGENDA_TIME_ZONE, toDayKey } from "@/lib/diagnostico/slots";

const BLOCKED_DAY = { startTime: "00:00", endTime: "00:00" };

export interface HolidaySyncResult {
  years: number[];
  added: string[];
  total: number;
}

/** Festivos del año actual y el siguiente (desde hoy) que todavía no están en el horario. */
export async function syncHolidaysToCalcom(now = new Date()): Promise<HolidaySyncResult> {
  const todayKey = toDayKey(now, AGENDA_TIME_ZONE);
  const year = Number(todayKey.slice(0, 4));
  const years = [year, year + 1];

  const holidayDates = [...new Set(years.flatMap((y) => getHolidays(y).map((holiday) => holiday.date)))]
    .filter((date) => date >= todayKey)
    .sort();

  const current = await getCalScheduleOverrides();
  // Un día que ya tiene override (festivo o un horario especial) se respeta tal cual.
  const existingDates = new Set(current.map((override) => override.date));
  const added = holidayDates.filter((date) => !existingDates.has(date));

  if (added.length === 0) {
    return { years, added, total: current.length };
  }

  const merged: CalScheduleOverride[] = [
    ...current,
    ...added.map((date) => ({ date, ...BLOCKED_DAY })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const saved = await setCalScheduleOverrides(merged);
  return { years, added, total: saved.length };
}
