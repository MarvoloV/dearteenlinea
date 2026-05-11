"use client";

import { useCallback, useEffect, useRef } from "react";

import { ArtworkCard } from "@/components/artwork-card";
import { artistBySlug, artistDisplayName } from "@/lib/artwork-utils";
import type { Artist } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";
import { cn } from "@/lib/utils";

type HomeArtworkRailProps = {
  artworks: Artwork[];
  artists: Artist[];
  basePath: "/dearteenlinea" | "/qullqa-gallery";
  nameClassName?: string;
};

const DRAG_THRESHOLD_PX = 10;

/**
 * Carril horizontal: una fila con scroll (sin barra), snap en móvil, arrastre con puntero en desktop.
 */
export function HomeArtworkRail({
  artworks,
  artists,
  basePath,
  nameClassName,
}: HomeArtworkRailProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const dragSuppressedRef = useRef(false);
  const dragRef = useRef({
    active: false,
    pointerId: 0,
    startClientX: 0,
    startScrollLeft: 0,
    moved: false,
    captured: false,
  });

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLUListElement>) => {
    if (!scrollRef.current) return;
    if (!e.isPrimary || e.button !== 0) return;
    const t = e.target as HTMLElement | null;
    /** No capturar el puntero si el usuario usa los botones del carrusel de imágenes/vídeo (evita que dejen de funcionar). */
    if (t?.closest("button")) {
      return;
    }
    const el = scrollRef.current;
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
      captured: false,
    };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLUListElement>) => {
    if (!dragRef.current.active || !scrollRef.current) return;
    if (e.pointerId !== dragRef.current.pointerId) return;
    const dx = e.clientX - dragRef.current.startClientX;
    if (Math.abs(dx) > DRAG_THRESHOLD_PX) {
      dragRef.current.moved = true;
    }
    if (!dragRef.current.moved) return;
    if (!dragRef.current.captured) {
      scrollRef.current.setPointerCapture(e.pointerId);
      dragRef.current.captured = true;
    }
    scrollRef.current.scrollLeft = dragRef.current.startScrollLeft - dx;
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLUListElement>) => {
    if (!dragRef.current.active) return;
    if (e.pointerId !== dragRef.current.pointerId) return;
    const didDrag = dragRef.current.moved;
    const didCapture = dragRef.current.captured;
    dragRef.current.active = false;
    if (didCapture) {
      try {
        if (scrollRef.current?.hasPointerCapture(e.pointerId)) {
          scrollRef.current.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* ignore */
      }
    }
    if (didDrag) {
      dragSuppressedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onClickCapture = (ev: MouseEvent) => {
      if (!dragSuppressedRef.current) return;
      ev.preventDefault();
      ev.stopPropagation();
      dragSuppressedRef.current = false;
    };

    el.addEventListener("click", onClickCapture, true);
    return () => el.removeEventListener("click", onClickCapture, true);
  }, []);

  if (artworks.length === 0) return null;

  return (
    <ul
      ref={scrollRef}
      role="list"
      className={cn(
        "scrollbar-hide flex min-w-0 cursor-grab touch-pan-x flex-nowrap gap-3 overflow-x-auto overflow-y-hidden pb-1 active:cursor-grabbing sm:gap-4",
        "snap-x snap-mandatory [-webkit-overflow-scrolling:touch]",
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {artworks.map((artwork) => {
        const artist = artistBySlug(artists, artwork.artistSlug);
        const href = `${basePath}/obras/${artwork.slug}`;
        return (
          <li
            key={artwork.slug}
            className={cn(
              "min-w-0 shrink-0 snap-start",
              "w-[min(52vw,300px)] sm:w-[min(36vw,320px)] md:w-[min(24vw,280px)]",
            )}
          >
            <ArtworkCard
              artwork={artwork}
              artistName={artistDisplayName(artist)}
              href={href}
              artistHref={artist?.web}
              nameClassName={nameClassName}
            />
          </li>
        );
      })}
    </ul>
  );
}
