import { HomeArtworkRail } from "@/components/home-artwork-rail";
import { HomeSectionHeader } from "@/components/home-section-header";
import {
  HomePastelSection,
  type HomePastelVariant,
} from "@/components/home-pastel-section";
import type { Artist } from "@/lib/types/artist";
import type { Artwork, ArtworkDearteCategory } from "@/lib/types/artwork";
import type { ReactNode } from "react";

function categoryTitleArtistic(category: ArtworkDearteCategory): ReactNode {
  switch (category) {
    case "mercado_secundario":
      return (
        <>
          <span className="block font-light italic leading-tight text-foreground/85 md:inline">
            Obras de artistas de
          </span>{" "}
          <span className="font-semibold not-italic tracking-wide">
            mercado secundario
          </span>
        </>
      );
    case "consolidados":
      return (
        <>
          <span className="block font-light italic leading-tight text-foreground/85 md:inline">
            Obras de artistas
          </span>{" "}
          <span className="font-semibold not-italic tracking-wide">
            consolidados
          </span>
        </>
      );
    case "emergentes":
      return (
        <>
          <span className="block font-light italic leading-tight text-foreground/85 md:inline">
            Obras de artistas
          </span>{" "}
          <span className="font-semibold not-italic tracking-wide">
            emergentes
          </span>
        </>
      );
  }
}

type HomeDearteCategorySectionProps = {
  category: ArtworkDearteCategory;
  artworks: Artwork[];
  artists: Artist[];
  variant: HomePastelVariant;
};

export function HomeDearteCategorySection({
  category,
  artworks,
  artists,
  variant,
}: HomeDearteCategorySectionProps) {
  if (artworks.length === 0) return null;

  return (
    <HomePastelSection variant={variant}>
      <HomeSectionHeader
        title={categoryTitleArtistic(category)}
        titleSize="display"
        action={{
          label: "Ver todas",
          href: `/dearteenlinea/obras?categoria=${category}`,
        }}
      />
      <HomeArtworkRail
        artworks={artworks}
        artists={artists}
        basePath="/dearteenlinea"
      />
    </HomePastelSection>
  );
}
