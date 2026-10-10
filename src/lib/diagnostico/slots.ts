export interface Slot {
  start: string; // ISO (UTC)
  end: string; // ISO (UTC)
}

export interface DiagnosticoTimeZone {
  id: string;
  label: string;
}

export const DEFAULT_TIME_ZONE = "America/Mexico_City";

export const DIAGNOSTICO_TIME_ZONES: DiagnosticoTimeZone[] = [
  { id: "America/Mexico_City", label: "Centro de México" },
  { id: "America/Mazatlan", label: "Pacífico de México" },
  { id: "America/Tijuana", label: "Tijuana" },
  { id: "America/Cancun", label: "Cancún" },
  { id: "America/New_York", label: "USA Este" },
  { id: "America/Chicago", label: "USA Centro" },
  { id: "America/Denver", label: "USA Montaña" },
  { id: "America/Phoenix", label: "USA Arizona" },
  { id: "America/Los_Angeles", label: "USA Pacífico" },
  { id: "America/Anchorage", label: "USA Alaska" },
  { id: "Pacific/Honolulu", label: "USA Hawái" },
];

// Otras zonas de México y USA que el navegador puede reportar, con su equivalente en la lista.
const TIME_ZONE_ALIASES: Record<string, string> = {
  "America/Monterrey": "America/Mexico_City",
  "America/Merida": "America/Mexico_City",
  "America/Bahia_Banderas": "America/Mexico_City",
  "America/Chihuahua": "America/Mexico_City",
  "America/Hermosillo": "America/Mazatlan",
  "America/Matamoros": "America/Chicago",
  "America/Ojinaga": "America/Chicago",
  "America/Ciudad_Juarez": "America/Denver",
  "America/Santa_Isabel": "America/Tijuana",
  "America/Ensenada": "America/Tijuana",
  "America/Detroit": "America/New_York",
  "America/Indianapolis": "America/New_York",
  "America/Louisville": "America/New_York",
  "America/Boise": "America/Denver",
  "America/Menominee": "America/Chicago",
  "US/Eastern": "America/New_York",
  "US/Central": "America/Chicago",
  "US/Mountain": "America/Denver",
  "US/Arizona": "America/Phoenix",
  "US/Pacific": "America/Los_Angeles",
  "America/Juneau": "America/Anchorage",
  "America/Sitka": "America/Anchorage",
  "America/Nome": "America/Anchorage",
  "America/Yakutat": "America/Anchorage",
  "America/Metlakatla": "America/Anchorage",
  "US/Alaska": "America/Anchorage",
  "US/Hawaii": "Pacific/Honolulu",
};

const TIME_ZONE_PREFIX_ALIASES: [string, string][] = [
  ["America/Indiana/", "America/New_York"],
  ["America/Kentucky/", "America/New_York"],
  ["America/North_Dakota/", "America/Chicago"],
];

export function resolveTimeZone(timeZone: string | undefined): string {
  if (!timeZone) return DEFAULT_TIME_ZONE;
  if (DIAGNOSTICO_TIME_ZONES.some((zone) => zone.id === timeZone)) return timeZone;
  if (TIME_ZONE_ALIASES[timeZone]) return TIME_ZONE_ALIASES[timeZone];

  const prefixMatch = TIME_ZONE_PREFIX_ALIASES.find(([prefix]) => timeZone.startsWith(prefix));
  return prefixMatch ? prefixMatch[1] : DEFAULT_TIME_ZONE;
}

/** Zona del visitante si es de México o USA; si no, la del centro de México. */
export function detectVisitorTimeZone(): string {
  try {
    return resolveTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return DEFAULT_TIME_ZONE;
  }
}

export function getTimeZoneLabel(timeZone: string): string {
  return DIAGNOSTICO_TIME_ZONES.find((zone) => zone.id === timeZone)?.label ?? timeZone;
}

const SLOT_DURATION_MINUTES = 15;
const SIMULATED_DAYS_AHEAD = 21;
const SIMULATED_TIMES = ["09:00", "10:00", "11:30", "13:00", "16:00", "17:30"];

