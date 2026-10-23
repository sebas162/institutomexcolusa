// Piezas iguales en todos los países.

import type { DiagnosticoOption, DiagnosticoQuestion } from "./types";

export const OTHER_TEXT_MAX = 120;

export const OTHER_OPTION: DiagnosticoOption = {
  id: "otro",
  label: "Otro (escribe cuál)",
  requiresText: true,
};

// IDs de las preguntas, iguales en todos los países: el admin y el CSV las juntan en las mismas
// columnas. Son distintos de los de las preguntas anteriores (q1…q7, ver legacy.ts).
export const QUESTION_IDS = {
  perfil: "perfil",
  etapa: "etapa",
  establecimiento: "establecimiento",
  necesidades: "necesidades",
  apoyo: "apoyo",
  inversion: "inversion",
  urgencia: "urgencia",
} as const;

export const STAGE_QUESTION: DiagnosticoQuestion = {
  id: QUESTION_IDS.etapa,
  text: "¿En qué etapa está tu proyecto?",
  multiple: false,
  options: [
    { id: "idea", label: "Tengo la idea y estoy planeando" },
    { id: "local", label: "Busco o estoy adecuando un local" },
    { id: "por_abrir", label: "Estoy por abrir (menos de 3 meses)" },
    { id: "operando", label: "Mi clínica ya está operando" },
  ],
};

export const SUPPORT_QUESTION: DiagnosticoQuestion = {
  id: QUESTION_IDS.apoyo,
  text: "¿Qué tipo de apoyo buscas?",
  multiple: false,
  options: [
    { id: "plan", label: "Un diagnóstico y un plan claro de qué hacer" },
    { id: "acompanamiento", label: "Que me acompañen de principio a fin" },
    { id: "mensual", label: "Acompañamiento mensual de mi clínica" },
    { id: "orientacion", label: "Aún no lo sé, quiero orientación" },
  ],
};

export const INVESTMENT_QUESTION_TEXT = "¿Cuánto tienes contemplado invertir en la consultoría?";

export const URGENCY_QUESTION: DiagnosticoQuestion = {
  id: QUESTION_IDS.urgencia,
  text: "¿Qué tan pronto necesitas empezar?",
  multiple: false,
  options: [
    {
      id: "ya",
      label: "Ya. Tengo una inspección, trámite o apertura pendiente.",
    },
    {
      id: "proximo_mes",
      label: "En el próximo mes, quiero moverme rápido.",
    },
    {
      id: "3_meses",
      label: "En los próximos 3 meses, cuando arme presupuesto.",
    },
    {
      id: "explorando",
      label: "Solo estoy explorando, no tengo urgencia definida.",
      exit: true,
    },
    {
      id: "no_seguro",
      label: "No estoy seguro de invertir en esto todavía.",
      exit: true,
    },
  ],
};
