import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function parsePrivateKey(rawKey: string | undefined): string | undefined {
  if (!rawKey) {
    return undefined;
  }

  let key = rawKey;

  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }

  return key.replace(/\\n/g, "\n").trim();
}

const adminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: parsePrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY),
};

const adminApp = !getApps().length
  ? initializeApp({ credential: cert(adminConfig) })
  : getApp();

const adminDb = getFirestore(adminApp);

export { adminApp, adminDb };
