"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { buildDearteObrasHref } from "@/lib/dearte-obras-url";

type DearteArtworkSearchProps = {
  searchValue: string;
  selectedCategories: string[];
  selectedMediums: string[];
  selectedPriceMin?: number | null;
  selectedPriceMax?: number | null;
  catalogPath: string;
  hideCategoryFilters?: boolean;
  hideMediumFilters?: boolean;
};

function valuesFromKey(key: string): string[] {
  return key ? key.split(",").filter(Boolean) : [];
}

export function DearteArtworkSearch({
  searchValue,
  selectedCategories,
  selectedMediums,
  selectedPriceMin,
  selectedPriceMax,
  catalogPath,
  hideCategoryFilters = false,
  hideMediumFilters = false,
}: DearteArtworkSearchProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [searchDraft, setSearchDraft] = useState(searchValue);
  const selectedCategoriesKey = selectedCategories.join(",");
  const selectedMediumsKey = selectedMediums.join(",");

  const categorias = useMemo(
    () => (hideCategoryFilters ? [] : valuesFromKey(selectedCategoriesKey)),
    [hideCategoryFilters, selectedCategoriesKey],
  );
  const medios = useMemo(
    () => (hideMediumFilters ? [] : valuesFromKey(selectedMediumsKey)),
    [hideMediumFilters, selectedMediumsKey],
  );

  useEffect(() => {
    const trimmedDraft = searchDraft.trim();
    const committedSearch = searchValue.trim();
    if (trimmedDraft === committedSearch) return;

    const timer = window.setTimeout(() => {
      startTransition(() => {
        router.replace(
          buildDearteObrasHref({
            catalogPath,
            search: trimmedDraft,
            categorias,
            medios,
            precioMin: selectedPriceMin,
            precioMax: selectedPriceMax,
            page: 1,
          }),
          { scroll: false },
        );
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [
    catalogPath,
    categorias,
    medios,
    router,
    searchDraft,
    searchValue,
    selectedPriceMax,
    selectedPriceMin,
  ]);

  return (
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
  );
}
