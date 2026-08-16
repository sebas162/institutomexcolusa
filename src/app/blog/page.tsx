import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog | Instituto Mex-Col-USA - Medicina Estética",
  description:
    "Noticias, artículos y novedades del Instituto Mex-Col-USA sobre medicina estética, formación profesional y eventos.",
  alternates: {
    canonical: "https://www.institutomexcolusa.com/blog/",
  },
};

export default function Page() {
  return <BlogClient />;
}
