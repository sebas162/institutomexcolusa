import type { Metadata } from "next";
import AcademicProgramsClient from "./AcademicProgramsClient";
import { translations } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Programas Académicos | Instituto Mex-Col-USA - Medicina Estética",
  description:
    "Formación profesional en medicina estética, lifting facial, suero terapia y flebotomía con certificación internacional en USA, México y Colombia.",
  alternates: {
    canonical: "https://www.institutomexcolusa.com/academic-programs/",
  },
};

export default function Page() {
  return <AcademicProgramsClient />;
}
