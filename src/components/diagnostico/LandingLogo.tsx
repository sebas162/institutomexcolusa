import Image from "next/image";
import { cn } from "@/lib/utils";
import logoBlanco from "@/assets/Logo-USA-Blanco.png";
import logoVerde from "@/assets/Logo-USA-Verde.png";

// "white" para fondo verde, "green" para fondo claro. Sin enlace: en la landing de anuncios no sacamos a la persona.
export default function LandingLogo({
  size = "lg",
  tone = "white",
}: {
  size?: "lg" | "md";
  tone?: "white" | "green";
}) {
  return (
    <Image
      src={tone === "green" ? logoVerde : logoBlanco}
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
