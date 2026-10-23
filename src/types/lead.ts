import type { MarketId } from "@/lib/diagnostico/market/types";

export type LeadStatus =
  | "nuevo"
  | "agendada"
  | "confirmada"
  | "recordada"
  | "asistio"
  | "no_asistio"
  | "cancelada"
  | "reprogramada";

/**
 * Quién hizo un cambio de estado: la landing, el webhook de Cal.com, el equipo desde el admin
 * o la sincronización con Cal.com (red de seguridad si un webhook no llegó).
 */
export type LeadStatusSource = "landing" | "webhook" | "admin" | "sync";

export interface LeadStatusChange {
  status: LeadStatus;
  at: Date;
  source: LeadStatusSource;
  /** Correo de la sesión del admin; null si el cambio no lo hizo una persona. */
  email: string | null;
  note?: string;
}

export type WhatsappCountryCode = "+52" | "+1";

export interface LeadAnswer {
  questionId: string;
  question: string;
  optionIds: string[];
  /** Con "Otro" marcado, su etiqueta queda como "Otro: {texto}". */
  labels: string[];
  /** Lo que escribió en "Otro (escribe cuál)". */
  otherText?: string;
}

export type LeadBooking = {
  uid: string;
  startTime: Date;
  endTime: Date;
  /** Enlace de la videollamada (Teams) que devuelve Cal.com; null si no lo trajo. */
  meetingUrl?: string | null;
} | null;

export interface LeadUtm {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  fbclid?: string;
}

export interface Lead {
  id: string;
  formId: string;
  /** País de la landing ("mx" o "us"). Los leads anteriores no lo tienen: son de México. */
  market: MarketId;
  status: LeadStatus;
  nombre: string;
  whatsappCountryCode: WhatsappCountryCode;
  whatsappNumber: string;
  email: string;
  clinica: string;
  ciudad: string;
  answers: LeadAnswer[];
  consentConfirmacion: boolean;
  consentMarketing: boolean;
  utm: LeadUtm;
  confirmationCode: string;
  booking: LeadBooking;
  /** Zona horaria en la que el visitante vio y eligió su horario. */
  timeZone: string;
  /** Lo marca el equipo a mano desde el admin; las pruebas no cuentan en resumen, Origen ni CSV. */
  isTest: boolean;
  statusHistory: LeadStatusChange[];
  statusUpdatedAt?: Date;
  adminNote?: string;
  adminNoteUpdatedAt?: Date;
  adminNoteUpdatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateLeadInput = Omit<
  Lead,
  | "id"
  | "status"
  | "confirmationCode"
  | "booking"
  | "isTest"
  | "statusHistory"
  | "statusUpdatedAt"
  | "adminNote"
  | "adminNoteUpdatedAt"
  | "adminNoteUpdatedBy"
  | "createdAt"
  | "updatedAt"
>;
