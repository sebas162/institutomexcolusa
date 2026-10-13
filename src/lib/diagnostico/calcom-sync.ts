// Solo servidor. Red de seguridad: si un webhook de Cal.com no llegó, corrige los leads con lo
// que Cal.com tiene de verdad. Es idempotente: un lead que ya coincide no se toca.

import { CalcomError, getCalBooking, type CalBookingStatus } from "@/lib/calcom";
import {
  listLeadsWithBookingSinceAdmin,
  updateLeadBookingAdmin,
  type LeadBookingState,
} from "@/lib/firestore/leads-admin";

const LOOKBACK_MS = 24 * 60 * 60 * 1000;
// Cal.com permite 120 peticiones por minuto: con 550 ms entre llamadas quedan ~109.
const MIN_GAP_MS = 550;
const MAX_LEADS_PER_RUN = 100;
const MAX_RESCHEDULE_HOPS = 5;

export interface SyncChange {
  leadId: string;
  from: string;
  to: string;
}

export interface SyncResult {
  checked: number;
  updated: number;
  errors: number;
  changes: SyncChange[];
}

const CANCELLED_STATUSES = ["cancelled", "rejected"];

export async function syncLeadsWithCalcom(now = new Date()): Promise<SyncResult> {
  const since = new Date(now.getTime() - LOOKBACK_MS);
  const leads = (await listLeadsWithBookingSinceAdmin(since))
    .filter((lead) => !lead.isTest && lead.status !== "cancelada" && lead.booking)
    .slice(0, MAX_LEADS_PER_RUN);

  let lastCall = 0;
  const fetchBooking = async (uid: string): Promise<CalBookingStatus> => {
    const wait = lastCall + MIN_GAP_MS - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastCall = Date.now();
    return getCalBooking(uid);
  };

  const result: SyncResult = { checked: 0, updated: 0, errors: 0, changes: [] };

  for (const lead of leads) {
    result.checked++;
    try {
      const change = await syncLead(lead, fetchBooking);
      if (change) {
        result.updated++;
        result.changes.push(change);
      }
    } catch (error) {
      result.errors++;
      const reason = error instanceof CalcomError ? error.message : error instanceof Error ? error.message : error;
      console.error(`Error syncing lead ${lead.id} with Cal.com:`, reason);
    }
  }

  return result;
}

async function syncLead(
  lead: LeadBookingState,
  fetchBooking: (uid: string) => Promise<CalBookingStatus>
): Promise<SyncChange | null> {
  const booking = lead.booking!;
  let cal = await fetchBooking(booking.uid);

  // Una reprogramación cancela la reserva vieja y apunta a la nueva: se sigue la cadena.
  for (let hop = 0; cal.status === "cancelled" && cal.rescheduledToUid && hop < MAX_RESCHEDULE_HOPS; hop++) {
    cal = await fetchBooking(cal.rescheduledToUid);
  }

  const isCancelled = CANCELLED_STATUSES.includes(cal.status);
  const moved =
    cal.uid !== booking.uid || new Date(cal.start).getTime() !== booking.startTime.getTime();

  if (!isCancelled && !moved) return null;

  const nextBooking = moved
    ? {
        uid: cal.uid,
        startTime: new Date(cal.start),
        endTime: new Date(cal.end),
        meetingUrl: cal.meetingUrl ?? booking.meetingUrl ?? null,
      }
    : undefined;
  const nextStatus = isCancelled ? "cancelada" : "reprogramada";

  await updateLeadBookingAdmin(lead.id, {
    status: nextStatus,
    ...(nextBooking ? { booking: nextBooking } : {}),
    source: "sync",
    note: isCancelled ? "Cancelada en Cal.com" : "Reprogramada en Cal.com",
  });

  return { leadId: lead.id, from: lead.status, to: nextStatus };
}
