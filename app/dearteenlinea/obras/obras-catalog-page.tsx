import { Suspense } from "react";

import { DearteArtworkFilters } from "@/components/dearte-artwork-filters";
import { DearteArtworkResults } from "@/components/dearte-artwork-results";
import { DearteArtworkSearch } from "@/components/dearte-artwork-search";
import { FlowHeader } from "@/components/flow-header";
import { FiltersSkeleton, WorksGridSkeleton } from "@/components/loading-skeletons";
import {
  dearteCategoryApiSlugById,
  dearteCategoryApiSlugFromFilterValue,
  dearteCategoryIdFromSlug,
  deartePathSlug,
} from "@/lib/dearte-filter-slugs";
import {
  fetchDearteenlineaObrasFilters,
  fetchDearteenlineaObrasList,
  type DearteenlineaAppliedArtworkFilters,
  type DearteenlineaFilterOption,
  type DearteenlineaObrasListView,
  type DearteenlineaObrasPagination,
} from "@/lib/dearteenlinea-api";
import { dearteCategoryOptions, mediumsDearteenlinea } from "@/lib/artwork-taxonomy";
import {
  artistBySlug,
  matchesArtworkQuery,
} from "@/lib/artwork-utils";
import { mockArtistsDearteenlinea } from "@/lib/mock-artists";
import { mockArtworksDearteenlinea } from "@/lib/mock-artworks-dearteenlinea";
import type { ArtworkDearteCategory } from "@/lib/types/artwork";

export type ObrasSearchParams = Record<string, string | string[] | undefined>;

type DearteenlineaObrasCatalogPageProps = {
  searchParams: Promise<ObrasSearchParams>;
  routeCategory?: string;
  routeMedium?: string;
  catalogPath?: string;
  hideCategoryFilters?: boolean;
  hideMediumFilters?: boolean;
  fallbackInitialCategoria?: ArtworkDearteCategory;
  fallbackInitialMedio?: string;
};

type CatalogQuery = {
  apiCategories: string[];
  apiMediums: string[];
  apiSearch: string;
  apiPage: number;
  initialCategoria?: ArtworkDearteCategory;
  initialMedio?: string;
};

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseCsvParams(
  ...values: Array<string | string[] | undefined>
): string[] {
  const items = values.flatMap((value) => {
    const raw = firstParam(value)?.trim();
    if (!raw) return [];
    return raw.split(",").map((item) => item.trim()).filter(Boolean);
  });

  return [...new Set(items)];
}

function parsePageParam(value: string | string[] | undefined): number {
  const raw = Number(firstParam(value));
  if (!Number.isFinite(raw) || raw < 1) return 1;
  return Math.trunc(raw);
}

function normalizeCategoryParams(values: string[]): string[] {
  return [
    ...new Set(values.map(dearteCategoryApiSlugFromFilterValue).filter(Boolean)),
  ];
}

function firstCategoryId(values: string[]): ArtworkDearteCategory | undefined {
  for (const value of values) {
    const categoryId = dearteCategoryIdFromSlug(value);
    if (categoryId) return categoryId;
  }
  return undefined;
}

function mediumLabelFromFilterValue(value: string): string | undefined {
  const cleanValue = value.trim();
  if (!cleanValue) return undefined;
  const directMatch = mediumsDearteenlinea.find((medium) => medium === cleanValue);
  if (directMatch) return directMatch;
  return mediumsDearteenlinea.find(
    (medium) => deartePathSlug(medium) === cleanValue,
  );
}

function firstMediumLabel(values: string[]): string | undefined {
  for (const value of values) {
    const medium = mediumLabelFromFilterValue(value);
    if (medium) return medium;
  }
  return undefined;
}

function obrasTitle() {
  return (
    <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
      Obras curadas
    </h1>
  );
}

