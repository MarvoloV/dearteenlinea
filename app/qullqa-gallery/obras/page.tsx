import { ArtworkCatalog } from "@/components/artwork-catalog";
import { FlowHeader } from "@/components/flow-header";
import { parseMedioParam } from "@/lib/artwork-catalog-url";
import { mockArtistsQullqaGallery } from "@/lib/mock-artists";
import { mockArtworksQullqaGallery } from "@/lib/mock-artworks-qullqa-gallery";
import { mediumsQullqaGallery } from "@/lib/artwork-taxonomy";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function QullqaGalleryObrasPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const initialMedio = parseMedioParam(sp.medio, mediumsQullqaGallery);

  return (
    <>
      <FlowHeader variant="qullqa-gallery" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <ArtworkCatalog
            title={
              <h1 className="text-2xl font-medium tracking-tight text-foreground [font-family:var(--font-manrope)] md:text-3xl">
                Obras qullqa
              </h1>
            }
            artworks={mockArtworksQullqaGallery}
            artists={mockArtistsQullqaGallery}
            basePath="/qullqa-gallery"
            flow="qullqa-gallery"
            nameClassName="[font-family:var(--font-manrope)]"
            searchInputClassName="[font-family:var(--font-manrope)]"
            initialMedio={initialMedio}
          />
        </div>
      </main>
    </>
  );
}
