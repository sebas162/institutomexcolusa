import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getCalAdminSlotsEventTypeId } from "@/lib/calcom";
import { ADMIN_RESCHEDULE_DAYS } from "@/lib/diagnostico/admin-booking";
import { getAgendaDays } from "@/lib/diagnostico/agenda-window";

export const dynamic = "force-dynamic";
// Hasta dos intentos a Cal.com de 8 s cada uno.
export const maxDuration = 30;

const NO_STORE = { "Cache-Control": "no-store" };

/** Horarios libres para reprogramar desde el admin: más días que la landing, mismas reglas. */
export async function GET(request: Request) {
  const check = await verifyAdminRequest(request);
  if (!check.ok) return check.response;

  try {
    const days = await getAgendaDays(new Date(), ADMIN_RESCHEDULE_DAYS, getCalAdminSlotsEventTypeId());
    return NextResponse.json({ days }, { headers: NO_STORE });
  } catch (error) {
    console.error("Error loading admin slots:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "slots_unavailable" }, { status: 503, headers: NO_STORE });
  }
}
