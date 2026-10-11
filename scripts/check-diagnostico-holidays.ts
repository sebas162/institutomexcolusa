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

console.log("\nVentana: siempre 3 días hábiles (hoy a las 9:00 a. m. de Chicago)");

// Días que mostraría la agenda si a hoy le quedan horarios o no. Un horario de prueba por
// día hábil candidato basta: buildAgendaDays solo mira si hoy tiene alguno.
function agendaFor(todayKey: string, todayHasSlots: boolean): string[] {
  const now = chicagoTimeToUtc(todayKey, "09:00");
  const { today, following } = getWindowDayKeys(now);
  const candidates = [...(today && todayHasSlots ? [today] : []), ...following];
  const slots = candidates.map((dayKey) => {
    const start = chicagoTimeToUtc(dayKey, "10:00").toISOString();
    return { start, end: start };
  });
  return buildAgendaDays(now, slots).map((day) => `${weekday(day.date)} ${day.date}`);
}

const cases: [string, boolean, string[]][] = [
  ["2026-10-10", true, ["mar 2026-10-13", "mié 2026-10-14", "jue 2026-10-15"]],
  ["2026-10-16", true, ["vie 2026-10-16", "lun 2026-10-19", "mar 2026-10-20"]],
  ["2026-10-16", false, ["lun 2026-10-19", "mar 2026-10-20", "mié 2026-10-21"]],
  ["2026-11-13", true, ["vie 2026-11-13", "mar 2026-11-17", "mié 2026-11-18"]],
  ["2026-11-13", false, ["mar 2026-11-17", "mié 2026-11-18", "jue 2026-11-19"]],
  ["2026-11-25", true, ["mié 2026-11-25", "lun 2026-11-30", "mar 2026-12-01"]],
  ["2026-11-25", false, ["lun 2026-11-30", "mar 2026-12-01", "mié 2026-12-02"]],
  ["2026-12-31", true, ["jue 2026-12-31", "lun 2027-01-04", "mar 2027-01-05"]],
  ["2026-12-31", false, ["lun 2027-01-04", "mar 2027-01-05", "mié 2027-01-06"]],
];
for (const [todayKey, todayHasSlots, expected] of cases) {
  const label = `${weekday(todayKey)} ${todayKey}, ${todayHasSlots ? "con" : "sin"} horarios hoy`;
  check(label, agendaFor(todayKey, todayHasSlots), expected);
}

console.log("\nUn día hábil lleno sigue contando");
const fullDayNow = chicagoTimeToUtc("2026-10-16", "09:00");
const onlyTuesday = chicagoTimeToUtc("2026-10-20", "10:00").toISOString();
check(
  "vie 16 sin horarios, lun 19 lleno",
  buildAgendaDays(fullDayNow, [{ start: onlyTuesday, end: onlyTuesday }]).map(
    (day) => `${day.date}:${day.slots.length}`
  ),
  ["2026-10-19:0", "2026-10-20:1", "2026-10-21:0"]
);

console.log("\nHora de Chicago a UTC (horario de verano)");
check("lun 2026-10-12 15:00 (CDT)", chicagoTimeToUtc("2026-10-12", "15:00").toISOString(), "2026-10-12T20:00:00.000Z");
check("lun 2026-11-02 15:00 (CST)", chicagoTimeToUtc("2026-11-02", "15:00").toISOString(), "2026-11-02T21:00:00.000Z");
check("dom 2026-11-01 00:00 (cambio)", chicagoTimeToUtc("2026-11-01", "00:00").toISOString(), "2026-11-01T05:00:00.000Z");

console.log(failures === 0 ? "\nTodo bien." : `\n${failures} verificaciones fallaron.`);
process.exitCode = failures === 0 ? 0 : 1;
