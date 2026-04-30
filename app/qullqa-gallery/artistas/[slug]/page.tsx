import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArtistDetail } from "@/components/artist-detail";
import { FlowHeader } from "@/components/flow-header";
import { mockArtistsQullqaGallery } from "@/lib/mock-artists";
import { mockArtworksQullqaGallery } from "@/lib/mock-artworks-qullqa-gallery";
import {
  artistBySlugFromList,
  artistFullName,
  artworksByArtistSlug,
} from "@/lib/artist-utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = artistBySlugFromList(mockArtistsQullqaGallery, slug);
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
  const artist = artistBySlugFromList(mockArtistsQullqaGallery, slug);
  if (!artist) notFound();

  const artworks = artworksByArtistSlug(mockArtworksQullqaGallery, slug);

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
