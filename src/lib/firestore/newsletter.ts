import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import type { NewsletterSubscriber } from "@/types/blog";

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

export async function getNewsletterSubscribers(): Promise<
  NewsletterSubscriber[]
> {
  try {
    const subscribersRef = collection(db, NEWSLETTER_COLLECTION);
    const q = query(subscribersRef, orderBy("subscribedAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        email: data.email,
        language: data.language,
        subscribedAt:
          data.subscribedAt instanceof Timestamp
            ? data.subscribedAt.toDate()
            : new Date(0),
      };
    });
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return [];
  }
}
