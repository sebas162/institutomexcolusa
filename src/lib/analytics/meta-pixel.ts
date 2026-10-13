type FbqFunction = (...args: unknown[]) => void;

// No se declara window.fbq globalmente: ya lo declara
// src/app/academic-programs/mexico/[slug]/ClientPage.tsx y chocarían los tipos.
function getFbq(): FbqFunction | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const fbq = (window as unknown as { fbq?: unknown }).fbq;
  return typeof fbq === "function" ? (fbq as FbqFunction) : undefined;
}

export function trackMetaEvent(
  name: string,
  params?: Record<string, unknown>,
  eventId?: string
): void {
  const fbq = getFbq();

  if (!fbq) {
    return;
  }

  try {
    if (eventId) {
      fbq("track", name, params ?? {}, { eventID: eventId });
    } else {
      fbq("track", name, params ?? {});
    }
  } catch (error) {
    console.error("Error tracking Meta Pixel event:", error);
  }
}
