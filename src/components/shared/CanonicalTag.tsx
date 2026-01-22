"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Mapeo de rutas en inglés a URLs canónicas en español
const canonicalMap: Record<string, string> = {
  "/": "https://institutomexcolusa.com/",
  "/contact": "https://institutomexcolusa.com/contact",
  "/online-training": "https://institutomexcolusa.com/formacion-en-linea",
  "/academic-programs": "https://institutomexcolusa.com/programas-academicos",
  "/congress": "https://institutomexcolusa.com/congreso",
};

export default function CanonicalTag() {
  const pathname = usePathname();

  useEffect(() => {
    // Eliminar canonical existente si hay
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Obtener canonical del mapeo o usar pathname por defecto
    const canonicalUrl =
      canonicalMap[pathname] || `https://institutomexcolusa.com${pathname}`;

    // Crear y agregar nuevo canonical
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = canonicalUrl;
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [pathname]);

  return null;
}
