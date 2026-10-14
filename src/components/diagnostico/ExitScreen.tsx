import { Heart } from "lucide-react";
import LandingLogo from "./LandingLogo";

export default function ExitScreen() {
  return (
    <section className="flex min-h-[640px] flex-grow items-center justify-center bg-white px-4 py-12 text-foreground">
      <div className="flex max-w-[560px] flex-col items-center gap-[22px] text-center">
        <LandingLogo size="md" tone="green" />
        <div
          aria-hidden="true"
          className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-secondary text-primary"
        >
          <Heart className="h-[34px] w-[34px]" />
        </div>
        <h1 className="text-[clamp(28px,4.6vw,44px)] font-extrabold leading-[1.15]">
          Gracias por tu interés en nosotros
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Cuando estés listo para iniciar tu proyecto, aquí te estaremos esperando.
        </p>
      </div>
    </section>
  );
}
