"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import type { FlowHeaderVariant } from "@/components/flow-header-nav";
import { artistBySlugFromList, artistFullName } from "@/lib/artist-utils";
import { searchArtistsInFlow, searchArtworksInFlow } from "@/lib/flow-search";
import type { Artist } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";
import { cn } from "@/lib/utils";
import { useGlobalSearch } from "@/hooks/use-global-search";
import type {
  ArtistSearchResult,
  ArtworkSearchResult,
} from "@/types/search";

const MIN_DEARTE_SEARCH_LENGTH = 2;

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
  const isDearte = variant === "dearteenlinea";
  const qullqa = variant === "qullqa-gallery";
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Evita cerrar el panel en blur antes del click/tap en resultados (móvil). */
  const blurCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [value, setValue] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

  const trimmed = value.trim();
  const globalSearch = useGlobalSearch({
    context: variant,
    query: isDearte ? value : "",
    debounceMs: 350,
    minLength: MIN_DEARTE_SEARCH_LENGTH,
  });

  const matchedArtists = useMemo(
    () => (isDearte ? [] : searchArtistsInFlow(artists, trimmed)),
    [artists, isDearte, trimmed],
  );
  const matchedArtworks = useMemo(
    () => (isDearte ? [] : searchArtworksInFlow(artworks, trimmed)),
    [artworks, isDearte, trimmed],
  );

  const showPanel = panelOpen && trimmed.length > 0;
  const hasShortDearteQuery =
    isDearte &&
    trimmed.length > 0 &&
    trimmed.length < MIN_DEARTE_SEARCH_LENGTH;
  const hasActiveDearteSearch =
    isDearte && globalSearch.searchedQuery === trimmed;
  const dearteArtists = hasActiveDearteSearch
    ? globalSearch.results.artists
    : [];
  const dearteArtworks = hasActiveDearteSearch
    ? globalSearch.results.artworks
    : [];
  const isDearteLoading =
    isDearte &&
    trimmed.length >= MIN_DEARTE_SEARCH_LENGTH &&
    (globalSearch.isLoading || !hasActiveDearteSearch);
  const dearteError = hasActiveDearteSearch ? globalSearch.error : null;
  const dearteNoResults =
    isDearte &&
    !hasShortDearteQuery &&
    !isDearteLoading &&
    !dearteError &&
    globalSearch.hasSearched &&
    dearteArtists.length === 0 &&
    dearteArtworks.length === 0;
  const localNoResults =
    !isDearte && matchedArtists.length === 0 && matchedArtworks.length === 0;

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

  const handleClear = () => {
    clearBlurCloseTimer();
    setValue("");
    setPanelOpen(false);
    inputRef.current?.focus();
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

  const textClass = qullqa ? "[font-family:var(--font-manrope)]" : "";

  const linkRow =
    "block w-full rounded-sm px-3 py-2 text-left text-sm outline-none transition hover:bg-muted/80 focus-visible:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

  function sectionTitle(label: string) {
    return (
      <div className="sticky top-0 z-10 bg-popover px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    );
  }

  function renderDearteArtist(artist: ArtistSearchResult) {
    return (
      <li key={`artist-${artist.id}-${artist.slug}`}>
        <Link
          href={`/dearteenlinea/artistas/${artist.slug}`}
          className={cn(linkRow, "text-foreground")}
          onClick={closePanel}
        >
          {artist.name}
        </Link>
      </li>
    );
  }

  function renderDearteArtwork(artwork: ArtworkSearchResult) {
    const meta = [artwork.artistName, artwork.mediumName].filter(Boolean);

    return (
      <li key={`artwork-${artwork.id}-${artwork.slug}`}>
        <Link
          href={`/dearteenlinea/obras/${artwork.slug}`}
          className={cn(linkRow)}
          onClick={closePanel}
        >
          <span className="font-medium text-foreground">{artwork.title}</span>
          {meta.length > 0 ? (
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {meta.join(" · ")}
            </span>
          ) : null}
        </Link>
      </li>
    );
  }

  function renderDeartePanelContent() {
    if (hasShortDearteQuery) {
      return (
        <p className="px-3 py-4 text-sm text-muted-foreground" role="status">
          Escribe al menos 2 caracteres.
        </p>
      );
    }

    if (isDearteLoading) {
      return (
        <p className="px-3 py-4 text-sm text-muted-foreground" role="status">
          Buscando...
        </p>
      );
    }

    if (dearteError) {
      return (
        <p className="px-3 py-4 text-sm text-muted-foreground" role="alert">
          {dearteError}
        </p>
      );
    }

    if (dearteNoResults) {
      return (
        <p className="px-3 py-4 text-sm text-muted-foreground" role="status">
          No hay resultados para &ldquo;{trimmed}&rdquo;.
        </p>
      );
    }

    return (
      <div className="py-1">
        {dearteArtists.length > 0 ? (
          <div>
            {sectionTitle("Artistas")}
            <ul className="m-0 list-none p-0">
              {dearteArtists.map(renderDearteArtist)}
            </ul>
          </div>
        ) : null}
        {dearteArtworks.length > 0 ? (
          <div>
            {sectionTitle("Obras")}
            <ul className="m-0 list-none p-0">
              {dearteArtworks.map(renderDearteArtwork)}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  function renderLocalPanelContent() {
    if (localNoResults) {
      return (
        <p className="px-3 py-4 text-sm text-muted-foreground" role="status">
          No hay resultados para &ldquo;{trimmed}&rdquo;.
        </p>
      );
    }

    return (
      <div className="py-1">
        {matchedArtists.length > 0 && (
          <div>
            {sectionTitle("Artistas")}
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
            {sectionTitle("Obras")}
            <ul className="m-0 list-none p-0">
              {matchedArtworks.map((artwork) => {
                const artist = artistBySlugFromList(artists, artwork.artistSlug);
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
    );
  }

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
            aria-controls={showPanel ? panelId : undefined}
            placeholder="Buscar…"
            className={cn(
              "h-9 w-full min-w-0 rounded-md border border-input bg-background py-1.5 pl-9 pr-9 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              textClass,
            )}
          />
          {value.length > 0 ? (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onPointerDown={(event) => event.preventDefault()}
              onClick={handleClear}
              className="absolute right-2 inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          ) : null}
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
            {isDearte ? renderDeartePanelContent() : renderLocalPanelContent()}
          </div>
        </div>
      )}
    </div>
  );
}
