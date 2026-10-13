import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { syncLeadsWithCalcom } from "@/lib/diagnostico/calcom-sync";

export const dynamic = "force-dynamic";
// Con muchas citas la sincronización espera entre llamadas a Cal.com (límite de 120/min).
export const maxDuration = 60;

/** Compara las citas desde ayer en adelante con Cal.com y corrige las diferencias. */
export async function POST(request: Request) {
  const check = await verifyAdminRequest(request);
  if (!check.ok) return check.response;

  try {
    const result = await syncLeadsWithCalcom();
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Error syncing with Cal.com:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "sync_failed" }, { status: 503 });
  }
}
