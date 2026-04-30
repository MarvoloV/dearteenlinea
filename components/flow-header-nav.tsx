"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FlowHeaderVariant = "dearteenlinea" | "qullqa-gallery";

type FlowHeaderNavProps = {
  variant: FlowHeaderVariant;
  /** Navegación vertical para el menú móvil */
  stacked?: boolean;
};

export function FlowHeaderNav({ variant, stacked = false }: FlowHeaderNavProps) {
  const pathname = usePathname();
  const base = variant === "dearteenlinea" ? "/dearteenlinea" : "/qullqa-gallery";
  const artistasPath = `${base}/artistas`;
  const obrasPath = `${base}/obras`;
  const contactoPath = `${base}/contacto`;
  const nosotrosPath = `${base}/nosotros`;
  const isArtistas =
    pathname === artistasPath || pathname?.startsWith(`${artistasPath}/`) === true;
  const isObras =
    pathname === obrasPath || pathname?.startsWith(`${obrasPath}/`) === true;
  const isContacto =
    pathname === contactoPath ||
    pathname?.startsWith(`${contactoPath}/`) === true;
  const isNosotros =
    pathname === nosotrosPath ||
    pathname?.startsWith(`${nosotrosPath}/`) === true;

  const navLink = (active: boolean) =>
    stacked
      ? cn(
          "block w-full rounded-lg px-3 py-2.5 text-sm transition",
          active
            ? "bg-muted/80 font-medium text-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )
      : cn(
          "text-muted-foreground transition hover:text-foreground",
          active &&
            "text-foreground underline decoration-1 underline-offset-4",
        );

  return (
    <nav
      className={cn(
        "flex shrink-0 text-sm font-medium",
        stacked
          ? "w-full flex-col gap-0.5"
          : "items-center gap-6",
        variant === "qullqa-gallery" && "[font-family:var(--font-manrope)]",
      )}
      aria-label="Secciones del sitio"
    >
      <Link href={artistasPath} className={navLink(isArtistas)}>
        Artistas
      </Link>
      <Link href={obrasPath} className={navLink(isObras)}>
        Obras
      </Link>
      <Link href={nosotrosPath} className={navLink(isNosotros)}>
        Nosotros
      </Link>
      <Link href={contactoPath} className={navLink(isContacto)}>
        Contacto
      </Link>
      {variant === "dearteenlinea" ? (
        <Link
          href="/qullqa-gallery"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "border-border dark:border-input",
            stacked && "mt-4 w-full justify-center py-2.5 text-center",
          )}
          aria-label="Ir a la galería qullqa"
        >
          Ir a qullqa gallery
        </Link>
      ) : (
        <Link
          href="/dearteenlinea"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "border-border dark:border-input [font-family:var(--font-manrope)]",
            stacked && "mt-4 w-full justify-center py-2.5 text-center",
          )}
          aria-label="Ir a dearteenlinea"
        >
          Ir a dearteenlinea
        </Link>
      )}
    </nav>
  );
}
