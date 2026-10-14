import { getMarketLabel } from "@/lib/diagnostico/market";
import { DIAGNOSTICO_QUESTIONS } from "@/lib/diagnostico/questions";
import { formatWhatsappNumber } from "@/lib/diagnostico/schema";
import { addDaysToKey, toDayKey } from "@/lib/diagnostico/slots";
import type { Lead, LeadStatus } from "@/types/lead";

export const HOUSTON_TIME_ZONE = "America/Chicago";
export const CDMX_TIME_ZONE = "America/Mexico_City";

/** Una cita sin confirmar a menos de estas horas se resalta como alerta. */
export const ALERT_HOURS = 3;

export const STATUS_META: Record<LeadStatus, { label: string; className: string }> = {
  nuevo: { label: "Sin cita", className: "bg-muted text-muted-foreground" },
  agendada: { label: "Agendada", className: "bg-secondary text-secondary-foreground" },
  reprogramada: { label: "Reprogramada", className: "bg-[#B45309]/10 text-[#B45309]" },
  confirmada: { label: "Confirmada", className: "bg-primary text-primary-foreground" },
  recordada: { label: "Recordada", className: "bg-secondary text-secondary-foreground" },
  asistio: { label: "Asistió", className: "bg-primary/15 text-primary" },
  no_asistio: { label: "No asistió", className: "bg-destructive/10 text-red-700" },
  cancelada: { label: "Cancelada", className: "bg-muted text-muted-foreground line-through" },
};

export const FILTERABLE_STATUSES: LeadStatus[] = [
  "agendada",
  "reprogramada",
  "confirmada",
  "asistio",
  "no_asistio",
  "cancelada",
  "nuevo",
];

export const SOURCE_LABELS = {
  landing: "Landing",
  webhook: "Cal.com",
  admin: "Admin",
  sync: "Sincronización",
} as const;

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${timeZone}|${JSON.stringify(options)}`;
  let cached = formatterCache.get(key);
  if (!cached) {
    cached = new Intl.DateTimeFormat("es-MX", { timeZone, ...options });
    formatterCache.set(key, cached);
  }
  return cached;
}

/** "1:30 pm" */
export function formatTime(date: Date, timeZone: string): string {
  const parts = formatter(timeZone, { hour: "numeric", minute: "2-digit", hourCycle: "h12" }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const period = get("dayPeriod").replace(/[.\s  ]/g, "").toLowerCase();
  return `${get("hour")}:${get("minute")} ${period}`;
}

/** "martes 13 de octubre" */
export function formatLongDate(date: Date, timeZone: string): string {
  // Intl escribe "martes, 13 de octubre"; se arma sin la coma.
  const parts = formatter(timeZone, { weekday: "long", day: "numeric", month: "long" }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("weekday")} ${get("day")} de ${get("month")}`;
}

/** "mar 13 oct" */
export function formatShortDate(date: Date, timeZone: string): string {
  return formatter(timeZone, { weekday: "short", day: "numeric", month: "short" })
    .format(date)
    .replace(/\./g, "");
}

/** "2026-10-13" para CSV. */
export function formatIsoDate(date: Date, timeZone: string): string {
  return toDayKey(date, timeZone);
}

/** "13 oct 2026, 1:30 pm" para fechas de registro e historial. */
export function formatDateTime(date: Date | undefined, timeZone = CDMX_TIME_ZONE): string {
  if (!date || Number.isNaN(date.getTime())) return "—";
  const day = formatter(timeZone, { day: "numeric", month: "short", year: "numeric" }).format(date).replace(/\./g, "");
  return `${day}, ${formatTime(date, timeZone)}`;
}

/** País de la landing por la que llegó (los leads anteriores al campo market son de México). */
export function countryOf(lead: Lead): string {
  return getMarketLabel(lead.market);
}

/** Filtro por país del admin: "" deja pasar todos. */
export function matchesMarket(lead: Lead, market: string): boolean {
  return !market || lead.market === market;
}

export function phoneLabel(lead: Lead): string {
  return formatWhatsappNumber(lead.whatsappCountryCode, lead.whatsappNumber);
}

