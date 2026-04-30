import { ArtistCatalog } from "@/components/artist-catalog";
import { FlowHeader } from "@/components/flow-header";
import { mockArtistsQullqaGallery } from "@/lib/mock-artists";

export default function QullqaGalleryArtistasPage() {
  return (
    <>
      <FlowHeader variant="qullqa-gallery" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <ArtistCatalog
            title={
              <h1 className="text-2xl font-medium tracking-tight text-foreground [font-family:var(--font-manrope)] md:text-3xl">
                Artistas qullqa
              </h1>
            }
            artists={mockArtistsQullqaGallery}
            basePath="/qullqa-gallery"
            nameClassName="[font-family:var(--font-manrope)]"
            searchInputClassName="[font-family:var(--font-manrope)]"
          />
        </div>
      </main>
    </>
  );
}
