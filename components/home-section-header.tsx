import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type HomeSectionTitleSize = "display" | "statement";

type HomeSectionHeaderProps = {
  title: ReactNode;
  manrope?: boolean;
  action?: { label: string; href: string };
  /** display: titulares cortos; statement: líneas largas (categorías). */
  titleSize?: HomeSectionTitleSize;
};

export function HomeSectionHeader({
  title,
  manrope,
  action,
  titleSize = "display",
}: HomeSectionHeaderProps) {
  return (
    <header
      className={cn(
        "mb-6 sm:mb-8",
        action
          ? "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6"
          : "",
      )}
    >
      <h2
        className={cn(
          "text-balance text-left text-foreground [font-family:var(--font-cormorant)]",
          action && "min-w-0 flex-1",
          titleSize === "display" &&
            "text-[1.85rem] font-light leading-[1.2] tracking-[0.02em] md:text-[2.35rem]",
          titleSize === "statement" &&
            "max-w-3xl text-xl font-light leading-snug tracking-[0.015em] md:text-2xl md:leading-relaxed",
        )}
      >
        {title}
      </h2>
      {action ? (
        <a
          href={action.href}
          className={cn(
            "shrink-0 self-end text-right text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline sm:self-auto",
            manrope && "[font-family:var(--font-manrope)]",
          )}
        >
          {action.label}
        </a>
      ) : null}
    </header>
  );
}
