"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";

import type { ArtworkMediaItem } from "@/lib/art-media";
import type { Artwork } from "@/lib/types/artwork";
import { cn } from "@/lib/utils";

function imgAlt(artwork: Artwork) {
  return artwork.title.trim() ? artwork.title : "Obra";
}

function VideoSlideFullscreen({ url, active }: { url: string; active: boolean }) {
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
      className="relative flex h-full w-full items-center justify-center"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <video
        ref={ref}
        src={url}
        muted
        loop
        playsInline
        controls
        preload="metadata"
        className="max-h-[min(85dvh,calc(100dvh-6rem))] max-w-full object-contain"
        aria-label="Vídeo de la obra"
      />
    </div>
  );
}

type ArtworkMediaFullscreenDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artwork: Artwork;
  items: ArtworkMediaItem[];
  initialIndex: number;
};

export function ArtworkMediaFullscreenDialog({
  open,
  onOpenChange,
  artwork,
  items,
  initialIndex,
}: ArtworkMediaFullscreenDialogProps) {
  const [index, setIndex] = useState(initialIndex);
  const n = items.length;

  useEffect(() => {
    if (open) {
      setIndex(Math.min(Math.max(0, initialIndex), Math.max(0, n - 1)));
    }
  }, [open, initialIndex, n]);

  const safeIndex = n === 0 ? 0 : Math.min(index, n - 1);

  const go = (dir: -1 | 1) => {
    if (n <= 1) return;
    setIndex((i) => (i + dir + n) % n);
  };

  const stopPopupClose = (e: SyntheticEvent) => {
    e.stopPropagation();
  };

  if (n === 0) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 fixed inset-0 z-[60] bg-black/95 transition-opacity" />
        <Dialog.Popup className="data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 fixed inset-0 z-[60] flex flex-col outline-none pointer-events-none">
          <Dialog.Title className="sr-only">
            Vista ampliada: {imgAlt(artwork)}
          </Dialog.Title>
          <div className="flex shrink-0 items-center justify-end gap-2 p-3 sm:p-4 pointer-events-auto">
            <Dialog.Close
              className="inline-flex size-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>

          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-3 pb-6 sm:px-6 pointer-events-none">
            <div className="relative flex min-h-0 w-full max-w-[min(100vw-1.5rem,1600px)] flex-1 flex-col items-center justify-center pointer-events-auto">
              <div className="relative flex h-[min(85dvh,calc(100dvh-5rem))] w-full items-center justify-center">
                {items.map((item, i) => (
                  <div
                    key={`fs-${item.type}-${item.url}`}
                    className={cn(
                      "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                      i === safeIndex
                        ? "z-[1] opacity-100"
                        : "pointer-events-none z-0 opacity-0",
                    )}
                    aria-hidden={i !== safeIndex}
                  >
                    {item.type === "image" ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={item.url}
                          alt={imgAlt(artwork)}
                          fill
                          unoptimized
                          className="object-contain"
                          sizes="100vw"
                          priority
                        />
                      </div>
                    ) : (
                      <VideoSlideFullscreen
                        url={item.url}
                        active={i === safeIndex && open}
                      />
                    )}
                  </div>
                ))}
              </div>

              {n > 1 ? (
                <div className="mt-4 flex w-full max-w-lg items-center justify-between gap-3 px-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      stopPopupClose(e);
                      go(-1);
                    }}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <div className="flex flex-1 justify-center gap-2">
                    {items.map((item, i) => (
                      <button
                        key={`fs-dot-${item.type}-${item.url}`}
                        type="button"
                        onClick={(e) => {
                          stopPopupClose(e);
                          setIndex(i);
                        }}
                        className={cn(
                          "size-2 rounded-full bg-white/40 transition hover:bg-white/60",
                          i === safeIndex && "bg-white",
                        )}
                        aria-label={`Ir a la diapositiva ${i + 1} de ${n}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      stopPopupClose(e);
                      go(1);
                    }}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                    aria-label="Siguiente"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
