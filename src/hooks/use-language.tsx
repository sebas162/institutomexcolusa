"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "language";

// Países de habla hispana
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

// Función para obtener el país del visitante usando una API gratuita
const getUserCountry = async (): Promise<string | null> => {
  try {
    // Usamos ipapi.co que es gratuita y no requiere API key
    const response = await fetch("https://ipapi.co/json/", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch country");
    }

    const data = await response.json();
    return data.country_code || null;
  } catch (error) {
    console.error("Error detecting country:", error);
    return null;
  }
};

// Función para detectar el idioma basado en el país
const detectLanguageFromCountry = async (): Promise<Language> => {
  const countryCode = await getUserCountry();

  if (countryCode && SPANISH_SPEAKING_COUNTRIES.includes(countryCode)) {
    return "es";
  }

  // Por defecto, inglés
  return "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("es");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      let storedLang: Language | null = null;

      // Algunos navegadores pueden bloquear localStorage (modo privado, tracking protection, etc.)
      try {
        storedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      } catch (error) {
        console.error("Error reading language from storage:", error);
      }

      if (storedLang && ["en", "es"].includes(storedLang)) {
        setLanguageState(storedLang);
        setIsMounted(true);
        return;
      }

      // Si no hay idioma guardado, detectar automáticamente
      try {
        const detectedLang = await detectLanguageFromCountry();
        setLanguageState(detectedLang);

        // Guardar el idioma detectado para próximas visitas
        try {
          localStorage.setItem(STORAGE_KEY, detectedLang);
        } catch (error) {
          console.error("Error saving detected language to storage:", error);
        }
      } catch (error) {
        console.error("Error detecting language:", error);
        // En caso de error, usar español por defecto
        setLanguageState("es");
      } finally {
        setIsMounted(true);
      }
    };

    initializeLanguage();
  }, []);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.error("Error saving selected language to storage:", error);
    }
    setLanguageState(lang);
  };

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
