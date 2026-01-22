import type { Metadata } from "next";
import MexicoClient from "./MexicoClient";

export const metadata: Metadata = {
  title: "Cursos de Medicina Estética en México | Instituto Mex-Col-USA",
  description:
    "Programas de formación en medicina estética, mini lifting, suero terapia e inyectología en México con certificación internacional.",
  alternates: {
    canonical: "https://www.institutomexcolusa.com/academic-programs/mexico/",
  },
};

export default function Page() {
  return <MexicoClient />;
}
