import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

export async function uploadPdf(file: File): Promise<string> {
  if (file.type !== "application/pdf") {
    throw new Error("The file must be a PDF.");
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    throw new Error("The PDF must be smaller than 10MB.");
  }

  try {
    const storage = getStorage();
    const storageRef = ref(storage, `blog-pdfs/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw new Error("Failed to upload PDF.");
  }
}
