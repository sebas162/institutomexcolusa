// Reglas de la agenda (aprobadas por la clienta), contadas en America/Chicago:
// siempre AGENDA_DAYS días hábiles. Hoy cuenta solo si es hábil y le quedan horarios; si no,
// se toman los siguientes. Los fines de semana y los festivos no cuentan.

import { getCalSlots } from "@/lib/calcom";
import { isHoliday } from "@/lib/diagnostico/holidays";
import {
  AGENDA_TIME_ZONE,
  addDaysToKey,
  toDayKey,
  type AgendaDay,
  type Slot,
} from "@/lib/diagnostico/slots";

// Cuántos días hábiles muestra la agenda. Es lo único que hay que cambiar para ampliarla
// (por ejemplo a 5 para una semana): la ventana, la API de horarios y la revalidación de
// la ruta de lead se ajustan solas.
const AGENDA_DAYS = 2;

// Franja que se muestra en gris como "Agendado" (de 3:00 a 5:30 p. m. en Chicago).
const UNAVAILABLE_TIMES = ["15:00", "15:30", "16:00", "16:30", "17:00"];
const SLOT_MINUTES = 15;

const offsetFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: AGENDA_TIME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

// Diferencia entre la hora de pared en Chicago y UTC para ese instante (cambia con el horario de verano).
function getChicagoOffsetMs(date: Date): number {
  const parts = Object.fromEntries(
    offsetFormatter.formatToParts(date).map((part) => [part.type, part.value])
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/** Instante UTC de una hora de pared en Chicago: ("2026-11-02", "15:00") → 21:00Z. */
export function chicagoTimeToUtc(dayKey: string, time: string): Date {
  const [year, month, day] = dayKey.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const wallClock = Date.UTC(year, month - 1, day, hour, minute);

  // Dos pasadas: la primera estimación puede caer del otro lado del cambio de horario.
  let timestamp = wallClock - getChicagoOffsetMs(new Date(wallClock));
  timestamp = wallClock - getChicagoOffsetMs(new Date(timestamp));
  return new Date(timestamp);
}

export function isBusinessDay(dayKey: string): boolean {
  const weekday = new Date(`${dayKey}T00:00:00Z`).getUTCDay();
  return weekday >= 1 && weekday <= 5 && !isHoliday(dayKey);
}

/**
 * Hoy (si es hábil) y los AGENDA_DAYS días hábiles siguientes, en Chicago. La agenda usa hoy
 * y los primeros AGENDA_DAYS - 1 si a hoy le quedan horarios, o los AGENDA_DAYS siguientes si no.
 */
export function getWindowDayKeys(now: Date): { today: string | null; following: string[] } {
  const todayKey = toDayKey(now, AGENDA_TIME_ZONE);
  const following: string[] = [];
  let cursor = todayKey;

  while (following.length < AGENDA_DAYS) {
    cursor = addDaysToKey(cursor, 1);
    if (isBusinessDay(cursor)) following.push(cursor);
  }

  return { today: isBusinessDay(todayKey) ? todayKey : null, following };
}

function buildUnavailableSlots(dayKey: string): Slot[] {
  return UNAVAILABLE_TIMES.map((time) => {
    const start = chicagoTimeToUtc(dayKey, time);
    const end = new Date(start.getTime() + SLOT_MINUTES * 60_000);
    return { start: start.toISOString(), end: end.toISOString() };
  });
}

/**
 * Arma los AGENDA_DAYS días de la agenda con los horarios de Cal.com. "Hoy" solo cuenta si le
 * quedan horarios; un día hábil siguiente cuenta aunque esté lleno.
 */
export function buildAgendaDays(now: Date, slots: Slot[]): AgendaDay[] {
  const { today, following } = getWindowDayKeys(now);
  const slotsByDay = new Map<string, Slot[]>();

  for (const slot of slots) {
    const dayKey = toDayKey(new Date(slot.start), AGENDA_TIME_ZONE);
    slotsByDay.set(dayKey, [...(slotsByDay.get(dayKey) ?? []), slot]);
  }

  const dayKeys =
    today && (slotsByDay.get(today)?.length ?? 0) > 0
      ? [today, ...following].slice(0, AGENDA_DAYS)
      : following;

  return dayKeys.map((date) => ({
    date,
    slots: slotsByDay.get(date) ?? [],
    unavailable: buildUnavailableSlots(date),
  }));
}

/** Pide a Cal.com los horarios de la ventana y los arma por día. */
export async function getAgendaDays(now = new Date()): Promise<AgendaDay[]> {
  const { following } = getWindowDayKeys(now);
  const lastDay = following[following.length - 1];
  const end = chicagoTimeToUtc(addDaysToKey(lastDay, 1), "00:00");

  const slots = await getCalSlots(now, end);
  return buildAgendaDays(now, slots);
}

export function isSlotInAgenda(days: AgendaDay[], slotStart: string): boolean {
  const start = new Date(slotStart).toISOString();
  return days.some((day) => day.slots.some((slot) => slot.start === start));
}
