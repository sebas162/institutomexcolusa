// Solo servidor: verifica que una petición venga del admin con un ID token de Firebase.

import { NextResponse } from "next/server";
import { ADMIN_UID } from "@/lib/admin";
import { adminAuth } from "@/lib/firebase-admin";

export type AdminCheck =
  | { ok: true; uid: string; email: string | null }
  | { ok: false; response: NextResponse };

/** Lee "Authorization: Bearer <idToken>". Sin token o inválido: 401; de otro usuario: 403. */
export async function verifyAdminRequest(request: Request): Promise<AdminCheck> {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return { ok: false, response: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }

  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);

    if (decoded.uid !== ADMIN_UID) {
      return { ok: false, response: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
    }

    return { ok: true, uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    return { ok: false, response: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }
}
