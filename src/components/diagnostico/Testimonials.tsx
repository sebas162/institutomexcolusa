import { Quote } from "lucide-react";
import type { DiagnosticoTestimonial } from "@/lib/diagnostico/content";

interface TestimonialsProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  testimonials: DiagnosticoTestimonial[];
}

function PhotoPlaceholder({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${className}`}
    >
      Foto
    </div>
  );
}

export default function Testimonials({ eyebrow, title, subtitle, testimonials }: TestimonialsProps) {
  return (
    <section
      aria-labelledby="testimonios-titulo"
      className="flex flex-col items-center gap-8 border-b border-border bg-white pb-14 pt-16"
    >
      <div className="flex w-full max-w-[720px] flex-col items-center gap-3 px-4 text-center">
        <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </span>
        <h2
          id="testimonios-titulo"
          className="text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-primary"
        >
          {title}
        </h2>
        <p className="text-[17px] leading-relaxed text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex w-full max-w-[1128px] snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 pt-1 md:grid md:grid-cols-3 md:overflow-visible">
        {testimonials.map((testimonial, index) => (
          <figure
            key={index}
            className="flex flex-[0_0_min(84%,352px)] snap-center flex-col gap-[18px] rounded-[20px] border border-border bg-muted p-[26px] md:flex-auto"
          >
            <div className="flex items-center justify-between gap-3">
              {testimonial.tag && (
                <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground">
                  {testimonial.tag}
                </span>
              )}
              <Quote aria-hidden="true" className="h-[30px] w-[30px] fill-primary/20 text-primary/20" />
            </div>
            <blockquote className="flex-grow text-[17px] leading-relaxed text-foreground">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-border pt-[18px]">
              <PhotoPlaceholder className="h-[52px] w-[52px] bg-primary/10 text-primary" />
              <div className="flex flex-col gap-0.5">
                <strong className="text-[15px] text-primary">{testimonial.name}</strong>
                <span className="text-[13px] leading-[1.45] text-muted-foreground">
                  {testimonial.role}
                </span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function FeaturedTestimonial({
  eyebrow,
  testimonial,
}: {
  eyebrow: string;
  testimonial: DiagnosticoTestimonial;
}) {
  return (
    <figure className="flex flex-col gap-[18px] rounded-[20px] bg-primary p-7 text-white">
      <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-secondary">
        {eyebrow}
      </span>
      <blockquote className="text-lg leading-relaxed text-white">“{testimonial.quote}”</blockquote>
      <figcaption className="flex items-center gap-3">
        <PhotoPlaceholder className="h-12 w-12 bg-white/15 text-secondary" />
        <div className="flex flex-col gap-0.5">
          <strong className="text-[15px]">{testimonial.name}</strong>
          <span className="text-[13px] text-white/80">{testimonial.role}</span>
        </div>
      </figcaption>
    </figure>
  );
}
