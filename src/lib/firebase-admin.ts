import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function parsePrivateKey(): string | undefined {
  const base64Key = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64;

  if (!base64Key) {
    return undefined;
  }

  return Buffer.from(base64Key, "base64").toString("utf-8").trim();
}

const adminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: parsePrivateKey(),
};

const adminApp = !getApps().length
  ? initializeApp({ credential: cert(adminConfig) })
  : getApp();

const adminDb = getFirestore(adminApp);

export { adminApp, adminDb };
