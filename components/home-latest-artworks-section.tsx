import { HomeArtworkRail } from "@/components/home-artwork-rail";
import { HomeSectionHeader } from "@/components/home-section-header";
import {
  HomePastelSection,
  type HomePastelVariant,
} from "@/components/home-pastel-section";
import type { HomeFlow } from "@/lib/medium-explore-images";
import type { Artist } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";

type HomeLatestArtworksSectionProps = {
  artworks: Artwork[];
  artists: Artist[];
  basePath: "/dearteenlinea" | "/qullqa-gallery";
  flow: HomeFlow;
  variant: HomePastelVariant;
};

export function HomeLatestArtworksSection({
  artworks,
  artists,
  basePath,
  flow,
  variant,
}: HomeLatestArtworksSectionProps) {
  const manrope = flow === "qullqa-gallery";
  if (artworks.length === 0) return null;

  return (
    <HomePastelSection variant={variant}>
      <HomeSectionHeader
        title={
          <>
            <span className="font-semibold not-italic tracking-tight">
              Últimas
            </span>{" "}
            <span className="italic font-light text-foreground">obras</span>
          </>
        }
        manrope={manrope}
        titleSize="display"
        action={{
          label: "Ver todas las obras",
          href: `${basePath}/obras`,
        }}
      />
      <HomeArtworkRail
        artworks={artworks}
        artists={artists}
        basePath={basePath}
        nameClassName={manrope ? "[font-family:var(--font-manrope)]" : undefined}
      />
    </HomePastelSection>
  );
}
