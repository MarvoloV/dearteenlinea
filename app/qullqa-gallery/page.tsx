import { FlowHeader } from "@/components/flow-header";
import { FlowHeroBanner } from "@/components/flow-hero-banner";
import { HomeExploreByMediumSection } from "@/components/home-explore-medium-section";
import { HomeLatestArtworksSection } from "@/components/home-latest-artworks-section";
import { QullqaProductsSection } from "@/components/qullqa-products-section";
import { flowHeroImages } from "@/lib/flow-hero-assets";
import { fetchQullqaGalleryHome } from "@/lib/qullqa-gallery-api";

export default async function QullqaGalleryPage() {
  const home = await fetchQullqaGalleryHome();

  return (
    <>
      <FlowHeader variant="qullqa-gallery" />
      <main className="flex flex-1 flex-col">
        <FlowHeroBanner
          imagePriority
          imageSrc={flowHeroImages.qullqaGallery}
          imageAlt="Espacio creativo y materiales de arte"
          title={
            <span className="text-2xl font-medium leading-snug tracking-tight text-white [font-family:var(--font-manrope)] normal-case md:text-3xl">
              qullqa gallery
            </span>
          }
          description="Espacio público donde los artistas que usan Qullqa pueden mostrar obras a cualquier visitante. Qullqa es también la plataforma con la que artistas y coleccionistas gestionan y dan valor a sus piezas."
          cta={{ label: "Ir a qullqa", href: "https://qulqa.art" }}
        />
        <div className="flex flex-col gap-10 pb-12 pt-8 md:gap-12 md:pb-16 md:pt-10">
          {home.ok ? (
            <>
              <HomeLatestArtworksSection
                artworks={home.data.latestArtworks}
                artists={home.data.latestArtists}
                basePath="/qullqa-gallery"
                flow="qullqa-gallery"
                variant="violet"
              />
              <HomeExploreByMediumSection
                flow="qullqa-gallery"
                basePath="/qullqa-gallery"
                variant="rose"
                mediums={home.data.mediums}
                queryParamName="medium"
              />
            </>
          ) : (
            <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
              <p className="rounded-lg border border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground [font-family:var(--font-manrope)]">
                No se pudieron cargar las obras públicas de qullqa gallery.
              </p>
            </section>
          )}
          <QullqaProductsSection />
        </div>
      </main>
    </>
  );
}