function localFilterOptions(): {
  categories: DearteenlineaFilterOption[];
  mediums: DearteenlineaFilterOption[];
} {
  return {
    categories: dearteCategoryOptions.map((category) => ({
      label: category.label,
      slug: dearteCategoryApiSlugById[category.id],
      count: mockArtworksDearteenlinea.filter(
        (artwork) => artwork.category === category.id,
      ).length,
    })),
    mediums: mediumsDearteenlinea.map((medium) => ({
      label: medium,
      slug: deartePathSlug(medium),
      count: mockArtworksDearteenlinea.filter(
        (artwork) => artwork.medium === medium,
      ).length,
    })),
  };
}

function mediumLabelsFromValues(values: string[], initialMedio?: string): string[] {
  const labels = values
    .map(mediumLabelFromFilterValue)
    .filter((medium): medium is string => Boolean(medium));

  if (labels.length === 0 && initialMedio) labels.push(initialMedio);
  return [...new Set(labels)];
}

function fallbackWorksList({
  query,
  hideCategoryFilters,
  hideMediumFilters,
}: {
  query: CatalogQuery;
  hideCategoryFilters: boolean;
  hideMediumFilters: boolean;
}): DearteenlineaObrasListView {
  const selectedCategories = hideCategoryFilters
    ? []
    : query.apiCategories
        .map(dearteCategoryIdFromSlug)
        .filter((category): category is ArtworkDearteCategory => Boolean(category));
  const selectedMediumLabels = hideMediumFilters
    ? []
    : mediumLabelsFromValues(query.apiMediums, query.initialMedio);

  const filtered = mockArtworksDearteenlinea.filter((artwork) => {
    const artist = artistBySlug(mockArtistsDearteenlinea, artwork.artistSlug);
    if (!matchesArtworkQuery(artwork, artist, query.apiSearch)) return false;
    if (
      selectedCategories.length > 0 &&
      (!artwork.category || !selectedCategories.includes(artwork.category))
    ) {
      return false;
    }
    if (
      selectedMediumLabels.length > 0 &&
      !selectedMediumLabels.includes(artwork.medium)
    ) {
      return false;
    }
    return true;
  });

  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(query.apiPage, totalPages);
  const start = (page - 1) * pageSize;
  const selectedCategorySlugs = selectedCategories.map(
    (category) => dearteCategoryApiSlugById[category],
  );
  const selectedMediumSlugs = hideMediumFilters ? [] : query.apiMediums;

  return {
    artworks: filtered.slice(start, start + pageSize),
    artists: mockArtistsDearteenlinea,
    pagination: {
      page,
      totalPages,
      totalItems: filtered.length,
      pageSize,
    },
    appliedFilters: {
      search: query.apiSearch,
      categorias: selectedCategorySlugs,
      medios: selectedMediumSlugs,
    },
  };
}

function catalogSearchKey(query: CatalogQuery): string {
  return [
    query.apiPage,
    query.apiSearch,
    query.apiCategories.join(","),
    query.apiMediums.join(","),
  ].join("|");
}

async function DearteArtworkFiltersSection({
  query,
  catalogPath,
  clearPath,
  hideCategoryFilters,
  hideMediumFilters,
}: {
  query: CatalogQuery;
  catalogPath: string;
  clearPath: string;
  hideCategoryFilters: boolean;
  hideMediumFilters: boolean;
}) {
  const filtersResult = await fetchDearteenlineaObrasFilters();
  const filters = filtersResult.ok ? filtersResult.data : localFilterOptions();

  return (
    <DearteArtworkFilters
      key={`dearte-filters-${query.apiSearch}-${query.apiCategories.join(",")}-${query.apiMediums.join(",")}`}
      categories={filters.categories}
      mediums={filters.mediums}
      selectedCategories={hideCategoryFilters ? [] : query.apiCategories}
      selectedMediums={hideMediumFilters ? [] : query.apiMediums}
      search={query.apiSearch}
      catalogPath={catalogPath}
      clearPath={clearPath}
      hideCategoryFilters={hideCategoryFilters}
      hideMediumFilters={hideMediumFilters}
    />
  );
}

