import { ArtworkCatalog } from "@/components/artwork-catalog";
import { DearteArtworkCatalog } from "@/components/dearte-artwork-catalog";
import { FlowHeader } from "@/components/flow-header";
import {
  dearteCategoryApiSlugFromFilterValue,
  dearteCategoryIdFromSlug,
  deartePathSlug,
} from "@/lib/dearte-filter-slugs";
import { fetchDearteenlineaObrasCatalog } from "@/lib/dearteenlinea-api";
import { mediumsDearteenlinea } from "@/lib/artwork-taxonomy";
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
  const catalog = await fetchDearteenlineaObrasCatalog({
    page: apiPage,
    perPage: 9,
    categorias: apiCategories,
    medios: apiMediums,
    search: apiSearch,
  });

  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          {catalog.ok ? (
            <DearteArtworkCatalog
              key={`dearte-obras-${catalogPath}-${apiPage}-${apiSearch}-${apiCategories.join(",")}-${apiMediums.join(",")}`}
              title={
                <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                  Obras curadas
                </h1>
              }
              artworks={catalog.data.artworks}
              artists={catalog.data.artists}
              categories={catalog.data.categories}
              mediums={catalog.data.mediums}
              pagination={catalog.data.pagination}
              appliedFilters={catalog.data.appliedFilters}
              basePath="/dearteenlinea"
              catalogPath={catalogPath}
              clearPath="/dearteenlinea/obras"
              hideCategoryFilters={hideCategoryFilters}
              hideMediumFilters={hideMediumFilters}
            />
          ) : (
            <ArtworkCatalog
              title={
                <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                  Obras curadas
                </h1>
              }
              artworks={mockArtworksDearteenlinea}
              artists={mockArtistsDearteenlinea}
              basePath="/dearteenlinea"
              flow="dearteenlinea"
              initialMedio={initialMedio}
              initialCategoria={initialCategoria}
              clearPath="/dearteenlinea/obras"
              hideCategoryFilters={hideCategoryFilters}
              hideMediumFilters={hideMediumFilters}
            />
          )}
        </div>
      </main>
    </>
  );
}

