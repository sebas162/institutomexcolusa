"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DiagnosticoHero from "@/components/diagnostico/DiagnosticoHero";
import Testimonials from "@/components/diagnostico/Testimonials";
import QuestionStep from "@/components/diagnostico/QuestionStep";
import StepCard from "@/components/diagnostico/StepCard";
import { DIAGNOSTICO_CONTENT } from "@/lib/diagnostico/content";
import { DIAGNOSTICO_QUESTIONS, isExitAnswer } from "@/lib/diagnostico/questions";
import { useDiagnostico } from "./DiagnosticoProvider";

export default function DiagnosticoClient() {
  const router = useRouter();
  const {
    hydrated,
    answers,
    questionIndex,
    setQuestionIndex,
    toggleOption,
    setAgendaStage,
  } = useDiagnostico();

  // Se incrementa en cada navegación entre preguntas para mover foco y scroll.
  const [navigationCount, setNavigationCount] = useState(0);
  const cardSectionRef = useRef<HTMLElement>(null);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const didRestoreScroll = useRef(false);

  // Al volver de la agenda (Anterior, atrás del navegador o recarga) se va directo a la
  // tarjeta de preguntas, sin obligar a pasar otra vez por el video.
  useEffect(() => {
    if (!hydrated || didRestoreScroll.current) return;
    didRestoreScroll.current = true;

    const hasProgress = Object.keys(answers).length > 0;
    if (!hasProgress) return;

    cardSectionRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
    questionHeadingRef.current?.focus({ preventScroll: true });
  }, [hydrated, answers]);

  useEffect(() => {
    if (navigationCount === 0) return;

    const section = cardSectionRef.current;
    if (section) {
      const { top } = section.getBoundingClientRect();
      if (top < 0 || top > window.innerHeight * 0.4) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    }

    questionHeadingRef.current?.focus({ preventScroll: true });
  }, [navigationCount]);

  const question = DIAGNOSTICO_QUESTIONS[questionIndex];
  const selected = answers[question.id] ?? [];

  const goToQuestion = (index: number) => {
    setQuestionIndex(index);
    setNavigationCount((count) => count + 1);
  };

  const handleNext = () => {
    if (selected.length === 0) return;

    if (isExitAnswer(question.id, selected)) {
      router.push("/diagnostico/gracias/");
      return;
    }

    if (questionIndex < DIAGNOSTICO_QUESTIONS.length - 1) {
      goToQuestion(questionIndex + 1);
    } else {
      setAgendaStage("agenda");
      router.push("/diagnostico/agenda/");
    }
  };

  return (
    <>
      <DiagnosticoHero />
      <Testimonials
        {...DIAGNOSTICO_CONTENT.testimonialsSection}
        testimonials={DIAGNOSTICO_CONTENT.testimonials}
      />

      <StepCard
        id="calificar"
        ref={cardSectionRef}
        label="Paso 2 de 3 — Responde 7 preguntas"
        title="¿Tu clínica califica?"
        subtitle="Antes de abrir la agenda necesitamos saber si de verdad podemos ayudarte. Toma un minuto."
      >
        <QuestionStep
          ref={questionHeadingRef}
          question={question}
          index={questionIndex}
          total={DIAGNOSTICO_QUESTIONS.length}
          selected={selected}
          onToggle={(optionId) => toggleOption(question.id, optionId)}
          onPrev={() => goToQuestion(Math.max(questionIndex - 1, 0))}
          onNext={handleNext}
        />
      </StepCard>
    </>
  );
}
