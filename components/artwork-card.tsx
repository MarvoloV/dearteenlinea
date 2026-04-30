"use client";

import Link from "next/link";

import { ArtworkMediaViewer } from "@/components/artwork-media-viewer";
import type { Artwork } from "@/lib/types/artwork";
import { cn } from "@/lib/utils";

export type ArtworkCardProps = {
  artwork: Artwork;
  artistName: string;
  href: string;
  /** Estilo extra en chip de medio y en el nombre del artista (p. ej. Manrope en qullqa). */
  nameClassName?: string;
};

function cardAriaLabel(artwork: Artwork, artistName: string) {
  const parts = [
    artwork.title,
    artistName,
    artwork.medium,
    artwork.dimensions ?? undefined,
    artwork.priceLabel ?? undefined,
  ].filter((s) => s && String(s).trim().length > 0);
  return parts.join(" · ");
}

export function ArtworkCard({
  artwork,
  artistName,
  href,
  nameClassName,
}: ArtworkCardProps) {
  const aria = cardAriaLabel(artwork, artistName);

  return (
    <Link
      href={href}
      aria-label={aria}
      className="group flex h-full min-w-0 w-full max-w-full flex-col rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article className="relative flex h-full min-w-0 w-full max-w-full flex-col overflow-hidden rounded-lg border border-border/80 bg-card transition hover:border-border hover:shadow-sm">
        <ArtworkMediaViewer
          artwork={artwork}
          stopNavigationOnControls
          aspectClassName="aspect-[3/4]"
          className="w-full max-w-full"
          imageSizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 26vw"
        />
        {artwork.medium ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[4] flex justify-end p-2 sm:p-2.5">
            <span
              className={cn(
                "max-w-[min(100%,14rem)] truncate rounded-md bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-black shadow-sm ring-1 ring-black/10 sm:text-[11px]",
                nameClassName,
              )}
            >
              {artwork.medium}
            </span>
          </div>
        ) : null}
        <div className="flex min-w-0 flex-col gap-1 border-t border-border/60 bg-card px-2 py-2 sm:px-2.5">
          {artwork.title ? (
            <p className="line-clamp-2 text-xs font-medium leading-snug text-foreground sm:text-[13px]">
              {artwork.title}
            </p>
          ) : null}
          {artistName ? (
            <p
              className={cn(
                "line-clamp-1 text-xs leading-snug text-muted-foreground sm:text-[13px]",
                nameClassName,
              )}
            >
              {artistName}
            </p>
          ) : null}
          {artwork.dimensions ? (
            <p className="line-clamp-2 text-xs tabular-nums leading-snug text-muted-foreground sm:text-[13px]">
              {artwork.dimensions}
            </p>
          ) : null}
          {artwork.priceLabel ? (
            <p className="text-xs font-medium leading-snug text-foreground sm:text-[13px]">
              {artwork.priceLabel}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
