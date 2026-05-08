"use client";

import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";

import { ArtworkMediaFullscreenDialog } from "@/components/artwork-media-fullscreen-dialog";
import { mediaItemsFromArtwork, type ArtworkMediaItem } from "@/lib/art-media";
import type { Artwork } from "@/lib/types/artwork";
import { cn } from "@/lib/utils";

function stopCardNavigation(e: SyntheticEvent) {
  e.preventDefault();
  e.stopPropagation();
}

function VideoSlide({ url, active }: { url: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active) {
      el.pause();
      el.currentTime = 0;
    }
  }, [active]);

  const onEnter = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    void el.play().catch(() => {});
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-black"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <video
        ref={ref}
        src={url}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 box-border h-full w-full max-h-full max-w-full object-cover"
        aria-label="Vídeo de la obra"
      />
    </div>
  );
}

const imgAlt = (artwork: Artwork) =>
  artwork.title.trim() ? artwork.title : "Obra";

export type ArtworkMediaViewerProps = {
  artwork: Artwork;
  /** En tarjetas dentro de un Link, evita que los controles naveguen al detalle. */
  stopNavigationOnControls?: boolean;
  /** Clases del contenedor con ratio (p. ej. aspect-[4/5]). */
  className?: string;
  /** Ratio del área de imagen/vídeo (por defecto retrato para detalle). */
  aspectClassName?: string;
  imageSizes: string;
  /** Botón “Ver en pantalla completa” (solo detalle de obra). */
  enableFullscreen?: boolean;
};

export function ArtworkMediaViewer({
  artwork,
  stopNavigationOnControls = false,
  className,
  aspectClassName = "aspect-[4/5]",
  imageSizes,
  enableFullscreen = false,
}: ArtworkMediaViewerProps) {
  const items: ArtworkMediaItem[] = useMemo(
    () => mediaItemsFromArtwork(artwork),
    [artwork],
  );
  const [index, setIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const n = items.length;
  const safeIndex = n === 0 ? 0 : Math.min(index, n - 1);

  useEffect(() => {
    setIndex(0);
  }, [artwork.slug]);

  const go = (dir: -1 | 1) => {
    if (n <= 1) return;
    setIndex((i) => (i + dir + n) % n);
  };

  /** Avance automático cada 5s; se reinicia al cambiar de slide; pausa al hover. */
  useEffect(() => {
    if (n <= 1 || carouselPaused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % n);
    }, 5000);
    return () => window.clearInterval(id);
  }, [n, carouselPaused, safeIndex]);

  const wrapControl = (e: SyntheticEvent) => {
    if (stopNavigationOnControls) stopCardNavigation(e);
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-full shrink-0 overflow-hidden bg-muted",
        className,
      )}
    >
      {enableFullscreen && n > 0 ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              wrapControl(e);
              setFullscreenOpen(true);
            }}
            className="absolute top-2 right-2 z-[5] inline-flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-md border border-border/80 bg-background/95 px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm transition hover:bg-muted"
          >
            <Maximize2 className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">Ver en pantalla completa</span>
          </button>
          <ArtworkMediaFullscreenDialog
            open={fullscreenOpen}
            onOpenChange={setFullscreenOpen}
            artwork={artwork}
            items={items}
            initialIndex={safeIndex}
          />
        </>
      ) : null}
      {n === 0 ? (
        <div
          className={cn(
            "flex size-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10 text-xs text-muted-foreground",
            aspectClassName,
          )}
        >
          Sin imagen
        </div>
      ) : n === 1 ? (
        <div className={cn("relative w-full", aspectClassName)}>
          {items[0]!.type === "image" ? (
            <Image
              src={items[0]!.url}
              alt={imgAlt(artwork)}
              fill
              className="object-cover"
              sizes={imageSizes}
            />
          ) : (
            <VideoSlide url={items[0]!.url} active />
          )}
        </div>
      ) : (
        <div
          className={cn("relative w-full", aspectClassName)}
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
        >
          <div className="relative size-full overflow-hidden">
            {items.map((item, i) => (
              <div
                key={`${item.type}-${item.url}`}
                className={cn(
                  "absolute inset-0 overflow-hidden transition-opacity duration-200",
                  i === safeIndex
                    ? "z-[1] opacity-100"
                    : "pointer-events-none z-0 opacity-0",
                )}
                aria-hidden={i !== safeIndex}
              >
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={imgAlt(artwork)}
                    fill
                    className="object-cover"
                    sizes={imageSizes}
                  />
                ) : (
                  <VideoSlide url={item.url} active={i === safeIndex} />
                )}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-2 bg-gradient-to-t from-black/50 to-transparent p-2 pt-8">
            <button
              type="button"
              onClick={(e) => {
                wrapControl(e);
                go(-1);
              }}
              className="pointer-events-auto inline-flex size-8 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
              aria-label="Anterior"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="pointer-events-none flex flex-1 justify-center gap-1.5">
              {items.map((item, i) => (
                <span
                  key={`dot-${item.type}-${item.url}`}
                  className={cn(
                    "size-1.5 rounded-full bg-white/50",
                    i === safeIndex && "bg-white",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={(e) => {
                wrapControl(e);
                go(1);
              }}
              className="pointer-events-auto inline-flex size-8 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
              aria-label="Siguiente"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
