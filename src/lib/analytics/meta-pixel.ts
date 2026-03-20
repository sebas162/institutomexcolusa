type MetaEventName = "ViewContent" | "Lead";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

// Eliminado: funciones Meta Pixel
