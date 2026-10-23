import { NextResponse } from "next/server";
import { getAgendaDays } from "@/lib/diagnostico/agenda-window";
import { getMarket } from "@/lib/diagnostico/market";

export const dynamic = "force-dynamic";
// Hasta dos intentos a Cal.com de 8 s cada uno.
export const maxDuration = 30;

const NO_STORE = { "Cache-Control": "no-store" };

// ?market=us: cada país cuenta sus propios festivos. Sin el parámetro, México.
export async function GET(request: Request) {
  const market = getMarket(new URL(request.url).searchParams.get("market") ?? undefined);
  if (!market) {
    return NextResponse.json({ error: "invalid_market" }, { status: 400, headers: NO_STORE });
  }

  try {
    const days = await getAgendaDays({ market });
    return NextResponse.json({ days }, { headers: NO_STORE });
  } catch (error) {
    console.error("Error loading diagnostico slots:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "slots_unavailable" }, { status: 503, headers: NO_STORE });
  }
}
