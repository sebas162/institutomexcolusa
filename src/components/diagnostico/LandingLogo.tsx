import Image from "next/image";
import { cn } from "@/lib/utils";
import logo from "@/assets/Logo-USA-Blanco.png";

// Versión blanca para fondo verde. Sin enlace: en la landing de anuncios no sacamos a la persona.
export default function LandingLogo({ size = "lg" }: { size?: "lg" | "md" }) {
  return (
    <Image
      src={logo}
      alt="Instituto Mex-Col-USA"
      priority={size === "lg"}
      sizes={size === "lg" ? "(min-width: 768px) 136px, 112px" : "(min-width: 768px) 104px, 88px"}
      className={cn(
        size === "lg"
          ? "h-28 w-28 md:h-[136px] md:w-[136px]"
          : "h-[88px] w-[88px] md:h-[104px] md:w-[104px]"
      )}
    />
  );
}
