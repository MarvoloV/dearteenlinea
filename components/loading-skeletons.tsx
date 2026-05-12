import type { ReactNode } from "react";

import { HomeSectionHeader } from "@/components/home-section-header";
import {
  HomePastelSection,
  type HomePastelVariant,
} from "@/components/home-pastel-section";
import { cn } from "@/lib/utils";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-muted/70", className)}
    />
  );
}

function CatalogTitleSearchSkeleton({ title }: { title: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
      <div className="min-w-0 shrink">{title}</div>
      <SkeletonBlock className="h-10 w-full md:max-w-[min(100%,18rem)] lg:max-w-xs" />
    </div>
  );
}

export function ArtworkCardSkeleton({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "flex h-full min-w-0 w-full max-w-full flex-col overflow-hidden rounded-lg border border-border/80 bg-card",
        className,
      )}
    >
      <SkeletonBlock className="aspect-[3/4] w-full rounded-none" />
      <div className="space-y-2 border-t border-border/60 px-2 py-2 sm:px-2.5">
        <SkeletonBlock className="h-3.5 w-4/5" />
        <SkeletonBlock className="h-3 w-3/5" />
        <SkeletonBlock className="h-3 w-1/2" />
      </div>
    </article>
  );
}

export function ArtworkCarouselSkeleton({
  variant,
  title,
  actionLabel = "Ver todas",
}: {
  variant: HomePastelVariant;
  title: ReactNode;
  actionLabel?: string;
}) {
  return (
    <HomePastelSection variant={variant}>
      <HomeSectionHeader
        title={title}
        titleSize="display"
        action={{ label: actionLabel, href: "#" }}
      />
      <ul
        role="list"
        aria-label="Cargando obras"
        className="scrollbar-hide flex min-w-0 flex-nowrap gap-3 overflow-hidden pb-1 sm:gap-4"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <li
            key={index}
            className="min-w-0 shrink-0 w-[min(52vw,300px)] sm:w-[min(36vw,320px)] md:w-[min(24vw,280px)]"
          >
            <ArtworkCardSkeleton />
          </li>
        ))}
      </ul>
    </HomePastelSection>
  );
}

export function MediumCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border/50 bg-card shadow-xs ring-1 ring-black/[0.04]">
      <SkeletonBlock className="aspect-[3/2] w-full rounded-none" />
    </div>
  );
}

export function MediumsSkeleton({
  variant,
  title,
}: {
  variant: HomePastelVariant;
  title: ReactNode;
}) {
  return (
    <HomePastelSection variant={variant}>
      <HomeSectionHeader
        title={title}
        titleSize="display"
        action={{ label: "Ver todas las obras", href: "#" }}
      />
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <li key={index} className="min-w-0">
            <MediumCardSkeleton />
          </li>
        ))}
      </ul>
    </HomePastelSection>
  );
}

export function FiltersSkeleton() {
  const body = (
    <div className="space-y-5">
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          <SkeletonBlock className="h-3 w-20" />
          <div className="space-y-2">
            {Array.from({ length: groupIndex === 0 ? 3 : 6 }).map((__, index) => (
              <div key={index} className="flex items-center gap-2 py-1">
                <SkeletonBlock className="size-4 shrink-0" />
                <SkeletonBlock className="h-3.5 w-32" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <details className="mb-4 overflow-hidden rounded-lg border border-border/80 bg-card/40 lg:hidden">
        <summary className="flex cursor-default list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
          <span>Filtros</span>
          <SkeletonBlock className="h-7 w-16" />
        </summary>
      </details>

      <aside className="mb-6 hidden min-h-0 w-64 max-w-full shrink-0 lg:sticky lg:top-24 lg:mb-8 lg:flex lg:max-h-[calc(100svh-6rem-2rem-env(safe-area-inset-bottom,0px))] lg:flex-col lg:self-start">
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border/80 bg-card/40 shadow-sm">
          <div className="shrink-0 border-b border-border/60 bg-background/95 px-4 pb-3 pt-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">Filtros</p>
              <SkeletonBlock className="h-7 w-16" />
            </div>
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="mt-1.5 h-3 w-4/5" />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden px-4 pt-4 pb-10">
            {body}
          </div>
        </div>
      </aside>
    </>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 pt-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonBlock key={index} className="h-8 w-10" />
      ))}
    </div>
  );
}

