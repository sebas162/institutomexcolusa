// Cliente de la API v2 de Cal.com. Solo para el servidor: CAL_API_KEY no lleva
// NEXT_PUBLIC_, así que nunca llega al navegador. No registrar la llave ni los headers.

import { DEFAULT_MARKET, type DiagnosticoMarket } from "@/lib/diagnostico/market";
import type { Slot } from "@/lib/diagnostico/slots";

const CAL_API_BASE = "https://api.cal.com";
const SLOTS_API_VERSION = "2024-09-04";
const BOOKINGS_API_VERSION = "2026-02-25";
const REQUEST_TIMEOUT_MS = 10_000;
// Consultas de horarios: un reintento si Cal.com no responde o falla del lado de ellos (5xx).
// Cada intento espera menos para que los dos quepan holgados en el tiempo de la función.
const SLOTS_TIMEOUT_MS = 8_000;
const SLOTS_RETRY_DELAY_MS = 500;
const SCHEDULES_API_VERSION = "2024-06-11";

export type CalcomErrorCode = "slot_unavailable" | "calcom_error";

export class CalcomError extends Error {
  constructor(
    public readonly code: CalcomErrorCode,
    message: string,
    public readonly status?: number,
    /** Sin respuesta (timeout o red) o error 5xx: vale la pena reintentar una consulta. */
    public readonly retryable = false
  ) {
    super(message);
    this.name = "CalcomError";
  }
}

// Cada país tiene su evento y su horario (market.calcom). Las variables de entorno solo
// reemplazan los de México, que existían antes de separar los países.
function calcomId(
  market: DiagnosticoMarket,
  envName: string,
  key: keyof DiagnosticoMarket["calcom"]
): number {
  if (market.id === DEFAULT_MARKET.id) {
    const value = Number(process.env[envName]);
    if (Number.isInteger(value) && value > 0) return value;
  }
  return market.calcom[key];
}

export function getCalEventTypeId(market = DEFAULT_MARKET): number {
  return calcomId(market, "CAL_EVENT_TYPE_ID", "eventTypeId");
}

/**
 * Evento oculto "llamada-diagnostico-interno": mismo horario que el principal pero sin límite de
 * días. El admin solo lo usa para consultar horarios de 10 días hábiles; reservar y reprogramar
 * siguen sobre el evento principal.
 */
export function getCalAdminSlotsEventTypeId(market = DEFAULT_MARKET): number {
  return calcomId(market, "CAL_ADMIN_SLOTS_EVENT_TYPE_ID", "adminSlotsEventTypeId");
}

export function getCalScheduleId(market = DEFAULT_MARKET): number {
  return calcomId(market, "CAL_SCHEDULE_ID", "scheduleId");
}

function getApiKey(): string {
  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) {
    throw new CalcomError("calcom_error", "CAL_API_KEY no está configurada");
  }
  return apiKey;
}

// Respuestas de Cal.com que significan que el horario ya no se puede reservar.
const SLOT_UNAVAILABLE_PATTERNS = [
  /no_available_users_found/i,
  /already has booking/i,
  /not available/i,
  /booking_time_out_of_bounds/i,
  /in the past/i,
];

function extractErrorMessage(body: unknown): string {
  if (body && typeof body === "object" && "error" in body) {
    const error = (body as { error: unknown }).error;
    if (error && typeof error === "object" && "message" in error) {
      return String((error as { message: unknown }).message);
    }
    return typeof error === "string" ? error : JSON.stringify(error);
  }
  return "";
}

