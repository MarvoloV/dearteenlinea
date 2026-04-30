import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArtworkDetail } from "@/components/artwork-detail";
import { FlowHeader } from "@/components/flow-header";
import { artistFullName } from "@/lib/artist-utils";
import { mockArtistsQullqaGallery } from "@/lib/mock-artists";
import { mockArtworksQullqaGallery } from "@/lib/mock-artworks-qullqa-gallery";
import {
  artistBySlug,
  artworkBySlug,
  otherArtworksSameArtist,
  otherArtworksSameMedium,
} from "@/lib/artwork-utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = artworkBySlug(mockArtworksQullqaGallery, slug);
  if (!artwork) {
    return { title: "Obra" };
  }
  const artist = artistBySlug(mockArtistsQullqaGallery, artwork.artistSlug);
  const name = artist ? artistFullName(artist) : "Artista";
  const desc =
    artwork.description?.slice(0, 160) ??
    `${artwork.title} · ${name} · qullqa gallery`;
  return {
    title: `${artwork.title} · ${name} | qullqa gallery`,
    description: desc,
  };
}

export default async function QullqaGalleryObraPage({ params }: PageProps) {
  const { slug } = await params;
  const artwork = artworkBySlug(mockArtworksQullqaGallery, slug);
  if (!artwork) notFound();

  const artist = artistBySlug(mockArtistsQullqaGallery, artwork.artistSlug);
  if (!artist) notFound();

  const relatedByMedium = otherArtworksSameMedium(mockArtworksQullqaGallery, {
    slug: artwork.slug,
    medium: artwork.medium,
  });
  const relatedByArtistRaw = otherArtworksSameArtist(mockArtworksQullqaGallery, {
    slug: artwork.slug,
    artistSlug: artwork.artistSlug,
  });
  const relatedByArtist = relatedByArtistRaw.filter(
    (a) => !relatedByMedium.some((m) => m.slug === a.slug),
  );

  return (
    <>
      <FlowHeader variant="qullqa-gallery" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <ArtworkDetail
            artwork={artwork}
            artist={artist}
            artists={mockArtistsQullqaGallery}
            relatedByMedium={relatedByMedium}
            relatedByArtist={relatedByArtist}
            basePath="/qullqa-gallery"
            flow="qullqa-gallery"
          />
        </div>
      </main>
    </>
  );
}
