import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArtistDetail } from "@/components/artist-detail";
import { FlowHeader } from "@/components/flow-header";
import { mockArtistsDearteenlinea } from "@/lib/mock-artists";
import { mockArtworksDearteenlinea } from "@/lib/mock-artworks-dearteenlinea";
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
  const artist = artistBySlugFromList(mockArtistsDearteenlinea, slug);
  if (!artist) {
    return { title: "Artista" };
  }
  const name = artistFullName(artist);
  return {
    title: `${name} | dearteenlinea`,
    description:
      artist.description?.slice(0, 160) ??
      `Ficha de ${name} en dearteenlinea.`,
  };
}

export default async function DearteenlineaArtistPage({ params }: PageProps) {
  const { slug } = await params;
  const artist = artistBySlugFromList(mockArtistsDearteenlinea, slug);
  if (!artist) notFound();

  const artworks = artworksByArtistSlug(mockArtworksDearteenlinea, slug);

  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <ArtistDetail
            artist={artist}
            artworks={artworks}
            basePath="/dearteenlinea"
            flow="dearteenlinea"
          />
        </div>
      </main>
    </>
  );
}
