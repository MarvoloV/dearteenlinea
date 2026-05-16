"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";

import { ArtworkCard } from "@/components/artwork-card";
import { artistDisplayName } from "@/lib/artwork-utils";
import type {
  QullqaGalleryAppliedFilters,
  QullqaGalleryMediumFacet,
  QullqaGalleryPagination,
} from "@/lib/qullqa-gallery-api";
import type { Artist } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";
import { cn } from "@/lib/utils";

type QullqaArtworkCatalogProps = {
  title: ReactNode;
  artworks: Artwork[];
  artists: Artist[];
  mediums: QullqaGalleryMediumFacet[];
  pagination: QullqaGalleryPagination;
  appliedFilters: QullqaGalleryAppliedFilters;
  basePath: "/qullqa-gallery";
};

function artistForSlug(artists: Artist[], slug: string): Artist | undefined {
  return artists.find((artist) => artist.slug === slug);
}

function buildObrasHref({
  basePath,
  q,
  mediums,
  page,
  pageSize,
}: {
  basePath: "/qullqa-gallery";
  q?: string | null;
  mediums?: string[];
  page?: number;
  pageSize?: number;
}): string {
  const params = new URLSearchParams();
  const trimmedQ = q?.trim();

  if (trimmedQ) params.set("q", trimmedQ);
  if (mediums?.length) {
    mediums.forEach((m) => {
      const trimmed = m.trim();
      if (trimmed) params.append("medium", trimmed);
    });
  }
  if (page && page > 1) params.set("page", String(page));
  if (pageSize && pageSize !== 24) params.set("pageSize", String(pageSize));

  const query = params.toString();
  return query ? `${basePath}/obras?${query}` : `${basePath}/obras`;
}

function visiblePages(current: number, total: number): number[] {
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, start + 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function resultSummary(pagination: QullqaGalleryPagination): string {
  if (pagination.totalItems === 0) return "0 obras";
  const first = (pagination.page - 1) * pagination.pageSize + 1;
  const last = Math.min(
    pagination.totalItems,
    pagination.page * pagination.pageSize,
  );
  return `${first}-${last} de ${pagination.totalItems} obras`;
}

function mediumLabelForSlug(
  mediums: QullqaGalleryMediumFacet[],
  slug: string,
): string {
  return mediums.find((medium) => medium.slug === slug)?.label ?? slug;
}

function FilterCheckbox({
  id,
  checked,
  onCheckedChange,
  label,
  count,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-2 rounded-md py-1 text-sm leading-snug text-foreground hover:bg-muted/50 [font-family:var(--font-roboto)]"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onCheckedChange}
        className="mt-0.5 size-4 shrink-0 rounded border border-border accent-foreground"
      />
      <span className="min-w-0 flex-1">{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "shrink-0 text-xs tabular-nums",
            checked ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {count}
        </span>
      )}
    </label>
  );
}

