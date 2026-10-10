import { AlertTriangle, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { DIAGNOSTICO_CONTENT } from "@/lib/diagnostico/content";
import { formatSlotLabel, getTimeZoneLabel, type Slot } from "@/lib/diagnostico/slots";
import { FeaturedTestimonial } from "./Testimonials";
import LandingLogo from "./LandingLogo";

interface ConfirmScreenProps {
  slot: Slot;
  timeZone: string;
  /** null tras recargar la página: el teléfono no se guarda en el navegador. */
  phoneLabel: string | null;
  confirmationCode: string;
  onFixPhone: () => void;
}

const STEPS = [
  <>
    Toca <strong>Confirmar mi cita por WhatsApp</strong> y envía el mensaje que aparece escrito.
  </>,
  <>
    Revisa tu <strong>correo</strong>: ahí tienes los detalles y el enlace de la videollamada.
  </>,
  <>
    Te recordamos por correo <strong>24 horas</strong> y <strong>1 hora</strong> antes, y por{" "}
    <strong>WhatsApp el día de tu cita</strong>.
  </>,
];

export default function ConfirmScreen({
  slot,
  timeZone,
  phoneLabel,
  confirmationCode,
  onFixPhone,
}: ConfirmScreenProps) {
  const { whatsappNumber, featuredTestimonial } = DIAGNOSTICO_CONTENT;
  const message = `CONFIRMO mi cita #${confirmationCode}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <div className="flex items-center justify-center gap-2.5 bg-[#B45309] px-4 py-3.5 text-center text-[13px] font-bold uppercase tracking-[0.1em] text-white">
        <AlertTriangle aria-hidden="true" strokeWidth={2.2} className="h-[18px] w-[18px] shrink-0" />
        Espera: tu cita aún no está confirmada
      </div>

      <section className="flex justify-center bg-primary px-4 pb-16 pt-12 text-white">
        <div className="flex w-full max-w-[760px] flex-col items-center gap-5 text-center">
          <LandingLogo size="md" />
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-secondary">
            Tu llamada quedó agendada
          </span>
          <h1 className="text-[clamp(32px,5vw,54px)] font-extrabold leading-[1.12] tracking-[-0.02em]">
            Un paso más:{" "}
            <span className="mt-1 inline-block rounded-[0.3em] bg-white px-[0.28em] text-primary">
              confirma tu cita
            </span>
          </h1>
          <p className="text-lg leading-relaxed text-white/90">
            Confírmala por WhatsApp en un toque. Si no confirmas, el espacio se libera para otra
            clínica.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[60px] w-full max-w-[460px] items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 text-lg font-extrabold text-[#0A1416] transition-colors hover:bg-[#20BA5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <FaWhatsapp aria-hidden="true" className="h-6 w-6" />
            Confirmar mi cita por WhatsApp
          </a>
          <span className="max-w-[460px] text-sm leading-normal text-white/80">
            Se abrirá WhatsApp con el mensaje listo: “{message}”. Solo toca enviar.
          </span>

          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[18px] rounded-[20px] bg-white px-6 py-[22px] text-left text-foreground">
            <div className="flex flex-col gap-1">
              <span className="text-[13px] text-muted-foreground">Fecha y hora</span>
              <strong className="text-[17px] text-primary">{formatSlotLabel(slot, timeZone)}</strong>
              <span className="text-[13px] text-muted-foreground">
                {getTimeZoneLabel(timeZone)} · 15 min
              </span>
            </div>
            {phoneLabel && (
              <div className="flex flex-col gap-1">
                <span className="text-[13px] text-muted-foreground">Confirma desde tu número</span>
                <strong className="text-[17px] text-primary">{phoneLabel}</strong>
                {/* TODO Fase 4: actualizar el número del lead ya guardado al corregirlo. */}
                <button
                  type="button"
                  onClick={onFixPhone}
                  className="min-h-11 self-start rounded text-sm font-bold text-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  ¿No es tu número? Corrígelo
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="flex justify-center px-4 pb-[72px] pt-14">
        <div className="flex w-full max-w-[760px] flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-center text-[clamp(24px,3.4vw,32px)] font-extrabold text-primary">
              Cómo confirmar tu cita
            </h2>
            <div className="flex items-start gap-3.5 rounded-2xl bg-secondary px-5 py-[18px] text-[15px] leading-[1.55] text-secondary-foreground">
              <Mail aria-hidden="true" className="mt-px h-[22px] w-[22px] shrink-0" />
              <span>
                <strong>¿No ves el correo?</strong> Revisa tu carpeta de spam o promociones.
              </span>
            </div>
            <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3">
              {STEPS.map((step, index) => (
                <li
                  key={index}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground"
                  >
                    {index + 1}
                  </span>
                  <span className="text-[15px] leading-[1.55]">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-3 rounded-[20px] border border-border bg-white p-7">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-primary">
              Qué va a pasar en la llamada
            </h2>
            <p className="text-[17px] leading-[1.65] text-foreground">
              15 minutos para conocer tu clínica: qué tienes en regla, qué te falta y en qué
              necesitas apoyo. Si tiene sentido para ambos, te proponemos el siguiente paso.
            </p>
          </div>

          <FeaturedTestimonial
            eyebrow="Así le fue a otro dueño de clínica"
            testimonial={featuredTestimonial}
          />
        </div>
      </section>
    </>
  );
}
