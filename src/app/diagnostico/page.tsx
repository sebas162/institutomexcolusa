import type { Metadata } from "next";
import DiagnosticoClient from "./DiagnosticoClient";

export const metadata: Metadata = {
  title: "Llamada diagnóstico gratuita | Instituto Mex-Col-USA",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DiagnosticoClient />;
}
