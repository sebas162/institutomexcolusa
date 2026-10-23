import type { Metadata } from "next";
import DiagnosticoClient from "../_flow/DiagnosticoClient";

export const metadata: Metadata = {
  title: "Llamada diagnóstico gratuita | Instituto Mex-Col-USA",
};

export default function Page() {
  return <DiagnosticoClient />;
}
