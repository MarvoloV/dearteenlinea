"use client";

import { ChevronDown, Search } from "lucide-react";
import { useCallback, useMemo, useState, type ReactNode } from "react";

import { ArtworkCard } from "@/components/artwork-card";
import { PriceRangeSlider } from "@/components/price-range-slider";
import {
  dearteCategoryOptions,
  mediumsDearteenlinea,
  mediumsQullqaGallery,
  priceSliderDomainMax,
  priceSliderDomainMin,
  techniquesDearteenlinea,
  techniquesQullqaGallery,
} from "@/lib/artwork-taxonomy";
import {
  artistBySlug,
  artistDisplayName,
  matchesArtworkQuery,
  matchesPriceRangeFilter,
} from "@/lib/artwork-utils";
import type { Artist } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";
import type { ArtworkDearteCategory } from "@/lib/types/artwork";
import { cn } from "@/lib/utils";

export type ArtworkCatalogFlow = "dearteenlinea" | "qullqa-gallery";

type ArtworkCatalogProps = {
  title: ReactNode;
  artworks: Artwork[];
  artists: Artist[];
  basePath: "/dearteenlinea" | "/qullqa-gallery";
  flow: ArtworkCatalogFlow;
  nameClassName?: string;
  searchInputClassName?: string;
  /** Desde `?medio=` (ya validado en la página). */
  initialMedio?: string;
  /** Desde `?categoria=` solo dearteenlinea (ya validado). */
  initialCategoria?: ArtworkDearteCategory;
};

function filterFields(flow: ArtworkCatalogFlow): {
  mediums: readonly string[];
  techniques: readonly string[];
} {
  if (flow === "dearteenlinea") {
    return {
      mediums: mediumsDearteenlinea,
      techniques: techniquesDearteenlinea,
    };
  }
  return {
    mediums: mediumsQullqaGallery,
    techniques: techniquesQullqaGallery,
  };
}

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function FilterCheckbox({
  id,
  checked,
  onCheckedChange,
  label,
  className,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: () => void;
  label: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-2 rounded-md py-1 text-sm leading-snug text-foreground hover:bg-muted/50",
        className,
      )}
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

type FiltersBodyProps = {
  idSuffix: "m" | "d";
  flow: ArtworkCatalogFlow;
  selectedCategories: Set<ArtworkDearteCategory>;
  onToggleCategory: (id: ArtworkDearteCategory) => void;
  selectedMediums: Set<string>;
  onToggleMedium: (m: string) => void;
  selectedTechniques: Set<string>;
  onToggleTechnique: (t: string) => void;
  priceRangeMin: number;
  priceRangeMax: number;
  onPriceRangeChange: (min: number, max: number) => void;
  mediums: readonly string[];
  techniques: readonly string[];
  labelClassName?: string;
};

