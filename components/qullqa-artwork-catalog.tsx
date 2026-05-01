import { Search } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

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
  medium,
  page,
  pageSize,
}: {
  basePath: "/qullqa-gallery";
  q?: string | null;
  medium?: string | null;
  page?: number;
  pageSize?: number;
}): string {
  const params = new URLSearchParams();
  const trimmedQ = q?.trim();
  const trimmedMedium = medium?.trim();

  if (trimmedQ) params.set("q", trimmedQ);
  if (trimmedMedium) params.set("medium", trimmedMedium);
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
  slug: string | null,
): string | null {
  if (!slug) return null;
  return mediums.find((medium) => medium.slug === slug)?.label ?? slug;
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
  const q = appliedFilters.q ?? "";
  const selectedMedium = appliedFilters.medium;
  const hasActiveFilters = Boolean(q.trim() || selectedMedium);
  const selectedMediumLabel = mediumLabelForSlug(mediums, selectedMedium);
  const pageNumbers = visiblePages(pagination.page, pagination.totalPages);

  const linkBase = {
    basePath,
    q,
    pageSize: pagination.pageSize,
  };

  return (
    <div className="space-y-6 md:space-y-8 [font-family:var(--font-manrope)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="min-w-0 shrink">{title}</div>
        <form
          action={`${basePath}/obras`}
          className="relative w-full md:max-w-[min(100%,22rem)] md:shrink-0 lg:max-w-sm"
        >
          {selectedMedium ? (
            <input type="hidden" name="medium" value={selectedMedium} />
          ) : null}
          <label htmlFor="qullqa-artwork-search" className="sr-only">
            Buscar obras
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            id="qullqa-artwork-search"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Buscar por título, artista, medio…"
            autoComplete="off"
            className="h-10 w-full rounded-lg border border-border/80 bg-background pl-10 pr-24 text-sm text-foreground shadow-xs outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 inline-flex h-8 -translate-y-1/2 items-center justify-center rounded-md bg-foreground px-3 text-xs font-medium text-background transition hover:bg-foreground/90"
          >
            Buscar
          </button>
        </form>
      </div>

      <div className="lg:flex lg:items-start lg:gap-8">
        <aside className="mb-6 w-full max-w-full shrink-0 lg:sticky lg:top-24 lg:mb-8 lg:w-64">
          <div className="rounded-lg border border-border/80 bg-card/40 shadow-sm">
            <div className="border-b border-border/60 bg-background/95 px-4 pb-3 pt-4 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">Medios</p>
                {hasActiveFilters ? (
                  <Link
                    href={`${basePath}/obras`}
                    className="rounded-md border border-border/80 bg-background px-2 py-1 text-xs font-medium text-foreground shadow-xs transition hover:bg-muted"
                  >
                    Limpiar
                  </Link>
                ) : null}
              </div>
              {selectedMediumLabel ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Filtrando por {selectedMediumLabel}.
                </p>
              ) : null}
            </div>
            <div className="max-h-[min(60dvh,28rem)] overflow-y-auto px-3 py-3 [scrollbar-gutter:stable]">
              <div className="flex flex-col gap-1">
                <Link
                  href={buildObrasHref({ ...linkBase, medium: null })}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition",
                    selectedMedium == null
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <span>Todos</span>
                </Link>
                {mediums.map((medium) => {
                  const active = selectedMedium === medium.slug;
                  return (
                    <Link
                      key={medium.slug}
                      href={buildObrasHref({
                        ...linkBase,
                        medium: medium.slug,
                      })}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition",
                        active
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      <span className="min-w-0 truncate">{medium.label}</span>
                      <span
                        className={cn(
                          "shrink-0 text-xs tabular-nums",
                          active ? "text-background/75" : "text-muted-foreground",
                        )}
                      >
                        {medium.artworkCount}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>{resultSummary(pagination)}</p>
            {hasActiveFilters ? (
              <p className="min-w-0 truncate">
                {q.trim() ? `Búsqueda: "${q.trim()}"` : null}
                {q.trim() && selectedMediumLabel ? " · " : null}
                {selectedMediumLabel ? `Medio: ${selectedMediumLabel}` : null}
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
                  <li key={artwork.slug} className="flex min-h-0 min-w-0 w-full">
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
                  medium: selectedMedium,
                  page: Math.max(1, pagination.page - 1),
                })}
                aria-disabled={pagination.page <= 1}
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
                    medium: selectedMedium,
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
                  medium: selectedMedium,
                  page: Math.min(pagination.totalPages, pagination.page + 1),
                })}
                aria-disabled={pagination.page >= pagination.totalPages}
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
