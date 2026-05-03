import { DearteenlineaLogo } from "@/components/dearteenlinea-logo";
import { HomeDearteCategorySection } from "@/components/home-dearte-category-section";
import { HomeExploreByMediumSection } from "@/components/home-explore-medium-section";
import { HomeLatestArtworksSection } from "@/components/home-latest-artworks-section";
import { FlowHeader } from "@/components/flow-header";
import { FlowHeroBanner } from "@/components/flow-hero-banner";
import {
  fetchDearteenlineaCategoryArtworks,
  fetchDearteenlineaHomeMediums,
  fetchDearteenlineaLatestArtworks,
} from "@/lib/dearteenlinea-api";
import { flowHeroImages } from "@/lib/flow-hero-assets";
import { mockArtistsDearteenlinea } from "@/lib/mock-artists";
import { mockArtworksDearteenlinea } from "@/lib/mock-artworks-dearteenlinea";
import { latestArtworks, latestArtworksInCategory } from "@/lib/artwork-utils";
import type { Artist } from "@/lib/types/artist";
import type { Artwork, ArtworkDearteCategory } from "@/lib/types/artwork";

function fallbackCategoryArtworks(category: ArtworkDearteCategory): {
  artworks: Artwork[];
  artists: Artist[];
} {
  return {
    artworks: latestArtworksInCategory(mockArtworksDearteenlinea, category, 5),
    artists: mockArtistsDearteenlinea,
  };
}

export default async function DearteenlineaPage() {
  const [
    latestFromApi,
    mediumsFromApi,
    mercadoSecundarioFromApi,
    consolidadosFromApi,
    emergentesFromApi,
  ] = await Promise.all([
    fetchDearteenlineaLatestArtworks(5),
    fetchDearteenlineaHomeMediums(),
    fetchDearteenlineaCategoryArtworks("mercado_secundario"),
    fetchDearteenlineaCategoryArtworks("consolidados"),
    fetchDearteenlineaCategoryArtworks("emergentes"),
  ]);
  const latest = latestFromApi.ok
    ? latestFromApi.data.artworks
    : latestArtworks(mockArtworksDearteenlinea, 5);
  const latestArtists = latestFromApi.ok
    ? latestFromApi.data.artists
    : mockArtistsDearteenlinea;
  const homeMediums = mediumsFromApi.ok ? mediumsFromApi.data : undefined;
  const mercadoSecundario = mercadoSecundarioFromApi.ok
    ? mercadoSecundarioFromApi.data
    : fallbackCategoryArtworks("mercado_secundario");
  const consolidados = consolidadosFromApi.ok
    ? consolidadosFromApi.data
    : fallbackCategoryArtworks("consolidados");
  const emergentes = emergentesFromApi.ok
    ? emergentesFromApi.data
    : fallbackCategoryArtworks("emergentes");

  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex flex-1 flex-col">
        <FlowHeroBanner
          imagePriority
          imageSrc={flowHeroImages.dearteenlinea}
          imageAlt="Vista interior de galería con gran obra pictórica"
          title={
            <>
              <span className="sr-only">Galería dearteenlinea</span>
              <DearteenlineaLogo
                priority
                inverted
                className="h-14 w-auto md:h-16 lg:h-[4.25rem]"
              />
            </>
          }
          description="Galería en línea con obras curadas: artistas consolidados, emergentes y mercado secundario. La curaduría de dearteenlinea prioriza la calidad para visitantes y coleccionistas."
        />
        <div className="flex flex-col gap-10 pb-12 pt-8 md:gap-12 md:pb-16 md:pt-10">
          <HomeLatestArtworksSection
            artworks={latest}
            artists={latestArtists}
            basePath="/dearteenlinea"
            flow="dearteenlinea"
            variant="violet"
          />
          <HomeExploreByMediumSection
            flow="dearteenlinea"
            basePath="/dearteenlinea"
            variant="rose"
            mediums={homeMediums}
          />
          <HomeDearteCategorySection
            category="mercado_secundario"
            artworks={mercadoSecundario.artworks}
            artists={mercadoSecundario.artists}
            variant="teal"
          />
          <HomeDearteCategorySection
            category="consolidados"
            artworks={consolidados.artworks}
            artists={consolidados.artists}
            variant="amber"
          />
          <HomeDearteCategorySection
            category="emergentes"
            artworks={emergentes.artworks}
            artists={emergentes.artists}
            variant="sky"
          />
        </div>
      </main>
    </>
  );
}
