import { NextResponse } from "next/server";
import { syncHolidaysToCalcom } from "@/lib/diagnostico/calcom-holidays";

export const dynamic = "force-dynamic";

// Lo llama cada mes el workflow de GitHub Actions sync-calcom-holidays.yml (mismo patrón que
// publish-scheduled-posts): Authorization: Bearer CRON_SECRET.
export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncHolidaysToCalcom();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in calcom-holidays cron route:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to sync holidays." }, { status: 500 });
  }
}
