// Solo servidor: verifica que una petición venga del admin con un ID token de Firebase.
// Usa la API REST de Identity Toolkit y no firebase-admin/auth: ese módulo carga "jose" (solo
// ES Module) con require() y el runtime de Vercel lo rechaza. Nunca se registra el token.

import { NextResponse } from "next/server";
import { ADMIN_UID } from "@/lib/admin";
import { firebaseConfig } from "@/lib/firebase-config";

const LOOKUP_URL = "https://identitytoolkit.googleapis.com/v1/accounts:lookup";
const LOOKUP_TIMEOUT_MS = 10_000;

export type AdminCheck =
  | { ok: true; uid: string; email: string | null }
  | { ok: false; response: NextResponse };

const deny = (status: 401 | 403 | 503, error: string): AdminCheck => ({
  ok: false,
  response: NextResponse.json({ error }, { status }),
});

/**
 * Lee "Authorization: Bearer <idToken>". Sin token, inválido o vencido: 401; de otro usuario o
 * deshabilitado: 403; si Google no responde: 503.
 */
export async function verifyAdminRequest(request: Request): Promise<AdminCheck> {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return deny(401, "unauthorized");

  let response: Response;
  try {
    // Google valida firma, vencimiento y proyecto del token, y devuelve el usuario.
    response = await fetch(`${LOOKUP_URL}?key=${firebaseConfig.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: match[1] }),
      cache: "no-store",
      signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("Admin token check failed:", error instanceof Error ? error.name : "unknown");
    return deny(503, "auth_unavailable");
  }

  if (response.status === 400) return deny(401, "unauthorized");
  if (!response.ok) {
    console.error("Admin token check failed: Identity Toolkit HTTP", response.status);
    return deny(503, "auth_unavailable");
  }

  const data = (await response.json().catch(() => null)) as {
    users?: { localId?: string; email?: string; disabled?: boolean }[];
  } | null;
  const user = data?.users?.[0];

  if (!user?.localId) return deny(401, "unauthorized");
  if (user.localId !== ADMIN_UID || user.disabled) return deny(403, "forbidden");

  return { ok: true, uid: user.localId, email: user.email ?? null };
}
