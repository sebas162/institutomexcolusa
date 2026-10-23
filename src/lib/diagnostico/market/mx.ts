// Landing "Dirección y Gestión de Clínicas Médicas" para México (/diagnostico/): todo lo que
// depende del país está aquí. La de USA está en us.ts con la misma forma (DiagnosticoMarket).

import {
  INVESTMENT_QUESTION_TEXT,
  OTHER_OPTION,
  QUESTION_IDS,
  STAGE_QUESTION,
  SUPPORT_QUESTION,
  URGENCY_QUESTION,
} from "./shared";
import type { DiagnosticoContent, DiagnosticoMarket, DiagnosticoQuestion } from "./types";

// Moneda de P6. DECIDIDO: se queda en USD.
const CURRENCY = "USD";

const content: DiagnosticoContent = {
  brandName: "Instituto Mex-Col-USA",
  topBanner: "México · Para médicos, dueños de clínicas e inversionistas en salud",

  hero: {
    titleStart: "Abre u opera tu clínica sin perder dinero",
    titleHighlight: "ni arriesgar tu licencia.",
    subtitle: "Mira el video y agenda tu diagnóstico gratis de 15 minutos.",
    cta: "Ver si califico",
    ctaNote: "7 preguntas · 1 minuto · Cupo limitado por día",
    proof:
      "Predicamos con el ejemplo: nuestra clínica tiene sus trámites en regla y publicidad autorizada por COFEPRIS.",
  },

  servicesSection: {
    title: "Un solo equipo para toda tu clínica",
    subtitle:
      "Expertos en regulación sanitaria, operación, publicidad, protección civil y uso de suelo.",
    clinicTypes: "Medicina estética · Med spa · Medicina regenerativa · Cirugía estética",
  },

  services: [
    {
      icon: "abrir",
      title: "Abrir tu clínica",
      description: "Local, presupuesto y requisitos antes de invertir.",
    },
    {
      icon: "regla",
      title: "Ponerla en regla",
      description: "COFEPRIS, protección civil y uso de suelo.",
    },
    {
      icon: "operacion",
      title: "Ordenar la operación",
      description: "Manuales, protocolos, bitácoras y personal.",
    },
    {
      icon: "rentable",
      title: "Hacerla rentable",
      description: "Costos, precios y publicidad sin riesgos.",
    },
  ],

  testimonialsSection: {
    eyebrow: "Testimonios",
    title: "Médicos que ya operan con todo en orden",
  },

  testimonials: [
    {
      tag: "Permisos y apertura",
      quote:
        "Teníamos la apertura detenida porque no sabíamos qué documentos nos faltaban. Hoy operamos con todo en orden.",
      name: "Dra. Andra Hernández",
      role: "Directora · Med spa · Guadalajara, Jal.",
    },
    {
      tag: "Bitácoras y manuales",
      quote:
        "Ahora todo está documentado y mi equipo sabe qué hacer cuando llega una revisión.",
      name: "Dr. Sebastián Hernández",
      role: "Odontólogo y dueño · Clínica dental · Ciudad de México",
    },
    {
      tag: "Publicidad",
      quote:
        "Me ayudaron a corregir mis publicaciones y ahora promociono mi consultorio con tranquilidad.",
      name: "Dr. Cristian Zuluaga",
      role: "Médico general · Consultorio médico · Guadalajara, Jal.",
    },
  ],

  featuredTestimonial: {
    quote:
      "Pensé que sería una llamada de ventas más. En 15 minutos me dijeron exactamente qué me faltaba en mi consultorio y cuál era el primer paso.",
    name: "Dr. Gabriel Velandia",
    role: "Médico general · Consultorio médico · Guadalajara, Jal.",
  },

  steps: {
    questions: {
      label: "Paso 2 de 3 — Responde 7 preguntas",
      title: "¿Tu proyecto califica?",
      subtitle:
        "Antes de abrir la agenda necesitamos saber si de verdad podemos ayudarte. Toma un minuto.",
    },
    agenda: {
      label: "Paso 3 de 3 — Elige tu horario",
      title: "Tu proyecto califica",
      subtitle: "Elige el día y la hora de tu llamada diagnóstico de 15 minutos.",
    },
    datos: {
      label: "Paso 3 de 3 — Tus datos",
      title: "Último paso",
      subtitle:
        "Al terminar, confirmarás tu cita por WhatsApp desde este número. Verifica que sea correcto.",
    },
  },

  datosForm: {
    nombrePlaceholder: "Ej. Dr. Roberto Méndez",
    clinicaLabel: "Nombre de tu clínica o proyecto *",
    ciudadPlaceholder: "Ej. Monterrey, NL",
    whatsappHint: "Aquí te llegará el mensaje para confirmar tu cita. Verifica que sea correcto.",
    whatsappPreview: "Te confirmaremos a este WhatsApp:",
    whatsappCountryName: "número de México",
    messages: {
      whatsappCountryCode: "Usa un número de WhatsApp de México.",
      clinica: "Escribe el nombre de tu clínica o proyecto (entre 2 y 120 caracteres).",
      ciudad: "Escribe tu ciudad y estado (entre 2 y 120 caracteres).",
    },
    consentConfirmacion: {
      label: "Requerido.",
      text: "Acepto que el Instituto Mex-Col-USA me contacte por WhatsApp y correo electrónico para confirmar, recordar o reprogramar esta llamada. Puedo pedir que dejen de escribirme en cualquier momento respondiendo BAJA.",
    },
    consentMarketing: {
      label: "Opcional.",
      text: "Quiero recibir novedades, contenido útil y promociones para clínicas y consultorios del Instituto Mex-Col-USA por WhatsApp y correo. Puedo cancelar cuando quiera respondiendo BAJA.",
    },
  },

  confirmacion: {
    buildWhatsappMessage: ({ nombre, fecha, zona }) =>
      [
        "Hola, CONFIRMO mi llamada de diagnóstico.",
        ...(nombre ? [`Nombre: ${nombre}`] : []),
        `Fecha: ${fecha} (hora ${zona})`,
      ].join("\n"),
    whatsappHint: "Se abrirá WhatsApp con tu mensaje listo. Solo toca enviar.",
    releaseNote:
      "Confírmala por WhatsApp en un toque. Si no confirmas, el espacio se libera para otra clínica o consultorio.",
    callDescription:
      "15 minutos para conocer tu clínica o proyecto: qué tienes en regla, qué te falta y en qué necesitas apoyo. Si tiene sentido para ambos, te proponemos el siguiente paso.",
    featuredEyebrow: "Así le fue a otro dueño de clínica o consultorio",
  },

  agenda: {
    loadError:
      "Los horarios están tardando un poco más de lo normal. Toca Reintentar en un momento.",
    retry: "Reintentar",
    noSlots:
      "Por ahora no hay horarios disponibles. Escríbenos por WhatsApp y te ayudamos a agendar.",
    noSlotsWhatsappButton: "Escríbenos por WhatsApp",
    noSlotsWhatsappMessage: "Hola, quiero agendar una llamada diagnóstico.",
    slotTaken: "Ese horario se acaba de ocupar. Elige otro, por favor.",
    emptyDay: "Sin horarios este día.",
    calendar: {
      label: "Días disponibles",
      available: "disponible",
      unavailable: "no disponible",
      today: "hoy",
      prevMonth: "Mes anterior",
      nextMonth: "Mes siguiente",
      otherMonth: (month: string) => `Hay otro día disponible en ${month}`,
    },
    unavailableLabel: "Agendado",
  },

  heroVideoUrl: null,
};

