// Verificación de festivos y de la ventana de la agenda de /diagnostico.
// Uso: npx tsx scripts/check-diagnostico-holidays.ts

import { getEasterSunday, getHolidays } from "../src/lib/diagnostico/holidays";
import {
  buildAgendaDays,
  chicagoTimeToUtc,
  getWindowDayKeys,
} from "../src/lib/diagnostico/agenda-window";

let failures = 0;

function check(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "OK  " : "FALLA"} ${label}: ${JSON.stringify(actual)}${ok ? "" : ` (esperado ${JSON.stringify(expected)})`}`);
}

const WEEKDAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const weekday = (dayKey: string) => WEEKDAYS[new Date(`${dayKey}T00:00:00Z`).getUTCDay()];

for (const year of [2026, 2027]) {
  console.log(`\nFestivos ${year} (Pascua: ${getEasterSunday(year)})`);
  for (const holiday of getHolidays(year)) {
    console.log(`  ${holiday.date} ${weekday(holiday.date)}  ${holiday.name}`);
  }
}

console.log("\nPascua");
check("2026", getEasterSunday(2026), "2026-04-05");
check("2027", getEasterSunday(2027), "2027-03-28");

console.log("\nObservados");
const dates2027 = getHolidays(2027).map((holiday) => holiday.date);
check("Juneteenth 2027 (sáb) bloquea vie 18", dates2027.includes("2027-06-18"), true);
check("4 de julio 2027 (dom) bloquea lun 5", dates2027.includes("2027-07-05"), true);
check("Navidad 2027 (sáb) bloquea vie 24", dates2027.includes("2027-12-24"), true);
check("1 de enero 2028 (sáb) bloquea vie 31 dic 2027", dates2027.includes("2027-12-31"), true);

console.log("\nVentana (hoy a las 9:00 a. m. de Chicago)");
const cases: [string, string, string[]][] = [
  ["2026-11-13", "2026-11-13", ["2026-11-17", "2026-11-18"]],
  ["2026-11-25", "2026-11-25", ["2026-11-30", "2026-12-01"]],
  ["2026-12-31", "2026-12-31", ["2027-01-04", "2027-01-05"]],
];
for (const [todayKey, expectedToday, expectedFollowing] of cases) {
  const window = getWindowDayKeys(chicagoTimeToUtc(todayKey, "09:00"));
  check(`${weekday(todayKey)} ${todayKey}`, window, {
    today: expectedToday,
    following: expectedFollowing,
  });
}
check(
  "sáb 2026-10-10 (no es hábil; lun 12 es Columbus Day)",
  getWindowDayKeys(chicagoTimeToUtc("2026-10-10", "09:00")),
  { today: null, following: ["2026-10-13", "2026-10-14"] }
);

console.log("\n\"Hoy\" sin horarios no aparece");
const now = chicagoTimeToUtc("2026-11-13", "14:00");
const nextSlot = chicagoTimeToUtc("2026-11-17", "10:00").toISOString();
check(
  "vie 13 a las 2:00 p. m. sin horarios",
  buildAgendaDays(now, [{ start: nextSlot, end: nextSlot }]).map((day) => day.date),
  ["2026-11-17", "2026-11-18"]
);

console.log("\nHora de Chicago a UTC (horario de verano)");
check("lun 2026-10-12 15:00 (CDT)", chicagoTimeToUtc("2026-10-12", "15:00").toISOString(), "2026-10-12T20:00:00.000Z");
check("lun 2026-11-02 15:00 (CST)", chicagoTimeToUtc("2026-11-02", "15:00").toISOString(), "2026-11-02T21:00:00.000Z");
check("dom 2026-11-01 00:00 (cambio)", chicagoTimeToUtc("2026-11-01", "00:00").toISOString(), "2026-11-01T05:00:00.000Z");

console.log(failures === 0 ? "\nTodo bien." : `\n${failures} verificaciones fallaron.`);
process.exitCode = failures === 0 ? 0 : 1;
