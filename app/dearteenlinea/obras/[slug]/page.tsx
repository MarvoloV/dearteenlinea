import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArtworkDetail } from "@/components/artwork-detail";
import { FlowHeader } from "@/components/flow-header";
import { artistFullName } from "@/lib/artist-utils";
import { mockArtistsDearteenlinea } from "@/lib/mock-artists";
import { mockArtworksDearteenlinea } from "@/lib/mock-artworks-dearteenlinea";
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
  const artwork = artworkBySlug(mockArtworksDearteenlinea, slug);
  if (!artwork) {
    return { title: "Obra" };
  }
  const artist = artistBySlug(mockArtistsDearteenlinea, artwork.artistSlug);
  const name = artist ? artistFullName(artist) : "Artista";
  const desc =
    artwork.description?.slice(0, 160) ??
    `${artwork.title} · ${name} · dearteenlinea`;
  return {
    title: `${artwork.title} · ${name} | dearteenlinea`,
    description: desc,
  };
}

export default async function DearteenlineaObraPage({ params }: PageProps) {
  const { slug } = await params;
  const artwork = artworkBySlug(mockArtworksDearteenlinea, slug);
  if (!artwork) notFound();

  const artist = artistBySlug(mockArtistsDearteenlinea, artwork.artistSlug);
  if (!artist) notFound();

  const relatedByMedium = otherArtworksSameMedium(mockArtworksDearteenlinea, {
    slug: artwork.slug,
    medium: artwork.medium,
  });
  const relatedByArtistRaw = otherArtworksSameArtist(
    mockArtworksDearteenlinea,
    {
      slug: artwork.slug,
      artistSlug: artwork.artistSlug,
    },
  );
  const relatedByArtist = relatedByArtistRaw.filter(
    (a) => !relatedByMedium.some((m) => m.slug === a.slug),
  );

  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <ArtworkDetail
            artwork={artwork}
            artist={artist}
            artists={mockArtistsDearteenlinea}
            relatedByMedium={relatedByMedium}
            relatedByArtist={relatedByArtist}
            basePath="/dearteenlinea"
            flow="dearteenlinea"
          />
        </div>
      </main>
    </>
  );
}
