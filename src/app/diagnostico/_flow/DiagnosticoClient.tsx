"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import DiagnosticoHero from "@/components/diagnostico/DiagnosticoHero";
import Testimonials from "@/components/diagnostico/Testimonials";
import QuestionStep from "@/components/diagnostico/QuestionStep";
import StepCard from "@/components/diagnostico/StepCard";
import ServicesSection from "@/components/diagnostico/ServicesSection";
import { useMarket } from "@/components/diagnostico/MarketContext";
import { isExitAnswer } from "@/lib/diagnostico/questions";
import { useDiagnostico } from "./DiagnosticoProvider";

export default function DiagnosticoClient() {
  const router = useRouter();
  const market = useMarket();
  const { content, questions, basePath, showTestimonials } = market;
  const {
    hydrated,
    answers,
    questionIndex,
    setQuestionIndex,
    toggleOption,
    otherTexts,
    setOtherText,
    setAgendaStage,
    hasBooking,
  } = useDiagnostico();

  // Con una reserva en esta pestaña no se vuelve a contestar: el "atrás" regresa a la confirmación.
  const redirecting = hydrated && hasBooking;
  // Hasta leer sessionStorage no se sabe si hay reserva; el sitio no trae HTML del servidor,
  // así que esperar no retrasa nada visible.
  const showLoader = !hydrated || redirecting;

  useEffect(() => {
    if (redirecting) router.replace(`${basePath}/confirmacion/`);
  }, [redirecting, router, basePath]);

  // Se incrementa en cada navegación entre preguntas para mover foco y scroll.
  const [navigationCount, setNavigationCount] = useState(0);
  const cardSectionRef = useRef<HTMLElement>(null);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const didRestoreScroll = useRef(false);

  // Al volver de la agenda (Anterior, atrás del navegador o recarga) se va directo a la
  // tarjeta de preguntas, sin obligar a pasar otra vez por el video.
  useEffect(() => {
    if (!hydrated || hasBooking || didRestoreScroll.current) return;
    didRestoreScroll.current = true;

    const hasProgress = Object.keys(answers).length > 0;
    if (!hasProgress) return;

    cardSectionRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
    questionHeadingRef.current?.focus({ preventScroll: true });
  }, [hydrated, hasBooking, answers]);

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

  const question = questions[questionIndex];
  const selected = answers[question.id] ?? [];

  const goToQuestion = (index: number) => {
    setQuestionIndex(index);
    setNavigationCount((count) => count + 1);
  };

  const handleNext = () => {
    if (selected.length === 0) return;

    if (questionIndex < questions.length - 1) {
      goToQuestion(questionIndex + 1);
      return;
    }

    // El filtro de salida se evalúa al final, con las 7 respuestas.
    const hasExitAnswer = questions.some((q) =>
      isExitAnswer(questions, q.id, answers[q.id] ?? [])
    );

    if (hasExitAnswer) {
      router.push(`${basePath}/gracias/`);
    } else {
      setAgendaStage("agenda");
      router.push(`${basePath}/agenda/`);
    }
  };

  if (showLoader) {
    return (
      <div className="flex flex-grow items-center justify-center py-32">
        <Loader2 aria-hidden="true" className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Cargando…</span>
      </div>
    );
  }

  return (
    <>
      {/* Fondos alternados: blanco (hero) → gris (equipo) → blanco (testimonios) → gris (preguntas). */}
      <DiagnosticoHero />
      <ServicesSection />
      {showTestimonials && (
        <Testimonials
          {...content.testimonialsSection}
          testimonials={content.testimonials}
        />
      )}

      <StepCard
        id="calificar"
        ref={cardSectionRef}
        {...content.steps.questions}
        // Sin testimonios, el bloque del equipo (gris) quedaría pegado a este: va en blanco.
        className={showTestimonials ? undefined : "bg-white"}
      >
        <QuestionStep
          key={question.id}
          ref={questionHeadingRef}
          question={question}
          index={questionIndex}
          total={questions.length}
          selected={selected}
          onToggle={(optionId) => toggleOption(question.id, optionId)}
          otherText={otherTexts[question.id] ?? ""}
          onOtherTextChange={(text) => setOtherText(question.id, text)}
          onPrev={() => goToQuestion(Math.max(questionIndex - 1, 0))}
          onNext={handleNext}
        />
      </StepCard>
    </>
  );
}
