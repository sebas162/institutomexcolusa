"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { getPostBySlug } from "@/lib/firestore/posts";
import PostBody from "@/components/blog/PostBody";
import type { Post } from "@/types/blog";

type Lang = "es" | "en";

const notFoundText: Record<Lang, string> = {
  es: "No pudimos encontrar este artículo.",
  en: "We couldn't find this article.",
};

const backToBlogText: Record<Lang, string> = {
  es: "Volver al blog",
  en: "Back to blog",
};

interface BlogPostClientProps {
  slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const { language } = useLanguage();
  const lang: Lang = language === "es" ? "es" : "en";

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getPostBySlug(slug).then((fetchedPost) => {
      if (isMounted) {
        setPost(fetchedPost);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <p className="text-muted-foreground">...</p>
      </div>
    );
  }

  const isVisible = post && post.status === "published";

  if (!isVisible) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <p className="text-lg text-muted-foreground mb-6">
          {notFoundText[lang]}
        </p>
        <Link href="/blog" className="text-primary underline">
          {backToBlogText[lang]}
        </Link>
      </div>
    );
  }

  const content = post[lang];
  const publishDate = post.publishAt ?? post.createdAt;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pb-16 pt-20 max-w-4xl">
        <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden mb-10">
          <Image
            src={post.coverImage}
            alt={content.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {content.title}
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          {publishDate.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <PostBody html={content.content} />

        {post.youtubeVideoId && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mt-10 mb-10">
            <iframe
              src={`https://www.youtube.com/embed/${post.youtubeVideoId}`}
              title={content.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {content.images && content.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
            {content.images.map((image, index) => (
              <div
                key={index}
                className="relative h-48 w-full rounded-lg overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`${content.title} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
