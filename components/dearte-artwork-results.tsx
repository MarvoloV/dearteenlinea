import Link from "next/link";

import { ArtworkCard } from "@/components/artwork-card";
import type {
  DearteenlineaAppliedArtworkFilters,
  DearteenlineaObrasPagination,
} from "@/lib/dearteenlinea-api";
import { artistDisplayName } from "@/lib/artwork-utils";
import { buildDearteObrasHref } from "@/lib/dearte-obras-url";
import type { Artist } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";
import { cn } from "@/lib/utils";

type DearteArtworkResultsProps = {
  artworks: Artwork[];
  artists: Artist[];
  pagination: DearteenlineaObrasPagination;
  appliedFilters: DearteenlineaAppliedArtworkFilters;
  basePath: "/dearteenlinea";
  catalogPath: string;
  hideCategoryFilters?: boolean;
  hideMediumFilters?: boolean;
};

function artistForSlug(artists: Artist[], slug: string): Artist | undefined {
  return artists.find((artist) => artist.slug === slug);
}

function visiblePages(current: number, total: number): number[] {
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, start + 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function resultSummary(pagination: DearteenlineaObrasPagination): string {
  if (pagination.totalItems === 0) return "0 obras";
  const first = (pagination.page - 1) * pagination.pageSize + 1;
  const last = Math.min(
    pagination.totalItems,
    pagination.page * pagination.pageSize,
  );
  return `${first}-${last} de ${pagination.totalItems} obras`;
}

export function DearteArtworkResults({
  artworks,
  artists,
  pagination,
  appliedFilters,
  basePath,
  catalogPath,
  hideCategoryFilters = false,
  hideMediumFilters = false,
}: DearteArtworkResultsProps) {
  const pageNumbers = visiblePages(pagination.page, pagination.totalPages);
  const categorias = hideCategoryFilters ? [] : appliedFilters.categorias;
  const medios = hideMediumFilters ? [] : appliedFilters.medios;
  const hasActiveFilters =
    appliedFilters.search.trim().length > 0 ||
    categorias.length > 0 ||
    medios.length > 0 ||
    appliedFilters.precioMin !== null ||
    appliedFilters.precioMax !== null;

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{resultSummary(pagination)}</p>
        {hasActiveFilters ? (
          <p className="min-w-0 truncate">
            {appliedFilters.search.trim()
              ? `Búsqueda: "${appliedFilters.search.trim()}"`
              : null}
          </p>
        ) : null}
      </div>

      {artworks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
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
                  artistHref={artist?.web}
                  href={`${basePath}/obras/${artwork.slug}`}
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
            href={buildDearteObrasHref({
              catalogPath,
              search: appliedFilters.search,
              categorias,
              medios,
              precioMin: appliedFilters.precioMin,
              precioMax: appliedFilters.precioMax,
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
              href={buildDearteObrasHref({
                catalogPath,
                search: appliedFilters.search,
                categorias,
                medios,
                precioMin: appliedFilters.precioMin,
                precioMax: appliedFilters.precioMax,
                page,
              })}
              aria-current={page === pagination.page ? "page" : undefined}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm font-medium transition",
                page === pagination.page
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/80 text-foreground hover:bg-muted",
              )}
            >
              {page}
            </Link>
          ))}
          <Link
            href={buildDearteObrasHref({
              catalogPath,
              search: appliedFilters.search,
              categorias,
              medios,
              precioMin: appliedFilters.precioMin,
              precioMax: appliedFilters.precioMax,
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
  );
}