async function calFetch<T>(
  path: string,
  apiVersion: string,
  init: { method?: "GET" | "POST" | "PATCH"; body?: unknown; timeoutMs?: number } = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${CAL_API_BASE}${path}`, {
      method: init.method ?? "GET",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "cal-api-version": apiVersion,
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(init.timeoutMs ?? REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof CalcomError) throw error;
    const reason = error instanceof Error ? error.name : "unknown";
    throw new CalcomError("calcom_error", `Cal.com no respondió (${reason})`, undefined, true);
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = extractErrorMessage(body) || `HTTP ${response.status}`;
    const slotUnavailable =
      (response.status === 400 || response.status === 409) &&
      SLOT_UNAVAILABLE_PATTERNS.some((pattern) => pattern.test(message));

    throw new CalcomError(
      slotUnavailable ? "slot_unavailable" : "calcom_error",
      `Cal.com ${path.split("?")[0]}: ${message}`,
      response.status,
      response.status >= 500
    );
  }

  return (body as { data: T }).data;
}

/** Horarios libres de un evento (por defecto el principal) entre dos instantes, en ISO UTC. */
export async function getCalSlots(
  startUtc: Date,
  endUtc: Date,
  eventTypeId = getCalEventTypeId()
): Promise<Slot[]> {
  const params = new URLSearchParams({
    eventTypeId: String(eventTypeId),
    start: startUtc.toISOString(),
    end: endUtc.toISOString(),
    timeZone: "UTC",
    format: "range",
  });

  const path = `/v2/slots?${params}`;
  type SlotsData = Record<string, { start: string; end: string }[]>;

  let data: SlotsData;
  try {
    data = await calFetch<SlotsData>(path, SLOTS_API_VERSION, { timeoutMs: SLOTS_TIMEOUT_MS });
  } catch (error) {
    // Solo lectura: reintentar no tiene efectos. Las reservas nunca se reintentan solas.
    if (!(error instanceof CalcomError) || !error.retryable) throw error;
    console.warn("Cal.com /v2/slots falló, reintentando:", error.message);
    await new Promise((resolve) => setTimeout(resolve, SLOTS_RETRY_DELAY_MS));
    data = await calFetch<SlotsData>(path, SLOTS_API_VERSION, { timeoutMs: SLOTS_TIMEOUT_MS });
  }

  return Object.values(data ?? {})
    .flat()
    .map((slot) => ({
      start: new Date(slot.start).toISOString(),
      end: new Date(slot.end).toISOString(),
    }))
    .sort((a, b) => a.start.localeCompare(b.start));
}

export interface CreateCalBookingInput {
  /** Evento principal del país de la landing. */
  eventTypeId: number;
  startUtc: string;
  name: string;
  email: string;
  phoneE164: string;
  timeZone: string;
  leadId: string;
  notes: string;
}

export interface CalBooking {
  uid: string;
  start: string;
  end: string;
  /** Enlace de la videollamada (Teams); null si Cal.com no lo devolvió. */
  meetingUrl: string | null;
}

interface CalBookingData {
  uid: string;
  start: string;
  end: string;
  meetingUrl?: string | null;
  location?: string | null;
}

function toCalBooking(data: CalBookingData): CalBooking {
  const meetingUrl =
    data.meetingUrl ?? (data.location?.startsWith("https://") ? data.location : null);

  return {
    uid: data.uid,
    start: new Date(data.start).toISOString(),
    end: new Date(data.end).toISOString(),
    meetingUrl,
  };
}

export async function createCalBooking(input: CreateCalBookingInput): Promise<CalBooking> {
  const data = await calFetch<CalBookingData>(
    "/v2/bookings",
    BOOKINGS_API_VERSION,
    {
      method: "POST",
      body: {
        start: input.startUtc,
        eventTypeId: input.eventTypeId,
        attendee: {
          name: input.name,
          email: input.email,
          timeZone: input.timeZone,
          phoneNumber: input.phoneE164,
          language: "es",
        },
        metadata: { leadId: input.leadId },
        bookingFieldsResponses: { notes: input.notes },
      },
    }
  );

  return toCalBooking(data);
}

/** Reprograma una reserva; Cal.com crea una reserva nueva (uid nuevo) y cancela la anterior. */
export async function rescheduleCalBooking(
  uid: string,
  startUtc: string,
  reason: string
): Promise<CalBooking> {
  const data = await calFetch<CalBookingData>(
    `/v2/bookings/${encodeURIComponent(uid)}/reschedule`,
    BOOKINGS_API_VERSION,
    { method: "POST", body: { start: startUtc, reschedulingReason: reason } }
  );

  return toCalBooking(data);
}

export interface CalBookingStatus extends CalBooking {
  status: string; // "accepted", "cancelled", "pending"…
  /** Si se reprogramó, uid de la reserva nueva. */
  rescheduledToUid: string | null;
}

/** Estado actual de una reserva en Cal.com (para la sincronización del admin). */
export async function getCalBooking(uid: string): Promise<CalBookingStatus> {
  const data = await calFetch<CalBookingData & { status: string; rescheduledToUid?: string | null }>(
    `/v2/bookings/${encodeURIComponent(uid)}`,
    BOOKINGS_API_VERSION
  );

  return {
    ...toCalBooking(data),
    status: data.status,
    rescheduledToUid: data.rescheduledToUid ?? null,
  };
}

export async function cancelCalBooking(uid: string, reason: string): Promise<void> {
  await calFetch(`/v2/bookings/${encodeURIComponent(uid)}/cancel`, BOOKINGS_API_VERSION, {
    method: "POST",
    body: { cancellationReason: reason },
  });
}

export interface CalScheduleOverride {
  date: string; // "2026-11-26"
  startTime: string; // "HH:MM"
  endTime: string;
}

/** Fechas especiales del horario (un override 00:00–00:00 bloquea el día completo). */
export async function getCalScheduleOverrides(scheduleId = getCalScheduleId()): Promise<CalScheduleOverride[]> {
  const data = await calFetch<{ overrides?: CalScheduleOverride[] }>(
    `/v2/schedules/${scheduleId}`,
    SCHEDULES_API_VERSION
  );
  return data.overrides ?? [];
}

/** Reemplaza la lista de overrides del horario: siempre manda la lista completa. */
export async function setCalScheduleOverrides(
  overrides: CalScheduleOverride[],
  scheduleId = getCalScheduleId()
): Promise<CalScheduleOverride[]> {
  const data = await calFetch<{ overrides?: CalScheduleOverride[] }>(
    `/v2/schedules/${scheduleId}`,
    SCHEDULES_API_VERSION,
    { method: "PATCH", body: { overrides } }
  );
  return data.overrides ?? [];
}