export function QullqaArtworkCatalog({
  title,
  artworks,
  artists,
  mediums,
  pagination,
  appliedFilters,
  basePath,
}: QullqaArtworkCatalogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchDraft, setSearchDraft] = useState(appliedFilters.q ?? "");
  const [selectedMediums, setSelectedMediums] = useState(
    () => new Set(appliedFilters.mediums ?? []),
  );

  useEffect(() => {
    const trimmedDraft = searchDraft.trim();
    const committedSearch = appliedFilters.q?.trim() ?? "";

    if (trimmedDraft !== committedSearch) {
      const timer = window.setTimeout(() => {
        startTransition(() => {
          router.replace(
            buildObrasHref({
              basePath,
              q: trimmedDraft,
              mediums: [...selectedMediums],
              page: 1,
            }),
            { scroll: false },
          );
        });
      }, 400);
      return () => window.clearTimeout(timer);
    }
  }, [searchDraft, appliedFilters.q, basePath, selectedMediums, router]);

  useEffect(() => {
    const urlMediumValues = appliedFilters.mediums ?? [];
    startTransition(() => {
      setSelectedMediums((current) => {
        const urlMediums = new Set(urlMediumValues);
        const sameMediums =
          urlMediums.size === current.size &&
          [...urlMediums].every((m) => current.has(m));

        return sameMediums ? current : urlMediums;
      });
    });
  }, [appliedFilters.mediums, startTransition]);

  const hasActiveFilters = Boolean(
    searchDraft.trim() || selectedMediums.size > 0,
  );
  const selectedMediumLabels = [...selectedMediums].map((slug) =>
    mediumLabelForSlug(mediums, slug),
  );
  const pageNumbers = visiblePages(pagination.page, pagination.totalPages);

  const filtersIntro = (
    <>
      Sin marcar ninguna casilla en medio se muestran todas las opciones de ese
      criterio.
    </>
  );

  const clearFiltersButtonClass = cn(
    "shrink-0 rounded-md border px-2 py-1 text-xs font-medium transition",
    hasActiveFilters
      ? "border-border/80 bg-background text-foreground shadow-xs hover:bg-muted"
      : "cursor-not-allowed border-transparent bg-muted/30 text-muted-foreground/50",
  );

  const linkBase = {
    basePath,
    q: searchDraft.trim() || null,
    pageSize: pagination.pageSize,
  };

  function handleToggleMedium(slug: string) {
    const next = new Set(selectedMediums);
    if (next.has(slug)) {
      next.delete(slug);
    } else {
      next.add(slug);
    }
    setSelectedMediums(next);
    startTransition(() => {
      router.replace(
        buildObrasHref({
          ...linkBase,
          mediums: [...next],
          page: 1,
        }),
        { scroll: false },
      );
    });
  }

  function handleClearFilters() {
    setSearchDraft("");
    setSelectedMediums(new Set());
    startTransition(() => {
      router.replace(`${basePath}/obras`, { scroll: false });
    });
  }

  return (
    <div className="space-y-6 md:space-y-8 [font-family:var(--font-manrope)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="min-w-0 shrink">{title}</div>
        <div className="relative w-full md:max-w-[min(100%,22rem)] md:shrink-0 lg:max-w-sm">
          <label htmlFor="qullqa-artwork-search" className="sr-only">
            Buscar obras
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            id="qullqa-artwork-search"
            type="search"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Buscar por título, artista, medio…"
            autoComplete="off"
            className="h-10 w-full rounded-lg border border-border/80 bg-background pl-10 pr-4 text-sm text-foreground shadow-xs outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>
      </div>

      <div className="lg:flex lg:items-start lg:gap-8">
        <aside className="mb-6 min-h-0 w-full max-w-full shrink-0 lg:sticky lg:top-24 lg:mb-8 lg:flex lg:max-h-[calc(100svh-6rem-2rem-env(safe-area-inset-bottom,0px))] lg:w-64 lg:flex-col lg:self-start">
          <div className="flex max-h-[min(68dvh,calc(100dvh-10rem-env(safe-area-inset-bottom,0px)))] min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border/80 bg-card/40 shadow-sm lg:max-h-none">
            <div className="shrink-0 border-b border-border/60 bg-background/95 px-4 pb-3 pt-4 backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">Filtros</p>
                <button
                  type="button"
                  disabled={!hasActiveFilters}
                  aria-label="Limpiar filtros"
                  onClick={handleClearFilters}
                  className={clearFiltersButtonClass}
                >
                  Limpiar
                </button>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {filtersIntro} El listado de abajo se desplaza de forma
                independiente.
              </p>
            </div>
            <div className="min-h-0 flex-1 scroll-pb-6 overflow-y-auto overscroll-y-auto px-4 pt-4 [scrollbar-gutter:stable] pb-[calc(3rem+env(safe-area-inset-bottom,0px))]">
              <fieldset className="space-y-1.5">
                <legend className="mb-1 block text-xs font-medium text-muted-foreground">
                  Medio
                </legend>
                <div className="flex flex-col gap-0.5">
                  {mediums.map((medium, index) => (
                    <FilterCheckbox
                      key={medium.slug}
                      id={`qullqa-filter-medium-${index}`}
                      checked={selectedMediums.has(medium.slug)}
                      onCheckedChange={() => handleToggleMedium(medium.slug)}
                      label={medium.label}
                      count={medium.artworkCount}
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </aside>

        <div
          className={cn(
            "min-w-0 flex-1 space-y-4",
            isPending && "opacity-70 transition-opacity",
          )}
        >
          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>{resultSummary(pagination)}</p>
            {hasActiveFilters ? (
              <p className="min-w-0 truncate">
                {searchDraft.trim()
                  ? `Búsqueda: "${searchDraft.trim()}"`
                  : null}
                {searchDraft.trim() && selectedMediumLabels.length > 0
                  ? " · "
                  : null}
                {selectedMediumLabels.length > 0
                  ? `Medios: ${selectedMediumLabels.join(", ")}`
                  : null}
              </p>
            ) : null}
          </div>

          {artworks.length === 0 ? (
            <p className="rounded-lg border border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
              Ninguna obra coincide con tu búsqueda o filtros.
            </p>
          ) : (
            <ul className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 xl:gap-5">
              {artworks.map((artwork) => {
                const artist = artistForSlug(artists, artwork.artistSlug);
                return (
                  <li
                    key={artwork.slug}
                    className="flex min-h-0 min-w-0 w-full"
                  >
                    <ArtworkCard
                      artwork={artwork}
                      artistName={artistDisplayName(artist)}
                      href={`${basePath}/obras/${artwork.slug}`}
                      nameClassName="[font-family:var(--font-manrope)]"
                    />
                  </li>
                );
              })}
            </ul>
          )}

          {pagination.totalPages > 1 ? (
            <nav
              className="flex flex-wrap items-center justify-center gap-1 pt-2"
              aria-label="Paginación de obras"
            >
              <Link
                href={buildObrasHref({
                  ...linkBase,
                  mediums: [...selectedMediums],
                  page: Math.max(1, pagination.page - 1),
                })}
                className={cn(
                  "rounded-md border border-border/80 px-3 py-1.5 text-sm font-medium transition",
                  pagination.page <= 1
                    ? "pointer-events-none text-muted-foreground/45"
                    : "text-foreground hover:bg-muted",
                )}
              >
                Anterior
              </Link>
              {pageNumbers.map((page) => (
                <Link
                  key={page}
                  href={buildObrasHref({
                    ...linkBase,
                    mediums: [...selectedMediums],
                    page,
                  })}
                  aria-current={page === pagination.page ? "page" : undefined}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-md border text-sm font-medium transition",
                    page === pagination.page
                      ? "border-foreground bg-foreground text-background"
                      : "border-border/80 text-foreground hover:bg-muted",
                  )}
                >
                  {page}
                </Link>
              ))}
              <Link
                href={buildObrasHref({
                  ...linkBase,
                  mediums: [...selectedMediums],
                  page: Math.min(pagination.totalPages, pagination.page + 1),
                })}
                className={cn(
                  "rounded-md border border-border/80 px-3 py-1.5 text-sm font-medium transition",
                  pagination.page >= pagination.totalPages
                    ? "pointer-events-none text-muted-foreground/45"
                    : "text-foreground hover:bg-muted",
                )}
              >
                Siguiente
              </Link>
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}
