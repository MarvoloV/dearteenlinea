"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { PriceRangeSlider } from "@/components/price-range-slider";
import {
  priceSliderDomainMax,
  priceSliderDomainMin,
} from "@/lib/artwork-taxonomy";
import type { DearteenlineaFilterOption } from "@/lib/dearteenlinea-api";
import { buildDearteObrasHref } from "@/lib/dearte-obras-url";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type DearteArtworkFiltersProps = {
  categories: DearteenlineaFilterOption[];
  mediums: DearteenlineaFilterOption[];
  selectedCategories: string[];
  selectedMediums: string[];
  selectedPriceMin: number;
  selectedPriceMax: number;
  priceDomainMin?: number;
  priceDomainMax?: number;
  search: string;
  catalogPath: string;
  clearPath: string;
  hideCategoryFilters?: boolean;
  hideMediumFilters?: boolean;
};

function setFromKey(key: string): Set<string> {
  return new Set(key ? key.split(",").filter(Boolean) : []);
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
  selectedPriceMin,
  selectedPriceMax,
  priceDomainMin,
  priceDomainMax,
  onToggleCategory,
  onToggleMedium,
  onPriceRangeChange,
  hideCategoryFilters,
  hideMediumFilters,
}: {
  idSuffix: "m" | "d";
  categories: DearteenlineaFilterOption[];
  mediums: DearteenlineaFilterOption[];
  selectedCategories: Set<string>;
  selectedMediums: Set<string>;
  selectedPriceMin: number;
  selectedPriceMax: number;
  priceDomainMin: number;
  priceDomainMax: number;
  onToggleCategory: (slug: string) => void;
  onToggleMedium: (slug: string) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  hideCategoryFilters?: boolean;
  hideMediumFilters?: boolean;
}) {
  const groupClass = "space-y-1.5";
  const legendClass = "mb-1 block text-xs font-medium text-muted-foreground";

  return (
    <div className="space-y-5">
      {!hideCategoryFilters ? (
        <fieldset className={groupClass}>
          <legend className={legendClass}>Categoría</legend>
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
      ) : null}

      {!hideMediumFilters ? (
        <fieldset className={groupClass}>
          <legend className={legendClass}>Medio</legend>
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
      ) : null}

      <fieldset className={groupClass}>
        <legend className={legendClass}>Precio (USD)</legend>
        <PriceRangeSlider
          idSuffix={idSuffix}
          valueMin={selectedPriceMin}
          valueMax={selectedPriceMax}
          domainMin={priceDomainMin}
          domainMax={priceDomainMax}
          onChange={onPriceRangeChange}
        />
        <p className="mt-2 pb-0.5 text-[11px] leading-relaxed text-muted-foreground">
          Con el rango completo se incluyen también obras sin precio numérico.
          Al acotar el rango solo se muestran obras con precio o valor estimado
          en USD que se cruce con el intervalo.
        </p>
      </fieldset>
    </div>
  );
}

