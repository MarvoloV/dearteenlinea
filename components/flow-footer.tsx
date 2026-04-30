import Link from "next/link";

import { DearteenlineaLogo } from "@/components/dearteenlinea-logo";
import type { FlowHeaderVariant } from "@/components/flow-header-nav";
import { QullqaWordmark } from "@/components/qullqa-wordmark";
import { cn } from "@/lib/utils";

type FlowFooterProps = {
  variant: FlowHeaderVariant;
};

function basePath(v: FlowFooterProps["variant"]): "/dearteenlinea" | "/qullqa-gallery" {
  return v === "dearteenlinea" ? "/dearteenlinea" : "/qullqa-gallery";
}

const linkClass =
  "rounded-sm text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function FlowFooter({ variant }: FlowFooterProps) {
  const base = basePath(variant);
  const qullqa = variant === "qullqa-gallery";

  return (
    <footer className="shrink-0 border-t border-border/70 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="min-w-0">
            {qullqa ? (
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 md:gap-x-3">
                <Link
                  href="/qullqa-gallery"
                  className="inline-flex rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Inicio qullqa gallery"
                >
                  <span className="inline-flex" aria-hidden>
                    <QullqaWordmark className="text-xl md:text-2xl" />
                  </span>
                </Link>
                <span className="text-muted-foreground [font-family:var(--font-manrope)] text-xs font-normal md:text-sm">
                  by
                </span>
                <Link
                  href="/dearteenlinea"
                  className="inline-flex shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Inicio dearteenlinea"
                >
                  <DearteenlineaLogo
                    className="h-9 shrink-0 opacity-90 md:h-10"
                    alt=""
                  />
                </Link>
              </div>
            ) : (
              <Link
                href="/dearteenlinea"
                className="inline-flex rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Inicio dearteenlinea"
              >
                <DearteenlineaLogo className="h-10 w-auto md:h-11" alt="" />
              </Link>
            )}
            <p
              className={cn(
                "mt-3 max-w-sm text-xs leading-relaxed text-muted-foreground",
                qullqa && "[font-family:var(--font-manrope)]",
              )}
            >
              Galería en línea: obras curadas y artistas.
            </p>
          </div>

          <nav
            className={cn(
              "flex flex-col gap-6 text-sm md:items-end",
              qullqa && "[font-family:var(--font-manrope)]",
            )}
            aria-label="Pie de página"
          >
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href={`${base}/obras`} className={linkClass}>
                Obras
              </Link>
              <Link href={`${base}/artistas`} className={linkClass}>
                Artistas
              </Link>
              <Link href={`${base}/nosotros`} className={linkClass}>
                Nosotros
              </Link>
              <Link href={`${base}/contacto`} className={linkClass}>
                Contacto
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border/50 pt-4 md:border-t-0 md:border-none md:pt-0">
              <Link href="/legal/terminos" className={linkClass}>
                Términos y condiciones
              </Link>
              <Link href="/legal/privacidad" className={linkClass}>
                Política de privacidad
              </Link>
              <Link href="/legal/reclamaciones" className={linkClass}>
                Libro de reclamaciones
              </Link>
            </div>
          </nav>
        </div>

        <p
          className={cn(
            "mt-8 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground md:text-left",
            qullqa && "[font-family:var(--font-manrope)]",
          )}
        >
          <a
            href="https://teamaurora.pe"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Construido por Aurora AI Driven Software Factory 2026
          </a>
        </p>
      </div>
    </footer>
  );
}
