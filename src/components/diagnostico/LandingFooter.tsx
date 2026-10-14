import Link from "next/link";
import { DIAGNOSTICO_CONTENT } from "@/lib/diagnostico/content";
import { MARKET } from "@/lib/diagnostico/market";

export default function LandingFooter() {
  return (
    <footer className="flex justify-center bg-[#0A1416] px-4 py-8 text-[13px] leading-relaxed text-white/70">
      <div className="flex w-full max-w-[920px] flex-col items-center gap-2 text-center">
        <span className="font-semibold text-white/90">
          {DIAGNOSTICO_CONTENT.brandName} · © {new Date().getFullYear()}
        </span>
        <Link
          href={MARKET.privacyUrl}
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
