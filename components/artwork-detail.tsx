import Link from "next/link";

import { ArtworkMediaViewer } from "@/components/artwork-media-viewer";
import { ArtworkShareModal } from "@/components/artwork-share-modal";
import { ArtworkCard } from "@/components/artwork-card";
import { DearteenlineaPurchaseInquiryModal } from "@/components/dearteenlinea-purchase-inquiry-modal";
import { QullqaPurchaseContactModal } from "@/components/qullqa-purchase-contact-modal";
import { artistFullName, artistInitials } from "@/lib/artist-utils";
import { artistBySlug } from "@/lib/artwork-utils";
import { dearteCategoryOptions } from "@/lib/artwork-taxonomy";
import type { Artist } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type ArtworkDetailFlow = "dearteenlinea" | "qullqa-gallery";

type ArtworkDetailProps = {
  artwork: Artwork;
  artist: Artist | null;
  /** Lista del flujo para resolver nombres en “Otras obras en {medio}”. */
  artists: Artist[];
  relatedByMedium: Artwork[];
  relatedByArtist: Artwork[];
  basePath: "/dearteenlinea" | "/qullqa-gallery";
  flow: ArtworkDetailFlow;
};

export function ArtworkDetail({
  artwork,
  artist,
  artists,
  relatedByMedium,
  relatedByArtist,
  basePath,
  flow,
}: ArtworkDetailProps) {
  const artistName = artist ? artistFullName(artist) : "Artista";
  const manrope =
    flow === "qullqa-gallery" ? "[font-family:var(--font-manrope)]" : undefined;
  const categoryLabel =
    artwork.categories && artwork.categories.length > 0
      ? artwork.categories.map((category) => category.label).join(" · ")
      : artwork.category
        ? dearteCategoryOptions.find((o) => o.id === artwork.category)?.label
        : null;
  const descriptionHtml = artwork.descriptionHtml?.trim();

  return (
    <div className="space-y-10 md:space-y-12">
      <div>
        <Link
          href={`${basePath}/obras`}
          className={cn(
            "inline-flex text-sm font-medium text-muted-foreground transition hover:text-foreground",
            manrope,
          )}
        >
          ← Obras
        </Link>
      </div>

      <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-start md:gap-10 lg:gap-12">
        <div className="mx-auto w-full max-w-xl md:mx-0 md:max-w-none">
          <ArtworkMediaViewer
            artwork={artwork}
            className="w-full max-w-full rounded-lg border border-border/80"
            imageSizes="(max-width: 768px) 100vw, 45vw"
            enableFullscreen
          />
        </div>

        <div className="min-w-0 space-y-5">
          <h1
            className={cn(
              "text-2xl font-medium tracking-tight text-foreground md:text-3xl",
              manrope,
            )}
          >
            {artwork.title}
          </h1>

          {artist ? (
            <Link
              href={`${basePath}/artistas/${artist.slug}`}
              className={cn(
                "group flex max-w-md items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-2 pr-3 transition hover:border-border hover:bg-muted/35",
                manrope,
              )}
            >
              <div className="relative size-11 shrink-0 overflow-hidden rounded-full border border-border/80 bg-muted">
                {artist.imageUrl ? (
                  <Image
                    src={artist.imageUrl}
                    alt={`Retrato de ${artistName}`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="44px"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10 text-xs font-medium text-muted-foreground">
                    {artistInitials(artist.firstName, artist.lastName)}
                  </div>
                )}
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Artista
                </p>
                <p
                  className={cn(
                    "truncate text-sm font-medium text-foreground group-hover:underline",
                    manrope,
                  )}
                >
                  {artistName}
                </p>
              </div>
            </Link>
          ) : null}

          <dl
            className={cn(
              "grid gap-2 text-sm text-muted-foreground md:text-[15px]",
              manrope,
            )}
          >
            {categoryLabel ? (
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <dt className="font-medium text-foreground/90">Curaduría</dt>
                <dd>{categoryLabel}</dd>
              </div>
            ) : null}
            {artwork.medium ? (
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <dt className="font-medium text-foreground/90">Medio</dt>
                <dd>{artwork.medium}</dd>
              </div>
            ) : null}
            {artwork.technique ? (
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <dt className="font-medium text-foreground/90">Técnica</dt>
                <dd>{artwork.technique}</dd>
              </div>
            ) : null}
            {artwork.year != null ? (
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <dt className="font-medium text-foreground/90">Año</dt>
                <dd>{artwork.year}</dd>
              </div>
            ) : null}
            {artwork.dimensions ? (
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <dt className="font-medium text-foreground/90">Dimensiones</dt>
                <dd>{artwork.dimensions}</dd>
              </div>
            ) : null}
            {artwork.priceLabel ? (
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <dt className="font-medium text-foreground/90">Precio</dt>
                <dd className="text-foreground">{artwork.priceLabel}</dd>
              </div>
            ) : null}
          </dl>

          {descriptionHtml ? (
            <div
              className={cn(
                "max-w-prose text-sm leading-relaxed text-muted-foreground md:text-[15px] [&_p]:mb-3 [&_p:last-child]:mb-0",
                manrope,
              )}
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : artwork.description ? (
            <p
              className={cn(
                "max-w-prose text-sm leading-relaxed text-muted-foreground md:text-[15px]",
                manrope,
              )}
            >
              {artwork.description}
            </p>
          ) : null}

          <div
            className={cn(
              "flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap sm:items-center",
              manrope,
            )}
          >
            {flow === "dearteenlinea" ? (
              <DearteenlineaPurchaseInquiryModal
                artworkTitle={artwork.title}
                artistName={artistName}
                triggerClassName={manrope}
              />
            ) : artist ? (
              <QullqaPurchaseContactModal
                artist={artist}
                artworkTitle={artwork.title}
                artistDisplayName={artistName}
                triggerClassName={manrope}
              />
            ) : null}
            <ArtworkShareModal
              artworkTitle={artwork.title}
              artistName={artistName}
              triggerClassName={manrope}
            />
          </div>
        </div>
      </section>

      {relatedByMedium.length > 0 ? (
        <section className="border-t border-border/60 pt-10 md:pt-12">
          <h2
            className={cn(
              "mb-6 text-lg font-medium text-foreground md:text-xl",
              manrope,
            )}
          >
            Otras obras en {artwork.medium}
          </h2>
          <ul className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-5 xl:gap-5">
            {relatedByMedium.map((a) => (
              <li key={a.slug} className="flex min-h-0 min-w-0 w-full">
                <ArtworkCard
                  artwork={a}
                  artistName={artistNameForSlug(artists, a.artistSlug)}
                  href={`${basePath}/obras/${a.slug}`}
                  nameClassName={manrope}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {relatedByArtist.length > 0 ? (
        <section className="border-t border-border/60 pt-10 md:pt-12">
          <h2
            className={cn(
              "mb-2 text-lg font-medium text-foreground md:text-xl",
              manrope,
            )}
          >
            {artist ? `Otras obras de ${artistName}` : "Otras obras del artista"}
          </h2>
          {artist ? (
            <p className={cn("mb-6 text-sm text-muted-foreground", manrope)}>
              <Link
                href={`${basePath}/artistas/${artist.slug}`}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Ver todas las obras de {artistName}
              </Link>
            </p>
          ) : null}
          <ul className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-5 xl:gap-5">
            {relatedByArtist.map((a) => (
              <li key={a.slug} className="flex min-h-0 min-w-0 w-full">
                <ArtworkCard
                  artwork={a}
                  artistName={artistName}
                  href={`${basePath}/obras/${a.slug}`}
                  nameClassName={manrope}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function artistNameForSlug(artists: Artist[], artistSlug: string): string {
  const a = artistBySlug(artists, artistSlug);
  return a ? artistFullName(a) : "";
}