export function startOf(lead: Lead): Date | null {
  const start = lead.booking?.startTime;
  return start && !Number.isNaN(start.getTime()) ? start : null;
}

export function isPendingConfirmation(lead: Lead, now: Date): boolean {
  const start = startOf(lead);
  return (
    (lead.status === "agendada" || lead.status === "reprogramada") &&
    start !== null &&
    start.getTime() > now.getTime()
  );
}

/** Agendada o reprogramada, sin confirmar, y la cita empieza en menos de ALERT_HOURS. */
export function isAlert(lead: Lead, now: Date): boolean {
  const start = startOf(lead);
  return (
    isPendingConfirmation(lead, now) &&
    start !== null &&
    start.getTime() - now.getTime() < ALERT_HOURS * 60 * 60 * 1000
  );
}

/** Pasó por "confirmada" alguna vez (aunque después asistiera o no). Un "no asistió" sin confirmar no cuenta. */
export function wasConfirmed(lead: Lead): boolean {
  return (
    lead.status === "confirmada" ||
    lead.statusHistory.some((change) => change.status === "confirmada")
  );
}

export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function matchesSearch(lead: Lead, search: string): boolean {
  const query = normalizeText(search);
  if (!query) return true;

  const digits = query.replace(/\D/g, "");
  const phone = `${lead.whatsappCountryCode}${lead.whatsappNumber}`.replace(/\D/g, "");

  return (
    normalizeText(lead.nombre).includes(query) ||
    normalizeText(lead.email).includes(query) ||
    (digits.length >= 3 && phone.includes(digits))
  );
}

export interface DateRange {
  from: string; // "2026-10-13" o ""
  to: string;
}

/** La cita cae dentro del rango (fechas de Houston). Sin rango, todo entra; sin cita, solo si no hay rango. */
export function inRange(lead: Lead, range: DateRange): boolean {
  if (!range.from && !range.to) return true;
  const start = startOf(lead);
  if (!start) return false;
  const day = toDayKey(start, HOUSTON_TIME_ZONE);
  return (!range.from || day >= range.from) && (!range.to || day <= range.to);
}

export type LeadView = "hoy" | "proximas" | "pasadas" | "sin_cita";

