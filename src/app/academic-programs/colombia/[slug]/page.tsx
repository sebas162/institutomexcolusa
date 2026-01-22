import ClientPage from "./ClientPage";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    alternates: {
      canonical: `https://www.institutomexcolusa.com/academic-programs/colombia/${slug}`,
    },
  };
}
export async function generateStaticParams() {
  return [
    { slug: "master-class-facial-modeling" },
    { slug: "intravenous-therapy-online" },
    { slug: "mini-lifting-colombia" },
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
