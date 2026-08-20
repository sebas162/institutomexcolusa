"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/use-language";
import { translations } from "@/lib/i18n";
import { getPublishedPosts } from "@/lib/firestore/posts";
import NewsletterSection from "@/components/blog/NewsletterSection";
import type { Post } from "@/types/blog";
import HeroBlog from "@/assets/img-heros/hero-blog.webp";
import LogoUSAVerde from "@/assets/logo-sello-blanco2.png";

export default function BlogClient() {
  const { language } = useLanguage();
  const t = translations[language].blog;
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getPublishedPosts().then((fetchedPosts) => {
      if (isMounted) {
        setPosts(fetchedPosts);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-background">
      <section className="relative w-full section-modern min-h-[500px] sm:min-h-[600px] md:h-screen -mt-16">
        <div className="absolute inset-0">
          <Image
            src={HeroBlog}
            alt="Blog"
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col">
          <div className="flex items-start justify-end pt-20 md:pt-24 lg:pt-28">
            <div className="relative w-20 h-20 mt-12 md:w-32 md:h-32 lg:w-36 lg:h-36">
              <Image
                src={LogoUSAVerde}
                alt="Instituto MexCol USA Logo"
                fill
                className="object-contain drop-shadow-2xl"
                loading="lazy"
                sizes="(max-width: 768px) 80px, 128px"
              />
            </div>
          </div>
          <div className="mt-60 md:mt-auto flex flex-col text-white gap-3 pb-6 md:pb-12 lg:pb-16 ml-5">
            <div className="flex flex-col gap-3 w-full px-4 sm:px-6 md:px-0 md:max-w-3xl">
              <h1 className="font-headline text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-balance">
                {t.pageTitle}
              </h1>
              <p className="text-white/90 text-base md:text-lg">
                {t.pageSubtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-10 pt-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-full flex flex-col overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full mt-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            {t.emptyState}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const content = post[language];
              const date = post.publishAt ?? post.createdAt;
              return (
                <Card
                  key={post.id}
                  className="h-full flex flex-col overflow-hidden group"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={content.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline">
                      {content.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-2">
                      {date.toLocaleDateString(
                        language === "es" ? "es-ES" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-muted-foreground mb-4">
                      {content.excerpt}
                    </p>
                    <div className="mt-auto">
                      <Button
                        className="w-full btn-modern"
                        onClick={() => router.push(`/blog/${post.slug}`)}
                      >
                        {t.readMore}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-16 max-w-2xl mx-auto">
          <NewsletterSection />
        </div>
      </div>
    </div>
  );
}
