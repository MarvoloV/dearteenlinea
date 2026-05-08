import { DearteArtworkCatalog } from "@/components/dearte-artwork-catalog";
import { ArtworkCatalog } from "@/components/artwork-catalog";
import { FlowHeader } from "@/components/flow-header";
import { fetchDearteenlineaObrasCatalog } from "@/lib/dearteenlinea-api";
import { parseCategoriaParam, parseMedioParam } from "@/lib/artwork-catalog-url";
import { mockArtistsDearteenlinea } from "@/lib/mock-artists";
import { mockArtworksDearteenlinea } from "@/lib/mock-artworks-dearteenlinea";
import { mediumsDearteenlinea } from "@/lib/artwork-taxonomy";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseCsvParam(value: string | string[] | undefined): string[] {
  const raw = firstParam(value)?.trim();
  if (!raw) return [];

  return [...new Set(raw.split(",").map((item) => item.trim()).filter(Boolean))];
}

function parsePageParam(value: string | string[] | undefined): number {
  const raw = Number(firstParam(value));
  if (!Number.isFinite(raw) || raw < 1) return 1;
  return Math.trunc(raw);
}

export default async function DearteenlineaObrasPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const apiCategories = parseCsvParam(sp.categorias);
  const apiMediums = parseCsvParam(sp.medios);
  const apiSearch = firstParam(sp.search)?.trim() ?? "";
  const apiPage = parsePageParam(sp.page);
  const initialMedio = parseMedioParam(sp.medio, mediumsDearteenlinea);
  const initialCategoria = parseCategoriaParam(sp.categoria);
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
              key={`dearte-obras-${apiPage}-${apiSearch}-${apiCategories.join(",")}-${apiMediums.join(",")}`}
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
            />
          )}
        </div>
      </main>
    </>
  );
}
