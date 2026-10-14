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
      <div className="bg-primary px-4 py-2 text-center text-[11px] font-bold uppercase leading-normal tracking-[0.12em] text-primary-foreground md:text-xs">
        {topBanner}
      </div>

      <section
        className="flex flex-col items-center border-b border-border bg-white px-4 pb-[72px] pt-7 text-foreground"
      >
        <div className="flex w-full max-w-[920px] flex-col items-center gap-7">
          <LandingLogo size="lg" tone="green" />

          <div className="flex flex-col items-center gap-5 text-center">
            <span className="rounded-full border border-border bg-muted px-4 py-2 text-[13px] font-semibold text-primary">
              {hero.badge}
            </span>
            <h1 className="max-w-[900px] text-[clamp(30px,4.8vw,54px)] font-extrabold leading-[1.14] tracking-[-0.02em]">
              {hero.titleStart}{" "}
              <span className="mt-1 inline-block text-primary">{hero.titleHighlight}</span>
            </h1>
            <p className="max-w-[700px] text-[clamp(16px,2vw,19px)] leading-relaxed text-muted-foreground">
              {hero.subtitle}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <span
                className="whitespace-nowrap rounded-lg bg-secondary px-3.5 py-[7px] text-xs font-bold uppercase tracking-[0.1em] text-primary"
              >
                {hero.stepLabel}
              </span>
              <span aria-hidden="true" className="h-px flex-grow bg-border" />
            </div>
            <VideoFrame url={heroVideoUrl} title="Video del especialista" surface="soft" />
          </div>

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

          <ServiceCards services={services} />
        </div>
      </section>
    </>
  );
}
