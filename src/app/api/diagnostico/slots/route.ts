import { NextResponse } from "next/server";
import { getAgendaDays } from "@/lib/diagnostico/agenda-window";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const days = await getAgendaDays();
    return NextResponse.json({ days }, { headers: NO_STORE });
  } catch (error) {
    console.error("Error loading diagnostico slots:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "slots_unavailable" }, { status: 503, headers: NO_STORE });
  }
}
