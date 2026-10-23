import type { Metadata } from "next";
import ConfirmacionClient from "../../_flow/ConfirmacionClient";

export const metadata: Metadata = {
  title: "Confirma tu cita | Instituto Mex-Col-USA",
};

export default function Page() {
  return <ConfirmacionClient />;
}
