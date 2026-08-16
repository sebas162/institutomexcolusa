// NOTA: 'use server' comentado para permitir static export
// Si necesitas funcionalidad server-side, considera usar API routes externas
// 'use server';

import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import type { Post, PostStatus } from "@/types/blog";

const POSTS_COLLECTION = "posts";

function toDateOrNull(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  return null;
}

function docToPost(
  docSnap: QueryDocumentSnapshot<DocumentData>
): Post {
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

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(postsRef, where("status", "==", "published"));
    const querySnapshot = await getDocs(q);

    const posts = querySnapshot.docs.map(docToPost);

    posts.sort((a, b) => {
      const aDate = a.publishAt ?? a.createdAt;
      const bDate = b.publishAt ?? b.createdAt;
      return bDate.getTime() - aDate.getTime();
    });

    return posts;
  } catch (error) {
    console.error("Error fetching published posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!slug) {
    return null;
  }

  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(postsRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    return docToPost(querySnapshot.docs[0]);
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

export async function getAllPostsForAdmin(): Promise<Post[]> {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docToPost);
  } catch (error) {
    console.error("Error fetching posts for admin:", error);
    return [];
  }
}

export type CreatePostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

export async function createPost(data: CreatePostInput) {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(postsRef, where("slug", "==", data.slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { error: `A post with slug "${data.slug}" already exists.` };
    }

    const docRef = await addDoc(postsRef, {
      slug: data.slug,
      status: data.status,
      publishAt: data.publishAt,
      coverImage: data.coverImage,
      youtubeVideoId: data.youtubeVideoId ?? null,
      es: data.es,
      en: data.en,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // revalidatePath('/blog'); // No compatible con static export
    return { success: "Post created successfully.", id: docRef.id };
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Failed to create post." };
  }
}

export type UpdatePostInput = Partial<
  Omit<Post, "id" | "createdAt" | "updatedAt">
>;

export async function updatePost(id: string, data: UpdatePostInput) {
  try {
    const postRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(postRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    // revalidatePath('/blog'); // No compatible con static export
    return { success: "Post updated successfully." };
  } catch (error) {
    console.error("Error updating post:", error);
    return { error: "Failed to update post." };
  }
}

export async function deletePost(id: string) {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, id));
    // revalidatePath('/blog'); // No compatible con static export
    return { success: "Post deleted." };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { error: "Failed to delete post." };
  }
}
