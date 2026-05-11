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
import {
  buildArtworkJsonLd,
  buildSeoMetadata,
  serializeJsonLd,
} from "@/lib/seo";

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
    return buildSeoMetadata({
      title: "Obra | De Arte en Línea",
      description: "Ficha de obra en De Arte en Línea.",
      path: `/dearteenlinea/obras/${slug}`,
    });
  }
  const name = data.artist ? artistFullName(data.artist) : "";
  const fallbackDescription = `${data.artwork.title}${name ? ` de ${name}` : ""}${data.artwork.medium ? `, ${data.artwork.medium}` : ""}${data.artwork.dimensions ? `, ${data.artwork.dimensions}` : ""}`;
  const desc =
    dearteenlineaArtworkMetadataDescription(data.artwork) ??
    `${fallbackDescription}.`;

  return buildSeoMetadata({
    title: name
      ? `${data.artwork.title} | ${name} | De Arte en Línea`
      : `${data.artwork.title} | De Arte en Línea`,
    description: desc,
    path: `/dearteenlinea/obras/${data.artwork.slug}`,
    image: data.artwork.imageUrls[0],
    imageAlt: data.artwork.title,
    type: "article",
  });
}

export default async function DearteenlineaObraPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await resolveArtworkPageData(slug);
  if (!data) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            buildArtworkJsonLd({
              artwork: data.artwork,
              artist: data.artist,
              path: `/dearteenlinea/obras/${data.artwork.slug}`,
            }),
          ),
        }}
      />
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
