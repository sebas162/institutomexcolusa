type MetaEventName = "ViewContent" | "Lead" | "Contact";

type MetaEventParams = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

function isMetaPixelAvailable() {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

export function trackEvent(eventName: MetaEventName, params?: MetaEventParams) {
  if (!isMetaPixelAvailable()) return;

  if (params && Object.keys(params).length > 0) {
    window.fbq?.("track", eventName, params);
    return;
  }

  window.fbq?.("track", eventName);
}

export function trackViewContent(contentName: string) {
  trackEvent("ViewContent", {
    content_name: contentName,
    content_category: "Curso Medicina Estética",
  });
}

export function trackLead(contentName: string) {
  trackEvent("Lead", {
    content_name: contentName,
  });
}

export function trackWhatsAppContact() {
  trackEvent("Contact", {
    contact_method: "whatsapp",
  });
}
