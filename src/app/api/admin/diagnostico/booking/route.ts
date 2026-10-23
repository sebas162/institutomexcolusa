import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminRequest } from "@/lib/admin-auth";
import {
  CalcomError,
  cancelCalBooking,
  getCalAdminSlotsEventTypeId,
  rescheduleCalBooking,
} from "@/lib/calcom";
import { ADMIN_RESCHEDULE_DAYS, ADMIN_RESCHEDULE_NOTE } from "@/lib/diagnostico/admin-booking";
import { getAgendaDays, isSlotInAgenda } from "@/lib/diagnostico/agenda-window";
import { getLeadAdmin, updateLeadBookingAdmin } from "@/lib/firestore/leads-admin";

export const dynamic = "force-dynamic";

const leadIdSchema = z.string().regex(/^[A-Za-z0-9]{1,64}$/);

const bodySchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("reschedule"),
    leadId: leadIdSchema,
    slotStart: z.string().datetime({ offset: true }),
  }),
  z.object({
    action: z.literal("cancel"),
    leadId: leadIdSchema,
    reason: z.string().trim().min(3).max(300),
  }),
]);

function logError(context: string, error: unknown) {
  console.error(context, error instanceof Error ? error.message : error);
}

/**
 * Reprograma o cancela la cita de un lead desde el admin. Cal.com y el lead quedan al día aquí
 * mismo; el webhook que llega después lo detecta como ya aplicado y no lo duplica.
 */
export async function POST(request: Request) {
  const check = await verifyAdminRequest(request);
  if (!check.ok) return check.response;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const body = parsed.data;

  const lead = await getLeadAdmin(body.leadId).catch((error) => {
    logError("Error reading lead for admin booking:", error);
    return null;
  });

  if (!lead) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (!lead.booking || lead.status === "cancelada") {
    return NextResponse.json({ error: "no_active_booking" }, { status: 409 });
  }

  if (body.action === "cancel") {
    try {
      await cancelCalBooking(lead.booking.uid, body.reason);
    } catch (error) {
      logError("Error cancelling Cal.com booking from admin:", error);
      return NextResponse.json({ error: "calcom_error" }, { status: 502 });
    }

    try {
      await updateLeadBookingAdmin(lead.id, {
        status: "cancelada",
        source: "admin",
        email: check.email,
        note: body.reason,
      });
    } catch (error) {
      // Ya se canceló en Cal.com: el webhook BOOKING_CANCELLED actualizará el lead.
      logError("Error saving admin cancellation on lead:", error);
    }

    return NextResponse.json({ ok: true });
  }

  // Reprogramar: el horario tiene que estar libre y dentro de la ventana del admin.
  const slotStart = new Date(body.slotStart).toISOString();

  try {
    const days = await getAgendaDays({
      dayCount: ADMIN_RESCHEDULE_DAYS,
      eventTypeId: getCalAdminSlotsEventTypeId(),
    });
    if (!isSlotInAgenda(days, slotStart)) {
      return NextResponse.json({ error: "slot_unavailable" }, { status: 409 });
    }
  } catch (error) {
    logError("Error revalidating admin reschedule slot:", error);
    return NextResponse.json({ error: "slots_unavailable" }, { status: 503 });
  }

  let booking;
  try {
    booking = await rescheduleCalBooking(lead.booking.uid, slotStart, ADMIN_RESCHEDULE_NOTE);
  } catch (error) {
    if (error instanceof CalcomError && error.code === "slot_unavailable") {
      return NextResponse.json({ error: "slot_unavailable" }, { status: 409 });
    }
    logError("Error rescheduling Cal.com booking from admin:", error);
    return NextResponse.json({ error: "calcom_error" }, { status: 502 });
  }

  try {
    await updateLeadBookingAdmin(lead.id, {
      status: "confirmada",
      booking: {
        uid: booking.uid,
        startTime: new Date(booking.start),
        endTime: new Date(booking.end),
        meetingUrl: booking.meetingUrl ?? lead.booking.meetingUrl ?? null,
      },
      source: "admin",
      email: check.email,
      note: ADMIN_RESCHEDULE_NOTE,
    });
  } catch (error) {
    logError("Error saving admin reschedule on lead:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, booking });
}
