import type { Artwork } from "@/lib/types/artwork";

export type ArtworkMediaItem = { type: "image" | "video"; url: string };

/** Mismo orden que en las tarjetas: todas las imágenes y luego todos los vídeos. */
export function mediaItemsFromArtwork(artwork: Artwork): ArtworkMediaItem[] {
  return [
    ...artwork.imageUrls.map((url) => ({ type: "image" as const, url })),
    ...artwork.videoUrls.map((url) => ({ type: "video" as const, url })),
  ];
}