const questions: DiagnosticoQuestion[] = [
  {
    id: QUESTION_IDS.perfil,
    text: "¿Cuál es tu perfil?",
    multiple: false,
    options: [
      { id: "profesional", label: "Profesional de la salud (médico o especialista)" },
      { id: "dueno", label: "Dueño o director de una clínica" },
      { id: "inversionista", label: "Inversionista con capital para abrir una clínica" },
      { id: "ninguno", label: "Ninguno de los anteriores", exit: true },
    ],
  },
  STAGE_QUESTION,
  {
    id: QUESTION_IDS.establecimiento,
    text: "¿Qué tipo de establecimiento tienes o quieres abrir?",
    multiple: false,
    options: [
      { id: "estetica", label: "Consultorio o clínica de medicina estética (sin cirugía)" },
      { id: "med_spa", label: "Med spa" },
      { id: "regenerativa", label: "Medicina regenerativa" },
      { id: "quirurgica", label: "Clínica con procedimientos quirúrgicos" },
      { id: "multiespecialidad", label: "Multiespecialidad" },
      OTHER_OPTION,
    ],
  },
  {
    id: QUESTION_IDS.necesidades,
    text: "¿Qué necesitas resolver?",
    multiple: true,
    options: [
      { id: "desde_cero", label: "Abrir mi clínica desde cero" },
      { id: "cofepris", label: "Permisos COFEPRIS (avisos, licencia, responsable sanitario)" },
      { id: "proteccion_civil", label: "Protección civil, uso de suelo e instalaciones" },
      { id: "manuales", label: "Manuales, protocolos y bitácoras" },
      { id: "rentabilidad", label: "Costos, precios y rentabilidad" },
      { id: "publicidad", label: "Publicidad con permiso y captación de pacientes" },
      OTHER_OPTION,
    ],
  },
  SUPPORT_QUESTION,
  {
    id: QUESTION_IDS.inversion,
    text: INVESTMENT_QUESTION_TEXT,
    multiple: false,
    options: [
      { id: "500_1000", label: `De ${CURRENCY} 500 a ${CURRENCY} 1,000` },
      { id: "1000_2000", label: `De ${CURRENCY} 1,000 a ${CURRENCY} 2,000` },
      { id: "2000_3000", label: `De ${CURRENCY} 2,000 a ${CURRENCY} 3,000` },
      { id: "3000_5000", label: `De ${CURRENCY} 3,000 a ${CURRENCY} 5,000` },
      { id: "mas_5000", label: `Más de ${CURRENCY} 5,000` },
    ],
  },
  URGENCY_QUESTION,
];

