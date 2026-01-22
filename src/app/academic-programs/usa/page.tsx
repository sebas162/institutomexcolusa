import type { Metadata } from "next";
import USAClient from "./USAClient";

export const metadata: Metadata = {
  title: "Medical Aesthetic Training in USA | Mex-Col-USA Institute",
  description:
    "Professional aesthetic medicine courses in the USA: non-surgical facelift, serotherapy, facial harmonization. International certification.",
  alternates: {
    canonical: "https://www.institutomexcolusa.com/academic-programs/usa/",
  },
};

export default function Page() {
  return <USAClient />;
}