export function DearteArtworkFilters({
  categories,
  mediums,
  selectedCategories,
  selectedMediums,
  selectedPriceMin,
  selectedPriceMax,
  priceDomainMin = priceSliderDomainMin,
  priceDomainMax = priceSliderDomainMax,
  search,
  catalogPath,
  clearPath,
  hideCategoryFilters = false,
  hideMediumFilters = false,
}: DearteArtworkFiltersProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const selectedCategoriesKey = selectedCategories.join(",");
  const selectedMediumsKey = selectedMediums.join(",");
  const [localCategories, setLocalCategories] = useState(
    () => setFromKey(selectedCategoriesKey),
  );
  const [localMediums, setLocalMediums] = useState(
    () => setFromKey(selectedMediumsKey),
  );
  const [localPriceMin, setLocalPriceMin] = useState(selectedPriceMin);
  const [localPriceMax, setLocalPriceMax] = useState(selectedPriceMax);
  const debouncedPriceKey = useDebouncedValue(
    `${localPriceMin}|${localPriceMax}`,
    450,
  );

  function categoriasForQuery(next?: Set<string>): string[] {
    return hideCategoryFilters ? [] : [...(next ?? localCategories)];
  }

  function mediosForQuery(next?: Set<string>): string[] {
    return hideMediumFilters ? [] : [...(next ?? localMediums)];
  }

  function precioMinForQuery(nextMin?: number, nextMax?: number): number | null {
    const min = nextMin ?? localPriceMin;
    const max = nextMax ?? localPriceMax;
    return min > priceDomainMin || max < priceDomainMax ? min : null;
  }

  function precioMaxForQuery(nextMin?: number, nextMax?: number): number | null {
    const min = nextMin ?? localPriceMin;
    const max = nextMax ?? localPriceMax;
    return min > priceDomainMin || max < priceDomainMax ? max : null;
  }

  function navigate(next: {
    categorias?: Set<string>;
    medios?: Set<string>;
    precioMin?: number;
    precioMax?: number;
  }) {
    startTransition(() => {
      router.replace(
        buildDearteObrasHref({
          catalogPath,
          search,
          categorias: categoriasForQuery(next.categorias),
          medios: mediosForQuery(next.medios),
          precioMin: precioMinForQuery(next.precioMin, next.precioMax),
          precioMax: precioMaxForQuery(next.precioMin, next.precioMax),
          page: 1,
        }),
        { scroll: false },
      );
    });
  }

  function toggleCategory(slug: string) {
    const next = new Set(localCategories);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setLocalCategories(next);
    navigate({ categorias: next });
  }

  function toggleMedium(slug: string) {
    const next = new Set(localMediums);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setLocalMediums(next);
    navigate({ medios: next });
  }

  function changePriceRange(min: number, max: number) {
    setLocalPriceMin(min);
    setLocalPriceMax(max);
  }

  useEffect(() => {
    const [debouncedMinRaw, debouncedMaxRaw] = debouncedPriceKey.split("|");
    const debouncedMin = Number(debouncedMinRaw);
    const debouncedMax = Number(debouncedMaxRaw);

    if (!Number.isFinite(debouncedMin) || !Number.isFinite(debouncedMax)) return;
    if (debouncedMin === selectedPriceMin && debouncedMax === selectedPriceMax) {
      return;
    }

    startTransition(() => {
      router.replace(
        buildDearteObrasHref({
          catalogPath,
          search,
          categorias: hideCategoryFilters ? [] : [...localCategories],
          medios: hideMediumFilters ? [] : [...localMediums],
          precioMin:
            debouncedMin > priceDomainMin || debouncedMax < priceDomainMax
              ? debouncedMin
              : null,
          precioMax:
            debouncedMin > priceDomainMin || debouncedMax < priceDomainMax
              ? debouncedMax
              : null,
          page: 1,
        }),
        { scroll: false },
      );
    });
  }, [
    catalogPath,
    debouncedPriceKey,
    hideCategoryFilters,
    hideMediumFilters,
    localCategories,
    localMediums,
    priceDomainMax,
    priceDomainMin,
    router,
    search,
    selectedPriceMax,
    selectedPriceMin,
    startTransition,
  ]);

  function clearFilters() {
    setLocalCategories(new Set());
    setLocalMediums(new Set());
    setLocalPriceMin(priceDomainMin);
    setLocalPriceMax(priceDomainMax);
    startTransition(() => {
      router.replace(clearPath, { scroll: false });
    });
  }

  const hasActiveFilters =
    search.trim().length > 0 ||
    localCategories.size > 0 ||
    localMediums.size > 0 ||
    localPriceMin > priceDomainMin ||
    localPriceMax < priceDomainMax;

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
    selectedCategories: localCategories,
    selectedMediums: localMediums,
    selectedPriceMin: localPriceMin,
    selectedPriceMax: localPriceMax,
    priceDomainMin,
    priceDomainMax,
    onToggleCategory: toggleCategory,
    onToggleMedium: toggleMedium,
    onPriceRangeChange: changePriceRange,
    hideCategoryFilters,
    hideMediumFilters,
  };

  return (
    <>
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
    </>
  );
}
