"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ConfirmScreen from "@/components/diagnostico/ConfirmScreen";
import { useMarket } from "@/components/diagnostico/MarketContext";
import { useDiagnostico } from "./DiagnosticoProvider";

export default function ConfirmacionClient() {
  const router = useRouter();
  const { basePath, timeZone } = useMarket();
  const { hydrated, storedConfirmation: confirmation, clearProgress } = useDiagnostico();

  // completeLead la guarda en memoria y en sessionStorage, así que sobrevive a una recarga.
  const hasConfirmation = confirmation !== null;

  useEffect(() => {
    if (!hydrated) return;

    if (!hasConfirmation) {
      router.replace(`${basePath}/`);
      return;
    }

    clearProgress();
  }, [hydrated, hasConfirmation, router, clearProgress, basePath]);

  if (!hydrated || !confirmation) {
    return (
      <div className="flex flex-grow items-center justify-center py-32">
        <Loader2 aria-hidden="true" className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Cargando…</span>
      </div>
    );
  }

  return (
    <ConfirmScreen
      slot={confirmation.slot}
      timeZone={timeZone}
      leadId={confirmation.leadId}
      nombre={confirmation.nombre ?? ""}
    />
  );
}
