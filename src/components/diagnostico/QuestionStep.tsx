"use client";

import { forwardRef, useRef, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  OTHER_TEXT_MAX,
  getSelectedTextOption,
  type DiagnosticoQuestion,
} from "@/lib/diagnostico/questions";

interface QuestionStepProps {
  question: DiagnosticoQuestion;
  index: number;
  total: number;
  selected: string[];
  onToggle: (optionId: string) => void;
  otherText: string;
  onOtherTextChange: (text: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

const QuestionStep = forwardRef<HTMLHeadingElement, QuestionStepProps>(function QuestionStep(
  { question, index, total, selected, onToggle, otherText, onOtherTextChange, onPrev, onNext },
  headingRef
) {
  const otherInputRef = useRef<HTMLInputElement>(null);
  // El error de "Otro" vacío solo aparece después de intentar avanzar.
  const [showOtherError, setShowOtherError] = useState(false);
  const textOption = getSelectedTextOption(question, selected);
  const otherInputId = `otro-${question.id}`;
  const otherErrorId = `otro-${question.id}-error`;
  const otherMissing = textOption !== undefined && otherText.trim().length === 0;

  const handleNext = () => {
    if (otherMissing) {
      setShowOtherError(true);
      otherInputRef.current?.focus();
      return;
    }
    setShowOtherError(false);
    onNext();
  };

  const number = index + 1;
  const progress = `${Math.round((number / total) * 100)}%`;
  const headingId = `pregunta-${question.id}`;
  const hasSelection = selected.length > 0;

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between text-[13px] font-semibold text-muted-foreground">
          <span>
            Pregunta {number} de {total}
          </span>
          <span>{progress}</span>
        </div>
        <div
          role="progressbar"
          aria-label="Avance de las preguntas"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={number}
          className="h-1.5 rounded-full bg-border"
        >
          <div
            className="h-1.5 rounded-full bg-primary transition-[width] duration-300"
            style={{ width: progress }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className="text-[clamp(19px,2.6vw,23px)] font-bold leading-[1.35] text-primary focus:outline-none"
        >
          {question.text}
        </h3>
        {question.multiple && (
          <span className="text-sm text-muted-foreground">Puedes elegir varias opciones</span>
        )}
      </div>

      <div role="group" aria-labelledby={headingId} className="flex flex-col gap-2.5">
        {question.options.map((option) => {
          const isSelected = selected.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(option.id)}
              className={cn(
                "flex min-h-14 w-full items-center gap-3.5 rounded-[14px] border-[1.5px] px-[18px] py-3.5 text-left text-base font-medium leading-snug text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected ? "border-primary bg-secondary" : "border-border bg-white hover:bg-muted"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-[22px] w-[22px] shrink-0 items-center justify-center border-2 border-primary text-white",
                  question.multiple ? "rounded-md" : "rounded-full",
                  isSelected ? "bg-primary" : "bg-white"
                )}
              >
                {isSelected && <Check strokeWidth={3.5} className="h-3 w-3" />}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {textOption && (
        <div className="-mt-1 flex flex-col gap-1.5">
          <label htmlFor={otherInputId} className="text-sm font-semibold">
            Escribe cuál *
          </label>
          <input
            ref={otherInputRef}
            id={otherInputId}
            type="text"
            value={otherText}
            onChange={(event) => {
              onOtherTextChange(event.target.value);
              if (event.target.value.trim()) setShowOtherError(false);
            }}
            maxLength={OTHER_TEXT_MAX}
            required
            autoComplete="off"
            aria-invalid={showOtherError && otherMissing}
            aria-describedby={showOtherError && otherMissing ? otherErrorId : undefined}
            className={cn(
              "min-h-[52px] w-full rounded-xl border-[1.5px] bg-white px-4 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              showOtherError && otherMissing ? "border-destructive" : "border-input"
            )}
          />
          <div className="flex justify-between gap-3 text-[13px]">
            <span id={otherErrorId} role="alert" className="font-medium text-destructive">
              {showOtherError && otherMissing ? "Escribe cuál para continuar." : ""}
            </span>
            <span aria-hidden="true" className="shrink-0 text-muted-foreground">
              {otherText.length}/{OTHER_TEXT_MAX}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        {index > 0 ? (
          <button
            type="button"
            onClick={onPrev}
            className="min-h-[52px] rounded-full border-[1.5px] border-border bg-white px-[22px] text-base font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Anterior
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!hasSelection}
          className="min-h-[52px] rounded-full bg-primary px-8 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-border disabled:text-muted-foreground"
        >
          {number === total ? "Ver horarios" : "Siguiente"}
        </button>
      </div>
    </>
  );
});

export default QuestionStep;