export const MX_MARKET: DiagnosticoMarket = {
  id: "mx",
  label: "México",

  basePath: "/diagnostico",
  storageKey: "diagnostico",

  timeZone: "America/Mexico_City",
  timeZoneLabel: "Centro de México",

  phone: {
    countryCode: "+52",
    prefixLabel: "MX +52",
    placeholder: "55 1234 5678",
    groups: [2, 4, 4],
  },

  currency: CURRENCY,

  whatsappNumber: "525566308602",
  privacyUrl: "/privacy/",

  // México y USA: el equipo atiende desde Houston.
  holidayCalendars: ["mx", "us"],

  // Horario de Cal.com en hora de Houston: lunes a viernes de 10:00 a 15:00, una llamada cada 30 min.
  // DECIDIDO: el horario se queda en hora de Houston (no se cambia el schedule de Cal.com); la
  // persona ve todo en hora del centro de México (timeZone).
  agenda: {
    scheduleTimeZone: "America/Chicago",
    scheduleTimes: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30"],
    afternoonTimes: ["15:00", "15:30", "16:00", "16:30", "17:00"],
    slotMinutes: 15,
    minimumNoticeMinutes: 120,
  },

  calcom: {
    eventTypeId: 7427740,
    adminSlotsEventTypeId: 7453032,
    scheduleId: 2481982,
  },

  showTestimonials: true,

  content,
  questions,
};
