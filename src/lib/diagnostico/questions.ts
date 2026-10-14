// Preguntas del país activo (se editan en market/<país>.ts) y reglas comunes.

import { MARKET } from "./market";
import type { DiagnosticoOption, DiagnosticoQuestion } from "./market/types";

export type { DiagnosticoOption, DiagnosticoQuestion } from "./market/types";
export { OTHER_TEXT_MAX } from "./market/shared";

export const DIAGNOSTICO_FORM_ID = "llamada-diagnostico";

export const DIAGNOSTICO_QUESTIONS: DiagnosticoQuestion[] = MARKET.questions;

export function getDiagnosticoQuestion(
  questionId: string
): DiagnosticoQuestion | undefined {
  return DIAGNOSTICO_QUESTIONS.find((question) => question.id === questionId);
}

export function isExitAnswer(questionId: string, optionIds: string[]): boolean {
  const question = getDiagnosticoQuestion(questionId);

  if (!question) {
    return false;
  }

  return question.options.some(
    (option) => option.exit === true && optionIds.includes(option.id)
  );
}

/** La opción de la pregunta que pide texto, si la persona la eligió. */
export function getSelectedTextOption(
  question: DiagnosticoQuestion,
  optionIds: string[]
): DiagnosticoOption | undefined {
  return question.options.find(
    (option) => option.requiresText === true && optionIds.includes(option.id)
  );
}

/** Cómo se guarda y se muestra en el admin y el CSV la opción "Otro". */
export function formatOtherLabel(text: string): string {
  return `Otro: ${text.trim()}`;
}

/** Solo los textos de "Otro" de preguntas donde la opción sigue marcada, ya recortados. */
export function buildOtherTexts(
  answers: Record<string, string[]>,
  otherTexts: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    DIAGNOSTICO_QUESTIONS.filter((question) =>
      getSelectedTextOption(question, answers[question.id] ?? [])
    ).map((question) => [question.id, (otherTexts[question.id] ?? "").trim()])
  );
}
