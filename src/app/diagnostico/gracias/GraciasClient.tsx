"use client";

import { useEffect } from "react";
import ExitScreen from "@/components/diagnostico/ExitScreen";
import { useDiagnostico } from "../DiagnosticoProvider";

export default function GraciasClient() {
  const { hydrated, clearProgress } = useDiagnostico();

  useEffect(() => {
    if (hydrated) clearProgress();
  }, [hydrated, clearProgress]);

  return <ExitScreen />;
}
