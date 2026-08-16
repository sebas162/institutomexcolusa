import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createHash } from "crypto";

function parsePrivateKey(): string | undefined {
  const base64Key = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64;

  if (!base64Key) {
    return undefined;
  }

  const decoded = Buffer.from(base64Key, "base64").toString("utf-8").trim();

  const hash = createHash('sha256').update(decoded).digest('hex').slice(0, 16);
  console.log('DEBUG_KEY_HASH_LOCAL:', hash);

  return decoded;
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