async function DearteWorksListSection({
  query,
  catalogPath,
  hideCategoryFilters,
  hideMediumFilters,
}: {
  query: CatalogQuery;
  catalogPath: string;
  hideCategoryFilters: boolean;
  hideMediumFilters: boolean;
}) {
  const listResult = await fetchDearteenlineaObrasList({
    page: query.apiPage,
    perPage: 9,
    categorias: query.apiCategories,
    medios: query.apiMediums,
    search: query.apiSearch,
  });
  const list = listResult.ok
    ? listResult.data
    : fallbackWorksList({ query, hideCategoryFilters, hideMediumFilters });

  const appliedFilters: DearteenlineaAppliedArtworkFilters = {
    search: list.appliedFilters.search || query.apiSearch,
    categorias: hideCategoryFilters ? [] : list.appliedFilters.categorias,
    medios: hideMediumFilters ? [] : list.appliedFilters.medios,
  };
  const pagination: DearteenlineaObrasPagination = list.pagination;

  return (
    <DearteArtworkResults
      artworks={list.artworks}
      artists={list.artists}
      pagination={pagination}
      appliedFilters={appliedFilters}
      basePath="/dearteenlinea"
      catalogPath={catalogPath}
      hideCategoryFilters={hideCategoryFilters}
      hideMediumFilters={hideMediumFilters}
    />
  );
}

export async function DearteenlineaObrasCatalogPage({
  searchParams,
  routeCategory,
  routeMedium,
  catalogPath = "/dearteenlinea/obras",
  hideCategoryFilters = false,
  hideMediumFilters = false,
  fallbackInitialCategoria,
  fallbackInitialMedio,
}: DearteenlineaObrasCatalogPageProps) {
  const sp = await searchParams;
  const queryCategories = parseCsvParams(sp.categoria, sp.categorias);
  const queryMediums = parseCsvParams(sp.medios);
  const apiCategories = routeCategory
    ? [routeCategory]
    : normalizeCategoryParams(queryCategories);
  const apiMediums = routeMedium ? [routeMedium] : queryMediums;
  const apiSearch = firstParam(sp.search)?.trim() ?? "";
  const apiPage = parsePageParam(sp.page);
  const initialCategoria =
    fallbackInitialCategoria ?? firstCategoryId(queryCategories);
  const initialMedio =
    fallbackInitialMedio ?? firstMediumLabel(parseCsvParams(sp.medios, sp.medio));
  const query: CatalogQuery = {
    apiCategories,
    apiMediums,
    apiSearch,
    apiPage,
    initialCategoria,
    initialMedio,
  };
  const searchKey = catalogSearchKey(query);
  const clearPath = "/dearteenlinea/obras";

  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
              <div className="min-w-0 shrink">{obrasTitle()}</div>
              <DearteArtworkSearch
                key={`dearte-obras-search-${searchKey}`}
                searchValue={apiSearch}
                selectedCategories={hideCategoryFilters ? [] : apiCategories}
                selectedMediums={hideMediumFilters ? [] : apiMediums}
                catalogPath={catalogPath}
                hideCategoryFilters={hideCategoryFilters}
                hideMediumFilters={hideMediumFilters}
              />
            </div>

            <div className="lg:flex lg:items-start lg:gap-8">
              <Suspense fallback={<FiltersSkeleton />}>
                <DearteArtworkFiltersSection
                  query={query}
                  catalogPath={catalogPath}
                  clearPath={clearPath}
                  hideCategoryFilters={hideCategoryFilters}
                  hideMediumFilters={hideMediumFilters}
                />
              </Suspense>
              <Suspense key={searchKey} fallback={<WorksGridSkeleton />}>
                <DearteWorksListSection
                  query={query}
                  catalogPath={catalogPath}
                  hideCategoryFilters={hideCategoryFilters}
                  hideMediumFilters={hideMediumFilters}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
