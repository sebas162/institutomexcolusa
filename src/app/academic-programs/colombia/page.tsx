import type { Metadata } from "next";
import ColombiaClient from "./ColombiaClient";

export const metadata: Metadata = {
  title: "Cursos de Medicina Estética en Colombia | Instituto Mex-Col-USA",
  description:
    "Formación profesional en medicina estética, lifting facial, suero terapia y armonización facial en Colombia. Certificación internacional.",
  alternates: {
    canonical: "https://www.institutomexcolusa.com/academic-programs/colombia/",
  },
};

export default function Page() {
  return <ColombiaClient />;
}
