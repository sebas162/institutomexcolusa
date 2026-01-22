import type { Metadata } from "next";
import StaffClient from "./StaffClient";

export const metadata: Metadata = {
  title: "Directores y Staff Médico | Instituto Mex-Col-USA",
  description:
    "Equipo de directores y profesionales médicos expertos en medicina estética del Instituto Mex-Col-USA en USA, México y Colombia.",
  alternates: {
    canonical: "https://www.institutomexcolusa.com/staff/",
  },
};

export default function Page() {
  return <StaffClient />;
}
