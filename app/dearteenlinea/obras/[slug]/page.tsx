import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArtworkDetail } from "@/components/artwork-detail";
import { FlowHeader } from "@/components/flow-header";
import { artistFullName } from "@/lib/artist-utils";
import {
  dearteenlineaArtworkMetadataDescription,
  fetchDearteenlineaArtworkDetail,
} from "@/lib/dearteenlinea-api";
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

async function resolveArtworkPageData(slug: string) {
  const detail = await fetchDearteenlineaArtworkDetail(slug);
  if (detail.ok) return detail.data;

  const artwork = artworkBySlug(mockArtworksDearteenlinea, slug);
  if (!artwork) return null;

  const artist = artistBySlug(mockArtistsDearteenlinea, artwork.artistSlug);
  if (!artist) return null;

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

  return {
    artwork,
    artist,
    artists: mockArtistsDearteenlinea,
    relatedByMedium,
    relatedByArtist,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await resolveArtworkPageData(slug);
  if (!data) {
    return { title: "Obra" };
  }
  const name = data.artist ? artistFullName(data.artist) : "Artista";
  const desc =
    dearteenlineaArtworkMetadataDescription(data.artwork)?.slice(0, 160) ??
    `${data.artwork.title} · ${name} · dearteenlinea`;
  return {
    title: `${data.artwork.title} · ${name} | dearteenlinea`,
    description: desc,
  };
}

export default async function DearteenlineaObraPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await resolveArtworkPageData(slug);
  if (!data) notFound();

  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <ArtworkDetail
            artwork={data.artwork}
            artist={data.artist}
            artists={data.artists}
            relatedByMedium={data.relatedByMedium}
            relatedByArtist={data.relatedByArtist}
            basePath="/dearteenlinea"
            flow="dearteenlinea"
          />
        </div>
      </main>
    </>
  );
}
