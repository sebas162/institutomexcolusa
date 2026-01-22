import ClientPage from "./ClientPage";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    alternates: {
      canonical: `https://www.institutomexcolusa.com/academic-programs/usa/${slug}`,
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
  return <ClientPage slug={slug} />;
}
