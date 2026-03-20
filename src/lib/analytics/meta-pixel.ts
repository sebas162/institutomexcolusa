type MetaEventName = "ViewContent" | "Lead";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

function waitForFbq(callback: () => void, retries = 10) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    callback();
  } else if (retries > 0) {
    setTimeout(() => waitForFbq(callback, retries - 1), 100);
  }
}

export function trackViewContent(contentName: string): void {
  waitForFbq(() => {
    window.fbq("track", "ViewContent", { content_name: contentName });
  });
}

export function trackLead(contentName: string): void {
  waitForFbq(() => {
    window.fbq("track", "Lead", { content_name: contentName });
  });
}
