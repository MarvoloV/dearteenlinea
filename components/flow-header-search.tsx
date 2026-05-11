"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { FlowHeaderVariant } from "@/components/flow-header-nav";
import { cn } from "@/lib/utils";
import { useGlobalSearch } from "@/hooks/use-global-search";
import type {
  ArtistSearchResult,
  ArtworkSearchResult,
  SearchContext,
} from "@/types/search";

const MIN_SEARCH_LENGTH = 2;

function searchContextForPathname(
  pathname: string | null,
  variant: FlowHeaderVariant,
): SearchContext {
  if (pathname?.startsWith("/dearteenlinea")) return "dearteenlinea";
  if (pathname?.startsWith("/qullqa-gallery")) return "qullqa-gallery";
  return variant;
}

function basePathFor(context: SearchContext): "/dearteenlinea" | "/qullqa-gallery" {
  return context === "dearteenlinea" ? "/dearteenlinea" : "/qullqa-gallery";
}

export type FlowHeaderSearchProps = {
  variant: FlowHeaderVariant;
};

export function FlowHeaderSearch({ variant }: FlowHeaderSearchProps) {
  const pathname = usePathname();
  const context = searchContextForPathname(pathname, variant);
  const basePath = basePathFor(context);
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
    context,
    query: value,
    debounceMs: 350,
    minLength: MIN_SEARCH_LENGTH,
  });

  const showPanel = panelOpen && trimmed.length > 0;
  const hasShortQuery =
    trimmed.length > 0 && trimmed.length < MIN_SEARCH_LENGTH;
  const hasActiveSearch = globalSearch.searchedQuery === trimmed;
  const resultArtists = hasActiveSearch ? globalSearch.results.artists : [];
  const resultArtworks = hasActiveSearch ? globalSearch.results.artworks : [];
  const isSearchLoading =
    trimmed.length >= MIN_SEARCH_LENGTH &&
    (globalSearch.isLoading || !hasActiveSearch);
  const searchError = hasActiveSearch ? globalSearch.error : null;
  const noResults =
    !hasShortQuery &&
    !isSearchLoading &&
    !searchError &&
    globalSearch.hasSearched &&
    resultArtists.length === 0 &&
    resultArtworks.length === 0;

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

  function renderArtist(artist: ArtistSearchResult) {
    return (
      <li key={`artist-${artist.id}-${artist.slug}`}>
        <Link
          href={`${basePath}/artistas/${artist.slug}`}
          className={cn(linkRow, "text-foreground")}
          onClick={closePanel}
        >
          {artist.name}
        </Link>
      </li>
    );
  }

  function renderArtwork(artwork: ArtworkSearchResult) {
    const meta = [artwork.artistName, artwork.mediumName].filter(Boolean);

    return (
      <li key={`artwork-${artwork.id}-${artwork.slug}`}>
        <Link
          href={`${basePath}/obras/${artwork.slug}`}
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

  function renderPanelContent() {
    if (hasShortQuery) {
      return (
        <p className="px-3 py-4 text-sm text-muted-foreground" role="status">
          Escribe al menos 2 caracteres.
        </p>
      );
    }

    if (isSearchLoading) {
      return (
        <p className="px-3 py-4 text-sm text-muted-foreground" role="status">
          Buscando...
        </p>
      );
    }

    if (searchError) {
      return (
        <p className="px-3 py-4 text-sm text-muted-foreground" role="alert">
          {searchError}
        </p>
      );
    }

    if (noResults) {
      return (
        <p className="px-3 py-4 text-sm text-muted-foreground" role="status">
          No hay resultados para &ldquo;{trimmed}&rdquo;.
        </p>
      );
    }

    return (
      <div className="py-1">
        {resultArtists.length > 0 ? (
          <div>
            {sectionTitle("Artistas")}
            <ul className="m-0 list-none p-0">
              {resultArtists.map(renderArtist)}
            </ul>
          </div>
        ) : null}
        {resultArtworks.length > 0 ? (
          <div>
            {sectionTitle("Obras")}
            <ul className="m-0 list-none p-0">
              {resultArtworks.map(renderArtwork)}
            </ul>
          </div>
        ) : null}
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
            {renderPanelContent()}
          </div>
        </div>
      )}
    </div>
  );
}
