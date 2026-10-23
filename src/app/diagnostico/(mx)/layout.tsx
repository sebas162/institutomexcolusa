import type { ReactNode } from "react";
import DiagnosticoShell from "../_flow/DiagnosticoShell";

// Landing de México.
export default function Layout({ children }: { children: ReactNode }) {
  return <DiagnosticoShell marketId="mx">{children}</DiagnosticoShell>;
}
