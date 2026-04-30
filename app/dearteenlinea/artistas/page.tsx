import { ArtistCatalog } from "@/components/artist-catalog";
import { FlowHeader } from "@/components/flow-header";
import { mockArtistsDearteenlinea } from "@/lib/mock-artists";

export default function DearteenlineaArtistasPage() {
  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <ArtistCatalog
            title={
              <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                Artistas curados
              </h1>
            }
            artists={mockArtistsDearteenlinea}
            basePath="/dearteenlinea"
          />
        </div>
      </main>
    </>
  );
}
