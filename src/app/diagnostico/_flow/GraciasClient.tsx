"use client";

import { useEffect } from "react";
import ExitScreen from "@/components/diagnostico/ExitScreen";
import { useDiagnostico } from "./DiagnosticoProvider";

export default function GraciasClient() {
  const { hydrated, resetAnswers } = useDiagnostico();

  // Borra las respuestas en memoria y en sessionStorage: el atrás del navegador
  // regresa a la pregunta 1 vacía, no a la 7 con todo lleno.
  useEffect(() => {
    if (hydrated) resetAnswers();
  }, [hydrated, resetAnswers]);

  return <ExitScreen />;
}
