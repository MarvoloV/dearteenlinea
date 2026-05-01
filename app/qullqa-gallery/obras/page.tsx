import { FlowHeader } from "@/components/flow-header";
import { QullqaArtworkCatalog } from "@/components/qullqa-artwork-catalog";
import { fetchQullqaGalleryArtworks } from "@/lib/qullqa-gallery-api";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function integerParam(
  value: string | string[] | undefined,
): number | undefined {
  const raw = firstParam(value);
  if (!raw) return undefined;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : undefined;
}

export default async function QullqaGalleryObrasPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const artworks = await fetchQullqaGalleryArtworks({
    q: firstParam(sp.q),
    medium: firstParam(sp.medium),
    page: integerParam(sp.page),
    pageSize: integerParam(sp.pageSize),
  });

  const title = (
    <h1 className="text-2xl font-medium tracking-tight text-foreground [font-family:var(--font-manrope)] md:text-3xl">
      Obras qullqa
    </h1>
  );

  return (
    <>
      <FlowHeader variant="qullqa-gallery" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          {artworks.ok ? (
            <QullqaArtworkCatalog
              title={title}
              artworks={artworks.data.items}
              artists={artworks.data.artists}
              mediums={artworks.data.facets.mediums}
              pagination={artworks.data.pagination}
              appliedFilters={artworks.data.appliedFilters}
              basePath="/qullqa-gallery"
            />
          ) : (
            <div className="space-y-6 [font-family:var(--font-manrope)]">
              {title}
              <p className="rounded-lg border border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
                No se pudieron cargar las obras públicas de qullqa gallery.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