function FiltersBody({
  idSuffix,
  flow,
  selectedCategories,
  onToggleCategory,
  selectedMediums,
  onToggleMedium,
  selectedTechniques,
  onToggleTechnique,
  priceRangeMin,
  priceRangeMax,
  onPriceRangeChange,
  mediums,
  techniques,
  labelClassName,
}: FiltersBodyProps) {
  const groupClass = "space-y-1.5";
  const legendClass = cn(
    "mb-1 block text-xs font-medium text-muted-foreground",
    labelClassName,
  );

  return (
    <div className="space-y-5">
      {flow === "dearteenlinea" ? (
        <fieldset className={groupClass}>
          <legend className={legendClass}>Categoría</legend>
          <div className="flex flex-col gap-0.5">
            {dearteCategoryOptions.map((o) => {
              const id = `artwork-filter-cat-${idSuffix}-${o.id}`;
              return (
                <FilterCheckbox
                  key={o.id}
                  id={id}
                  checked={selectedCategories.has(o.id)}
                  onCheckedChange={() => onToggleCategory(o.id)}
                  label={o.label}
                  className={labelClassName}
                />
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <fieldset className={groupClass}>
        <legend className={legendClass}>Medio</legend>
        <div className="flex flex-col gap-0.5">
          {mediums.map((m, i) => {
            const id = `artwork-filter-med-${idSuffix}-${i}`;
            return (
              <FilterCheckbox
                key={m}
                id={id}
                checked={selectedMediums.has(m)}
                onCheckedChange={() => onToggleMedium(m)}
                label={m}
                className={labelClassName}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset className={groupClass}>
        <legend className={legendClass}>Técnica</legend>
        <div className="flex flex-col gap-0.5">
          {techniques.map((t, i) => {
            const id = `artwork-filter-tech-${idSuffix}-${i}`;
            return (
              <FilterCheckbox
                key={t}
                id={id}
                checked={selectedTechniques.has(t)}
                onCheckedChange={() => onToggleTechnique(t)}
                label={t}
                className={labelClassName}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset className={groupClass}>
        <legend className={legendClass}>Precio (USD)</legend>
        <PriceRangeSlider
          idSuffix={idSuffix}
          valueMin={priceRangeMin}
          valueMax={priceRangeMax}
          onChange={onPriceRangeChange}
          labelClassName={labelClassName}
        />
        <p className="mt-2 pb-0.5 text-[11px] leading-relaxed text-muted-foreground">
          Con el rango completo se incluyen también obras sin precio numérico.
          Al acotar el rango solo se muestran obras con precio en USD dentro del
          intervalo.
        </p>
      </fieldset>
    </div>
  );
}

export function ArtworkCatalog({
  title,
  artworks,
  artists,
  basePath,
  flow,
  nameClassName,
  searchInputClassName,
  initialMedio,
  initialCategoria,
}: ArtworkCatalogProps) {
  const { mediums, techniques } = filterFields(flow);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<
    Set<ArtworkDearteCategory>
  >(() =>
    flow === "dearteenlinea" && initialCategoria
      ? new Set<ArtworkDearteCategory>([initialCategoria])
      : new Set(),
  );
  const [selectedMediums, setSelectedMediums] = useState<Set<string>>(() => {
    if (initialMedio && mediums.includes(initialMedio)) {
      return new Set([initialMedio]);
    }
    return new Set();
  });
  const [selectedTechniques, setSelectedTechniques] = useState<Set<string>>(
    () => new Set(),
  );
  const [priceRangeMin, setPriceRangeMin] = useState(priceSliderDomainMin);
  const [priceRangeMax, setPriceRangeMax] = useState(priceSliderDomainMax);

  const onToggleCategory = useCallback((id: ArtworkDearteCategory) => {
    setSelectedCategories((s) => toggleInSet(s, id));
  }, []);
  const onToggleMedium = useCallback((m: string) => {
    setSelectedMediums((s) => toggleInSet(s, m));
  }, []);
  const onToggleTechnique = useCallback((t: string) => {
    setSelectedTechniques((s) => toggleInSet(s, t));
  }, []);
  const onPriceRangeChange = useCallback((min: number, max: number) => {
    setPriceRangeMin(min);
    setPriceRangeMax(max);
  }, []);

  const hasActiveFilters = useMemo(() => {
    const priceFiltered =
      priceRangeMin > priceSliderDomainMin ||
      priceRangeMax < priceSliderDomainMax;
    return (
      selectedCategories.size > 0 ||
      selectedMediums.size > 0 ||
      selectedTechniques.size > 0 ||
      priceFiltered ||
      search.trim().length > 0
    );
  }, [
    search,
    selectedCategories,
    selectedMediums,
    selectedTechniques,
    priceRangeMin,
    priceRangeMax,
  ]);

  const clearFilters = useCallback(() => {
    setSelectedCategories(new Set());
    setSelectedMediums(new Set());
    setSelectedTechniques(new Set());
    setPriceRangeMin(priceSliderDomainMin);
    setPriceRangeMax(priceSliderDomainMax);
    setSearch("");
  }, []);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      const artist = artistBySlug(artists, a.artistSlug);
      if (!matchesArtworkQuery(a, artist, search)) return false;

      if (flow === "dearteenlinea" && selectedCategories.size > 0) {
        if (!a.category || !selectedCategories.has(a.category)) return false;
      }

      if (selectedMediums.size > 0 && !selectedMediums.has(a.medium)) {
        return false;
      }
      if (selectedTechniques.size > 0 && !selectedTechniques.has(a.technique)) {
        return false;
      }
      if (!matchesPriceRangeFilter(a, priceRangeMin, priceRangeMax)) {
        return false;
      }

      return true;
    });
  }, [
    artworks,
    artists,
    search,
    flow,
    selectedCategories,
    selectedMediums,
    selectedTechniques,
    priceRangeMin,
    priceRangeMax,
  ]);

  const filterPropsMobile: FiltersBodyProps = {
    idSuffix: "m",
    flow,
    selectedCategories,
    onToggleCategory,
    selectedMediums,
    onToggleMedium,
    selectedTechniques,
    onToggleTechnique,
    priceRangeMin,
    priceRangeMax,
    onPriceRangeChange,
    mediums,
    techniques,
    labelClassName: searchInputClassName,
  };
  const filterPropsDesktop: FiltersBodyProps = {
    idSuffix: "d",
    flow,
    selectedCategories,
    onToggleCategory,
    selectedMediums,
    onToggleMedium,
    selectedTechniques,
    onToggleTechnique,
    priceRangeMin,
    priceRangeMax,
    onPriceRangeChange,
    mediums,
    techniques,
    labelClassName: searchInputClassName,
  };

  const filtersIntro = (
    <>
      Sin marcar ninguna casilla en categoría, medio o técnica se muestran todas
      las opciones de ese criterio.
    </>
  );

  const clearFiltersButtonClass = cn(
    "shrink-0 rounded-md border px-2 py-1 text-xs font-medium transition",
    hasActiveFilters
      ? "border-border/80 bg-background text-foreground shadow-xs hover:bg-muted"
      : "cursor-not-allowed border-transparent bg-muted/30 text-muted-foreground/50",
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="min-w-0 shrink">{title}</div>
        <div className="relative w-full md:max-w-[min(100%,18rem)] md:shrink-0 lg:max-w-xs">
          <label htmlFor="artwork-search" className="sr-only">
            Buscar obras
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            id="artwork-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, artista, técnica…"
            autoComplete="off"
            className={cn(
              "h-10 w-full rounded-lg border border-border/80 bg-background pl-10 pr-4 text-sm text-foreground shadow-xs outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
              searchInputClassName,
            )}
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
                className={cn(clearFiltersButtonClass, searchInputClassName)}
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
                {filtersIntro} Usa el desplazamiento debajo para ver categorías,
                medios, técnica y precio.
              </p>
            </div>
            <div className="min-h-0 flex-1 scroll-pb-6 overflow-y-auto overscroll-y-auto px-4 pt-3 [scrollbar-gutter:stable] pb-[calc(3rem+env(safe-area-inset-bottom,0px))]">
              <FiltersBody {...filterPropsMobile} />
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
                  className={cn(clearFiltersButtonClass, searchInputClassName)}
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
              <FiltersBody {...filterPropsDesktop} />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ninguna obra coincide con tu búsqueda o filtros.
            </p>
          ) : (
            <ul className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 xl:gap-5">
              {filtered.map((artwork) => {
                const artist = artistBySlug(artists, artwork.artistSlug);
                const artistName = artistDisplayName(artist);
                return (
                  <li key={artwork.slug} className="flex min-h-0 min-w-0 w-full">
                    <ArtworkCard
                      artwork={artwork}
                      artistName={artistName}
                      href={`${basePath}/obras/${artwork.slug}`}
                      nameClassName={nameClassName}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
