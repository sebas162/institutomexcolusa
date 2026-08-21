import ClientPage from "./ClientPage";
import type { Metadata } from "next";
import { translations } from "@/lib/i18n";
import { resolveHeroImage } from "@/lib/utils/hero-image-resolver";

type Props = {
  params: Promise<{ slug: string }>;
};

const baseUrl = "https://www.institutomexcolusa.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    alternates: {
      canonical: `${baseUrl}/academic-programs/usa/${slug}`,
    },
  };
}
export async function generateStaticParams() {
  return [
    { slug: "master-class-4-techniques" },
    { slug: "intravenous-therapy-chelation" },
    { slug: "mini-lifting-usa" },
    { slug: "phlebotomy-course" },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const courseDetails = (
    translations.es.academicPrograms.countries.usa.courseDetails as any
  )?.[slug];

  const jsonLd = courseDetails
    ? {
        "@context": "https://schema.org",
        "@type": "Course",
        name: courseDetails.title,
        description: courseDetails.description || courseDetails.subtitle,
        provider: {
          "@type": "Organization",
          name: "Instituto Mex-Col-USA",
          sameAs: "https://www.institutomexcolusa.com/",
        },
        image: `${baseUrl}${resolveHeroImage(slug).src}`,
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Inicio",
              item: `${baseUrl}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Programas Académicos",
              item: `${baseUrl}/academic-programs/`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "USA",
              item: `${baseUrl}/academic-programs/usa/`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: courseDetails.title,
              item: `${baseUrl}/academic-programs/usa/${slug}/`,
            },
          ],
        },
        ...(courseDetails.duration
          ? {
              hasCourseInstance: {
                "@type": "CourseInstance",
                courseWorkload: courseDetails.duration,
              },
            }
          : {}),
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
      <ClientPage slug={slug} />
    </>
  );
}
