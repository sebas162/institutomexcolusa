import type { Metadata } from "next";
import CongressClient from "./CongressClient";

export const metadata: Metadata = {
  title: "Congreso Internacional de Medicina Estética | Instituto Mex-Col-USA",
  description:
    "Conferencia y congreso internacional en medicina estética con expertos de USA, México y Colombia. Capacitación profesional certificada.",
  alternates: {
    canonical: "https://www.institutomexcolusa.com/congress/",
  },
};

export default function Page() {
  return <CongressClient />;
}
