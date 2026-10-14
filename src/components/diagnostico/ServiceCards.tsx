import { ClipboardCheck, FileText, Megaphone, ShieldCheck, type LucideIcon } from "lucide-react";
import type { DiagnosticoService, ServiceIcon } from "@/lib/diagnostico/content";

const ICONS: Record<ServiceIcon, LucideIcon> = {
  permisos: ShieldCheck,
  documentacion: FileText,
  auditorias: ClipboardCheck,
  publicidad: Megaphone,
};

export default function ServiceCards({ services }: { services: DiagnosticoService[] }) {
  return (
    <ul className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3 pt-2">
      {services.map((service) => {
        const Icon = ICONS[service.icon];

        return (
          <li
            key={service.title}
            className="flex flex-col gap-2.5 rounded-2xl border border-border bg-white p-[18px] text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary"
            >
              <Icon strokeWidth={1.8} className="h-[22px] w-[22px]" />
            </span>
            <strong className="text-[15px] text-foreground">{service.title}</strong>
            <span className="text-[13px] leading-normal text-muted-foreground">
              {service.description}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
