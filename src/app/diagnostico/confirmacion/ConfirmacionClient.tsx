"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ConfirmScreen from "@/components/diagnostico/ConfirmScreen";
import { formatWhatsappNumber } from "@/lib/diagnostico/schema";
import { useDiagnostico } from "../DiagnosticoProvider";

export default function ConfirmacionClient() {
  const router = useRouter();
  const {
    hydrated,
    lead,
    selectedSlot,
    timeZone,
    datosValues,
    storedConfirmation,
    setAgendaStage,
    clearProgress,
  } = useDiagnostico();

  // En memoria (recién creado) o desde sessionStorage (la pestaña se recargó).
  const confirmation =
    lead && selectedSlot
      ? { ...lead, slot: selectedSlot, timeZone, inMemory: true }
      : storedConfirmation
        ? { ...storedConfirmation, inMemory: false }
        : null;

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
      timeZone={confirmation.timeZone}
      confirmationCode={confirmation.confirmationCode}
      phoneLabel={
        confirmation.inMemory
          ? formatWhatsappNumber(datosValues.whatsappCountryCode, datosValues.whatsappNumber)
          : null
      }
      onFixPhone={() => {
        setAgendaStage("datos");
        router.push("/diagnostico/agenda/");
      }}
    />
  );
}