export function filterByView(leads: Lead[], view: LeadView, now: Date): Lead[] {
  const todayKey = toDayKey(now, HOUSTON_TIME_ZONE);
  const byStart = (a: Lead, b: Lead) => startOf(a)!.getTime() - startOf(b)!.getTime();

  switch (view) {
    case "hoy":
      return leads
        .filter((lead) => startOf(lead) && toDayKey(startOf(lead)!, HOUSTON_TIME_ZONE) === todayKey)
        .sort(byStart);
    case "proximas":
      return leads.filter((lead) => startOf(lead) && startOf(lead)!.getTime() >= now.getTime()).sort(byStart);
    case "pasadas":
      return leads
        .filter((lead) => startOf(lead) && startOf(lead)!.getTime() < now.getTime())
        .sort((a, b) => byStart(b, a));
    case "sin_cita":
      return leads
        .filter((lead) => !startOf(lead))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export interface LeadSummary {
  today: number;
  thisWeek: number;
  pending: number;
  alerts: number;
  confirmationRate: number | null;
  attendanceRate: number | null;
  noShows: number;
}

/** Resumen sin pruebas (el panel ya las quita) y dentro del rango de fechas. */
export function computeSummary(leads: Lead[], now: Date): LeadSummary {
  const todayKey = toDayKey(now, HOUSTON_TIME_ZONE);
  const weekday = (new Date(`${todayKey}T00:00:00Z`).getUTCDay() + 6) % 7; // 0 = lunes
  const weekStart = addDaysToKey(todayKey, -weekday);
  const weekEnd = addDaysToKey(weekStart, 6);

  const withBooking = leads.filter((lead) => startOf(lead));
  const active = withBooking.filter((lead) => lead.status !== "cancelada");
  const dayOf = (lead: Lead) => toDayKey(startOf(lead)!, HOUSTON_TIME_ZONE);

  const attended = active.filter((lead) => lead.status === "asistio").length;
  const noShows = active.filter((lead) => lead.status === "no_asistio").length;

  return {
    today: active.filter((lead) => dayOf(lead) === todayKey).length,
    thisWeek: active.filter((lead) => dayOf(lead) >= weekStart && dayOf(lead) <= weekEnd).length,
    pending: active.filter((lead) => isPendingConfirmation(lead, now)).length,
    alerts: active.filter((lead) => isAlert(lead, now)).length,
    confirmationRate: active.length ? active.filter(wasConfirmed).length / active.length : null,
    attendanceRate: attended + noShows ? attended / (attended + noShows) : null,
    noShows,
  };
}

export interface OriginRow {
  campaign: string;
  content: string;
  bookings: number;
  confirmed: number;
  attended: number;
  attendanceRate: number | null;
}

export const NO_UTM = "(sin UTM)";

/** Citas por utm_campaign y utm_content (sin pruebas, dentro del rango). */
export function computeOrigin(leads: Lead[]): OriginRow[] {
  const rows = new Map<string, OriginRow & { noShows: number }>();

  for (const lead of leads.filter((l) => startOf(l))) {
    const campaign = lead.utm.campaign?.trim() || "";
    const content = lead.utm.content?.trim() || "";
    const hasUtm = Boolean(campaign || content);
    const key = hasUtm ? `${campaign}\u0000${content}` : NO_UTM;
    const row = rows.get(key) ?? {
      campaign: hasUtm ? campaign || "—" : NO_UTM,
      content: hasUtm ? content || "—" : "",
      bookings: 0,
      confirmed: 0,
      attended: 0,
      noShows: 0,
      attendanceRate: null,
    };

    row.bookings++;
    if (wasConfirmed(lead)) row.confirmed++;
    if (lead.status === "asistio") row.attended++;
    if (lead.status === "no_asistio") row.noShows++;
    rows.set(key, row);
  }

  return [...rows.values()]
    .map(({ noShows, ...row }) => ({
      ...row,
      attendanceRate: row.attended + noShows ? row.attended / (row.attended + noShows) : null,
    }))
    .sort((a, b) => b.bookings - a.bookings);
}

export function formatPercent(value: number | null): string {
  return value === null ? "—" : `${Math.round(value * 100)}%`;
}

function csvCell(value: string | number | boolean): string {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** CSV de la lista filtrada, UTF-8 con BOM para que Excel respete los acentos. */
export function buildCsv(leads: Lead[]): string {
  const header = [
    "Nombre", "Clínica", "Ciudad", "País", "WhatsApp", "Correo",
    "Fecha Houston", "Hora Houston", "Fecha CDMX", "Hora CDMX", "Estado",
    ...DIAGNOSTICO_QUESTIONS.map((question, i) => `P${i + 1}: ${question.text}`),
    "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid",
    "Consentimiento confirmación", "Consentimiento marketing", "Nota interna",
  ];

  const rows = leads.map((lead) => {
    const start = startOf(lead);
    const answers = DIAGNOSTICO_QUESTIONS.map(
      (question) =>
        lead.answers.find((answer) => answer.questionId === question.id)?.labels.join(" | ") ?? ""
    );

    return [
      lead.nombre, lead.clinica, lead.ciudad, countryOf(lead), phoneLabel(lead), lead.email,
      start ? formatIsoDate(start, HOUSTON_TIME_ZONE) : "",
      start ? formatTime(start, HOUSTON_TIME_ZONE) : "",
      start ? formatIsoDate(start, CDMX_TIME_ZONE) : "",
      start ? formatTime(start, CDMX_TIME_ZONE) : "",
      STATUS_META[lead.status]?.label ?? lead.status,
      ...answers,
      lead.utm.source ?? "", lead.utm.medium ?? "", lead.utm.campaign ?? "",
      lead.utm.content ?? "", lead.utm.term ?? "", lead.utm.fbclid ?? "",
      lead.consentConfirmacion ? "Sí" : "No",
      lead.consentMarketing ? "Sí" : "No",
      lead.adminNote ?? "",
    ];
  });

  return "﻿" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}
