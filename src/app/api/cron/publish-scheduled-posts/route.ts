import { NextResponse } from "next/server";
import { publishDueScheduledPosts } from "@/lib/firestore/posts-admin";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await publishDueScheduledPosts();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in publish-scheduled-posts cron route:", error);
    return NextResponse.json(
      { error: "Failed to publish scheduled posts." },
      { status: 500 }
    );
  }
}
