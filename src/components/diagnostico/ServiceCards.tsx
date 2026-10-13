import { FileText, Megaphone, Package, ShieldCheck, type LucideIcon } from "lucide-react";
import type { DiagnosticoService, ServiceIcon } from "@/lib/diagnostico/content";

const ICONS: Record<ServiceIcon, LucideIcon> = {
  permisos: ShieldCheck,
  documentacion: FileText,
  almacenamiento: Package,
  publicidad: Megaphone,
};

export default function ServiceCards({ services }: { services: DiagnosticoService[] }) {
  return (
    <ul className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-3 pt-2">
      {services.map((service) => {
        const Icon = ICONS[service.icon];

        return (
          <li
            key={service.title}
            className="flex flex-col gap-2.5 rounded-2xl border border-white/20 p-[18px]"
          >
            <Icon aria-hidden="true" strokeWidth={1.8} className="h-6 w-6 text-secondary" />
            <strong className="text-[15px]">{service.title}</strong>
            <span className="text-[13px] leading-normal text-white/80">
              {service.description}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
