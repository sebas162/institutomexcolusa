import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.institutomexcolusa.com/about/",
  },
};

export default function Page() {
  return <AboutClient />;
}
