import type { Metadata } from "next";
import OnlineTrainingClient from "./OnlineTrainingClient";

export const metadata: Metadata = {
  title: "Formación Online en Medicina Estética | Instituto Mex-Col-USA",
  description:
    "Cursos online en medicina estética, lifting facial, suero terapia e inyectología. Certificación profesional internacional desde casa.",
  alternates: {
    canonical: "https://www.institutomexcolusa.com/online-training/",
  },
};

export default function Page() {
  return <OnlineTrainingClient />;
}