export function WorksGridSkeleton({
  showPagination = true,
}: {
  showPagination?: boolean;
}) {
  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-4 w-40" />
      </div>
      <ul className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 xl:gap-5">
        {Array.from({ length: 9 }).map((_, index) => (
          <li key={index} className="flex min-h-0 min-w-0 w-full">
            <ArtworkCardSkeleton />
          </li>
        ))}
      </ul>
      {showPagination ? <PaginationSkeleton /> : null}
    </div>
  );
}

export function ArtistGridSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="relative -mx-1">
        <div className="flex max-w-full gap-1 overflow-hidden pb-1 md:flex-wrap">
          {Array.from({ length: 15 }).map((_, index) => (
            <SkeletonBlock
              key={index}
              className={index === 0 ? "h-9 w-16 rounded-full" : "size-9 rounded-full"}
            />
          ))}
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <li
            key={index}
            className="min-w-0 overflow-hidden rounded-lg border border-border/80 bg-card"
          >
            <SkeletonBlock className="aspect-[3/4] w-full rounded-none" />
            <div className="border-t border-border/60 px-2 py-2 sm:px-2.5">
              <SkeletonBlock className="h-3.5 w-4/5" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DearteObrasCatalogSkeleton({ title }: { title: ReactNode }) {
  return (
    <div className="space-y-6 md:space-y-8">
      <CatalogTitleSearchSkeleton title={title} />
      <div className="lg:flex lg:items-start lg:gap-8">
        <FiltersSkeleton />
        <WorksGridSkeleton />
      </div>
    </div>
  );
}

export function DearteenlineaArtistsCatalogSkeleton({
  title,
}: {
  title: ReactNode;
}) {
  return (
    <div className="space-y-6 md:space-y-8">
      <CatalogTitleSearchSkeleton title={title} />
      <ArtistGridSkeleton />
    </div>
  );
}

export function ArtworkDetailSkeleton() {
  return (
    <div className="space-y-10 md:space-y-12">
      <div>
        <SkeletonBlock className="h-5 w-16" />
      </div>

      <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-start md:gap-10 lg:gap-12">
        <div className="mx-auto w-full max-w-xl md:mx-0 md:max-w-none">
          <SkeletonBlock className="aspect-[3/4] w-full rounded-lg border border-border/80" />
        </div>

        <div className="min-w-0 space-y-5">
          <SkeletonBlock className="h-8 w-3/4 md:h-9" />

          <div className="flex max-w-md items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-2 pr-3">
            <SkeletonBlock className="size-11 shrink-0 rounded-full" />
            <div className="space-y-1.5">
              <SkeletonBlock className="h-2.5 w-12" />
              <SkeletonBlock className="h-3.5 w-24" />
            </div>
          </div>

          <div className="grid gap-2 text-sm md:text-[15px]">
            <div className="flex gap-2">
              <SkeletonBlock className="h-3.5 w-20" />
              <SkeletonBlock className="h-3.5 w-28" />
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="h-3.5 w-14" />
              <SkeletonBlock className="h-3.5 w-20" />
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="h-3.5 w-20" />
              <SkeletonBlock className="h-3.5 w-32" />
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="h-3.5 w-24" />
              <SkeletonBlock className="h-3.5 w-24" />
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="h-3.5 w-16" />
              <SkeletonBlock className="h-3.5 w-20" />
            </div>
          </div>

          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-4/5" />
          </div>

          <div className="flex gap-2 pt-1 sm:flex-row">
            <SkeletonBlock className="h-10 w-40 rounded-md" />
            <SkeletonBlock className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </section>

      <div className="border-t border-border/60 pt-10 md:pt-12">
        <SkeletonBlock className="h-6 w-48 mb-6" />
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-border/80 bg-card">
              <SkeletonBlock className="aspect-[3/4] w-full" />
              <div className="border-t border-border/60 px-2 py-2 sm:px-2.5">
                <SkeletonBlock className="h-3.5 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
