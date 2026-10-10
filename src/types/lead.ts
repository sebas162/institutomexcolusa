export type LeadStatus =
  | "nuevo"
  | "agendada"
  | "confirmada"
  | "recordada"
  | "asistio"
  | "no_asistio"
  | "cancelada";

export type WhatsappCountryCode = "+52" | "+1";

export interface LeadAnswer {
  questionId: string;
  question: string;
  optionIds: string[];
  labels: string[];
}

export type LeadBooking = {
  uid: string;
  startTime: Date;
  endTime: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

export type CreateLeadInput = Omit<
  Lead,
  "id" | "status" | "confirmationCode" | "booking" | "createdAt" | "updatedAt"
>;
