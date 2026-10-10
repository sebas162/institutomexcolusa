"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DiagnosticoHero from "@/components/diagnostico/DiagnosticoHero";
import Testimonials from "@/components/diagnostico/Testimonials";
import QuestionStep from "@/components/diagnostico/QuestionStep";
import AgendaStep from "@/components/diagnostico/AgendaStep";
import DatosStep from "@/components/diagnostico/DatosStep";
import ConfirmScreen from "@/components/diagnostico/ConfirmScreen";
import ExitScreen from "@/components/diagnostico/ExitScreen";
import LandingFooter from "@/components/diagnostico/LandingFooter";
import { trackMetaEvent } from "@/lib/analytics/meta-pixel";
import { DIAGNOSTICO_CONTENT } from "@/lib/diagnostico/content";
import { DIAGNOSTICO_QUESTIONS, isExitAnswer } from "@/lib/diagnostico/questions";
import {
  DEFAULT_DATOS_VALUES,
  formatWhatsappNumber,
  type DatosValues,
} from "@/lib/diagnostico/schema";
import {
  DEFAULT_TIME_ZONE,
  detectVisitorTimeZone,
  toDayKey,
  type Slot,
} from "@/lib/diagnostico/slots";
import type { LeadUtm } from "@/types/lead";

type Screen = "main" | "confirm" | "exit";
type Stage = "q" | "agenda" | "datos";

const STAGE_HEADINGS: Record<Stage, { label: string; title: string; subtitle: string }> = {
  q: {
    label: "Paso 2 de 3 — Responde 7 preguntas",
    title: "¿Tu clínica califica?",
    subtitle:
      "Antes de abrir la agenda necesitamos saber si de verdad podemos ayudarte. Toma un minuto.",
  },
  agenda: {
    label: "Paso 3 de 3 — Elige tu horario",
    title: "Tu clínica califica",
    subtitle: "Elige el día y la hora de tu llamada diagnóstico de 15 minutos.",
  },
  datos: {
    label: "Paso 3 de 3 — Tus datos",
    title: "Último paso",
    subtitle: "Te enviaremos la confirmación por WhatsApp. Verifica que tu número sea correcto.",
  },
};

const UTM_PARAMS: Record<string, keyof LeadUtm> = {
  utm_source: "source",
  utm_medium: "medium",
  utm_campaign: "campaign",
  utm_content: "content",
  utm_term: "term",
  fbclid: "fbclid",
};

function readUtmFromUrl(): LeadUtm {
  const params = new URLSearchParams(window.location.search);
  const utm: LeadUtm = {};

  for (const [param, key] of Object.entries(UTM_PARAMS)) {
    const value = params.get(param)?.trim();
    if (value) utm[key] = value.slice(0, 200);
  }

  return utm;
}

