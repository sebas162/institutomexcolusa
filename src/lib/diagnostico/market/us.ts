// Landing "Dirección y Gestión de Clínicas Médicas" para USA (/diagnostico/usa/), en español.
// Misma forma que mx.ts. Lo marcado PENDIENTE falta confirmarlo con la clienta.

import { MX_MARKET } from "./mx";
import {
  INVESTMENT_QUESTION_TEXT,
  OTHER_OPTION,
  QUESTION_IDS,
  STAGE_QUESTION,
  SUPPORT_QUESTION,
  URGENCY_QUESTION,
} from "./shared";
import type { DiagnosticoContent, DiagnosticoMarket, DiagnosticoQuestion } from "./types";

const CURRENCY = "USD";

const mx = MX_MARKET.content;

const content: DiagnosticoContent = {
  brandName: mx.brandName,
  topBanner: "Estados Unidos · Texas · Para médicos, dueños de med spas e inversionistas en salud",

  hero: {
    titleStart: "Abre u opera tu med spa sin perder dinero",
    titleHighlight: "ni arriesgar tu licencia.",
    subtitle:
      "En Texas las reglas son distintas. Mira el video y agenda tu diagnóstico gratis de 15 minutos.",
    cta: "Ver si califico",
    ctaNote: "7 preguntas · 1 minuto · Horario del Centro (Houston)",
    // PENDIENTE: confirmar con la clienta.
    proof: "Tenemos instalaciones en Houston y conocemos las reglas de Texas.",
  },

  servicesSection: {
    title: "Un solo equipo para todo tu med spa",
    subtitle:
      "Expertos en regulación médica de Texas, operación, publicidad y estructura del negocio.",
    clinicTypes:
      "Med spa · Medicina estética · Sueroterapia IV · Medicina regenerativa · Cirugía estética",
  },

  services: [
    {
      icon: "abrir",
      title: "Abrir tu med spa",
      description: "Estructura legal correcta, aunque no seas médico.",
    },
    {
      icon: "regla",
      title: "Ponerlo en regla",
      description: "Director médico y delegación por escrito ante el Texas Medical Board.",
    },
    {
      icon: "operacion",
      title: "Ordenar la operación",
      description: "Protocolos de inyectables, láser y sueroterapia IV.",
    },
    {
      icon: "rentable",
      title: "Hacerlo rentable",
      description: "Costos, precios y publicidad sin riesgos.",
    },
  ],

  // Sin testimonios reales de USA todavía (showTestimonials: false).
  testimonialsSection: mx.testimonialsSection,
  testimonials: [],
  featuredTestimonial: null,

  steps: mx.steps,

  datosForm: {
    ...mx.datosForm,
    clinicaLabel: "Nombre de tu med spa o proyecto *",
    ciudadPlaceholder: "Ej. Houston, TX",
    whatsappCountryName: "número de Estados Unidos",
    messages: {
      whatsappCountryCode: "Usa un número de WhatsApp de Estados Unidos.",
      clinica: "Escribe el nombre de tu med spa o proyecto (entre 2 y 120 caracteres).",
      ciudad: mx.datosForm.messages.ciudad,
    },
    consentMarketing: {
      label: "Opcional.",
      text: "Quiero recibir novedades, contenido útil y promociones para med spas y clínicas del Instituto Mex-Col-USA por WhatsApp y correo. Puedo cancelar cuando quiera respondiendo BAJA.",
    },
  },

  confirmacion: {
    ...mx.confirmacion,
    buildWhatsappMessage: ({ nombre, fecha, zona }) =>
      [
        "Hola, CONFIRMO mi llamada de diagnóstico.",
        ...(nombre ? [`Nombre: ${nombre}`] : []),
        `Fecha: ${fecha} (hora del ${zona})`,
      ].join("\n"),
    releaseNote:
      "Confírmala por WhatsApp en un toque. Si no confirmas, el espacio se libera para otro med spa o clínica.",
    callDescription:
      "15 minutos para conocer tu med spa o proyecto: qué tienes en regla, qué te falta y en qué necesitas apoyo. Si tiene sentido para ambos, te proponemos el siguiente paso.",
  },

  agenda: mx.agenda,

  heroVideoUrl: null,
};

