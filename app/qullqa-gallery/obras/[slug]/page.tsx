import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArtworkDetail } from "@/components/artwork-detail";
import { FlowHeader } from "@/components/flow-header";
import { artistFullName } from "@/lib/artist-utils";
import { fetchQullqaGalleryArtworkDetail } from "@/lib/qullqa-gallery-api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await fetchQullqaGalleryArtworkDetail(slug);
  if (!detail.ok) {
    return { title: "Obra" };
  }
  const { artwork, artist } = detail.data;
  const name = artistFullName(artist);
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
  const detail = await fetchQullqaGalleryArtworkDetail(slug);
  if (!detail.ok && detail.notFound) notFound();

  return (
    <>
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
