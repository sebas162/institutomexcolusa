"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import LandingLogo from "./LandingLogo";
import { useMarket } from "./MarketContext";
import VideoFrame from "./VideoFrame";

export default function DiagnosticoHero() {
  const { hero, topBanner, heroVideoUrl } = useMarket().content;
  // Botón y no <a href="#calificar">: RouteProgress inicia su barra con cualquier
  // enlace interno y solo la termina al cambiar de ruta, así que quedaría colgada.
  const scrollToQualify = () => {
    const target = document.getElementById("calificar");
    if (!target) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      <div className="bg-primary px-4 py-2 text-center text-[11px] font-bold uppercase leading-normal tracking-[0.12em] text-primary-foreground md:text-xs">
        {topBanner}
      </div>

      <section className="flex flex-col items-center bg-white px-4 pb-16 pt-7 text-foreground">
        <div className="flex w-full max-w-[920px] flex-col items-center gap-7">
          <LandingLogo size="lg" tone="green" />

          <div className="flex flex-col items-center gap-5 text-center">
            <h1 className="max-w-[900px] text-[clamp(30px,4.8vw,54px)] font-extrabold leading-[1.14] tracking-[-0.02em]">
              {hero.titleStart}{" "}
              <span className="mt-1 inline-block text-primary">{hero.titleHighlight}</span>
            </h1>
            <p className="max-w-[700px] text-[clamp(16px,2vw,19px)] leading-relaxed text-muted-foreground">
              {hero.subtitle}
            </p>
          </div>

          <VideoFrame url={heroVideoUrl} title="Video del especialista" surface="soft" />

          <div className="flex w-full flex-col items-center gap-3">
            <button
              type="button"
              onClick={scrollToQualify}
              className="inline-flex min-h-[58px] w-full max-w-[440px] items-center justify-center gap-2.5 rounded-full bg-primary px-9 text-lg font-bold text-primary-foreground shadow-[0_6px_20px_rgba(40,95,101,0.25)] transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {hero.cta}
              <ArrowRight aria-hidden="true" strokeWidth={2.2} className="h-5 w-5" />
            </button>
            <div className="text-center text-sm text-muted-foreground">{hero.ctaNote}</div>
          </div>

          <p className="flex w-full max-w-[620px] items-start gap-3.5 rounded-2xl border border-border bg-muted px-5 py-4 text-left text-[15px] leading-[1.55] text-foreground">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"
            >
              <ShieldCheck strokeWidth={1.8} className="h-[22px] w-[22px]" />
            </span>
            <span className="self-center">{hero.proof}</span>
          </p>
        </div>
      </section>
    </>
  );
}
