import { DearteenlineaLogo } from "@/components/dearteenlinea-logo";
import { HomeDearteCategorySection } from "@/components/home-dearte-category-section";
import { HomeExploreByMediumSection } from "@/components/home-explore-medium-section";
import { HomeLatestArtworksSection } from "@/components/home-latest-artworks-section";
import { FlowHeader } from "@/components/flow-header";
import { FlowHeroBanner } from "@/components/flow-hero-banner";
import { flowHeroImages } from "@/lib/flow-hero-assets";
import { mockArtistsDearteenlinea } from "@/lib/mock-artists";
import { mockArtworksDearteenlinea } from "@/lib/mock-artworks-dearteenlinea";
import { latestArtworks } from "@/lib/artwork-utils";

export default function DearteenlineaPage() {
  const latest = latestArtworks(mockArtworksDearteenlinea, 5);

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
            artists={mockArtistsDearteenlinea}
            basePath="/dearteenlinea"
            flow="dearteenlinea"
            variant="violet"
          />
          <HomeExploreByMediumSection
            flow="dearteenlinea"
            basePath="/dearteenlinea"
            variant="rose"
          />
          <HomeDearteCategorySection
            category="mercado_secundario"
            allArtworks={mockArtworksDearteenlinea}
            artists={mockArtistsDearteenlinea}
            variant="teal"
          />
          <HomeDearteCategorySection
            category="consolidados"
            allArtworks={mockArtworksDearteenlinea}
            artists={mockArtistsDearteenlinea}
            variant="amber"
          />
          <HomeDearteCategorySection
            category="emergentes"
            allArtworks={mockArtworksDearteenlinea}
            artists={mockArtistsDearteenlinea}
            variant="sky"
          />
        </div>
      </main>
    </>
  );
}
