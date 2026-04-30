import Image from "next/image";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FlowHeroCta = {
  label: string;
  href: string;
};

export type FlowHeroBannerProps = {
  imageSrc: string;
  imageAlt: string;
  title: ReactNode;
  description: string;
  imagePriority?: boolean;
  cta?: FlowHeroCta;
};

export function FlowHeroBanner({
  imageSrc,
  imageAlt,
  title,
  description,
  imagePriority,
  cta,
}: FlowHeroBannerProps) {
  return (
    <section className="relative isolate w-full min-h-[min(72dvh,720px)] border-b border-border/60">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        unoptimized
        priority={imagePriority}
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:from-black/40"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[min(72dvh,720px)] w-full flex-col justify-end pb-10 pt-32 md:pb-14 md:pt-40">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="max-w-xl space-y-4 md:max-w-2xl">
            <h1 className="block w-max max-w-full drop-shadow-sm">
              {title}
            </h1>
            <p className="max-w-prose text-sm leading-relaxed text-white/90 drop-shadow-sm md:text-base">
              {description}
            </p>
            {cta ? (
              <div className="pt-1">
                <a
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "bg-white text-foreground shadow-none hover:bg-white/90",
                  )}
                >
                  {cta.label}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
