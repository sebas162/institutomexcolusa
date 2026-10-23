import type { Metadata } from "next";
import type { ReactNode } from "react";

// Páginas de anuncios: ninguna se indexa. El país lo pone el layout de (mx)/ o de usa/.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DiagnosticoLayout({ children }: { children: ReactNode }) {
  return children;
}
