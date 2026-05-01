import {
  artistFullName,
  matchesArtistQuery,
  stripDiacritics,
} from "@/lib/artist-utils";
import type { Artist } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";

function matchesArtworkSearch(artwork: Artwork, rawQuery: string): boolean {
  const q = stripDiacritics(rawQuery.trim().toLowerCase());
  if (!q) return false;
  const haystacks = [
    artwork.title,
    artwork.medium,
    artwork.technique,
    artwork.description ?? "",
    artwork.dimensions ?? "",
    artwork.priceLabel ?? "",
  ];
  return haystacks.some((s) =>
    stripDiacritics(String(s).toLowerCase()).includes(q),
  );
}

/** Coincidencia parcial; `q` vacío → lista vacía (la UI muestra el estado inicial). */
export function searchArtistsInFlow(artists: Artist[], rawQuery: string): Artist[] {
  const q = rawQuery.trim();
  if (!q) return [];
  const filtered = artists.filter((a) => matchesArtistQuery(a, q));
  return [...filtered].sort((a, b) =>
    artistFullName(a).localeCompare(artistFullName(b), "es", {
      sensitivity: "base",
    }),
  );
}

export function searchArtworksInFlow(
  artworks: Artwork[],
  rawQuery: string,
): Artwork[] {
  const q = rawQuery.trim();
  if (!q) return [];
  const filtered = artworks.filter((a) => matchesArtworkSearch(a, q));
  return [...filtered].sort((a, b) =>
    a.title.localeCompare(b.title, "es", { sensitivity: "base" }),
  );
}
