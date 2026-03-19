type MetaEventName = "ViewContent" | "Lead";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export function trackViewContent(contentName: string): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", { content_name: contentName });
  }
}

export function trackLead(contentName: string): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", { content_name: contentName });
  }
}
