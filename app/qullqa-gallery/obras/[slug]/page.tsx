import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArtworkDetail } from "@/components/artwork-detail";
import { FlowHeader } from "@/components/flow-header";
import { artistFullName } from "@/lib/artist-utils";
import { fetchQullqaGalleryArtworkDetail } from "@/lib/qullqa-gallery-api";
import {
  buildArtworkJsonLd,
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
  const detail = await fetchQullqaGalleryArtworkDetail(slug);
  if (!detail.ok) {
    return buildSeoMetadata({
      title: "Obra | Qullqa Gallery",
      description: "Ficha de obra en Qullqa Gallery.",
      path: `/qullqa-gallery/obras/${slug}`,
      siteName: "Qullqa Gallery",
    });
  }
  const { artwork, artist } = detail.data;
  const name = artistFullName(artist);
  const fallbackDescription = `${artwork.title}${name ? ` de ${name}` : ""}${artwork.medium ? `, ${artwork.medium}` : ""}${artwork.dimensions ? `, ${artwork.dimensions}` : ""}`;
  const desc = artwork.description ?? `${fallbackDescription}.`;

  return buildSeoMetadata({
    title: `${artwork.title} | ${name} | Qullqa Gallery`,
    description: desc,
    path: `/qullqa-gallery/obras/${artwork.slug}`,
    image: artwork.imageUrls[0],
    imageAlt: artwork.title,
    siteName: "Qullqa Gallery",
    type: "article",
  });
}

export default async function QullqaGalleryObraPage({ params }: PageProps) {
  const { slug } = await params;
  const detail = await fetchQullqaGalleryArtworkDetail(slug);
  if (!detail.ok && detail.notFound) notFound();

  return (
    <>
      {detail.ok ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(
              buildArtworkJsonLd({
                artwork: detail.data.artwork,
                artist: detail.data.artist,
                path: `/qullqa-gallery/obras/${detail.data.artwork.slug}`,
                artistPathBase: "/qullqa-gallery/artistas",
              }),
            ),
          }}
        />
      ) : null}
      <FlowHeader variant="qullqa-gallery" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          {detail.ok ? (
            <ArtworkDetail
              artwork={detail.data.artwork}
              artist={detail.data.artist}
              artists={detail.data.artists}
              relatedByMedium={detail.data.relatedByMedium}
              relatedByArtist={detail.data.relatedByArtist}
              basePath="/qullqa-gallery"
              flow="qullqa-gallery"
            />
          ) : (
            <div className="space-y-6 [font-family:var(--font-manrope)]">
              <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                Obra
              </h1>
              <p className="rounded-lg border border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
                No se pudo cargar esta obra pública de qullqa gallery.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
