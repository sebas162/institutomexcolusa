import { randomInt } from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import type { CreateLeadInput } from "@/types/lead";

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
      createdAt: now,
      updatedAt: now,
    });

    return { id: docRef.id, confirmationCode };
  } catch (error) {
    console.error("Error creating lead (admin):", error);
    throw error;
  }
}
