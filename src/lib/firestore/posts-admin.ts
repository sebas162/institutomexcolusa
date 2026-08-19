import { adminDb } from "@/lib/firebase-admin";
import { Timestamp, QueryDocumentSnapshot } from "firebase-admin/firestore";
import type { Post } from "@/types/blog";

const POSTS_COLLECTION = "posts";

function toDateOrNull(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  return null;
}

function docToPost(docSnap: QueryDocumentSnapshot): Post {
  const data = docSnap.data();

  return {
    id: docSnap.id,
    slug: data.slug,
    status: data.status,
    publishAt: toDateOrNull(data.publishAt),
    coverImage: data.coverImage,
    youtubeVideoId: data.youtubeVideoId,
    es: data.es,
    en: data.en,
    createdAt: toDateOrNull(data.createdAt) ?? new Date(0),
    updatedAt: toDateOrNull(data.updatedAt) ?? new Date(0),
  };
}

export async function getPublishedPostsAdmin(): Promise<Post[]> {
  try {
    const querySnapshot = await adminDb
      .collection(POSTS_COLLECTION)
      .where("status", "==", "published")
      .get();

    const posts = querySnapshot.docs.map(docToPost);

    posts.sort((a, b) => {
      const aDate = a.publishAt ?? a.createdAt;
      const bDate = b.publishAt ?? b.createdAt;
      return bDate.getTime() - aDate.getTime();
    });

    return posts;
  } catch (error) {
    console.error("Error fetching published posts (admin):", error);
    return [];
  }
}

export async function getPostBySlugAdmin(slug: string): Promise<Post | null> {
  if (!slug) {
    return null;
  }

  try {
    const querySnapshot = await adminDb
      .collection(POSTS_COLLECTION)
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return null;
    }

    return docToPost(querySnapshot.docs[0]);
  } catch (error) {
    console.error("Error fetching post by slug (admin):", error);
    return null;
  }
}

export async function publishDueScheduledPosts(): Promise<{
  publishedCount: number;
  publishedSlugs: string[];
}> {
  try {
    const now = Timestamp.now();

    const querySnapshot = await adminDb
      .collection(POSTS_COLLECTION)
      .where("status", "==", "scheduled")
      .where("publishAt", "<=", now)
      .get();

    const publishedSlugs: string[] = [];

    for (const docSnap of querySnapshot.docs) {
      await docSnap.ref.update({
        status: "published",
        updatedAt: Timestamp.now(),
      });
      publishedSlugs.push(docSnap.data().slug);
    }

    return { publishedCount: publishedSlugs.length, publishedSlugs };
  } catch (error) {
    console.error("Error publishing due scheduled posts:", error);
    throw error;
  }
}
