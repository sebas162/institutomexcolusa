import type { User } from "firebase/auth";

/** Llama a una ruta del admin con el ID token de la sesión (la ruta verifica que sea el admin). */
export async function adminFetch(user: User | null, path: string, init: RequestInit = {}): Promise<Response> {
  if (!user) throw new Error("Sin sesión");
  const token = await user.getIdToken();
  return fetch(path, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
