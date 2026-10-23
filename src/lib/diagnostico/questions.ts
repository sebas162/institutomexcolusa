// Reglas comunes de las preguntas. Las preguntas de cada país se editan en market/<país>.ts.

import { LEGACY_QUESTIONS } from "./market/legacy";
import type { DiagnosticoOption, DiagnosticoQuestion } from "./market/types";

export type { DiagnosticoOption, DiagnosticoQuestion } from "./market/types";
export { OTHER_TEXT_MAX } from "./market/shared";
export { LEGACY_QUESTIONS } from "./market/legacy";

export const DIAGNOSTICO_FORM_ID = "llamada-diagnostico";

export function isExitAnswer(
  questions: DiagnosticoQuestion[],
  questionId: string,
  optionIds: string[]
): boolean {
  const question = questions.find((q) => q.id === questionId);

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
  questions: DiagnosticoQuestion[],
  answers: Record<string, string[]>,
  otherTexts: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    questions
      .filter((question) => getSelectedTextOption(question, answers[question.id] ?? []))
      .map((question) => [question.id, (otherTexts[question.id] ?? "").trim()])
  );
}

/** El lead contestó las preguntas anteriores (q1…q7) y no las actuales. */
export function hasLegacyAnswers(answers: { questionId: string }[]): boolean {
  return answers.some((answer) => LEGACY_QUESTIONS.some((question) => question.id === answer.questionId));
}
