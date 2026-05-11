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
import {
  buildArtistJsonLd,
  buildSeoMetadata,
  serializeJsonLd,
} from "@/lib/seo";

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
    return buildSeoMetadata({
      title: "Artista | De Arte en Línea",
      description: "Ficha de artista en De Arte en Línea.",
      path: `/dearteenlinea/artistas/${slug}`,
    });
  }
  const name = artistFullName(data.artist);
  const description = dearteenlineaArtistMetadataDescription(data.artist);
  return buildSeoMetadata({
    title: `${name} | De Arte en Línea`,
    description: description ?? `Ficha de ${name} en De Arte en Línea.`,
    path: `/dearteenlinea/artistas/${data.artist.slug}`,
    image: data.artist.imageUrl,
    imageAlt: name,
    type: "profile",
  });
}

export default async function DearteenlineaArtistPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await resolveArtistPageData(slug);
  if (!data) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            buildArtistJsonLd({
              artist: data.artist,
              path: `/dearteenlinea/artistas/${data.artist.slug}`,
            }),
          ),
        }}
      />
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
