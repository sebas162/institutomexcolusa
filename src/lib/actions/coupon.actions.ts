// NOTA: 'use server' comentado para permitir static export
// Si necesitas funcionalidad server-side, considera usar API routes externas
// 'use server';

import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { revalidatePath } from 'next/cache'; // No compatible con static export
// import { redirect } from 'next/navigation'; // No compatible con static export
import { z } from "zod";
import { translations } from "@/lib/i18n";

export async function validateCoupon(formData: FormData) {
  const couponCode = formData.get("coupon") as string;
  const lang = (formData.get("language") as "en" | "es") || "en";
  const t = translations[lang].coupon.errors;

  if (!couponCode) {
    return { error: t.empty };
  }

  try {
    const couponsRef = collection(db, "coupons");
    const q = query(
      couponsRef,
      where("code", "==", couponCode.trim()),
      where("isActive", "==", true)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { error: t.invalid };
    }

    const couponDoc = querySnapshot.docs[0];
    const couponData = couponDoc.data();

    const now = new Date();
    const createdAt = couponData.createdAt.toDate();
    const durationDays = couponData.durationDays;
    const expiryDate = new Date(createdAt);
    expiryDate.setDate(expiryDate.getDate() + durationDays);

    if (now > expiryDate) {
      await updateDoc(doc(db, "coupons", couponDoc.id), { isActive: false });
      return { error: t.expired };
    }
  } catch (error) {
    console.error("Error validating coupon:", error);
    return { error: t.unexpected };
  }

  // En lugar de redirect, retornamos la URL para que el cliente navegue
  return {
    success: true,
    redirectUrl: `/class/special?code=${couponCode.trim()}`,
  };
}

const ManualCouponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters long."),
  duration: z.enum(["15", "30"]),
  videoSourceType: z.enum(["upload", "youtube"]),
  videoFile: z.any().optional(),
  youtubeLink: z.string().optional(),
});

export async function createManualCoupon(formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = ManualCouponSchema.parse(data);

    const { code, duration, videoSourceType, videoFile, youtubeLink } =
      validatedData;
    const durationDays = parseInt(duration, 10);

    const couponsRef = collection(db, "coupons");
    const q = query(couponsRef, where("code", "==", code.trim()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { error: `Coupon code "${code}" already exists.` };
    }

    let videoUrl = "";
    let videoType = videoSourceType;

    if (videoSourceType === "upload" && videoFile instanceof File) {
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `coupon-videos/${Date.now()}_${videoFile.name}`
      );
      const snapshot = await uploadBytes(storageRef, videoFile);
      videoUrl = await getDownloadURL(snapshot.ref);
    } else if (
      videoSourceType === "youtube" &&
      typeof youtubeLink === "string"
    ) {
      videoUrl = youtubeLink;
    }

    await addDoc(collection(db, "coupons"), {
      code: code.trim(),
      durationDays: durationDays,
      isActive: true,
      createdAt: serverTimestamp(),
      videoUrl: videoUrl,
      videoType: videoType,
    });

    // revalidatePath('/admin/dashboard'); // No compatible con static export
    return { success: `Coupon "${code}" created successfully.` };
  } catch (error) {
    console.error("Error creating manual coupon:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid data provided: " + error.flatten().fieldErrors };
    }
    return { error: "Failed to create coupon." };
  }
}

export async function updateCouponStatus(id: string, isActive: boolean) {
  try {
    const couponRef = doc(db, "coupons", id);
    await updateDoc(couponRef, { isActive });
    // revalidatePath('/admin/dashboard'); // No compatible con static export
    return { success: "Coupon status updated." };
  } catch (error) {
    console.error("Error updating coupon status:", error);
    return { error: "Failed to update coupon status." };
  }
}

export async function deleteCoupon(id: string) {
  try {
    await deleteDoc(doc(db, "coupons", id));
    // revalidatePath('/admin/dashboard'); // No compatible con static export
    return { success: "Coupon deleted." };
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return { error: "Failed to delete coupon." };
  }
}

export async function getCouponVideo(
  code: string
): Promise<{
  videoUrl: string | null;
  videoType: "upload" | "youtube" | null;
  error?: "no-code" | "not-found" | "failed" | "invalid-url";
}> {
  if (!code) {
    return { videoUrl: null, videoType: null, error: "no-code" };
  }

  try {
    const couponsRef = collection(db, "coupons");
    const q = query(couponsRef, where("code", "==", code));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { videoUrl: null, videoType: null, error: "not-found" };
    }

    const couponData = querySnapshot.docs[0].data();
    return {
      videoUrl: couponData.videoUrl || null,
      videoType: couponData.videoType || null,
    };
  } catch (error) {
    console.error("Error fetching coupon video:", error);
    return { videoUrl: null, videoType: null, error: "failed" };
  }
}
