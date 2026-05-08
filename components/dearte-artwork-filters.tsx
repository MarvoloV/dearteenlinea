"use client";

import { ChevronDown } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { DearteenlineaFilterOption } from "@/lib/dearteenlinea-api";
import { buildDearteObrasHref } from "@/lib/dearte-obras-url";
import { cn } from "@/lib/utils";

type DearteArtworkFiltersProps = {
  categories: DearteenlineaFilterOption[];
  mediums: DearteenlineaFilterOption[];
  selectedCategories: string[];
  selectedMediums: string[];
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
  onToggleCategory,
  onToggleMedium,
  hideCategoryFilters,
  hideMediumFilters,
}: {
  idSuffix: "m" | "d";
  categories: DearteenlineaFilterOption[];
  mediums: DearteenlineaFilterOption[];
  selectedCategories: Set<string>;
  selectedMediums: Set<string>;
  onToggleCategory: (slug: string) => void;
  onToggleMedium: (slug: string) => void;
  hideCategoryFilters?: boolean;
  hideMediumFilters?: boolean;
}) {
  return (
    <div className="space-y-5">
      {!hideCategoryFilters ? (
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
      ) : null}

      {!hideMediumFilters ? (
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
      ) : null}
    </div>
  );
}

export function DearteArtworkFilters({
  categories,
  mediums,
  selectedCategories,
  selectedMediums,
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

  function categoriasForQuery(next?: Set<string>): string[] {
    return hideCategoryFilters ? [] : [...(next ?? localCategories)];
  }

  function mediosForQuery(next?: Set<string>): string[] {
    return hideMediumFilters ? [] : [...(next ?? localMediums)];
  }

  function navigate(next: {
    categorias?: Set<string>;
    medios?: Set<string>;
  }) {
    startTransition(() => {
      router.replace(
        buildDearteObrasHref({
          catalogPath,
          search,
          categorias: categoriasForQuery(next.categorias),
          medios: mediosForQuery(next.medios),
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

  function clearFilters() {
    setLocalCategories(new Set());
    setLocalMediums(new Set());
    startTransition(() => {
      router.replace(clearPath, { scroll: false });
    });
  }

  const hasActiveFilters =
    search.trim().length > 0 ||
    localCategories.size > 0 ||
    localMediums.size > 0;

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
    onToggleCategory: toggleCategory,
    onToggleMedium: toggleMedium,
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
