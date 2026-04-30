import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Pastel equilibrado: visible sin saturar (entre el velo casi invisible y el bloque fuerte).
 */
const variants = {
  violet:
    "border border-violet-200/45 bg-violet-50/42 shadow-sm shadow-violet-500/[0.09] dark:border-white/[0.12] dark:bg-violet-950/24 dark:shadow-none",
  rose:
    "border border-rose-200/45 bg-rose-50/42 shadow-sm shadow-rose-500/[0.09] dark:border-white/[0.12] dark:bg-rose-950/26 dark:shadow-none",
  teal:
    "border border-teal-200/45 bg-teal-50/42 shadow-sm shadow-teal-500/[0.09] dark:border-white/[0.12] dark:bg-teal-950/26 dark:shadow-none",
  amber:
    "border border-amber-200/45 bg-amber-50/42 shadow-sm shadow-amber-500/[0.09] dark:border-white/[0.12] dark:bg-amber-950/26 dark:shadow-none",
  sky:
    "border border-sky-200/45 bg-sky-50/42 shadow-sm shadow-sky-500/[0.09] dark:border-white/[0.12] dark:bg-sky-950/26 dark:shadow-none",
} as const;

export type HomePastelVariant = keyof typeof variants;

type HomePastelSectionProps = {
  variant: HomePastelVariant;
  children: ReactNode;
  className?: string;
};

export function HomePastelSection({
  variant,
  children,
  className,
}: HomePastelSectionProps) {
  return (
    <section className={cn("px-4 md:px-6", className)}>
      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            "rounded-2xl p-5 md:rounded-3xl md:p-8",
            variants[variant],
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
