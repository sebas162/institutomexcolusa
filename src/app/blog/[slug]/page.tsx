import type { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";
import { getPostBySlugAdmin } from "@/lib/firestore/posts-admin";

type Props = {
  params: Promise<{ slug: string }>;
};

const baseUrl = "https://www.institutomexcolusa.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugAdmin(slug);

  if (!post) {
    return {
      title: "Artículo no encontrado | Instituto Mex-Col-USA",
      description: "El artículo que buscas no está disponible.",
    };
  }

  return {
    title: `${post.es.title} | Instituto Mex-Col-USA`,
    description: post.es.excerpt,
    alternates: {
      canonical: `${baseUrl}/blog/${slug}/`,
    },
    openGraph: {
      title: post.es.title,
      description: post.es.excerpt,
      images: [post.coverImage],
      type: "article",
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlugAdmin(slug);

  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.es.title,
        image: [post.coverImage],
        datePublished: (post.publishAt ?? post.createdAt).toISOString(),
        author: {
          "@type": "Organization",
          name: "Instituto Mex-Col-USA",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogPostClient slug={slug} />
    </>
  );
}
