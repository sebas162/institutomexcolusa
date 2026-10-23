import type { Metadata } from "next";
import GraciasClient from "../../_flow/GraciasClient";

export const metadata: Metadata = {
  title: "Gracias por tu interés | Instituto Mex-Col-USA",
};

export default function Page() {
  return <GraciasClient />;
}
