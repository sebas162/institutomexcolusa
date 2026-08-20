"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { getPostBySlug } from "@/lib/firestore/posts";
import PostBody from "@/components/blog/PostBody";
import type { Post } from "@/types/blog";
import LogoUSAVerde from "@/assets/logo-sello-blanco2.png";

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
    <div className="bg-background">
      <section className="relative w-full section-modern min-h-[500px] sm:min-h-[600px] md:h-screen -mt-16">
        <div className="absolute inset-0">
          <Image
            src={post.coverImage}
            alt={content.title}
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col">
          <div className="flex items-center justify-between pt-4 md:pt-8 lg:pt-6 pr-4 md:pr-4 lg:pr-6">
            <Button
              asChild
              variant="ghost"
              className="mt-12 text-white hover:text-white hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4" />
                {backToBlogText[lang]}
              </Link>
            </Button>
            <div className="relative w-20 h-20 mt-12 md:w-32 md:h-32 lg:w-36 lg:h-36">
              <Image
                src={LogoUSAVerde}
                alt="Instituto MexCol USA Logo"
                fill
                className="object-contain drop-shadow-2xl mt-6"
                loading="lazy"
                sizes="(max-width: 768px) 80px, 144px"
              />
            </div>
          </div>
          <div className="mt-60 md:mt-auto flex flex-col text-white gap-3 pb-6 md:pb-12 lg:pb-16 ml-5">
            <div className="flex flex-col gap-3 w-full px-4 sm:px-6 md:px-0 md:max-w-3xl">
              <h1 className="font-headline text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-balance">
                {content.title}
              </h1>
              <p className="text-white/90 text-sm md:text-base">
                {publishDate.toLocaleDateString(
                  lang === "es" ? "es-ES" : "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16 pt-12 max-w-4xl">
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
