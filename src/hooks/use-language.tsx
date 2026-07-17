"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Language = "en" | "es";
type LanguageOrigin = "user" | "auto";

interface LanguageMeta {
  origin: LanguageOrigin;
  detectedAt?: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Key for the language value — unchanged for backward compatibility
const STORAGE_KEY = "language";
// Key for origin metadata (new in this version)
const STORAGE_KEY_META = "language_meta";

// Spanish-speaking countries used as fallback for IP-based detection (Priority 3)
const SPANISH_SPEAKING_COUNTRIES = [
  "ES", // España
  "MX", // México
  "AR", // Argentina
  "CO", // Colombia
  "CL", // Chile
  "PE", // Perú
  "VE", // Venezuela
  "EC", // Ecuador
  "GT", // Guatemala
  "CU", // Cuba
  "BO", // Bolivia
  "DO", // República Dominicana
  "HN", // Honduras
  "PY", // Paraguay
  "SV", // El Salvador
  "NI", // Nicaragua
  "CR", // Costa Rica
  "PA", // Panamá
  "UY", // Uruguay
  "PR", // Puerto Rico
];

/**
 * Read stored language and metadata from localStorage.
 * Returns null values if storage is blocked or data is missing/malformed.
 */
const readFromStorage = (): { lang: Language | null; meta: LanguageMeta | null } => {
  try {
    const lang = localStorage.getItem(STORAGE_KEY) as Language | null;
    const metaRaw = localStorage.getItem(STORAGE_KEY_META);
    const meta: LanguageMeta | null = metaRaw ? JSON.parse(metaRaw) : null;
    return {
      lang: lang && ["en", "es"].includes(lang) ? lang : null,
      meta,
    };
  } catch {
    return { lang: null, meta: null };
  }
};

/**
 * Persist language and origin metadata to localStorage.
 */
const saveToStorage = (lang: Language, meta: LanguageMeta) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
    localStorage.setItem(STORAGE_KEY_META, JSON.stringify(meta));
  } catch (error) {
    console.error("Error saving language to storage:", error);
  }
};

/**
 * PRIORITY 2 — Browser language (navigator.language / navigator.languages).
 *
 * Maps any "es-*" variant (es-CO, es-MX, es-419, etc.) → "es"
 * and any "en-*" variant → "en". Returns null for unrecognized languages.
 *
 * This is synchronous and instant — no network call required.
 * Reflects the user's OS/browser language preference, not their physical location.
 */
const detectLanguageFromBrowser = (): Language | null => {
  if (typeof navigator === "undefined") return null;

  const browserLangs =
    navigator.languages?.length > 0
      ? Array.from(navigator.languages)
      : navigator.language
        ? [navigator.language]
        : [];

  for (const lang of browserLangs) {
    const prefix = lang.toLowerCase().split("-")[0];
    if (prefix === "es") return "es";
    if (prefix === "en") return "en";
  }

  return null; // Unrecognized — fall through to IP detection
};

/**
 * PRIORITY 3 — IP geolocation via ipapi.co (free tier, no API key required).
 *
 * Used only when browser language is unavailable or unrecognized.
 * Limitation: reflects physical location, not the user's language preference.
 * Free tier: ~1,000 req/day per IP.
 */
const getUserCountry = async (): Promise<string | null> => {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch country");
    const data = await response.json();
    return data.country_code || null;
  } catch (error) {
    console.error("Error detecting country via IP:", error);
    return null;
  }
};

const detectLanguageFromIP = async (): Promise<Language> => {
  const countryCode = await getUserCountry();
  return countryCode && SPANISH_SPEAKING_COUNTRIES.includes(countryCode)
    ? "es"
    : "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("es");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    /**
     * Language detection hierarchy:
     *
     * 1. USER CHOICE (permanent): if the user manually selected a language
     *    via the UI, respect it always — never re-evaluate.
     *
     * 2. BROWSER LANGUAGE (instant, no network): navigator.language /
     *    navigator.languages. Used for new visitors and for "auto"-detected
     *    sessions (including legacy values migrated from the old system).
     *
     * 3. IP GEOLOCATION (network, async): ipapi.co fallback — only when
     *    browser language is unavailable or unrecognized.
     *
     * 4. FALLBACK: default to "es".
     *
     * Migration note: values stored by the old system (language key present,
     * no language_meta key) are treated as "auto" — they are re-evaluated
     * against browser language without requiring the user to clear their cache.
     */
    const initializeLanguage = async () => {
      const { lang: storedLang, meta: storedMeta } = readFromStorage();

      // ── Priority 1: explicit user choice ──────────────────────────────────
      if (storedLang && storedMeta?.origin === "user") {
        setLanguageState(storedLang);
        setIsMounted(true);
        return;
      }

      // ── Priority 2: browser / OS language setting ─────────────────────────
      // Covers: new visitors, existing "auto" sessions, and migrated legacy values.
      const browserLang = detectLanguageFromBrowser();
      if (browserLang) {
        setLanguageState(browserLang);
        saveToStorage(browserLang, {
          origin: "auto",
          detectedAt: new Date().toISOString(),
        });
        setIsMounted(true);
        return;
      }

      // ── Priority 3 + 4: IP geolocation → fallback to "es" ────────────────
      try {
        const ipLang = await detectLanguageFromIP();
        setLanguageState(ipLang);
        saveToStorage(ipLang, {
          origin: "auto",
          detectedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error detecting language:", error);
        // Priority 4: default to Spanish
        setLanguageState("es");
        saveToStorage("es", {
          origin: "auto",
          detectedAt: new Date().toISOString(),
        });
      } finally {
        setIsMounted(true);
      }
    };

    initializeLanguage();
  }, []);

  /**
   * Called when the user explicitly switches language via the UI selector.
   * Saves as origin "user" — this choice is permanent and never re-evaluated.
   */
  const setLanguage = (lang: Language) => {
    saveToStorage(lang, { origin: "user" });
    setLanguageState(lang);
  };

  // Avoid hydration mismatch: render nothing until client-side init is complete
  if (!isMounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