// Los horarios simulados se definen en hora del centro de México, que no tiene
// horario de verano desde 2022: UTC-6 todo el año.
const MEXICO_CITY_OFFSET = "-06:00";

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${timeZone}|${JSON.stringify(options)}`;
  let formatter = formatterCache.get(key);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat("es-MX", { timeZone, ...options });
    formatterCache.set(key, formatter);
  }

  return formatter;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getPart(parts: Intl.DateTimeFormatPart[], type: string): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

/** "2026-10-15": fecha de ese instante en la zona dada. */
export function toDayKey(date: Date, timeZone: string): string {
  const parts = getFormatter(timeZone, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return `${getPart(parts, "year")}-${getPart(parts, "month")}-${getPart(parts, "day")}`;
}

// Un dayKey es una fecha de calendario sin hora: se formatea en UTC para no correrla de día.
function dayKeyToUtcNoon(dayKey: string): Date {
  return new Date(`${dayKey}T12:00:00Z`);
}

function formatDayParts(date: Date, timeZone: string): string {
  const parts = getFormatter(timeZone, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).formatToParts(date);
  return `${capitalize(getPart(parts, "weekday"))} ${getPart(parts, "day")} de ${getPart(parts, "month")}`;
}

/** "Jueves 15 de octubre" */
export function formatDayKeyLabel(dayKey: string): string {
  return formatDayParts(dayKeyToUtcNoon(dayKey), "UTC");
}

/** "Octubre 2026" para el mes de ese dayKey. */
export function formatMonthLabel(dayKey: string): string {
  const parts = getFormatter("UTC", { month: "long", year: "numeric" }).formatToParts(
    dayKeyToUtcNoon(dayKey)
  );
  return `${capitalize(getPart(parts, "month"))} ${getPart(parts, "year")}`;
}

/** "11:30 a.m." en la zona dada. */
export function formatSlotTime(slot: Slot, timeZone: string): string {
  return getFormatter(timeZone, { hour: "numeric", minute: "2-digit" }).format(
    new Date(slot.start)
  );
}

/** "Jueves 15 de octubre · 11:30 a.m." en la zona dada. */
export function formatSlotLabel(slot: Slot, timeZone: string): string {
  return `${formatDayParts(new Date(slot.start), timeZone)} · ${formatSlotTime(slot, timeZone)}`;
}

function addDays(dayKey: string, days: number): string {
  const date = new Date(`${dayKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function buildSimulatedSlots(): Slot[] {
  const todayInMexico = toDayKey(new Date(), DEFAULT_TIME_ZONE);
  const slots: Slot[] = [];

  for (let offset = 1; offset <= SIMULATED_DAYS_AHEAD; offset++) {
    const dayKey = addDays(todayInMexico, offset);
    const date = new Date(`${dayKey}T00:00:00Z`);
    const weekday = date.getUTCDay();

    if (weekday === 0 || weekday === 6) {
      continue;
    }

    // Determinista: la cantidad (4 a 6) y la rotación dependen del día del mes.
    const dayOfMonth = date.getUTCDate();
    const count = 4 + (dayOfMonth % 3);
    const rotation = dayOfMonth % SIMULATED_TIMES.length;
    const times = SIMULATED_TIMES.map(
      (_, i) => SIMULATED_TIMES[(i + rotation) % SIMULATED_TIMES.length]
    )
      .slice(0, count)
      .sort();

    for (const time of times) {
      const start = new Date(`${dayKey}T${time}:00${MEXICO_CITY_OFFSET}`);
      const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60_000);
      slots.push({ start: start.toISOString(), end: end.toISOString() });
    }
  }

  return slots;
}

// TODO Fase 3: reemplazar por la disponibilidad real de Cal.com.
// La interfaz solo depende de esta firma, no de cómo se generan los horarios.
export async function getAvailableSlots(from: Date, to: Date): Promise<Slot[]> {
  const fromTime = from.getTime();
  const toTime = to.getTime();

  return buildSimulatedSlots().filter((slot) => {
    const start = new Date(slot.start).getTime();
    return start >= fromTime && start < toTime;
  });
}
