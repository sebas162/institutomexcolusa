import type { Metadata } from "next";
import AgendaClient from "./AgendaClient";

export const metadata: Metadata = {
  title: "Elige tu horario | Instituto Mex-Col-USA",
};

export default function Page() {
  return <AgendaClient />;
}
