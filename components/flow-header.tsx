import Link from "next/link";

import { DearteenlineaLogo } from "@/components/dearteenlinea-logo";
import {
  FlowHeaderNav,
  type FlowHeaderVariant,
} from "@/components/flow-header-nav";
import { FlowHeaderMobileDrawer } from "@/components/flow-header-mobile-drawer";
import { FlowHeaderSearch } from "@/components/flow-header-search";
import { QullqaWordmark } from "@/components/qullqa-wordmark";
import { cn } from "@/lib/utils";

export type { FlowHeaderVariant };

type FlowHeaderProps = {
  variant: FlowHeaderVariant;
};

export function FlowHeader({ variant }: FlowHeaderProps) {
  const dearte = variant === "dearteenlinea";
  const qullqa = variant === "qullqa-gallery";

  const desktopBrand = dearte ? (
    <Link
      href="/dearteenlinea"
      className="inline-flex shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="Inicio dearteenlinea"
    >
      <DearteenlineaLogo priority alt="" />
    </Link>
  ) : (
    <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-x-2.5 gap-y-1 md:gap-x-3">
      <Link
        href="/qullqa-gallery"
        className="inline-flex min-w-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
        <DearteenlineaLogo className="h-9 shrink-0 opacity-90 md:h-10" alt="" />
      </Link>
    </div>
  );

  /** Logo en móvil: tamaño legible (sin max-width que comprima el SVG). */
  const mobileBarBrand = dearte ? (
    <Link
      href="/dearteenlinea"
      className="inline-flex shrink-0 items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="Inicio dearteenlinea"
    >
      <DearteenlineaLogo className="h-11 w-auto sm:h-12" alt="" />
    </Link>
  ) : (
    <div className="flex shrink-0 items-center gap-2">
      <Link
        href="/qullqa-gallery"
        className="inline-flex shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Inicio qullqa gallery"
      >
        <QullqaWordmark className="text-lg leading-none sm:text-xl" />
      </Link>
      <span className="shrink-0 text-xs text-muted-foreground [font-family:var(--font-manrope)]">
        by
      </span>
      <Link
        href="/dearteenlinea"
        className="inline-flex shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Inicio dearteenlinea"
      >
        <DearteenlineaLogo className="h-9 w-auto opacity-90 sm:h-10" alt="" />
      </Link>
    </div>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full shrink-0 border-b border-border/70 bg-background/95 backdrop-blur-sm",
        qullqa && "[font-family:var(--font-manrope)]",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-4 md:h-16 md:gap-4 md:px-6">
        <div className="shrink-0 md:hidden">{mobileBarBrand}</div>

        <div className="hidden shrink-0 md:block">{desktopBrand}</div>

        <div className="flex min-w-0 flex-1 items-center gap-2 md:justify-between md:gap-4">
          <FlowHeaderSearch variant={variant} />
          <div className="hidden shrink-0 md:block">
            <FlowHeaderNav variant={variant} />
          </div>
        </div>

        <div className="shrink-0 md:hidden">
          <FlowHeaderMobileDrawer variant={variant} />
        </div>
      </div>
    </header>
  );
}
