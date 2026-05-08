"use client";

import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { ArtworkCard } from "@/components/artwork-card";
import type {
  DearteenlineaAppliedArtworkFilters,
  DearteenlineaFilterOption,
  DearteenlineaObrasPagination,
} from "@/lib/dearteenlinea-api";
import { artistDisplayName } from "@/lib/artwork-utils";
import type { Artist } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";
import { cn } from "@/lib/utils";

type DearteArtworkCatalogProps = {
  title: ReactNode;
  artworks: Artwork[];
  artists: Artist[];
  categories: DearteenlineaFilterOption[];
  mediums: DearteenlineaFilterOption[];
  pagination: DearteenlineaObrasPagination;
  appliedFilters: DearteenlineaAppliedArtworkFilters;
  basePath: "/dearteenlinea";
};

function artistForSlug(artists: Artist[], slug: string): Artist | undefined {
  return artists.find((artist) => artist.slug === slug);
}

function buildObrasHref({
  basePath,
  search,
  categorias,
  medios,
  page,
}: {
  basePath: "/dearteenlinea";
  search?: string;
  categorias?: string[];
  medios?: string[];
  page?: number;
}): string {
  const params = new URLSearchParams();
  const trimmedSearch = search?.trim();
  const cleanCategorias = [...new Set((categorias ?? []).map((item) => item.trim()).filter(Boolean))];
  const cleanMedios = [...new Set((medios ?? []).map((item) => item.trim()).filter(Boolean))];

  if (trimmedSearch) params.set("search", trimmedSearch);
  if (cleanCategorias.length > 0) params.set("categorias", cleanCategorias.join(","));
  if (cleanMedios.length > 0) params.set("medios", cleanMedios.join(","));
  if (page && page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `${basePath}/obras?${query}` : `${basePath}/obras`;
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

function FilterCheckbox({
  id,
  checked,
  onCheckedChange,
  label,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: () => void;
  label: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-2 rounded-md py-1 text-sm leading-snug text-foreground hover:bg-muted/50"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onCheckedChange}
        className="mt-0.5 size-4 shrink-0 rounded border border-border accent-foreground"
      />
      <span>{label}</span>
    </label>
  );
}

function FiltersBody({
  idSuffix,
  categories,
  mediums,
  selectedCategories,
  selectedMediums,
  onToggleCategory,
  onToggleMedium,
}: {
  idSuffix: "m" | "d";
  categories: DearteenlineaFilterOption[];
  mediums: DearteenlineaFilterOption[];
  selectedCategories: Set<string>;
  selectedMediums: Set<string>;
  onToggleCategory: (slug: string) => void;
  onToggleMedium: (slug: string) => void;
}) {
  return (
    <div className="space-y-5">
      <fieldset className="space-y-1.5">
        <legend className="mb-1 block text-xs font-medium text-muted-foreground">
          Categoría
        </legend>
        <div className="flex flex-col gap-0.5">
          {categories.map((category, index) => {
            const id = `dearte-artwork-filter-cat-${idSuffix}-${index}`;
            return (
              <FilterCheckbox
                key={category.slug}
                id={id}
                checked={selectedCategories.has(category.slug)}
                onCheckedChange={() => onToggleCategory(category.slug)}
                label={category.label}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-1.5">
        <legend className="mb-1 block text-xs font-medium text-muted-foreground">
          Medio
        </legend>
        <div className="flex flex-col gap-0.5">
          {mediums.map((medium, index) => {
            const id = `dearte-artwork-filter-med-${idSuffix}-${index}`;
            return (
              <FilterCheckbox
                key={medium.slug}
                id={id}
                checked={selectedMediums.has(medium.slug)}
                onCheckedChange={() => onToggleMedium(medium.slug)}
                label={medium.label}
              />
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

export function DearteArtworkCatalog({
  title,
  artworks,
  artists,
  categories,
  mediums,
  pagination,
  appliedFilters,
  basePath,
}: DearteArtworkCatalogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState(appliedFilters.search);
  const [selectedCategories, setSelectedCategories] = useState(
    () => new Set(appliedFilters.categorias),
  );
  const [selectedMediums, setSelectedMediums] = useState(
    () => new Set(appliedFilters.medios),
  );

  useEffect(() => {
    const trimmedDraft = searchDraft.trim();
    const committedSearch = appliedFilters.search.trim();
    const sameSearch = trimmedDraft === committedSearch;

    if (!sameSearch) {
      const timer = window.setTimeout(() => {
        startTransition(() => {
          router.replace(
            buildObrasHref({
              basePath,
              search: trimmedDraft,
              categorias: [...selectedCategories],
              medios: [...selectedMediums],
              page: 1,
            }),
            { scroll: false },
          );
        });
      }, 250);

      return () => window.clearTimeout(timer);
    }
  }, [
    appliedFilters.search,
    basePath,
    router,
    searchDraft,
    selectedCategories,
    selectedMediums,
  ]);

  const hasActiveFilters =
    searchDraft.trim().length > 0 ||
    selectedCategories.size > 0 ||
    selectedMediums.size > 0;

  function navigate(next: {
    search?: string;
    categorias?: Set<string>;
    medios?: Set<string>;
    page?: number;
  }) {
    startTransition(() => {
      router.replace(
        buildObrasHref({
          basePath,
          search: next.search ?? searchDraft,
          categorias: [...(next.categorias ?? selectedCategories)],
          medios: [...(next.medios ?? selectedMediums)],
          page: next.page,
        }),
        { scroll: false },
      );
    });
  }

  function toggleCategory(slug: string) {
    const next = new Set(selectedCategories);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setSelectedCategories(next);
    navigate({ categorias: next, page: 1 });
  }

  function toggleMedium(slug: string) {
    const next = new Set(selectedMediums);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setSelectedMediums(next);
    navigate({ medios: next, page: 1 });
  }

  function clearFilters() {
    setSearchDraft("");
    const emptyCategories = new Set<string>();
    const emptyMediums = new Set<string>();
    setSelectedCategories(emptyCategories);
    setSelectedMediums(emptyMediums);
    startTransition(() => {
      router.replace(`${basePath}/obras`, { scroll: false });
    });
  }

  const pageNumbers = useMemo(
    () => visiblePages(pagination.page, pagination.totalPages),
    [pagination.page, pagination.totalPages],
  );

  const filtersIntro = (
    <>
      Sin marcar ninguna casilla en categoría o medio se muestran todas las
      opciones de ese criterio.
    </>
  );

  const clearFiltersButtonClass = cn(
    "shrink-0 rounded-md border px-2 py-1 text-xs font-medium transition",
    hasActiveFilters
      ? "border-border/80 bg-background text-foreground shadow-xs hover:bg-muted"
      : "cursor-not-allowed border-transparent bg-muted/30 text-muted-foreground/50",
  );

  const filterProps = {
    categories,
    mediums,
    selectedCategories,
    selectedMediums,
    onToggleCategory: toggleCategory,
    onToggleMedium: toggleMedium,
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="min-w-0 shrink">{title}</div>
        <div className="relative w-full md:max-w-[min(100%,18rem)] md:shrink-0 lg:max-w-xs">
          <label htmlFor="dearte-artwork-search" className="sr-only">
            Buscar obras
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            id="dearte-artwork-search"
            type="search"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Buscar por título, artista o medio…"
            autoComplete="off"
            className="h-10 w-full rounded-lg border border-border/80 bg-background pl-10 pr-4 text-sm text-foreground shadow-xs outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>
      </div>

      <div className="lg:flex lg:items-start lg:gap-8">
        <details
          className="mb-4 overflow-hidden rounded-lg border border-border/80 bg-card/40 lg:hidden"
          onToggle={(e) => setMobileFiltersOpen(e.currentTarget.open)}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
            <span className="min-w-0">Filtros</span>
            <span className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                disabled={!hasActiveFilters}
                aria-label="Limpiar filtros"
                className={clearFiltersButtonClass}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (hasActiveFilters) clearFilters();
                }}
              >
                Limpiar
              </button>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  mobileFiltersOpen && "rotate-180",
                )}
                aria-hidden
              />
            </span>
          </summary>
          <div className="flex max-h-[min(68dvh,calc(100dvh-10rem-env(safe-area-inset-bottom,0px)))] min-h-0 flex-col overflow-hidden border-t border-border/60">
            <div className="shrink-0 border-b border-border/60 bg-background/95 px-4 pb-3 pt-3 backdrop-blur-sm">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {filtersIntro} Usa el desplazamiento debajo para ver categorías y
                medios.
              </p>
            </div>
            <div className="min-h-0 flex-1 scroll-pb-6 overflow-y-auto overscroll-y-auto px-4 pt-3 [scrollbar-gutter:stable] pb-[calc(3rem+env(safe-area-inset-bottom,0px))]">
              <FiltersBody {...filterProps} idSuffix="m" />
            </div>
          </div>
        </details>

        <aside className="mb-6 hidden min-h-0 w-64 max-w-full shrink-0 lg:sticky lg:top-24 lg:mb-8 lg:flex lg:max-h-[calc(100svh-6rem-2rem-env(safe-area-inset-bottom,0px))] lg:flex-col lg:self-start">
          <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border/80 bg-card/40 shadow-sm">
            <div className="shrink-0 border-b border-border/60 bg-background/95 px-4 pb-3 pt-4 backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">Filtros</p>
                <button
                  type="button"
                  disabled={!hasActiveFilters}
                  aria-label="Limpiar filtros"
                  className={clearFiltersButtonClass}
                  onClick={clearFilters}
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
              <FiltersBody {...filterProps} idSuffix="d" />
            </div>
          </div>
        </aside>

        <div className={cn("min-w-0 flex-1 space-y-4", isPending && "opacity-70 transition-opacity")}>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>{resultSummary(pagination)}</p>
            {hasActiveFilters ? (
              <p className="min-w-0 truncate">
                {searchDraft.trim() ? `Búsqueda: "${searchDraft.trim()}"` : null}
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
                href={buildObrasHref({
                  basePath,
                  search: searchDraft,
                  categorias: [...selectedCategories],
                  medios: [...selectedMediums],
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
                    basePath,
                    search: searchDraft,
                    categorias: [...selectedCategories],
                    medios: [...selectedMediums],
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
                href={buildObrasHref({
                  basePath,
                  search: searchDraft,
                  categorias: [...selectedCategories],
                  medios: [...selectedMediums],
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
