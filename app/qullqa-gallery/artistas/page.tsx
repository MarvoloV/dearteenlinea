import { ArtistCatalog } from "@/components/artist-catalog";
import { FlowHeader } from "@/components/flow-header";
import { fetchQullqaGallerySearchIndex } from "@/lib/qullqa-gallery-api";

export default async function QullqaGalleryArtistasPage() {
  const index = await fetchQullqaGallerySearchIndex();
  const title = (
    <h1 className="text-2xl font-medium tracking-tight text-foreground [font-family:var(--font-manrope)] md:text-3xl">
      Artistas qullqa
    </h1>
  );

  return (
    <>
      <FlowHeader variant="qullqa-gallery" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          {index.ok ? (
            <ArtistCatalog
              title={title}
              artists={index.data.artists}
              basePath="/qullqa-gallery"
              nameClassName="[font-family:var(--font-manrope)]"
              searchInputClassName="[font-family:var(--font-manrope)]"
            />
          ) : (
            <div className="space-y-6 [font-family:var(--font-manrope)]">
              {title}
              <p className="rounded-lg border border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
                No se pudieron cargar los artistas de qullqa gallery.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
