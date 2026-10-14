"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ConfirmScreen from "@/components/diagnostico/ConfirmScreen";
import { MARKET } from "@/lib/diagnostico/market";
import { useDiagnostico } from "../DiagnosticoProvider";

export default function ConfirmacionClient() {
  const router = useRouter();
  const { hydrated, storedConfirmation: confirmation, clearProgress } = useDiagnostico();

  // completeLead la guarda en memoria y en sessionStorage, así que sobrevive a una recarga.
  const hasConfirmation = confirmation !== null;

  useEffect(() => {
    if (!hydrated) return;

    if (!hasConfirmation) {
      router.replace("/diagnostico/");
      return;
    }

    clearProgress();
  }, [hydrated, hasConfirmation, router, clearProgress]);

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
      timeZone={MARKET.timeZone}
      leadId={confirmation.leadId}
      nombre={confirmation.nombre ?? ""}
    />
  );
}
