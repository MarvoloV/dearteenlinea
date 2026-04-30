import Image from "next/image";
import { cn } from "@/lib/utils";

type DearteenlineaLogoProps = {
  className?: string;
  priority?: boolean;
  /** Marca en negro por defecto; en fondos oscuros usar invertido para leer el SVG como blanco */
  inverted?: boolean;
  /** Vacío si el padre (p. ej. `Link`) ya tiene `aria-label`. */
  alt?: string;
};

export function DearteenlineaLogo({
  className,
  priority,
  inverted,
  alt = "dearteenlinea",
}: DearteenlineaLogoProps) {
  return (
    <Image
      src="/dearteenlinea-logo.svg"
      alt={alt}
      width={72}
      height={80}
      unoptimized
      priority={priority}
      className={cn(
        "h-10 w-auto md:h-11",
        inverted && "brightness-0 invert",
        className,
      )}
    />
  );
}
