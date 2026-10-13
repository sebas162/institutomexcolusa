// Festivos de México y USA en los que no se agendan llamadas. Se calculan por año,
// sin listas fijas, a partir de las reglas aprobadas por la clienta.

export interface Holiday {
  date: string; // "2026-11-26"
  name: string;
}

function toKey(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10);
}

function shiftKey(dayKey: string, days: number): string {
  const date = new Date(`${dayKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function weekdayOf(dayKey: string): number {
  return new Date(`${dayKey}T00:00:00Z`).getUTCDay(); // 0 domingo … 6 sábado
}

/** n-ésimo día de la semana del mes (n = 1 es el primero). */
function nthWeekday(year: number, month: number, weekday: number, n: number): string {
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const day = 1 + ((weekday - first + 7) % 7) + (n - 1) * 7;
  return toKey(year, month, day);
}

function lastWeekday(year: number, month: number, weekday: number): string {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const last = new Date(Date.UTC(year, month - 1, lastDay)).getUTCDay();
  return toKey(year, month, lastDay - ((last - weekday + 7) % 7));
}

/** Domingo de Pascua (algoritmo gregoriano anónimo de Meeus/Jones/Butcher). */
export function getEasterSunday(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return toKey(year, month, day);
}

const MONDAY = 1;
const THURSDAY = 4;

function mexicoHolidays(year: number): Holiday[] {
  const easter = getEasterSunday(year);

  return [
    { date: toKey(year, 1, 1), name: "MX Año Nuevo" },
    { date: nthWeekday(year, 2, MONDAY, 1), name: "MX Día de la Constitución" },
    { date: nthWeekday(year, 3, MONDAY, 3), name: "MX Natalicio de Benito Juárez" },
    { date: shiftKey(easter, -3), name: "MX Jueves Santo" },
    { date: shiftKey(easter, -2), name: "MX Viernes Santo" },
    { date: toKey(year, 5, 1), name: "MX Día del Trabajo" },
    { date: toKey(year, 9, 16), name: "MX Día de la Independencia" },
    { date: nthWeekday(year, 11, MONDAY, 3), name: "MX Día de la Revolución" },
    { date: toKey(year, 12, 25), name: "MX Navidad" },
  ];
}

/** Si un festivo fijo de USA cae en sábado se bloquea el viernes anterior; en domingo, el lunes siguiente. */
function withObserved(holiday: Holiday): Holiday[] {
  const weekday = weekdayOf(holiday.date);
  if (weekday === 6) return [holiday, { date: shiftKey(holiday.date, -1), name: `${holiday.name} (observado)` }];
  if (weekday === 0) return [holiday, { date: shiftKey(holiday.date, 1), name: `${holiday.name} (observado)` }];
  return [holiday];
}

function usaHolidays(year: number): Holiday[] {
  const thanksgiving = nthWeekday(year, 11, THURSDAY, 4);

  const fixed: Holiday[] = [
    { date: toKey(year, 1, 1), name: "USA New Year's Day" },
    { date: toKey(year, 6, 19), name: "USA Juneteenth" },
    { date: toKey(year, 7, 4), name: "USA Independence Day" },
    { date: toKey(year, 11, 11), name: "USA Veterans Day" },
    { date: toKey(year, 12, 25), name: "USA Christmas" },
  ];

  return [
    ...fixed.flatMap(withObserved),
    { date: nthWeekday(year, 1, MONDAY, 3), name: "USA Martin Luther King Jr. Day" },
    { date: nthWeekday(year, 2, MONDAY, 3), name: "USA Presidents' Day" },
    { date: lastWeekday(year, 5, MONDAY), name: "USA Memorial Day" },
    { date: nthWeekday(year, 9, MONDAY, 1), name: "USA Labor Day" },
    { date: nthWeekday(year, 10, MONDAY, 2), name: "USA Columbus Day" },
    { date: thanksgiving, name: "USA Thanksgiving" },
    { date: shiftKey(thanksgiving, 1), name: "USA Día después de Thanksgiving" },
  ];
}

const holidaysCache = new Map<number, Holiday[]>();

/**
 * Festivos que caen dentro del año, ordenados por fecha. Incluye los observados que vienen
 * de otro año (p. ej. el 1 de enero de 2028 cae en sábado y bloquea el 31 de diciembre de 2027).
 */
export function getHolidays(year: number): Holiday[] {
  const cached = holidaysCache.get(year);
  if (cached) return cached;

  const prefix = `${year}-`;
  const holidays = [year - 1, year, year + 1]
    .flatMap((y) => [...mexicoHolidays(y), ...usaHolidays(y)])
    .filter((holiday) => holiday.date.startsWith(prefix))
    .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));

  holidaysCache.set(year, holidays);
  return holidays;
}

export function isHoliday(dayKey: string): boolean {
  const year = Number(dayKey.slice(0, 4));
  return getHolidays(year).some((holiday) => holiday.date === dayKey);
}
