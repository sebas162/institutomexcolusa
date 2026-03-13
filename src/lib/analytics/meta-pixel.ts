type MetaEventName = "ViewContent" | "Lead" | "Contact";

type MetaEventParams = Record<
  string,
  string | number | boolean | null | undefined
>;

const MAX_RETRIES = 20;
const RETRY_DELAY_MS = 250;

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

function isMetaPixelAvailable() {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

function sendEvent(eventName: MetaEventName, params?: MetaEventParams) {
  const cleanedParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined),
      )
    : undefined;

  if (cleanedParams && Object.keys(cleanedParams).length > 0) {
    window.fbq?.("track", eventName, cleanedParams);
    return;
  }

  window.fbq?.("track", eventName);
}

function dispatchWithRetry(
  eventName: MetaEventName,
  params?: MetaEventParams,
  attempt = 0,
) {
  if (isMetaPixelAvailable()) {
    sendEvent(eventName, params);
    return;
  }

  if (typeof window === "undefined" || attempt >= MAX_RETRIES) return;

  window.setTimeout(() => {
    dispatchWithRetry(eventName, params, attempt + 1);
  }, RETRY_DELAY_MS);
}

export function trackEvent(eventName: MetaEventName, params?: MetaEventParams) {
  dispatchWithRetry(eventName, params);
}

export function trackViewContent(contentName: string) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: contentName,
      content_category: "Curso Medicina Estética",
    });
    return;
  }

  trackEvent("ViewContent", {
    content_name: contentName,
    content_category: "Curso Medicina Estética",
  });
}

export function trackLead(contentName: string) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", {
      content_name: contentName,
    });
    return;
  }

  trackEvent("Lead", {
    content_name: contentName,
  });
}

export function trackWhatsAppContact() {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Contact", {
      contact_method: "whatsapp",
    });
    return;
  }

  trackEvent("Contact", {
    contact_method: "whatsapp",
  });
}
