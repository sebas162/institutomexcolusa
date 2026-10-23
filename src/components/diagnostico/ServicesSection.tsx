"use client";

import { useMarket } from "./MarketContext";
import ServiceCards from "./ServiceCards";

/** "Un solo equipo…": título, subtítulo, las 4 tarjetas y los tipos de clínica. */
export default function ServicesSection() {
  const { servicesSection, services } = useMarket().content;

  return (
    <section
      aria-labelledby="equipo-titulo"
      className="flex flex-col items-center border-y border-border bg-muted px-4 pb-16 pt-14 text-foreground"
    >
      <div className="flex w-full max-w-[920px] flex-col items-center gap-7">
        <div className="flex max-w-[720px] flex-col items-center gap-3 text-center">
          <h2
            id="equipo-titulo"
            className="text-[clamp(26px,3.6vw,36px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-foreground"
          >
            {servicesSection.title}
          </h2>
          <p className="text-[17px] leading-relaxed text-muted-foreground">
            {servicesSection.subtitle}
          </p>
        </div>

        <ServiceCards services={services} />

        <p className="text-center text-sm font-semibold leading-relaxed text-primary">
          {servicesSection.clinicTypes}
        </p>
      </div>
    </section>
  );
}
