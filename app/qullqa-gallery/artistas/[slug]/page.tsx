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

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const index = await fetchQullqaGallerySearchIndex();
  if (!index.ok) {
    return { title: "Artista" };
  }
  const artist = artistBySlugFromList(index.data.artists, slug);
  if (!artist) {
    return { title: "Artista" };
  }
  const name = artistFullName(artist);
  return {
    title: `${name} | qullqa gallery`,
    description:
      artist.description?.slice(0, 160) ??
      `Ficha de ${name} en qullqa gallery.`,
  };
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
