import type { Metadata } from "next";

import { artistFullName } from "@/lib/artist-utils";
import { flowHeroImages } from "@/lib/flow-hero-assets";
import type { Artist } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";

const DEFAULT_SITE_URL = "https://dearteenlinea.com";

export const DEFAULT_SEO_IMAGE = flowHeroImages.dearteenlinea;

export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, "");
}

export function buildCanonical(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(cleanPath, siteUrl()).toString();
}

export function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateMetaDescription(value: string, max = 160): string {
  const clean = stripHtml(value);
  if (clean.length <= max) return clean;

  const sliced = clean.slice(0, max + 1);
  const lastSpace = sliced.lastIndexOf(" ");
  const trimmed = (lastSpace > 120 ? sliced.slice(0, lastSpace) : clean.slice(0, max)).trim();
  return trimmed.replace(/[.,;:!?-]+$/, "") + "...";
}

export function buildSeoMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  siteName = "De Arte en Línea",
  type = "website",
  robots,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string | null;
  siteName?: string;
  type?: "website" | "article" | "profile";
  robots?: Metadata["robots"];
}): Metadata {
  const canonical = buildCanonical(path);
  const metaDescription = truncateMetaDescription(description);
  const seoImage = image?.trim() || DEFAULT_SEO_IMAGE;
  const alt = imageAlt?.trim() || title;

  return {
    title,
    description: metaDescription,
    alternates: {
      canonical,
    },
    robots: robots ?? {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description: metaDescription,
      url: canonical,
      siteName,
      type,
      images: [
        {
          url: seoImage,
          alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: [seoImage],
    },
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildArtistJsonLd({
  artist,
  path,
}: {
  artist: Artist;
  path: string;
}) {
  const description = artist.descriptionHtml
    ? stripHtml(artist.descriptionHtml)
    : artist.description;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artistFullName(artist),
    ...(artist.imageUrl ? { image: artist.imageUrl } : {}),
    ...(description ? { description: truncateMetaDescription(description) } : {}),
    url: buildCanonical(path),
  };
}

export function buildArtworkJsonLd({
  artwork,
  artist,
  path,
  artistPathBase = "/dearteenlinea/artistas",
}: {
  artwork: Artwork;
  artist: Artist | null;
  path: string;
  artistPathBase?: string;
}) {
  const image = artwork.imageUrls[0];

  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    ...(image ? { image } : {}),
    ...(artwork.medium ? { artform: artwork.medium } : {}),
    ...(artwork.technique ? { artworkSurface: artwork.technique } : {}),
    ...(artwork.description
      ? { description: truncateMetaDescription(artwork.description) }
      : {}),
    ...(artwork.dimensions ? { size: artwork.dimensions } : {}),
    ...(artist
      ? {
          creator: {
            "@type": "Person",
            name: artistFullName(artist),
            url: buildCanonical(`${artistPathBase}/${artist.slug}`),
          },
        }
      : {}),
    url: buildCanonical(path),
  };
}
