import { randomInt } from "crypto";
import { FieldValue, Timestamp, type DocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import type {
  CreateLeadInput,
  LeadBooking,
  LeadStatus,
  LeadStatusSource,
} from "@/types/lead";

const LEADS_COLLECTION = "leads";

const CONFIRMATION_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CONFIRMATION_CODE_LENGTH = 4;

function generateConfirmationCode(): string {
  let code = "";

  for (let i = 0; i < CONFIRMATION_CODE_LENGTH; i++) {
    code += CONFIRMATION_CODE_ALPHABET[randomInt(CONFIRMATION_CODE_ALPHABET.length)];
  }

  return code;
}

export async function createLeadAdmin(
  input: CreateLeadInput
): Promise<{ id: string; confirmationCode: string }> {
  try {
    const now = Timestamp.now();
    const confirmationCode = generateConfirmationCode();

    const docRef = await adminDb.collection(LEADS_COLLECTION).add({
      ...input,
      status: "nuevo",
      confirmationCode,
      booking: null,
      isTest: false,
      statusHistory: [{ status: "nuevo", at: now, source: "landing", email: null }],
      statusUpdatedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return { id: docRef.id, confirmationCode };
  } catch (error) {
    console.error("Error creating lead (admin):", error);
    throw error;
  }
}

/** Lo que necesitan la ruta de reservas y el webhook para decidir qué hacer con un lead. */
export interface LeadBookingState {
  id: string;
  status: LeadStatus;
  confirmationCode: string;
  booking: LeadBooking;
  isTest: boolean;
}

function toDate(value: unknown): Date {
  return value instanceof Timestamp ? value.toDate() : new Date(String(value));
}

function toLeadBookingState(doc: DocumentSnapshot): LeadBookingState | null {
  const data = doc.data();
  if (!data) return null;

  return {
    id: doc.id,
    status: data.status,
    confirmationCode: data.confirmationCode,
    isTest: Boolean(data.isTest),
    booking: data.booking
      ? {
          uid: data.booking.uid,
          startTime: toDate(data.booking.startTime),
          endTime: toDate(data.booking.endTime),
          meetingUrl: data.booking.meetingUrl ?? null,
        }
      : null,
  };
}

export async function getLeadAdmin(id: string): Promise<LeadBookingState | null> {
  try {
    const doc = await adminDb.collection(LEADS_COLLECTION).doc(id).get();
    return toLeadBookingState(doc);
  } catch (error) {
    console.error("Error getting lead (admin):", error);
    throw error;
  }
}

export async function findLeadByBookingUidAdmin(uid: string): Promise<LeadBookingState | null> {
  try {
    const snapshot = await adminDb
      .collection(LEADS_COLLECTION)
      .where("booking.uid", "==", uid)
      .limit(1)
      .get();

    return snapshot.empty ? null : toLeadBookingState(snapshot.docs[0]);
  } catch (error) {
    console.error("Error finding lead by booking uid (admin):", error);
    throw error;
  }
}

/** Cambia estado y reserva, y agrega el cambio al historial con quién lo hizo. */
/** Leads con cita desde `from` en adelante (consulta de un solo campo: no necesita índice). */
export async function listLeadsWithBookingSinceAdmin(from: Date): Promise<LeadBookingState[]> {
  try {
    const snapshot = await adminDb
      .collection(LEADS_COLLECTION)
      .where("booking.startTime", ">=", Timestamp.fromDate(from))
      .get();

    return snapshot.docs
      .map(toLeadBookingState)
      .filter((lead): lead is LeadBookingState => lead !== null);
  } catch (error) {
    console.error("Error listing leads with booking (admin):", error);
    throw error;
  }
}

export async function updateLeadBookingAdmin(
  id: string,
  update: {
    status: LeadStatus;
    booking?: LeadBooking;
    timeZone?: string;
    source: LeadStatusSource;
    /** Correo de la sesión del admin; null para la landing y el webhook. */
    email?: string | null;
    note?: string;
  }
): Promise<void> {
  try {
    const now = Timestamp.now();
    await adminDb
      .collection(LEADS_COLLECTION)
      .doc(id)
      .update({
        status: update.status,
        ...(update.booking !== undefined ? { booking: update.booking } : {}),
        ...(update.timeZone !== undefined ? { timeZone: update.timeZone } : {}),
        statusHistory: FieldValue.arrayUnion({
          status: update.status,
          at: now,
          source: update.source,
          email: update.email ?? null,
          ...(update.note ? { note: update.note } : {}),
        }),
        statusUpdatedAt: now,
        updatedAt: now,
      });
  } catch (error) {
    console.error("Error updating lead booking (admin):", error);
    throw error;
  }
}

/** Reintento de reserva: el visitante pudo corregir sus datos antes de elegir otro horario. */
export async function updateLeadInputAdmin(id: string, input: CreateLeadInput): Promise<void> {
  try {
    await adminDb
      .collection(LEADS_COLLECTION)
      .doc(id)
      .update({ ...input, updatedAt: Timestamp.now() });
  } catch (error) {
    console.error("Error updating lead input (admin):", error);
    throw error;
  }
}
