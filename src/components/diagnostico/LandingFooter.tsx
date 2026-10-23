"use client";

import Link from "next/link";
import { useMarket } from "./MarketContext";

export default function LandingFooter() {
  const { content, privacyUrl } = useMarket();

  return (
    <footer className="flex justify-center bg-[#0A1416] px-4 py-8 text-[13px] leading-relaxed text-white/70">
      <div className="flex w-full max-w-[920px] flex-col items-center gap-2 text-center">
        <span className="font-semibold text-white/90">
          {content.brandName} · © {new Date().getFullYear()}
        </span>
        <Link
          href={privacyUrl}
          target="_blank"
          className="text-secondary underline underline-offset-2"
        >
          Aviso de Privacidad
        </Link>
        <span>
          Este sitio no forma parte de Meta Platforms, Inc. ni está respaldado por Facebook o
          Instagram.
        </span>
      </div>
    </footer>
  );
}
