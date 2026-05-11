import { Suspense, type ReactNode } from "react";

import { DearteenlineaLogo } from "@/components/dearteenlinea-logo";
import { HomeDearteCategorySection } from "@/components/home-dearte-category-section";
import { HomeExploreByMediumSection } from "@/components/home-explore-medium-section";
import { HomeLatestArtworksSection } from "@/components/home-latest-artworks-section";
import { FlowHeader } from "@/components/flow-header";
import { FlowHeroBanner } from "@/components/flow-hero-banner";
import {
  ArtworkCarouselSkeleton,
  MediumsSkeleton,
} from "@/components/loading-skeletons";
import {
  fetchDearteenlineaCategoryArtworks,
  fetchDearteenlineaHomeMediums,
  fetchDearteenlineaLatestArtworks,
} from "@/lib/dearteenlinea-api";
import { flowHeroImages } from "@/lib/flow-hero-assets";
import type { ArtworkDearteCategory } from "@/lib/types/artwork";

const latestTitle = (
  <>
    <span className="font-semibold not-italic tracking-tight">Últimas</span>{" "}
    <span className="italic font-light text-foreground">obras</span>
  </>
);

const mediumTitle = (
  <>
    <span className="italic font-light">Explorar</span>{" "}
    <span className="font-semibold not-italic tracking-wide">por medio</span>
  </>
);

function categoryTitle(category: ArtworkDearteCategory): ReactNode {
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

async function LatestArtworksSection() {
  const latestFromApi = await fetchDearteenlineaLatestArtworks(5);
  if (!latestFromApi.ok) return null;

  return (
    <HomeLatestArtworksSection
      artworks={latestFromApi.data.artworks}
      artists={latestFromApi.data.artists}
      basePath="/dearteenlinea"
      flow="dearteenlinea"
      variant="violet"
    />
  );
}

async function ExploreByMediumSection() {
  const mediumsFromApi = await fetchDearteenlineaHomeMediums();
  if (!mediumsFromApi.ok) return null;

  return (
    <HomeExploreByMediumSection
      flow="dearteenlinea"
      basePath="/dearteenlinea"
      variant="rose"
      mediums={mediumsFromApi.data}
    />
  );
}

async function HomeCategorySection({
  category,
  variant,
}: {
  category: ArtworkDearteCategory;
  variant: "teal" | "amber" | "sky";
}) {
  const categoryFromApi = await fetchDearteenlineaCategoryArtworks(category);
  if (!categoryFromApi.ok) return null;

  return (
    <HomeDearteCategorySection
      category={category}
      artworks={categoryFromApi.data.artworks}
      artists={categoryFromApi.data.artists}
      variant={variant}
    />
  );
}

export default function DearteenlineaPage() {
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
          <Suspense
            fallback={
              <ArtworkCarouselSkeleton
                variant="violet"
                title={latestTitle}
                actionLabel="Ver todas las obras"
              />
            }
          >
            <LatestArtworksSection />
          </Suspense>
          <Suspense
            fallback={<MediumsSkeleton variant="rose" title={mediumTitle} />}
          >
            <ExploreByMediumSection />
          </Suspense>
          <Suspense
            fallback={
              <ArtworkCarouselSkeleton
                variant="teal"
                title={categoryTitle("mercado_secundario")}
              />
            }
          >
            <HomeCategorySection category="mercado_secundario" variant="teal" />
          </Suspense>
          <Suspense
            fallback={
              <ArtworkCarouselSkeleton
                variant="amber"
                title={categoryTitle("consolidados")}
              />
            }
          >
            <HomeCategorySection category="consolidados" variant="amber" />
          </Suspense>
          <Suspense
            fallback={
              <ArtworkCarouselSkeleton
                variant="sky"
                title={categoryTitle("emergentes")}
              />
            }
          >
            <HomeCategorySection category="emergentes" variant="sky" />
          </Suspense>
        </div>
      </main>
    </>
  );
}
