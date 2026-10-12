// Lectura y cambios manuales de leads desde el panel de admin (SDK de cliente).
// firestore.rules solo deja leer al admin y solo estos campos: estado manual, nota, prueba e historial.

import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Lead, LeadStatus, LeadStatusChange } from "@/types/lead";

const LEADS_COLLECTION = "leads";

/** Estados que el equipo puede poner a mano; los demás los pone la landing, el webhook o la ruta API. */
export const MANUAL_LEAD_STATUSES = ["agendada", "confirmada", "asistio", "no_asistio"] as const;
export type ManualLeadStatus = (typeof MANUAL_LEAD_STATUSES)[number];

function toDate(value: unknown): Date | undefined {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return undefined;
}

function toLead(id: string, data: DocumentData): Lead {
  return {
    id,
    formId: data.formId,
    status: data.status as LeadStatus,
    nombre: data.nombre ?? "",
    whatsappCountryCode: data.whatsappCountryCode,
    whatsappNumber: data.whatsappNumber ?? "",
    email: data.email ?? "",
    clinica: data.clinica ?? "",
    ciudad: data.ciudad ?? "",
    answers: data.answers ?? [],
    consentConfirmacion: Boolean(data.consentConfirmacion),
    consentMarketing: Boolean(data.consentMarketing),
    utm: data.utm ?? {},
    confirmationCode: data.confirmationCode ?? "",
    booking: data.booking
      ? {
          uid: data.booking.uid,
          startTime: toDate(data.booking.startTime) ?? new Date(NaN),
          endTime: toDate(data.booking.endTime) ?? new Date(NaN),
          meetingUrl: data.booking.meetingUrl ?? null,
        }
      : null,
    timeZone: data.timeZone ?? "",
    isTest: Boolean(data.isTest),
    statusHistory: ((data.statusHistory ?? []) as DocumentData[]).map(
      (change): LeadStatusChange => ({
        status: change.status,
        at: toDate(change.at) ?? new Date(NaN),
        source: change.source,
        email: change.email ?? null,
        ...(change.note ? { note: change.note } : {}),
      })
    ),
    statusUpdatedAt: toDate(data.statusUpdatedAt),
    adminNote: data.adminNote ?? "",
    adminNoteUpdatedAt: toDate(data.adminNoteUpdatedAt),
    adminNoteUpdatedBy: data.adminNoteUpdatedBy,
    createdAt: toDate(data.createdAt) ?? new Date(NaN),
    updatedAt: toDate(data.updatedAt) ?? new Date(NaN),
  };
}

/** Todos los leads en tiempo real. Con cientos de leads basta filtrar y ordenar en el cliente. */
export function subscribeLeads(
  onLeads: (leads: Lead[]) => void,
  onError: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, LEADS_COLLECTION),
    (snapshot) => onLeads(snapshot.docs.map((d) => toLead(d.id, d.data()))),
    onError
  );
}

export async function updateLeadStatus(
  leadId: string,
  status: ManualLeadStatus,
  email: string | null
): Promise<void> {
  const now = Timestamp.now();
  await updateDoc(doc(db, LEADS_COLLECTION, leadId), {
    status,
    statusHistory: arrayUnion({ status, at: now, source: "admin", email }),
    statusUpdatedAt: now,
    updatedAt: now,
  });
}

export async function updateLeadNote(
  leadId: string,
  note: string,
  email: string | null
): Promise<void> {
  const now = Timestamp.now();
  await updateDoc(doc(db, LEADS_COLLECTION, leadId), {
    adminNote: note,
    adminNoteUpdatedAt: now,
    adminNoteUpdatedBy: email ?? "",
    updatedAt: now,
  });
}

export async function setLeadTest(leadId: string, isTest: boolean): Promise<void> {
  await updateDoc(doc(db, LEADS_COLLECTION, leadId), {
    isTest,
    updatedAt: Timestamp.now(),
  });
}
