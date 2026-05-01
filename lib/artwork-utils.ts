import { stripDiacritics } from "@/lib/artist-utils";
import type { Artist } from "@/lib/types/artist";
import type { Artwork, ArtworkDearteCategory } from "@/lib/types/artwork";
import type { PriceBucketId } from "@/lib/artwork-taxonomy";
import {
  priceSliderDomainMax,
  priceSliderDomainMin,
} from "@/lib/artwork-taxonomy";

export function artistBySlug(
  artists: Artist[],
  slug: string,
): Artist | undefined {
  return artists.find((a) => a.slug === slug);
}

export function artistDisplayName(artist: Artist | undefined): string {
  if (!artist) return "";
  const displayName = artist.displayName?.trim();
  if (displayName) return displayName;
  return `${artist.firstName} ${artist.lastName}`.trim();
}

export function matchesArtworkQuery(
  artwork: Artwork,
  artist: Artist | undefined,
  rawQuery: string,
): boolean {
  const q = stripDiacritics(rawQuery.trim().toLowerCase());
  if (!q) return true;
  const title = stripDiacritics(artwork.title.toLowerCase());
  const medium = stripDiacritics(artwork.medium.toLowerCase());
  const technique = stripDiacritics(artwork.technique.toLowerCase());
  const desc = artwork.description
    ? stripDiacritics(artwork.description.toLowerCase())
    : "";
  const price = artwork.priceLabel
    ? stripDiacritics(artwork.priceLabel.toLowerCase())
    : "";
  const artistName = artist
    ? stripDiacritics(
        `${artist.firstName} ${artist.lastName}`.toLowerCase(),
      )
    : "";
  return (
    title.includes(q) ||
    medium.includes(q) ||
    technique.includes(q) ||
    desc.includes(q) ||
    price.includes(q) ||
    artistName.includes(q)
  );
}

/** `priceMin` / `priceMax` en USD en mocks; sin ambos cuenta como “sin precio” para el filtro. */
export function matchesPriceBucket(
  artwork: Artwork,
  bucket: PriceBucketId,
): boolean {
  if (bucket === "all") return true;
  const min = artwork.priceMin;
  const max = artwork.priceMax;
  const hasNumeric = min != null || max != null;

  if (bucket === "none") {
    return !hasNumeric;
  }

  if (!hasNumeric) return false;

  const lo = min ?? max!;
  const hi = max ?? min!;

  switch (bucket) {
    case "low":
      return hi < 2000;
    case "mid":
      return lo <= 8000 && hi >= 2000;
    case "high":
      return lo >= 8000;
    default:
      return true;
  }
}

/**
 * Filtro por rango USD [filterMin, filterMax]. Rango completo (dominio) = sin filtrar.
 * Sin precio numérico en la obra: solo pasa si el filtro está en rango completo.
 */
export function matchesPriceRangeFilter(
  artwork: Artwork,
  filterMin: number,
  filterMax: number,
): boolean {
  const full =
    filterMin <= priceSliderDomainMin && filterMax >= priceSliderDomainMax;
  if (full) return true;

  const min = artwork.priceMin;
  const max = artwork.priceMax;
  const hasNumeric = min != null || max != null;
  if (!hasNumeric) return false;

  const lo = min ?? max!;
  const hi = max ?? min!;
  return lo <= filterMax && hi >= filterMin;
}

function normalizeMediumKey(medium: string): string {
  return stripDiacritics(medium.trim().toLowerCase());
}

export function artworkBySlug(
  artworks: Artwork[],
  slug: string,
): Artwork | undefined {
  return artworks.find((a) => a.slug === slug);
}

export function otherArtworksSameMedium(
  artworks: Artwork[],
  current: { slug: string; medium: string },
  limit = 5,
): Artwork[] {
  const key = normalizeMediumKey(current.medium);
  return artworks
    .filter(
      (a) =>
        a.slug !== current.slug &&
        normalizeMediumKey(a.medium) === key,
    )
    .slice(0, limit);
}

export function otherArtworksSameArtist(
  artworks: Artwork[],
  current: { slug: string; artistSlug: string },
  limit = 5,
): Artwork[] {
  return artworks
    .filter(
      (a) =>
        a.slug !== current.slug && a.artistSlug === current.artistSlug,
    )
    .slice(0, limit);
}

/** Orden por `addedAt` descendente; sin fecha al final (orden estable del array). */
export function latestArtworks(artworks: Artwork[], limit: number): Artwork[] {
  const scored = artworks.map((a, i) => ({
    a,
    t: a.addedAt ? new Date(a.addedAt).getTime() : Number.NEGATIVE_INFINITY,
    i,
  }));
  scored.sort((x, y) => {
    if (x.t !== y.t) return y.t - x.t;
    return x.i - y.i;
  });
  return scored.slice(0, limit).map((s) => s.a);
}

export function latestArtworksInCategory(
  artworks: Artwork[],
  category: ArtworkDearteCategory,
  limit: number,
): Artwork[] {
  return latestArtworks(
    artworks.filter((a) => a.category === category),
    limit,
  );
}
