import { ArtworkCatalog } from "@/components/artwork-catalog";
import { FlowHeader } from "@/components/flow-header";
import { parseCategoriaParam, parseMedioParam } from "@/lib/artwork-catalog-url";
import { mockArtistsDearteenlinea } from "@/lib/mock-artists";
import { mockArtworksDearteenlinea } from "@/lib/mock-artworks-dearteenlinea";
import { mediumsDearteenlinea } from "@/lib/artwork-taxonomy";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DearteenlineaObrasPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const initialMedio = parseMedioParam(sp.medio, mediumsDearteenlinea);
  const initialCategoria = parseCategoriaParam(sp.categoria);

  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
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
        </div>
      </main>
    </>
  );
}
