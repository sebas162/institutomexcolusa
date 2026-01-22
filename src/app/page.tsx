import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.institutomexcolusa.com/",
  },
};

export default function Page() {
  return <HomeClient />;
}
