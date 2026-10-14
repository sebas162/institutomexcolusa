// Landing "Llamada diagnóstico" para México: todo lo que depende del país está aquí.
// Para la versión de USA se crea market/us.ts con la misma forma (DiagnosticoMarket).

import { OTHER_OPTION } from "./shared";
import type { DiagnosticoContent, DiagnosticoMarket, DiagnosticoQuestion } from "./types";

// Moneda de P6. DECIDIDO: se queda en USD.
const CURRENCY = "USD";

const content: DiagnosticoContent = {
  brandName: "Instituto Mex-Col-USA",
  topBanner:
    "Solo profesionales de la salud, dueños y directores de clínicas y consultorios de medicina estética y regenerativa",

  hero: {
    badge: "Llamada diagnóstico · 15 min · sin costo",
    titleStart:
      "Tu clínica o consultorio de medicina estética o regenerativa, en regla, documentado y",
    titleHighlight: "lista para crecer",
    subtitle:
      "Permisos, bitácoras, manuales, almacenamiento, permiso de publicidad, entre otros. Te decimos qué te falta y cómo resolverlo.",
    stepLabel: "Paso 1 — Mira el video",
    cta: "Ver si califico",
    ctaNote: "7 preguntas · 1 minuto · Llamada de 15 minutos sin costo",
  },

  services: [
    {
      icon: "permisos",
      title: "Permisos y trámites",
      description:
        "Qué necesitas para operar en regla: tus permisos y la licencia sanitaria para establecimientos de salud.",
    },
    {
      icon: "documentacion",
      title: "Bitácoras y manuales",
      description:
        "Desarrollo de los manuales regulatorios que requiere la operación del establecimiento y sus bitácoras correspondientes.",
    },
    {
      icon: "auditorias",
      title: "Auditorías internas",
      description:
        "Reporte y plan de trabajo para dar continuidad a los procesos del establecimiento.",
    },
    {
      icon: "publicidad",
      title: "Publicidad",
      description:
        "Permiso de publicidad para servicios de salud (televisión, internet, prensa y folletos).",
    },
  ],

  testimonialsSection: {
    eyebrow: "Testimonios",
    subtitle:
      "Médicos y directores que ya están al día con su clínica o consultorio con nosotros.",
  },

  testimonials: [
    {
      tag: "Permisos y apertura",
      quote:
        "Teníamos la apertura detenida porque no sabíamos qué documentos nos faltaban. En la llamada nos dijeron exactamente por dónde empezar, y hoy operamos con todo en orden.",
      name: "Dra. [Nombre Apellido]",
      role: "Directora · Med spa · Guadalajara, Jal.",
    },
    {
      tag: "Bitácoras y manuales",
      quote:
        "Llevábamos años con bitácoras incompletas y manuales que nadie usaba. Ahora todo está documentado y mi equipo sabe qué hacer cuando llega una revisión.",
      name: "Dr. [Nombre Apellido]",
      role: "Odontólogo y dueño · Clínica dental · Ciudad de México",
    },
    {
      tag: "Publicidad",
      quote:
        "No tenía claro qué podía anunciar y qué no. Me ayudaron a corregir mis publicaciones y ahora promociono mi consultorio con tranquilidad.",
      name: "Dr. [Nombre Apellido]",
      role: "Médico general · Consultorio médico · Guadalajara, Jal.",
    },
  ],

  featuredTestimonial: {
    quote:
      "Pensé que sería una llamada de ventas más. En 15 minutos me dijeron exactamente qué me faltaba en mi consultorio y cuál era el primer paso.",
    name: "Dr. [Nombre Apellido]",
    role: "Médico general · Consultorio médico · Guadalajara, Jal.",
  },

  steps: {
    questions: {
      label: "Paso 2 de 3 — Responde 7 preguntas",
      title: "¿Tu clínica o consultorio califica?",
      subtitle:
        "Antes de abrir la agenda necesitamos saber si de verdad podemos ayudarte. Toma un minuto.",
    },
    agenda: {
      label: "Paso 3 de 3 — Elige tu horario",
      title: "Tu clínica o consultorio califica",
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
    clinicaLabel: "Nombre de la clínica o consultorio *",
    ciudadPlaceholder: "Ej. Monterrey, NL",
    whatsappHint: "Aquí te llegará el mensaje para confirmar tu cita. Verifica que sea correcto.",
    whatsappPreview: "Te confirmaremos a este WhatsApp:",
    messages: {
      clinica: "Escribe el nombre de tu clínica o consultorio (entre 2 y 120 caracteres).",
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
      "15 minutos para conocer tu clínica o consultorio: qué tienes en regla, qué te falta y en qué necesitas apoyo. Si tiene sentido para ambos, te proponemos el siguiente paso.",
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

export const MX_MARKET: DiagnosticoMarket = {
  id: "mx",
  label: "México",

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

  // Apagados mientras llegan los testimonios reales: los textos de ejemplo siguen en content.
  showTestimonials: false,

  content,
  questions,
};
