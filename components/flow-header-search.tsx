"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import type { FlowHeaderVariant } from "@/components/flow-header-nav";
import { artistBySlugFromList, artistFullName } from "@/lib/artist-utils";
import { searchArtistsInFlow, searchArtworksInFlow } from "@/lib/flow-search";
import type { Artist } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";
import { cn } from "@/lib/utils";

function basePathFor(variant: FlowHeaderVariant): "/dearteenlinea" | "/qullqa-gallery" {
  return variant === "dearteenlinea" ? "/dearteenlinea" : "/qullqa-gallery";
}

export type FlowHeaderSearchProps = {
  variant: FlowHeaderVariant;
  artists: Artist[];
  artworks: Artwork[];
};

export function FlowHeaderSearch({ variant, artists, artworks }: FlowHeaderSearchProps) {
  const basePath = basePathFor(variant);
  const qullqa = variant === "qullqa-gallery";
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Evita cerrar el panel en blur antes del click/tap en resultados (móvil). */
  const blurCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [value, setValue] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

  const trimmed = value.trim();

  const matchedArtists = useMemo(
    () => searchArtistsInFlow(artists, trimmed),
    [artists, trimmed],
  );
  const matchedArtworks = useMemo(
    () => searchArtworksInFlow(artworks, trimmed),
    [artworks, trimmed],
  );

  const showPanel = panelOpen && trimmed.length > 0;

  const clearBlurCloseTimer = useCallback(() => {
    if (blurCloseTimerRef.current != null) {
      clearTimeout(blurCloseTimerRef.current);
      blurCloseTimerRef.current = null;
    }
  }, []);

  const closePanel = useCallback(() => {
    clearBlurCloseTimer();
    setPanelOpen(false);
  }, [clearBlurCloseTimer]);

  useEffect(() => {
    return () => clearBlurCloseTimer();
  }, [clearBlurCloseTimer]);

  useEffect(() => {
    if (!panelOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el || el.contains(e.target as Node)) return;
      clearBlurCloseTimer();
      closePanel();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [panelOpen, closePanel, clearBlurCloseTimer]);

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePanel();
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panelOpen, closePanel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setPanelOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPanelOpen(true);
  };

  const handleFocus = () => {
    clearBlurCloseTimer();
    setPanelOpen(true);
  };

  /**
   * En móvil, el blur suele ejecutarse antes que el click en el enlace; si cerramos
   * al instante, el panel desaparece y la navegación no ocurre. Retrasamos el cierre.
   */
  const handleInputBlur = () => {
    clearBlurCloseTimer();
    blurCloseTimerRef.current = setTimeout(() => {
      blurCloseTimerRef.current = null;
      setPanelOpen(false);
    }, 320);
  };

  const handleResultsPointerDownCapture = () => {
    clearBlurCloseTimer();
  };

  const noResults =
    showPanel && matchedArtists.length === 0 && matchedArtworks.length === 0;

  const textClass = qullqa ? "[font-family:var(--font-manrope)]" : "";

  const linkRow =
    "block w-full rounded-sm px-3 py-2 text-left text-sm outline-none transition hover:bg-muted/80 focus-visible:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

  return (
    <div ref={rootRef} className="relative flex min-w-0 max-w-md flex-1">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex min-w-0 flex-1"
      >
        <label className="relative flex min-w-0 flex-1 items-center">
          <span className="sr-only">Buscar artistas y obras</span>
          <Search
            className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            name="q"
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleInputBlur}
            autoComplete="off"
            enterKeyHint="search"
            aria-label="Buscar artistas y obras"
            aria-expanded={showPanel}
            aria-controls={showPanel ? panelId : undefined}
            placeholder="Buscar…"
            className={cn(
              "h-9 w-full min-w-0 rounded-md border border-input bg-background py-1.5 pl-9 pr-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              textClass,
            )}
          />
        </label>
      </form>

      {showPanel && (
        <div
          id={panelId}
          role="region"
          aria-label="Resultados de búsqueda"
          onPointerDownCapture={handleResultsPointerDownCapture}
          className={cn(
            "absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[min(20rem,55vh)] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg",
            textClass,
          )}
        >
          <div className="max-h-[min(20rem,55vh)] overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable]">
            {noResults ? (
              <p
                className="px-3 py-4 text-sm text-muted-foreground"
                role="status"
              >
                No hay resultados para &ldquo;{trimmed}&rdquo;.
              </p>
            ) : (
              <div className="py-1">
                {matchedArtists.length > 0 && (
                  <div>
                    <div
                      className="sticky top-0 z-10 bg-popover px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Artistas
                    </div>
                    <ul className="m-0 list-none p-0">
                      {matchedArtists.map((a) => (
                        <li key={a.slug}>
                          <Link
                            href={`${basePath}/artistas/${a.slug}`}
                            className={cn(linkRow, "text-foreground")}
                            onClick={closePanel}
                          >
                            {artistFullName(a)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {matchedArtworks.length > 0 && (
                  <div>
                    <div
                      className="sticky top-0 z-10 bg-popover px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Obras
                    </div>
                    <ul className="m-0 list-none p-0">
                      {matchedArtworks.map((artwork) => {
                        const artist = artistBySlugFromList(
                          artists,
                          artwork.artistSlug,
                        );
                        const artistLabel = artist
                          ? artistFullName(artist)
                          : artwork.artistSlug;
                        return (
                          <li key={artwork.slug}>
                            <Link
                              href={`${basePath}/obras/${artwork.slug}`}
                              className={cn(linkRow)}
                              onClick={closePanel}
                            >
                              <span className="font-medium text-foreground">
                                {artwork.title}
                              </span>
                              <span className="mt-0.5 block text-xs text-muted-foreground">
                                {artistLabel}
                                {artwork.year != null ? ` · ${artwork.year}` : ""}
                                {artwork.medium ? ` · ${artwork.medium}` : ""}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