const questions: DiagnosticoQuestion[] = [
  {
    id: QUESTION_IDS.perfil,
    text: "¿Cuál es tu perfil?",
    multiple: false,
    options: [
      { id: "profesional", label: "Profesional de la salud con licencia (médico, PA, NP o RN)" },
      { id: "dueno", label: "Dueño o director de un med spa o clínica" },
      { id: "inversionista", label: "Inversionista con capital para abrir un med spa" },
      { id: "ninguno", label: "Ninguno de los anteriores", exit: true },
    ],
  },
  STAGE_QUESTION,
  {
    id: QUESTION_IDS.establecimiento,
    text: "¿Qué tipo de establecimiento tienes o quieres abrir?",
    multiple: false,
    options: [
      { id: "med_spa", label: "Med spa" },
      { id: "estetica", label: "Consultorio de medicina estética" },
      { id: "sueroterapia", label: "Sueroterapia IV" },
      { id: "regenerativa", label: "Medicina regenerativa" },
      { id: "quirurgica", label: "Clínica con procedimientos quirúrgicos" },
      OTHER_OPTION,
    ],
  },
  {
    id: QUESTION_IDS.necesidades,
    text: "¿Qué necesitas resolver?",
    multiple: true,
    options: [
      { id: "desde_cero", label: "Abrir mi med spa desde cero" },
      { id: "estructura_legal", label: "Estructura legal (dueño médico o MSO para inversionistas)" },
      { id: "director_medico", label: "Director médico y delegación por escrito (Texas Medical Board)" },
      { id: "protocolos", label: "Protocolos de inyectables, láser o sueroterapia IV" },
      { id: "rentabilidad", label: "Costos, precios y rentabilidad" },
      { id: "publicidad", label: "Publicidad conforme a las reglas y captación de pacientes" },
      OTHER_OPTION,
    ],
  },
  SUPPORT_QUESTION,
  {
    id: QUESTION_IDS.inversion,
    text: INVESTMENT_QUESTION_TEXT,
    multiple: false,
    options: [
      { id: "1000_3000", label: `De ${CURRENCY} 1,000 a ${CURRENCY} 3,000` },
      { id: "3000_5000", label: `De ${CURRENCY} 3,000 a ${CURRENCY} 5,000` },
      { id: "5000_10000", label: `De ${CURRENCY} 5,000 a ${CURRENCY} 10,000` },
      { id: "mas_10000", label: `Más de ${CURRENCY} 10,000` },
    ],
  },
  URGENCY_QUESTION,
];

export const US_MARKET: DiagnosticoMarket = {
  id: "us",
  label: "USA",

  basePath: "/diagnostico/usa",
  storageKey: "diagnostico:usa",

  timeZone: "America/Chicago",
  timeZoneLabel: "Centro, Houston",

  phone: {
    countryCode: "+1",
    prefixLabel: "US +1",
    placeholder: "713 555 1234",
    groups: [3, 3, 4],
  },

  currency: CURRENCY,

  // Por ahora el mismo WhatsApp que México; puede cambiar a un número de USA.
  whatsappNumber: MX_MARKET.whatsappNumber,
  // PENDIENTE: no hay aviso de privacidad de USA; se usa el de México.
  privacyUrl: MX_MARKET.privacyUrl,

  holidayCalendars: ["us"],

  agenda: MX_MARKET.agenda,

  // Evento, evento interno y horario propios ("Diagnóstico USA", solo festivos de USA). Usan el
  // mismo calendario conectado que México, así que una cita de un país bloquea ese horario en el otro.
  calcom: {
    eventTypeId: 7615565,
    adminSlotsEventTypeId: 7615566,
    scheduleId: 2544708,
  },

  showTestimonials: false,

  content,
  questions,
};
