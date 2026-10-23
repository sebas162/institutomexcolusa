import type { ReactNode } from "react";
import DiagnosticoShell from "../_flow/DiagnosticoShell";

// Landing de USA.
export default function Layout({ children }: { children: ReactNode }) {
  return <DiagnosticoShell marketId="us">{children}</DiagnosticoShell>;
}
