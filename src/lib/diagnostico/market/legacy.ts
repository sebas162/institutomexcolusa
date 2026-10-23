// Preguntas anteriores de México (q1…q7), solo para leer en el admin y el CSV los leads que las
// contestaron. La landing ya no las usa: las actuales están en mx.ts y us.ts.

import { OTHER_OPTION } from "./shared";
import type { DiagnosticoQuestion } from "./types";

const CURRENCY = "USD";

export const LEGACY_QUESTIONS: DiagnosticoQuestion[] = [
  {
    id: "q1",
    text: "Solo trabajamos con profesionales de la salud, dueños y directores de clínicas o consultorios de medicina estética y regenerativa.",
    multiple: false,
    options: [
      { id: "si", label: "Sí, ese es mi perfil" },
      {
        id: "no",
        label: "No, ese no es mi perfil.",
        exit: true,
      },
    ],
  },
  {
    id: "q2",
    text: "¿Qué tipo de establecimiento diriges actualmente?",
    multiple: false,
    options: [
      { id: "estetica", label: "Consultorio o clínica de medicina estética" },
      { id: "regenerativa", label: "Clínica o consultorio de medicina regenerativa" },
      {
        id: "multiespecialidad",
        label: "Clínica o consultorio multiespecialidad (medicina estética y regenerativa)",
      },
      { id: "por_abrir", label: "Estoy por abrir mi clínica" },
      OTHER_OPTION,
    ],
  },
  {
    id: "q3",
    text: "¿Cuántas personas trabajan en tu clínica?",
    multiple: false,
    options: [
      { id: "solo_yo", label: "Solo yo" },
      { id: "2_5", label: "De 2 a 5 personas" },
      { id: "6_15", label: "De 6 a 15 personas" },
      { id: "16_50", label: "De 16 a 50 personas" },
      { id: "mas_50", label: "Más de 50 personas" },
    ],
  },
  {
    id: "q4",
    text: "¿En qué te gustaría recibir ayuda?",
    multiple: true,
    options: [
      { id: "diagnostico", label: "Diagnóstico completo de mi clínica" },
      {
        id: "licencia_regenerativa",
        label: "Licencia sanitaria para establecimientos de salud en medicina regenerativa",
      },
      {
        id: "visto_bueno",
        label: "Visto bueno de seguridad y operación de las instalaciones",
      },
      { id: "proyecto_general", label: "Proyecto general para establecimiento de salud" },
      { id: "aviso_funcionamiento", label: "Aviso de funcionamiento del establecimiento" },
      { id: "publicidad", label: "Permiso de publicidad para servicios de salud" },
      {
        id: "aviso_responsable",
        label:
          "Aviso de funcionamiento y responsable sanitario del establecimiento de servicios de salud",
      },
      OTHER_OPTION,
    ],
  },
  {
    id: "q5",
    text: "¿Qué tipo de servicio te interesa?",
    multiple: true,
    options: [
      { id: "entrevista", label: "Entrevista de análisis y diagnóstico" },
      { id: "visita", label: "Visita a las instalaciones" },
      {
        id: "inicio_proyecto",
        label: "Inicio de proyecto (apertura o regularización de la clínica)",
      },
      {
        id: "auditorias",
        label:
          "Auditorías internas mensuales para verificar cumplimiento y actualizaciones",
      },
      OTHER_OPTION,
    ],
  },
  {
    id: "q6",
    text: "¿Qué inversión piensas destinar a este proyecto?",
    multiple: false,
    options: [
      { id: "500_1000", label: `De ${CURRENCY} 500 a ${CURRENCY} 1,000` },
      { id: "1000_2000", label: `De ${CURRENCY} 1,000 a ${CURRENCY} 2,000` },
      { id: "2000_3000", label: `De ${CURRENCY} 2,000 a ${CURRENCY} 3,000` },
      { id: "3000_4000", label: `De ${CURRENCY} 3,000 a ${CURRENCY} 4,000` },
      { id: "mas_5000", label: `Más de ${CURRENCY} 5,000` },
    ],
  },
  {
    id: "q7",
    text: "¿Qué tan pronto necesitas empezar?",
    multiple: false,
    options: [
      {
        id: "ya",
        label: "Ya. Tengo una verificación, trámite o apertura pendiente.",
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
  },
];
