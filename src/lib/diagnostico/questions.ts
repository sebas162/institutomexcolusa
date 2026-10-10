export interface DiagnosticoOption {
  id: string;
  label: string;
  exit?: boolean;
}

export interface DiagnosticoQuestion {
  id: string;
  text: string;
  multiple: boolean;
  options: DiagnosticoOption[];
}

export const DIAGNOSTICO_FORM_ID = "llamada-diagnostico";

export const DIAGNOSTICO_QUESTIONS: DiagnosticoQuestion[] = [
  {
    id: "q1",
    text: "Solo trabajamos con dueños, socios o directores médicos de clínicas en México y Estados Unidos.",
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
      { id: "consultorio", label: "Consultorio de medicina estética" },
      {
        id: "clinica",
        label: "Clínica de medicina estética o dermatología estética",
      },
      { id: "medspa", label: "Med spa" },
      {
        id: "multiespecialidad",
        label: "Clínica multiespecialidad con área estética",
      },
      { id: "por_abrir", label: "Estoy por abrir mi clínica" },
      { id: "otro", label: "Otro" },
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
      { id: "permisos", label: "Permisos y trámites regulatorios" },
      {
        id: "documentacion",
        label: "Documentación: bitácoras, manuales y procedimientos",
      },
      { id: "almacenamiento", label: "Almacenamiento y manejo de productos" },
      { id: "uso_suelo", label: "Uso de suelo y apertura de clínica" },
      {
        id: "publicidad",
        label: "Asesoría en tu publicidad (qué sí y qué no se puede hacer)",
      },
      { id: "productos", label: "Productos e insumos" },
      { id: "otro", label: "Otro" },
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
    ],
  },
  {
    id: "q6",
    text: "¿Qué inversión piensas destinar a este proyecto?",
    multiple: false,
    options: [
      { id: "500_1000", label: "De USD 500 a USD 1,000" },
      { id: "1000_2000", label: "De USD 1,000 a USD 2,000" },
      { id: "2000_3000", label: "De USD 2,000 a USD 3,000" },
      { id: "3000_4000", label: "De USD 3,000 a USD 4,000" },
      { id: "mas_5000", label: "Más de USD 5,000" },
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
