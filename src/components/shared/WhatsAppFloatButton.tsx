"use client";

import { useLanguage } from "@/hooks/use-language";
import { usePathname } from "next/navigation";
import Image from "next/image";
// ...existing code...

export default function WhatsAppFloatButton() {
  const { language } = useLanguage();
  const pathname = usePathname();

  // Ocultar en rutas de programas académicos y formación en línea
  const isAcademicProgramsRoute = pathname?.startsWith("/academic-programs");
  const isOnlineTrainingRoute = pathname?.startsWith("/online-training");
  if (isAcademicProgramsRoute || isOnlineTrainingRoute) {
    return null;
  }

  // Configuración según idioma
  const whatsappConfig = {
    es: {
      phone: "5215566308602", // +52 1 55 6630 8602
      message: "¡Hola! Me encantaría recibir más información sobre sus cursos.",
    },
    en: {
      phone: "14074540524", // +1 (407) 454-0524
      message:
        "Hello! I would love to receive more information about your courses.",
    },
  };

  const config = whatsappConfig[language];
  const whatsappUrl = `https://wa.me/${config.phone}?text=${encodeURIComponent(config.message)}`;

  const handleWhatsAppClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // ...existing code...

    window.setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }, 150);
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-0 sm:gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-1 sm:px-1 sm:pr-2 py-1 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label={
        language === "es"
          ? "Contáctanos por WhatsApp"
          : "Contact us on WhatsApp"
      }
    >
      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full group-hover:scale-110 transition-transform">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </div>
      <span className="hidden sm:inline-block font-medium text-sm">
        {language === "es" ? "WhatsApp" : "WhatsApp"}
      </span>
    </a>
  );
}
