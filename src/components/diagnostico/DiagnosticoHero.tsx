"use client";

import { ArrowRight } from "lucide-react";
import { DIAGNOSTICO_CONTENT } from "@/lib/diagnostico/content";
import LandingLogo from "./LandingLogo";
import ServiceCards from "./ServiceCards";
import VideoFrame from "./VideoFrame";

export default function DiagnosticoHero() {
  const { hero, topBanner, services, heroVideoUrl } = DIAGNOSTICO_CONTENT;

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
      <div className="bg-secondary px-4 py-3 text-center text-xs font-bold uppercase leading-normal tracking-[0.12em] text-secondary-foreground">
        {topBanner}
      </div>

      <section className="flex flex-col items-center bg-primary px-4 pb-[72px] pt-7 text-white">
        <div className="flex w-full max-w-[920px] flex-col items-center gap-7">
          <LandingLogo size="lg" />

          <div className="flex flex-col items-center gap-5 text-center">
            <span className="rounded-full border border-white/30 px-4 py-2 text-[13px] font-semibold text-secondary">
              {hero.badge}
            </span>
            <h1 className="max-w-[880px] text-[clamp(32px,5.4vw,60px)] font-extrabold leading-[1.12] tracking-[-0.02em]">
              {hero.titleStart}{" "}
              <span className="mt-1 inline-block rounded-[0.3em] bg-white px-[0.28em] text-primary">
                {hero.titleHighlight}
              </span>
            </h1>
            <p className="max-w-[700px] text-[clamp(16px,2vw,19px)] leading-relaxed text-white/90">
              {hero.subtitle}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap rounded-lg bg-secondary px-3.5 py-[7px] text-xs font-bold uppercase tracking-[0.1em] text-primary">
                {hero.stepLabel}
              </span>
              <span aria-hidden="true" className="h-px flex-grow bg-white/20" />
            </div>
            <VideoFrame url={heroVideoUrl} title="Video del especialista" surface="dark" />
          </div>

          <div className="flex w-full flex-col items-center gap-3">
            <button
              type="button"
              onClick={scrollToQualify}
              className="inline-flex min-h-[58px] w-full max-w-[440px] items-center justify-center gap-2.5 rounded-full bg-white px-9 text-lg font-bold text-primary transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              {hero.cta}
              <ArrowRight aria-hidden="true" strokeWidth={2.2} className="h-5 w-5" />
            </button>
            <div className="text-center text-sm text-white/80">{hero.ctaNote}</div>
          </div>

          <ServiceCards services={services} />
        </div>
      </section>
    </>
  );
}
