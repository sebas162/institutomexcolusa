export interface Slot {
  start: string; // ISO (UTC)
  end: string; // ISO (UTC)
}

/** Un día de la agenda tal como lo responde /api/diagnostico/slots/. */
export interface AgendaDay {
  date: string; // "2026-10-12", fecha en America/Chicago
  slots: Slot[];
  unavailable: Slot[];
}

// Zona en la que la clienta define su horario: los días de la agenda se cuentan en ella.
export const AGENDA_TIME_ZONE = "America/Chicago";

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

export function addDaysToKey(dayKey: string, days: number): string {
  const date = new Date(`${dayKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** "Hoy", "Mañana" o "Lun 13", comparando con la fecha de hoy en la zona del visitante. */
export function formatDayButton(dayKey: string, timeZone: string, now = new Date()): string {
  const todayKey = toDayKey(now, timeZone);
  if (dayKey === todayKey) return "Hoy";
  if (dayKey === addDaysToKey(todayKey, 1)) return "Mañana";

  const parts = getFormatter("UTC", { weekday: "short", day: "numeric" }).formatToParts(
    dayKeyToUtcNoon(dayKey)
  );
  const weekday = capitalize(getPart(parts, "weekday").replace(".", ""));
  return `${weekday} ${getPart(parts, "day")}`;
}

/** "12 de octubre" */
export function formatShortDate(dayKey: string): string {
  const parts = getFormatter("UTC", { day: "numeric", month: "long" }).formatToParts(
    dayKeyToUtcNoon(dayKey)
  );
  return `${getPart(parts, "day")} de ${getPart(parts, "month")}`;
}

/** "Jueves 15 de octubre, 1:30 pm" en la zona dada, para el mensaje de confirmación. */
export function formatConfirmationDate(slot: Slot, timeZone: string): string {
  const date = new Date(slot.start);
  const parts = getFormatter(timeZone, {
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h12",
  }).formatToParts(date);
  // es-MX escribe "p.m." (a veces con espacio fino); el mensaje usa "pm".
  const period = getPart(parts, "dayPeriod").replace(/[.\s  ]/g, "").toLowerCase();
  const time = `${getPart(parts, "hour")}:${getPart(parts, "minute")} ${period}`;
  return `${formatDayParts(date, timeZone)}, ${time}`;
}
