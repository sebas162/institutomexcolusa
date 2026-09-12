export type PostStatus = "draft" | "scheduled" | "published";

export interface PostContent {
  title: string;
  excerpt: string;
  content: string;
  images: string[];
}

export interface Post {
  id: string;
  slug: string;
  status: PostStatus;
  publishAt: Date | null;
  coverImage: string;
  youtubeVideoId?: string;
  pdfUrl?: string;
  pdfLabel?: string;
  es: PostContent;
  en: PostContent;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  language: "es" | "en";
  subscribedAt: Date;
}
