import imageCompression from "browser-image-compression";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadContentImage(file: File): Promise<string> {
  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: "image/webp",
    });

    const storage = getStorage();
    const storageRef = ref(
      storage,
      `blog-content-images/${Date.now()}_${file.name}.webp`
    );
    const snapshot = await uploadBytes(storageRef, compressedFile);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading content image:", error);
    throw new Error("Failed to upload content image.");
  }
}