export default function DiagnosticoClient() {
  const [screen, setScreen] = useState<Screen>("main");
  const [stage, setStage] = useState<Stage>("q");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  // Zona en la que se muestran los horarios. TODO Fase 3: enviarla a Cal.com al reservar.
  const [timeZone, setTimeZone] = useState(DEFAULT_TIME_ZONE);
  const [datosValues, setDatosValues] = useState<DatosValues>(DEFAULT_DATOS_VALUES);
  const [lead, setLead] = useState<{ leadId: string; confirmationCode: string } | null>(null);
  const [utm, setUtm] = useState<LeadUtm>({});

  // Se incrementa en cada navegación dentro de la tarjeta para mover foco y scroll.
  const [navigationCount, setNavigationCount] = useState(0);
  const cardSectionRef = useRef<HTMLElement>(null);
  const sectionHeadingRef = useRef<HTMLHeadingElement>(null);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setUtm(readUtmFromUrl());
    setTimeZone(detectVisitorTimeZone());
  }, []);

  useEffect(() => {
    if (screen !== "main") {
      window.scrollTo({ top: 0 });
    }
  }, [screen]);

  useEffect(() => {
    if (navigationCount === 0 || screen !== "main") return;

    const section = cardSectionRef.current;
    if (section) {
      const { top } = section.getBoundingClientRect();
      if (top < 0 || top > window.innerHeight * 0.4) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    }

    const target = stage === "q" ? questionHeadingRef.current : sectionHeadingRef.current;
    target?.focus({ preventScroll: true });
  }, [navigationCount, stage, questionIndex, screen]);

  const goTo = (nextStage: Stage, nextQuestionIndex = questionIndex) => {
    setScreen("main");
    setStage(nextStage);
    setQuestionIndex(nextQuestionIndex);
    setNavigationCount((count) => count + 1);
  };

  const question = DIAGNOSTICO_QUESTIONS[questionIndex];
  const selected = answers[question.id] ?? [];

  const toggleOption = (optionId: string) => {
    setAnswers((current) => {
      const previous = current[question.id] ?? [];
      const next = question.multiple
        ? previous.includes(optionId)
          ? previous.filter((id) => id !== optionId)
          : [...previous, optionId]
        : [optionId];
      return { ...current, [question.id]: next };
    });
  };

  const handleNextQuestion = () => {
    if (selected.length === 0) return;

    if (isExitAnswer(question.id, selected)) {
      setScreen("exit");
      return;
    }

    if (questionIndex < DIAGNOSTICO_QUESTIONS.length - 1) {
      goTo("q", questionIndex + 1);
    } else {
      goTo("agenda");
    }
  };

  const handleSelectDay = (dayKey: string) => {
    setSelectedDayKey(dayKey);
    setSelectedSlot(null);
  };

  // El horario elegido es un instante fijo: al cambiar de zona puede caer en otro día del calendario.
  const handleTimeZoneChange = (nextTimeZone: string) => {
    setTimeZone(nextTimeZone);
    if (selectedSlot) {
      setSelectedDayKey(toDayKey(new Date(selectedSlot.start), nextTimeZone));
    }
  };

  const handleLeadCreated =(result: { leadId: string; confirmationCode: string }) => {
    setLead(result);
    trackMetaEvent("Lead", { content_name: "Llamada diagnóstico" }, result.leadId);
    setScreen("confirm");
  };

  const handleDatosChange = useCallback((values: DatosValues) => setDatosValues(values), []);

  const heading = STAGE_HEADINGS[stage];

  return (
    <div className="flex min-h-screen flex-col bg-muted text-foreground">
      {screen === "main" && (
        <>
          <DiagnosticoHero />
          <Testimonials
            {...DIAGNOSTICO_CONTENT.testimonialsSection}
            testimonials={DIAGNOSTICO_CONTENT.testimonials}
          />

          <section
            id="calificar"
            ref={cardSectionRef}
            aria-labelledby="calificar-titulo"
            className="flex scroll-mt-4 flex-col items-center gap-7 px-4 pb-20 pt-16"
          >
            <div className="flex w-full max-w-[720px] flex-col items-center gap-3 text-center">
              <span className="rounded-lg bg-primary px-3.5 py-[7px] text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground">
                {heading.label}
              </span>
              <h2
                id="calificar-titulo"
                ref={sectionHeadingRef}
                tabIndex={-1}
                className="text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-primary focus:outline-none"
              >
                {heading.title}
              </h2>
              <p className="text-[17px] leading-relaxed text-muted-foreground">{heading.subtitle}</p>
            </div>

            <div className="flex w-full max-w-[720px] flex-col gap-6 rounded-3xl border border-border bg-white p-[clamp(20px,4vw,40px)] shadow-[0_20px_48px_rgba(40,95,101,0.08)]">
              {stage === "q" && (
                <QuestionStep
                  ref={questionHeadingRef}
                  question={question}
                  index={questionIndex}
                  total={DIAGNOSTICO_QUESTIONS.length}
                  selected={selected}
                  onToggle={toggleOption}
                  onPrev={() => goTo("q", Math.max(questionIndex - 1, 0))}
                  onNext={handleNextQuestion}
                />
              )}

              {stage === "agenda" && (
                <AgendaStep
                  timeZone={timeZone}
                  selectedDayKey={selectedDayKey}
                  selectedSlot={selectedSlot}
                  onTimeZoneChange={handleTimeZoneChange}
                  onSelectDay={handleSelectDay}
                  onSelectSlot={setSelectedSlot}
                  onBack={() => goTo("q", DIAGNOSTICO_QUESTIONS.length - 1)}
                  onContinue={() => selectedSlot && goTo("datos")}
                />
              )}

              {stage === "datos" && selectedSlot && (
                <DatosStep
                  slot={selectedSlot}
                  timeZone={timeZone}
                  defaultValues={datosValues}
                  answers={answers}
                  utm={utm}
                  onValuesChange={handleDatosChange}
                  onChangeSlot={() => goTo("agenda")}
                  onSuccess={handleLeadCreated}
                  onNotQualified={() => setScreen("exit")}
                />
              )}
            </div>
          </section>
        </>
      )}

      {screen === "confirm" && lead && selectedSlot && (
        <ConfirmScreen
          slot={selectedSlot}
          timeZone={timeZone}
          phoneLabel={formatWhatsappNumber(
            datosValues.whatsappCountryCode,
            datosValues.whatsappNumber
          )}
          confirmationCode={lead.confirmationCode}
          onFixPhone={() => goTo("datos")}
        />
      )}

      {screen === "exit" && <ExitScreen />}

      <LandingFooter />
    </div>
  );
}
