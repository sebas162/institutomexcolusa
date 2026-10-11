export type ServiceIcon = "permisos" | "documentacion" | "almacenamiento" | "publicidad";

export interface DiagnosticoService {
  icon: ServiceIcon;
  title: string;
  description: string;
}

export interface DiagnosticoTestimonial {
  tag?: string;
  quote: string;
  name: string;
  role: string;
}

export const DIAGNOSTICO_CONTENT = {
  brandName: "Instituto Mex-Col-USA",
  topBanner:
    "Solo para dueños y directores de clínicas estéticas en México y Estados Unidos",

  hero: {
    badge: "Llamada diagnóstico · 15 min · sin costo",
    titleStart: "Tu clínica estética en regla, documentada y",
    titleHighlight: "lista para crecer",
    subtitle:
      "Permisos, bitácoras, manuales, almacenamiento y publicidad. Te decimos qué le falta a tu clínica y cómo resolverlo.",
    stepLabel: "Paso 1 — Mira el video",
    cta: "Ver si mi clínica califica",
    ctaNote: "7 preguntas · 1 minuto · Llamada de 15 minutos sin costo",
  },

  services: [
    {
      icon: "permisos",
      title: "Permisos y trámites",
      description: "Qué necesitas para operar en regla.",
    },
    {
      icon: "documentacion",
      title: "Bitácoras y manuales",
      description: "Documentación lista para una revisión.",
    },
    {
      icon: "almacenamiento",
      title: "Almacenamiento",
      description: "Manejo correcto de productos e insumos.",
    },
    {
      icon: "publicidad",
      title: "Publicidad",
      description: "Qué sí y qué no puedes anunciar.",
    },
  ] satisfies DiagnosticoService[],

  testimonialsSection: {
    eyebrow: "Testimonios",
    title: "Lo que dicen otros dueños de clínicas",
    subtitle: "Médicos y directores que ya ordenaron su clínica con nosotros.",
  },

  testimonials: [
    {
      tag: "Permisos y apertura",
      quote:
        "Teníamos la apertura detenida porque no sabíamos qué documentos nos faltaban. En la llamada nos dijeron exactamente por dónde empezar, y hoy operamos con todo en orden.",
      name: "Dra. [Nombre Apellido]",
      role: "Directora · Med spa · Houston, TX",
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
  ] satisfies DiagnosticoTestimonial[],

  featuredTestimonial: {
    quote:
      "Pensé que sería una llamada de ventas más. En 15 minutos me dijeron exactamente qué me faltaba en mi consultorio y cuál era el primer paso.",
    name: "Dr. [Nombre Apellido]",
    role: "Médico general · Consultorio médico · Guadalajara, Jal.",
  } satisfies DiagnosticoTestimonial,

  datosForm: {
    nombrePlaceholder: "Ej. Dr. Roberto Méndez",
    ciudadPlaceholder: "Ej. Monterrey, NL o Houston, TX",
    whatsappHint: "Aquí te llegará el mensaje para confirmar tu cita. Verifica que sea correcto.",
    whatsappPreview: "Te confirmaremos a este WhatsApp:",
    consentConfirmacion: {
      label: "Requerido.",
      text: "Acepto que el Instituto Mex-Col-USA me contacte por WhatsApp y correo electrónico para confirmar, recordar o reprogramar esta llamada. Puedo pedir que dejen de escribirme en cualquier momento respondiendo BAJA.",
    },
    consentMarketing: {
      label: "Opcional.",
      text: "Quiero recibir novedades, contenido útil y promociones para clínicas del Instituto Mex-Col-USA por WhatsApp y correo. Puedo cancelar cuando quiera respondiendo BAJA.",
    },
  },

  confirmacion: {
    /** Mensaje que la persona envía por WhatsApp; los datos salen de la reserva real. */
    buildWhatsappMessage: ({
      nombre,
      fecha,
      zona,
    }: {
      nombre: string;
      fecha: string;
      zona: string;
    }) =>
      [
        "Hola, CONFIRMO mi llamada de diagnóstico.",
        ...(nombre ? [`Nombre: ${nombre}`] : []),
        `Fecha: ${fecha} (hora ${zona})`,
      ].join("\n"),
    whatsappHint: "Se abrirá WhatsApp con tu mensaje listo. Solo toca enviar.",
  },

  agenda: {
    loadError: "No pudimos cargar los horarios.",
    retry: "Reintentar",
    noSlots:
      "Por ahora no hay horarios disponibles. Escríbenos por WhatsApp y te ayudamos a agendar.",
    noSlotsWhatsappButton: "Escríbenos por WhatsApp",
    noSlotsWhatsappMessage: "Hola, quiero agendar una llamada diagnóstico.",
    slotTaken: "Ese horario se acaba de ocupar. Elige otro, por favor.",
    emptyDay: "Sin horarios este día.",
    unavailableLabel: "Agendado",
  },

  // MP4, YouTube o Vimeo. null muestra el marco con "Video próximamente".
  heroVideoUrl: null as string | null,

  // Número que recibe el mensaje "CONFIRMO mi cita #XXXX" (formato wa.me, sin +).
  whatsappNumber: "525566308602",

  privacyUrl: "/privacy/",
};
