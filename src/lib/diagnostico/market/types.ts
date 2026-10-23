// Tipos de la configuración por país de la landing "Llamada diagnóstico". Cada país (México en
// /diagnostico/ y USA en /diagnostico/usa/) tiene su archivo en esta carpeta con textos,
// preguntas, horario, teléfono y Cal.com.

export type MarketId = "mx" | "us";

export type HolidayCalendar = "mx" | "us";

export type ServiceIcon = "abrir" | "regla" | "operacion" | "rentable";

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

export interface DiagnosticoOption {
  id: string;
  label: string;
  exit?: boolean;
  /** Al elegirla se pide un texto ("Otro (escribe cuál)"). */
  requiresText?: boolean;
}

export interface DiagnosticoQuestion {
  id: string;
  text: string;
  multiple: boolean;
  options: DiagnosticoOption[];
}

export interface StepHeading {
  label: string;
  title: string;
  subtitle: string;
}

export interface DiagnosticoContent {
  brandName: string;
  topBanner: string;
  hero: {
    titleStart: string;
    titleHighlight: string;
    subtitle: string;
    cta: string;
    ctaNote: string;
    /** Recuadro con el escudo debajo del botón. */
    proof: string;
  };
  servicesSection: {
    title: string;
    subtitle: string;
    /** Tipos de clínica, separados por " · ", debajo de las tarjetas. */
    clinicTypes: string;
  };
  services: DiagnosticoService[];
  testimonialsSection: { eyebrow: string; title: string };
  testimonials: DiagnosticoTestimonial[];
  /** El de /confirmacion/; null si el país no tiene testimonios. */
  featuredTestimonial: DiagnosticoTestimonial | null;
  steps: {
    questions: StepHeading;
    agenda: StepHeading;
    datos: StepHeading;
  };
  datosForm: {
    nombrePlaceholder: string;
    clinicaLabel: string;
    ciudadPlaceholder: string;
    whatsappHint: string;
    whatsappPreview: string;
    /** Para lectores de pantalla junto a la lada: "número de México". */
    whatsappCountryName: string;
    messages: {
      whatsappCountryCode: string;
      clinica: string;
      ciudad: string;
    };
    consentConfirmacion: { label: string; text: string };
    consentMarketing: { label: string; text: string };
  };
  confirmacion: {
    /** Mensaje que la persona envía por WhatsApp; los datos salen de la reserva real. */
    buildWhatsappMessage: (data: { nombre: string; fecha: string; zona: string }) => string;
    whatsappHint: string;
    releaseNote: string;
    callDescription: string;
    featuredEyebrow: string;
  };
  agenda: {
    loadError: string;
    retry: string;
    noSlots: string;
    noSlotsWhatsappButton: string;
    noSlotsWhatsappMessage: string;
    slotTaken: string;
    emptyDay: string;
    calendar: {
      label: string;
      available: string;
      unavailable: string;
      today: string;
      prevMonth: string;
      nextMonth: string;
      otherMonth: (month: string) => string;
    };
    unavailableLabel: string;
  };
  /** MP4, YouTube o Vimeo. null muestra el marco con "Video próximamente". */
  heroVideoUrl: string | null;
}

export interface DiagnosticoMarket {
  id: MarketId;
  /** Nombre del país en el admin (filtro y CSV). */
  label: string;

  /** Ruta de la landing, sin barra final: "/diagnostico" o "/diagnostico/usa". */
  basePath: string;
  /** Prefijo de las claves de sessionStorage, para que un país no lea el avance del otro. */
  storageKey: string;

  /** Zona en la que se muestran los horarios a la persona y se guarda en el lead. */
  timeZone: string;
  /** Nombre de esa zona en la landing ("Centro de México"). */
  timeZoneLabel: string;

  phone: {
    countryCode: "+52" | "+1";
    /** Lo que se ve junto al campo de WhatsApp. */
    prefixLabel: string;
    placeholder: string;
    /** Grupos de dígitos del número nacional: [2, 4, 4] → "55 1234 5678". */
    groups: number[];
  };

  /** Moneda de los montos de P6. */
  currency: string;

  /** Número que recibe el WhatsApp de confirmación (formato wa.me, sin +). */
  whatsappNumber: string;
  privacyUrl: string;

  /** Festivos que bloquean la agenda en la landing de este país. */
  holidayCalendars: HolidayCalendar[];

  /** Horario del evento de Cal.com. Los días se cuentan en scheduleTimeZone. */
  agenda: {
    scheduleTimeZone: string;
    /** Inicios de llamada que define el horario de Cal.com (hora de pared en scheduleTimeZone). */
    scheduleTimes: string[];
    /** Franja de la tarde que siempre se ve en gris como "Agendado". */
    afternoonTimes: string[];
    slotMinutes: number;
    /** Anticipación mínima de Cal.com: lo que empieza antes de esto no se muestra. */
    minimumNoticeMinutes: number;
  };

  /**
   * IDs de Cal.com de este país. En México las variables de entorno CAL_EVENT_TYPE_ID,
   * CAL_ADMIN_SLOTS_EVENT_TYPE_ID y CAL_SCHEDULE_ID los reemplazan (ver calcom.ts).
   */
  calcom: {
    eventTypeId: number;
    adminSlotsEventTypeId: number;
    scheduleId: number;
  };

  /** Muestra los testimonios (3 en /diagnostico/ y el destacado en /confirmacion/). */
  showTestimonials: boolean;

  content: DiagnosticoContent;
  questions: DiagnosticoQuestion[];
}
