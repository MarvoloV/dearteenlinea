import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArtistDetail } from "@/components/artist-detail";
import { FlowHeader } from "@/components/flow-header";
import {
  artistBySlugFromList,
  artistFullName,
  artworksByArtistSlug,
} from "@/lib/artist-utils";
import { fetchQullqaGallerySearchIndex } from "@/lib/qullqa-gallery-api";
import {
  buildArtistJsonLd,
  buildSeoMetadata,
  serializeJsonLd,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const index = await fetchQullqaGallerySearchIndex();
  if (!index.ok) {
    return buildSeoMetadata({
      title: "Artista | Qullqa Gallery",
      description: "Ficha de artista en Qullqa Gallery.",
      path: `/qullqa-gallery/artistas/${slug}`,
      siteName: "Qullqa Gallery",
    });
  }
  const artist = artistBySlugFromList(index.data.artists, slug);
  if (!artist) {
    return buildSeoMetadata({
      title: "Artista | Qullqa Gallery",
      description: "Ficha de artista en Qullqa Gallery.",
      path: `/qullqa-gallery/artistas/${slug}`,
      siteName: "Qullqa Gallery",
    });
  }
  const name = artistFullName(artist);
  return buildSeoMetadata({
    title: `${name} | Qullqa Gallery`,
    description:
      artist.description ?? `Ficha de ${name} en Qullqa Gallery.`,
    path: `/qullqa-gallery/artistas/${artist.slug}`,
    image: artist.imageUrl,
    imageAlt: name,
    siteName: "Qullqa Gallery",
    type: "profile",
  });
}

export default async function QullqaGalleryArtistPage({ params }: PageProps) {
  const { slug } = await params;
  const index = await fetchQullqaGallerySearchIndex();
  if (!index.ok) {
    return (
      <>
        <FlowHeader variant="qullqa-gallery" />
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
            <div className="space-y-6 [font-family:var(--font-manrope)]">
              <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                Artista
              </h1>
              <p className="rounded-lg border border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
                No se pudo cargar este artista de qullqa gallery.
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  const artist = artistBySlugFromList(index.data.artists, slug);
  if (!artist) notFound();

  const artworks = artworksByArtistSlug(index.data.artworks, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            buildArtistJsonLd({
              artist,
              path: `/qullqa-gallery/artistas/${artist.slug}`,
            }),
          ),
        }}
      />
      <FlowHeader variant="qullqa-gallery" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <ArtistDetail
            artist={artist}
            artworks={artworks}
            basePath="/qullqa-gallery"
            flow="qullqa-gallery"
          />
        </div>
      </main>
    </>
  );
}
