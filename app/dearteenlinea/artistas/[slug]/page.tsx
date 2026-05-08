import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArtistDetail } from "@/components/artist-detail";
import { FlowHeader } from "@/components/flow-header";
import {
  dearteenlineaArtistMetadataDescription,
  fetchDearteenlineaArtistDetail,
} from "@/lib/dearteenlinea-api";
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

async function resolveArtistPageData(slug: string) {
  const detail = await fetchDearteenlineaArtistDetail(slug);
  if (detail.ok) return detail.data;

  const artist = artistBySlugFromList(mockArtistsDearteenlinea, slug);
  if (!artist) return null;

  return {
    artist,
    artworks: artworksByArtistSlug(mockArtworksDearteenlinea, slug),
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await resolveArtistPageData(slug);
  if (!data) {
    return { title: "Artista" };
  }
  const name = artistFullName(data.artist);
  const description = dearteenlineaArtistMetadataDescription(data.artist);
  return {
    title: `${name} | dearteenlinea`,
    description: description?.slice(0, 160) ?? `Ficha de ${name} en dearteenlinea.`,
  };
}

export default async function DearteenlineaArtistPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await resolveArtistPageData(slug);
  if (!data) notFound();

  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <ArtistDetail
            artist={data.artist}
            artworks={data.artworks}
            basePath="/dearteenlinea"
            flow="dearteenlinea"
          />
        </div>
      </main>
    </>
  );
}
