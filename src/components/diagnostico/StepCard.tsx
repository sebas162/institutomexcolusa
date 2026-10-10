import { forwardRef, type ReactNode, type Ref } from "react";

interface StepCardProps {
  id?: string;
  label: string;
  title: string;
  subtitle: string;
  headingRef?: Ref<HTMLHeadingElement>;
  children: ReactNode;
}

const StepCard = forwardRef<HTMLElement, StepCardProps>(function StepCard(
  { id, label, title, subtitle, headingRef, children },
  sectionRef
) {
  return (
    <section
      id={id}
      ref={sectionRef}
      aria-labelledby="paso-titulo"
      className="flex scroll-mt-4 flex-col items-center gap-7 px-4 pb-20 pt-16"
    >
      <div className="flex w-full max-w-[720px] flex-col items-center gap-3 text-center">
        <span className="rounded-lg bg-primary px-3.5 py-[7px] text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground">
          {label}
        </span>
        <h2
          id="paso-titulo"
          ref={headingRef}
          tabIndex={-1}
          className="text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-primary focus:outline-none"
        >
          {title}
        </h2>
        <p className="text-[17px] leading-relaxed text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex w-full max-w-[720px] flex-col gap-6 rounded-3xl border border-border bg-white p-[clamp(20px,4vw,40px)] shadow-[0_20px_48px_rgba(40,95,101,0.08)]">
        {children}
      </div>
    </section>
  );
});

export default StepCard;
