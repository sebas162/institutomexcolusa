import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import {
  findLeadByBookingUidAdmin,
  getLeadAdmin,
  updateLeadBookingAdmin,
  type LeadBookingState,
} from "@/lib/firestore/leads-admin";

export const dynamic = "force-dynamic";

interface CalWebhookPayload {
  uid?: string;
  startTime?: string;
  endTime?: string;
  rescheduleUid?: string;
  location?: string;
  videoCallData?: { url?: unknown } | null;
  metadata?: { leadId?: unknown; videoCallUrl?: unknown } | null;
}

// Cal.com manda el enlace de la videollamada en distintos campos según la integración.
function getMeetingUrl(payload: CalWebhookPayload): string | null {
  const candidates = [payload.videoCallData?.url, payload.metadata?.videoCallUrl, payload.location];
  const url = candidates.find(
    (value): value is string => typeof value === "string" && value.startsWith("https://")
  );
  return url ?? null;
}

interface CalWebhookBody {
  triggerEvent?: string;
  payload?: CalWebhookPayload;
}

function isValidSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;

  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"), "hex");
  const received = Buffer.from(signature.trim().toLowerCase().replace(/^sha256=/, ""), "hex");

  return received.length === expected.length && timingSafeEqual(received, expected);
}

async function findLead(
  payload: CalWebhookPayload,
  bookingUid: string | undefined
): Promise<LeadBookingState | null> {
  const leadId = payload.metadata?.leadId;

  if (typeof leadId === "string" && /^[A-Za-z0-9]{1,64}$/.test(leadId)) {
    const lead = await getLeadAdmin(leadId);
    if (lead) return lead;
  }

  return bookingUid ? findLeadByBookingUidAdmin(bookingUid) : null;
}

function sameInstant(a: Date | undefined, b: string | undefined): boolean {
  return Boolean(a && b) && a!.getTime() === new Date(b!).getTime();
}

export async function POST(request: Request) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CAL_WEBHOOK_SECRET no está configurada");
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const rawBody = await request.text();

  if (!isValidSignature(rawBody, request.headers.get("x-cal-signature-256"), secret)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let body: CalWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const payload = body.payload ?? {};
  const { uid, startTime, endTime } = payload;
  const meetingUrl = getMeetingUrl(payload);

  // Todos los casos son idempotentes: si el lead ya está así, no se escribe nada.
  try {
    switch (body.triggerEvent) {
      case "BOOKING_CREATED": {
        const lead = await findLead(payload, uid);
        if (lead && lead.booking === null && uid && startTime && endTime) {
          await updateLeadBookingAdmin(lead.id, {
            status: "agendada",
            booking: { uid, startTime: new Date(startTime), endTime: new Date(endTime), meetingUrl },
            source: "webhook",
          });
        }
        break;
      }

      case "BOOKING_CANCELLED": {
        const lead = await findLead(payload, uid);
        // Solo la reserva vigente: una cancelación vieja no debe tocar la nueva.
        // Si se canceló desde el admin, el lead ya está en "cancelada" y no se duplica.
        if (lead && lead.booking?.uid === uid && lead.status !== "cancelada") {
          await updateLeadBookingAdmin(lead.id, { status: "cancelada", source: "webhook" });
        }
        break;
      }

      case "BOOKING_RESCHEDULED": {
        // La reserva nueva trae el uid anterior en rescheduleUid. Si se reprogramó desde el
        // admin, el lead ya tiene el uid y las fechas nuevas: se detecta como ya aplicado.
        const lead =
          (await findLead(payload, payload.rescheduleUid)) ??
          (uid ? await findLeadByBookingUidAdmin(uid) : null);

        const alreadyApplied =
          lead?.booking?.uid === uid &&
          sameInstant(lead?.booking?.startTime, startTime) &&
          sameInstant(lead?.booking?.endTime, endTime);

        if (lead && uid && startTime && endTime && !alreadyApplied) {
          await updateLeadBookingAdmin(lead.id, {
            // El cliente reprogramó desde Cal.com: queda pendiente de confirmar otra vez.
            status: "reprogramada",
            booking: { uid, startTime: new Date(startTime), endTime: new Date(endTime), meetingUrl },
            source: "webhook",
          });
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    // 500 para que Cal.com reintente el envío.
    console.error("Error handling Cal.com webhook:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
