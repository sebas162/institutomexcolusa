"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import AgendaStep from "@/components/diagnostico/AgendaStep";
import DatosStep from "@/components/diagnostico/DatosStep";
import LandingLogo from "@/components/diagnostico/LandingLogo";
import StepCard from "@/components/diagnostico/StepCard";
import { DIAGNOSTICO_CONTENT } from "@/lib/diagnostico/content";
import type { StepHeading } from "@/lib/diagnostico/market/types";
import { DIAGNOSTICO_QUESTIONS } from "@/lib/diagnostico/questions";
import { isQualified, useDiagnostico, type AgendaStage } from "../DiagnosticoProvider";

const STAGE_HEADINGS: Record<AgendaStage, StepHeading> = {
  agenda: DIAGNOSTICO_CONTENT.steps.agenda,
  datos: DIAGNOSTICO_CONTENT.steps.datos,
};

export default function AgendaClient() {
  const router = useRouter();
  const {
    hydrated,
    answers,
    otherTexts,
    setQuestionIndex,
    timeZone,
    selectedDayKey,
    selectDay,
    selectedSlot,
    setSelectedSlot,
    agendaStage,
    setAgendaStage,
    datosValues,
    setDatosValues,
    utm,
    pendingLead,
    markSlotTaken,
    savePendingLead,
    slotTakenNotice,
    hasBooking,
    completeLead,
  } = useDiagnostico();

  // Con una reserva ya creada no se vuelve a la agenda ni al formulario: así no puede
  // reservar dos veces ni cambiar sus datos después de agendar.
  const qualified = hydrated && !hasBooking && isQualified(answers, otherTexts);
  const stage: AgendaStage = agendaStage === "datos" && selectedSlot ? "datos" : "agenda";

  const cardSectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStage = useRef<AgendaStage | null>(null);

  // Sin las 7 respuestas válidas (o con una de salida) no hay agenda.
  useEffect(() => {
    if (!hydrated) return;

    if (hasBooking) {
      router.replace("/diagnostico/confirmacion/");
    } else if (!isQualified(answers, otherTexts)) {
      router.replace("/diagnostico/");
    }
  }, [hydrated, hasBooking, answers, otherTexts, router]);

  useEffect(() => {
    if (!qualified) return;

    // Al llegar a la página, solo el foco: Next ya empieza arriba.
    if (previousStage.current !== null && previousStage.current !== stage) {
      const section = cardSectionRef.current;
      if (section && section.getBoundingClientRect().top < 0) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    }
    previousStage.current = stage;
    headingRef.current?.focus({ preventScroll: true });
  }, [qualified, stage]);

  if (!qualified) {
    return (
      <div className="flex flex-grow items-center justify-center py-32">
        <Loader2 aria-hidden="true" className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Cargando…</span>
      </div>
    );
  }

  const heading = STAGE_HEADINGS[stage];

  return (
    <>
      <header className="flex justify-center border-b border-border bg-white px-4 py-5">
        <LandingLogo size="md" tone="green" />
      </header>

      <StepCard
        ref={cardSectionRef}
        headingRef={headingRef}
        label={heading.label}
        title={heading.title}
        subtitle={heading.subtitle}
      >
        {stage === "agenda" && (
          <AgendaStep
            timeZone={timeZone}
            selectedDayKey={selectedDayKey}
            selectedSlot={selectedSlot}
            notice={slotTakenNotice ? DIAGNOSTICO_CONTENT.agenda.slotTaken : null}
            onSelectDay={selectDay}
            onSelectSlot={setSelectedSlot}
            onBack={() => {
              setQuestionIndex(DIAGNOSTICO_QUESTIONS.length - 1);
              router.push("/diagnostico/");
            }}
            onContinue={() => selectedSlot && setAgendaStage("datos")}
          />
        )}

        {stage === "datos" && selectedSlot && (
          <DatosStep
            slot={selectedSlot}
            timeZone={timeZone}
            defaultValues={datosValues}
            answers={answers}
            otherTexts={otherTexts}
            utm={utm}
            pendingLead={pendingLead}
            onValuesChange={setDatosValues}
            onChangeSlot={() => setAgendaStage("agenda")}
            onSuccess={(result) => {
              completeLead(result);
              // replace: el "atrás" del navegador no regresa a la agenda ni al formulario.
              router.replace("/diagnostico/confirmacion/");
            }}
            onSlotUnavailable={markSlotTaken}
            onPendingLead={savePendingLead}
            onNotQualified={() => router.push("/diagnostico/gracias/")}
          />
        )}
      </StepCard>
    </>
  );
}
