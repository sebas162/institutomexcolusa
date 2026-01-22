import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contacto | Instituto Mex-Col-USA - Formación Médica",
  description:
    "Ponte en contacto con Instituto Mex-Col-USA. Ubicaciones en USA, México y Colombia. Consultas sobre cursos y formación en medicina estética.",
  alternates: {
    canonical: "https://www.institutomexcolusa.com/contact/",
  },
};

export default function Page() {
  return <ContactClient />;
}
