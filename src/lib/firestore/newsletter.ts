import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const NEWSLETTER_COLLECTION = "newsletter_subscribers";

export async function subscribeToNewsletter(
  email: string,
  language: "es" | "en"
) {
  try {
    await addDoc(collection(db, NEWSLETTER_COLLECTION), {
      email,
      language,
      subscribedAt: serverTimestamp(),
    });

    return { success: "Subscribed successfully." };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return { error: "Failed to subscribe." };
  }
}
