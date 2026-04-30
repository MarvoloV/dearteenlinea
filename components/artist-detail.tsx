import { ExternalLink, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ArtistShareModal } from "@/components/artist-share-modal";
import { ArtworkCard } from "@/components/artwork-card";
import {
  artistFullName,
  artistInitials,
  formatArtistBirthDate,
  formatNationality,
} from "@/lib/artist-utils";
import type { Artist } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";
import { cn } from "@/lib/utils";

export type ArtistDetailFlow = "dearteenlinea" | "qullqa-gallery";

type ArtistDetailProps = {
  artist: Artist;
  artworks: Artwork[];
  basePath: "/dearteenlinea" | "/qullqa-gallery";
  flow: ArtistDetailFlow;
};

function SocialIcon({ name }: { name: string }) {
  if (name === "twitter") {
    return (
      <span className="text-xs font-semibold" aria-hidden>
        𝕏
      </span>
    );
  }
  return <ExternalLink className="size-4" aria-hidden />;
}

export function ArtistDetail({
  artist,
  artworks,
  basePath,
  flow,
}: ArtistDetailProps) {
  const name = artistFullName(artist);
  const manrope =
    flow === "qullqa-gallery" ? "[font-family:var(--font-manrope)]" : undefined;
  const birth = formatArtistBirthDate(artist.birthDate);
  const nation = formatNationality(artist.nationality);
  const metaParts = [nation, birth].filter(Boolean);
  const social = artist.social;

  const socialEntries = social
    ? (["instagram", "facebook", "twitter", "linkedin"] as const)
        .filter((k) => Boolean(social[k]))
        .map((k) => ({ key: k, href: social[k]!, label: k }))
    : [];

  const hasLinks = Boolean(artist.web) || socialEntries.length > 0;

  return (
    <div className="space-y-10 md:space-y-12">
      <div>
        <Link
          href={`${basePath}/artistas`}
          className={cn(
            "inline-flex text-sm font-medium text-muted-foreground transition hover:text-foreground",
            manrope,
          )}
        >
          ← Artistas
        </Link>
      </div>

      <section className="grid gap-8 md:grid-cols-[minmax(0,280px)_1fr] md:items-start md:gap-10 lg:gap-12">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-lg border border-border/80 bg-muted md:mx-0">
          {artist.imageUrl ? (
            <Image
              src={artist.imageUrl}
              alt={`Retrato de ${name}`}
              fill
              unoptimized
              className="object-cover"
              sizes="280px"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
              <span
                className={cn(
                  "text-4xl font-medium text-muted-foreground",
                  manrope,
                )}
              >
                {artistInitials(artist.firstName, artist.lastName)}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <h1
              className={cn(
                "text-2xl font-medium tracking-tight text-foreground md:text-3xl",
                manrope,
              )}
            >
              {name}
            </h1>
            <ArtistShareModal artistName={name} triggerClassName={manrope} />
          </div>

          {metaParts.length > 0 ? (
            <p className={cn("text-sm text-muted-foreground", manrope)}>
              {metaParts.join(" · ")}
            </p>
          ) : null}

          {artist.description ? (
            <p
              className={cn(
                "max-w-prose text-sm leading-relaxed text-muted-foreground md:text-[15px]",
                manrope,
              )}
            >
              {artist.description}
            </p>
          ) : null}

          {hasLinks ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {artist.web ? (
                <a
                  href={artist.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted",
                    manrope,
                  )}
                >
                  <Globe className="size-3.5 shrink-0" aria-hidden />
                  Web
                </a>
              ) : null}
              {socialEntries.map(({ key, href, label }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 py-1.5 text-xs font-medium capitalize text-foreground transition hover:bg-muted",
                    manrope,
                  )}
                >
                  <SocialIcon name={key} />
                  {label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-t border-border/60 pt-10 md:pt-12">
        <h2
          className={cn(
            "mb-6 text-lg font-medium text-foreground md:text-xl",
            manrope,
          )}
        >
          Obras
        </h2>
        {artworks.length === 0 ? (
          <p className={cn("text-sm text-muted-foreground", manrope)}>
            Aún no hay obras listadas para este artista.
          </p>
        ) : (
          <ul className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 xl:gap-5">
            {artworks.map((artwork) => (
              <li
                key={artwork.slug}
                className="flex min-h-0 min-w-0 w-full"
              >
                <ArtworkCard
                  artwork={artwork}
                  artistName={name}
                  href={`${basePath}/obras/${artwork.slug}`}
                  nameClassName={manrope}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
