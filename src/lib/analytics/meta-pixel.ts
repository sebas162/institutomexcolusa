type MetaEventName = "ViewContent" | "Lead" | "Contact";

type MetaEventParams = Record<
  string,
  string | number | boolean | null | undefined
>;

type MetaCountry = "usa" | "mexico" | "colombia";
type WhatsAppLocation = "floating_button" | "course_detail" | "online_training";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

function isMetaPixelAvailable() {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

function cleanPayload(params: MetaEventParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );
}

function trackEvent(eventName: MetaEventName, params: MetaEventParams) {
  if (typeof window === "undefined") return;

  if (!window.fbq) {
    console.warn(`[META] ${eventName} skipped: fbq unavailable`, params);
    return;
  }

  const payload = cleanPayload(params);
  console.log(`[META] ${eventName}`, payload);
  window.fbq("track", eventName, payload);
}

export function trackViewContent(
  contentName: string,
  country: MetaCountry,
  slug: string,
) {
  trackEvent("ViewContent", {
    content_name: contentName,
    content_category: "Curso Medicina Estética",
    country,
    slug,
  });
}

export function trackLead(
  contentName: string,
  country: MetaCountry,
  slug: string,
) {
  trackEvent("Lead", {
    content_name: contentName,
    content_category: "Curso Medicina Estética",
    country,
    slug,
  });
}

export function trackWhatsAppContact(
  location: WhatsAppLocation,
  contentName?: string,
  country?: MetaCountry,
) {
  trackEvent("Contact", {
    contact_method: "whatsapp",
    location,
    course_name: contentName,
    country,
  });
}
