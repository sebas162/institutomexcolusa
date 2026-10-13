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

console.log("\nVentana: los 2 días hábiles más próximos con horarios (AGENDA_DAYS)");

// Días que mostraría la agenda si a hoy le quedan horarios o no. Un horario de prueba por
// día hábil candidato basta: buildAgendaDays solo mira si hoy tiene alguno.
function agendaFor(todayKey: string, time: string, todayHasSlots: boolean): string[] {
  const now = chicagoTimeToUtc(todayKey, time);
  const { today, following } = getWindowDayKeys(now);
  const candidates = [...(today && todayHasSlots ? [today] : []), ...following];
  const slots = candidates.map((dayKey) => {
    const start = chicagoTimeToUtc(dayKey, "10:00").toISOString();
    return { start, end: start };
  });
  return buildAgendaDays(now, slots).map((day) => `${weekday(day.date)} ${day.date}`);
}

// [hoy en Chicago, hora en Chicago, ¿a hoy le quedan horarios?, días esperados]
const cases: [string, string, boolean, string[]][] = [
  // Lunes 12 oct 2026, 2:40 pm en CDMX: Columbus Day.
  ["2026-10-12", "15:40", false, ["mar 2026-10-13", "mié 2026-10-14"]],
  ["2026-10-10", "09:00", true, ["mar 2026-10-13", "mié 2026-10-14"]],
  ["2026-10-16", "09:00", true, ["vie 2026-10-16", "lun 2026-10-19"]],
  ["2026-10-16", "09:00", false, ["lun 2026-10-19", "mar 2026-10-20"]],
  // Fin de mes: el segundo día cae en noviembre.
  ["2026-10-30", "09:00", true, ["vie 2026-10-30", "lun 2026-11-02"]],
  ["2026-10-30", "09:00", false, ["lun 2026-11-02", "mar 2026-11-03"]],
  ["2026-11-13", "09:00", true, ["vie 2026-11-13", "mar 2026-11-17"]],
  ["2026-11-13", "09:00", false, ["mar 2026-11-17", "mié 2026-11-18"]],
  ["2026-11-25", "09:00", true, ["mié 2026-11-25", "lun 2026-11-30"]],
  ["2026-11-25", "09:00", false, ["lun 2026-11-30", "mar 2026-12-01"]],
  // Thanksgiving (jue 26) y el día siguiente (vie 27) están bloqueados.
  ["2026-11-26", "09:00", true, ["lun 2026-11-30", "mar 2026-12-01"]],
  ["2026-12-23", "09:00", true, ["mié 2026-12-23", "jue 2026-12-24"]],
  ["2026-12-23", "09:00", false, ["jue 2026-12-24", "lun 2026-12-28"]],
  ["2026-12-31", "09:00", true, ["jue 2026-12-31", "lun 2027-01-04"]],
  ["2026-12-31", "09:00", false, ["lun 2027-01-04", "mar 2027-01-05"]],
];
for (const [todayKey, time, todayHasSlots, expected] of cases) {
  const label = `${weekday(todayKey)} ${todayKey} ${time}, ${todayHasSlots ? "con" : "sin"} horarios hoy`;
  check(label, agendaFor(todayKey, time, todayHasSlots), expected);
}

console.log("\nUn día hábil lleno no cuenta (igual que Cal.com con rolling)");
const fullDayNow = chicagoTimeToUtc("2026-10-16", "09:00");
const slotOn = (dayKey: string) => {
  const start = chicagoTimeToUtc(dayKey, "10:00").toISOString();
  return { start, end: start };
};
check(
  "vie 16 sin horarios, lun 19 lleno → mar 20 y mié 21",
  buildAgendaDays(fullDayNow, [slotOn("2026-10-20"), slotOn("2026-10-21")]).map((day) => day.date),
  ["2026-10-20", "2026-10-21"]
);
check(
  "vie 16 con horarios, lun 19 lleno → vie 16 y mar 20",
  buildAgendaDays(fullDayNow, [slotOn("2026-10-16"), slotOn("2026-10-20"), slotOn("2026-10-21")]).map((day) => day.date),
  ["2026-10-16", "2026-10-20"]
);
check(
  "admin: 10 días con horarios saltando el lleno (lun 19)",
  buildAgendaDays(
    fullDayNow,
    ["2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23", "2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-11-02", "2026-11-03"].map(slotOn),
    10
  ).map((day) => day.date).join(","),
  "2026-10-20,2026-10-21,2026-10-22,2026-10-23,2026-10-26,2026-10-27,2026-10-28,2026-10-29,2026-10-30,2026-11-02"
);

console.log("\nHora de Chicago a UTC (horario de verano)");
check("lun 2026-10-12 15:00 (CDT)", chicagoTimeToUtc("2026-10-12", "15:00").toISOString(), "2026-10-12T20:00:00.000Z");
check("lun 2026-11-02 15:00 (CST)", chicagoTimeToUtc("2026-11-02", "15:00").toISOString(), "2026-11-02T21:00:00.000Z");
check("dom 2026-11-01 00:00 (cambio)", chicagoTimeToUtc("2026-11-01", "00:00").toISOString(), "2026-11-01T05:00:00.000Z");

console.log(failures === 0 ? "\nTodo bien." : `\n${failures} verificaciones fallaron.`);
process.exitCode = failures === 0 ? 0 : 1;
